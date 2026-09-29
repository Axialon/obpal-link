import { A as typingToast, B as packetType, F as stickCurve, H as DEFAULT_MODE, I as PadButton, J as isTargetMode, K as SERVICE, L as PadFlag, M as buttonValue, N as clamp$1, P as hysteresis, Q as noticeFor, R as decodePad, V as APP_NAME, W as PAGE_MODES, Z as isPcAccess, b as isIdleFrame, c as parseOffscreenRequest, g as NATIVE_PORT_NAME, i as parseConfig, j as Accum, o as parseFromPage, p as HeldState, tt as phoneKeyOf, v as buildNativeFrame, w as parseNativeText, y as heldSignature, z as emptyPad } from "./messages-BtNPASMo.js";
//#region ../packages/core/src/quat.ts
var qIdentity = () => [
	0,
	0,
	0,
	1
];
function qNorm(q) {
	const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
	return [
		q[0] / l,
		q[1] / l,
		q[2] / l,
		q[3] / l
	];
}
function qSlerp(a, b, t) {
	let [bx, by, bz, bw] = b;
	let cos = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
	if (cos < 0) {
		cos = -cos;
		bx = -bx;
		by = -by;
		bz = -bz;
		bw = -bw;
	}
	if (cos > 1 - 1e-12) return qNorm([
		a[0] + (bx - a[0]) * t,
		a[1] + (by - a[1]) * t,
		a[2] + (bz - a[2]) * t,
		a[3] + (bw - a[3]) * t
	]);
	const th = Math.acos(Math.min(1, cos));
	const s = Math.sin(th);
	const wa = Math.sin((1 - t) * th) / s;
	const wb = Math.sin(t * th) / s;
	return [
		a[0] * wa + bx * wb,
		a[1] * wa + by * wb,
		a[2] * wa + bz * wb,
		a[3] * wa + bw * wb
	];
}
var Flag = {
	quatValid: 1,
	gyroValid: 2,
	gravValid: 4,
	dup: 8,
	clutch: 16,
	touching: 32,
	tsFromSensor: 64,
	lowPower: 128
};
/** track: 6-DOF, the device's position and orientation in space (POSE packets beside STATE; see ./pose.ts). */
var Mode = {
	hold: 0,
	orbit: 1,
	point: 2,
	tilt: 3,
	pad: 4,
	gamepad: 5,
	track: 6
};
var Tier = {
	touch: 0,
	tilt: 1,
	compass: 2,
	gyro: 3
};
function getQuat(dv, off) {
	const q = [
		0,
		0,
		0,
		0
	];
	for (let i = 0; i < 4; i++) q[i] = dv.getInt16(off + i * 2, true) / 32767;
	const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
	return [
		q[0] / l,
		q[1] / l,
		q[2] / l,
		q[3] / l
	];
}
function decodeState(buf) {
	if (buf.byteLength < 76) return null;
	const dv = new DataView(buf);
	if (dv.getUint8(0) !== 17) return null;
	const tb = dv.getUint8(10);
	const raw = {
		aim: [dv.getInt32(40, true), dv.getInt32(44, true)],
		pad1: [dv.getInt32(48, true), dv.getInt32(52, true)],
		pad2: [dv.getInt32(56, true), dv.getInt32(60, true)],
		zoom: dv.getInt16(64, true),
		twist: dv.getInt16(66, true)
	};
	return {
		flags: dv.getUint8(1),
		seq: dv.getUint16(2, true),
		t: dv.getUint32(4, true),
		mode: dv.getUint8(8),
		grab: dv.getUint8(9),
		tier: tb & 3,
		screen: tb >> 2 & 3,
		touches: dv.getUint8(11),
		qAbs: getQuat(dv, 12),
		qRel: getQuat(dv, 20),
		gyro: [
			dv.getInt16(28, true) / 1e3,
			dv.getInt16(30, true) / 1e3,
			dv.getInt16(32, true) / 1e3
		],
		grav: [
			dv.getInt16(34, true) / 32767,
			dv.getInt16(36, true) / 32767,
			dv.getInt16(38, true) / 32767
		],
		aim: [raw.aim[0] / 1e3, raw.aim[1] / 1e3],
		pad1: [raw.pad1[0] / 16, raw.pad1[1] / 16],
		pad2: [raw.pad2[0] / 16, raw.pad2[1] / 16],
		zoom: raw.zoom / 4096,
		twist: raw.twist / 100,
		joy: [dv.getInt8(68) / 127, dv.getInt8(69) / 127],
		tilt: [dv.getInt8(70) / 127, dv.getInt8(71) / 127],
		buttons: dv.getUint32(72, true),
		raw
	};
}
/** Serial-number comparison for u16 sequence numbers: is a newer than b? */
function seqNewer(a, b) {
	const d = (a - b + 65536) % 65536;
	return d !== 0 && d < 32768;
}
/** Wrap-safe differences of raw accumulators, returned in natural units. */
function accumDelta(a, b) {
	const d32 = (x, y) => x - y | 0;
	const d16 = (x, y) => (x - y + 98304) % 65536 - 32768;
	return {
		aim: [d32(a.raw.aim[0], b.raw.aim[0]) / 1e3, d32(a.raw.aim[1], b.raw.aim[1]) / 1e3],
		pad1: [d32(a.raw.pad1[0], b.raw.pad1[0]) / 16, d32(a.raw.pad1[1], b.raw.pad1[1]) / 16],
		pad2: [d32(a.raw.pad2[0], b.raw.pad2[0]) / 16, d32(a.raw.pad2[1], b.raw.pad2[1]) / 16],
		zoom: d16(a.raw.zoom, b.raw.zoom) / 4096,
		twist: d16(a.raw.twist, b.raw.twist) / 100
	};
}
//#endregion
//#region ../packages/core/src/pairing.ts
var enc$2 = new TextEncoder();
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
	const d = await crypto.subtle.digest("SHA-256", concat(enc$2.encode("obpal-room-v1"), secret));
	return b64url(new Uint8Array(d)).slice(0, 22);
}
/**
* The SHA-256 DTLS fingerprint an SDP blob commits to, read strictly: the description must have exactly one media
* section and exactly one `a=fingerprint` line (at session level or in that section, so it is the one DTLS checks),
* and it must be a well-formed sha-256 fingerprint. Anything else is null. A description that says more (a second
* fingerprint anywhere, one hidden in another line's text, a second media section) could show one fingerprint to
* this parser and another to DTLS, which is how someone relaying between two DTLS sessions would pass a check.
*/
function sdpFingerprint(sdp) {
	const lines = (sdp ?? "").split(/\r?\n/);
	if (lines.filter((l) => l.startsWith("m=")).length !== 1) return null;
	const fps = lines.filter((l) => l.startsWith("a=fingerprint:"));
	if (fps.length !== 1) return null;
	const m = /^a=fingerprint:sha-256 ((?:[0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2})$/i.exec(fps[0].trimEnd());
	return m ? Uint8Array.from(m[1].split(":").map((h) => parseInt(h, 16))) : null;
}
/**
* The session an SDP blob belongs to: its o= line's session id, which stays the same through every offer one peer
* connection makes (RFC 8829 §5.2.2), so a later offer with it renegotiates that connection. Null without one.
*/
function sdpSession(sdp) {
	return /^o=\S+ (\d{1,20}) \d+ IN /m.exec(sdp ?? "")?.[1] ?? null;
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
/**
* A remembered pairing's key as both ends keep it: a non-extractable HKDF key, good for the binding's MAC (deriveKey)
* and the direct code's ICE credentials (deriveBits). Script can use it, but no script, the page's own included, can
* read it back.
*/
function importPairKey(raw) {
	return crypto.subtle.importKey("raw", raw, "HKDF", false, ["deriveBits", "deriveKey"]);
}
/** HKDF's input key: bytes are imported for this one use, and a kept key is used as it is. */
var hkdfKey = (key, usage) => key instanceof Uint8Array ? crypto.subtle.importKey("raw", key, "HKDF", false, [usage]) : Promise.resolve(key);
async function hkdf(key, salt, info, bytes) {
	const base = await hkdfKey(key, "deriveBits");
	const bits = await crypto.subtle.deriveBits({
		name: "HKDF",
		hash: "SHA-256",
		salt,
		info: enc$2.encode(info)
	}, base, bytes * 8);
	return new Uint8Array(bits);
}
/**
* Channel binding: proves the device holds the pairing key and binds it to both DTLS identities and to the
* context of this attempt (the room id online, "lan:<nonce>" for a direct LAN connection).
* mac = HMAC-SHA256(HKDF(key, salt=context, info="obpal bind v1"), fpDevice || fpHost || context)
*/
async function bindMac(key, fpDevice, fpHost, context) {
	const base = await hkdfKey(key, "deriveKey");
	const mac = await crypto.subtle.deriveKey({
		name: "HKDF",
		hash: "SHA-256",
		salt: enc$2.encode(context),
		info: enc$2.encode("obpal bind v1")
	}, base, {
		name: "HMAC",
		hash: "SHA-256",
		length: 256
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", mac, concat(fpDevice, fpHost, enc$2.encode(context)));
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
/** How long a connect attempt may take before the service counts as unreachable (the offline fallback's budget). */
var REACH_TIMEOUT_MS = 1500;
function roomSocketUrl(service, roomId, role) {
	return `${service.replace(/^http/, "ws")}/r/${roomId}?role=${role}`;
}
/**
* Room signaling socket with jittered reconnect and keep-alive pings (answered by the service without waking it).
* A connect attempt that hasn't opened within REACH_TIMEOUT_MS is abandoned and reported as unreachable, so
* callers can fall back within the budget instead of waiting for the network stack's own timeout.
*/
var SignalClient = class {
	constructor(url, connectTimeout = REACH_TIMEOUT_MS) {
		this.url = url;
		this.connectTimeout = connectTimeout;
		this.onmessage = () => {};
		this.onstatus = () => {};
		this.everOpened = false;
		this.ws = null;
		this.closed = false;
		this.backoff = 400;
		this.ping = null;
		this.timer = null;
	}
	connect() {
		if (this.closed) return;
		let ws;
		try {
			ws = new WebSocket(this.url);
		} catch {
			this.onstatus(false, false);
			this.retry();
			return;
		}
		this.ws = ws;
		let opened = false;
		this.timer = setTimeout(() => {
			if (!opened) ws.close();
		}, this.connectTimeout);
		ws.onopen = () => {
			opened = true;
			this.everOpened = true;
			if (this.timer) clearTimeout(this.timer);
			this.backoff = 400;
			this.onstatus(true, true);
			this.ping = setInterval(() => ws.readyState === 1 && ws.send("ping"), 25e3);
		};
		ws.onmessage = (e) => {
			if (e.data === "pong") return;
			try {
				this.onmessage(JSON.parse(e.data));
			} catch {}
		};
		ws.onclose = () => {
			if (this.timer) clearTimeout(this.timer);
			if (this.ping) clearInterval(this.ping);
			if (this.ws !== ws) return;
			this.ws = null;
			this.onstatus(false, opened);
			this.retry();
		};
	}
	retry() {
		if (this.closed) return;
		const wait = this.backoff * (.75 + Math.random() * .5);
		this.backoff = Math.min(this.backoff * 2, 8e3);
		setTimeout(() => this.connect(), wait);
	}
	get open() {
		return this.ws?.readyState === 1;
	}
	send(obj) {
		if (this.ws?.readyState === 1) this.ws.send(JSON.stringify(obj));
	}
	close() {
		this.closed = true;
		if (this.ping) clearInterval(this.ping);
		if (this.timer) clearTimeout(this.timer);
		this.ws?.close();
	}
};
var STUN = [{ urls: "stun:stun.cloudflare.com:3478" }];
/** How long before TURN credentials lapse a host asks for fresh ones (a relay drops an allocation once they have). */
var ICE_REFRESH_BEFORE_MS = 6e5;
/** Without TURN (none minted, or the lookup failed), ask again this often: the service may have one later. */
var ICE_RETRY_MS = 6e5;
async function fetchIce(service, roomId, timeoutMs = REACH_TIMEOUT_MS) {
	try {
		const r = await fetch(`${service}/api/ice?room=${encodeURIComponent(roomId)}`, {
			cache: "no-store",
			signal: AbortSignal.timeout(timeoutMs)
		});
		if (r.ok) {
			const j = await r.json();
			if (Array.isArray(j.iceServers) && j.iceServers.length) {
				const expires = typeof j.expires === "number" && j.expires > Date.now() ? j.expires : void 0;
				return {
					servers: j.iceServers,
					turn: j.turn === true,
					...expires ? { expires } : {}
				};
			}
		}
	} catch {}
	return {
		servers: STUN,
		turn: false
	};
}
/**
* When to ask for a room's ICE servers again: shortly before TURN credentials lapse (credentials that say nothing
* about it are taken to last a day), else after ICE_RETRY_MS. Never sooner than a minute.
*/
function iceRefreshIn(set, now = Date.now()) {
	const lapses = set.expires ?? (set.turn ? now + 864e5 : 0);
	return Math.max(6e4, lapses ? Math.min(lapses - now - ICE_REFRESH_BEFORE_MS, 2 ** 31 - 1) : ICE_RETRY_MS);
}
var DTLS_VERSIONS = {
	FEFD: "DTLS 1.2",
	FEFC: "DTLS 1.3"
};
async function linkInfo(pc) {
	const secure = pc.connectionState === "connected";
	try {
		const stats = await pc.getStats();
		let transport;
		stats.forEach((s) => {
			if (s.type === "transport" && (s.selectedCandidatePairId || !transport)) transport = s;
		});
		let pair = transport?.selectedCandidatePairId ? stats.get(transport.selectedCandidatePairId) : void 0;
		if (!pair) stats.forEach((s) => {
			if (s.type === "candidate-pair" && s.nominated && s.state === "succeeded") pair = s;
		});
		const local = pair ? stats.get(pair.localCandidateId) : void 0;
		const remote = pair ? stats.get(pair.remoteCandidateId) : void 0;
		const types = [local?.candidateType, remote?.candidateType];
		const path = !pair ? "unknown" : types.includes("relay") ? "relay" : types[0] === "host" && types[1] === "host" ? "lan" : types.includes("srflx") ? "nat" : "direct";
		const version = typeof transport?.tlsVersion === "string" ? transport.tlsVersion.toUpperCase() : "";
		return {
			path,
			secure,
			...path === "relay" && typeof local?.relayProtocol === "string" ? { relayProtocol: local.relayProtocol } : {},
			...typeof pair?.currentRoundTripTime === "number" ? { rttMs: Math.round(pair.currentRoundTripTime * 1e3) } : {},
			...DTLS_VERSIONS[version] ? { dtls: DTLS_VERSIONS[version] } : {},
			...typeof transport?.dtlsCipher === "string" ? { cipher: transport.dtlsCipher } : {}
		};
	} catch {
		return {
			path: "unknown",
			secure
		};
	}
}
//#endregion
//#region ../packages/core/src/work.ts
/**
* Proof of work for the short code's room service (PROTOCOL §2b), Hashcash-style. Under pressure the service hands out
* a challenge, and a lookup or a new code comes back with a counter `x` for which SHA-256("<challenge>:<x>") starts
* with `bits` zero bits. It is open (no third party, nothing to sign up for), and the same few lines serve the phone,
* the screen and the service. SHA-256 is written out here, synchronous, for the tight loop.
*/
var K = Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
var W = /* @__PURE__ */ new Uint32Array(64);
/** SHA-256 of some bytes. */
function sha256(data) {
	const n = data.length;
	const blocks = Math.ceil((n + 9) / 64);
	const m = new Uint8Array(blocks * 64);
	m.set(data);
	m[n] = 128;
	const bits = n * 8;
	const view = new DataView(m.buffer);
	view.setUint32(m.length - 8, Math.floor(bits / 2 ** 32));
	view.setUint32(m.length - 4, bits >>> 0);
	let h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762, h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225;
	for (let b = 0; b < blocks; b++) {
		for (let i = 0; i < 16; i++) W[i] = view.getUint32(b * 64 + i * 4);
		for (let i = 16; i < 64; i++) {
			const x = W[i - 15], y = W[i - 2];
			const s0 = (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
			const s1 = (y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ y >>> 10;
			W[i] = W[i - 16] + s0 + W[i - 7] + s1 | 0;
		}
		let a = h0, bb = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
		for (let i = 0; i < 64; i++) {
			const S1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
			const t1 = h + S1 + (e & f ^ ~e & g) + K[i] + W[i] | 0;
			const t2 = ((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + (a & bb ^ a & c ^ bb & c) | 0;
			h = g;
			g = f;
			f = e;
			e = d + t1 | 0;
			d = c;
			c = bb;
			bb = a;
			a = t1 + t2 | 0;
		}
		h0 = h0 + a | 0;
		h1 = h1 + bb | 0;
		h2 = h2 + c | 0;
		h3 = h3 + d | 0;
		h4 = h4 + e | 0;
		h5 = h5 + f | 0;
		h6 = h6 + g | 0;
		h7 = h7 + h | 0;
	}
	const out = /* @__PURE__ */ new Uint8Array(32);
	const ov = new DataView(out.buffer);
	[
		h0,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		h7
	].forEach((v, i) => ov.setUint32(i * 4, v >>> 0));
	return out;
}
var enc$1 = new TextEncoder();
/** How many zero bits a digest starts with. */
function leadingZeroBits(d) {
	let n = 0;
	for (const byte of d) {
		if (byte === 0) {
			n += 8;
			continue;
		}
		return n + Math.clz32(byte) - 24;
	}
	return n;
}
/** Whether `x` is a solution: SHA-256("<challenge>:<x>") starts with `bits` zero bits. */
var workDone = (challenge, x, bits) => leadingZeroBits(sha256(enc$1.encode(`${challenge}:${x}`))) >= bits;
/**
* Find a solution (a base-36 counter), giving the page a moment every few thousand tries so it stays responsive.
* Null past `maxTries` (about 2^bits tries are needed on average).
*/
async function solveWork(challenge, bits, maxTries = 2 ** 26) {
	for (let i = 0; i < maxTries; i++) {
		const x = i.toString(36);
		if (workDone(challenge, x, bits)) return x;
		if ((i & 4095) === 4095) await new Promise((r) => setTimeout(r, 0));
	}
	return null;
}
//#endregion
//#region ../packages/core/src/code.ts
/**
* The short code (PROTOCOL §2b): ten digits to type on a phone instead of scanning the QR code, for a TV, a headset,
* or a phone across the room. The first five are a handle the room service keeps for a few minutes (handle -> room);
* the last five are a secret that never leaves the two devices. Once the phone is in the room, the two run a PAKE on
* the secret over the DTLS channel: CPace's construction on X25519, bound to both DTLS fingerprints. Someone without
* the secret, the room service included, gets one guess per code, and the host retires a code after its one attempt.
*
* Every code is ten digits and starts with 1 to 9, so no code is the start of another (a leading 0 is kept for a longer
* code, should one ever be needed).
*/
var isCodeHandle = (s) => typeof s === "string" && /^[1-9]\d{4}$/.test(s);
/** Uniformly random decimal digits (rejection sampling, so no digit is likelier than another). */
function randomDigits(n) {
	const buf = /* @__PURE__ */ new Uint32Array(1);
	let out = "";
	while (out.length < n) {
		crypto.getRandomValues(buf);
		if (buf[0] >= 4294967290) continue;
		out += String(buf[0] % 10);
	}
	return out;
}
var P = (1n << 255n) - 19n;
var J = 486662n;
var A24 = 121665n;
var mod = (a) => {
	const r = a % P;
	return r < 0n ? r + P : r;
};
function pow(b, e) {
	let r = 1n;
	b = mod(b);
	while (e > 0n) {
		if (e & 1n) r = r * b % P;
		b = b * b % P;
		e >>= 1n;
	}
	return r;
}
/** 1/a, and 0 for 0 (inv0). */
var inv = (a) => pow(a, P - 2n);
var isSquare = (a) => pow(a, (P - 1n) / 2n) !== P - 1n;
var toLE = (n) => Uint8Array.from({ length: 32 }, (_, i) => Number(n >> BigInt(8 * i) & 255n));
function fromLE(b) {
	let n = 0n;
	for (let i = b.length - 1; i >= 0; i--) n = n << 8n | BigInt(b[i]);
	return n;
}
/** The Montgomery ladder on curve25519: the u-coordinate of k·(u), for any k below 2^bits (no clamping). */
function ladder(k, u, bits = 255) {
	const x1 = mod(u);
	let x2 = 1n, z2 = 0n, x3 = x1, z3 = 1n, swap = 0n;
	for (let t = bits - 1; t >= 0; t--) {
		const kt = k >> BigInt(t) & 1n;
		if (swap ^ kt) {
			[x2, x3] = [x3, x2];
			[z2, z3] = [z3, z2];
		}
		swap = kt;
		const a = mod(x2 + z2), aa = a * a % P, b = mod(x2 - z2), bb = b * b % P, e = mod(aa - bb);
		const c = mod(x3 + z3), da = mod(x3 - z3) * a % P, cb = c * b % P;
		const s = mod(da + cb), m = mod(da - cb);
		x3 = s * s % P;
		z3 = x1 * (m * m % P) % P;
		x2 = aa * bb % P;
		z2 = e * mod(aa + A24 * e) % P;
	}
	if (swap) {
		[x2, x3] = [x3, x2];
		[z2, z3] = [z3, z2];
	}
	return x2 * inv(z2) % P;
}
/** X25519(k, u) as RFC 7748 defines it: the scalar clamped, the top bit of u ignored, 32 bytes little-endian. */
function x25519(scalar, u) {
	const k = Uint8Array.from(scalar);
	k[0] &= 248;
	k[31] = k[31] & 127 | 64;
	const uu = Uint8Array.from(u);
	uu[31] &= 127;
	return toLE(ladder(fromLE(k), fromLE(uu)));
}
/** Elligator 2 onto curve25519 (Z = 2), the u-coordinate only: RFC 9380's map_to_curve_elligator2. */
function elligator2(u) {
	let t = mod(2n * u * u);
	if (t === P - 1n) t = 0n;
	const x1 = mod(-486662n * inv(t + 1n));
	return isSquare(mod((mod((x1 + J) * x1) + 1n) * x1)) ? x1 : mod(-x1 - J);
}
var enc = new TextEncoder();
var LABEL = "obpal code v1";
/** Length-prefixed concatenation (one length byte each), so no two different inputs run together the same way. */
function lv(...parts) {
	const bytes = parts.map((p) => typeof p === "string" ? enc.encode(p) : p);
	const out = new Uint8Array(bytes.reduce((n, b) => n + 1 + b.length, 0));
	let o = 0;
	for (const b of bytes) {
		if (b.length > 255) throw new Error("field too long");
		out[o++] = b.length;
		out.set(b, o);
		o += b.length;
	}
	return out;
}
/** The code's generator: SHA-512 over the label, the secret, the handle and the room, mapped onto the curve. */
async function generator(secret, handle, room) {
	const u = new Uint8Array(await crypto.subtle.digest("SHA-512", lv(LABEL, secret, handle, room))).slice(0, 32);
	u[31] &= 127;
	return toLE(elligator2(fromLE(u)));
}
var allZero = (b) => b.every((x) => x === 0);
var platformX25519 = null;
/** Whether WebCrypto here does X25519 (asked once). */
var hasPlatformX25519 = () => platformX25519 ??= crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveBits"]).then(() => true, () => false);
async function ephemeral(ladderOnly = false) {
	if (!ladderOnly && await hasPlatformX25519()) return { platform: (await crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveBits"])).privateKey };
	return { scalar: crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(32)) };
}
/** X25519 of this side's key and `u`, or null for an all-zero result (a low-order `u`, which would fix the key). */
async function dh(key, u) {
	if ("scalar" in key) {
		const k = x25519(key.scalar, u);
		return allZero(k) ? null : k;
	}
	try {
		const pub = await crypto.subtle.importKey("raw", u, { name: "X25519" }, false, []);
		const k = new Uint8Array(await crypto.subtle.deriveBits({
			name: "X25519",
			public: pub
		}, key.platform, 256));
		return allZero(k) ? null : k;
	} catch {
		return null;
	}
}
/**
* One side of the short-code exchange. Each side sends `share`; with the other's share, `confirm` gives the
* confirmation to send (`mine`) and the one to expect (`theirs`). They match only if both used the same secret,
* handle and room and see the same two DTLS fingerprints.
*/
var CodePake = class CodePake {
	constructor(role, key, share, handle, room) {
		this.role = role;
		this.key = key;
		this.share = share;
		this.handle = handle;
		this.room = room;
	}
	/** `ladderOnly`: use the ladder even where the platform has X25519 (tests check the two agree). */
	static async start(role, p, o = {}) {
		const g = await generator(p.secret, p.handle, p.room);
		const key = await ephemeral(o.ladderOnly);
		const share = await dh(key, g);
		if (!share) throw new Error("The code’s generator is a low-order point");
		return new CodePake(role, key, share, p.handle, p.room);
	}
	/** Null when the other share is unusable (wrong size, or a low-order point that would fix the key). */
	async confirm(other, fpDevice, fpHost) {
		if (other.length !== 32 || allZero(other)) return null;
		const k = await dh(this.key, other);
		if (!k) return null;
		const [shareDevice, shareHost] = this.role === "device" ? [this.share, other] : [other, this.share];
		const base = await crypto.subtle.importKey("raw", k, "HKDF", false, ["deriveKey"]);
		const isk = await crypto.subtle.deriveKey({
			name: "HKDF",
			hash: "SHA-256",
			salt: enc.encode(LABEL),
			info: lv(shareDevice, shareHost, fpDevice, fpHost, this.room, this.handle)
		}, base, {
			name: "HMAC",
			hash: "SHA-256",
			length: 256
		}, false, ["sign"]);
		const mac = async (who) => b64url(new Uint8Array(await crypto.subtle.sign("HMAC", isk, enc.encode(`${LABEL} ${who}`))));
		const [host, device] = await Promise.all([mac("host"), mac("device")]);
		return this.role === "device" ? {
			mine: device,
			theirs: host
		} : {
			mine: host,
			theirs: device
		};
	}
};
//#endregion
//#region ../packages/core/src/store.ts
/**
* What a device or host keeps between sessions, in IndexedDB: its own DTLS certificate (so its fingerprint is
* stable and the other side can pin it) and the pairings it remembers. Everything degrades to "this session
* only" where storage is unavailable (private mode, storage denied, a browser that can't store certificates).
*/
var DB = "obpal";
var VERSION = 2;
var CERT_TTL = 31536e6;
/** Renew a certificate this close to its expiry, so a pairing never breaks mid-week. */
var CERT_RENEW = 6048e5;
var memory = {
	certs: /* @__PURE__ */ new Map(),
	pairs: /* @__PURE__ */ new Map(),
	connections: /* @__PURE__ */ new Map()
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
				if (!db.objectStoreNames.contains("connections")) db.createObjectStore("connections", { keyPath: "id" });
			};
			req.onsuccess = () => {
				req.result.onversionchange = () => {
					req.result.close();
					dbPromise = null;
				};
				resolve(req.result);
			};
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
				t.oncomplete = () => resolve(req.result);
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
	const rows = await tx("pairs", "readonly", (s) => s.getAll()) ?? [...memory.pairs.values()];
	return (await Promise.all(rows.map((r) => readPair(r)))).filter((p) => !!p).sort((a, b) => b.at - a.at);
}
async function putPair(p) {
	memory.pairs.set(p.id, p);
	await tx("pairs", "readwrite", (s) => s.put(p));
}
async function forgetPair(id) {
	memory.pairs.delete(id);
	await tx("pairs", "readwrite", (s) => s.delete(id));
}
/**
* A stored row as a pairing, or null for anything that isn't one. A row that still holds its key's bytes is turned
* into a non-extractable key and written back (`save`: where, putPair unless a test says otherwise), so the bytes
* don't outlive their first read.
*/
async function readPair(row, save = putPair) {
	if (isPair(row)) return row;
	if (!hasPairFields(row) || !(row.key instanceof Uint8Array) || row.key.length !== 32) return null;
	const bytes = row;
	const p = {
		id: bytes.id,
		key: await importPairKey(bytes.key),
		peerFp: bytes.peerFp,
		peerName: bytes.peerName,
		at: bytes.at
	};
	bytes.key.fill(0);
	await save(p);
	return p;
}
/** Everything a pairing has but its key. */
function hasPairFields(x) {
	const p = x;
	return !!p && typeof p === "object" && typeof p.id === "string" && p.peerFp instanceof Uint8Array && p.peerFp.length === 32 && typeof p.peerName === "string" && typeof p.at === "number";
}
/** A pairing whose key is kept as it should be: a non-extractable HKDF key. */
function isPair(x) {
	if (!hasPairFields(x)) return false;
	const k = x.key;
	return typeof CryptoKey !== "undefined" && k instanceof CryptoKey && k.algorithm.name === "HKDF" && !k.extractable;
}
var PointerFlag = {
	/** The device has an orientation; without it the angles are meaningless. */
	valid: 1,
	/** Only changes carry meaning (integrated turn rate for a mouse), not the absolute angle. */
	relative: 2,
	/** The device asks for the Wii shooter's edge turn (CATALOGUE §4). */
	edgeTurn: 4
};
function decodePointer(buf) {
	if (buf.byteLength < 16) return null;
	const dv = new DataView(buf);
	if (dv.getUint8(0) !== 20) return null;
	return {
		flags: dv.getUint8(1),
		seq: dv.getUint16(2, true),
		t: dv.getUint32(4, true),
		yaw: dv.getInt16(8, true) / 100,
		pitch: dv.getInt16(10, true) / 100,
		gen: dv.getUint8(12)
	};
}
/**
* Change of aim from packet `b` to packet `a` in degrees, wrap-safe (the wire is 0.01° in an int16).
* Zero across a recentre (a different generation), so a relative mouse never jumps.
*/
function pointerDelta(a, b) {
	if (a.gen !== b.gen) return [0, 0];
	const d = (x, y) => ((Math.round((x - y) * 100) % 65536 + 98304) % 65536 - 32768) / 100;
	return [d(a.yaw, b.yaw), d(a.pitch, b.pitch)];
}
var PoseFlag = {
	tracked: 1,
	touching: 2
};
function decodePose(buf) {
	if (buf.byteLength < 32) return null;
	const dv = new DataView(buf);
	if (dv.getUint8(0) !== 21) return null;
	const p = [
		dv.getFloat32(8, true),
		dv.getFloat32(12, true),
		dv.getFloat32(16, true)
	];
	if (!p.every(Number.isFinite) || p.some((v) => Math.abs(v) > 1e3)) return null;
	const q = [
		0,
		1,
		2,
		3
	].map((i) => dv.getInt16(20 + i * 2, true) / 32767);
	const l = Math.hypot(...q) || 1;
	return {
		flags: dv.getUint8(1),
		seq: dv.getUint16(2, true),
		t: dv.getUint32(4, true),
		p,
		q: q.map((v) => v / l),
		gen: dv.getUint8(28)
	};
}
/**
* Motion below this (as a fraction of full travel, 0.01 = 1.8°/s) counts as a still phone, so sensor noise
* never rides the deadzone jump into the game.
*/
var REST = .01;
var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
/** Player-space turn rates (yaw + = left, pitch + = up, °/s) as a raw stick vector (+x right, +y down). */
function rateToUnit(yawDps, pitchDps, full = 180) {
	return [clamp(-yawDps / full, -1, 1), clamp(-pitchDps / full, -1, 1)];
}
/**
* The deadzone jump: `sign(v) · (d + (1 − d) · |v|)` applied to the vector's magnitude, so any deliberate motion
* lands past the game's deadzone `d` while the direction stays exact. Below `rest` the phone counts as still.
*/
function jumpDeadzone(v, d, rest = REST) {
	const m = Math.hypot(v[0], v[1]);
	if (m <= rest) return [0, 0];
	const out = d + (1 - d) * Math.min(1, m);
	return [v[0] / m * out, v[1] / m * out];
}
/** Sum of stick vectors, clamped to the unit circle (a thumb plus motion can't exceed a full deflection). */
function addStick(a, b) {
	const x = a[0] + b[0];
	const y = a[1] + b[1];
	const m = Math.hypot(x, y);
	return m > 1 ? [x / m, y / m] : [x, y];
}
/**
* What a stick finally carries: the thumb alone when no motion contributes, otherwise the thumb plus every
* contribution, clamped, then one deadzone jump (the largest requested), so two small inputs never jump twice.
*/
function mixStick(thumb, motions) {
	let sum = [0, 0];
	let d = 0;
	let live = false;
	for (const m of motions) {
		if (m.v[0] === 0 && m.v[1] === 0) continue;
		live = true;
		sum = addStick(sum, m.v);
		d = Math.max(d, m.deadzone);
	}
	if (!live) return [thumb[0], thumb[1]];
	return jumpDeadzone(addStick(thumb, sum), d);
}
//#endregion
//#region ../packages/core/src/buttons.ts
var padButton = (i, standard) => `pad:${standard ? "" : "raw:"}b${i}`;
/** A media input and Back arrive as one event, with no release: they tap, and can't hold anything. */
var tapsOnly = (id) => id === "back" || id.startsWith("media:");
[...Array.from({ length: 17 }, (_, i) => `pad:b${i}`), ...[
	0,
	1,
	2,
	3
].flatMap((i) => [`pad:a${i}-`, `pad:a${i}+`])];
var PAD_CONTROLS = [
	"a",
	"b",
	"x",
	"y",
	"lb",
	"rb",
	"lt",
	"rt",
	"view",
	"menu",
	"ls",
	"rs",
	"up",
	"down",
	"left",
	"right",
	"guide"
];
/**
* The controls a physical input may press on each controller (CATALOGUE §9.1: ControllerSpec.controls), keyed by
* controller id. The gamepad's are PAD's buttons in the standard order. On any controller an input may also press a key
* on the screen (KEY_TARGETS) where the screen takes typing.
*/
var CONTROLS = {
	"face.drums": [
		"kick",
		"snare",
		"hat"
	],
	"face.keys": [
		"note1",
		"note2",
		"note3",
		"note4",
		"note5",
		"note6",
		"note7",
		"note8",
		"sustain",
		"octaveup",
		"octavedown"
	],
	"face.gamepad": PAD_CONTROLS,
	"face.wheel": PAD_CONTROLS,
	"face.wii": [
		"a",
		"b",
		"minus",
		"home",
		"plus"
	],
	"face.mouse": [
		"left",
		"right",
		"middle",
		"wheel",
		"minus",
		"plus",
		"home"
	],
	"face.trackpad": ["grab", "level"],
	"face.hand": ["hold", "recentre"],
	"face.keyboard": [
		"key-Escape",
		"key-Tab",
		"key-ArrowLeft",
		"key-ArrowUp",
		"key-ArrowDown",
		"key-ArrowRight",
		"key-Backspace",
		"key-Enter"
	]
};
/**
* The inputs that stand for the four hardware actions a host could bind before bindings (Layout.keys): primary is
* volume up, Enter, Space or one headset press; secondary volume down, Esc or Backspace; next and previous the arrows,
* Page Up and Down, or two and three headset presses. A pad's A, B and D-pad take the same rows.
*/
var ACTION_INPUTS = {
	primary: [
		"key:AudioVolumeUp",
		"key:Enter",
		"key:NumpadEnter",
		"key:Space",
		"key:MediaPlayPause",
		"media:playpause",
		"pad:b0"
	],
	secondary: [
		"key:AudioVolumeDown",
		"key:Escape",
		"key:Backspace",
		"pad:b1"
	],
	next: [
		"key:ArrowRight",
		"key:PageDown",
		"key:MediaTrackNext",
		"media:nexttrack",
		"pad:b15"
	],
	prev: [
		"key:ArrowLeft",
		"key:PageUp",
		"key:MediaTrackPrevious",
		"media:previoustrack",
		"pad:b14"
	]
};
/** The four actions pressing these targets, as input -> target; tap-only inputs skip a target that must be held. */
function fromActions(t, heldOnly = []) {
	const out = {};
	for (const [action, target] of Object.entries(t)) for (const input of ACTION_INPUTS[action]) if (!(heldOnly.includes(target) && tapsOnly(input))) out[input] = target;
	return out;
}
/** On the gamepad a pad's own buttons pass straight through: the standard mapping is already the controller's layout. */
var PAD_THROUGH = Object.fromEntries(PAD_CONTROLS.map((c, i) => [padButton(i, true), c]));
var GAMEPAD_KEYS = {
	...fromActions({
		primary: "a",
		secondary: "b",
		next: "right",
		prev: "left"
	}),
	"key:ArrowUp": "up",
	"key:ArrowDown": "down",
	...PAD_THROUGH
};
fromActions({
	primary: "kick",
	secondary: "snare",
	next: "hat"
}), fromActions({
	primary: "note1",
	secondary: "sustain",
	next: "octaveup",
	prev: "octavedown"
}, ["sustain"]), { ...GAMEPAD_KEYS }, fromActions({
	primary: "a",
	secondary: "b",
	next: "plus",
	prev: "minus"
}), fromActions({
	primary: "left",
	secondary: "wheel",
	next: "plus",
	prev: "minus"
}), fromActions({
	primary: "grab",
	secondary: "level"
}), fromActions({
	primary: "hold",
	secondary: "recentre"
}, ["hold"]);
var PAD_EXTRAS = {
	"pad:b9": "app:next",
	"pad:b8": "app:prev"
};
/** Next and previous as the screen's arrow keys, where the screen takes typing: a presentation moves on. */
var CLICKER_TO_KEYS = {
	"key:PageDown": "key-ArrowRight",
	"key:ArrowRight": "key-ArrowRight",
	"key:ArrowDown": "key-ArrowRight",
	"key:PageUp": "key-ArrowLeft",
	"key:ArrowLeft": "key-ArrowLeft",
	"key:ArrowUp": "key-ArrowLeft",
	"key:Escape": "key-Escape"
};
({ ...CLICKER_TO_KEYS }), { ...CLICKER_TO_KEYS }, { ...CLICKER_TO_KEYS }, { ...CLICKER_TO_KEYS }, { ...PAD_EXTRAS }, { ...PAD_EXTRAS }, { ...PAD_EXTRAS }, { ...PAD_EXTRAS };
//#endregion
//#region ../packages/core/src/catalogue.ts
/**
* The control catalogue (spec/CATALOGUE.md): utilities, the routes a motion utility can take, the built-in profiles,
* and the controllers built from them. Data only; the phone offers what a host's layout allows and hosts finish each
* route.
*/
var Utility = {
	pad: "pad",
	aim: "motion.aim",
	steer: "motion.steer",
	point: "motion.point",
	track: "motion.track",
	trackpad: "touch.trackpad",
	hold: "motion.hold",
	tilt: "motion.tilt",
	drums: "music.hit",
	keys: "music.note"
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
/** The ranges resolveProfile() keeps settings in, and the id a new profile may take. */
var PROFILE_LIMITS = {
	gain: [.25, 4],
	curve: [.5, 3],
	deadzone: [0, .5],
	id: /^[a-z][a-z0-9-]{1,31}$/,
	name: 40,
	for: 120,
	buttons: 32
};
/**
* The controllers a person picks from on the device (CATALOGUE §9.1): faces drawn on its screen, each built from
* utilities. A host names the ones it suggests in `layout.controllers`, the first to open; a device says which one it
* uses in `mode{c}`. The ids are stable, so pages (the embed's `modes`) and profiles can name them.
*/
var Controller = {
	gamepad: "face.gamepad",
	wheel: "face.wheel",
	wii: "face.wii",
	mouse: "face.mouse",
	trackpad: "face.trackpad",
	hand: "face.hand",
	keyboard: "face.keyboard",
	drums: "face.drums",
	keys: "face.keys"
};
/** The controllers, in the picker's order: Controller, Pointer, Touch, 3D, Keys (CATALOGUE §9.1). */
var CONTROLLERS = {
	"face.gamepad": {
		id: "face.gamepad",
		name: "Gamepad",
		category: "Controller",
		for: "Sticks, D-pad, face buttons and triggers, with gyro aim, tilt steering and pointing",
		utilities: [
			Utility.pad,
			Utility.aim,
			Utility.steer,
			Utility.point
		],
		modes: [Mode.gamepad],
		controls: CONTROLS["face.gamepad"]
	},
	"face.wheel": {
		id: "face.wheel",
		name: "Steering wheel",
		category: "Controller",
		for: "Tilt to steer, the triggers as pedals: the gamepad with the Driving profile",
		utilities: [Utility.pad, Utility.steer],
		modes: [Mode.gamepad],
		controls: CONTROLS["face.wheel"]
	},
	"face.wii": {
		id: "face.wii",
		name: "Wii remote",
		category: "Pointer",
		for: "Point at the screen: A selects, hold B to grab, − and + zoom",
		utilities: [Utility.point],
		modes: [Mode.point],
		controls: CONTROLS["face.wii"]
	},
	"face.mouse": {
		id: "face.mouse",
		name: "Air mouse",
		category: "Pointer",
		for: "Point at the screen: Left and Right click, and a wheel scrolls",
		utilities: [Utility.point],
		modes: [Mode.point],
		controls: CONTROLS["face.mouse"]
	},
	"face.trackpad": {
		id: "face.trackpad",
		name: "Trackpad",
		category: "Touch",
		for: "Drag, pan, pinch and twist; with the gyro on, turn things 1:1 or tilt them",
		utilities: [
			Utility.trackpad,
			Utility.hold,
			Utility.tilt
		],
		modes: [Mode.tilt, Mode.hold],
		controls: CONTROLS["face.trackpad"]
	},
	"face.hand": {
		id: "face.hand",
		name: "3D hand",
		category: "3D",
		for: "Hold the pad and move the phone: what you hold moves with it",
		utilities: [Utility.track],
		modes: [Mode.track],
		controls: CONTROLS["face.hand"]
	},
	"face.keyboard": {
		id: "face.keyboard",
		name: "Keyboard",
		category: "Keys",
		for: "The phone’s own keyboard types on the screen, with Esc, Tab, the arrows and Enter",
		utilities: [],
		modes: [],
		controls: CONTROLS["face.keyboard"]
	},
	"face.drums": {
		id: "face.drums",
		name: "Drums",
		category: "Music",
		for: "Velocity pads and held strike gestures",
		utilities: [Utility.drums, Utility.tilt],
		modes: [Mode.pad],
		controls: CONTROLS["face.drums"]
	},
	"face.keys": {
		id: "face.keys",
		name: "Tone keys",
		category: "Music",
		for: "Scale-locked notes, tilt bend, sustain and an air instrument",
		utilities: [Utility.keys, Utility.tilt],
		modes: [Mode.pad],
		controls: CONTROLS["face.keys"]
	}
};
Object.keys(CONTROLLERS);
var isControllerId = (x) => typeof x === "string" && Object.prototype.hasOwnProperty.call(CONTROLLERS, x);
/**
* The shape of any controller id on the wire: a kind, a dot and a name (`face.wii`, `bridge.gamepad`). Devices and hosts
* pass on well-formed ids they don't know, since a newer one may name a controller this version hasn't met.
*/
var CONTROLLER_ID = /^[a-z]{2,12}\.[a-z0-9-]{1,32}$/;
/** The tray control that opens the device's keyboard: `face.keyboard` for devices that predate controllers. */
var KEYBOARD_CONTROL = {
	id: "keyboard",
	label: "Keyboard",
	type: "keyboard",
	icon: "keyboard"
};
/** Whether controller `a` is listed, and ahead of `b` if both are. */
var ahead = (ids, a, b) => {
	const i = ids.indexOf(a);
	const j = ids.indexOf(b);
	return i >= 0 && (j < 0 || i < j);
};
/**
* A layout as every device reads it (CATALOGUE §9.2): what its `controllers` mean in the fields devices knew before
* them. Absent `modes` become the modes of the controllers, in order; `face.mouse` ahead of `face.wii` makes the Point
* face a mouse; `face.keyboard` adds the keyboard to the tray; `face.wheel` ahead of `face.gamepad` suggests the
* Driving profile. Whatever the layout sets itself is kept, and a layout that names no controllers comes back as it is.
*/
function withControllers(layout) {
	const ids = Array.isArray(layout.controllers) ? layout.controllers.filter(isControllerId) : [];
	if (!ids.length) return layout;
	const out = { ...layout };
	if (!out.modes) out.modes = [...new Set(ids.flatMap((c) => CONTROLLERS[c].modes))];
	if (!out.point && ahead(ids, Controller.mouse, Controller.wii)) out.point = "mouse";
	if (!out.profile && ahead(ids, Controller.wheel, Controller.gamepad)) out.profile = "driving";
	if (ids.includes(Controller.keyboard) && !out.tray.some((c) => c.type === "keyboard")) out.tray = [...out.tray, KEYBOARD_CONTROL];
	return out;
}
/** The controller a mode stands for on a host with this layout: what a device that says only `mode{m}` (no `c`) uses. */
function controllerOf(m, layout = {}) {
	switch (m) {
		case Mode.gamepad: return Controller.gamepad;
		case Mode.point: return layout.point === "mouse" ? Controller.mouse : Controller.wii;
		case Mode.track: return Controller.hand;
		case Mode.hold:
		case Mode.tilt:
		case Mode.orbit:
		case Mode.pad: return Controller.trackpad;
		default: return null;
	}
}
/**
* What a device's `mode{m, c?, p?}` says it uses (CATALOGUE §9.4): its controller (`c`, else the one its mode stands for
* on this host) and its profile (`p`). Each is kept only when well formed; a well-formed id this version doesn't know
* passes, since a newer device may name a controller or a community profile.
*/
function readMode(msg, layout = {}) {
	const controller = (typeof msg.c === "string" && CONTROLLER_ID.test(msg.c) ? msg.c : void 0) ?? (typeof msg.m === "number" ? controllerOf(msg.m, layout) ?? void 0 : void 0);
	const profile = typeof msg.p === "string" && PROFILE_LIMITS.id.test(msg.p) ? msg.p : void 0;
	return {
		...controller ? { controller } : {},
		...profile ? { profile } : {}
	};
}
//#endregion
//#region ../packages/core/src/sim.ts
/** Bound work before dispatch. Prototype keys and non-finite data never reach a scene adapter. */
function validSimMessage(value) {
	const m = value;
	if (!m || m.t !== "sim" || m.v !== 1 || ![
		"watch",
		"input",
		"frame"
	].includes(m.kind) || !Number.isSafeInteger(m.seq) || m.seq < 0) return false;
	let count = 0;
	function valid(v, depth) {
		if (++count > 16e3 || depth > 12) return false;
		if (v === null || typeof v === "boolean") return true;
		if (typeof v === "number") return Number.isFinite(v) && Math.abs(v) <= 1e9;
		if (typeof v === "string") return v.length <= 2048;
		if (Array.isArray(v)) return v.length <= 4096 && v.every((x) => valid(x, depth + 1));
		if (typeof v === "object") return Object.entries(v).every(([k, x]) => k.length <= 64 && ![
			"__proto__",
			"prototype",
			"constructor"
		].includes(k) && valid(x, depth + 1));
		return false;
	}
	return valid(m.data, 0);
}
//#endregion
//#region ../packages/host/src/stream.ts
/** A pointer stream that stops (the utility was switched off, the phone went away) is gone after this long. */
var POINTER_STALE_MS = 300;
/** A silent pad releases its controls before its connection expires. */
var PAD_STALE_MS = 300;
/** A pose stream that stops is gone after this long. */
var POSE_STALE_MS = 250;
var zeroAcc = () => ({
	aim: [0, 0],
	pad1: [0, 0],
	pad2: [0, 0],
	zoom: 0,
	twist: 0
});
function combineAcc(a, b, k) {
	return {
		aim: [a.aim[0] + b.aim[0] * k, a.aim[1] + b.aim[1] * k],
		pad1: [a.pad1[0] + b.pad1[0] * k, a.pad1[1] + b.pad1[1] * k],
		pad2: [a.pad2[0] + b.pad2[0] * k, a.pad2[1] + b.pad2[1] * k],
		zoom: a.zoom + b.zoom * k,
		twist: a.twist + b.twist * k
	};
}
var lerpAcc = (a, b, t) => combineAcc(a, combineAcc(b, a, -1), t);
/** One device's input: its STATE, PAD and POINTER packets, buffered and interpolated for the host's frames. */
var Stream = class {
	constructor(hooks, latency = "smooth") {
		this.hooks = hooks;
		this.latency = latency;
		this.latest = null;
		this.padState = null;
		this.padAt = 0;
		this.ptr = null;
		this.ptrAt = 0;
		this.pose = null;
		this.poseAt = 0;
		this.stateAt = 0;
		this.latestAcc = null;
		this.outAcc = null;
		this.outMode = null;
		this.lastConsumeAt = 0;
		this.buf = [];
		this.offsets = [];
		this.tBase = 0;
		this.tLast = -1;
		this.lastMode = null;
	}
	reset() {
		this.padState = null;
		this.padAt = 0;
		this.ptr = null;
		this.ptrAt = 0;
		this.pose = null;
		this.poseAt = 0;
		this.stateAt = 0;
		this.latest = null;
		this.latestAcc = null;
		this.outAcc = null;
		this.outMode = null;
		this.buf = [];
		this.offsets = [];
		this.tBase = 0;
		this.tLast = -1;
		this.lastMode = null;
	}
	unwrapMs(t) {
		if (this.tLast >= 0 && t < this.tLast && this.tLast - t > 2147483648) this.tBase += 4294967296;
		this.tLast = t;
		return (this.tBase + t) / 1e3;
	}
	onState(data) {
		const s = decodeState(data);
		if (!s || this.latest && !seqNewer(s.seq, this.latest.seq)) return;
		const now = performance.now();
		const dev = this.unwrapMs(s.t);
		this.offsets.push([now, now - dev]);
		while (this.offsets.length && now - this.offsets[0][0] > 2e3) this.offsets.shift();
		const offset = Math.min(...this.offsets.map((o) => o[1]));
		const acc = this.latest && this.latestAcc ? combineAcc(this.latestAcc, accumDelta(s, this.latest), 1) : zeroAcc();
		this.buf.push({
			t: dev + offset,
			s,
			acc
		});
		if (this.buf.length > 40) this.buf.shift();
		this.latest = s;
		this.latestAcc = acc;
		this.stateAt = now;
		if (s.mode !== this.lastMode) {
			this.lastMode = s.mode;
			this.hooks.mode(s.mode);
		}
		this.hooks.input();
	}
	onPad(data) {
		const p = decodePad(data);
		if (!p || this.padState && !seqNewer(p.seq, this.padState.seq)) return;
		const was = this.padLive;
		this.padState = p;
		this.padAt = performance.now();
		if (!was) this.hooks.pad(true);
		this.hooks.input();
	}
	onPointer(data) {
		const p = decodePointer(data);
		if (!p || !(p.flags & PointerFlag.valid) || this.ptr && !seqNewer(p.seq, this.ptr.seq)) return;
		this.ptr = p;
		this.ptrAt = performance.now();
		this.hooks.input();
	}
	onPose(data) {
		const p = decodePose(data);
		if (!p || this.pose && p.gen === this.pose.gen && !seqNewer(p.seq, this.pose.seq)) return;
		this.pose = p;
		this.poseAt = performance.now();
		this.hooks.input();
	}
	get padLive() {
		return !!this.padState && performance.now() - this.padAt < 1500;
	}
	/** Latest controller state, neutral after a short silence, null once the pad expires. */
	get pad() {
		if (this.padState && !this.padLive) {
			this.padState = null;
			this.hooks.pad(false);
		}
		if (this.padState && performance.now() - this.padAt >= PAD_STALE_MS) return {
			...emptyPad(),
			seq: this.padState.seq,
			t: this.padState.t
		};
		return this.padState;
	}
	/**
	* Where the device points (PROTOCOL §6) while a pointing utility is on, else null. Absolute pointers (the Wii-style
	* cursor) end the moment the pad says Point is off; any pointer ends after a short silence.
	*/
	get pointer() {
		const p = this.ptr;
		if (!p) return null;
		const pad = this.padState;
		if (pad && this.padLive && !(p.flags & PointerFlag.relative) && !(pad.flags & PadFlag.point) && this.padAt >= this.ptrAt || performance.now() - this.ptrAt > POINTER_STALE_MS) {
			this.ptr = null;
			return null;
		}
		return p;
	}
	/** Read input for this frame. Call once per rendered frame (e.g. inside requestAnimationFrame). */
	consume(now, connected) {
		const s = this.latest;
		const frame = {
			connected,
			mode: s?.mode ?? Mode.hold,
			tier: s?.tier ?? Tier.touch,
			clutch: false,
			grab: s?.grab ?? 0,
			qRel: qIdentity(),
			touching: false,
			aim: [0, 0],
			tilt: [0, 0],
			pad1: [0, 0],
			pad2: [0, 0],
			zoom: 0,
			twist: 0,
			pose: this.pose && now - this.poseAt < POSE_STALE_MS ? {
				p: this.pose.p,
				q: this.pose.q,
				tracked: (this.pose.flags & PoseFlag.tracked) !== 0,
				touching: (this.pose.flags & PoseFlag.touching) !== 0,
				gen: this.pose.gen
			} : null
		};
		if (this.padLive && this.padAt > this.stateAt) {
			frame.mode = Mode.gamepad;
			return frame;
		}
		if (!s || !this.buf.length) return frame;
		let ai = this.buf.length - 1;
		let bi = -1;
		let alpha = 0;
		if (this.latency !== "direct") {
			const target = now - 1e3 / 60;
			ai = 0;
			for (let i = this.buf.length - 1; i >= 0; i--) if (this.buf[i].t <= target) {
				ai = i;
				if (i + 1 < this.buf.length) {
					bi = i + 1;
					alpha = Math.min(1, Math.max(0, (target - this.buf[i].t) / Math.max(1, this.buf[bi].t - this.buf[i].t)));
				}
				break;
			}
		}
		const A = this.buf[ai];
		const B = bi >= 0 ? this.buf[bi] : null;
		const accNow = B ? lerpAcc(A.acc, B.acc, alpha) : A.acc;
		const fresh = !!this.outAcc && now - this.lastConsumeAt < 250;
		const d = fresh ? combineAcc(accNow, this.outAcc, -1) : zeroAcc();
		if (!fresh && this.outAcc && this.outMode === Mode.point && A.s.mode === Mode.point) d.aim = [accNow.aim[0] - this.outAcc.aim[0], accNow.aim[1] - this.outAcc.aim[1]];
		this.outAcc = accNow;
		this.outMode = A.s.mode;
		this.lastConsumeAt = now;
		frame.aim = d.aim;
		frame.pad1 = d.pad1;
		frame.pad2 = d.pad2;
		frame.zoom = d.zoom;
		frame.twist = d.twist;
		frame.touching = (s.flags & Flag.touching) !== 0;
		const a = A.s;
		const b = B?.s;
		frame.mode = a.mode;
		frame.tilt = b ? [a.tilt[0] + (b.tilt[0] - a.tilt[0]) * alpha, a.tilt[1] + (b.tilt[1] - a.tilt[1]) * alpha] : a.tilt;
		frame.clutch = (a.flags & Flag.clutch) !== 0;
		frame.grab = a.grab;
		frame.qRel = a.qRel;
		if (b && frame.clutch && b.flags & Flag.clutch && b.grab === a.grab) frame.qRel = qSlerp(a.qRel, b.qRel, Math.min(1, Math.max(0, alpha)));
		const silent = now - this.stateAt;
		if (silent > 250) {
			const k = Math.max(0, 1 - (silent - 250) / 150);
			frame.tilt = [frame.tilt[0] * k, frame.tilt[1] * k];
			frame.touching = false;
		}
		return frame;
	}
};
//#endregion
//#region \0vite/preload-helper.js
var scriptRel = /* @__PURE__ */ (function detectScriptRel() {
	const relList = typeof document !== "undefined" && document.createElement("link").relList;
	return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
})();
var assetsURL = function(dep) {
	return "/" + dep;
};
var seen = {};
var __vitePreload = function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises) {
			return Promise.all(promises.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		function importMetaResolve(specifier) {
			if (import.meta.resolve) return import.meta.resolve(specifier);
			return new URL(
				specifier,
				/** #__KEEP__ */
				import.meta.url
			).href;
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			dep = importMetaResolve(dep);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			for (let i = links.length - 1; i >= 0; i--) {
				const link = links[i];
				if (link.href === dep && (!isCss || link.rel === "stylesheet")) return;
			}
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}).filter((p) => p !== void 0));
	}
	function handlePreloadError(err) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
};
//#endregion
//#region ../packages/host/src/remote.ts
/** At most this many kept rooms: past it, the oldest nobody is connected through goes. */
var MAX_KEPT_ROOMS = 8;
/**
* The room service as an origin: https, or http only on this machine (localhost, 127.0.0.1, [::1]). It becomes the
* pairing link, the QR code and the chip's link, so anything else (a javascript: or data: URL) is refused.
*/
function serviceOrigin(service) {
	let u = null;
	try {
		u = new URL(service);
	} catch {}
	const local = !!u && [
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(u.hostname);
	if (!u || !(u.protocol === "https:" || u.protocol === "http:" && local)) throw new Error(`ob.Pal: the service must be an https URL, not "${service}"`);
	return u.origin;
}
var isObpalOrigin = () => typeof location !== "undefined" && (/(^|\.)blackboxes\.(net|dev)$/.test(location.hostname) || location.hostname === "localhost" || location.hostname === "127.0.0.1");
var DEFAULT_LAYOUT = {
	v: 1,
	tray: [],
	modes: [
		Mode.tilt,
		Mode.hold,
		Mode.point
	]
};
/** How long the direct code's offer may gather host candidates before the code is published. */
var LAN_GATHER_MS = 800;
/**
* Participant colours in a shared scene, in the order they're handed out: the Blackboxes family accents (sky, rose,
* amber, mint, lavender, lime, turquoise, candy), so a device can wear its colour as its accent. The screen's own
* colour is skipped.
*/
var PARTICIPANT_COLORS = [
	"#38bdf8",
	"#fb7185",
	"#fcd34d",
	"#6ee7b7",
	"#d2c3f6",
	"#c6ff34",
	"#99e1d9",
	"#b2d5e5"
];
var quiet = {
	mode: () => {},
	pad: () => {},
	input: () => {}
};
/** Host side of an ob-pal link, for any web page. */
var Remote = class Remote {
	constructor(opts) {
		this.opts = opts;
		this.status = "starting";
		this.pairingUrl = "";
		this.deviceName = null;
		this.secret = newSecret();
		this.fp = /* @__PURE__ */ new Uint8Array(32);
		this.roomId = "";
		this.ice = [];
		this.iceSet = null;
		this.iceTimer = null;
		this.iceLoaded = false;
		this.iceFirstDone = () => {};
		this.early = /* @__PURE__ */ new Map();
		this.destroyed = false;
		this.kept = [];
		this.moving = Promise.resolve();
		this.peers = /* @__PURE__ */ new Map();
		this.active = null;
		this.pairs = [];
		this.lan = null;
		this.lanChoice = null;
		this.lanBusy = Promise.resolve();
		this.connectedAt = 0;
		this.firstInputAt = 0;
		this.idle = new Stream(quiet);
		this.values = {};
		this.host = {
			id: "host",
			name: "Screen",
			color: "#c6ff34"
		};
		this.nodes = [];
		this.nodesVersion = 0;
		this.held = {};
		this.scenePending = false;
		this.handlers = {
			status: [],
			connect: [],
			disconnect: [],
			join: [],
			leave: [],
			button: [],
			text: [],
			toss: [],
			value: [],
			mode: [],
			recenter: [],
			pad: [],
			input: [],
			claim: [],
			lan: [],
			code: [],
			invite: [],
			sim: [],
			attention: []
		};
		this.cards = [];
		this.shortCode = null;
		this.spentCodes = /* @__PURE__ */ new Map();
		this.recentCodes = /* @__PURE__ */ new Map();
		this.codeWant = 0;
		this.codeTimer = null;
		this.codeWait = null;
		this.codeBackoff = 0;
		this.codeSolving = false;
		this.codeBinds = /* @__PURE__ */ new Map();
		this.service = serviceOrigin(opts.service ?? (isObpalOrigin() ? location.origin : "https://obpal.blackboxes.net"));
		this.layout = withControllers(opts.layout ?? DEFAULT_LAYOUT);
		this.iceFirst = new Promise((r) => {
			this.iceFirstDone = r;
		});
	}
	static async create(opts) {
		const r = new Remote(opts);
		await r.init();
		return r;
	}
	get seats() {
		return Math.max(1, Math.min(8, Math.floor(this.opts.seats ?? 1)));
	}
	/** A shared scene: several devices at once, each with its own claim. */
	get shared() {
		return this.seats > 1;
	}
	async init() {
		if (this.opts.remember) {
			const c = await loadCertificate("host");
			this.cert = c.cert;
			this.fp = c.fp;
			this.pairs = await listPairs();
		} else {
			this.cert = await RTCPeerConnection.generateCertificate({
				name: "ECDSA",
				namedCurve: "P-256"
			});
			this.fp = await certFingerprint(this.cert);
		}
		await this.openRoom();
		this.refreshIce();
		this.prepareLan();
	}
	/** Join the signaling room of the current secret: the invite the pairing code carries. */
	async openRoom() {
		this.roomId = await roomIdFor(this.secret);
		this.joinRoom();
	}
	/** The current invite's room (its secret and room id are set): the pairing link, and this host's socket there. */
	joinRoom() {
		this.pairingUrl = `${this.service}/p/#${encodePairing({
			secret: this.secret,
			fp: this.fp
		})}`;
		this.sig = new SignalClient(roomSocketUrl(this.service, this.roomId, "host"));
		this.sig.onmessage = (m) => this.onSignal(m);
		this.sig.onstatus = (open) => {
			if (open && this.status !== "connected") this.setStatus("ready");
			if (!open && this.status !== "connected") this.setStatus("offline");
			if (open) this.askCode();
			else this.setCode(null);
		};
		this.sig.connect();
	}
	/**
	* Fetch ICE servers, and again before their TURN credentials lapse: a relay drops an allocation whose credentials
	* have run out, and a host can stay open for days (ob.Pal Link's lives as long as the browser). They're asked for
	* with the current invite's room, since TURN is only minted for rooms with a live host (so the first fetch waits
	* until this host has joined). The credentials name no room: they serve every room this host is in.
	*/
	refreshIce(delay = 400) {
		if (this.iceTimer) clearTimeout(this.iceTimer);
		this.iceTimer = setTimeout(async () => {
			this.iceTimer = null;
			const set = await fetchIce(this.service, this.roomId);
			if (this.destroyed) return;
			const held = this.iceSet?.turn && !set.turn && (this.iceSet.expires ?? 0) - Date.now() > 6e5;
			if (!held) {
				this.iceSet = set;
				this.ice = set.servers;
			}
			this.iceLoaded = true;
			this.iceFirstDone();
			this.refreshIce(held ? 6e4 : iceRefreshIn(set));
		}, delay);
	}
	/**
	* A new invite: the old code and link stop working, and everyone connected stays. Devices that joined but haven't
	* finished connecting have to scan again.
	*/
	async resetInvite() {
		const old = this.sig;
		this.secret = newSecret();
		old.onmessage = () => {};
		old.onstatus = () => {};
		old.close();
		for (const p of [...this.peers.values()]) if (!p.bound && !p.lan && !p.room) this.dropPeer(p.id);
		this.setCode(null);
		this.spentCodes.clear();
		await this.openRoom();
		for (const c of this.cards) this.renderQr(c);
		this.emit("invite");
		this.renderCards();
	}
	/**
	* The invite moves on once a device has paired through it (rotateInvite, spec/SECURITY.md §8, L2). The room it
	* paired in is kept for it: the phone's page reloads with that room's code, and its ICE restarts come through it,
	* but the room takes offers from no one else, so a photo of the old code or a replayed link pairs nothing. A device
	* still on its way in through the old room scans the new code. A new secret makes the new room, link, QR code and
	* short code. `from` is the socket the device paired through: if the invite has moved on since, there's nothing to do.
	*/
	moveInvite(by, from) {
		this.moving = this.moving.then(async () => {
			if (by.room || this.sig !== from || this.destroyed) return;
			const secret = newSecret();
			const roomId = await roomIdFor(secret);
			if (by.room || this.sig !== from || this.destroyed) return;
			const kept = {
				secret: this.secret,
				roomId: this.roomId,
				sig: from,
				fps: /* @__PURE__ */ new Set()
			};
			for (const p of [by, ...this.peers.values()]) {
				if (p.lan || p.room) continue;
				if (p.bound || p === by) {
					p.room = kept;
					if (p.fp) kept.fps.add(b64url(p.fp));
				} else this.dropPeer(p.id);
			}
			for (const r of this.kept) for (const fp of kept.fps) r.fps.delete(fp);
			if (this.shortCode) from.send({
				t: "code",
				op: "drop"
			});
			this.setCode(null);
			this.spentCodes.clear();
			from.onmessage = (m) => this.onSignal(m, kept);
			from.onstatus = () => {};
			this.kept.push(kept);
			this.pruneKept();
			this.secret = secret;
			this.roomId = roomId;
			this.joinRoom();
			for (const c of this.cards) this.renderQr(c);
			this.emit("invite");
			this.renderCards();
		}).catch(() => {});
	}
	/**
	* Close the kept rooms nobody needs: those no device may use any more (each paired again elsewhere, or was
	* forgotten) with nobody connected through them, and past MAX_KEPT_ROOMS the oldest that nobody is connected through.
	*/
	pruneKept() {
		const used = (r) => [...this.peers.values()].some((p) => p.room === r);
		const close = (r) => {
			this.kept = this.kept.filter((k) => k !== r);
			r.sig.onmessage = () => {};
			r.sig.close();
		};
		for (const r of [...this.kept]) if (!r.fps.size && !used(r)) close(r);
		for (const r of [...this.kept]) {
			if (this.kept.length <= MAX_KEPT_ROOMS) break;
			if (!used(r)) close(r);
		}
	}
	on(ev, fn) {
		this.handlers[ev].push(fn);
		return this;
	}
	off(ev, fn) {
		const l = this.handlers[ev];
		const i = l.indexOf(fn);
		if (i >= 0) l.splice(i, 1);
		return this;
	}
	emit(ev, ...args) {
		for (const fn of this.handlers[ev]) fn(...args);
	}
	setStatus(s) {
		if (this.status === s) return;
		this.status = s;
		this.renderCards();
		this.emit("status", s);
	}
	/** Phones this host remembers, newest first. */
	get remembered() {
		return this.pairs.map((p) => ({
			id: p.id,
			name: p.peerName,
			at: p.at
		}));
	}
	/** The direct code URL (empty until a remembered phone exists and the offer has gathered). */
	get lanUrl() {
		return this.lan?.url ?? "";
	}
	/** Which remembered phone the direct code is for. */
	get lanFor() {
		return this.lan?.pairId ?? null;
	}
	/** True while the room service can't be reached (the direct code is the way in). */
	get offline() {
		return this.status === "offline";
	}
	diag() {
		return {
			status: this.status,
			connectedAt: this.connectedAt,
			firstInputAt: this.firstInputAt,
			direct: !!this.active?.lan
		};
	}
	/** Make the direct code for another remembered phone. */
	selectLan(id) {
		if (!this.pairs.some((p) => p.id === id) || this.lan?.pairId === id) return;
		this.lanChoice = id;
		this.prepareLan();
	}
	/**
	* Forget a remembered phone: it can only pair online again, and only through the invite on the screen now (the room
	* it paired in, if it was kept for it, takes it no more).
	*/
	async forget(id) {
		const gone = this.pairs.find((p) => p.id === id);
		this.pairs = this.pairs.filter((p) => p.id !== id);
		if (gone) {
			for (const r of this.kept) r.fps.delete(b64url(gone.peerFp));
			this.pruneKept();
		}
		if (this.lanChoice === id) this.lanChoice = null;
		await forgetPair(id);
		if (this.lan?.pairId === id) this.discardLan();
		this.emit("lan");
		this.prepareLan();
	}
	discardLan() {
		const l = this.lan;
		this.lan = null;
		if (l) this.dropPeer(l.peer.id);
	}
	/**
	* After an online pairing: a (new) key for this phone, handed to it in `welcome` (the one time its bytes travel) and
	* kept here only as `minted.key`, the non-extractable key made from them (mintKey). Stored in the background.
	*/
	rememberDevice(peer, name, minted) {
		if (!this.opts.remember || !peer.fp || !minted) return null;
		const rec = {
			id: this.pairs.find((p) => equalBytes(p.peerFp, peer.fp))?.id ?? b64url(randomBytes(16)),
			key: minted.key,
			peerFp: peer.fp,
			peerName: name,
			at: Date.now()
		};
		this.pairs = [rec, ...this.pairs.filter((p) => p.id !== rec.id)];
		putPair(rec).then(() => this.emit("lan"));
		const grant = {
			id: rec.id,
			key: b64url(minted.raw)
		};
		minted.raw.fill(0);
		return grant;
	}
	/** A pairing key: 32 random bytes for the grant, and the non-extractable key this host keeps (importPairKey). */
	async mintKey() {
		const raw = randomBytes(32);
		return {
			raw,
			key: await importPairKey(raw)
		};
	}
	/**
	* Prepare the direct code: an offer with this host's real ICE credentials and host candidates, already paired
	* with a synthetic answer holding the remembered phone's fingerprint and the ICE credentials both sides derive
	* from the pairing key and a fresh nonce. Its connection then waits for the phone's connectivity checks.
	*/
	prepareLan() {
		this.lanBusy = this.lanBusy.then(() => this.buildLan()).catch(() => {});
		return this.lanBusy;
	}
	async buildLan() {
		if (!this.opts.remember || this.destroyed) return;
		const pair = this.pairs.find((p) => p.id === this.lanChoice) ?? this.pairs[0];
		if (!pair) {
			if (this.lan) {
				this.discardLan();
				this.emit("lan");
			}
			return;
		}
		if (this.lan?.pairId === pair.id && this.lan.peer.pc.connectionState === "new") return;
		this.discardLan();
		const nonce = randomBytes(16);
		const id = `lan:${b64url(nonce).slice(0, 8)}`;
		const pc = new RTCPeerConnection({
			iceServers: [],
			certificates: [this.cert]
		});
		const peer = this.addPeer(id, pc, pair.peerFp);
		peer.lan = {
			pair,
			nonce
		};
		const gathered = /* @__PURE__ */ new Set();
		pc.onicecandidate = (e) => {
			if (e.candidate) gathered.add(e.candidate.candidate);
		};
		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);
		await new Promise((r) => {
			const done = () => {
				if (pc.iceGatheringState === "complete") r();
			};
			pc.addEventListener("icegatheringstatechange", done);
			setTimeout(r, LAN_GATHER_MS);
		});
		const local = readLocalIce(pc.localDescription?.sdp);
		const cands = local?.cands.length ? local.cands : candidatesOf([...gathered].join("\n"));
		if (!local || !cands.length || this.peers.get(id) !== peer) {
			this.dropPeer(id);
			return;
		}
		const creds = await lanIceCredentials(pair.key, nonce);
		await pc.setRemoteDescription({
			type: "answer",
			sdp: lanAnswerSdp({
				...creds,
				fp: pair.peerFp
			})
		});
		if (this.peers.get(id) !== peer) return;
		this.lan = {
			peer,
			pairId: pair.id,
			url: `${this.service}/p/#${encodeLanPairing({
				id: fromB64url(pair.id),
				nonce,
				ufrag: local.ufrag,
				pwd: local.pwd,
				cands
			})}`
		};
		this.emit("lan");
	}
	/** A message from the room service: in the current invite's room, or in a kept one (`room`). */
	onSignal(m, room) {
		if (m.t === "peer" && m.ev === "leave") this.peerLeft(m.id, m.clean !== false, room);
		if (m.t === "sig") this.onPayload(m.from, m.d, room);
		if (m.t === "code" && !room) this.onCode(m);
	}
	/** The socket that talks to a peer: its kept room's, or the current invite's. */
	sigOf(peer) {
		return peer.room?.sig ?? this.sig;
	}
	/**
	* A device's signaling socket went. A device that closed it (`clean`: it left or reloaded), or one still connecting,
	* goes with it. A bound device whose socket was lost stays while its connection lives, since that doesn't run
	* through the room service (and a phone that changes networks loses its socket first): it goes only if the
	* connection fails too (scheduleLost). A service that doesn't say which counts as clean.
	*/
	peerLeft(sig, clean, room) {
		if (!room) this.early.delete(sig);
		const p = this.bySig(sig, room);
		if (!p) return;
		const s = p.pc.connectionState;
		if (clean || !p.bound || s === "closed" || s === "failed") return this.dropPeer(p.id);
		if (s !== "connected") this.scheduleLost(p);
	}
	/** One peer connection with the two pre-negotiated channels, wired into this host. */
	addPeer(id, pc, fp) {
		const ctl = pc.createDataChannel("ctl", {
			negotiated: true,
			id: 0
		});
		const st = pc.createDataChannel("st", {
			negotiated: true,
			id: 1,
			ordered: false,
			maxRetransmits: 0
		});
		st.binaryType = "arraybuffer";
		const peer = {
			id,
			sig: id,
			session: null,
			renegotiating: false,
			pc,
			ctl,
			st,
			fp,
			bound: false,
			name: "Phone",
			cands: [],
			color: this.host.color,
			since: 0,
			caps: null,
			lost: null,
			nodesSent: -1,
			says: false,
			stream: new Stream({
				mode: (m) => {
					if (!(peer.says && peer.controller && isControllerId(peer.controller) ? CONTROLLERS[peer.controller] : null)?.modes.includes(m)) peer.controller = controllerOf(m, this.layout) ?? void 0;
					this.emit("mode", m, this.participant(peer));
				},
				pad: (on) => this.emit("pad", on, this.participant(peer)),
				input: () => {
					if (!this.firstInputAt) this.firstInputAt = Date.now();
					this.emit("input", this.participant(peer));
				}
			}, this.opts.latency)
		};
		this.peers.set(id, peer);
		pc.onconnectionstatechange = () => {
			const s = pc.connectionState;
			if ((s === "failed" || s === "closed" || s === "disconnected") && peer.bound) this.scheduleLost(peer);
			if ((s === "failed" || s === "closed") && !peer.bound && this.lan?.peer === peer) {
				this.lan = null;
				this.dropPeer(id);
				this.prepareLan();
			}
			if (s === "connected" && peer.lost) {
				clearTimeout(peer.lost);
				peer.lost = null;
			}
		};
		ctl.onmessage = (e) => void this.onCtl(peer, e.data);
		st.onmessage = (e) => {
			if (!this.listening(peer) || peer.paused || !(e.data instanceof ArrayBuffer)) return;
			const type = packetType(e.data);
			if (type === 18) peer.stream.onPad(e.data);
			else if (type === 20) peer.stream.onPointer(e.data);
			else if (type === 21) peer.stream.onPose(e.data);
			else peer.stream.onState(e.data);
		};
		return peer;
	}
	/** Whether a bound device's input counts: every participant in a shared scene, only the device in control otherwise. */
	listening(peer) {
		return peer.bound && (this.shared || this.active === peer);
	}
	async onPayload(id, d, room) {
		const sig = room?.sig ?? this.sig;
		if ("offer" in d) {
			const again = this.sameConnection(d.offer?.sdp, room);
			if (again) return this.renegotiate(again, id, d.offer);
			if (d.restart) {
				sig.send({
					t: "sig",
					to: id,
					d: { gone: true }
				});
				return;
			}
			const old = this.bySig(id, room);
			if (old) this.dropPeer(old.id);
			const fp = sdpFingerprint(d.offer?.sdp);
			if (!fp) return;
			if (room && !room.fps.has(b64url(fp))) {
				sig.send({
					t: "sig",
					to: id,
					d: { spent: true }
				});
				return;
			}
			if (this.status !== "connected") this.setStatus("connecting");
			const early = [];
			if (!this.iceLoaded && !room) {
				this.early.set(id, early);
				await Promise.race([this.iceFirst, new Promise((r) => setTimeout(r, REACH_TIMEOUT_MS))]);
				if (this.early.get(id) !== early) return;
				this.early.delete(id);
			}
			const pc = new RTCPeerConnection({
				iceServers: this.ice,
				certificates: [this.cert]
			});
			const peer = this.addPeer(id, pc, fp);
			peer.room = room;
			peer.session = sdpSession(d.offer.sdp);
			peer.cands.push(...early);
			pc.onicecandidate = (e) => {
				this.sigOf(peer).send({
					t: "sig",
					to: peer.sig,
					d: { cand: e.candidate?.toJSON() ?? { candidate: "" } }
				});
			};
			await pc.setRemoteDescription(d.offer);
			for (const c of peer.cands.splice(0)) await pc.addIceCandidate(c).catch(() => {});
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			this.sigOf(peer).send({
				t: "sig",
				to: id,
				d: { answer: pc.localDescription.toJSON() }
			});
		} else if ("cand" in d) {
			const peer = this.bySig(id, room);
			if (!peer) {
				if (!room) this.early.get(id)?.push(d.cand);
				return;
			}
			if (peer.pc.remoteDescription && !peer.renegotiating) await peer.pc.addIceCandidate(d.cand).catch(() => {});
			else peer.cands.push(d.cand);
		}
	}
	/** The peer that talks through signaling socket `sig`, in the current invite's room or the kept room `room`. */
	bySig(sig, room) {
		for (const p of this.peers.values()) if (p.sig === sig && p.room === room) return p;
	}
	/**
	* The bound peer an offer renegotiates, if it does: the same DTLS fingerprint and the same SDP session (a connection
	* keeps its session through all its offers; a new one starts another), on a connection that isn't closed, through
	* the room it talks through. Anyone else's offer, or a phone's new connection, is a new peer.
	*/
	sameConnection(sdp, room) {
		const fp = sdpFingerprint(sdp);
		const session = sdpSession(sdp);
		if (!fp || !session) return null;
		for (const p of this.peers.values()) if (p.bound && !p.lan && p.room === room && p.fp && p.session === session && equalBytes(p.fp, fp) && p.pc.connectionState !== "closed") return p;
		return null;
	}
	/**
	* A bound phone renegotiates its connection: an ICE restart (RFC 8445 §9), after its network changed or its path went
	* quiet. The new ICE credentials and candidates go in with fresh ICE servers (a relay then has live credentials),
	* and the DTLS session, the channels and the binding stay: the phone was proven once, and DTLS still holds both
	* fingerprints. A phone whose socket was lost and came back talks through its new one from now on.
	*/
	async renegotiate(peer, sig, offer) {
		peer.sig = sig;
		if (peer.lost) {
			clearTimeout(peer.lost);
			peer.lost = null;
		}
		peer.renegotiating = true;
		try {
			peer.pc.setConfiguration({
				...peer.pc.getConfiguration(),
				iceServers: this.ice
			});
			await peer.pc.setRemoteDescription(offer);
			await peer.pc.setLocalDescription(await peer.pc.createAnswer());
			this.sigOf(peer).send({
				t: "sig",
				to: sig,
				d: { answer: peer.pc.localDescription.toJSON() }
			});
		} catch {} finally {
			peer.renegotiating = false;
		}
		for (const c of peer.cands.splice(0)) await peer.pc.addIceCandidate(c).catch(() => {});
	}
	async onCtl(peer, data) {
		if (typeof data !== "string") return;
		if (data.length > 65536) return;
		let m;
		try {
			m = JSON.parse(data);
		} catch {
			return;
		}
		if (!peer.bound) {
			if (m.t === "pake" || m.t === "hello" && "code" in m) {
				if (peer.room) {
					this.reject(peer);
					return;
				}
				const hello = await this.codeStep(peer, m);
				if (!hello) return;
				m = hello;
			} else {
				if (m.t !== "hello" || !peer.fp) return;
				const room = peer.room ?? {
					secret: this.secret,
					roomId: this.roomId
				};
				const expected = peer.lan ? await bindMac(peer.lan.pair.key, peer.fp, this.fp, lanContext(peer.lan.nonce)) : await bindMac(room.secret, peer.fp, this.fp, room.roomId);
				if (peer.lan && m.pair !== peer.lan.pair.id) {
					this.reject(peer);
					return;
				}
				if (!equalBytes(new TextEncoder().encode(expected), new TextEncoder().encode(m.mac))) {
					this.reject(peer);
					return;
				}
			}
			const minted = !peer.lan && this.opts.remember ? await this.mintKey() : null;
			if (peer.bound || this.peers.get(peer.id) !== peer) return;
			if (this.shared && this.bound().length >= this.seats) {
				this.send(peer, {
					t: "lock",
					reason: "full"
				});
				setTimeout(() => this.dropPeer(peer.id), 200);
				return;
			}
			peer.bound = true;
			peer.via = peer.lan ? "lan" : "code" in m ? "code" : "qr";
			peer.name = String(m.name || "Phone").slice(0, 40);
			peer.caps = m.caps ?? null;
			peer.since = Date.now();
			if (this.shared) {
				peer.color = this.freeColor(peer);
				if (!this.active) this.active = peer;
			} else {
				const prev = this.active;
				if (prev && prev !== peer) {
					this.send(prev, {
						t: "lock",
						reason: "taken-over"
					});
					setTimeout(() => this.dropPeer(prev.id), 300);
				}
				this.active = peer;
			}
			peer.stream.reset();
			this.deviceName = this.active?.name ?? null;
			this.connectedAt = Date.now();
			this.firstInputAt = 0;
			if (peer.lost) {
				clearTimeout(peer.lost);
				peer.lost = null;
			}
			let pair;
			if (peer.lan) {
				this.lan = null;
				peer.lan.pair.at = Date.now();
				peer.lan.pair.peerName = peer.name;
				putPair(peer.lan.pair);
			} else pair = this.rememberDevice(peer, peer.name, minted) ?? void 0;
			peer.pair = peer.lan?.pair.id ?? pair?.id;
			const invite = "code" in m ? encodePairing({
				secret: this.secret,
				fp: this.fp
			}) : void 0;
			const kind = this.opts.kind ?? (typeof location === "undefined" ? "site" : location.protocol === "chrome-extension:" ? "pc" : location.pathname.startsWith("/sim/") ? "sim" : location.pathname.startsWith("/view/") ? "viewer" : "site");
			this.send(peer, {
				t: "welcome",
				proto: 1,
				name: this.opts.appName,
				layout: this.layout,
				attention: true,
				kind,
				...pair ? { pair } : {},
				...invite ? { invite } : {},
				...peer.lan ? {} : { restart: true }
			});
			if (this.shared) this.send(peer, {
				t: "state",
				values: {
					...this.values,
					color: peer.color
				}
			});
			if (this.opts.rotateInvite && !peer.lan && !peer.room) this.moveInvite(peer, this.sig);
			const first = this.status !== "connected";
			this.setStatus("connected");
			if (first || !this.shared) this.emit("connect", {
				name: peer.name,
				caps: m.caps
			});
			this.emit("join", this.participant(peer));
			this.renderCards();
			this.sceneChanged();
			this.prepareLan();
			return;
		}
		if (!this.listening(peer)) return;
		if (m.t === "attention" && typeof m.active === "boolean") {
			const paused = !m.active;
			if (!!peer.paused === paused) return;
			peer.paused = paused;
			const hadPad = !!peer.stream.pad;
			peer.stream.reset();
			if (hadPad) this.emit("pad", false, this.participant(peer));
			this.emit("attention", this.participant(peer));
			this.renderCards();
			return;
		}
		if (peer.paused && m.t !== "ping" && m.t !== "bye") return;
		const who = this.participant(peer);
		switch (m.t) {
			case "sim":
				if (m.kind !== "frame" && validSimMessage(m)) this.emit("sim", m, who);
				break;
			case "btn":
				this.emit("button", {
					id: m.id,
					ev: m.ev
				}, who);
				break;
			case "text": {
				const del = m.del ?? 0;
				if (typeof m.s === "string" && m.s.length <= 256 && Number.isInteger(del) && del >= 0 && del <= 256 && (m.s || del)) this.emit("text", {
					s: m.s,
					del
				}, who);
				break;
			}
			case "toss":
				if (typeof m.v === "number" && m.v > 0 && m.v <= 4) this.emit("toss", { v: m.v }, who);
				break;
			case "value":
				this.emit("value", {
					id: m.id,
					v: m.v,
					add: m.add === true
				}, who);
				break;
			case "mode": {
				const said = readMode(m, this.layout);
				if (said.controller === m.c) peer.says = true;
				peer.controller = said.controller;
				peer.profile = said.profile;
				this.emit("mode", m.m, this.participant(peer));
				break;
			}
			case "recenter":
				this.emit("recenter", who);
				break;
			case "claim":
				if (this.shared && (m.node === null || typeof m.node === "string" && m.node.length <= 64)) this.emit("claim", { node: m.node }, who);
				break;
			case "ping":
				this.send(peer, {
					t: "pong",
					t0: m.t0
				});
				break;
			case "bye": this.dropPeer(peer.id);
		}
	}
	reject(peer) {
		this.codeBinds.delete(peer);
		this.send(peer, {
			t: "lock",
			reason: "rejected"
		});
		setTimeout(() => this.dropPeer(peer.id), 200);
	}
	/** The short code to type on a phone, digits only: '' while there's none (nothing shows one, or the service can't). */
	get code() {
		return this.shortCode ? this.shortCode.handle + this.shortCode.secret : "";
	}
	/** Where to type it: the controller's start page, without the scheme ("obpal.blackboxes.net/p"). */
	get codeSite() {
		return `${this.service.replace(/^https?:\/\//, "")}/p`;
	}
	/** Keep a short code live while something shows it. Call the function it returns when nothing does any more. */
	wantCode() {
		if (this.opts.shortCode === false) return () => {};
		this.codeWant++;
		if (this.codeWant === 1) this.askCode();
		let done = false;
		return () => {
			if (done) return;
			done = true;
			if (--this.codeWant > 0) return;
			if (this.shortCode) this.sig?.send({
				t: "code",
				op: "drop"
			});
			this.setCode(null);
		};
	}
	/**
	* Ask the room service for a handle (it replaces this room's last one), with a proof of work when the service asked
	* for one. A service that doesn't answer (an older one, or a lost message) is asked again later, less often each time.
	*/
	askCode(work) {
		if (!this.codeWant || !this.sig?.open) return;
		if (this.codeTimer) {
			clearTimeout(this.codeTimer);
			this.codeTimer = null;
		}
		if (this.codeWait) clearTimeout(this.codeWait);
		this.sig.send({
			t: "code",
			op: "claim",
			...work ? { work } : {}
		});
		this.codeWait = setTimeout(() => {
			this.codeWait = null;
			this.retryCode();
		}, 15e3);
	}
	/** Show a handle from the service with a fresh secret (null: no code), and ask again before it lapses. */
	setCode(c) {
		if (this.codeTimer) {
			clearTimeout(this.codeTimer);
			this.codeTimer = null;
		}
		const had = this.code;
		const now = Date.now();
		const shown = this.shortCode;
		if (shown && shown.handle !== c?.code) this.recentCodes.set(shown.handle, {
			secret: shown.secret,
			until: now + 6e4
		});
		for (const [h, r] of this.recentCodes) if (r.until < now) this.recentCodes.delete(h);
		this.shortCode = c && this.codeWant ? {
			handle: c.code,
			secret: randomDigits(5),
			exp: c.exp
		} : null;
		if (this.shortCode) this.codeTimer = setTimeout(() => this.askCode(), Math.max(5e3, this.shortCode.exp - now - 3e4));
		if (this.code !== had) this.emit("code");
	}
	/** Ask again later: 15 s, doubling to 5 minutes, or what the service asked for if that's longer. */
	retryCode(seconds) {
		if (this.codeTimer) clearTimeout(this.codeTimer);
		this.codeBackoff = Math.min(300, this.codeBackoff ? this.codeBackoff * 2 : 15);
		this.codeTimer = setTimeout(() => this.askCode(), Math.min(300, Math.max(seconds ?? 0, this.codeBackoff)) * 1e3);
	}
	/** The service asked for a proof of work before a new code: find one, then ask again with it. */
	async solveCode(challenge, bits) {
		if (this.codeSolving) return;
		if (!(bits <= 24)) {
			this.retryCode();
			return;
		}
		this.codeSolving = true;
		const x = await solveWork(challenge, bits);
		this.codeSolving = false;
		if (x === null) this.retryCode();
		else this.askCode({
			c: challenge,
			x
		});
	}
	onCode(m) {
		const now = Date.now();
		const work = m.error === "work" && typeof m.challenge === "string" && typeof m.bits === "number";
		if (m.ev === "used") {
			const cur = this.shortCode;
			const secret = cur && cur.handle === m.code ? cur.secret : this.recentCodes.get(String(m.code))?.secret;
			if (secret && typeof m.code === "string" && typeof m.ticket === "string") this.spentCodes.set(m.code, {
				secret,
				ticket: m.ticket,
				until: now + 6e4
			});
			for (const [h, s] of this.spentCodes) if (s.until < now) this.spentCodes.delete(h);
			if (!cur || cur.handle !== m.code) return;
			if (m.next) {
				this.codeBackoff = 0;
				this.setCode(m.next);
				return;
			}
			this.setCode(null);
			if (work) this.solveCode(m.challenge, m.bits);
			else this.retryCode(m.retry);
			return;
		}
		if (this.codeWait) {
			clearTimeout(this.codeWait);
			this.codeWait = null;
		}
		if (isCodeHandle(m.code) && typeof m.exp === "number") {
			if (!this.codeWant) {
				this.sig?.send({
					t: "code",
					op: "drop"
				});
				return;
			}
			this.codeBackoff = 0;
			this.setCode({
				code: m.code,
				exp: m.exp
			});
		} else if (work) this.solveCode(m.challenge, m.bits);
		else if (m.error) {
			if (this.shortCode) this.sig?.send({
				t: "code",
				op: "drop"
			});
			this.setCode(null);
			this.retryCode(m.retry);
		}
	}
	/**
	* The short-code exchange, host side. hello{code, ticket, pake}: the code must be one a device has just looked up,
	* shown with that lookup's ticket, and it gets that code's one attempt. pake{mac}: the device's confirmation. Returns
	* the device's hello once the code is proven.
	*/
	async codeStep(peer, m) {
		if (m.t === "pake") {
			const b = this.codeBinds.get(peer);
			if (!b) return null;
			this.codeBinds.delete(peer);
			const enc = new TextEncoder();
			if (typeof m.mac !== "string" || !equalBytes(enc.encode(m.mac), enc.encode(b.theirs))) {
				this.reject(peer);
				return null;
			}
			return b.hello;
		}
		if (m.t !== "hello" || !("code" in m) || !peer.fp || this.codeBinds.has(peer)) return null;
		for (let i = 0; i < 30 && !this.spentCodes.has(m.code) && this.shortCode?.handle === m.code; i++) await new Promise((r) => setTimeout(r, 100));
		const spent = this.spentCodes.get(m.code);
		if (!spent || spent.until < Date.now() || spent.ticket !== m.ticket || typeof m.pake !== "string") {
			this.reject(peer);
			return null;
		}
		this.spentCodes.delete(m.code);
		let share;
		try {
			share = fromB64url(m.pake);
		} catch {
			this.reject(peer);
			return null;
		}
		const pake = await CodePake.start("host", {
			secret: spent.secret,
			handle: m.code,
			room: this.roomId
		});
		const macs = await pake.confirm(share, peer.fp, this.fp);
		if (!macs || !this.peers.has(peer.id)) {
			this.reject(peer);
			return null;
		}
		this.codeBinds.set(peer, {
			hello: m,
			theirs: macs.theirs
		});
		this.send(peer, {
			t: "pake",
			y: b64url(pake.share),
			mac: macs.mine
		});
		setTimeout(() => {
			if (this.codeBinds.has(peer)) this.reject(peer);
		}, 2e4);
		return null;
	}
	/** Bound devices, oldest first. */
	bound() {
		return [...this.peers.values()].filter((p) => p.bound).sort((a, b) => a.since - b.since);
	}
	participant(p) {
		return {
			id: p.id,
			name: p.name,
			color: p.color,
			lead: p === this.active,
			since: p.since,
			caps: p.caps,
			...p.controller ? { controller: p.controller } : {},
			...p.profile ? { profile: p.profile } : {},
			...p.pair ? { pair: p.pair } : {},
			...p.fp ? { fp: b64url(p.fp) } : {},
			...p.paused ? { paused: true } : {}
		};
	}
	/** Everyone controlling the scene, oldest (the lead) first. */
	get participants() {
		return this.bound().map((p) => this.participant(p));
	}
	/**
	* Each connected device's link, oldest first, from the connection's own statistics: its path, ICE's round trip and
	* DTLS (linkInfo), and how the device proved itself when it bound. For a connection badge that claims only this.
	*/
	async links() {
		return Promise.all(this.bound().map(async (p) => ({
			id: p.id,
			name: p.name,
			verified: p.via ?? "qr",
			link: await linkInfo(p.pc)
		})));
	}
	freeColor(peer) {
		const used = /* @__PURE__ */ new Set([this.host.color.toLowerCase(), ...this.bound().filter((p) => p !== peer).map((p) => p.color)]);
		return PARTICIPANT_COLORS.find((c) => !used.has(c)) ?? PARTICIPANT_COLORS[used.size % PARTICIPANT_COLORS.length];
	}
	/** The peers a message for `who` goes to: that participant, else everyone in a shared scene, else the device in control. */
	targets(who) {
		if (who) {
			const p = this.peers.get(who);
			return p?.bound ? [p] : [];
		}
		return this.shared ? this.bound() : this.active ? [this.active] : [];
	}
	/** Latest controller state while the device in control (the lead) is in gamepad mode (null otherwise). */
	get pad() {
		return this.active?.stream.pad ?? null;
	}
	/** Where the device in control (the lead) points (PROTOCOL §6) while a pointing utility is on, else null. */
	get pointer() {
		return this.active?.stream.pointer ?? null;
	}
	/** Read the device in control's (the lead's) input for this frame. Call once per rendered frame. */
	consume(now = performance.now()) {
		return (this.active?.stream ?? this.idle).consume(now, this.status === "connected" && !this.active?.paused);
	}
	/** One participant's gamepad state, pointer and frame (shared scenes). */
	padOf(who) {
		const p = this.peers.get(who);
		return p?.bound ? p.stream.pad : null;
	}
	pointerOf(who) {
		const p = this.peers.get(who);
		return p?.bound ? p.stream.pointer : null;
	}
	consumeOf(who, now = performance.now()) {
		const p = this.peers.get(who);
		return (p?.bound ? p.stream : this.idle).consume(now, !!p?.bound && !p.paused);
	}
	/** Vibrate a device (Gamepad API dual-rumble semantics): `who`, else the device in control. */
	rumble(strong, weak, ms, who) {
		const p = who ? this.peers.get(who) : this.active;
		if (p?.bound) this.send(p, {
			t: "rumble",
			strong,
			weak,
			ms
		});
	}
	/** The tray and modes (or controllers, filled in as withControllers does): for `who`, else for everyone. */
	setLayout(layout, who) {
		const full = withControllers(layout);
		if (!who) this.layout = full;
		for (const p of this.targets(who)) this.send(p, {
			t: "layout",
			layout: full
		});
	}
	/** Sync toggle/label state shown on devices: for `who`, else for everyone. */
	setValues(values, who) {
		if (!who) Object.assign(this.values, values);
		for (const p of this.targets(who)) this.send(p, {
			t: "state",
			values
		});
	}
	/** A haptic tick or bump and an optional toast: for `who`, else for the device in control. */
	feedback(f, who) {
		const p = who ? this.peers.get(who) : this.active;
		if (p?.bound) this.send(p, {
			t: "feedback",
			...f
		});
	}
	/** How the screen appears among the participants (CATALOGUE §5: the screen is participant `host`). */
	setHostPerson(p) {
		this.host = {
			...this.host,
			...p,
			id: "host"
		};
		this.sceneChanged();
	}
	/**
	* Publish the scene: what can be claimed (omit `nodes` to keep the last list) and who holds what (node id ->
	* participant id, `host` for the screen). Every participant receives it.
	*/
	setScene(s) {
		if (s.nodes) {
			this.nodes = s.nodes.map((n) => ({
				...n,
				id: n.id.slice(0, 64),
				...n.parent ? { parent: n.parent.slice(0, 64) } : {}
			}));
			this.nodesVersion++;
		}
		this.held = { ...s.held };
		this.sceneChanged();
	}
	sceneChanged() {
		if (!this.shared || this.scenePending) return;
		this.scenePending = true;
		queueMicrotask(() => {
			this.scenePending = false;
			const people = [this.host, ...this.bound().map((p) => ({
				id: p.id,
				name: p.name,
				color: p.color,
				...p === this.active ? { lead: true } : {}
			}))];
			for (const p of this.bound()) {
				const m = {
					t: "scene",
					you: p.id,
					people,
					held: this.held
				};
				if (p.nodesSent !== this.nodesVersion) {
					m.nodes = this.nodes;
					p.nodesSent = this.nodesVersion;
				}
				this.send(p, m);
			}
		});
	}
	/** Disconnect a participant (it can't rejoin by itself; a new invite keeps it out), or with no `who` everyone. */
	disconnect(who) {
		const list = who ? this.targets(who) : this.bound();
		for (const p of list) {
			this.send(p, {
				t: "lock",
				reason: who ? "removed" : "host-closed"
			});
			setTimeout(() => this.dropPeer(p.id), 200);
		}
	}
	destroy() {
		this.destroyed = true;
		if (this.iceTimer) {
			clearTimeout(this.iceTimer);
			this.iceTimer = null;
		}
		this.lan = null;
		this.codeWant = 0;
		this.setCode(null);
		if (this.codeWait) {
			clearTimeout(this.codeWait);
			this.codeWait = null;
		}
		for (const id of [...this.peers.keys()]) this.dropPeer(id);
		this.sig?.close();
		for (const r of this.kept.splice(0)) r.sig.close();
		for (const c of this.cards) c.el.remove();
		this.cards = [];
	}
	send(peer, m) {
		if (peer.ctl.readyState === "open") peer.ctl.send(JSON.stringify(m));
	}
	/** Optional shared-sim state, sent only to subscribers and dropped under backpressure. */
	sendSim(m, who) {
		const p = this.peers.get(who);
		if (p?.bound && p.ctl.bufferedAmount < 65536 && validSimMessage(m)) this.send(p, m);
	}
	/**
	* A bound peer's connection went quiet or failed: it goes unless it comes back in time. A phone through the room
	* service gets longer, since it may be finding a new path (an ICE restart) after changing networks.
	*/
	scheduleLost(peer) {
		if (peer.lost) return;
		peer.lost = setTimeout(() => {
			peer.lost = null;
			if (peer.pc.connectionState !== "connected") this.dropPeer(peer.id);
		}, peer.lan ? 4e3 : 1e4);
	}
	dropPeer(id) {
		const p = this.peers.get(id);
		if (!p) return;
		this.peers.delete(id);
		if (p.lost) {
			clearTimeout(p.lost);
			p.lost = null;
		}
		if (this.lan?.peer === p) this.lan = null;
		try {
			p.pc.close();
		} catch {}
		if (p.room) this.pruneKept();
		if (!p.bound) return;
		const who = this.participant(p);
		p.bound = false;
		for (const [node, holder] of Object.entries(this.held)) if (holder === id) delete this.held[node];
		if (this.active === p) this.active = this.shared ? this.bound()[0] ?? null : null;
		this.deviceName = this.active?.name ?? null;
		this.emit("leave", who);
		this.renderCards();
		if (!this.bound().length) {
			this.setStatus(this.sig?.open ? "ready" : "offline");
			this.emit("disconnect");
		}
		this.sceneChanged();
	}
	/**
	* Render the pairing card into an element. 'full' shows numbered steps; 'compact' is visual-first:
	* the QR code, a one-line call to action and a live status dot.
	*/
	mountPairing(el, opts = {}) {
		injectStyles();
		const compact = opts.variant === "compact";
		const card = document.createElement("div");
		card.className = compact ? "obpal-card obpal-compact" : "obpal-card";
		const node = (parent, tag, cls, text = "") => {
			const el = document.createElement(tag);
			el.className = cls;
			el.textContent = text;
			parent.appendChild(el);
			return el;
		};
		const glyph = (parent, phone) => {
			const ns = "http://www.w3.org/2000/svg";
			const svg = document.createElementNS(ns, "svg");
			svg.setAttribute("viewBox", "0 0 24 24");
			svg.setAttribute("aria-hidden", "true");
			const path = document.createElementNS(ns, "path");
			path.setAttribute("d", phone ? "M9.8 2.8h4.4A2.8 2.8 0 0 1 17 5.6v12.8a2.8 2.8 0 0 1-2.8 2.8H9.8A2.8 2.8 0 0 1 7 18.4V5.6a2.8 2.8 0 0 1 2.8-2.8ZM10.5 18h3" : "M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4");
			svg.append(path);
			parent.append(svg);
		};
		const qr = node(card, "div", "obpal-qr");
		qr.setAttribute("role", "img");
		qr.setAttribute("aria-label", "QR code to pair your phone");
		const body = node(card, "div", "obpal-body");
		const title = node(body, "div", "obpal-title");
		if (compact) glyph(node(title, "span", "obpal-ic"), true);
		node(title, "span", "obpal-title-text");
		if (!compact) {
			const steps = node(body, "ol", "obpal-steps");
			node(steps, "li", "", "Open your phone’s camera");
			node(steps, "li", "", "Point it at this code");
			const tap = node(steps, "li", "", "Tap ");
			node(tap, "b", "", "Start");
			tap.append(" on your phone");
		}
		node(body, "div", "obpal-status").setAttribute("aria-live", "polite");
		if (opts.testLink !== false) {
			const link = node(body, "a", "obpal-link");
			link.setAttribute("target", "_blank");
			link.setAttribute("rel", "noopener");
			link.setAttribute("title", "Open the controller on this device");
			if (compact) {
				glyph(link, false);
				node(link, "span", "", "This device");
			} else link.textContent = "Open the controller on this device";
		}
		card.querySelector(".obpal-title-text").textContent = opts.title ?? (compact ? "Scan to control" : "Use your phone as a remote");
		el.appendChild(card);
		const entry = {
			el: card,
			status: card.querySelector(".obpal-status"),
			qr: card.querySelector(".obpal-qr"),
			link: card.querySelector(".obpal-link"),
			compact
		};
		this.cards.push(entry);
		this.renderQr(entry);
		this.renderCards();
		return card;
	}
	renderQr(c) {
		const url = this.pairingUrl;
		if (c.link) c.link.href = url;
		__vitePreload(async () => {
			const { plainQrElement } = await import("./qr-B4n4DSjF.js");
			return { plainQrElement };
		}, []).then(({ plainQrElement }) => {
			if (url === this.pairingUrl) c.qr.replaceChildren(plainQrElement(url));
		});
	}
	renderCards() {
		const n = this.bound().length;
		const text = {
			starting: "Starting…",
			ready: "Waiting for your phone",
			connecting: "Phone found, connecting…",
			connected: n > 1 ? `${n} devices connected` : `Connected${this.deviceName ? ` to ${this.deviceName}` : ""}`,
			offline: "Offline, retrying…"
		};
		const short = {
			starting: "Starting",
			ready: "Waiting",
			connecting: "Connecting",
			connected: n > 1 ? `${n} connected` : "Connected",
			offline: "Offline"
		};
		for (const c of this.cards) {
			c.status.textContent = this.bound().length && this.bound().every((p) => p.paused) ? "Phone paused" : (c.compact ? short : text)[this.status];
			c.status.dataset.s = this.status;
		}
	}
};
var styled = false;
function injectStyles() {
	if (styled || typeof document === "undefined") return;
	styled = true;
	const s = document.createElement("style");
	s.id = "obpal-style";
	s.textContent = `
.obpal-card{--_bg:var(--obpal-bg,rgb(var(--surface-rgb, 13 20 33) / .82));--_ink:var(--obpal-ink,#e6edf7);--_muted:var(--obpal-muted,#a3b1c5);--_line:var(--obpal-line,#293548);--_accent:var(--obpal-accent,#a78bfa);
 display:flex;gap:20px;align-items:center;padding:18px;border-radius:22px;background:var(--_bg);color:var(--_ink);border:1px solid var(--_line);
 backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);font:15px/1.5 var(--obpal-font,'Plus Jakarta Sans',system-ui,sans-serif);box-shadow:0 24px 60px rgba(0,0,0,.35)}
.obpal-qr{flex:none;width:168px;height:168px;background:#fff;border-radius:14px;padding:6px;box-sizing:border-box}
.obpal-qr svg{width:100%;height:100%;display:block}
.obpal-title{font-weight:700;font-size:18px;letter-spacing:-.02em;margin-bottom:6px}
.obpal-steps{margin:0 0 10px;padding-left:20px;color:var(--_muted)}
.obpal-title-text{white-space:nowrap}
.obpal-steps b{color:var(--_ink)}
.obpal-status{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px}
.obpal-status::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--_muted)}
.obpal-status[data-s=ready]::before{background:var(--_accent);animation:obpal-pulse 1.6s ease-in-out infinite}
.obpal-status[data-s=connecting]::before{background:#fcd34d}
.obpal-status[data-s=connected]::before{background:#6ee7b7}
.obpal-status[data-s=offline]::before{background:#fb7185}
.obpal-link{display:inline-block;margin-top:10px;font-size:13px;color:var(--_muted)}
.obpal-link:hover{color:var(--_ink)}
@keyframes obpal-pulse{50%{opacity:.35}}
.obpal-compact{gap:16px;padding:14px;border-radius:24px;background:var(--obpal-bg,linear-gradient(145deg,rgb(255 255 255 / .1),rgb(255 255 255 / .035)));border:1px solid var(--obpal-line,rgb(255 255 255 / .13));
 backdrop-filter:blur(22px) saturate(170%);-webkit-backdrop-filter:blur(22px) saturate(170%);box-shadow:0 18px 50px rgba(0,0,0,.34),inset 0 1px 0 rgb(255 255 255 / .14)}
.obpal-compact .obpal-qr{width:124px;height:124px;border-radius:16px;padding:5px}
.obpal-compact .obpal-body{display:flex;flex-direction:column;gap:10px;min-width:150px}
.obpal-compact .obpal-title{display:flex;align-items:center;gap:10px;margin:0;font-size:16px}
.obpal-ic{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:linear-gradient(145deg,rgb(var(--accent-rgb, 167 139 250) / .35),rgb(var(--accent2-rgb, 103 232 249) / .15));border:1px solid rgb(255 255 255 / .14)}
.obpal-ic svg,.obpal-compact .obpal-link svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.obpal-compact .obpal-status{font-size:13px;color:var(--_muted)}
.obpal-compact .obpal-link{display:inline-flex;align-items:center;gap:6px;margin:0;font-size:12px;font-weight:600;text-decoration:none;opacity:.8}
.obpal-compact .obpal-link:hover{opacity:1}
@media (max-width:520px){.obpal-card{flex-direction:column;text-align:center}.obpal-steps{text-align:left}}
@media (prefers-reduced-motion:reduce){.obpal-status::before{animation:none!important}}`;
	document.head.appendChild(s);
}
var DEFAULT_KEYS = {
	move: {
		up: "KeyW",
		down: "KeyS",
		left: "KeyA",
		right: "KeyD",
		press: .4,
		release: .3
	},
	buttons: {
		A: "Space",
		B: "Escape",
		X: "KeyE",
		Y: "KeyQ",
		Menu: "Enter",
		LB: "ShiftLeft",
		RB: "ControlLeft",
		Up: "ArrowUp",
		Down: "ArrowDown",
		Left: "ArrowLeft",
		Right: "ArrowRight"
	},
	mouse: {
		speed: 1200,
		deadzone: .12,
		expo: 1.6,
		aimGain: 14,
		padGain: 1.5,
		buttons: {
			RT: 0,
			LT: 2
		},
		press: .5,
		release: .35
	},
	tiltMoves: true
};
/**
* The whole PC (ob.Pal Desktop's whole-PC mode): a controller for the desktop, the way Gopher360 and Steam's desktop
* layout work, that types no letters into whatever has focus. Left stick: the pointer. Right stick: scroll. A or RT:
* click (held, it drags). X or LT: right-click. Left stick press: middle click. B: Esc. Y: Enter. D-pad: arrows.
* LB / RB: back / forward (Alt+Left / Alt+Right). Menu: the Start menu (Ctrl+Esc). View: the last app (Alt+Tab).
*/
var DESKTOP_KEYS = {
	move: null,
	buttons: {
		B: "Escape",
		Y: "Enter",
		Up: "ArrowUp",
		Down: "ArrowDown",
		Left: "ArrowLeft",
		Right: "ArrowRight",
		LB: ["AltLeft", "ArrowLeft"],
		RB: ["AltLeft", "ArrowRight"],
		Menu: ["ControlLeft", "Escape"],
		View: ["AltLeft", "Tab"]
	},
	mouse: {
		stick: "left",
		speed: 1400,
		deadzone: .14,
		expo: 2,
		aimGain: 14,
		padGain: 1.5,
		buttons: {
			A: 0,
			RT: 0,
			X: 2,
			LT: 2,
			L3: 1
		},
		press: .5,
		release: .35
	},
	scroll: {
		stick: "right",
		speed: 2400,
		deadzone: .18,
		expo: 1.8
	},
	tiltMoves: false
};
/** The PC target's mapping: the desktop controller for the whole PC, the game keys for one program at a time. */
var pcKeys = (desktop) => desktop ? DESKTOP_KEYS : DEFAULT_KEYS;
var MOD_OF = {
	ShiftLeft: "shift",
	ControlLeft: "ctrl",
	AltLeft: "alt"
};
var isMod = (key) => MOD_OF[key] !== void 0;
var DIRS = [
	"up",
	"down",
	"left",
	"right"
];
/** Stateful pad -> keyboard/mouse mapper. Call update() once per input frame. */
var KeyMapper = class {
	cfg;
	held = /* @__PURE__ */ new Set();
	dir = {
		up: false,
		down: false,
		left: false,
		right: false
	};
	trig = {};
	mouseHeld = /* @__PURE__ */ new Set();
	acc = new Accum();
	wheelCarry = [0, 0];
	constructor(cfg = DEFAULT_KEYS) {
		this.cfg = cfg;
	}
	get mods() {
		const m = {
			shift: false,
			ctrl: false,
			alt: false
		};
		for (const key of this.held) {
			const mod = MOD_OF[key];
			if (mod) m[mod] = true;
		}
		return m;
	}
	update(input) {
		const { move, buttons, mouse, scroll } = this.cfg;
		const pad = input.pad;
		const stick = pad ? [pad.axes[0], pad.axes[1]] : this.cfg.tiltMoves && input.tilt ? input.tilt : [0, 0];
		const want = /* @__PURE__ */ new Set();
		if (move) {
			this.dir.up = hysteresis(this.dir.up, -stick[1], move.press, move.release);
			this.dir.down = hysteresis(this.dir.down, stick[1], move.press, move.release);
			this.dir.left = hysteresis(this.dir.left, -stick[0], move.press, move.release);
			this.dir.right = hysteresis(this.dir.right, stick[0], move.press, move.release);
			for (const d of DIRS) if (this.dir[d]) want.add(move[d]);
		}
		if (pad) for (const [name, key] of Object.entries(buttons)) {
			if (!key || buttonValue(pad, PadButton[name]) < .5) continue;
			for (const one of typeof key === "string" ? [key] : key) want.add(one);
		}
		const keys = this.diff(want);
		const wantBtn = /* @__PURE__ */ new Set();
		for (const [name, b] of Object.entries(mouse.buttons)) {
			const v = pad ? buttonValue(pad, PadButton[name]) : 0;
			this.trig[name] = hysteresis(!!this.trig[name], v, mouse.press, mouse.release);
			if (this.trig[name] && b !== void 0) wantBtn.add(b);
		}
		const btnEdges = [];
		for (const b of [...this.mouseHeld]) if (!wantBtn.has(b)) {
			this.mouseHeld.delete(b);
			btnEdges.push({
				button: b,
				down: false
			});
		}
		for (const b of wantBtn) if (!this.mouseHeld.has(b)) {
			this.mouseHeld.add(b);
			btnEdges.push({
				button: b,
				down: true
			});
		}
		const dt = clamp$1(input.dtMs, 0, 100) / 1e3;
		let dx = -input.aim[0] * mouse.aimGain + input.pad1[0] * mouse.padGain;
		let dy = -input.aim[1] * mouse.aimGain + input.pad1[1] * mouse.padGain;
		const axes = (s) => pad ? s === "left" ? [pad.axes[0], pad.axes[1]] : [pad.axes[2], pad.axes[3]] : [0, 0];
		const aim = axes(mouse.stick ?? "right");
		dx += stickCurve(aim[0], mouse.deadzone, mouse.expo) * mouse.speed * dt;
		dy += stickCurve(aim[1], mouse.deadzone, mouse.expo) * mouse.speed * dt;
		const wheel = [0, 0];
		if (scroll) {
			const s = axes(scroll.stick);
			for (const i of [0, 1]) {
				const v = stickCurve(s[i], scroll.deadzone, scroll.expo) * scroll.speed * dt + this.wheelCarry[i];
				wheel[i] = Math.trunc(v) || 0;
				this.wheelCarry[i] = v - wheel[i];
			}
		}
		return {
			keys,
			move: this.acc.take(dx, dy),
			buttons: btnEdges,
			wheel
		};
	}
	/** Release everything (mode change, lost link, deactivation). */
	releaseAll() {
		const keys = this.diff(/* @__PURE__ */ new Set());
		const buttons = [...this.mouseHeld].map((button) => ({
			button,
			down: false
		}));
		this.mouseHeld.clear();
		this.dir = {
			up: false,
			down: false,
			left: false,
			right: false
		};
		this.trig = {};
		this.acc.reset();
		this.wheelCarry = [0, 0];
		return {
			keys,
			move: [0, 0],
			buttons,
			wheel: [0, 0]
		};
	}
	/** Edges from the held set to `want`: releases first (modifiers last), then presses (modifiers first). */
	diff(want) {
		const ups = [...this.held].filter((key) => !want.has(key));
		const downs = [...want].filter((key) => !this.held.has(key));
		return [
			...ups.filter((key) => !isMod(key)).map((key) => [key, false]),
			...ups.filter(isMod).map((key) => [key, false]),
			...downs.filter(isMod).map((key) => [key, true]),
			...downs.filter((key) => !isMod(key)).map((key) => [key, true])
		].map(([key, down]) => {
			if (down) this.held.add(key);
			else this.held.delete(key);
			return {
				key,
				down,
				mods: this.mods
			};
		});
	}
};
//#endregion
//#region src/shared/pcgestures.ts
/**
* PC target: the phone as this PC's pointer, the way a laptop touchpad and a Wii remote work. Pure: fed the phone's
* button events and, every tick, its touch state and this tick's pointer motion, it says which mouse buttons to hold,
* whether to hold Ctrl (zooming is Ctrl + wheel), how far to turn the wheel, and how far to move the pointer. The
* offscreen link merges that into the frame for ob.Pal Desktop, which only ever sees held state and motion.
*
*   Trackpad  tap: click · tap again: double-click · hold: right-click · hold, then move: drag
*             two fingers: scroll, the page following them, with a flick carrying on · pinch: zoom
*   Point     A: click where A went down (the pointer holds still while A is down) · keep holding A: right-click
*             · press A and aim away: drag · hold B and aim: scroll, the page following the pointer · + / −: zoom
*   Mouse     (the Point face a PC gets) Left and Right: a press held still where it went down, a click when let go,
*             a drag when aimed away, held as it is when kept down · the wheel: turned by a finger (mouse-wheel
*             values), tapped for a middle click, held to scroll by aiming (B) · + / −: zoom
*   Keyboard  the key row (btn key-<code> taps): Esc, Tab, the arrows, Backspace and Enter, each a tap of that key ·
*             typing (text{s, del}) in order with them: never ahead of a key tapped before it
*
* A click is a press held for CLICK_MS then a release held for CLICK_MS, so it spans frames the helper can diff,
* and a double-click stays inside Windows' double-click time. A key tap is timed the same way.
*
* Typing goes out right after the tick's frame, and only after a frame that holds no modifier and no key from the
* row: ob.Pal Desktop refuses text while a modifier is down, and doesn't retry. It is paced (TEXT_RATE) under the
* helper's 40 a second, and what waits merges into one request wherever that types the same.
*/
/** The keys the keyboard's key row taps (btn key-<code>), by KeyboardEvent.code. Nothing else is ever pressed from there. */
var KEY_TAPS = [
	"Escape",
	"Tab",
	"ArrowLeft",
	"ArrowUp",
	"ArrowDown",
	"ArrowRight",
	"Backspace",
	"Enter"
];
var MODIFIERS = /* @__PURE__ */ new Set([
	"ShiftLeft",
	"ShiftRight",
	"ControlLeft",
	"ControlRight",
	"AltLeft",
	"AltRight",
	"MetaLeft",
	"MetaRight"
]);
/** A held key (KeyboardEvent.code) that is a modifier: while one is down, the helper refuses typing. */
var isModifier = (code) => MODIFIERS.has(code);
/**
* Two typings as one request, where that types the same: A's text less what B deletes of it, then B's (B deleting
* past A's text deletes that much more first). It may come to nothing (typing deleted again). Never when B deletes
* into a newline or tab A typed, which Backspace can't take back (Enter may have sent a message, Tab moved the
* focus), and never past MAX_TEXT. Null: keep them apart.
*/
function mergeText(a, b) {
	if (b.del && /[\n\t]/.test(a.s)) return null;
	const typed = Array.from(a.s);
	const s = typed.slice(0, Math.max(0, typed.length - b.del)).join("") + b.s;
	const del = a.del + Math.max(0, b.del - typed.length);
	return del <= 256 && s.length <= 256 ? {
		t: "text",
		s,
		del
	} : null;
}
/** A 'tap' this soon after A's own press ended is that press, not another click (ms). */
var TAP_ECHO_MS = 600;
/** Which two-finger gesture it is: this much pan (px) or pinch (log2) first. */
var PAN_LOCK = 10;
var PINCH_LOCK = .08;
/** Wheel units per px of two-finger pan (120 units scroll about 100 px, so the page moves about twice the fingers). */
var SCROLL_PER_PX = 2.4;
/** Pinch (log2) per zoom step: a pinch to double the finger spread zooms three steps. */
var PINCH_PER_NOTCH = 1 / 3;
var NOTCH = 120;
/** The most the wheel may turn between two ticks (units): a stalled link catching up doesn't fling the page. */
var WHEEL_MAX = 4800;
/** A flick keeps scrolling after the fingers lift when faster than this (units/ms), fading with this time constant (ms). */
var FLING_MIN = .6;
var FLING_TAU = 330;
var FLING_STOP = .04;
var FLING_MAX_MS = 2500;
var PcGestures = class {
	queue = [];
	click = null;
	/** Point's A while it is down: where it went down is held until it is a click, a right-click or a drag. */
	a = null;
	aEndedAt = -Infinity;
	/** A trackpad hold ('long'), until the finger lifts. */
	hold = null;
	/** Point's B held: aiming scrolls. */
	grab = false;
	/** The mouse face's Left (0) and Right (2) while down: held still where they went down until they mean something. */
	press = {};
	/** Wheel units the mouse face's wheel turned since the last tick (+ scrolls down). */
	turn = 0;
	/** The two-finger gesture while fingers are down. */
	two = null;
	pinchAcc = 0;
	/** Zoom steps asked for with + / −: negative zooms in (wheel up). */
	steps = 0;
	vel = [0, 0];
	fling = null;
	/** Sub-unit wheel left over from earlier ticks. */
	carry = [0, 0];
	last = 0;
	/** The key row's taps and the typing, in the order they came. */
	typing = [];
	/** The key tap under way: down for CLICK_MS, then up for CLICK_MS. */
	key = null;
	/** Text requests that may go now (refilled at TEXT_RATE a second, up to TEXT_BURST). */
	textTokens = 5;
	/** A button event from the phone (Remote 'button'): the trackpad's taps, the Point face's A, B, + and −, and the key row. */
	button(id, ev, now) {
		if (id.startsWith("key-")) {
			const code = id.slice(4);
			if (ev === "tap" && KEY_TAPS.includes(code)) this.typing.push({ key: code });
			return;
		}
		this.fling = null;
		switch (id) {
			case "pad":
				if (ev === "tap" || ev === "double") this.queue.push(0);
				else if (ev === "long") this.hold = {
					dx: 0,
					dy: 0,
					drag: false
				};
				return;
			case "wii-a":
				if (ev === "down") {
					if (!this.a) this.a = {
						at: now,
						dx: 0,
						dy: 0,
						decided: false,
						drag: false
					};
				} else if (ev === "up") {
					if (this.a && !this.a.decided) this.queue.push(0);
					if (this.a) this.aEndedAt = now;
					this.a = null;
				} else if (ev === "tap" && !this.a && now - this.aEndedAt > TAP_ECHO_MS) this.queue.push(0);
				return;
			case "wii-b":
				if (ev === "down") this.grab = true;
				else if (ev === "up") this.grab = false;
				return;
			case "mouse-left":
			case "mouse-right": {
				const b = id === "mouse-left" ? 0 : 2;
				if (ev === "down") this.press[b] ??= {
					at: now,
					dx: 0,
					dy: 0,
					drag: false,
					held: false
				};
				else if (ev === "up") {
					const p = this.press[b];
					if (p && !p.drag && !p.held) this.queue.push(b);
					delete this.press[b];
				}
				return;
			}
			case "mouse-middle":
				if (ev === "tap") this.queue.push(1);
				return;
			case "wii-plus":
				if (ev === "tap") this.steps -= 1;
				return;
			case "wii-minus":
				if (ev === "tap") this.steps += 1;
				return;
		}
	}
	/** Typing from the phone's keyboard (validated already): it goes out after any key tap that came before it. */
	text(s, del) {
		const t = {
			t: "text",
			s,
			del
		};
		const last = this.typing[this.typing.length - 1];
		const merged = last && !("key" in last) ? mergeText(last, t) : null;
		if (!merged) this.typing.push(t);
		else if (merged.s || merged.del) this.typing[this.typing.length - 1] = merged;
		else this.typing.pop();
	}
	/** The mouse face's wheel turned: wheel units, 120 a notch, + scrolls down. */
	wheel(units) {
		if (!Number.isFinite(units)) return;
		this.fling = null;
		this.turn = Math.max(-4800, Math.min(WHEEL_MAX, this.turn + units));
	}
	tick(t) {
		const dt = this.last ? Math.min(100, Math.max(1, t.now - this.last)) : 16;
		this.last = t.now;
		const out = {
			buttons: [],
			ctrl: false,
			move: [t.move[0], t.move[1]],
			wheel: [0, 0],
			buzz: false,
			keys: [],
			text: []
		};
		if (!t.connected) {
			this.reset();
			out.move = [0, 0];
			return out;
		}
		const held = /* @__PURE__ */ new Set();
		const wheel = [0, 0];
		const a = this.a;
		if (a) {
			if (!a.decided) {
				a.dx += out.move[0];
				a.dy += out.move[1];
				out.move = [0, 0];
				if (Math.hypot(a.dx, a.dy) > 12) {
					a.decided = true;
					a.drag = true;
					out.move = [a.dx, a.dy];
				} else if (t.now - a.at >= 450) {
					a.decided = true;
					this.queue.push(2);
					out.buzz = true;
				}
			}
			if (a.drag) held.add(0);
		}
		for (const b of [0, 2]) {
			const p = this.press[b];
			if (!p) continue;
			if (!p.drag && !p.held) {
				p.dx += out.move[0];
				p.dy += out.move[1];
				out.move = [0, 0];
				if (Math.hypot(p.dx, p.dy) > 12) {
					p.drag = true;
					out.move = [p.dx, p.dy];
				} else if (t.now - p.at >= 450) p.held = true;
			}
			if (p.drag || p.held) held.add(b);
		}
		const h = this.hold;
		if (h) {
			if (!t.touching) {
				if (!h.drag) this.queue.push(2);
				this.hold = null;
			} else {
				if (!h.drag) {
					h.dx += out.move[0];
					h.dy += out.move[1];
					out.move = [0, 0];
					if (Math.hypot(h.dx, h.dy) > 6) {
						h.drag = true;
						out.move = [h.dx, h.dy];
					}
				}
				if (h.drag) held.add(0);
			}
		}
		if (t.touching) {
			this.fling = null;
			const pan = Math.hypot(t.pan[0], t.pan[1]);
			if (pan || t.pinch) this.two ??= {
				mode: "none",
				pan: 0,
				pinch: 0
			};
			const g = this.two;
			if (g) {
				if (g.mode === "none") {
					g.pan += pan;
					g.pinch += Math.abs(t.pinch);
					if (g.pinch > PINCH_LOCK) g.mode = "zoom";
					else if (g.pan > PAN_LOCK) g.mode = "scroll";
				}
				if (g.mode === "scroll") {
					const wx = -t.pan[0] * SCROLL_PER_PX;
					const wy = -t.pan[1] * SCROLL_PER_PX;
					wheel[0] += wx;
					wheel[1] += wy;
					this.vel = [this.vel[0] * .6 + wx / dt * .4, this.vel[1] * .6 + wy / dt * .4];
				} else if (g.mode === "zoom") {
					out.ctrl = true;
					this.pinchAcc += t.pinch;
				}
				if (g.mode !== "none") out.move = [0, 0];
			}
		} else {
			if (this.two?.mode === "scroll" && Math.hypot(this.vel[0], this.vel[1]) > FLING_MIN) this.fling = {
				vx: this.vel[0],
				vy: this.vel[1],
				at: t.now
			};
			this.two = null;
			this.pinchAcc = 0;
			this.vel = [0, 0];
		}
		const f = this.fling;
		if (f) {
			const k = Math.exp(-dt / FLING_TAU);
			f.vx *= k;
			f.vy *= k;
			wheel[0] += f.vx * dt;
			wheel[1] += f.vy * dt;
			if (Math.hypot(f.vx, f.vy) < FLING_STOP || t.now - f.at > FLING_MAX_MS) this.fling = null;
		}
		while (this.pinchAcc >= PINCH_PER_NOTCH) {
			wheel[1] -= NOTCH;
			this.pinchAcc -= PINCH_PER_NOTCH;
		}
		while (this.pinchAcc <= -.3333333333333333) {
			wheel[1] += NOTCH;
			this.pinchAcc += PINCH_PER_NOTCH;
		}
		if (this.steps) {
			out.ctrl = true;
			wheel[1] += Math.sign(this.steps) * NOTCH;
			this.steps -= Math.sign(this.steps);
		}
		wheel[1] += this.turn;
		this.turn = 0;
		if (this.grab) {
			wheel[0] -= out.move[0] * 2;
			wheel[1] -= out.move[1] * 2;
			out.move = [0, 0];
		}
		if (!this.click && this.queue.length) this.click = {
			button: this.queue.shift(),
			downAt: t.now,
			upAt: 0
		};
		const c = this.click;
		if (c) {
			if (!c.upAt && t.now - c.downAt >= 30) c.upAt = t.now;
			if (!c.upAt) held.add(c.button);
			else if (t.now - c.upAt >= 30) this.click = null;
		}
		for (const i of [0, 1]) {
			const v = wheel[i] + this.carry[i];
			out.wheel[i] = Math.trunc(v) || 0;
			this.carry[i] = v - out.wheel[i];
		}
		out.buttons = [...held].sort();
		this.textTokens = Math.min(5, this.textTokens + dt * 20 / 1e3);
		for (;;) {
			const k = this.key;
			if (k) {
				if (!k.upAt && t.now - k.downAt >= 30) k.upAt = t.now;
				if (!k.upAt) {
					out.keys.push(k.code);
					break;
				}
				if (t.now - k.upAt < 30) break;
				this.key = null;
			}
			const next = this.typing[0];
			if (!next) break;
			if ("key" in next) {
				if (out.text.length) break;
				this.typing.shift();
				this.key = {
					code: next.key,
					downAt: t.now,
					upAt: 0
				};
				continue;
			}
			if (out.ctrl || t.mods || this.textTokens < 1) break;
			this.textTokens -= 1;
			this.typing.shift();
			out.text.push(next);
		}
		return out;
	}
	/** Something is going on that needs frames even without phone input: a click, a drag, a flick, a zoom step, a key tap. */
	get busy() {
		return !!(this.click || this.queue.length || this.a?.drag || this.hold?.drag || this.grab || this.fling || this.steps || this.a || this.press[0] || this.press[2] || this.turn || this.key || this.typing.length);
	}
	/** Let go of everything: the phone went away, or the PC target was left. */
	reset() {
		this.queue = [];
		this.click = null;
		this.a = null;
		this.hold = null;
		this.grab = false;
		this.press = {};
		this.turn = 0;
		this.two = null;
		this.pinchAcc = 0;
		this.steps = 0;
		this.vel = [0, 0];
		this.fling = null;
		this.carry = [0, 0];
		this.typing = [];
		this.key = null;
		this.textTokens = 5;
	}
};
//#endregion
//#region src/shared/route.ts
/**
* Frame routing and wire encoding for the offscreen link. Pure.
*
* A tab can hold many frames (a game in an iframe, ads, widgets). Like real hardware:
*  - the virtual controller is visible to every frame (the Gamepad API is per frame),
*  - keys go to the one focused frame,
*  - 3D drags go to the frame with the largest visible canvas / <model-viewer>.
*/
function electFrame(frames, role) {
	if (!frames.length) return null;
	const top = frames.find((f) => f.frameId === 0) ?? frames[0];
	if (role === "pointer") {
		const locked = frames.find((f) => f.lock);
		if (locked) return locked;
	}
	let best = null;
	for (const f of frames) if (role === "keys" ? f.focus && (!best || f.focusAt > best.focusAt) : f.area >= 19200 && (!best || f.area > best.area)) best = f;
	return best ?? top;
}
/** Which frames get input frames in a mode: every frame for the controller, one elected frame otherwise, none for the PC. */
function recipients(frames, mode) {
	if (mode === "pc") return [];
	if (mode === "gamepad") return [...frames];
	const f = electFrame(frames, mode === "keys" ? "keys" : "viewer");
	return f ? [f] : [];
}
var round = (v, k) => Math.round(v * k) / k || 0;
function padTuple(pad) {
	if (!pad) return null;
	const ax = (i) => round(Math.max(-1, Math.min(1, pad.axes[i] ?? 0)), 1e4);
	const tr = (i) => round(Math.max(0, Math.min(1, pad.triggers[i] ?? 0)), 1e3);
	return [
		pad.buttons >>> 0,
		ax(0),
		ax(1),
		ax(2),
		ax(3),
		tr(0),
		tr(1)
	];
}
/** Per-frame deltas, or null when there is no motion at all (keeps idle frames tiny). */
function deltaTuple(f) {
	const d = [
		round(f.aim[0], 1e3),
		round(f.aim[1], 1e3),
		round(f.pad1[0], 1e3),
		round(f.pad1[1], 1e3),
		round(f.pad2[0], 1e3),
		round(f.pad2[1], 1e3),
		round(f.zoom, 1e4)
	];
	return d.some((v) => v !== 0) ? d : null;
}
/** The pointer for a page, with the A / B bits of the pad that click at it. */
function pointerTuple(p, buttons) {
	if (!p) return null;
	return [
		round(p.yaw, 100),
		round(p.pitch, 100),
		p.gen & 255,
		p.flags & 255,
		buttons & 3
	];
}
/** The A and B bits removed: while they click at the cursor they are not also gamepad buttons (CATALOGUE §4). */
function withoutClickButtons(p) {
	if (!p) return null;
	const out = [...p];
	out[0] = (p[0] & ~(1 << PadButton.A | 1 << PadButton.B)) >>> 0;
	return out;
}
/**
* Aim on the mouse route without pointer lock: the host finishes the route on the right stick (CATALOGUE §3, shooter),
* turning the change of aim per second into a deflection with the default deadzone jump. Signs: yaw + = right, pitch + = up.
*/
function withRelativeAim(p, rateDps, deadzone = .2) {
	if (!p) return null;
	const v = rateToUnit(-rateDps[0], rateDps[1]);
	const [rx, ry] = mixStick([p[3], p[4]], [{
		v,
		deadzone
	}]);
	const out = [...p];
	out[3] = round(rx, 1e4);
	out[4] = round(ry, 1e4);
	return out;
}
function tiltTuple(t) {
	if (!t) return null;
	const v = [round(Math.max(-1, Math.min(1, t[0])), 1e3), round(Math.max(-1, Math.min(1, t[1])), 1e3)];
	return v[0] || v[1] ? v : null;
}
/** Is anything being pressed or moved? Active input streams at the full rate; idle input only heartbeats. */
function isActive(p, d, tl, pt = null) {
	if (d || tl || pt) return true;
	if (!p) return false;
	return p[0] !== 0 || p.slice(1).some((v) => Math.abs(v) > .02);
}
var modeIndex = (mode) => PAGE_MODES.indexOf(mode);
function buildFrame(mode, dt, p, d, tl, pt = null) {
	const f = {
		t: "in",
		m: modeIndex(mode),
		dt: round(Math.max(0, Math.min(1e3, dt)), 10),
		p,
		d,
		tl
	};
	if (pt) f.pt = pt;
	return f;
}
/** Identity of the held (non-delta) state; a change is sent at once even when idle. */
var frameSignature = (mode, p, tl) => JSON.stringify([
	mode,
	p,
	tl
]);
//#endregion
//#region src/shared/sites.ts
var SITE_PROFILES = [
	{
		host: "tesana.com",
		profile: "flight"
	},
	{
		host: "play.tesana.ai",
		profile: "flight"
	},
	{
		host: "krunker.io",
		profile: "shooter"
	},
	{
		host: "venge.io",
		profile: "shooter"
	},
	{
		host: "shellshock.io",
		profile: "shooter"
	},
	{
		host: "voxiom.io",
		profile: "shooter"
	}
];
/** The profile suggested for a host name, or null when the table has nothing for it. */
function suggestProfile(hostname, table = SITE_PROFILES) {
	const h = hostname.toLowerCase().replace(/\.$/, "");
	if (!h) return null;
	for (const s of table) if (h === s.host || h.endsWith(`.${s.host}`)) return s.profile;
	return null;
}
/** One suggestion for a tab from the hosts of its frames: the top frame first, then any frame that matches. */
function suggestForFrames(hosts, table = SITE_PROFILES) {
	const sorted = [...hosts].sort((a, b) => a.frameId - b.frameId);
	for (const f of sorted) {
		const p = suggestProfile(f.host, table);
		if (p) return p;
	}
	return null;
}
//#endregion
//#region src/offscreen.ts
/**
* Offscreen document (reason WEB_RTC). An MV3 service worker cannot hold an RTCPeerConnection, so the ob.Pal
* Remote lives here: the pairing QR payload, signaling, and the WebRTC link to the phone. It keeps a persistent
* DTLS certificate and remembers paired phones, so when the room service is unreachable it publishes a direct
* LAN code instead (see the popup), and a remembered phone connects with no server at all.
* About 60 times a second, and immediately when a packet arrives, it samples the phone (remote.pad and
* remote.consume()) and streams compact input frames to the page bridges of the controlled tab over runtime
* ports: the controller to every frame, keys to the focused frame, 3D drags to the frame with the largest canvas.
* For the PC target the frames (and the phone's typing, in order with them) go to the service worker instead, and
* only for a phone the person at the PC allowed (shared/access.ts): the service worker says which, and until it has,
* nothing goes. The invite moves on each time a phone pairs through it (rotateInvite), so a photo of the popup's QR
* code pairs nothing later.
*/
var TICK_MS = 1e3 / 60;
/** A clock tick this soon after a packet-driven one is skipped: packets set the pace while input flows. */
var TICK_MIN_GAP_MS = 6;
/** Stop native frames before the helper's 500 ms watchdog if the phone stops sending input. */
var PC_INPUT_STALE_MS = 300;
var HEARTBEAT_MS = 250;
var RUMBLE_GAP_MS = 50;
/**
* The PC option's line in the target picker: the whole PC while the config says so. That flag counts only while the
* PC is the target, so from another target the line has to hold whichever way the whole PC is set.
*/
var PC_WHOLE = "Your whole PC: mouse, keyboard and typing";
var PC_OTHERWISE = "Mouse and keyboard for programs you allow, or your whole PC";
/** The tray picker for what the phone drives. */
var targetPicker = (wholePc) => ({
	id: "target",
	label: "Target",
	type: "select",
	icon: "settings",
	options: [
		{
			value: "gamepad",
			label: "Controller",
			glyph: "✚",
			detail: "Gamepad API games"
		},
		{
			value: "viewer",
			label: "3D",
			glyph: "◆",
			detail: "Rotate, pan and zoom 3D views"
		},
		{
			value: "keys",
			label: "Keys",
			glyph: "⌨",
			detail: "Keyboard and mouse games"
		},
		{
			value: "pc",
			label: "PC",
			glyph: "▭",
			detail: wholePc ? PC_WHOLE : PC_OTHERWISE
		}
	]
});
/** The phone's own keyboard, for the PC: typing arrives as text, its key row (Esc, Tab, arrows, ⌫, ↵) as key-<code> taps. */
var KEYBOARD = {
	id: "keyboard",
	label: "Keyboard",
	type: "keyboard",
	icon: "keyboard"
};
/**
* What the phone offers: gamepad, tilt and point modes, the target picker, and the site's suggested catalogue profile
* (CATALOGUE §3) when the table has one. The PC target gets the mouse face in Point (Left, Right and a wheel instead
* of A and B), a scroll wheel on the trackpad, and the keyboard.
*/
var layoutFor = (profile) => {
	const pcTarget = config.mode === "pc";
	const picker = targetPicker(config.desktop);
	return {
		v: 1,
		modes: [
			Mode.gamepad,
			Mode.tilt,
			Mode.point
		],
		tray: pcTarget ? [picker, KEYBOARD] : [picker],
		...profile ? { profile } : {},
		...pcTarget ? {
			point: "mouse",
			wheel: true
		} : {}
	};
};
var remote = null;
var config = {
	tabId: null,
	mode: DEFAULT_MODE,
	desktop: false
};
var configured = false;
var links = /* @__PURE__ */ new Set();
var lastTargets = /* @__PURE__ */ new Set();
var suggested = null;
/** A text or password field on the PC would take typing (the service worker says so, from ob.Pal Desktop). */
var textField = null;
var fieldShown = null;
/** The phone connected now (null: none), and where it stands on this PC (null: not known yet, so nothing goes). */
var phone = null;
var access = null;
var noticeShown = null;
/** The PC takes this phone's input: the PC is the target, and the person at the PC allowed the phone. */
var onPc = () => config.mode === "pc" && access === "allow";
/** The phone's `textField` value: the field while the PC takes its input, else false. Sent when it changes, and to every phone that connects. */
function publishField(always = false) {
	const v = onPc() && textField ? textField : false;
	if (v === fieldShown && !always) return;
	fieldShown = v;
	remote?.setValues({ textField: v });
}
/**
* The phone's `notice` (PROTOCOL §3), a line it shows until it clears: while the PC is the target and hasn't let the
* phone in, whether it waits for an answer there or was refused. Phones from before `notice` get it as a toast.
*/
function publishNotice(always = false) {
	const v = phone ? noticeFor(config.mode, access) : false;
	if (v === noticeShown && !always) return;
	noticeShown = v;
	remote?.setValues({ notice: v });
	if (v) remote?.feedback({ toast: v });
}
/**
* Who is connected now (the device in control), told to the service worker, which answers where it stands on this
* PC. A new phone gets nothing through to the PC meanwhile: what the last one held is let go. `always`: tell the worker
* again (a worker that has just started over).
*/
async function reportPhone(always = false) {
	const lead = remote?.participants.find((p) => p.lead);
	const key = lead ? phoneKeyOf(lead) : null;
	const next = lead && key ? {
		key,
		name: lead.name
	} : null;
	if (next?.key === phone?.key && next?.name === phone?.name && !always) return;
	if (next?.key !== phone?.key) setAccess(null);
	phone = next;
	const answered = accessSeq;
	const r = await toBg({
		to: "bg",
		type: "phone",
		phone: next
	});
	if (phone !== next || accessSeq !== answered) return;
	const a = typeof r === "object" && r !== null ? r.access : null;
	setAccess(isPcAccess(a) ? a : null);
}
/** Counts the answers the service worker pushes (an 'access' request): a reply from before one is stale. */
var accessSeq = 0;
/** Where the phone connected now stands on this PC: it gets through only once allowed, and hears how it went. */
function setAccess(next) {
	const was = access;
	access = next;
	if (next !== "allow") pcLetGo();
	publishNotice();
	publishField();
	if (config.mode === "pc" && was === "ask" && next === "allow") remote?.feedback({ toast: "Allowed on this PC" });
	if (was === "ask" && next === "deny" && !noticeFor(config.mode, next)) remote?.feedback({ toast: "Not allowed on this PC" });
}
/**
* The connected phone's link, as its own statistics say (Remote.links()), for the popup's badge: read when the popup
* asks (it does every few seconds while it's open), so nothing runs for it while nobody looks. Null: no phone, or not
* encrypted yet.
*/
async function linkFacts() {
	const r = remote;
	const lead = r?.participants.find((p) => p.lead);
	const l = r && lead ? (await r.links().catch(() => [])).find((x) => x.id === lead.id) : void 0;
	if (!l?.link.secure) return null;
	return {
		verified: l.verified,
		path: l.link.path,
		...l.link.relayProtocol ? { relay: l.link.relayProtocol } : {},
		...l.link.rttMs !== void 0 ? { rttMs: l.link.rttMs } : {},
		...l.link.dtls ? { dtls: l.link.dtls } : {},
		...l.link.cipher ? { cipher: l.link.cipher } : {}
	};
}
var heldBackAt = -Infinity;
function heldBack() {
	const now = performance.now();
	const notice = noticeFor(config.mode, access);
	if (!notice || now - heldBackAt < TYPING_TOAST_MS) return;
	heldBackAt = now;
	remote?.feedback({ toast: notice });
}
var TYPING_TOAST_MS = 2500;
var typingToastAt = -Infinity;
function typingRefused(toast) {
	const now = performance.now();
	if (now - typingToastAt < TYPING_TOAST_MS) return;
	typingToastAt = now;
	remote?.feedback({ toast });
}
var hostOf = (url) => {
	try {
		return url ? new URL(url).hostname : "";
	} catch {
		return "";
	}
};
/** The controlled tab's frames changed: suggest the profile the site table has for them, if it differs. */
function syncSuggestion() {
	const next = suggestForFrames([...links].filter((l) => l.tabId === config.tabId).map((l) => ({
		frameId: l.frameId,
		host: l.host
	})));
	if (next === suggested) return;
	suggested = next;
	remote?.setLayout(layoutFor(next));
}
var toBg = (m) => chrome.runtime.sendMessage(m).catch(() => void 0);
chrome.runtime.onMessage.addListener((raw, sender, respond) => {
	if (sender.id !== chrome.runtime.id || sender.tab) return;
	const req = parseOffscreenRequest(raw);
	if (!req) return;
	switch (req.type) {
		case "config":
			applyConfig(req);
			respond(true);
			break;
		case "unpair":
			remote?.disconnect();
			break;
		case "forget":
			remote?.forget(req.id);
			break;
		case "lan":
			remote?.selectLan(req.id);
			break;
		case "diag":
			respond(remote?.diag() ?? null);
			return true;
		case "facts":
			linkFacts().then(respond, () => respond(null));
			return true;
		case "text-field":
			textField = req.field;
			publishField();
			break;
		case "typing":
			if (onPc()) typingRefused(typingToast(req.refused));
			break;
		case "access": if (req.key === phone?.key) {
			accessSeq++;
			setAccess(req.access);
		}
	}
});
chrome.runtime.onConnect.addListener((port) => {
	if (port.name !== "obpal-link/page") return;
	const tabId = port.sender?.tab?.id;
	if (tabId === void 0 || port.sender?.id !== chrome.runtime.id || configured && tabId !== config.tabId) {
		port.disconnect();
		return;
	}
	const link = {
		port,
		tabId,
		frameId: port.sender?.frameId ?? 0,
		host: hostOf(port.sender?.url),
		lock: false,
		focus: false,
		focusAt: 0,
		area: 0,
		lastSent: 0,
		wasActive: false,
		sig: ""
	};
	links.add(link);
	port.onMessage.addListener((raw) => onPageMessage(link, raw));
	port.onDisconnect.addListener(() => forget(link));
	syncSuggestion();
});
function applyConfig({ tabId, mode, desktop }) {
	const modeChanged = mode !== config.mode;
	const wholeChanged = desktop !== config.desktop;
	config = {
		tabId,
		mode,
		desktop
	};
	configured = true;
	const keys = pcKeys(desktop);
	if (pc.mapper.cfg !== keys) {
		pc.held.apply(pc.mapper.releaseAll());
		pc.mapper.cfg = keys;
	}
	for (const l of [...links]) {
		if (l.tabId === tabId) continue;
		forget(l);
		try {
			l.port.disconnect();
		} catch {}
	}
	if (modeChanged) {
		for (const l of links) l.sig = "";
		if (mode !== "pc") pcLetGo();
		remote?.setValues({ target: mode });
		remote?.setLayout(layoutFor(suggested));
		publishField();
		publishNotice();
	} else if (wholeChanged) remote?.setLayout(layoutFor(suggested));
	syncSuggestion();
}
var pc = {
	mapper: new KeyMapper(),
	held: new HeldState(),
	gestures: new PcGestures(),
	port: null,
	inputAt: -Infinity,
	lastTick: 0,
	lastSent: 0,
	/** What the last frame sent held: a change goes out at once, so a release never waits for the heartbeat. */
	lastSig: "",
	retryAt: 0,
	retryMs: 250
};
var CTRL = ["ControlLeft"];
/** A hold that became a right-click buzzes the phone this briefly. */
var BUZZ = {
	strong: .5,
	weak: .3,
	ms: 45
};
function pcPort() {
	if (pc.port) return pc.port;
	const now = performance.now();
	if (now < pc.retryAt) return null;
	let port;
	try {
		port = chrome.runtime.connect({ name: NATIVE_PORT_NAME });
	} catch {
		pc.retryAt = now + pc.retryMs;
		pc.retryMs = Math.min(pc.retryMs * 2, 5e3);
		return null;
	}
	pc.port = port;
	pc.retryMs = 250;
	port.onDisconnect.addListener(() => {
		chrome.runtime.lastError;
		if (pc.port === port) pc.port = null;
		pc.retryAt = performance.now() + pc.retryMs;
		pc.retryMs = Math.min(pc.retryMs * 2, 5e3);
	});
	return port;
}
var tupleToPad = (p) => p ? {
	buttons: p[0],
	axes: [
		p[1],
		p[2],
		p[3],
		p[4]
	],
	triggers: [p[5], p[6]]
} : null;
function pcTick(f, pad, ptr, now) {
	if (!f.connected || now - pc.inputAt >= PC_INPUT_STALE_MS) {
		pcLetGo();
		return;
	}
	const dt = pc.lastTick ? Math.min(50, now - pc.lastTick) : TICK_MS;
	pc.lastTick = now;
	const padIn = !!ptr && (ptr.flags & PointerFlag.relative) !== 0 && pad ? tupleToPad(withRelativeAim(padTuple(pad), relativeRate(ptr, now))) : pad;
	const tilt = f.connected && !pad && f.mode === Mode.tilt ? f.tilt : null;
	const out = pc.mapper.update({
		pad: padIn,
		tilt,
		aim: f.aim,
		pad1: f.pad1,
		dtMs: dt
	});
	pc.held.apply(out);
	const mods = [...pc.held.keys].some(isModifier);
	const g = pc.gestures.tick({
		now,
		connected: f.connected,
		touching: f.touching,
		move: out.move,
		pan: f.pad2,
		pinch: f.zoom,
		mods
	});
	if (g.buzz) remote?.rumble(BUZZ.strong, BUZZ.weak, BUZZ.ms);
	const frame = buildNativeFrame(pc.held, g.move, [g.wheel[0] + out.wheel[0], g.wheel[1] + out.wheel[1]], {
		buttons: g.buttons,
		keys: [...g.ctrl ? CTRL : [], ...g.keys]
	});
	const sig = heldSignature(frame);
	const repeat = isIdleFrame(frame) && sig === pc.lastSig && now - pc.lastSent < 250;
	if (repeat && !g.text.length) return;
	const port = pcPort();
	if (!port) return;
	try {
		if (!repeat) {
			port.postMessage(frame);
			pc.lastSent = now;
			pc.lastSig = sig;
		}
		for (const t of g.text) port.postMessage(t);
	} catch {
		pc.port = null;
	}
}
/** Leaving the PC target or losing input: release once and stop resending, so the helper's watchdog can fire. */
function pcLetGo() {
	pc.mapper.releaseAll();
	pc.held.clear();
	pc.gestures.reset();
	pc.inputAt = -Infinity;
	pc.lastTick = 0;
	pc.lastSig = "";
	const port = pc.port;
	pc.port = null;
	if (!port) return;
	try {
		port.postMessage(buildNativeFrame(pc.held, [0, 0]));
	} catch {}
	try {
		port.disconnect();
	} catch {}
}
function forget(l) {
	links.delete(l);
	lastTargets.delete(l);
	syncSuggestion();
}
function onPageMessage(link, raw) {
	const m = parseFromPage(raw);
	if (!m || link.tabId !== config.tabId) return;
	if (m.t === "rep") {
		if (m.focus && !link.focus) link.focusAt = performance.now();
		link.focus = m.focus;
		link.area = m.area;
		link.lock = m.lock === true;
	} else rumble(m.s, m.w, m.ms);
}
var rumbleAt = 0;
var rumbleNext = null;
var rumbleTimer;
function rumble(s, w, ms) {
	const wait = rumbleAt + RUMBLE_GAP_MS - performance.now();
	if (wait <= 0 && !rumbleTimer) {
		rumbleAt = performance.now();
		remote?.rumble(s, w, ms);
		return;
	}
	rumbleNext = {
		s,
		w,
		ms
	};
	rumbleTimer ??= setTimeout(() => {
		rumbleTimer = void 0;
		const next = rumbleNext;
		rumbleNext = null;
		if (!next) return;
		rumbleAt = performance.now();
		remote?.rumble(next.s, next.w, next.ms);
	}, Math.max(0, wait));
}
function post(l, m) {
	try {
		l.port.postMessage(m);
	} catch {
		forget(l);
	}
}
var lastTick = 0;
var lastPtr = null;
var relRate = [0, 0];
var relAt = 0;
function relativeRate(ptr, now) {
	if (!ptr || !(ptr.flags & PointerFlag.relative)) {
		lastPtr = ptr;
		relRate = [0, 0];
		return relRate;
	}
	if (ptr !== lastPtr) {
		if (lastPtr && lastPtr.flags & PointerFlag.relative) {
			const [dy, dp] = pointerDelta(ptr, lastPtr);
			const dtMs = Math.min(100, Math.max(8, (ptr.t - lastPtr.t >>> 0) / 1e3));
			relRate = [dy * 1e3 / dtMs, dp * 1e3 / dtMs];
		}
		lastPtr = ptr;
		relAt = now;
	} else if (now - relAt > 150) relRate = [0, 0];
	return relRate;
}
function tick() {
	const r = remote;
	if (!r) return;
	const now = performance.now();
	lastTick = now;
	const f = r.consume(now);
	const pad = r.pad;
	const ptr = r.pointer;
	if (onPc()) pcTick(f, pad, ptr, now);
	else if (config.mode === "pc" && (f.touching || !!pad?.buttons)) heldBack();
	if (config.tabId === null || !links.size) {
		lastTargets.clear();
		return;
	}
	const targets = new Set(recipients([...links], config.mode));
	for (const l of lastTargets) {
		if (targets.has(l)) continue;
		post(l, { t: "rel" });
		l.sig = "";
	}
	lastTargets = targets;
	if (config.mode === "pc") return;
	const gamepad = config.mode === "gamepad";
	const relative = !!ptr && (ptr.flags & PointerFlag.relative) !== 0;
	const ptFrame = ptr ? electFrame([...links], "pointer") : null;
	const rate = relativeRate(ptr, now);
	let p = padTuple(pad);
	if (gamepad && relative && !ptFrame?.lock) p = withRelativeAim(p, rate);
	if (gamepad && ptr && !relative) p = withoutClickButtons(p);
	const pt = ptr && (!gamepad || !relative || ptFrame?.lock) ? pointerTuple(ptr, pad?.buttons ?? 0) : null;
	const tl = tiltTuple(f.connected && !pad && f.mode === Mode.tilt ? f.tilt : null);
	const d = deltaTuple(f);
	const active = isActive(p, d, tl, pt);
	const mode = config.mode;
	const sig = frameSignature(mode, p, tl);
	for (const l of targets) {
		if (!active && l.sig === sig && now - l.lastSent < HEARTBEAT_MS) continue;
		post(l, buildFrame(mode, l.wasActive ? Math.min(50, now - l.lastSent) : TICK_MS, p, d, tl, gamepad && l !== ptFrame ? null : pt));
		l.lastSent = now;
		l.wasActive = active;
		l.sig = sig;
	}
}
/** Clock ticks keep heartbeats and rate inputs going; a packet from the phone is sampled the moment it lands. */
function clockTick() {
	if (performance.now() - lastTick < TICK_MIN_GAP_MS) return;
	tick();
}
function startClock() {
	const fallback = () => setInterval(clockTick, TICK_MS);
	try {
		const worker = new Worker(new URL(
			/* @vite-ignore */
			"/assets/ticker-BhYtNb2H.js",
			"" + import.meta.url
		), { type: "module" });
		worker.onmessage = clockTick;
		worker.onerror = () => {
			worker.terminate();
			fallback();
		};
	} catch {
		fallback();
	}
}
async function boot() {
	const r = await Remote.create({
		appName: APP_NAME,
		service: SERVICE,
		layout: layoutFor(suggested),
		remember: true,
		rotateInvite: true
	});
	remote = r;
	const state = () => ({
		status: r.status,
		url: r.pairingUrl,
		device: r.deviceName && r.participants.every((p) => p.paused) ? `${r.deviceName} · paused` : r.deviceName,
		lan: r.lanUrl,
		lanFor: r.lanFor,
		pairs: r.remembered
	});
	const report = () => void toBg({
		to: "bg",
		type: "link",
		link: state()
	});
	r.on("status", report);
	r.on("attention", () => {
		pc.gestures.reset();
		report();
	});
	r.on("lan", report);
	r.on("invite", report);
	r.on("connect", () => {
		reportPhone();
		report();
		r.setValues({ target: config.mode });
		publishField(true);
		publishNotice(true);
	});
	r.on("disconnect", () => {
		pcLetGo();
		report();
	});
	r.on("join", () => void reportPhone());
	r.on("leave", () => void reportPhone());
	r.on("button", ({ id, ev }) => {
		if (config.mode !== "pc") return;
		if (!onPc()) return heldBack();
		pc.gestures.button(id, ev, performance.now());
		tick();
	});
	r.on("text", ({ s, del }) => {
		if (config.mode !== "pc") return;
		if (!onPc()) return heldBack();
		const t = parseNativeText({
			t: "text",
			s,
			del
		});
		if (!t) return typingRefused(typingToast("bad-text"));
		pc.gestures.text(t.s, t.del);
		tick();
	});
	r.on("input", (who) => {
		if (who.lead) pc.inputAt = performance.now();
		tick();
	});
	r.on("value", ({ id, v }) => {
		if (id === "target" && isTargetMode(v)) toBg({
			to: "bg",
			type: "mode",
			mode: v
		}).then((res) => {
			if (res?.refused !== "deny") return;
			r.setValues({ target: config.mode });
			r.feedback({ toast: "Not allowed on this PC" });
		});
		else if (id === "mouse-wheel" && typeof v === "number" && config.mode === "pc") {
			if (!onPc()) return heldBack();
			pc.gestures.wheel(v);
			tick();
		}
	});
	report();
	const cfg = parseConfig(await toBg({
		to: "bg",
		type: "offscreen-ready"
	}));
	if (cfg && !configured) applyConfig(cfg);
	reportPhone(true);
	startClock();
}
boot().catch((e) => {
	console.error("[ob.Pal Link] could not start the phone link", e);
	toBg({
		to: "bg",
		type: "link",
		link: {
			status: "offline",
			url: "",
			device: null,
			lan: "",
			lanFor: null,
			pairs: []
		}
	});
});
//#endregion
