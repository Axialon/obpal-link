(function() {
	new TextEncoder();
	//#endregion
	//#region ../packages/core/src/pad.ts
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
	//#endregion
	//#region ../packages/host/src/gamepad.ts
	var GAMEPAD_ID = "ob.Pal Controller (STANDARD GAMEPAD Vendor: 0b0a Product: 0001)";
	/** Build a Gamepad-like object from a PAD state. Triggers map to buttons 6/7 with analog values. */
	function toStandardGamepad(pad, index, opts = {}) {
		const buttons = Array.from({ length: 17 }, (_, i) => {
			let value = pad && pad.buttons & 1 << i ? 1 : 0;
			if (pad && i === PadButton.LT) value = Math.max(value, pad.triggers[0]);
			if (pad && i === PadButton.RT) value = Math.max(value, pad.triggers[1]);
			return {
				pressed: value > .12,
				touched: value > 0,
				value
			};
		});
		const rumble = opts.rumble;
		return {
			id: GAMEPAD_ID,
			index,
			connected: !!pad,
			mapping: "standard",
			timestamp: opts.timestamp ?? performance.now(),
			axes: pad ? [...pad.axes] : [
				0,
				0,
				0,
				0
			],
			buttons,
			vibrationActuator: rumble ? {
				type: "dual-rumble",
				effects: ["dual-rumble"],
				playEffect: (_type, p = {}) => {
					rumble(p.strongMagnitude ?? 0, p.weakMagnitude ?? 0, p.duration ?? 200);
					return Promise.resolve("complete");
				},
				reset: () => {
					rumble(0, 0, 0);
					return Promise.resolve("complete");
				}
			} : null,
			hapticActuators: []
		};
	}
	/**
	* Make a phone-driven controller visible to any page code that uses the Gamepad API:
	* navigator.getGamepads() includes it, and gamepadconnected/disconnected events fire.
	* Real hardware controllers keep their slots; the virtual pad takes the first free index.
	* Returns an uninstall function.
	*/
	function installGamepadShim(source) {
		const nav = navigator;
		const native = nav.getGamepads ? nav.getGamepads.bind(nav) : () => [];
		let index = -1;
		let wasConnected = false;
		let last = null;
		const slotFor = (list) => {
			if (index >= 0 && !list[index]) return index;
			const free = list.findIndex((g) => !g);
			return free >= 0 ? free : Math.max(list.length, 0);
		};
		const current = () => {
			const pad = source.get();
			if (!pad) return null;
			const list = Array.from(native());
			index = slotFor(list);
			last = toStandardGamepad(pad, index, { rumble: source.rumble });
			return last;
		};
		const patched = () => {
			const list = Array.from(native());
			const pad = current();
			if (pad) {
				while (list.length <= pad.index) list.push(null);
				list[pad.index] = pad;
			}
			return list;
		};
		Object.defineProperty(nav, "getGamepads", {
			configurable: true,
			writable: true,
			value: patched
		});
		let raf = 0;
		const tick = () => {
			const pad = source.get();
			if (!!pad !== wasConnected) {
				wasConnected = !!pad;
				const gp = wasConnected ? current() : last;
				if (gp) {
					const ev = new Event(wasConnected ? "gamepadconnected" : "gamepaddisconnected");
					Object.defineProperty(ev, "gamepad", { value: {
						...gp,
						connected: wasConnected
					} });
					window.dispatchEvent(ev);
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(raf);
			Object.defineProperty(nav, "getGamepads", {
				configurable: true,
				writable: true,
				value: native
			});
		};
	}
	//#endregion
	//#region src/shared/constants.ts
	/** window.postMessage channel id shared by the isolated-world bridge and the MAIN-world page script. */
	var CHANNEL = "obpal-link/v1";
	/** What the phone drives in the controlled tab. Index order is the wire encoding (InputFrame.m). */
	var TARGET_MODES = [
		"gamepad",
		"viewer",
		"keys"
	];
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
	//#region src/shared/keys.ts
	/**
	* Keys mode: turn a phone controller into keyboard and mouse input for keyboard/mouse web games.
	* Pure: the mapper returns key and mouse edges; the MAIN-world page script dispatches them.
	*/
	var k = (key, code, keyCode, location = 0) => ({
		key,
		code,
		keyCode,
		location
	});
	/** Every key a binding can name, keyed by KeyboardEvent.code. Add a row here to make another key bindable. */
	var KEYS = {
		KeyW: k("w", "KeyW", 87),
		KeyA: k("a", "KeyA", 65),
		KeyS: k("s", "KeyS", 83),
		KeyD: k("d", "KeyD", 68),
		KeyE: k("e", "KeyE", 69),
		KeyQ: k("q", "KeyQ", 81),
		KeyR: k("r", "KeyR", 82),
		KeyF: k("f", "KeyF", 70),
		KeyC: k("c", "KeyC", 67),
		KeyX: k("x", "KeyX", 88),
		KeyZ: k("z", "KeyZ", 90),
		Digit1: k("1", "Digit1", 49),
		Digit2: k("2", "Digit2", 50),
		Digit3: k("3", "Digit3", 51),
		Digit4: k("4", "Digit4", 52),
		Space: k(" ", "Space", 32),
		Enter: k("Enter", "Enter", 13),
		Escape: k("Escape", "Escape", 27),
		Tab: k("Tab", "Tab", 9),
		Backspace: k("Backspace", "Backspace", 8),
		ShiftLeft: k("Shift", "ShiftLeft", 16, 1),
		ControlLeft: k("Control", "ControlLeft", 17, 1),
		AltLeft: k("Alt", "AltLeft", 18, 1),
		ArrowUp: k("ArrowUp", "ArrowUp", 38),
		ArrowDown: k("ArrowDown", "ArrowDown", 40),
		ArrowLeft: k("ArrowLeft", "ArrowLeft", 37),
		ArrowRight: k("ArrowRight", "ArrowRight", 39)
	};
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
			const dt = clamp(input.dtMs, 0, 100) / 1e3;
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
	/** KeyboardEvent init for a key edge. Letters are upper-cased while Shift is held, as a real keyboard reports them. */
	function keyInit(name, mods) {
		const d = KEYS[name];
		return {
			key: mods.shift && /^[a-z]$/.test(d.key) ? d.key.toUpperCase() : d.key,
			code: d.code,
			location: d.location,
			keyCode: d.keyCode,
			which: d.keyCode,
			charCode: 0,
			shiftKey: mods.shift,
			ctrlKey: mods.ctrl,
			altKey: mods.alt,
			metaKey: false,
			repeat: false,
			bubbles: true,
			cancelable: true,
			composed: true
		};
	}
	/** Legacy keypress char code: printable keys and Enter produce one, everything else none (and no keypress). */
	var pressCharCode = (key) => key.length === 1 ? key.charCodeAt(0) : key === "Enter" ? 13 : 0;
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
	var MAX_DELTA = 1e5;
	var BUTTON_MASK = 2 ** 17 - 1;
	var isObj = (x) => typeof x === "object" && x !== null && !Array.isArray(x);
	var fin = (v) => typeof v === "number" && Number.isFinite(v);
	var within = (v, lo, hi) => fin(v) && v >= lo && v <= hi;
	var tuple = (x, n) => Array.isArray(x) && x.length === n;
	function isPadTuple(x) {
		return tuple(x, 7) && Number.isInteger(x[0]) && within(x[0], 0, BUTTON_MASK) && within(x[1], -1, 1) && within(x[2], -1, 1) && within(x[3], -1, 1) && within(x[4], -1, 1) && within(x[5], 0, 1) && within(x[6], 0, 1);
	}
	var isDeltaTuple = (x) => tuple(x, 7) && x.every((v) => within(v, -1e5, MAX_DELTA));
	var isTilt = (x) => tuple(x, 2) && within(x[0], -1, 1) && within(x[1], -1, 1);
	/** Validate an input frame and return a clean copy (unknown fields dropped), or null. */
	function parseInputFrame(x) {
		if (!isObj(x) || x.t !== "in") return null;
		const { m, dt, p, d, tl } = x;
		if (m !== 0 && m !== 1 && m !== 2 || !within(dt, 0, 1e3)) return null;
		if (p !== null && !isPadTuple(p)) return null;
		if (d !== null && !isDeltaTuple(d)) return null;
		if (tl !== null && !isTilt(tl)) return null;
		return {
			t: "in",
			m,
			dt,
			p: p ? [...p] : null,
			d: d ? [...d] : null,
			tl: tl ? [tl[0], tl[1]] : null
		};
	}
	function parseToPage(x) {
		if (isObj(x) && (x.t === "rel" || x.t === "off")) return { t: x.t };
		return parseInputFrame(x);
	}
	/** Session ids are 128-bit random hex, minted per bridge instance. */
	var SID_RE = /^[0-9a-f]{32}$/;
	var envelope = (sid, dir, m) => ({
		ch: CHANNEL,
		sid,
		dir,
		m
	});
	/** Read a bridge -> page envelope (the page script calls this on window 'message' events). */
	function readDown(data) {
		if (!isObj(data) || data.ch !== "obpal-link/v1" || data.dir !== "down" || typeof data.sid !== "string" || !SID_RE.test(data.sid)) return null;
		if (isObj(data.m) && data.m.t === "hello") return {
			sid: data.sid,
			m: { t: "hello" }
		};
		const m = parseToPage(data.m);
		return m ? {
			sid: data.sid,
			m
		} : null;
	}
	//#endregion
	//#region src/shared/viewer.ts
	/**
	* 3D viewer mode: turn phone input into the mouse gestures every web 3D viewer already understands.
	* Rotate = left-button drag, pan = right-button (or shift) drag, zoom = wheel.
	* Pure: viewerMotion() is the input math, DragSynth the gesture state machine; the page script dispatches.
	*/
	var DEFAULT_VIEWER = {
		padGain: 1.6,
		aimGain: 12,
		stickSpeed: 900,
		tiltSpeed: 700,
		panGain: 1.4,
		panStickSpeed: 700,
		wheelPerZoom: 480,
		triggerWheel: 1400,
		wheelStep: 8,
		deadzone: .15,
		tiltDeadzone: .04,
		triggerDeadzone: .05,
		expo: 1.5,
		releaseMs: 120,
		pan: "right"
	};
	function viewerMotion(input, cfg = DEFAULT_VIEWER) {
		const dt = clamp(input.dtMs, 0, 100) / 1e3;
		const drag = [0, 0];
		const pan = [0, 0];
		let wheel = 0;
		const d = input.deltas;
		if (d) {
			drag[0] += d.pad1[0] * cfg.padGain - d.aim[0] * cfg.aimGain;
			drag[1] += d.pad1[1] * cfg.padGain - d.aim[1] * cfg.aimGain;
			pan[0] += d.pad2[0] * cfg.panGain;
			pan[1] += d.pad2[1] * cfg.panGain;
			wheel -= d.zoom * cfg.wheelPerZoom;
		}
		const p = input.pad;
		if (p) {
			drag[0] += stickCurve(p.axes[2], cfg.deadzone, cfg.expo) * cfg.stickSpeed * dt;
			drag[1] += stickCurve(p.axes[3], cfg.deadzone, cfg.expo) * cfg.stickSpeed * dt;
			pan[0] += stickCurve(p.axes[0], cfg.deadzone, cfg.expo) * cfg.panStickSpeed * dt;
			pan[1] += stickCurve(p.axes[1], cfg.deadzone, cfg.expo) * cfg.panStickSpeed * dt;
			const zoomIn = stickCurve(buttonValue(p, PadButton.RT), cfg.triggerDeadzone);
			const zoomOut = stickCurve(buttonValue(p, PadButton.LT), cfg.triggerDeadzone);
			wheel += (zoomOut - zoomIn) * cfg.triggerWheel * dt;
		}
		const t = input.tilt;
		if (t) {
			drag[0] += stickCurve(t[0], cfg.tiltDeadzone) * cfg.tiltSpeed * dt;
			drag[1] += stickCurve(t[1], cfg.tiltDeadzone) * cfg.tiltSpeed * dt;
		}
		return {
			drag,
			pan,
			wheel
		};
	}
	var EDGE = 6;
	var centre = (a) => ({
		x: Math.round(a.left + a.width / 2),
		y: Math.round(a.top + a.height / 2)
	});
	var mag = (v) => Math.hypot(v[0], v[1]);
	function inside(a, x, y) {
		const m = Math.min(EDGE, a.width / 4, a.height / 4);
		return x >= a.left + m && x <= a.left + a.width - m && y >= a.top + m && y <= a.top + a.height - m;
	}
	/**
	* Gesture state machine: button down at the target's centre on the first motion, moves while input keeps
	* coming, button up after `releaseMs` idle. Moves are whole pixels (sub-pixel motion accumulates). When the
	* virtual cursor reaches the target's edge it lifts and re-grabs at the centre, like a hand on a mouse pad.
	*/
	var DragSynth = class {
		cfg;
		g = null;
		acc = new Accum();
		wheelAcc = 0;
		wheelAt = 0;
		lastArea = {
			left: 0,
			top: 0,
			width: 0,
			height: 0
		};
		constructor(cfg = DEFAULT_VIEWER) {
			this.cfg = cfg;
		}
		/** A button is held. */
		get dragging() {
			return this.g !== null;
		}
		/** Something is pending that tick() will finish (a held button or unsent wheel). */
		get busy() {
			return this.g !== null || this.wheelAcc !== 0;
		}
		/** Feed one frame of motion at `now` (ms). New gestures start at the centre of `area` (the target's visible box). */
		step(now, m, area) {
			const out = [];
			this.lastArea = area;
			const hasDrag = m.drag[0] !== 0 || m.drag[1] !== 0;
			const hasPan = m.pan[0] !== 0 || m.pan[1] !== 0;
			let kind = null;
			if (this.g && (this.g.kind === "rotate" ? hasDrag : hasPan)) kind = this.g.kind;
			else if (hasDrag || hasPan) kind = hasDrag && (!hasPan || mag(m.drag) >= mag(m.pan)) ? "rotate" : "pan";
			if (kind) {
				let g = this.g;
				if (g && g.kind !== kind) {
					out.push(...this.release());
					g = null;
				}
				if (!g) g = this.press(kind, area, now, out);
				g.last = now;
				const v = kind === "rotate" ? m.drag : m.pan;
				const [ix, iy] = this.acc.take(v[0], v[1]);
				if (ix || iy) {
					if (!inside(g.area, g.x + ix, g.y + iy)) {
						const a = g.area;
						out.push(...this.release());
						g = this.press(kind, a, now, out);
					}
					g.x += ix;
					g.y += iy;
					out.push({
						type: "move",
						buttons: this.buttonsOf(kind),
						x: g.x,
						y: g.y,
						dx: ix,
						dy: iy,
						shift: this.shiftOf(kind)
					});
				}
			}
			if (m.wheel) {
				this.wheelAcc += m.wheel;
				this.wheelAt = now;
				if (Math.abs(this.wheelAcc) >= this.cfg.wheelStep) out.push(this.flushWheel());
			}
			return out;
		}
		/** Call between frames: lifts the button after releaseMs without drag input and flushes a leftover wheel amount. */
		tick(now) {
			const out = [];
			if (this.g && now - this.g.last >= this.cfg.releaseMs) out.push(...this.release());
			if (this.wheelAcc !== 0 && now - this.wheelAt >= this.cfg.releaseMs) {
				if (Math.abs(this.wheelAcc) >= .5) out.push(this.flushWheel());
				this.wheelAcc = 0;
			}
			return out;
		}
		/** Lift the button now (gesture switch, mode change, deactivation). */
		release() {
			const g = this.g;
			if (!g) return [];
			this.g = null;
			this.acc.reset();
			return [{
				type: "up",
				button: this.buttonOf(g.kind),
				x: g.x,
				y: g.y,
				shift: this.shiftOf(g.kind)
			}];
		}
		/** release() and drop any unsent wheel. */
		reset() {
			this.wheelAcc = 0;
			return this.release();
		}
		/** Start a gesture at the centre of `area`: records it and appends the button-down event. */
		press(kind, area, now, out) {
			const c = centre(area);
			const g = {
				kind,
				x: c.x,
				y: c.y,
				area,
				last: now
			};
			this.g = g;
			out.push({
				type: "down",
				button: this.buttonOf(kind),
				buttons: this.buttonsOf(kind),
				x: c.x,
				y: c.y,
				shift: this.shiftOf(kind)
			});
			return g;
		}
		flushWheel() {
			const p = this.g ?? centre(this.lastArea);
			const deltaY = Math.round(this.wheelAcc);
			this.wheelAcc -= deltaY;
			return {
				type: "wheel",
				x: p.x,
				y: p.y,
				deltaY
			};
		}
		buttonOf(kind) {
			return kind === "pan" && this.cfg.pan === "right" ? 2 : 0;
		}
		buttonsOf(kind) {
			return this.buttonOf(kind) === 2 ? 2 : 1;
		}
		shiftOf(kind) {
			return kind === "pan" && this.cfg.pan === "shift";
		}
	};
	//#endregion
	//#region src/content/dom.ts
	/** The part of an element's box inside the viewport, or null if it is hidden or off screen. */
	function visibleRect(el) {
		const r = el.getBoundingClientRect();
		const left = Math.max(0, r.left);
		const top = Math.max(0, r.top);
		const right = Math.min(innerWidth, r.right);
		const bottom = Math.min(innerHeight, r.bottom);
		if (right - left < 2 || bottom - top < 2) return null;
		if (getComputedStyle(el).visibility === "hidden") return null;
		return {
			left,
			top,
			width: right - left,
			height: bottom - top
		};
	}
	/** The largest visible <canvas> or <model-viewer>: where a web 3D view (or game) almost always lives. */
	function largestView() {
		let best = null;
		for (const el of document.querySelectorAll("canvas, model-viewer")) {
			const rect = visibleRect(el);
			if (!rect) continue;
			const area = rect.width * rect.height;
			if (!best || area > best.area) best = {
				el,
				rect,
				area
			};
		}
		return best;
	}
	/** Hit-test through open shadow roots, so <model-viewer> and other web components get events on their inner surface. */
	function deepElementFromPoint(x, y) {
		let el = document.elementFromPoint(x, y);
		for (let i = 0; el?.shadowRoot && i < 16; i++) {
			const inner = el.shadowRoot.elementFromPoint(x, y);
			if (!inner || inner === el) break;
			el = inner;
		}
		return el;
	}
	/** The focused element, looking inside open shadow roots. */
	function deepActiveElement() {
		let el = document.activeElement;
		for (let i = 0; el?.shadowRoot?.activeElement && i < 16; i++) el = el.shadowRoot.activeElement;
		return el;
	}
	//#endregion
	//#region src/content/page.ts
	/** Chrome's real mouse is pointer 1, so page calls like setPointerCapture(e.pointerId) keep working. */
	var POINTER_ID = 1;
	var ZERO = [0, 0];
	var NO_MODS = {
		shift: false,
		ctrl: false,
		alt: false
	};
	var padInput = (p) => p ? {
		buttons: p[0],
		axes: [
			p[1],
			p[2],
			p[3],
			p[4]
		],
		triggers: [p[5], p[6]]
	} : null;
	var deltasOf = (d) => d ? {
		aim: [d[0], d[1]],
		pad1: [d[2], d[3]],
		pad2: [d[4], d[5]],
		zoom: d[6]
	} : null;
	/** Chrome only reveals a controller after a button press or a big stick push; the virtual one behaves the same. */
	var gesture = (p) => p[0] !== 0 || p.slice(1, 5).some((v) => Math.abs(v) > .5) || p[5] > .5 || p[6] > .5;
	var hit = (x, y) => deepElementFromPoint(x, y) ?? document.body ?? document.documentElement;
	function createPage() {
		const origin = location.origin;
		const targetOrigin = /^https?:$/.test(location.protocol) ? origin : "*";
		let sid = null;
		let mode = null;
		let lastFrameAt = 0;
		let watchdog;
		let mods = NO_MODS;
		const post = (m, s = sid ?? "") => window.postMessage(envelope(s, "up", m), targetOrigin);
		let pad = null;
		let exposed = false;
		let seq = 0;
		let shim = null;
		const source = {
			get: () => exposed ? pad : null,
			rumble: (s, w, ms) => {
				if (sid) post({
					t: "rumble",
					s,
					w,
					ms
				});
			}
		};
		function setPad(p) {
			if (!shim) shim = {
				uninstall: installGamepadShim(source),
				timer: void 0
			};
			clearTimeout(shim.timer);
			shim.timer = void 0;
			if (!p) {
				pad = null;
				exposed = false;
				return;
			}
			seq = seq + 1 & 65535;
			pad = {
				flags: 0,
				seq,
				t: Math.round(performance.now() * 1e3) >>> 0,
				buttons: p[0],
				axes: [
					p[1],
					p[2],
					p[3],
					p[4]
				],
				triggers: [p[5], p[6]]
			};
			if (!exposed && document.readyState !== "loading" && gesture(p)) exposed = true;
		}
		/** Unplug the virtual pad: the shim's frame loop fires gamepaddisconnected, then the native API comes back. */
		function dropPad() {
			pad = null;
			exposed = false;
			const s = shim;
			if (!s || s.timer !== void 0) return;
			s.timer = setTimeout(() => {
				s.uninstall();
				if (shim === s) shim = null;
			}, 250);
		}
		let compatBlocked = false;
		function pointer(ptype, mtype, target, x, y, dx, dy, button, buttons, shift = false) {
			const init = {
				bubbles: true,
				cancelable: true,
				composed: true,
				view: window,
				clientX: x,
				clientY: y,
				screenX: window.screenX + x,
				screenY: window.screenY + Math.max(0, window.outerHeight - window.innerHeight) + y,
				movementX: dx,
				movementY: dy,
				button,
				buttons,
				shiftKey: shift || mods.shift,
				ctrlKey: mods.ctrl,
				altKey: mods.alt,
				metaKey: false,
				pointerId: POINTER_ID,
				pointerType: "mouse",
				isPrimary: true,
				width: 1,
				height: 1,
				pressure: buttons ? .5 : 0
			};
			const ok = target.dispatchEvent(new PointerEvent(ptype, init));
			if (ptype === "pointerdown") compatBlocked = !ok;
			if (!compatBlocked) target.dispatchEvent(new MouseEvent(mtype, {
				...init,
				button: Math.max(0, button)
			}));
			if (ptype === "pointerup") compatBlocked = false;
			return init;
		}
		function wheel(target, x, y, deltaY) {
			target.dispatchEvent(new WheelEvent("wheel", {
				bubbles: true,
				cancelable: true,
				composed: true,
				view: window,
				clientX: x,
				clientY: y,
				screenX: window.screenX + x,
				screenY: window.screenY + Math.max(0, window.outerHeight - window.innerHeight) + y,
				deltaX: 0,
				deltaY,
				deltaZ: 0,
				deltaMode: 0,
				shiftKey: mods.shift,
				ctrlKey: mods.ctrl,
				altKey: mods.alt
			}));
		}
		const synth = new DragSynth();
		let area = null;
		let areaAt = 0;
		let downTarget = null;
		let synthTimer;
		/** The largest visible canvas / model-viewer, else the viewport (so the element under its centre). */
		function viewArea(now) {
			if (!area || now - areaAt > 500) {
				const v = largestView();
				area = v && v.area >= 19200 ? v.rect : {
					left: 0,
					top: 0,
					width: innerWidth,
					height: innerHeight
				};
				areaAt = now;
			}
			return area;
		}
		function runViewer(f, now) {
			const motion = viewerMotion({
				pad: padInput(f.p),
				deltas: deltasOf(f.d),
				tilt: f.tl,
				dtMs: f.dt
			});
			fire(synth.step(now, motion, viewArea(now)));
			if (synth.busy && synthTimer === void 0) synthTimer = setInterval(() => {
				fire(synth.tick(performance.now()));
				if (!synth.busy) {
					clearInterval(synthTimer);
					synthTimer = void 0;
				}
			}, 30);
		}
		function fire(events) {
			for (const e of events) {
				if (e.type === "wheel") {
					wheel(hit(e.x, e.y), e.x, e.y, e.deltaY);
					continue;
				}
				if (e.type === "down") downTarget = hit(e.x, e.y);
				const t = downTarget?.isConnected ? downTarget : hit(e.x, e.y);
				if (e.type === "down") pointer("pointerdown", "mousedown", t, e.x, e.y, 0, 0, e.button, e.buttons, e.shift);
				else if (e.type === "move") pointer("pointermove", "mousemove", t, e.x, e.y, e.dx, e.dy, -1, e.buttons, e.shift);
				else {
					pointer("pointerup", "mouseup", t, e.x, e.y, 0, 0, e.button, 0, e.shift);
					downTarget = null;
				}
			}
		}
		const mapper = new KeyMapper();
		const cursor = {
			x: Math.round(innerWidth / 2),
			y: Math.round(innerHeight / 2)
		};
		let mouseButtons = 0;
		let mouseDown = null;
		let dot = null;
		let dotTimer;
		function runKeys(f) {
			const d = f.d;
			applyKeys(mapper.update({
				pad: padInput(f.p),
				tilt: f.tl,
				aim: d ? [d[0], d[1]] : ZERO,
				pad1: d ? [d[2], d[3]] : ZERO,
				dtMs: f.dt
			}));
		}
		function applyKeys(out) {
			for (const e of out.keys) key(e);
			if (out.move[0] || out.move[1]) mouseMove(out.move[0], out.move[1]);
			for (const b of out.buttons) mouseButton(b.button, b.down);
		}
		/** A real keyboard's target: the focused element (else body); the event bubbles on to document and window. */
		function key(e) {
			mods = e.mods;
			const init = keyInit(e.key, e.mods);
			const a = deepActiveElement();
			const target = a?.isConnected ? a : document.body ?? window;
			fireKey(target, e.down ? "keydown" : "keyup", init);
			const cc = e.down ? pressCharCode(init.key) : 0;
			if (cc) fireKey(target, "keypress", {
				...init,
				keyCode: cc,
				which: cc,
				charCode: cc
			});
		}
		function fireKey(target, type, init) {
			const ev = new KeyboardEvent(type, init);
			for (const f of [
				"keyCode",
				"which",
				"charCode"
			]) {
				const v = init[f];
				if (ev[f] !== v) Object.defineProperty(ev, f, { get: () => v });
			}
			target.dispatchEvent(ev);
		}
		function mouseTarget() {
			return document.pointerLockElement ?? (mouseButtons && mouseDown?.isConnected ? mouseDown : hit(cursor.x, cursor.y));
		}
		function mouseMove(dx, dy) {
			if (!document.pointerLockElement) {
				cursor.x = clamp(cursor.x + dx, 0, innerWidth - 1);
				cursor.y = clamp(cursor.y + dy, 0, innerHeight - 1);
				showCursor();
			}
			pointer("pointermove", "mousemove", mouseTarget(), cursor.x, cursor.y, dx, dy, -1, mouseButtons);
		}
		function mouseButton(b, down) {
			const bit = b === 0 ? 1 : b === 2 ? 2 : 4;
			const before = mouseButtons;
			mouseButtons = down ? before | bit : before & ~bit;
			if (down && !before) mouseDown = document.pointerLockElement ?? hit(cursor.x, cursor.y);
			const t = mouseDown?.isConnected ? mouseDown : mouseTarget();
			const init = pointer((down ? before === 0 : mouseButtons === 0) ? down ? "pointerdown" : "pointerup" : "pointermove", down ? "mousedown" : "mouseup", t, cursor.x, cursor.y, 0, 0, b, mouseButtons);
			if (!down && b === 0 && (document.pointerLockElement || t.contains(hit(cursor.x, cursor.y)))) t.dispatchEvent(new MouseEvent("click", {
				...init,
				button: 0,
				buttons: mouseButtons,
				detail: 1
			}));
			if (!mouseButtons) mouseDown = null;
		}
		/** A small lime dot shows where the virtual mouse is (not under pointer lock); it fades when the mouse rests. */
		function showCursor() {
			if (!(document.documentElement instanceof HTMLElement)) return;
			if (!dot) {
				dot = document.createElement("obpal-link-cursor");
				for (const [k, v] of Object.entries({
					position: "fixed",
					left: "0",
					top: "0",
					width: "14px",
					height: "14px",
					margin: "-7px 0 0 -7px",
					display: "block",
					"border-radius": "50%",
					background: "#c6ff34",
					"box-shadow": "0 0 0 2px rgba(10,10,10,.85), 0 0 14px rgba(198,255,52,.75)",
					"pointer-events": "none",
					"z-index": "2147483647",
					transition: "opacity .25s"
				})) dot.style.setProperty(k, v, "important");
				document.documentElement.appendChild(dot);
			}
			dot.style.setProperty("transform", `translate(${cursor.x}px, ${cursor.y}px)`, "important");
			dot.style.setProperty("opacity", "1", "important");
			clearTimeout(dotTimer);
			dotTimer = setTimeout(() => dot?.style.setProperty("opacity", "0", "important"), 1500);
		}
		function hideCursor() {
			clearTimeout(dotTimer);
			dot?.remove();
			dot = null;
		}
		function onFrame(f) {
			const now = performance.now();
			lastFrameAt = now;
			const next = TARGET_MODES[f.m];
			if (next !== mode) {
				release();
				mode = next;
			}
			if (mode === "gamepad") setPad(f.p);
			else if (mode === "viewer") runViewer(f, now);
			else runKeys(f);
			if (watchdog === void 0) watchdog = setInterval(checkStale, 250);
		}
		/** Frames only stop when the link is gone, so release held input rather than leave keys or buttons stuck. */
		function checkStale() {
			if (performance.now() - lastFrameAt < (mode === "gamepad" ? 1500 : 600)) return;
			release();
			clearInterval(watchdog);
			watchdog = void 0;
		}
		/** Let go of everything held in any mode: keys, mouse buttons, a drag, the virtual pad. */
		function release() {
			fire(synth.reset());
			applyKeys(mapper.releaseAll());
			mods = NO_MODS;
			if (pad || shim) dropPad();
			hideCursor();
		}
		function onMessage(e) {
			if (e.source !== window || e.origin !== origin) return;
			const msg = readDown(e.data);
			if (!msg) return;
			const m = msg.m;
			if (m.t === "hello") {
				if (msg.sid !== sid) {
					release();
					sid = msg.sid;
				}
				post({
					t: "ready",
					v: 1
				});
				return;
			}
			if (msg.sid !== sid) return;
			if (m.t === "in") onFrame(m);
			else if (m.t === "rel") release();
			else {
				release();
				mode = null;
				sid = null;
			}
		}
		addEventListener("message", onMessage, true);
		post({
			t: "loaded",
			v: 1
		}, "");
		return {
			version: 1,
			announce: () => post({
				t: "loaded",
				v: 1
			}, ""),
			destroy: () => {
				release();
				removeEventListener("message", onMessage, true);
				clearInterval(watchdog);
				clearInterval(synthTimer);
				sid = null;
			}
		};
	}
	var HANDLE = Symbol.for("obpal-link.page");
	var slot = window;
	var existing = slot[HANDLE];
	if (existing?.version === 1) existing.announce();
	else {
		existing?.destroy?.();
		slot[HANDLE] = createPage();
	}
	//#endregion
})();
