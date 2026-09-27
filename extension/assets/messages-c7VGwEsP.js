//#region src/shared/access.ts
var isPcAccess = (x) => x === "allow" || x === "deny" || x === "ask";
/** A pairing id (16 bytes, base64url), or "fp:" and a DTLS fingerprint (32 bytes, base64url). */
var PHONE_KEY_RE = /^(?:[A-Za-z0-9_-]{22}|fp:[A-Za-z0-9_-]{43})$/;
var MAX_NAME = 60;
/** What the phone shows while the person at the PC hasn't answered yet, and once they've said no. */
var WAITING = "Waiting for approval on the PC";
var REFUSED = "Not allowed on this PC: choose another target";
var isObj$2 = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
var isKey = (x) => typeof x === "string" && PHONE_KEY_RE.test(x);
var isName = (x) => typeof x === "string" && x.length > 0 && x.length <= MAX_NAME;
/** A device as @obpal/host names it (Participant.pair, .fp): its key, or null if it has neither. */
function phoneKeyOf(p) {
	const key = p.pair ?? (p.fp ? `fp:${p.fp}` : null);
	return isKey(key) ? key : null;
}
function parsePhone(x) {
	return isObj$2(x) && isKey(x.key) && isName(x.name) ? {
		key: x.key,
		name: x.name
	} : null;
}
/** The kept answers, with anything malformed left out, and at most MAX_ANSWERS of them (the newest). */
function parseAnswers(x) {
	if (!isObj$2(x)) return {};
	const ok = Object.entries(x).filter((e) => {
		const [k, a] = e;
		return isKey(k) && isObj$2(a) && isName(a.name) && typeof a.allow === "boolean" && typeof a.at === "number" && Number.isFinite(a.at);
	});
	ok.sort((a, b) => b[1].at - a[1].at);
	return Object.fromEntries(ok.slice(0, 64).map(([k, a]) => [k, {
		name: a.name,
		allow: a.allow,
		at: a.at
	}]));
}
function accessOf(answers, key) {
	const a = Object.hasOwn(answers, key) ? answers[key] : void 0;
	return a ? a.allow ? "allow" : "deny" : "ask";
}
/**
* The phone the person at the PC is asked about now: the one connected, while the PC is the target, if nobody has
* answered for it yet. `pcReady`: PC control is on at all (the native messaging permission), so the helper could run.
*/
function askFor(mode, phone, answers, pcReady) {
	return mode === "pc" && pcReady && phone && accessOf(answers, phone.key) === "ask" ? phone : null;
}
/** The answers with this one given (it replaces an earlier one for the same phone). */
function withAnswer(answers, phone, allow, now) {
	return parseAnswers({
		...answers,
		[phone.key]: {
			name: phone.name,
			allow,
			at: now
		}
	});
}
/** The answers without this phone's: it is asked again, as a new phone. */
function withoutAnswer(answers, key) {
	return Object.fromEntries(Object.entries(answers).filter(([k]) => k !== key));
}
/**
* The line the phone shows (the host value `notice`, PROTOCOL §3): while the PC is the target, what holds its input
* up on this PC, if anything. False: nothing to say.
*/
function noticeFor(mode, access) {
	if (mode !== "pc" || !access || access === "allow") return false;
	return access === "ask" ? WAITING : REFUSED;
}
//#endregion
//#region src/shared/constants.ts
/** Constants shared by every ob.Pal Link context. Pure: nothing here touches chrome.* or the DOM. */
var APP_NAME = "ob.Pal Link";
/**
* ob.Pal room service (signaling + TURN credentials). Also the only required host permission. A build of your own
* names yours: OBPAL_PUBLIC_ORIGIN=https://your.host pnpm run build:extension (spec/SECURITY.md §6).
*/
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
//#region src/shared/native.ts
/**
* PC target: what the extension exchanges with ob.Pal Desktop, the native helper (desktop/), over Chrome
* Native Messaging, and the state the popup and options page render from it. Pure: unit-tested in node.
*
*   offscreen (KeyMapper → desired held state) ──port──▶ service worker ──connectNative──▶ obpal-desktop.exe
*                                                          │ storage.session.pc ◀── status / config / hello
*                                                          ▼
*                                                   popup, options page
*
* Frames carry the whole desired state (which keys and buttons are held) plus this frame's motion, never
* edges: the helper diffs against what it holds, so a lost frame can never leave a key stuck. Typing from the
* phone's keyboard goes beside them, in order on the same port, as text requests.
* See spec/PROTOCOL.md § Native messaging frames.
*/
/** Native messaging host name (desktop/src/win/install.rs HOST_NAME). */
var NATIVE_HOST = "net.blackboxes.obpal";
/** runtime.connect() port the offscreen link opens to the service worker for PC frames. */
var NATIVE_PORT_NAME = "obpal-link/native";
/** runtime.connect() port an extension page holds while it shows the helper's state (the options page). */
var PC_PAGE_PORT_NAME = "obpal-link/pc-page";
/** Where to get the helper. */
var DESKTOP_URL = "https://github.com/Axialon/obpal-link/tree/main/desktop#readme";
var isObj$1 = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
var fin$1 = (v) => typeof v === "number" && Number.isFinite(v);
var str = (v, max) => typeof v === "string" && v.length <= max;
var bool = (v) => typeof v === "boolean";
var MAX_MOVE = 2e3;
var MAX_WHEEL = 2400;
/** The desired held state, kept up to date from the Keys mapper's edges (KeyMapper.update / releaseAll). */
var HeldState = class {
	keys = /* @__PURE__ */ new Set();
	buttons = /* @__PURE__ */ new Set();
	apply(out) {
		for (const e of out.keys) if (e.down) this.keys.add(e.key);
		else this.keys.delete(e.key);
		for (const b of out.buttons) if (b.down) this.buttons.add(b.button);
		else this.buttons.delete(b.button);
	}
	clear() {
		this.keys.clear();
		this.buttons.clear();
	}
	get empty() {
		return this.keys.size === 0 && this.buttons.size === 0;
	}
};
var int = (v, max) => Math.max(-max, Math.min(max, Math.round(v))) || 0;
/** Build a frame from the held state and this frame's motion; empty parts are left out to keep idle frames tiny. */
function buildNativeFrame(held, move, wheel = [0, 0], extra = {}) {
	const f = { t: "f" };
	const keys = /* @__PURE__ */ new Set([...held.keys, ...extra.keys ?? []]);
	const buttons = /* @__PURE__ */ new Set([...held.buttons, ...extra.buttons ?? []]);
	if (keys.size) f.k = [...keys].slice(0, 16);
	if (buttons.size) f.b = [...buttons].sort();
	const m = [int(move[0], MAX_MOVE), int(move[1], MAX_MOVE)];
	if (m[0] || m[1]) f.m = m;
	const w = [int(wheel[0], MAX_WHEEL), int(wheel[1], MAX_WHEEL)];
	if (w[0] || w[1]) f.w = w;
	return f;
}
var isIdleFrame = (f) => !f.k && !f.b && !f.m && !f.w;
/** What a frame holds, to tell a change of held state (sent at once: a release must not wait) from a repeat. */
var heldSignature = (f) => `${f.k?.join(",") ?? ""}|${f.b?.join(",") ?? ""}`;
/** Validate a frame from the offscreen document before it goes to the helper (every hop validates). */
function parseNativeFrame(x) {
	if (!isObj$1(x) || x.t !== "f") return null;
	const f = { t: "f" };
	if (x.k !== void 0) {
		if (!Array.isArray(x.k) || x.k.length > 16 || !x.k.every((k) => typeof k === "string" && /^[A-Za-z0-9]{1,24}$/.test(k))) return null;
		f.k = [...x.k];
	}
	if (x.b !== void 0) {
		if (!Array.isArray(x.b) || x.b.length > 5 || !x.b.every((b) => Number.isInteger(b) && b >= 0 && b <= 4)) return null;
		f.b = [...x.b];
	}
	for (const key of ["m", "w"]) {
		const v = x[key];
		if (v === void 0) continue;
		const max = key === "m" ? MAX_MOVE : MAX_WHEEL;
		if (!Array.isArray(v) || v.length !== 2 || !v.every((n) => Number.isInteger(n) && Math.abs(n) <= max)) return null;
		f[key] = [v[0], v[1]];
	}
	return f;
}
/** Control characters other than tab and newline, and halves of a character: nothing that isn't typing. */
var NOT_TYPING = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f]|[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/;
/** Validate a text request (from the phone, through the offscreen link) before it goes to the helper: at most MAX_TEXT typed and deleted. */
function parseNativeText(x) {
	if (!isObj$1(x) || x.t !== "text" || typeof x.s !== "string" || x.s.length > 256 || NOT_TYPING.test(x.s)) return null;
	const del = x.del === void 0 ? 0 : x.del;
	if (typeof del !== "number" || !Number.isInteger(del) || del < 0 || del > 256 || !x.s && !del) return null;
	return {
		t: "text",
		s: x.s,
		del
	};
}
var isTextField = (x) => x === "text" || x === "secret";
var TYPING_REFUSALS = [
	"not-typed",
	"keys-held",
	"text-rate",
	"bad-text",
	"no-text",
	"offline"
];
var isTypingRefusal = (x) => typeof x === "string" && TYPING_REFUSALS.includes(x);
/** The word the phone shows for a refusal. */
function typingToast(r) {
	switch (r) {
		case "not-typed": return "Not typed: keys are off for this window";
		case "keys-held": return "Not typed: let go of the keys first";
		case "text-rate": return "Typing faster than the PC takes it";
		case "bad-text": return "That can’t be typed";
		case "no-text": return "Update ob.Pal Desktop to type from the phone";
		case "offline": return "Not typed: ob.Pal Desktop isn’t connected";
	}
}
var MAX_PATH = 1024;
var MAX_PROGRAMS = 200;
function parseScope(x) {
	return isObj$1(x) && bool(x.keyboard) && bool(x.mouse) ? {
		keyboard: x.keyboard,
		mouse: x.mouse
	} : null;
}
function parseProgram(x) {
	if (!isObj$1(x) || !str(x.name, 260) || !str(x.path, MAX_PATH) || !str(x.title, 200)) return null;
	if (!Number.isInteger(x.pid) || x.pid < 0 || !bool(x.elevated) || !bool(x.browser)) return null;
	const allowed = x.allowed === null ? null : parseScope(x.allowed);
	if (allowed === null && x.allowed !== null) return null;
	return {
		name: x.name,
		path: x.path,
		title: x.title,
		pid: x.pid,
		elevated: x.elevated,
		browser: x.browser,
		allowed
	};
}
function parsePcConfig(x) {
	if (!isObj$1(x) || !bool(x.paused) || !Array.isArray(x.programs) || x.programs.length > MAX_PROGRAMS) return null;
	const desktop = x.desktop === void 0 || x.desktop === null ? null : parseScope(x.desktop);
	if (desktop === null && x.desktop !== void 0 && x.desktop !== null) return null;
	const programs = [];
	for (const p of x.programs) {
		if (!isObj$1(p) || !str(p.path, MAX_PATH) || !str(p.name, 260)) return null;
		const s = parseScope(p);
		if (!s) return null;
		programs.push({
			path: p.path,
			name: p.name,
			...s
		});
	}
	return {
		paused: x.paused,
		desktop,
		programs
	};
}
function parsePcStatus(x) {
	if (!isObj$1(x) || !bool(x.enabled) || !bool(x.panic) || !bool(x.held)) return null;
	const front = x.front === null ? null : parseProgram(x.front);
	const program = x.program === null ? null : parseProgram(x.program);
	if (front === null && x.front !== null || program === null && x.program !== null) return null;
	if (x.text !== void 0 && x.text !== null && !isTextField(x.text)) return null;
	return {
		enabled: x.enabled,
		panic: x.panic,
		held: x.held,
		front,
		program,
		text: isTextField(x.text) ? x.text : null
	};
}
function parseHelperMessage(x) {
	if (!isObj$1(x)) return null;
	switch (x.t) {
		case "hello": {
			if (!Number.isInteger(x.v) || !str(x.version, 32) || !str(x.os, 16) || !isObj$1(x.caps)) return null;
			if (x.hotkey !== null && !str(x.hotkey, 40)) return null;
			const c = x.caps;
			if (!bool(c.keyboard) || !bool(c.mouse) || !bool(c.gamepad) || c.desktop !== void 0 && !bool(c.desktop) || c.text !== void 0 && !bool(c.text)) return null;
			return {
				t: "hello",
				v: x.v,
				version: x.version,
				os: x.os,
				hotkey: x.hotkey,
				caps: {
					keyboard: c.keyboard,
					mouse: c.mouse,
					gamepad: c.gamepad,
					desktop: c.desktop === true,
					text: c.text === true
				}
			};
		}
		case "config": {
			const c = parsePcConfig(x);
			return c ? {
				t: "config",
				...c
			} : null;
		}
		case "status": {
			const s = parsePcStatus(x);
			return s ? {
				t: "status",
				...s
			} : null;
		}
		case "stats": {
			const s = parsePcStats(x);
			return s ? {
				t: "stats",
				...s
			} : null;
		}
		case "error": return str(x.code, 40) && str(x.msg, 300) ? {
			t: "error",
			code: x.code,
			msg: x.msg
		} : null;
	}
	return null;
}
var PC_LINKS = [
	"off",
	"permission",
	"connecting",
	"missing",
	"error",
	"ready"
];
var EMPTY_PC = {
	link: "off",
	version: null,
	desktopCap: false,
	hotkey: null,
	error: null,
	config: null,
	status: null,
	stats: null
};
function parsePcStats(x) {
	if (!isObj$1(x) || !fin$1(x.frames) || !fin$1(x.injected) || !isObj$1(x.refused)) return null;
	const refused = {};
	for (const [k, v] of Object.entries(x.refused)) if (/^[a-zA-Z]{1,24}$/.test(k) && fin$1(v)) refused[k] = v;
	return {
		frames: x.frames,
		injected: x.injected,
		refused
	};
}
function parsePcState(x) {
	if (!isObj$1(x) || !PC_LINKS.includes(x.link)) return null;
	if (x.version !== null && !str(x.version, 32) || x.hotkey !== null && !str(x.hotkey, 40) || x.error !== null && !str(x.error, 300)) return null;
	const config = x.config === null ? null : parsePcConfig(x.config);
	const status = x.status === null ? null : parsePcStatus(x.status);
	const stats = x.stats === null || x.stats === void 0 ? null : parsePcStats(x.stats);
	if (config === null && x.config !== null || status === null && x.status !== null) return null;
	return {
		link: x.link,
		version: x.version,
		desktopCap: x.desktopCap === true,
		hotkey: x.hotkey,
		error: x.error,
		config,
		status,
		stats
	};
}
function pcView(s) {
	switch (s.link) {
		case "off":
		case "connecting": return { kind: "connecting" };
		case "permission": return { kind: "permission" };
		case "missing": return { kind: "missing" };
		case "error": return {
			kind: "error",
			error: s.error ?? "The helper stopped."
		};
	}
	if (s.config?.paused) return { kind: "paused" };
	if (s.status?.panic) return {
		kind: "panic",
		hotkey: s.hotkey
	};
	const st = s.status;
	const whole = s.config?.desktop;
	if (whole && (whole.keyboard || whole.mouse)) return {
		kind: "desktop",
		scope: whole,
		front: st?.front ?? null
	};
	const desktop = s.desktopCap;
	const program = st?.front && !st.front.browser ? st.front : st?.program ?? null;
	if (!program) return {
		kind: "idle",
		desktop
	};
	if (program.elevated) return {
		kind: "elevated",
		program,
		desktop
	};
	if (!program.allowed) return {
		kind: "allow",
		program,
		desktop
	};
	return {
		kind: "active",
		program,
		scope: program.allowed,
		inFront: st?.front?.pid === program.pid && !st?.front?.browser,
		desktop
	};
}
/**
* The field the phone offers its keyboard for (the host value `textField`): the helper's status.text, only while
* typing there would go through. The helper is armed, not paused or stopped, and the window in front takes keys:
* with the whole PC on, when its scope has the keyboard; one program at a time, when that program is allowed keys.
* An elevated window never takes them (Windows drops the helper's input to it).
*/
function typingField(s) {
	const st = s.status;
	if (s.link !== "ready" || !st?.text || !st.enabled || st.panic || s.config?.paused) return null;
	const front = st.front;
	if (!front || front.elevated) return null;
	const whole = s.config?.desktop;
	return (whole && (whole.keyboard || whole.mouse) ? whole.keyboard : front.allowed?.keyboard === true) ? st.text : null;
}
/** "keyboard + mouse", "keyboard", "mouse", or "nothing". */
function scopeLabel(s) {
	const parts = [s.keyboard && "keyboard", s.mouse && "mouse"].filter((x) => !!x);
	return parts.length ? parts.join(" + ") : "nothing";
}
function parsePcRequest(x) {
	if (!isObj$1(x) || x.to !== "bg") return null;
	switch (x.type) {
		case "pc-connect":
		case "pc-resume":
		case "pc-stats": return {
			to: "bg",
			type: x.type
		};
		case "pc-allow":
		case "pc-scope": return str(x.path, MAX_PATH) && x.path !== "" && bool(x.keyboard) && bool(x.mouse) ? {
			to: "bg",
			type: x.type,
			path: x.path,
			keyboard: x.keyboard,
			mouse: x.mouse
		} : null;
		case "pc-forget": return str(x.path, MAX_PATH) && x.path !== "" ? {
			to: "bg",
			type: "pc-forget",
			path: x.path
		} : null;
		case "pc-desktop": return bool(x.on) && bool(x.keyboard) && bool(x.mouse) ? {
			to: "bg",
			type: "pc-desktop",
			on: x.on,
			keyboard: x.keyboard,
			mouse: x.mouse
		} : null;
		case "pc-pause": return bool(x.on) ? {
			to: "bg",
			type: "pc-pause",
			on: x.on
		} : null;
	}
	return null;
}
/** The helper request a page request turns into. */
function toHelperRequest(r) {
	switch (r.type) {
		case "pc-allow": return {
			t: "allow",
			path: r.path,
			keyboard: r.keyboard,
			mouse: r.mouse
		};
		case "pc-scope": return {
			t: "scope",
			path: r.path,
			keyboard: r.keyboard,
			mouse: r.mouse
		};
		case "pc-forget": return {
			t: "forget",
			path: r.path
		};
		case "pc-desktop": return {
			t: "desktop",
			on: r.on,
			keyboard: r.keyboard,
			mouse: r.mouse
		};
		case "pc-pause": return {
			t: "pause",
			on: r.on
		};
		case "pc-resume": return { t: "resume" };
		case "pc-stats": return { t: "stats" };
		case "pc-connect": return null;
	}
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
function parseFacts(x) {
	if (!isObj(x) || ![
		"qr",
		"code",
		"lan"
	].includes(x.verified) || ![
		"lan",
		"nat",
		"direct",
		"relay",
		"unknown"
	].includes(x.path)) return null;
	const word = (v, max) => typeof v === "string" && v.length <= max && /^[\w .-]*$/.test(v);
	if (x.relay !== void 0 && !word(x.relay, 8) || x.dtls !== void 0 && !word(x.dtls, 16) || x.cipher !== void 0 && !word(x.cipher, 64)) return null;
	if (x.rttMs !== void 0 && !(Number.isInteger(x.rttMs) && within(x.rttMs, 0, 6e4))) return null;
	return {
		verified: x.verified,
		path: x.path,
		...x.relay !== void 0 ? { relay: x.relay } : {},
		...x.rttMs !== void 0 ? { rttMs: x.rttMs } : {},
		...x.dtls !== void 0 ? { dtls: x.dtls } : {},
		...x.cipher !== void 0 ? { cipher: x.cipher } : {}
	};
}
/** Pairing ids are 16 random bytes, base64url. */
var PAIR_ID_RE = /^[A-Za-z0-9_-]{22}$/;
var isPairId = (v) => typeof v === "string" && PAIR_ID_RE.test(v);
function parseRemembered(x) {
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
	const pairs = rawPairs.map(parseRemembered);
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
		case "diag":
		case "facts": return {
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
		case "phone": {
			const phone = x.phone === null ? null : parsePhone(x.phone);
			return phone || x.phone === null ? {
				to: "bg",
				type: "phone",
				phone
			} : null;
		}
		case "answer": return typeof x.key === "string" && PHONE_KEY_RE.test(x.key) && typeof x.allow === "boolean" ? {
			to: "bg",
			type: "answer",
			key: x.key,
			allow: x.allow
		} : null;
	}
	return null;
}
function parseOffscreenRequest(x) {
	if (!isObj(x) || x.to !== "offscreen") return null;
	if (x.type === "unpair" || x.type === "diag" || x.type === "facts") return {
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
	if (x.type === "access") return typeof x.key === "string" && PHONE_KEY_RE.test(x.key) && isPcAccess(x.access) ? {
		to: "offscreen",
		type: "access",
		key: x.key,
		access: x.access
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
	phone: ["offscreen"],
	answer: ["extension"],
	facts: ["extension"],
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
export { phoneKeyOf as $, Accum as A, DEFAULT_MODE as B, parseNativeText as C, toHelperRequest as D, scopeLabel as E, PadButton as F, TARGET_MODES as G, PAGE_MODES as H, PadFlag as I, askFor as J, isTargetMode as K, decodePad as L, clamp as M, hysteresis as N, typingField as O, stickCurve as P, parsePhone as Q, packetType as R, parseNativeFrame as S, pcView as T, PORT_NAME as U, MIN_VIEW_AREA as V, SERVICE as W, noticeFor as X, isPcAccess as Y, parseAnswers as Z, buildNativeFrame as _, parseFacts as a, isTypingRefusal as b, parseOffscreenRequest as c, DESKTOP_URL as d, withAnswer as et, EMPTY_PC as f, PC_PAGE_PORT_NAME as g, NATIVE_PORT_NAME as h, parseConfig as i, buttonValue as j, typingToast as k, senderKind as l, NATIVE_HOST as m, linkConfig as n, parseFromPage as o, HeldState as p, accessOf as q, parseBgRequest as r, parseLink as s, allowedFrom as t, withoutAnswer as tt, workerStale as u, heldSignature as v, parsePcState as w, parseHelperMessage as x, isIdleFrame as y, APP_NAME as z };
