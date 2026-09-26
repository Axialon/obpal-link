//#region src/shared/native.ts
/** Native messaging host name (desktop/src/win/install.rs HOST_NAME). */
var NATIVE_HOST = "net.blackboxes.obpal";
/** runtime.connect() port the offscreen link opens to the service worker for PC frames. */
var NATIVE_PORT_NAME = "obpal-link/native";
/** Where to get the helper. */
var DESKTOP_URL = "https://github.com/Axialon/obpal-link/tree/main/desktop#readme";
var isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
var fin = (v) => typeof v === "number" && Number.isFinite(v);
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
function buildNativeFrame(held, move, wheel = [0, 0]) {
	const f = { t: "f" };
	if (held.keys.size) f.k = [...held.keys].slice(0, 16);
	if (held.buttons.size) f.b = [...held.buttons];
	const m = [int(move[0], MAX_MOVE), int(move[1], MAX_MOVE)];
	if (m[0] || m[1]) f.m = m;
	const w = [int(wheel[0], MAX_WHEEL), int(wheel[1], MAX_WHEEL)];
	if (w[0] || w[1]) f.w = w;
	return f;
}
var isIdleFrame = (f) => !f.k && !f.b && !f.m && !f.w;
/** Validate a frame from the offscreen document before it goes to the helper (every hop validates). */
function parseNativeFrame(x) {
	if (!isObj(x) || x.t !== "f") return null;
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
var MAX_PATH = 1024;
var MAX_PROGRAMS = 200;
function parseScope(x) {
	return isObj(x) && bool(x.keyboard) && bool(x.mouse) ? {
		keyboard: x.keyboard,
		mouse: x.mouse
	} : null;
}
function parseProgram(x) {
	if (!isObj(x) || !str(x.name, 260) || !str(x.path, MAX_PATH) || !str(x.title, 200)) return null;
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
	if (!isObj(x) || !bool(x.paused) || !Array.isArray(x.programs) || x.programs.length > MAX_PROGRAMS) return null;
	const programs = [];
	for (const p of x.programs) {
		if (!isObj(p) || !str(p.path, MAX_PATH) || !str(p.name, 260)) return null;
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
		programs
	};
}
function parsePcStatus(x) {
	if (!isObj(x) || !bool(x.enabled) || !bool(x.panic) || !bool(x.held)) return null;
	const front = x.front === null ? null : parseProgram(x.front);
	const program = x.program === null ? null : parseProgram(x.program);
	if (front === null && x.front !== null || program === null && x.program !== null) return null;
	return {
		enabled: x.enabled,
		panic: x.panic,
		held: x.held,
		front,
		program
	};
}
function parseHelperMessage(x) {
	if (!isObj(x)) return null;
	switch (x.t) {
		case "hello": {
			if (!Number.isInteger(x.v) || !str(x.version, 32) || !str(x.os, 16) || !isObj(x.caps)) return null;
			if (x.hotkey !== null && !str(x.hotkey, 40)) return null;
			const c = x.caps;
			if (!bool(c.keyboard) || !bool(c.mouse) || !bool(c.gamepad)) return null;
			return {
				t: "hello",
				v: x.v,
				version: x.version,
				os: x.os,
				hotkey: x.hotkey,
				caps: {
					keyboard: c.keyboard,
					mouse: c.mouse,
					gamepad: c.gamepad
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
	hotkey: null,
	error: null,
	config: null,
	status: null,
	stats: null
};
function parsePcStats(x) {
	if (!isObj(x) || !fin(x.frames) || !fin(x.injected) || !isObj(x.refused)) return null;
	const refused = {};
	for (const [k, v] of Object.entries(x.refused)) if (/^[a-zA-Z]{1,24}$/.test(k) && fin(v)) refused[k] = v;
	return {
		frames: x.frames,
		injected: x.injected,
		refused
	};
}
function parsePcState(x) {
	if (!isObj(x) || !PC_LINKS.includes(x.link)) return null;
	if (x.version !== null && !str(x.version, 32) || x.hotkey !== null && !str(x.hotkey, 40) || x.error !== null && !str(x.error, 300)) return null;
	const config = x.config === null ? null : parsePcConfig(x.config);
	const status = x.status === null ? null : parsePcStatus(x.status);
	const stats = x.stats === null || x.stats === void 0 ? null : parsePcStats(x.stats);
	if (config === null && x.config !== null || status === null && x.status !== null) return null;
	return {
		link: x.link,
		version: x.version,
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
	const program = st?.front && !st.front.browser ? st.front : st?.program ?? null;
	if (!program) return { kind: "idle" };
	if (program.elevated) return {
		kind: "elevated",
		program
	};
	if (!program.allowed) return {
		kind: "allow",
		program
	};
	return {
		kind: "active",
		program,
		scope: program.allowed,
		inFront: st?.front?.pid === program.pid && !st?.front?.browser
	};
}
/** "keyboard + mouse", "keyboard", "mouse", or "nothing". */
function scopeLabel(s) {
	const parts = [s.keyboard && "keyboard", s.mouse && "mouse"].filter((x) => !!x);
	return parts.length ? parts.join(" + ") : "nothing";
}
function parsePcRequest(x) {
	if (!isObj(x) || x.to !== "bg") return null;
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
export { NATIVE_PORT_NAME as a, parseHelperMessage as c, parsePcState as d, pcView as f, NATIVE_HOST as i, parseNativeFrame as l, toHelperRequest as m, EMPTY_PC as n, buildNativeFrame as o, scopeLabel as p, HeldState as r, isIdleFrame as s, DESKTOP_URL as t, parsePcRequest as u };
