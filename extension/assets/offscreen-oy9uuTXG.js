import { C as isTargetMode, S as TARGET_MODES, _ as APP_NAME, c as decodePad, d as certFingerprint, f as encodePairing, g as sdpFingerprint, h as roomIdFor, i as parseFromPage, l as packetType, m as newSecret, o as parseOffscreenRequest, p as equalBytes, r as parseConfig, u as bindMac, v as DEFAULT_MODE, x as SERVICE } from "./messages-Pseg0PpG.js";
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
var Mode = {
	hold: 0,
	orbit: 1,
	point: 2,
	tilt: 3,
	pad: 4,
	gamepad: 5
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
function roomSocketUrl(service, roomId, role) {
	return `${service.replace(/^http/, "ws")}/r/${roomId}?role=${role}`;
}
/** Room signaling socket with jittered reconnect and keep-alive pings (answered by the service without waking it). */
var SignalClient = class {
	constructor(url) {
		this.url = url;
		this.onmessage = () => {};
		this.onstatus = () => {};
		this.ws = null;
		this.closed = false;
		this.backoff = 400;
		this.ping = null;
	}
	connect() {
		if (this.closed) return;
		const ws = new WebSocket(this.url);
		this.ws = ws;
		ws.onopen = () => {
			this.backoff = 400;
			this.onstatus(true);
			this.ping = setInterval(() => ws.readyState === 1 && ws.send("ping"), 25e3);
		};
		ws.onmessage = (e) => {
			if (e.data === "pong") return;
			try {
				this.onmessage(JSON.parse(e.data));
			} catch {}
		};
		ws.onclose = () => {
			if (this.ping) clearInterval(this.ping);
			this.onstatus(false);
			if (this.closed) return;
			const wait = this.backoff * (.75 + Math.random() * .5);
			this.backoff = Math.min(this.backoff * 2, 8e3);
			setTimeout(() => this.connect(), wait);
		};
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
		this.ws?.close();
	}
};
async function fetchIceServers(service, roomId) {
	try {
		const r = await fetch(`${service}/api/ice?room=${encodeURIComponent(roomId)}`, { cache: "no-store" });
		if (r.ok) {
			const j = await r.json();
			if (Array.isArray(j.iceServers) && j.iceServers.length) return j.iceServers;
		}
	} catch {}
	return [{ urls: "stun:stun.cloudflare.com:3478" }];
}
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
		this.latest = null;
		this.padState = null;
		this.padAt = 0;
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
		this.lostTimer = null;
		this.handlers = {
			status: [],
			connect: [],
			disconnect: [],
			button: [],
			value: [],
			mode: [],
			recenter: [],
			pad: []
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
	async init() {
		this.cert = await RTCPeerConnection.generateCertificate({
			name: "ECDSA",
			namedCurve: "P-256"
		});
		this.fp = await certFingerprint(this.cert);
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
		setTimeout(async () => {
			this.ice = await fetchIceServers(this.service, this.roomId);
		}, 400);
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
	onSignal(m) {
		if (m.t === "peer" && m.ev === "leave") this.dropPeer(m.id);
		if (m.t === "sig") this.onPayload(m.from, m.d);
	}
	async onPayload(id, d) {
		if ("offer" in d) {
			this.dropPeer(id);
			if (this.status !== "connected") this.setStatus("connecting");
			const pc = new RTCPeerConnection({
				iceServers: this.ice,
				certificates: [this.cert]
			});
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
				fp: sdpFingerprint(d.offer.sdp),
				bound: false,
				name: "Phone",
				cands: []
			};
			this.peers.set(id, peer);
			pc.onicecandidate = (e) => {
				if (e.candidate) this.sig.send({
					t: "sig",
					to: id,
					d: { cand: e.candidate.toJSON() }
				});
			};
			pc.onconnectionstatechange = () => {
				const s = pc.connectionState;
				if ((s === "failed" || s === "closed" || s === "disconnected") && this.active === peer) this.scheduleLost();
				if (s === "connected" && this.active === peer && this.lostTimer) {
					clearTimeout(this.lostTimer);
					this.lostTimer = null;
				}
			};
			ctl.onmessage = (e) => void this.onCtl(peer, e.data);
			st.onmessage = (e) => {
				if (!peer.bound || this.active !== peer || !(e.data instanceof ArrayBuffer)) return;
				if (packetType(e.data) === 18) this.onPad(e.data);
				else this.onState(e.data);
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
			const expected = await bindMac(this.secret, peer.fp, this.fp, this.roomId);
			if (!equalBytes(new TextEncoder().encode(expected), new TextEncoder().encode(m.mac))) {
				this.send(peer, {
					t: "lock",
					reason: "rejected"
				});
				setTimeout(() => this.dropPeer(peer.id), 200);
				return;
			}
			peer.bound = true;
			peer.name = String(m.name || "Phone").slice(0, 40);
			const prev = this.active;
			if (prev && prev !== peer) {
				this.send(prev, {
					t: "lock",
					reason: "taken-over"
				});
				setTimeout(() => this.dropPeer(prev.id), 300);
			}
			this.active = peer;
			this.resetStream();
			this.deviceName = peer.name;
			if (this.lostTimer) {
				clearTimeout(this.lostTimer);
				this.lostTimer = null;
			}
			this.send(peer, {
				t: "welcome",
				proto: 1,
				name: this.opts.appName,
				layout: this.layout
			});
			this.setStatus("connected");
			this.emit("connect", {
				name: peer.name,
				caps: m.caps
			});
			return;
		}
		if (this.active !== peer) return;
		switch (m.t) {
			case "btn":
				this.emit("button", {
					id: m.id,
					ev: m.ev
				});
				break;
			case "value":
				this.emit("value", {
					id: m.id,
					v: m.v,
					add: m.add === true
				});
				break;
			case "mode":
				this.emit("mode", m.m);
				break;
			case "recenter":
				this.emit("recenter");
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
	unwrapMs(t) {
		if (this.tLast >= 0 && t < this.tLast && this.tLast - t > 2147483648) this.tBase += 4294967296;
		this.tLast = t;
		return (this.tBase + t) / 1e3;
	}
	onState(data) {
		if (!(data instanceof ArrayBuffer)) return;
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
			this.emit("mode", s.mode);
		}
	}
	onPad(data) {
		const p = decodePad(data);
		if (!p || this.padState && !seqNewer(p.seq, this.padState.seq)) return;
		const was = this.padLive;
		this.padState = p;
		this.padAt = performance.now();
		if (!was) this.emit("pad", true);
	}
	get padLive() {
		return !!this.padState && performance.now() - this.padAt < 1500;
	}
	/** Latest controller state while the phone is in gamepad mode (null otherwise). */
	get pad() {
		if (this.padState && !this.padLive) {
			this.padState = null;
			this.emit("pad", false);
		}
		return this.padState;
	}
	/** Vibrate the phone (Gamepad API dual-rumble semantics). */
	rumble(strong, weak, ms) {
		if (this.active) this.send(this.active, {
			t: "rumble",
			strong,
			weak,
			ms
		});
	}
	resetStream() {
		this.padState = null;
		this.padAt = 0;
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
	/** Read input for this frame. Call once per rendered frame (e.g. inside requestAnimationFrame). */
	consume(now = performance.now()) {
		const s = this.latest;
		const frame = {
			connected: this.status === "connected",
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
			twist: 0
		};
		if (!s || !this.buf.length) return frame;
		if (this.padLive && this.padAt > this.stateAt) {
			frame.mode = Mode.gamepad;
			return frame;
		}
		let ai = this.buf.length - 1;
		let bi = -1;
		let alpha = 0;
		if (this.opts.latency !== "direct") {
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
	setLayout(layout) {
		this.layout = layout;
		if (this.active) this.send(this.active, {
			t: "layout",
			layout
		});
	}
	/** Sync toggle/label state shown on the phone. */
	setValues(values) {
		if (this.active) this.send(this.active, {
			t: "state",
			values
		});
	}
	feedback(f) {
		if (this.active) this.send(this.active, {
			t: "feedback",
			...f
		});
	}
	/** Disconnect the current phone (it can rescan to reconnect). */
	disconnect() {
		const p = this.active;
		if (!p) return;
		this.send(p, {
			t: "lock",
			reason: "host-closed"
		});
		setTimeout(() => this.dropPeer(p.id), 200);
	}
	destroy() {
		for (const id of [...this.peers.keys()]) this.dropPeer(id);
		this.sig?.close();
		for (const c of this.cards) c.el.remove();
		this.cards = [];
	}
	send(peer, m) {
		if (peer.ctl.readyState === "open") peer.ctl.send(JSON.stringify(m));
	}
	scheduleLost() {
		if (this.lostTimer) return;
		this.lostTimer = setTimeout(() => {
			this.lostTimer = null;
			if (this.active && this.active.pc.connectionState !== "connected") this.dropPeer(this.active.id);
		}, 4e3);
	}
	dropPeer(id) {
		const p = this.peers.get(id);
		if (!p) return;
		this.peers.delete(id);
		try {
			p.pc.close();
		} catch {}
		if (this.active === p) {
			this.active = null;
			this.deviceName = null;
			this.resetStream();
			this.setStatus(this.sig?.open ? "ready" : "offline");
			this.emit("disconnect");
		}
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
		const link = card.querySelector(".obpal-link");
		if (link) link.href = this.pairingUrl;
		__vitePreload(async () => {
			const { renderSVG } = await import("./dist-lkpp0okm.js").then((n) => n.t);
			return { renderSVG };
		}, []).then(({ renderSVG }) => {
			card.querySelector(".obpal-qr").innerHTML = renderSVG(this.pairingUrl, {
				border: 2,
				ecc: "M"
			});
		});
		el.appendChild(card);
		this.cards.push({
			el: card,
			status: card.querySelector(".obpal-status"),
			compact
		});
		this.renderCards();
		return card;
	}
	renderCards() {
		const text = {
			starting: "Starting…",
			ready: "Waiting for your phone",
			connecting: "Phone found, connecting…",
			connected: `Connected${this.deviceName ? ` to ${this.deviceName}` : ""}`,
			offline: "Offline, retrying…"
		};
		const short = {
			starting: "Starting",
			ready: "Waiting",
			connecting: "Connecting",
			connected: "Connected",
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
	let best = null;
	for (const f of frames) if (role === "keys" ? f.focus && (!best || f.focusAt > best.focusAt) : f.area >= 19200 && (!best || f.area > best.area)) best = f;
	return best ?? top;
}
/** Which frames get input frames in a mode: every frame for the controller, one elected frame otherwise. */
function recipients(frames, mode) {
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
function tiltTuple(t) {
	if (!t) return null;
	const v = [round(Math.max(-1, Math.min(1, t[0])), 1e3), round(Math.max(-1, Math.min(1, t[1])), 1e3)];
	return v[0] || v[1] ? v : null;
}
/** Is anything being pressed or moved? Active input streams at the full rate; idle input only heartbeats. */
function isActive(p, d, tl) {
	if (d || tl) return true;
	if (!p) return false;
	return p[0] !== 0 || p.slice(1).some((v) => Math.abs(v) > .02);
}
var modeIndex = (mode) => TARGET_MODES.indexOf(mode);
function buildFrame(mode, dt, p, d, tl) {
	return {
		t: "in",
		m: modeIndex(mode),
		dt: round(Math.max(0, Math.min(1e3, dt)), 10),
		p,
		d,
		tl
	};
}
/** Identity of the held (non-delta) state; a change is sent at once even when idle. */
var frameSignature = (mode, p, tl) => JSON.stringify([
	mode,
	p,
	tl
]);
//#endregion
//#region src/offscreen.ts
/**
* Offscreen document (reason WEB_RTC). An MV3 service worker cannot hold an RTCPeerConnection, so the ob.Pal
* Remote lives here: the pairing QR payload, signaling, and the WebRTC link to the phone.
* About 60 times a second it samples the phone (remote.pad and remote.consume()) and streams compact input
* frames to the page bridges of the controlled tab over runtime ports: the controller to every frame, keys to
* the focused frame, 3D drags to the frame with the largest canvas.
*/
var TICK_MS = 1e3 / 60;
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
			}
		]
	}]
};
var remote = null;
var config = {
	tabId: null,
	mode: DEFAULT_MODE
};
var configured = false;
var links = /* @__PURE__ */ new Set();
var lastTargets = /* @__PURE__ */ new Set();
var toBg = (m) => chrome.runtime.sendMessage(m).catch(() => void 0);
chrome.runtime.onMessage.addListener((raw, sender) => {
	if (sender.id !== chrome.runtime.id || sender.tab) return;
	const req = parseOffscreenRequest(raw);
	if (!req) return;
	if (req.type === "config") applyConfig(req.tabId, req.mode);
	else remote?.disconnect();
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
		remote?.setValues({ target: mode });
	}
}
function forget(l) {
	links.delete(l);
	lastTargets.delete(l);
}
function onPageMessage(link, raw) {
	const m = parseFromPage(raw);
	if (!m || link.tabId !== config.tabId) return;
	if (m.t === "rep") {
		if (m.focus && !link.focus) link.focusAt = performance.now();
		link.focus = m.focus;
		link.area = m.area;
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
function tick() {
	const r = remote;
	if (!r) return;
	const now = performance.now();
	const f = r.consume(now);
	const pad = r.pad;
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
	const p = padTuple(pad);
	const tl = tiltTuple(f.connected && !pad && f.mode === Mode.tilt ? f.tilt : null);
	const d = deltaTuple(f);
	const active = isActive(p, d, tl);
	const sig = frameSignature(config.mode, p, tl);
	for (const l of targets) {
		if (!active && l.sig === sig && now - l.lastSent < HEARTBEAT_MS) continue;
		const dt = l.wasActive ? Math.min(50, now - l.lastSent) : TICK_MS;
		post(l, buildFrame(config.mode, dt, p, d, tl));
		l.lastSent = now;
		l.wasActive = active;
		l.sig = sig;
	}
}
function startClock() {
	const fallback = () => setInterval(tick, TICK_MS);
	try {
		const worker = new Worker(new URL(
			/* @vite-ignore */
			"/assets/ticker-BhYtNb2H.js",
			"" + import.meta.url
		), { type: "module" });
		worker.onmessage = tick;
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
		layout
	});
	remote = r;
	const report = () => void toBg({
		to: "bg",
		type: "link",
		link: {
			status: r.status,
			url: r.pairingUrl,
			device: r.deviceName
		}
	});
	r.on("status", report);
	r.on("connect", () => {
		report();
		r.setValues({ target: config.mode });
	});
	r.on("disconnect", report);
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
			device: null
		}
	});
});
//#endregion
