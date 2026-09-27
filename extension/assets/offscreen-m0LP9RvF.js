import { A as lanAnswerSdp, C as bindMac, D as encodePairing, E as encodeLanPairing, F as readLocalIce, G as isTargetMode, I as roomIdFor, L as sdpFingerprint, M as lanIceCredentials, N as newSecret, O as equalBytes, P as randomBytes, R as APP_NAME, S as b64url, T as certFingerprint, U as SERVICE, V as PAGE_MODES, _ as packetType, b as loadCertificate, d as clamp$1, f as hysteresis, g as decodePad, h as PadFlag, i as parseFromPage, j as lanContext, k as fromB64url, l as Accum, m as PadButton, o as parseOffscreenRequest, p as stickCurve, r as parseConfig, u as buttonValue, v as forgetPair, w as candidatesOf, x as putPair, y as listPairs, z as DEFAULT_MODE } from "./messages-C4kzpYnI.js";
import { a as NATIVE_PORT_NAME, c as heldSignature, l as isIdleFrame, r as HeldState, s as buildNativeFrame } from "./native-CYWtXzmG.js";
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
	if (cos > .9995) return qNorm([
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
/** ICE servers for a room: STUN, plus TURN when the service mints credentials. Falls back to STUN within the timeout. */
async function fetchIceServers(service, roomId, timeoutMs = REACH_TIMEOUT_MS) {
	try {
		const r = await fetch(`${service}/api/ice?room=${encodeURIComponent(roomId)}`, {
			cache: "no-store",
			signal: AbortSignal.timeout(timeoutMs)
		});
		if (r.ok) {
			const j = await r.json();
			if (Array.isArray(j.iceServers) && j.iceServers.length) return j.iceServers;
		}
	} catch {}
	return STUN;
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
//#region ../packages/host/src/stream.ts
/** A pointer stream that stops (the utility was switched off, the phone went away) is gone after this long. */
var POINTER_STALE_MS = 300;
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
	/** Latest controller state while the device is in gamepad mode (null otherwise). */
	get pad() {
		if (this.padState && !this.padLive) {
			this.padState = null;
			this.hooks.pad(false);
		}
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
		if (!s || !this.buf.length) return frame;
		if (this.padLive && this.padAt > this.stateAt) {
			frame.mode = Mode.gamepad;
			return frame;
		}
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
			value: [],
			mode: [],
			recenter: [],
			pad: [],
			input: [],
			claim: [],
			lan: []
		};
		this.cards = [];
		this.service = (opts.service ?? (isObpalOrigin() ? location.origin : "https://obpal.blackboxes.net")).replace(/\/$/, "");
		this.layout = opts.layout ?? DEFAULT_LAYOUT;
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
		this.prepareLan();
	}
	/** Join the signaling room of the current secret: the invite the pairing code carries. */
	async openRoom() {
		this.roomId = await roomIdFor(this.secret);
		this.pairingUrl = `${this.service}/p/#${encodePairing({
			secret: this.secret,
			fp: this.fp
		})}`;
		this.sig = new SignalClient(roomSocketUrl(this.service, this.roomId, "host"));
		this.sig.onmessage = (m) => this.onSignal(m);
		this.sig.onstatus = (open) => {
			if (open && this.status !== "connected") this.setStatus("ready");
			if (!open && this.status !== "connected") this.setStatus("offline");
		};
		this.sig.connect();
		const room = this.roomId;
		setTimeout(async () => {
			const ice = await fetchIceServers(this.service, room);
			if (room === this.roomId) this.ice = ice;
		}, 400);
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
		for (const p of [...this.peers.values()]) if (!p.bound && !p.lan) this.dropPeer(p.id);
		await this.openRoom();
		for (const c of this.cards) this.renderQr(c);
		this.renderCards();
	}
	on(ev, fn) {
		this.handlers[ev].push(fn);
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
	/** Forget a remembered phone: it can only pair online again. */
	async forget(id) {
		this.pairs = this.pairs.filter((p) => p.id !== id);
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
	/** After an online pairing: a (new) key for this phone, kept here and handed to it in `welcome`. Stored in the background. */
	rememberDevice(peer, name) {
		if (!this.opts.remember || !peer.fp) return null;
		const existing = this.pairs.find((p) => equalBytes(p.peerFp, peer.fp));
		const key = randomBytes(32);
		const rec = {
			id: existing?.id ?? b64url(randomBytes(16)),
			key,
			peerFp: peer.fp,
			peerName: name,
			at: Date.now()
		};
		this.pairs = [rec, ...this.pairs.filter((p) => p.id !== rec.id)];
		putPair(rec).then(() => this.emit("lan"));
		return {
			id: rec.id,
			key: b64url(key)
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
		if (!this.opts.remember) return;
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
	onSignal(m) {
		if (m.t === "peer" && m.ev === "leave") this.dropPeer(m.id);
		if (m.t === "sig") this.onPayload(m.from, m.d);
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
			stream: new Stream({
				mode: (m) => this.emit("mode", m, this.participant(peer)),
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
			if (!this.listening(peer) || !(e.data instanceof ArrayBuffer)) return;
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
	async onPayload(id, d) {
		if ("offer" in d) {
			this.dropPeer(id);
			if (this.status !== "connected") this.setStatus("connecting");
			const pc = new RTCPeerConnection({
				iceServers: this.ice,
				certificates: [this.cert]
			});
			const peer = this.addPeer(id, pc, sdpFingerprint(d.offer.sdp));
			pc.onicecandidate = (e) => {
				if (e.candidate) this.sig.send({
					t: "sig",
					to: id,
					d: { cand: e.candidate.toJSON() }
				});
			};
			await pc.setRemoteDescription(d.offer);
			for (const c of peer.cands.splice(0)) await pc.addIceCandidate(c).catch(() => {});
			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);
			this.sig.send({
				t: "sig",
				to: id,
				d: { answer: pc.localDescription.toJSON() }
			});
		} else if ("cand" in d) {
			const peer = this.peers.get(id);
			if (!peer) return;
			if (peer.pc.remoteDescription) await peer.pc.addIceCandidate(d.cand).catch(() => {});
			else peer.cands.push(d.cand);
		}
	}
	async onCtl(peer, data) {
		if (typeof data !== "string") return;
		let m;
		try {
			m = JSON.parse(data);
		} catch {
			return;
		}
		if (!peer.bound) {
			if (m.t !== "hello" || !peer.fp) return;
			const expected = peer.lan ? await bindMac(peer.lan.pair.key, peer.fp, this.fp, lanContext(peer.lan.nonce)) : await bindMac(this.secret, peer.fp, this.fp, this.roomId);
			if (peer.lan && m.pair !== peer.lan.pair.id) {
				this.reject(peer);
				return;
			}
			if (!equalBytes(new TextEncoder().encode(expected), new TextEncoder().encode(m.mac))) {
				this.reject(peer);
				return;
			}
			if (this.shared && this.bound().length >= this.seats) {
				this.send(peer, {
					t: "lock",
					reason: "full"
				});
				setTimeout(() => this.dropPeer(peer.id), 200);
				return;
			}
			peer.bound = true;
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
			} else pair = this.rememberDevice(peer, peer.name) ?? void 0;
			this.send(peer, {
				t: "welcome",
				proto: 1,
				name: this.opts.appName,
				layout: this.layout,
				...pair ? { pair } : {}
			});
			if (this.shared) this.send(peer, {
				t: "state",
				values: {
					...this.values,
					color: peer.color
				}
			});
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
		const who = this.participant(peer);
		switch (m.t) {
			case "btn":
				this.emit("button", {
					id: m.id,
					ev: m.ev
				}, who);
				break;
			case "value":
				this.emit("value", {
					id: m.id,
					v: m.v,
					add: m.add === true
				}, who);
				break;
			case "mode":
				this.emit("mode", m.m, who);
				break;
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
		this.send(peer, {
			t: "lock",
			reason: "rejected"
		});
		setTimeout(() => this.dropPeer(peer.id), 200);
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
			caps: p.caps
		};
	}
	/** Everyone controlling the scene, oldest (the lead) first. */
	get participants() {
		return this.bound().map((p) => this.participant(p));
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
		return (this.active?.stream ?? this.idle).consume(now, this.status === "connected");
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
		return (p?.bound ? p.stream : this.idle).consume(now, !!p?.bound);
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
	/** The tray and modes: for `who`, else for everyone. */
	setLayout(layout, who) {
		if (!who) this.layout = layout;
		for (const p of this.targets(who)) this.send(p, {
			t: "layout",
			layout
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
		this.lan = null;
		for (const id of [...this.peers.keys()]) this.dropPeer(id);
		this.sig?.close();
		for (const c of this.cards) c.el.remove();
		this.cards = [];
	}
	send(peer, m) {
		if (peer.ctl.readyState === "open") peer.ctl.send(JSON.stringify(m));
	}
	scheduleLost(peer) {
		if (peer.lost) return;
		peer.lost = setTimeout(() => {
			peer.lost = null;
			if (peer.pc.connectionState !== "connected") this.dropPeer(peer.id);
		}, 4e3);
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
		card.innerHTML = `
      <div class="obpal-qr" role="img" aria-label="QR code to pair your phone"></div>
      <div class="obpal-body">
        <div class="obpal-title">${compact ? `<span class="obpal-ic"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.8" width="10" height="18.4" rx="2.8"/><path d="M10.5 18h3"/></svg></span>` : ""}<span class="obpal-title-text"></span></div>
        ${compact ? "" : "<ol class=\"obpal-steps\"><li>Open your phone’s camera</li><li>Point it at this code</li><li>Tap <b>Start</b> on your phone</li></ol>"}
        <div class="obpal-status" aria-live="polite"></div>
        ${opts.testLink === false ? "" : `<a class="obpal-link" target="_blank" rel="noopener" title="Open the controller on this device">${compact ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4"/></svg><span>This device</span>` : "Open the controller on this device"}</a>`}
      </div>`;
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
			const { renderSVG } = await import("./dist-lkpp0okm.js").then((n) => n.t);
			return { renderSVG };
		}, []).then(({ renderSVG }) => {
			if (url === this.pairingUrl) c.qr.innerHTML = renderSVG(url, {
				border: 2,
				ecc: "M"
			});
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
			c.status.textContent = (c.compact ? short : text)[this.status];
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
	trig = {
		LT: false,
		RT: false
	};
	mouseHeld = /* @__PURE__ */ new Set();
	acc = new Accum();
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
		const { move, buttons, mouse } = this.cfg;
		const pad = input.pad;
		const stick = pad ? [pad.axes[0], pad.axes[1]] : this.cfg.tiltMoves && input.tilt ? input.tilt : [0, 0];
		this.dir.up = hysteresis(this.dir.up, -stick[1], move.press, move.release);
		this.dir.down = hysteresis(this.dir.down, stick[1], move.press, move.release);
		this.dir.left = hysteresis(this.dir.left, -stick[0], move.press, move.release);
		this.dir.right = hysteresis(this.dir.right, stick[0], move.press, move.release);
		const want = /* @__PURE__ */ new Set();
		for (const d of DIRS) if (this.dir[d]) want.add(move[d]);
		if (pad) {
			for (const [name, key] of Object.entries(buttons)) if (key && buttonValue(pad, PadButton[name]) >= .5) want.add(key);
		}
		const keys = this.diff(want);
		const wantBtn = /* @__PURE__ */ new Set();
		for (const t of ["LT", "RT"]) {
			const b = mouse.buttons[t];
			const v = pad ? buttonValue(pad, PadButton[t]) : 0;
			this.trig[t] = hysteresis(this.trig[t], v, mouse.press, mouse.release);
			if (this.trig[t] && b !== void 0) wantBtn.add(b);
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
		if (pad) {
			dx += stickCurve(pad.axes[2], mouse.deadzone, mouse.expo) * mouse.speed * dt;
			dy += stickCurve(pad.axes[3], mouse.deadzone, mouse.expo) * mouse.speed * dt;
		}
		return {
			keys,
			move: this.acc.take(dx, dy),
			buttons: btnEdges
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
		this.trig = {
			LT: false,
			RT: false
		};
		this.acc.reset();
		return {
			keys,
			move: [0, 0],
			buttons
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
	/** A button event from the phone (Remote 'button'): the trackpad's taps and the Point face's A, B, + and −. */
	button(id, ev, now) {
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
			case "wii-plus":
				if (ev === "tap") this.steps -= 1;
				return;
			case "wii-minus":
				if (ev === "tap") this.steps += 1;
				return;
		}
	}
	tick(t) {
		const dt = this.last ? Math.min(100, Math.max(1, t.now - this.last)) : 16;
		this.last = t.now;
		const out = {
			buttons: [],
			ctrl: false,
			move: [t.move[0], t.move[1]],
			wheel: [0, 0],
			buzz: false
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
		return out;
	}
	/** Something is going on that needs frames even without phone input: a click, a drag, a flick, a zoom step. */
	get busy() {
		return !!(this.click || this.queue.length || this.a?.drag || this.hold?.drag || this.grab || this.fling || this.steps || this.a);
	}
	/** Let go of everything: the phone went away, or the PC target was left. */
	reset() {
		this.queue = [];
		this.click = null;
		this.a = null;
		this.hold = null;
		this.grab = false;
		this.two = null;
		this.pinchAcc = 0;
		this.steps = 0;
		this.vel = [0, 0];
		this.fling = null;
		this.carry = [0, 0];
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
*/
var TICK_MS = 1e3 / 60;
/** A clock tick this soon after a packet-driven one is skipped: packets set the pace while input flows. */
var TICK_MIN_GAP_MS = 6;
var HEARTBEAT_MS = 250;
var RUMBLE_GAP_MS = 50;
/** What the phone offers: gamepad, tilt and point modes, plus a tray picker for what it drives in the browser. */
var layout = {
	v: 1,
	modes: [
		Mode.gamepad,
		Mode.tilt,
		Mode.point
	],
	tray: [{
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
				detail: "Keyboard and mouse for programs you allow"
			}
		]
	}]
};
/** The layout with the site's suggested catalogue profile (CATALOGUE §3), when the table has one. */
var layoutFor = (profile) => profile ? {
	...layout,
	profile
} : layout;
var remote = null;
var config = {
	tabId: null,
	mode: DEFAULT_MODE
};
var configured = false;
var links = /* @__PURE__ */ new Set();
var lastTargets = /* @__PURE__ */ new Set();
var suggested = null;
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
			applyConfig(req.tabId, req.mode);
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
function applyConfig(tabId, mode) {
	const modeChanged = mode !== config.mode;
	config = {
		tabId,
		mode
	};
	configured = true;
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
	}
	syncSuggestion();
}
var pc = {
	mapper: new KeyMapper(),
	held: new HeldState(),
	gestures: new PcGestures(),
	port: null,
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
	const g = pc.gestures.tick({
		now,
		connected: f.connected,
		touching: f.touching,
		move: out.move,
		pan: f.pad2,
		pinch: f.zoom
	});
	if (g.buzz) remote?.rumble(BUZZ.strong, BUZZ.weak, BUZZ.ms);
	const frame = buildNativeFrame(pc.held, g.move, g.wheel, {
		buttons: g.buttons,
		keys: g.ctrl ? CTRL : []
	});
	const sig = heldSignature(frame);
	if (isIdleFrame(frame) && sig === pc.lastSig && now - pc.lastSent < 250) return;
	const port = pcPort();
	if (!port) return;
	try {
		port.postMessage(frame);
		pc.lastSent = now;
		pc.lastSig = sig;
	} catch {
		pc.port = null;
	}
}
/** Leaving the PC target: nothing stays held, and the worker closes the helper port (which releases too). */
function pcLetGo() {
	pc.mapper.releaseAll();
	pc.held.clear();
	pc.gestures.reset();
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
	if (config.mode === "pc") pcTick(f, pad, ptr, now);
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
		remember: true
	});
	remote = r;
	const state = () => ({
		status: r.status,
		url: r.pairingUrl,
		device: r.deviceName,
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
	r.on("lan", report);
	r.on("connect", () => {
		report();
		r.setValues({ target: config.mode });
	});
	r.on("disconnect", () => {
		pc.gestures.reset();
		report();
	});
	r.on("button", ({ id, ev }) => {
		if (config.mode !== "pc") return;
		pc.gestures.button(id, ev, performance.now());
		tick();
	});
	r.on("input", tick);
	r.on("value", ({ id, v }) => {
		if (id === "target" && isTargetMode(v)) toBg({
			to: "bg",
			type: "mode",
			mode: v
		});
	});
	report();
	const cfg = parseConfig(await toBg({
		to: "bg",
		type: "offscreen-ready"
	}));
	if (cfg && !configured) applyConfig(cfg.tabId, cfg.mode);
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
