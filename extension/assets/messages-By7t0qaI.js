import { d as isTypingRefusal, h as parsePcRequest, u as isTextField } from "./native-CHu3H134.js";
//#region src/shared/constants.ts
/** Constants shared by every ob.Pal Link context. Pure: nothing here touches chrome.* or the DOM. */
var APP_NAME = "ob.Pal Link";
/** ob.Pal room service (signaling + TURN credentials). Also the only required host permission. */
var SERVICE = "https://obpal.blackboxes.net";
/** Name of the runtime.connect() port a page bridge opens to the offscreen link. */
var PORT_NAME = "obpal-link/page";
/**
* What the phone drives: the controlled tab (Controller, 3D and Keys go to page frames; index order is the
* wire encoding, InputFrame.m) or the PC itself through the native helper (no page frames at all).
*/
var TARGET_MODES = [
	"gamepad",
	"viewer",
	"keys",
	"pc"
];
var DEFAULT_MODE = "gamepad";
/** The modes that send input frames to page scripts. */
var PAGE_MODES = [
	"gamepad",
	"viewer",
	"keys"
];
var isTargetMode = (v) => typeof v === "string" && TARGET_MODES.includes(v);
/** Visible canvas area (CSS px²) a frame needs before it wins the 3D-viewer role over the top frame. */
var MIN_VIEW_AREA = 19200;
/** Standard-mapping button indices (https://w3c.github.io/gamepad/#remapping). */
var PadButton = {
	A: 0,
	B: 1,
	X: 2,
	Y: 3,
	LB: 4,
	RB: 5,
	LT: 6,
	RT: 7,
	View: 8,
	Menu: 9,
	L3: 10,
	R3: 11,
	Up: 12,
	Down: 13,
	Left: 14,
	Right: 15,
	Guide: 16
};
/** flags: b0 gyro aim is on, b1 tilt steering is on, b2 the Wii-style pointer is on (POINTER packets follow). */
var PadFlag = {
	gyroAim: 1,
	tiltSteer: 2,
	point: 4
};
function decodePad(buf) {
	if (buf.byteLength < 24) return null;
	const dv = new DataView(buf);
	if (dv.getUint8(0) !== 18) return null;
	return {
		flags: dv.getUint8(1),
		seq: dv.getUint16(2, true),
		t: dv.getUint32(4, true),
		buttons: dv.getUint32(8, true),
		axes: [
			dv.getInt16(12, true) / 32767,
			dv.getInt16(14, true) / 32767,
			dv.getInt16(16, true) / 32767,
			dv.getInt16(18, true) / 32767
		],
		triggers: [dv.getUint8(20) / 255, dv.getUint8(21) / 255]
	};
}
/** Packet type from the first byte (0x11 STATE, 0x12 PAD, 0x14 POINTER, …) without decoding. */
var packetType = (buf) => buf.byteLength ? new DataView(buf).getUint8(0) : 0;
//#endregion
//#region src/shared/math.ts
/** Small numeric helpers shared by the key and 3D mappers. Pure. */
var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
/**
* Two-threshold switch: turns on at `press`, and once on stays on until the value drops below `release`.
* Keeps keys from chattering when a stick rests near the threshold.
*/
var hysteresis = (on, value, press, release) => on ? value >= release : value >= press;
/** Stick response: a per-axis deadzone, the rest rescaled to 0..1, then an exponent curve (1 = linear). */
function stickCurve(v, deadzone, expo = 1) {
	const a = Math.abs(v);
	if (!(a > deadzone)) return 0;
	const n = Math.min(1, (a - deadzone) / (1 - deadzone));
	return Math.sign(v) * Math.pow(n, expo);
}
/**
* Sub-pixel accumulator: feeds fractional motion in and hands out whole pixels, keeping the remainder,
* so slow motion still moves (0.4 px per frame becomes 1 px every 2 to 3 frames) and nothing is lost.
*/
var Accum = class {
	r = [0, 0];
	take(dx, dy) {
		this.r[0] += dx;
		this.r[1] += dy;
		const ix = Math.trunc(this.r[0]);
		const iy = Math.trunc(this.r[1]);
		this.r[0] -= ix;
		this.r[1] -= iy;
		return [ix, iy];
	}
	reset() {
		this.r = [0, 0];
	}
};
/** Is standard button `i` held? Triggers (6, 7) also count their analog value. */
function buttonValue(pad, i) {
	const bit = pad.buttons & 1 << i ? 1 : 0;
	if (i === 6) return Math.max(bit, pad.triggers[0]);
	if (i === 7) return Math.max(bit, pad.triggers[1]);
	return bit;
}
//#endregion
//#region src/shared/messages.ts
/**
* Every message ob.Pal Link passes between contexts, with validators. Each receiver parses what it gets
* and drops anything malformed, so a compromised or confused page can do no more than send nothing.
*
*   popup ──runtime──▶ service worker ──runtime──▶ offscreen (Remote, phone link)
*                         │  ▲                        │
*              executeScript  hello                runtime port (60 Hz frames ▼, reports/rumble ▲)
*                         ▼  │                        │
*                   bridge (isolated world) ◀─────────┘
*                         │  ▲  window.postMessage on CHANNEL (same window, origin-checked)
*                         ▼  │
*                   page script (MAIN world): gamepad shim, 3D drags, keys
*
* Pure: no chrome.* or DOM use, so it is unit-tested in node.
*/
var RUMBLE_MAX_MS = 5e3;
var isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
var fin = (v) => typeof v === "number" && Number.isFinite(v);
var within = (v, lo, hi) => fin(v) && v >= lo && v <= hi;
/** Clamp a rumble request to sane ranges: magnitudes 0..1, at most RUMBLE_MAX_MS. Non-numbers are rejected. */
function sanitizeRumble(s, w, ms) {
	if (!fin(s) || !fin(w) || !fin(ms)) return null;
	return {
		t: "rumble",
		s: clamp(s, 0, 1),
		w: clamp(w, 0, 1),
		ms: Math.round(clamp(ms, 0, RUMBLE_MAX_MS))
	};
}
function parseFromPage(x) {
	if (!isObj(x)) return null;
	if (x.t === "rep" && typeof x.focus === "boolean" && within(x.area, 0, 1e9)) return {
		t: "rep",
		focus: x.focus,
		area: Math.round(x.area),
		lock: x.lock === true
	};
	if (x.t === "rumble") return sanitizeRumble(x.s, x.w, x.ms);
	return null;
}
var STATUSES = [
	"starting",
	"ready",
	"connecting",
	"connected",
	"offline"
];
/** Pairing ids are 16 random bytes, base64url. */
var PAIR_ID_RE = /^[A-Za-z0-9_-]{22}$/;
var isPairId = (v) => typeof v === "string" && PAIR_ID_RE.test(v);
function parsePhone(x) {
	if (!isObj(x) || !isPairId(x.id) || typeof x.name !== "string" || x.name.length > 60 || !within(x.at, 0, 0x5af3107a4000)) return null;
	return {
		id: x.id,
		name: x.name,
		at: x.at
	};
}
function parseLink(x) {
	if (!isObj(x) || !STATUSES.includes(x.status) || typeof x.url !== "string") return null;
	if (x.url !== "" && (!x.url.startsWith(`https://obpal.blackboxes.net/p/#1.`) || x.url.length > 512)) return null;
	if (x.device !== null && (typeof x.device !== "string" || x.device.length > 60)) return null;
	const lan = x.lan ?? "";
	if (typeof lan !== "string" || lan !== "" && (!lan.startsWith(`https://obpal.blackboxes.net/p/#2.`) || lan.length > 1024)) return null;
	const lanFor = x.lanFor ?? null;
	if (lanFor !== null && !isPairId(lanFor)) return null;
	const rawPairs = x.pairs ?? [];
	if (!Array.isArray(rawPairs) || rawPairs.length > 32) return null;
	const pairs = rawPairs.map(parsePhone);
	if (pairs.some((p) => !p)) return null;
	return {
		status: x.status,
		url: x.url,
		device: x.device,
		lan,
		lanFor,
		pairs
	};
}
function parseBgRequest(x) {
	if (!isObj(x) || x.to !== "bg") return null;
	if (typeof x.type === "string" && x.type.startsWith("pc-")) return parsePcRequest(x);
	switch (x.type) {
		case "ensure":
		case "version":
		case "unpair":
		case "offscreen-ready":
		case "hello":
		case "rescan":
		case "diag": return {
			to: "bg",
			type: x.type
		};
		case "forget":
		case "lan": return isPairId(x.id) ? {
			to: "bg",
			type: x.type,
			id: x.id
		} : null;
		case "enable": return Number.isInteger(x.tabId) && within(x.tabId, 0, 2 ** 31) && typeof x.on === "boolean" ? {
			to: "bg",
			type: "enable",
			tabId: x.tabId,
			on: x.on
		} : null;
		case "mode": return isTargetMode(x.mode) ? {
			to: "bg",
			type: "mode",
			mode: x.mode
		} : null;
		case "frames": return Number.isInteger(x.count) && within(x.count, 0, 1e3) && typeof x.host === "string" && x.host.length <= 253 && /^[A-Za-z0-9.:[\]-]*$/.test(x.host) && typeof x.big === "boolean" ? {
			to: "bg",
			type: "frames",
			count: x.count,
			host: x.host,
			big: x.big
		} : null;
		case "link": {
			const link = parseLink(x.link);
			return link ? {
				to: "bg",
				type: "link",
				link
			} : null;
		}
	}
	return null;
}
function parseOffscreenRequest(x) {
	if (!isObj(x) || x.to !== "offscreen") return null;
	if (x.type === "unpair" || x.type === "diag") return {
		to: "offscreen",
		type: x.type
	};
	if (x.type === "forget" || x.type === "lan") return isPairId(x.id) ? {
		to: "offscreen",
		type: x.type,
		id: x.id
	} : null;
	if (x.type === "text-field") return x.field === null || isTextField(x.field) ? {
		to: "offscreen",
		type: "text-field",
		field: x.field
	} : null;
	if (x.type === "typing") return isTypingRefusal(x.refused) ? {
		to: "offscreen",
		type: "typing",
		refused: x.refused
	} : null;
	const cfg = parseConfig(x);
	return x.type === "config" && cfg ? {
		to: "offscreen",
		type: "config",
		...cfg
	} : null;
}
/** The link config from the worker's state: the whole PC counts only while the PC is the target. */
var linkConfig = (tabId, mode, wholePc) => ({
	tabId,
	mode,
	desktop: mode === "pc" && wholePc
});
/** A link config as received ('config', or the answer to 'offscreen-ready'): the whole PC only when it says so. */
function parseConfig(x) {
	if (!isObj(x) || !isTargetMode(x.mode)) return null;
	if (x.tabId !== null && !(Number.isInteger(x.tabId) && within(x.tabId, 0, 2 ** 31))) return null;
	return {
		tabId: x.tabId,
		mode: x.mode,
		desktop: x.desktop === true
	};
}
function senderKind(s, self) {
	if (s.id !== self.id) return "unknown";
	if (s.url?.startsWith(`${self.origin}/`)) return s.url.slice(self.origin.length).replace(/[?#].*$/, "") === "/offscreen.html" ? "offscreen" : "extension";
	return s.tabId !== void 0 ? "page" : "unknown";
}
/** Which senders may make each request. Pages can only ask about their own tab; only extension UI changes state. */
var ALLOWED_SENDERS = {
	ensure: ["extension"],
	version: ["extension"],
	enable: ["extension"],
	mode: ["extension", "offscreen"],
	unpair: ["extension"],
	forget: ["extension"],
	lan: ["extension"],
	diag: ["extension"],
	link: ["offscreen"],
	"offscreen-ready": ["offscreen"],
	hello: ["page"],
	rescan: ["page"],
	frames: ["page"],
	"pc-connect": ["extension"],
	"pc-allow": ["extension"],
	"pc-scope": ["extension"],
	"pc-forget": ["extension"],
	"pc-desktop": ["extension"],
	"pc-pause": ["extension"],
	"pc-resume": ["extension"],
	"pc-stats": ["extension"]
};
var allowedFrom = (type, kind) => ALLOWED_SENDERS[type].includes(kind);
/**
* Is the running service worker older than the extension's files? An unpacked copy whose folder was replaced
* without a reload runs the old worker (and link document) under new pages: the popup then asks for a restart.
* `reply` is the worker's answer to 'version' (an old worker doesn't answer it).
*/
function workerStale(reply, mine) {
	return (isObj(reply) && typeof reply.version === "string" ? reply.version : null) !== mine;
}
//#endregion
export { PORT_NAME as C, isTargetMode as E, PAGE_MODES as S, TARGET_MODES as T, decodePad as _, parseFromPage as a, DEFAULT_MODE as b, senderKind as c, buttonValue as d, clamp as f, PadFlag as g, PadButton as h, parseConfig as i, workerStale as l, stickCurve as m, linkConfig as n, parseLink as o, hysteresis as p, parseBgRequest as r, parseOffscreenRequest as s, allowedFrom as t, Accum as u, packetType as v, SERVICE as w, MIN_VIEW_AREA as x, APP_NAME as y };
