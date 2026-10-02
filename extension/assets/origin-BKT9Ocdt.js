//#region ../packages/host/src/dot-tokens.ts
var DOT_SIZES = {
	micro: {
		diameter: 1.8,
		pitch: 8
	},
	base: {
		diameter: 3,
		pitch: 12
	},
	display: {
		diameter: 4.2,
		pitch: 16
	},
	beacon: {
		diameter: 6,
		pitch: 20
	},
	seal: {
		diameter: 4.2,
		pitch: 16
	}
};
var DOT_TIMING = {
	assemble: 640,
	ripple: 480,
	shimmer: 700,
	breathe: 6400,
	stream: 900,
	partIn: 200,
	partOut: 320,
	handshake: 1200,
	fade: 120
};
var DOT_MATERIAL = {
	roughness: .32,
	key: 1,
	rim: .35,
	fill: .18,
	edgeGlow: .1,
	touchRadius: 54,
	maxTouch: 8,
	parallaxDegrees: 3
};
/** Chip-local overrides precede family roles; gradients are never accepted as a colour. */
function resolveDotTokens(element, scale = "base") {
	const style = getComputedStyle(element);
	const color = (fallback, ...names) => names.map((name) => {
		const value = style.getPropertyValue(name).trim();
		return /^(?:\d+(?:\.\d+)?\s+){2}\d+(?:\.\d+)?$/.test(value) ? `rgb(${value.split(/\s+/).join(",")})` : value;
	}).find((value) => value && (typeof CSS === "undefined" ? !/(?:gradient|url)\(/.test(value) : CSS.supports("color", value))) || fallback;
	const active = color(style.color, "--ob-dot-active", "--a", "--bb-accent-text", "--bb-accent", "--accent");
	const lightSurface = element.closest?.("[data-bb-theme]")?.getAttribute("data-bb-theme") === "light";
	return {
		scale,
		...DOT_SIZES[scale],
		colors: {
			active,
			light: color(active, "--ob-dot-light", "--a", lightSurface ? "--bb-accent-text" : "--bb-accent", "--accent"),
			ink: color(style.color, "--ob-dot-ink", "--bb-ink-2", "--secondary"),
			muted: color(style.color, "--ob-dot-muted", "--bb-ink-3", "--muted"),
			depth: color(style.color, "--ob-dot-depth", "--haze-rgb", "--bb-aurora", "--bb-ink-3")
		},
		surface: color("transparent", "--ob-dot-surface", "--s", "--glass", "--bb-surface", "--bb-sheet")
	};
}
var dotTimeline = (startedAt, duration = DOT_TIMING.handshake) => ({
	startedAt,
	duration
});
/** Cubic family curves, evaluated by time rather than by frame count. */
function dotEase(progress, arrival = false) {
	const x = Math.max(0, Math.min(1, progress));
	const [x1, y1, x2, y2] = arrival ? [
		.16,
		1,
		.3,
		1
	] : [
		.2,
		.8,
		.2,
		1
	];
	const cubic = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
	let low = 0, high = 1;
	for (let i = 0; i < 14; i++) {
		const t = (low + high) / 2;
		if (cubic(t, x1, x2) < x) low = t;
		else high = t;
	}
	return x === 0 || x === 1 ? x : cubic((low + high) / 2, y1, y2);
}
//#endregion
//#region ../packages/host/src/color.ts
/** A CSS colour as sRGB 0–255, or null for anything this can't read (named colours, hsl(), var(), …). */
function parseColor(input) {
	const s = (input ?? "").trim().toLowerCase();
	let m = /^#([0-9a-f]{3,4})$/.exec(s);
	if (m) return [
		0,
		1,
		2
	].map((i) => parseInt(m[1][i] + m[1][i], 16));
	m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(s);
	if (m) return [
		0,
		2,
		4
	].map((i) => parseInt(m[1].slice(i, i + 2), 16));
	m = /^(?:rgba?\()?\s*(\d{1,3}(?:\.\d+)?)[\s,]+(\d{1,3}(?:\.\d+)?)[\s,]+(\d{1,3}(?:\.\d+)?)\s*(?:[,/][^)]*)?\)?$/.exec(s);
	if (m && (s.startsWith("rgb") || !s.includes("("))) {
		const c = [
			m[1],
			m[2],
			m[3]
		].map(Number);
		if (c.every((v) => v <= 255)) return c.map(Math.round);
	}
	return null;
}
var toHex = (c) => `#${c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("")}`;
var lin = (v) => {
	const x = v / 255;
	return x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4;
};
var unlin = (x) => 255 * (x <= .0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - .055);
/** WCAG relative luminance, 0 (black) to 1 (white). */
var luminance = (c) => .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]);
/** WCAG contrast ratio, 1 to 21. */
function contrast(a, b) {
	const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
	return (x + .05) / (y + .05);
}
/** The same hue made darker (scaled in linear light) until its luminance is at most `max`. */
function darkenTo(c, max) {
	const l = luminance(c);
	if (l <= max) return c;
	const k = max / l;
	return c.map((v) => unlin(lin(v) * k));
}
/** The same hue made lighter (mixed toward white in linear light) until its luminance is at least `min`. */
function lightenTo(c, min) {
	const l = luminance(c);
	if (l >= min) return c;
	const k = (min - l) / (1 - l);
	return c.map((v) => unlin(lin(v) + (1 - lin(v)) * k));
}
//#endregion
//#region ../packages/host/src/dot-field.ts
var clocks = /* @__PURE__ */ new WeakMap();
var loadingClocks = /* @__PURE__ */ new WeakMap();
/** Finite subscribers share one frame request. Returning false releases the subscription. */
function dotClock(tick, doc = document) {
	let clock = clocks.get(doc);
	if (!clock) {
		const current = {
			listeners: /* @__PURE__ */ new Set(),
			raf: 0,
			schedule: () => {}
		};
		const frame = (now) => {
			current.raf = 0;
			for (const listener of [...current.listeners]) if (!listener(now)) current.listeners.delete(listener);
			current.schedule();
		};
		current.schedule = () => {
			if (doc.hidden) {
				doc.defaultView.cancelAnimationFrame(current.raf);
				current.raf = 0;
			} else if (current.listeners.size && !current.raf) current.raf = doc.defaultView.requestAnimationFrame(frame);
		};
		doc.addEventListener("visibilitychange", current.schedule);
		clocks.set(doc, current);
		clock = current;
	}
	const current = clock;
	current.listeners.add(tick);
	current.schedule();
	return () => {
		current.listeners.delete(tick);
		if (!current.listeners.size) {
			doc.defaultView.cancelAnimationFrame(current.raf);
			current.raf = 0;
		}
	};
}
var DOT_LOADER_STYLE = `.dot-loader{display:inline-flex;flex:none;vertical-align:middle;align-items:center;justify-content:center;gap:12%;width:var(--dot-loader-size,48px);height:var(--dot-loader-size,48px);color:var(--seal-ink,var(--bb-ink,var(--ink,currentColor)))}.dot-loader[hidden]{display:none}.dot-loader>i{display:block;flex:none;width:16%;aspect-ratio:1;border-radius:50%;background:currentColor}`;
/** Pending surfaces share one moving owner, including portable cards and scene beads. Others keep their static frame. */
function dotLoaderClock(tick, doc = document, handoff = false) {
	let clock = loadingClocks.get(doc);
	if (!clock) {
		clock = {
			listeners: /* @__PURE__ */ new Set(),
			stop: () => {}
		};
		loadingClocks.set(doc, clock);
	}
	const current = clock;
	if (handoff) current.listeners = /* @__PURE__ */ new Set([tick, ...current.listeners]);
	else current.listeners.add(tick);
	if (current.listeners.size === 1) current.stop = dotClock((now) => {
		const owner = current.listeners.values().next().value;
		if (owner && !owner(now)) current.listeners.delete(owner);
		return current.listeners.size > 0;
	}, doc);
	return () => {
		current.listeners.delete(tick);
		if (!current.listeners.size) current.stop();
	};
}
/** The flat and scene adapters use the same absolute phase, without restarting on state updates. */
function dotLoaderFrame(now, index) {
	const wave = (1 + Math.sin(now / 180 - index * .8)) / 2;
	return {
		lift: wave * .22,
		scale: .85 + wave * .15,
		opacity: .7 + wave * .3
	};
}
/** A stable three-dot loader. State updates never restart its phase or change its measured box. */
var DotLoader = class {
	constructor(options = {}) {
		this.el = document.createElement("span");
		this.dots = Array.from({ length: 3 }, () => document.createElement("i"));
		this.stop = () => {};
		this.running = false;
		this.motion = matchMedia("(prefers-reduced-motion: reduce)");
		this.visible = true;
		this.observer = null;
		this.sync = () => {
			this.stop();
			this.dots.forEach((dot) => {
				dot.style.transform = "none";
				dot.style.opacity = "1";
			});
			if (!this.running || this.motion.matches || document.hidden || !this.visible) return;
			this.stop = dotLoaderClock((now) => {
				if (!this.running) return false;
				if (this.el.isConnected) this.dots.forEach((dot, i) => {
					const frame = dotLoaderFrame(now, i);
					dot.style.transform = `translate3d(0,${-frame.lift * 100}%,0) scale(${frame.scale})`;
					dot.style.opacity = String(frame.opacity);
				});
				return true;
			});
		};
		this.el.className = "dot-loader";
		this.el.style.setProperty("--dot-loader-size", `${Math.max(16, options.size ?? 48)}px`);
		this.el.setAttribute("role", "status");
		this.el.setAttribute("aria-label", options.label ?? "Loading");
		this.dots.forEach((dot) => dot.setAttribute("aria-hidden", "true"));
		this.el.append(...this.dots);
		this.motion.addEventListener("change", this.sync);
		document.addEventListener("visibilitychange", this.sync);
		this.observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
			this.visible = entries.some((entry) => entry.isIntersecting);
			this.sync();
		}) : null;
		this.observer?.observe(this.el);
		this.start();
	}
	start() {
		if (!this.running) {
			this.running = true;
			this.el.setAttribute("aria-busy", "true");
			this.sync();
		}
	}
	finish() {
		if (this.running) {
			this.running = false;
			this.el.setAttribute("aria-busy", "false");
			this.sync();
		}
	}
	destroy() {
		this.finish();
		this.observer?.disconnect();
		this.motion.removeEventListener("change", this.sync);
		document.removeEventListener("visibilitychange", this.sync);
	}
};
var clamp = (n, low = 0, high = 1) => Math.max(low, Math.min(high, n));
var ease = (n) => {
	const t = clamp(n);
	return t * t * (3 - 2 * t);
};
var lerp = (a, b, t) => a + (b - a) * t;
var TAU = Math.PI * 2;
var BANDS = 12;
var ROLES = [
	"active",
	"light",
	"ink",
	"muted",
	"depth"
];
/**
* A decorative Canvas 2D field shared by the app and embed. Only finite effects own a RAF loop; the idle breath
* uses compositor opacity. Coordinates and timing are deterministic so both ends can show the same handshake.
*/
var DotField = class {
	get frames() {
		return this.rendered;
	}
	get resolvedTokens() {
		return this.tokens;
	}
	get normalizedPoints() {
		return this.points ?? this.dots.map((p) => ({
			x: p.x / this.width,
			y: p.y / this.height
		}));
	}
	get dotCount() {
		return this.dots.length;
	}
	constructor(canvas, options = {}) {
		this.canvas = canvas;
		this.options = options;
		this.bands = Array.from({ length: BANDS * ROLES.length }, () => []);
		this.paints = [];
		this.source = [];
		this.dots = [];
		this.width = 0;
		this.height = 0;
		this.dpr = 1;
		this.accent = "";
		this.surface = "";
		this.radius = 2;
		this.sourceRadius = 2;
		this.at = null;
		this.light = {
			x: 0,
			y: 0
		};
		this.part = null;
		this.strength = 0;
		this.playing = null;
		this.progress = null;
		this.frame = 0;
		this.rendered = 0;
		this.intersecting = true;
		this.dead = false;
		this.opacity = null;
		this.aligned = {
			x: 0,
			y: 0
		};
		this.resize = () => {
			if (this.dead) return;
			let rect = this.canvas.getBoundingClientRect();
			const dpr = clamp(Number.isFinite(globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1, 1, 3);
			if (this.options.pixelAligned && this.canvas.style && rect.width > 0) {
				const height = `${Math.round(rect.width * 11 / 35 * dpr) / dpr}px`;
				if (this.canvas.style.height !== height) {
					this.canvas.style.height = height;
					rect = this.canvas.getBoundingClientRect();
				}
			}
			if (this.width === rect.width && this.height === rect.height && this.dpr === dpr) return;
			this.width = Math.max(0, rect.width);
			this.height = Math.max(0, rect.height);
			this.dpr = dpr;
			this.canvas.width = Math.round(this.width * dpr);
			this.canvas.height = Math.round(this.height * dpr);
			this.context?.setTransform(this.width ? this.canvas.width / this.width : 1, 0, 0, this.height ? this.canvas.height / this.height : 1, 0, 0);
			const root = this.canvas.getRootNode?.();
			if (root && "host" in root) this.tokenObserver?.observe(root.querySelector(".wrap") ?? root.host, {
				attributes: true,
				attributeFilter: ["class", "style"]
			});
			this.refresh();
			this.visibilityChanged();
		};
		this.visibilityChanged = () => {
			if (!this.visible) {
				this.stopFrame();
				this.opacity?.pause();
				return;
			}
			this.opacity?.play();
			this.draw(performance.now());
			this.schedule();
		};
		this.motionChanged = () => {
			this.stopFrame();
			this.playing = null;
			this.at = null;
			this.part = null;
			this.strength = 0;
			this.light = {
				x: 0,
				y: 0
			};
			if (this.reduced && this.progress !== null) this.progress = 1;
			this.breathe();
			this.draw(performance.now());
		};
		this.context = canvas.getContext("2d");
		this.limit = clamp(Math.floor(options.maxDots ?? 300) || 300, 1, 300);
		this.spacing = Math.max(4, Number.isFinite(options.spacing) ? options.spacing : resolveDotTokens(canvas, options.scale).pitch);
		this.points = options.points ? this.normalize(options.points, options.preservePoints ? 4096 : this.limit) : void 0;
		this.motion = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
		this.motion?.addEventListener("change", this.motionChanged);
		canvas.ownerDocument.addEventListener("visibilitychange", this.visibilityChanged);
		canvas.ownerDocument.defaultView?.addEventListener("resize", this.resize);
		this.resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(this.resize) : null;
		this.resizeObserver?.observe(canvas);
		this.intersectionObserver = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
			this.intersecting = entries.some((entry) => entry.isIntersecting);
			this.visibilityChanged();
		}) : null;
		this.intersectionObserver?.observe(canvas);
		this.tokenObserver = typeof MutationObserver === "function" ? new MutationObserver(() => this.refresh()) : null;
		if (canvas.ownerDocument.documentElement) this.tokenObserver?.observe(canvas.ownerDocument.documentElement, {
			attributes: true,
			attributeFilter: [
				"class",
				"style",
				"data-bb-theme",
				"data-bb-accent",
				"data-bb-product"
			]
		});
		this.refresh();
		this.resize();
		this.breathe();
	}
	get visible() {
		return !this.dead && !!this.context && !this.canvas.ownerDocument.hidden && this.intersecting && this.width > 0 && this.height > 0;
	}
	get reduced() {
		return this.motion?.matches ?? false;
	}
	normalize(points, limit = this.limit) {
		const valid = points.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
		const count = Math.min(valid.length, limit);
		return Array.from({ length: count }, (_, i) => {
			const p = valid[Math.floor(i * valid.length / count)];
			return {
				x: clamp(p.x),
				y: clamp(p.y),
				...p.role && ROLES.includes(p.role) ? { role: p.role } : {}
			};
		});
	}
	/** Switch between a normalized glyph and the adaptive grid. */
	setPoints(points) {
		if (this.dead) return;
		this.points = points ? this.normalize(points, this.options.preservePoints ? 4096 : this.limit) : void 0;
		this.layout();
		this.draw(performance.now());
	}
	/** Preserve up to 4,096 normalized QR module centres. Surplus modules fade before the bounded glyph settles. */
	setSource(points) {
		if (this.dead) return;
		this.source = this.normalize(points, 4096);
		this.measureSource();
	}
	layout() {
		if (!this.width || !this.height) {
			this.dots = [];
			return;
		}
		let points = this.points;
		if (!points) {
			const space = Math.max(this.spacing, Math.sqrt(this.width * this.height / this.limit));
			let cols = Math.max(1, Math.floor(this.width / space)), rows = Math.max(1, Math.floor(this.height / space));
			while (cols * rows > this.limit) if (cols >= rows) cols--;
			else rows--;
			points = [];
			for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) points.push({
				x: (x + .5) / cols,
				y: (y + .5) / rows
			});
		}
		this.dots = points.map((p, i) => ({
			x: p.x * this.width,
			y: p.y * this.height,
			role: p.role,
			phase: (i * 137 + 17) % 997 / 997
		}));
		const diameter = this.options.diameter ?? this.tokens.diameter;
		const radius = this.points && this.tokens.scale === "seal" ? Math.min(diameter, this.gridPitch(this.points) * (this.options.preservePoints ? .9 : .64)) / 2 : diameter / 2;
		this.radius = Math.min(radius, this.width / 8, this.height / 8);
		this.measureSource();
	}
	gridPitch(points) {
		let step = this.spacing;
		for (const [axis, size] of [["x", this.width], ["y", this.height]]) {
			const positions = [...new Set(points.map((p) => p[axis]))].sort((a, b) => a - b);
			for (let i = 1; i < positions.length; i++) {
				const gap = (positions[i] - positions[i - 1]) * size;
				if (gap > 1e-4) step = Math.min(step, gap);
			}
		}
		return step;
	}
	measureSource() {
		this.sourceRadius = Math.max(.6, this.gridPitch(this.source) * .42);
	}
	/** Resolve family tokens again after a theme change, including the pairing chip's shadow tokens. */
	refresh() {
		if (this.dead) return;
		if (this.options.pixelAligned && this.canvas.style) {
			const rect = this.canvas.getBoundingClientRect();
			const x = rect.left - this.aligned.x, y = rect.top - this.aligned.y;
			this.aligned = {
				x: Math.round(x * this.dpr) / this.dpr - x,
				y: Math.round(y * this.dpr) / this.dpr - y
			};
			this.canvas.style.translate = `${this.aligned.x}px ${this.aligned.y}px`;
		}
		this.tokens = resolveDotTokens(this.canvas, this.options.scale ?? (this.options.points ? "seal" : "base"));
		if (this.options.preservePoints && this.tokens.scale === "seal") {
			const style = getComputedStyle(this.canvas);
			const accent = style.getPropertyValue("--bb-accent-text").trim();
			const plate = parseColor(style.getPropertyValue("--seal-plate")) ?? parseColor(style.getPropertyValue("--bb-sheet"));
			const ink = parseColor(accent);
			if (plate && ink && contrast(ink, plate) >= 10) this.tokens.colors.active = accent;
		}
		this.accent = this.options.accent || this.tokens.colors[this.options.role ?? "active"];
		this.surface = this.options.surface || this.tokens.surface;
		this.layout();
		this.draw(performance.now());
	}
	/** Run a finite effect. The handshake takes 1.2 seconds unless a synchronized caller drives it manually. */
	effect(kind, duration = DOT_TIMING[kind]) {
		if (this.dead) return;
		this.stopFrame();
		this.opacity?.cancel();
		this.opacity = null;
		this.progress = null;
		this.playing = this.reduced ? null : {
			kind,
			start: performance.now(),
			duration: Math.max(1, Number.isFinite(duration) ? duration : 700)
		};
		if (this.reduced) {
			this.draw(performance.now());
			this.opacity = this.canvas.animate?.([{ opacity: 0 }, { opacity: 1 }], {
				duration: DOT_TIMING.fade,
				iterations: 1
			}) ?? null;
			if (!this.visible) this.opacity?.pause();
		} else {
			this.draw(performance.now());
			this.schedule();
		}
	}
	/** A pointer or touch position in canvas-local CSS pixels. A stationary pointer never starts a loop. */
	pointer(x, y) {
		if (this.dead || this.reduced) return;
		const at = x === null || !Number.isFinite(x) || !Number.isFinite(y) ? null : {
			x,
			y
		};
		if (this.at?.x === at?.x && this.at?.y === at?.y) return;
		if (this.options.decorative) {
			const now = performance.now();
			this.stopFrame();
			this.playing = null;
			this.opacity?.cancel();
			this.opacity = null;
			if (at) this.at = at;
			this.part = {
				start: now,
				duration: at ? DOT_TIMING.partIn : DOT_TIMING.partOut,
				from: this.strength,
				to: at ? 1 : 0
			};
			this.draw(now);
			this.schedule();
		} else {
			this.at = at;
			this.opacity?.cancel();
			this.opacity = null;
			this.draw(performance.now());
		}
	}
	/** Light coordinates from already permitted motion input, normalized from -1 to 1. No sensor is requested. */
	tilt(x, y) {
		if (this.dead || this.reduced || !Number.isFinite(x) || !Number.isFinite(y)) return;
		x = clamp(x, -1, 1);
		y = clamp(y, -1, 1);
		if (x === this.light.x && y === this.light.y) return;
		this.light = {
			x,
			y
		};
		this.draw(performance.now());
	}
	/** Draw a deterministic QR lift, ribbon, glyph and ripple frame; it never starts its own RAF loop. */
	handshake(progress) {
		if (this.dead || !Number.isFinite(progress)) return;
		this.stopFrame();
		this.playing = null;
		this.opacity?.cancel();
		this.opacity = null;
		this.progress = this.reduced ? 1 : clamp(progress);
		this.draw(performance.now());
	}
	stopFrame() {
		if (this.frame) cancelAnimationFrame(this.frame);
		this.frame = 0;
	}
	schedule() {
		if (this.visible && (this.playing || this.part) && !this.frame) this.frame = requestAnimationFrame((now) => {
			this.frame = 0;
			this.draw(now);
			this.schedule();
		});
	}
	breathe() {
		this.opacity?.cancel();
		this.opacity = !this.reduced && this.options.idle === true ? this.canvas.animate?.([
			{ opacity: .86 },
			{ opacity: 1 },
			{ opacity: .86 }
		], {
			duration: DOT_TIMING.breathe,
			iterations: 2
		}) ?? null : null;
		if (!this.visible) this.opacity?.pause();
	}
	/** Draw without scheduling another; the finished field has at most 300 dots, with a larger QR source during lift. */
	draw(now) {
		const context = this.context;
		if (!this.visible || !context) return;
		this.rendered++;
		context.globalAlpha = 1;
		context.clearRect(0, 0, this.width, this.height);
		if (this.surface !== "transparent") {
			context.fillStyle = this.surface;
			context.fillRect(0, 0, this.width, this.height);
		}
		if (this.part) {
			const p = clamp((now - this.part.start) / this.part.duration);
			this.strength = lerp(this.part.from, this.part.to, dotEase(p));
			if (p === 1) {
				if (!this.part.to) this.at = null;
				this.part = null;
			}
		}
		const effect = this.playing;
		const t = effect ? clamp((now - effect.start) / effect.duration) : 1;
		const handshake = this.progress ?? (effect?.kind === "handshake" ? t : null);
		const sourceCount = this.source.length || this.dots.length;
		const count = handshake !== null && handshake < 1 ? Math.max(sourceCount, this.dots.length) : this.dots.length;
		const diagonal = Math.hypot(this.width, this.height);
		for (const band of this.bands) band.length = 0;
		for (let i = 0; i < count; i++) {
			const dot = this.dots[i % this.dots.length];
			const source = this.source[i % this.source.length];
			let x = dot?.x ?? this.width / 2, y = dot?.y ?? this.height / 2, radius = this.radius, square = false;
			const seal = this.options.preservePoints && this.tokens.scale === "seal";
			let alpha = this.points ? seal ? 1 : .76 : .25 + (dot?.phase ?? .5) * .13;
			if (handshake !== null) {
				const p = handshake;
				const sx = source ? source.x * this.width : x, sy = source ? source.y * this.height : y;
				const ribbonX = this.width * (.18 + .64 * (count > 1 ? i / (count - 1) : .5));
				const ribbonY = this.height / 2 + Math.sin(i * .21) * .9;
				square = p < .1;
				if (p < .22) {
					x = sx;
					y = sy - Math.sin(p / .22 * Math.PI / 2) * Math.min(12, this.height * .15);
					radius = lerp(this.sourceRadius, this.radius, ease(p / .22));
				} else if (p < .45) {
					const lift = Math.min(12, this.height * .15), f = ease((p - .22) / .23);
					x = lerp(sx, ribbonX, f);
					y = lerp(sy - lift, ribbonY, f);
				} else if (p < .72) {
					const f = ease((p - .45) / .27);
					x = lerp(ribbonX, x, f);
					y = lerp(ribbonY, y, f);
				} else {
					const wave = (p - .72) / .28;
					const distance = Math.hypot(x - this.width / 2, y - this.height / 2) / diagonal;
					const ring = Math.exp(-(((distance - wave * .65) / .12) ** 2)) * Math.sin(wave * Math.PI);
					radius *= 1 + ring * .2;
					alpha += ring * .24;
				}
				if (i >= sourceCount) alpha *= ease((p - .22) / .5);
				if (i >= this.dots.length) alpha *= 1 - ease((p - .42) / .2);
			} else if (effect?.kind === "assemble") {
				const f = dotEase((t - (dot?.phase ?? 0) * .125) / .875, true);
				x = lerp(this.width / 2, x, f);
				y = lerp(this.height / 2, y, f);
				alpha *= f;
			} else if (effect?.kind === "ripple") {
				const distance = Math.hypot(x - this.width / 2, y - this.height / 2) / diagonal;
				const ring = Math.exp(-(((distance - dotEase(t, true) * .65) / .1) ** 2)) * Math.sin(t * Math.PI);
				radius *= 1 + ring * .2;
				alpha += ring * .4;
			} else if (effect?.kind === "shimmer") {
				const shine = Math.exp(-(((x / this.width - dotEase(t) * 1.4 + .2) / .12) ** 2)) * Math.sin(t * Math.PI);
				alpha += shine * .5;
			}
			if (this.options.decorative && this.at && !this.reduced && handshake === null) {
				const dx = x - this.at.x, dy = y - this.at.y, distance = Math.hypot(dx, dy);
				const influence = Math.max(0, 1 - distance / DOT_MATERIAL.touchRadius) ** 2 * this.strength;
				if (distance > 0) {
					x += dx / distance * influence * Math.min(DOT_MATERIAL.maxTouch, this.spacing * .45);
					y += dy / distance * influence * Math.min(DOT_MATERIAL.maxTouch, this.spacing * .45);
				}
				alpha += influence * .52;
			}
			if (!this.options.decorative && this.at && !this.reduced && handshake === null) alpha += Math.max(0, 1 - Math.hypot(x - this.at.x, y - this.at.y) / DOT_MATERIAL.touchRadius) ** 2 * .24;
			if (!this.reduced) alpha += ((x / this.width - .5) * this.light.x + (y / this.height - .5) * this.light.y) * .2;
			if (seal && i < this.dots.length && (handshake === null || handshake >= .72)) alpha = 1;
			if (alpha <= 0) continue;
			const band = ROLES.indexOf(dot?.role ?? this.options.role ?? "active") * BANDS + Math.round(clamp(alpha) * 11);
			const paint = this.paints[i] ?? (this.paints[i] = {
				x,
				y,
				radius,
				square
			});
			paint.x = x;
			paint.y = y;
			paint.radius = radius;
			paint.square = square;
			this.bands[band].push(paint);
		}
		context.fillStyle = this.accent;
		for (let b = 0; b < this.bands.length; b++) {
			if (!this.bands[b].length) continue;
			context.fillStyle = this.options.accent || this.tokens.colors[ROLES[Math.floor(b / BANDS)]];
			context.globalAlpha = b % BANDS / 11;
			context.beginPath();
			for (const dot of this.bands[b]) if (dot.square) context.rect(dot.x - dot.radius, dot.y - dot.radius, dot.radius * 2, dot.radius * 2);
			else {
				context.moveTo(dot.x + dot.radius, dot.y);
				context.arc(dot.x, dot.y, dot.radius, 0, TAU);
			}
			context.fill();
		}
		context.globalAlpha = 1;
		if (effect && t === 1) {
			this.playing = null;
			this.stopFrame();
		}
	}
	/** Release RAF, observers, listeners and compositor animation when its owning surface closes. */
	destroy() {
		if (this.dead) return;
		this.dead = true;
		this.stopFrame();
		this.opacity?.cancel();
		this.resizeObserver?.disconnect();
		this.intersectionObserver?.disconnect();
		this.tokenObserver?.disconnect();
		this.motion?.removeEventListener("change", this.motionChanged);
		this.canvas.ownerDocument.removeEventListener("visibilitychange", this.visibilityChanged);
		this.canvas.ownerDocument.defaultView?.removeEventListener("resize", this.resize);
	}
};
//#endregion
//#region ../packages/host/src/origin.ts
var OFFICIAL_ORIGIN = "https://obpal.blackboxes.net";
/** Exact origins only. Local loopback is for development, never a similarly named public host. */
function isOfficialOrigin(origin) {
	if (origin === "chrome-extension://jnnpcnoilofjaffabnhecfokjjknlemg") return true;
	try {
		const u = new URL(origin);
		return u.origin === "https://obpal.blackboxes.net" || ["http:", "https:"].includes(u.protocol) && [
			"localhost",
			"127.0.0.1",
			"[::1]"
		].includes(u.hostname);
	} catch {
		return false;
	}
}
/** An honest fork can keep this disclosure. A malicious copy can remove it; it is not authentication. */
function communityMarker(origin) {
	if (isOfficialOrigin(origin)) return null;
	const a = document.createElement("a");
	a.className = "community-build";
	a.href = `${OFFICIAL_ORIGIN}/trust/`;
	a.textContent = "Community build: not run by ob.Pal";
	a.rel = "noopener";
	return a;
}
//#endregion
export { dotClock as a, parseColor as c, DotLoader as i, toHex as l, DOT_LOADER_STYLE as n, darkenTo as o, DotField as r, lightenTo as s, communityMarker as t, dotTimeline as u };
