import { f as parsePcRequest } from "./native-CYWtXzmG.js";
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
//#endregion
//#region ../packages/core/src/pairing.ts
var enc = new TextEncoder();
function b64url(bytes) {
	let s = "";
	for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s) {
	let t = s.replace(/-/g, "+").replace(/_/g, "/");
	while (t.length % 4) t += "=";
	const bin = atob(t);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}
function concat(...parts) {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let d = 0;
	for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
	return d === 0;
}
var newSecret = () => crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
var randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n));
function encodePairing(p) {
	return `1.${b64url(p.secret)}.${b64url(p.fp)}`;
}
/** Public room id: a hash of the secret, so the room service never learns the secret. */
async function roomIdFor(secret) {
	const d = await crypto.subtle.digest("SHA-256", concat(enc.encode("obpal-room-v1"), secret));
	return b64url(new Uint8Array(d)).slice(0, 22);
}
/** SHA-256 DTLS fingerprint from an SDP blob. */
function sdpFingerprint(sdp) {
	const m = /a=fingerprint:sha-256 ([0-9A-Fa-f:]+)/i.exec(sdp ?? "");
	if (!m) return null;
	const hex = m[1].split(":");
	return hex.length === 32 ? Uint8Array.from(hex.map((h) => parseInt(h, 16))) : null;
}
/** Fingerprint as SDP writes it: upper-case hex pairs joined by colons. */
var fingerprintHex = (fp) => Array.from(fp, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join(":");
/** Fingerprint of a certificate, via getFingerprints() or a throwaway offer where unsupported. */
async function certFingerprint(cert) {
	const f = (cert.getFingerprints?.())?.find((x) => x.algorithm?.toLowerCase() === "sha-256");
	if (f?.value) return Uint8Array.from(f.value.split(":").map((h) => parseInt(h, 16)));
	const pc = new RTCPeerConnection({ certificates: [cert] });
	pc.createDataChannel("fp");
	const offer = await pc.createOffer();
	pc.close();
	const fp = sdpFingerprint(offer.sdp);
	if (!fp) throw new Error("Could not read the DTLS fingerprint");
	return fp;
}
async function hkdf(key, salt, info, bytes) {
	const base = await crypto.subtle.importKey("raw", key, "HKDF", false, ["deriveBits"]);
	const bits = await crypto.subtle.deriveBits({
		name: "HKDF",
		hash: "SHA-256",
		salt,
		info: enc.encode(info)
	}, base, bytes * 8);
	return new Uint8Array(bits);
}
/**
* Channel binding: proves the device holds the pairing key and binds it to both DTLS identities and to the
* context of this attempt (the room id online, "lan:<nonce>" for a direct LAN connection).
* mac = HMAC-SHA256(HKDF(key, salt=context, info="obpal bind v1"), fpDevice || fpHost || context)
*/
async function bindMac(key, fpDevice, fpHost, context) {
	const base = await crypto.subtle.importKey("raw", key, "HKDF", false, ["deriveKey"]);
	const mac = await crypto.subtle.deriveKey({
		name: "HKDF",
		hash: "SHA-256",
		salt: enc.encode(context),
		info: enc.encode("obpal bind v1")
	}, base, {
		name: "HMAC",
		hash: "SHA-256",
		length: 256
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", mac, concat(fpDevice, fpHost, enc.encode(context)));
	return b64url(new Uint8Array(sig));
}
/** The direct code's binding context (also the salt of the derived ICE credentials). */
var lanContext = (nonce) => `lan:${b64url(nonce)}`;
var UUID = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;
var IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
var IPV6 = /^[0-9a-f:]+(%[A-Za-z0-9._-]{1,16})?$/i;
var HOSTNAME = /^[A-Za-z0-9]([A-Za-z0-9-]{0,62}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,62}[A-Za-z0-9])?)*$/;
var isLanHost = (h) => h.length <= 253 && (IPV4.test(h) || h.includes(":") && IPV6.test(h) || HOSTNAME.test(h));
var uuidBytes = (name) => {
	const m = UUID.exec(name);
	if (!m) return null;
	const hex = m.slice(1).join("");
	return Uint8Array.from({ length: 16 }, (_, i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16));
};
/** mDNS names (36-char UUIDs) shrink to 22 characters; everything else travels as written. */
function encodeCandidate(c) {
	const u = c.host.endsWith(".local") ? uuidBytes(c.host.slice(0, -6)) : null;
	return `${u ? `m${b64url(u)}` : `a${c.host}`}~${c.port}`;
}
/** The direct code: `2.<id>.<nonce>.<ufrag>.<pwd>.<candidates>`, in the same URL fragment position as the online code. */
function encodeLanPairing(p) {
	return `2.${b64url(p.id)}.${b64url(p.nonce)}.${p.ufrag}.${p.pwd}.${p.cands.slice(0, 4).map(encodeCandidate).join(",")}`;
}
/**
* The phone's ICE credentials for a direct code, known to both sides without any exchange:
* HKDF-SHA256(key, salt = nonce, info = "obpal lan ice v1") -> 24 bytes -> base64 (the ice-char alphabet):
* 8 characters of ufrag and 24 of password.
*/
async function lanIceCredentials(key, nonce) {
	const bytes = await hkdf(key, nonce, "obpal lan ice v1", 24);
	const s = btoa(String.fromCharCode(...bytes));
	return {
		ufrag: s.slice(0, 8),
		pwd: s.slice(8, 32)
	};
}
/** Read the ICE credentials and UDP host candidates of a gathered local description. */
function readLocalIce(sdp) {
	const ufrag = /^a=ice-ufrag:(\S+)/m.exec(sdp ?? "")?.[1];
	const pwd = /^a=ice-pwd:(\S+)/m.exec(sdp ?? "")?.[1];
	if (!ufrag || !pwd) return null;
	return {
		ufrag,
		pwd,
		cands: candidatesOf(sdp ?? "")
	};
}
/** UDP host candidates from candidate lines (SDP a= lines or RTCIceCandidate.candidate strings), deduplicated. */
function candidatesOf(text) {
	const out = [];
	for (const m of text.matchAll(/candidate:\S+ 1 udp \d+ (\S+) (\d+) typ host/gi)) {
		const c = {
			host: m[1],
			port: Number(m[2])
		};
		if (isLanHost(c.host) && c.port > 0 && !out.some((o) => o.host === c.host && o.port === c.port)) out.push(c);
	}
	return out.slice(0, 4);
}
var sdpHead = (ufrag, pwd, fp, setup) => [
	"v=0",
	"o=- 0 0 IN IP4 127.0.0.1",
	"s=-",
	"t=0 0",
	"a=group:BUNDLE 0",
	"a=msid-semantic: WMS",
	"m=application 9 UDP/DTLS/SCTP webrtc-datachannel",
	"c=IN IP4 0.0.0.0",
	`a=ice-ufrag:${ufrag}`,
	`a=ice-pwd:${pwd}`,
	"a=ice-options:trickle",
	`a=fingerprint:sha-256 ${fingerprintHex(fp)}`,
	`a=setup:${setup}`,
	"a=mid:0",
	"a=sctp-port:5000",
	"a=max-message-size:262144"
];
/** The phone's answer as the host reconstructs it: derived credentials, the remembered phone fingerprint, no candidates. */
function lanAnswerSdp(p) {
	return [...sdpHead(p.ufrag, p.pwd, p.fp, "active"), ""].join("\r\n");
}
//#endregion
//#region ../packages/core/src/store.ts
/**
* What a device or host keeps between sessions, in IndexedDB: its own DTLS certificate (so its fingerprint is
* stable and the other side can pin it) and the pairings it remembers. Everything degrades to "this session
* only" where storage is unavailable (private mode, storage denied, a browser that can't store certificates).
*/
var DB = "obpal";
var VERSION = 1;
var CERT_TTL = 31536e6;
/** Renew a certificate this close to its expiry, so a pairing never breaks mid-week. */
var CERT_RENEW = 6048e5;
var memory = {
	certs: /* @__PURE__ */ new Map(),
	pairs: /* @__PURE__ */ new Map()
};
var dbPromise = null;
function open() {
	dbPromise ??= new Promise((resolve) => {
		try {
			const req = indexedDB.open(DB, VERSION);
			req.onupgradeneeded = () => {
				const db = req.result;
				if (!db.objectStoreNames.contains("certs")) db.createObjectStore("certs");
				if (!db.objectStoreNames.contains("pairs")) db.createObjectStore("pairs", { keyPath: "id" });
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => resolve(null);
			req.onblocked = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
	return dbPromise;
}
function tx(store, mode, run) {
	return open().then((db) => {
		if (!db) return void 0;
		return new Promise((resolve) => {
			try {
				const t = db.transaction(store, mode);
				const req = run(t.objectStore(store));
				req.onsuccess = () => resolve(req.result);
				req.onerror = () => resolve(void 0);
				t.onabort = () => resolve(void 0);
			} catch {
				resolve(void 0);
			}
		});
	});
}
/** This side's persistent certificate (generated on first use, renewed a week before it expires) and its fingerprint. */
async function loadCertificate(role) {
	const stored = memory.certs.get(role) ?? await tx("certs", "readonly", (s) => s.get(role));
	if (stored && typeof stored.expires === "number" && stored.expires - Date.now() > CERT_RENEW) try {
		const fp = await certFingerprint(stored);
		memory.certs.set(role, stored);
		return {
			cert: stored,
			fp,
			fresh: false
		};
	} catch {}
	const cert = await RTCPeerConnection.generateCertificate({
		name: "ECDSA",
		namedCurve: "P-256",
		expires: CERT_TTL
	});
	memory.certs.set(role, cert);
	await tx("certs", "readwrite", (s) => s.put(cert, role));
	return {
		cert,
		fp: await certFingerprint(cert),
		fresh: true
	};
}
async function listPairs() {
	return (await tx("pairs", "readonly", (s) => s.getAll()) ?? [...memory.pairs.values()]).filter(isPair).sort((a, b) => b.at - a.at);
}
async function putPair(p) {
	memory.pairs.set(p.id, p);
	await tx("pairs", "readwrite", (s) => s.put(p));
}
async function forgetPair(id) {
	memory.pairs.delete(id);
	await tx("pairs", "readwrite", (s) => s.delete(id));
}
function isPair(x) {
	const p = x;
	return !!p && typeof p === "object" && typeof p.id === "string" && p.key instanceof Uint8Array && p.key.length === 32 && p.peerFp instanceof Uint8Array && p.peerFp.length === 32 && typeof p.peerName === "string" && typeof p.at === "number";
}
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
//#region ../packages/core/src/catalogue.ts
var Utility = {
	pad: "pad",
	aim: "motion.aim",
	steer: "motion.steer",
	point: "motion.point",
	trackpad: "touch.trackpad",
	hold: "motion.hold",
	tilt: "motion.tilt"
};
Utility.aim, Utility.steer, Utility.point;
var u = (route, over = {}) => ({
	route,
	gain: 1,
	curve: 1,
	deadzone: .2,
	invertY: false,
	edgeTurn: false,
	...over
});
u("stick.right"), u("stick.wheel"), u("pointer"), u("stick.right"), u("stick.fly"), u("pointer"), u("stick.right"), u("stick.wheel"), u("pointer"), u("mouse"), u("stick.wheel"), u("pointer", { edgeTurn: true }), u("stick.right"), u("stick.wheel"), u("pointer");
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
	const cfg = parseConfig(x);
	return x.type === "config" && cfg ? {
		to: "offscreen",
		type: "config",
		...cfg
	} : null;
}
/** The routing config the offscreen link needs: which tab is controlled and in which mode. */
function parseConfig(x) {
	if (!isObj(x) || !isTargetMode(x.mode)) return null;
	if (x.tabId !== null && !(Number.isInteger(x.tabId) && within(x.tabId, 0, 2 ** 31))) return null;
	return {
		tabId: x.tabId,
		mode: x.mode
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
export { lanAnswerSdp as A, MIN_VIEW_AREA as B, bindMac as C, encodePairing as D, encodeLanPairing as E, readLocalIce as F, isTargetMode as G, PORT_NAME as H, roomIdFor as I, sdpFingerprint as L, lanIceCredentials as M, newSecret as N, equalBytes as O, randomBytes as P, APP_NAME as R, b64url as S, certFingerprint as T, SERVICE as U, PAGE_MODES as V, TARGET_MODES as W, packetType as _, parseLink as a, loadCertificate as b, workerStale as c, clamp as d, hysteresis as f, decodePad as g, PadFlag as h, parseFromPage as i, lanContext as j, fromB64url as k, Accum as l, PadButton as m, parseBgRequest as n, parseOffscreenRequest as o, stickCurve as p, parseConfig as r, senderKind as s, allowedFrom as t, buttonValue as u, forgetPair as v, candidatesOf as w, putPair as x, listPairs as y, DEFAULT_MODE as z };
