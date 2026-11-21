import { X as PadButton, lt as PAGE_MODES } from "./messages-CnGyVAm-.js";
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
//#region src/shared/route.ts
/**
* Frame routing and wire encoding for the offscreen link. Pure.
*
* A tab can hold many frames (a game in an iframe, ads, widgets). Like real hardware:
*  - the virtual controller is visible to every frame (the Gamepad API is per frame),
*  - keys go to the one focused frame,
*  - 3D drags go to the frame with the largest visible canvas / <model-viewer>.
*/
/** Consider the game frames, not an unrelated small widget elsewhere in the tab. */
function detectedMode(frames, now) {
	const relevant = /* @__PURE__ */ new Set([
		frames.find((f) => f.frameId === 0),
		electFrame(frames, "keys"),
		electFrame(frames, "viewer"),
		electFrame(frames, "pointer")
	]);
	let keys = false;
	for (const f of relevant) {
		const s = f?.signals;
		if (!s) continue;
		if (s.padListeners || s.pads && now - s.padAt <= 1e4) return "gamepad";
		if (s.keyListeners) keys = true;
	}
	return keys ? "keys" : null;
}
/** Settle quiet observations, probe again on the first press, then keep the choice for this game. */
var AutoMode = class {
	mode;
	candidate = null;
	since = 0;
	firstAt = null;
	locked = false;
	constructor(last = "gamepad") {
		this.mode = last;
	}
	update(frames, now, pressed) {
		if (this.locked) return this.mode;
		if (pressed && this.firstAt === null) this.firstAt = now;
		const next = detectedMode(frames, now);
		if (next !== this.candidate) {
			this.candidate = next;
			this.since = now;
		}
		if (this.firstAt !== null && now - this.firstAt >= 250 && next) {
			this.mode = next;
			this.locked = true;
		} else if (this.firstAt === null && next && now - this.since >= 200) this.mode = next;
		return this.mode;
	}
};
var autoNotice = (mode) => mode === "keys" ? "This game uses the keyboard: Keys" : "This game uses a gamepad: Controller";
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
export { electFrame as a, padTuple as c, tiltTuple as d, withRelativeAim as f, deltaTuple as i, pointerTuple as l, autoNotice as n, frameSignature as o, withoutClickButtons as p, buildFrame as r, isActive as s, AutoMode as t, recipients as u };
