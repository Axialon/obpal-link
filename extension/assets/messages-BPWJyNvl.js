//#region src/shared/constants.ts
/** Constants shared by every ob.Pal Link context. Pure: nothing here touches chrome.* or the DOM. */
var APP_NAME = "ob.Pal Link";
/** ob.Pal room service (signaling + TURN credentials). Also the only required host permission. */
var SERVICE = "https://obpal.blackboxes.net";
/** Name of the runtime.connect() port a page bridge opens to the offscreen link. */
var PORT_NAME = "obpal-link/page";
/** What the phone drives in the controlled tab. Index order is the wire encoding (InputFrame.m). */
var TARGET_MODES = [
	"gamepad",
	"viewer",
	"keys"
];
var DEFAULT_MODE = "gamepad";
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
/**
* Channel binding: proves the device holds the pairing secret and binds it to both DTLS identities.
* mac = HMAC-SHA256(HKDF(secret, salt=roomId, info="obpal bind v1"), fpDevice || fpHost || roomId)
*/
async function bindMac(secret, fpDevice, fpHost, roomId) {
	const base = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveKey"]);
	const key = await crypto.subtle.deriveKey({
		name: "HKDF",
		hash: "SHA-256",
		salt: enc.encode(roomId),
		info: enc.encode("obpal bind v1")
	}, base, {
		name: "HMAC",
		hash: "SHA-256",
		length: 256
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", key, concat(fpDevice, fpHost, enc.encode(roomId)));
	return b64url(new Uint8Array(sig));
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
function parseLink(x) {
	if (!isObj(x) || !STATUSES.includes(x.status) || typeof x.url !== "string") return null;
	if (x.url !== "" && (!x.url.startsWith(`https://obpal.blackboxes.net/p/#`) || x.url.length > 512)) return null;
	if (x.device !== null && (typeof x.device !== "string" || x.device.length > 60)) return null;
	return {
		status: x.status,
		url: x.url,
		device: x.device
	};
}
function parseBgRequest(x) {
	if (!isObj(x) || x.to !== "bg") return null;
	switch (x.type) {
		case "ensure":
		case "unpair":
		case "offscreen-ready":
		case "hello":
		case "rescan": return {
			to: "bg",
			type: x.type
		};
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
	if (x.type === "unpair") return {
		to: "offscreen",
		type: "unpair"
	};
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
	enable: ["extension"],
	mode: ["extension", "offscreen"],
	unpair: ["extension"],
	link: ["offscreen"],
	"offscreen-ready": ["offscreen"],
	hello: ["page"],
	rescan: ["page"],
	frames: ["page"]
};
var allowedFrom = (type, kind) => ALLOWED_SENDERS[type].includes(kind);
//#endregion
export { SERVICE as C, PORT_NAME as S, isTargetMode as T, roomIdFor as _, parseLink as a, DEFAULT_MODE as b, PadButton as c, packetType as d, bindMac as f, newSecret as g, equalBytes as h, parseFromPage as i, PadFlag as l, encodePairing as m, parseBgRequest as n, parseOffscreenRequest as o, certFingerprint as p, parseConfig as r, senderKind as s, allowedFrom as t, decodePad as u, sdpFingerprint as v, TARGET_MODES as w, MIN_VIEW_AREA as x, APP_NAME as y };
