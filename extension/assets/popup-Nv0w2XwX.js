import { B as parseAnswers, D as scopeLabel, E as pcView, I as accessOf, L as askFor, T as parsePcState, V as parsePhone, X as LINK_TRY_URL, a as parseFacts, at as TARGET_MODES, d as DESKTOP_URL, et as DEFAULT_MODE, f as EMPTY_PC, m as MAC_ACCESSIBILITY, ot as isTargetMode, s as parseLink, u as workerStale } from "./messages-CWZnFxhW.js";
import { a as mountLook, c as syncLook, d as showAsk, f as ICONS, i as mountLogo, l as radioGroup, m as family, n as lightCards, o as settle, p as LOGO_WORD, r as markContext, s as startLook, t as LINK_ICONS, u as askCard } from "./icons-DxjiK1Tk.js";
import { n as renderSVG, t as encode } from "./dist-Dw4zoNcF.js";
import { a as glyphDots, i as SEAL_GLYPHS, n as sealNames } from "./seal-BUbx7ZQ6.js";
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
//#region ../packages/host/src/dot-field.ts
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
		this.resize = () => {
			if (this.dead) return;
			const rect = this.canvas.getBoundingClientRect();
			const dpr = clamp(Number.isFinite(globalThis.devicePixelRatio) ? globalThis.devicePixelRatio : 1, 1, 3);
			if (this.width === rect.width && this.height === rect.height && this.dpr === dpr) return;
			this.width = Math.max(0, rect.width);
			this.height = Math.max(0, rect.height);
			this.dpr = dpr;
			this.canvas.width = Math.round(this.width * dpr);
			this.canvas.height = Math.round(this.height * dpr);
			this.context?.setTransform(this.width ? this.canvas.width / this.width : 1, 0, 0, this.height ? this.canvas.height / this.height : 1, 0, 0);
			this.layout();
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
		const radius = this.points && this.tokens.scale === "seal" ? Math.min(diameter, this.gridPitch(this.points) * .64) / 2 : diameter / 2;
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
		this.tokens = resolveDotTokens(this.canvas, this.options.scale ?? (this.options.points ? "seal" : "base"));
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
			let alpha = this.points ? .76 : .25 + (dot?.phase ?? .5) * .13;
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
		this.motion?.removeEventListener("change", this.motionChanged);
		this.canvas.ownerDocument.removeEventListener("visibilitychange", this.visibilityChanged);
		this.canvas.ownerDocument.defaultView?.removeEventListener("resize", this.resize);
	}
};
//#endregion
//#region ../packages/host/src/seal.ts
var fields = /* @__PURE__ */ new WeakMap();
/** Three fixed-grid silhouettes, with one grid column between them. */
function sealPoints(seal) {
	return seal.flatMap((index, slot) => glyphDots(index).map((p) => ({
		x: (slot * 12 + p.x * 11) / 35,
		y: p.y
	})));
}
/** DOM-only, accessible rendering works under Trusted Types and the embed's strict CSP. */
function sealElement(seal) {
	const row = document.createElement("div");
	row.className = "connection-seal";
	row.setAttribute("role", "img");
	row.setAttribute("aria-label", `Connection seal: ${sealNames(seal)}`);
	row.dataset.seal = seal.join("-");
	const canvas = document.createElement("canvas");
	canvas.setAttribute("aria-hidden", "true");
	const labels = document.createElement("div");
	labels.className = "seal-names";
	for (const i of seal) {
		const label = document.createElement("small");
		label.textContent = SEAL_GLYPHS[i].name;
		labels.append(label);
	}
	row.append(canvas, labels);
	const field = new DotField(canvas, {
		points: sealPoints(seal),
		surface: "transparent",
		scale: "seal",
		preservePoints: true
	});
	fields.set(row, field);
	const point = (event) => {
		const rect = canvas.getBoundingClientRect();
		field.pointer(event.clientX - rect.left, event.clientY - rect.top);
	};
	canvas.addEventListener("pointermove", point, { passive: true });
	canvas.addEventListener("pointerdown", point, { passive: true });
	for (const event of [
		"pointerleave",
		"pointerup",
		"pointercancel"
	]) canvas.addEventListener(event, () => field.pointer(null), { passive: true });
	return row;
}
/** Release a seal before its owning sheet or card removes it. */
function destroySeal(row) {
	fields.get(row)?.destroy();
	fields.delete(row);
}
var SEAL_STYLE = `
.connection-seal{display:grid;justify-items:center;color:var(--a,var(--accent,currentColor));padding:10px 0;gap:6px}
.connection-seal canvas{display:block;width:224px;max-width:100%;height:70px;touch-action:pan-y}
.seal-names{display:grid;grid-template-columns:repeat(3,1fr);width:224px;max-width:100%;text-align:center;gap:8px}
.seal-names small{font:600 11px/1.3 var(--font,system-ui);color:var(--ink,inherit)}
.seal-moment{position:fixed;bottom:max(24px,env(safe-area-inset-bottom));right:24px;width:288px;box-sizing:border-box;padding:18px;color:var(--ink);background:var(--s,var(--sheet));border:1px solid var(--line,var(--edge,#8885));border-radius:24px;box-shadow:0 16px 48px #0006;backdrop-filter:blur(28px) saturate(150%);z-index:50;pointer-events:none;font:600 13px/1.4 var(--font,system-ui);text-align:center}
.seal-moment p{margin:4px 0}.seal-moment canvas{display:block;width:250px;max-width:100%;height:80px;margin:12px auto 0}
.seal-first{font-size:11px;font-weight:500}.seal-first>span{display:block}.seal-first .trust-domain{display:flex;justify-content:center;margin-bottom:4px}
.seal-moment .seal-names{margin:6px auto 0;width:250px;opacity:0}.seal-moment[data-settled] .seal-names{opacity:1}
@media(max-width:520px){.seal-moment{right:12px;left:12px;width:auto;bottom:auto;top:calc(72px + env(safe-area-inset-top))}}
`;
/** One 1.2-second sequence. The authenticated peers schedule it; it never takes focus or catches input. */
function sealMoment(parent, seal, delayMs, url, notice) {
	const box = document.createElement("div");
	box.className = "seal-moment";
	box.setAttribute("aria-hidden", "true");
	const title = document.createElement("p");
	title.textContent = "Connection seal";
	const canvas = document.createElement("canvas");
	const labels = document.createElement("div");
	labels.className = "seal-names";
	for (const index of seal) {
		const label = document.createElement("small");
		label.textContent = SEAL_GLYPHS[index].name;
		labels.append(label);
	}
	box.append(title, canvas, labels);
	if (notice) box.prepend(notice);
	parent.append(box);
	if (parent instanceof ShadowRoot) {
		const style = getComputedStyle(parent.querySelector(".wrap") ?? parent.host);
		for (const token of [
			"--a",
			"--ink",
			"--line",
			"--edge"
		]) box.style.setProperty(token, style.getPropertyValue(token));
		box.style.setProperty("--s", style.getPropertyValue("--glass"));
	}
	const field = new DotField(canvas, {
		points: sealPoints(seal),
		surface: "transparent",
		scale: "seal",
		preservePoints: true,
		idle: false
	});
	if (url) {
		const qr = encode(url, {
			ecc: "Q",
			border: 0
		});
		const points = [];
		for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) if (qr.data[y][x]) points.push({
			x: .36 + (x + .5) / qr.size * .28,
			y: .08 + (y + .5) / qr.size * .84
		});
		field.setSource(points);
	}
	field.handshake(0);
	let raf = 0;
	let dead = false;
	const reduced = matchMedia("(prefers-reduced-motion: reduce)");
	if (reduced.matches) box.style.opacity = "0";
	let fade;
	const start = setTimeout(() => {
		const started = performance.now();
		const timeline = dotTimeline(Date.now());
		box.dataset.timeline = JSON.stringify(timeline);
		box.style.removeProperty("opacity");
		box.dataset.started = String(started);
		if (reduced.matches) {
			field.handshake(1);
			box.dataset.settled = "";
			fade = box.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: DOT_TIMING.fade });
			return;
		}
		const frame = (now) => {
			if (dead) return;
			if (reduced.matches) {
				field.handshake(1);
				box.dataset.settled = "";
				return;
			}
			const progress = Math.min(1, (now - started) / 1200);
			field.handshake(progress);
			box.dataset.progress = progress.toFixed(3);
			if (progress >= .72) box.dataset.settled = "";
			if (progress < 1) raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
	}, Math.max(0, delayMs));
	const cleanup = () => {
		dead = true;
		clearTimeout(start);
		clearTimeout(end);
		cancelAnimationFrame(raf);
		fade?.cancel();
		field.destroy();
		box.remove();
	};
	const end = setTimeout(cleanup, Math.max(0, delayMs) + 3e3);
	return cleanup;
}
//#endregion
//#region src/popup/popup.ts
/**
* Popup: the ob.Pal lockup with the link's status, and the controls: what the phone drives (Controller / 3D / Keys /
* PC), and where: this tab (with the optional "All sites" permission), or for the PC target, ob.Pal Desktop: the whole
* PC, or the program in front (allow it, or see what is being controlled), with the gestures that drive it. While no
* phone is connected the pairing QR sits beside the controls; once one is, it is the status in the bar (its name, and
* × to disconnect) and the controls have the popup to themselves. The palette button picks the surface and colour
* (../ui/look.ts). It renders from storage (written by the service worker) and asks the worker to change things.
*
* Two kinds of code: the online one (through the room service) and, for a remembered phone, a direct LAN code
* that needs no server. The direct code takes over by itself while the service is unreachable; the chips under
* the QR switch by hand. Remembered phones can be forgotten here.
*
* A phone that wants the PC and hasn't been answered for yet gets the prompt at the top (../ui/ask.ts); one this PC
* said no to shows in the PC card, with the way to allow it after all.
*/
markContext();
startLook();
var ALL_SITES = { origins: ["<all_urls>"] };
var NATIVE_PERMISSION = { permissions: ["nativeMessaging"] };
/**
* The targets: the label, a few words under it where there is room, what it does (said under the tiles while they
* have no room for those words), and the glyph.
*/
var MODES = {
	gamepad: {
		label: "Controller",
		sub: "Gamepad API",
		says: "A virtual gamepad for Gamepad API games",
		icon: LINK_ICONS.gamepad
	},
	viewer: {
		label: "3D",
		sub: "Compatible viewers",
		says: "Drag, pan and zoom compatible page viewers",
		icon: ICONS.cube
	},
	keys: {
		label: "Keys",
		sub: "WASD · arrows",
		says: "WASD, arrows, action keys and the mouse",
		icon: LINK_ICONS.keys
	},
	pc: {
		label: "PC",
		sub: "This computer",
		says: "This computer’s mouse and keyboard, through ob.Pal Desktop",
		icon: LINK_ICONS.pc
	}
};
var STATUS = {
	starting: "Starting",
	ready: "Ready",
	connecting: "Connecting",
	connected: "Connected",
	offline: "Offline"
};
/**
* What the phone's gestures do on the PC, shown while it is being controlled: the trackpad's, Point's (a PC gets the
* mouse face there: Left, Right and a wheel), and typing with the phone's own keyboard. [glyph, what it does, how,
* the whole sentence].
*/
var GESTURES = [
	{
		name: "Trackpad",
		items: [
			[
				LINK_ICONS.tap,
				"Click",
				"tap",
				"Tap: click (tap again: double-click)"
			],
			[
				LINK_ICONS.hold,
				"Right-click",
				"hold",
				"Hold: right-click"
			],
			[
				LINK_ICONS.drag,
				"Drag",
				"hold, move",
				"Hold, then move: drag"
			],
			[
				LINK_ICONS.scroll,
				"Scroll",
				"two fingers",
				"Two fingers, or the wheel along the edge: scroll"
			],
			[
				LINK_ICONS.pinch,
				"Zoom",
				"pinch",
				"Pinch: zoom"
			]
		]
	},
	{
		name: "Point",
		items: [
			[
				ICONS["mouse-left"],
				"Click",
				"Left",
				"Left: click where it went down; hold it and aim away to drag"
			],
			[
				ICONS["mouse-right"],
				"Right-click",
				"Right",
				"Right: right-click"
			],
			[
				ICONS.autoscroll,
				"Scroll",
				"the wheel",
				"The wheel: turn it to scroll, tap it to middle-click, hold it and aim to scroll"
			],
			[
				ICONS["zoom-in"],
				"Zoom",
				"+ −",
				"+ and −: zoom"
			]
		]
	},
	{
		name: "Keyboard",
		items: [[
			LINK_ICONS.type,
			"Type",
			"the phone’s keyboard",
			"Keyboard in the tray, or Type when a text field has the focus: the phone’s own keyboard types into it, and its key row taps Esc, Tab, the arrows, Backspace and Enter"
		]]
	}
];
var state = {
	link: null,
	tab: null,
	mode: DEFAULT_MODE,
	allSites: false,
	current: null,
	busy: false,
	notice: null,
	frames: null,
	code: "auto",
	pc: { ...EMPTY_PC },
	pcPermission: false,
	phone: null,
	answers: {},
	facts: null,
	stale: false
};
var parseFrames = (x) => {
	const f = x;
	return f && typeof f === "object" && Number.isInteger(f.tab) && Number.isInteger(f.count) && typeof f.host === "string" ? f : null;
};
var app = document.getElementById("app");
app.innerHTML = `
  <header class="bar rise">
    <span class="logo" aria-label="ob.Pal"><span class="mark-slot" data-mark></span>${LOGO_WORD}</span>
    <span class="tag">Link</span>
    <span class="conn" id="conn">
      <span class="status" id="status" role="status"><i aria-hidden="true"></i><span id="status-t"></span><b id="device-name" hidden></b></span>
      <span class="facts" id="facts" hidden>${ICONS.lock}<span id="facts-t"></span></span>
      <button id="seal-open" class="seal-open" type="button" aria-expanded="false" aria-controls="link-seal" hidden>Seal</button>
      <button class="unpair" id="unpair" type="button" title="Disconnect" aria-label="Disconnect the phone" hidden>${ICONS.close}</button>
    </span>
    <button class="icon-btn" id="look" type="button" title="Surface and colour" aria-label="Surface and colour">${ICONS.palette}</button>
  </header>
  <div class="seal-popup glass" id="link-seal" hidden><b>Connection seal</b><div id="seal-glyphs"></div><p id="seal-facts"></p><p>Check both screens show the same seal</p></div>
  <div class="bb-menu bb-glass look-menu" id="look-menu" aria-label="Surface and colour" hidden></div>
  <ol class="link-journey" aria-label="Pair, enable, try"><li id="journey-pair">Pair <small>Scan with your phone</small></li><li id="journey-enable">Enable <small>This tab is separate</small></li><li>Try <small>A first demo</small></li></ol>
  <div class="grid">
    <section class="card pair rise" id="pair" style="--i:1" aria-label="Phone">
      <p class="pair-title">Pair a phone</p>
      <div class="scan" id="scan">
        <div class="qr" id="qr" role="img" aria-label="Pairing QR code"></div>
        <p class="scan-hint" id="scan-hint">${ICONS.phone}<span id="scan-t">Scan with your phone</span></p>
        <p class="scan-check"><b>obpal.blackboxes.net</b><br />Opens in your phone’s browser · no app · no account<br />Check your camera shows obpal.blackboxes.net<br /><a href="https://obpal.blackboxes.net/trust/" target="_blank" rel="noopener">How to check ob.Pal</a></p>
        <div class="codes" id="codes" role="radiogroup" aria-label="Which code to show" hidden>
          <button class="code" type="button" role="radio" data-code="cloud" title="Through ob.Pal (needs internet)">${LINK_ICONS.cloud}<span>Online</span></button>
          <button class="code" type="button" role="radio" data-code="lan" title="Direct over Wi-Fi, no internet needed (remembered phones only)">${LINK_ICONS.lan}<span>Direct</span></button>
        </div>
        <div class="remembered" id="remembered" aria-label="Remembered phones" hidden></div>
      </div>
    </section>
    <section class="card controls rise" style="--i:2" aria-label="Controls">
      <p class="controls-label">Choose the input route</p>
      <div class="chips" role="radiogroup" aria-label="What the phone controls">
        ${TARGET_MODES.map((m) => `<button class="chip" type="button" role="radio" aria-checked="false" data-mode="${m}" title="${MODES[m].label}: ${MODES[m].says}">${MODES[m].icon}<span class="chip-t"><b>${MODES[m].label}</b><small>${MODES[m].sub}</small></span></button>`).join("")}
      </div>
      <p class="says" id="says"></p>
      <button class="row swap" id="tab" type="button" role="switch" aria-checked="false" title="Let the phone control this tab">
        <span class="row-ic">${LINK_ICONS.tab}</span>
        <span class="row-t"><b>This tab</b><small id="tab-host"></small></span>
        <span class="sw" aria-hidden="true"><i></i></span>
      </button>
      <div class="pc swap" id="pc" hidden>
        <div class="pc-helper" id="pc-helper" hidden>
          <span class="pc-ver" id="pc-ver"></span>
          <span class="pc-panic" id="pc-panic" title="The panic key: it stops keyboard and mouse input from the phone" hidden></span>
          <button class="icon-btn" id="pc-list" type="button" title="Allowed programs" aria-label="Allowed programs">${ICONS.settings}</button>
        </div>
        <div class="pc-state">
          <div class="pc-main">
            <span class="pc-ic" id="pc-ic"></span>
            <span class="row-t"><b id="pc-title"></b><small id="pc-sub"></small></span>
          </div>
          <div class="kinds swap" id="pc-kinds" role="group" aria-label="What to allow" hidden>
            <button class="kind" type="button" data-kind="keyboard" aria-pressed="true">${LINK_ICONS.keys}<span>keys</span></button>
            <button class="kind" type="button" data-kind="mouse" aria-pressed="true">${LINK_ICONS.mouse}<span>mouse</span></button>
          </div>
          <div class="pc-actions" id="pc-actions"></div>
        </div>
        <div class="pc-legend swap" id="pc-legend" hidden>
          ${GESTURES.map((g) => `<div class="lg" role="group" aria-label="${g.name}"><p class="eyebrow">${g.name}</p><div class="lg-row">${g.items.map(([icon, what, how, title]) => `<span class="lg-i" title="${title}">${icon}<b>${what}</b><small>${how}</small></span>`).join("")}</div></div>`).join("")}
        </div>
      </div>
      <details class="advanced" id="advanced"><summary>More access · optional</summary>
      <button class="row swap" id="all" type="button" role="switch" aria-checked="false" title="Reach game frames hosted on other sites, and keep control across navigation">
        <span class="row-ic">${LINK_ICONS.globe}</span>
        <span class="row-t"><b>All sites</b><small>Frames from other sites</small></span>
        <span class="sw" aria-hidden="true"><i></i></span>
      </button>
      </details>
      <div class="try-route" id="try-route"><span><b>Try the dot demo</b><small>Open it, then choose Controller and enable This tab in Link.</small></span><button class="btn" type="button" id="try-demo">Try</button></div>
      <p class="note swap" id="note" role="alert" hidden></p>
    </section>
  </div>`;
mountLogo(app);
lightCards();
var lookMenu = document.getElementById("look-menu");
mountLook(lookMenu);
family.popover(document.getElementById("look"), lookMenu, (m) => syncLook(m));
var askEl = askCard((key, allow) => void send({
	to: "bg",
	type: "answer",
	key,
	allow
}));
app.insertBefore(askEl, app.querySelector(".grid"));
var $ = (id) => document.getElementById(id);
$("try-demo").addEventListener("click", () => void chrome.tabs.create({ url: LINK_TRY_URL }));
var sealStyle = document.createElement("style");
sealStyle.textContent = SEAL_STYLE;
document.head.append(sealStyle);
var stopMoment = () => {};
$("seal-open").addEventListener("click", () => {
	const show = $("link-seal").hidden;
	$("link-seal").hidden = !show;
	$("seal-open").setAttribute("aria-expanded", String(show));
});
addEventListener("pagehide", () => {
	stopMoment();
	const seal = $("seal-glyphs").querySelector(".connection-seal");
	if (seal) destroySeal(seal);
}, { once: true });
var tabBtn = $("tab");
var allBtn = $("all");
var chips = [...app.querySelectorAll(".chip")];
var codeBtns = [...app.querySelectorAll(".code")];
radioGroup(app.querySelector(".chips"));
radioGroup($("codes"));
var qrFor = null;
var momentFor = null;
var momentReady = false;
var momentKey = (link) => link?.seal && link.sealAt !== void 0 ? `${link.seal.join("-")}:${link.sealAt}` : null;
/** Only a fresh storage event joins the pulse; opening the popup later keeps the comparison seal. */
function revealSeal() {
	const link = state.link;
	if (link?.status !== "connected" || !link.seal) {
		stopMoment();
		momentFor = null;
		return;
	}
	const key = momentKey(link);
	if (!key || key === momentFor) return;
	momentFor = key;
	const delayMs = link.sealAt - Date.now();
	if (delayMs < 0 || delayMs > 350) return;
	stopMoment();
	stopMoment = sealMoment(document.body, link.seal, delayMs, qrFor && qrFor !== "offline" ? qrFor : void 0);
}
var RESTRICTED = /^https:\/\/(chromewebstore\.google\.com|chrome\.google\.com\/webstore|microsoftedge\.microsoft\.com\/addons)/i;
var scriptable = (url) => !!url && /^(https?|file):/i.test(url) && !RESTRICTED.test(url);
function hostOf(url) {
	try {
		const u = new URL(url ?? "");
		return u.protocol === "file:" ? "Local file" : u.host;
	} catch {
		return "";
	}
}
/** The code on screen: the direct one when chosen, or by itself while the service is unreachable. */
function shownCode() {
	const l = state.link;
	const lan = l?.lan ?? "";
	return !!lan && (state.code === "lan" || state.code === "auto" && l?.status === "offline") ? {
		kind: "lan",
		url: lan
	} : {
		kind: "cloud",
		url: l?.url ?? ""
	};
}
function render() {
	const link = state.link;
	const status = link?.status ?? "starting";
	const connected = status === "connected";
	$("journey-pair").dataset.done = String(connected);
	const enabled = state.mode === "pc" ? state.pc.link === "ready" && state.pc.status?.enabled === true && !state.pc.config?.paused && !state.pc.status?.panic && connectedPhone() !== null && accessOf(state.answers, connectedPhone().key) === "allow" : state.tab !== null && state.tab === state.current?.id;
	$("journey-enable").dataset.done = String(enabled);
	$("journey-enable").querySelector("small").textContent = state.mode === "pc" ? "Allow phone + program scope" : enabled ? "This tab is enabled" : "This tab is off";
	$("try-route").hidden = state.mode === "pc";
	$("status").dataset.s = status;
	$("conn").dataset.s = status;
	$("status-t").textContent = STATUS[status];
	$("device-name").hidden = !connected;
	$("device-name").textContent = link?.device || "Phone";
	$("unpair").hidden = !connected;
	$("seal-open").hidden = !connected || !link?.seal;
	const oldSeal = $("seal-glyphs").querySelector(".connection-seal");
	if (oldSeal?.dataset.seal !== link?.seal?.join("-")) {
		if (oldSeal) destroySeal(oldSeal);
		$("seal-glyphs").replaceChildren(...connected && link?.seal ? [sealElement(link.seal)] : []);
	}
	if (!connected || !link?.seal) {
		$("link-seal").hidden = true;
		$("seal-open").setAttribute("aria-expanded", "false");
	}
	renderFacts();
	app.classList.toggle("linked", connected);
	$("pair").hidden = connected;
	showAsk(askEl, askFor(state.mode, connectedPhone(), state.answers, state.pcPermission), () => chips.find((c) => c.getAttribute("aria-checked") === "true")?.focus());
	const code = shownCode();
	const lanPhone = link?.pairs.find((p) => p.id === link.lanFor);
	const qr = $("qr");
	const qrKey = code.url || (status === "offline" ? "offline" : "");
	if (!connected && qrKey !== qrFor) {
		qrFor = qrKey;
		qr.innerHTML = code.url ? renderSVG(code.url, {
			ecc: code.kind === "lan" ? "L" : "M",
			border: 1,
			blackColor: "#0a0a0a",
			whiteColor: "#ffffff"
		}) : status === "offline" ? `<span class="qr-off">${LINK_ICONS.cloudOff}</span>` : "<span class=\"qr-wait\"></span>";
		qr.classList.remove("sweep");
		if (code.url) {
			qr.offsetWidth;
			qr.classList.add("sweep");
		}
	}
	qr.classList.toggle("off", !code.url && status === "offline");
	qr.dataset.kind = code.kind;
	$("scan-hint").replaceChildren();
	$("scan-hint").insertAdjacentHTML("afterbegin", code.kind === "lan" ? LINK_ICONS.lan : ICONS.phone);
	const hint = document.createElement("span");
	hint.id = "scan-t";
	hint.textContent = code.kind === "lan" ? `Direct link${lanPhone ? ` · ${lanPhone.name}` : ""}` : status === "offline" ? "No internet" : "Scan with your phone";
	$("scan-hint").append(hint);
	$("scan-hint").classList.toggle("warn", code.kind === "cloud" && status === "offline");
	$("scan-hint").classList.toggle("direct", code.kind === "lan");
	const hasLan = !!link?.lan;
	$("codes").hidden = !hasLan;
	for (const b of codeBtns) b.setAttribute("aria-checked", String(b.dataset.code === code.kind));
	renderRemembered(connected);
	const cur = state.current;
	const can = scriptable(cur?.url);
	tabBtn.setAttribute("aria-checked", String(cur?.id !== void 0 && state.tab === cur.id));
	tabBtn.setAttribute("aria-busy", String(state.busy));
	tabBtn.disabled = state.busy || !can;
	$("tab-host").textContent = can ? hostOf(cur?.url) : "Not available on this page";
	for (const c of chips) c.setAttribute("aria-checked", String(c.dataset.mode === state.mode));
	const says = $("says");
	says.hidden = state.mode === "pc";
	if (says.textContent !== MODES[state.mode].says) {
		says.textContent = MODES[state.mode].says;
		says.classList.remove("new");
		says.offsetWidth;
		says.classList.add("new");
	}
	allBtn.setAttribute("aria-checked", String(state.allSites));
	$("advanced").hidden = state.mode === "pc";
	if (state.allSites) $("advanced").open = true;
	renderPc();
	const note = $("note");
	const notice = staleHint() ?? state.notice ?? offlineHint() ?? (state.mode === "pc" ? null : framesHint());
	note.hidden = !notice;
	note.replaceChildren();
	if (notice) {
		const { text, action } = notice;
		note.insertAdjacentHTML("afterbegin", LINK_ICONS.info);
		const t = document.createElement("span");
		t.textContent = text;
		note.append(t);
		if (action) {
			const b = document.createElement("button");
			b.type = "button";
			b.textContent = action.label;
			b.onclick = action.run;
			note.append(b);
		}
	}
}
/**
* The link's badge beside the phone's name, as the pairing chip shows it: a lock, the path in a word and the round
* trip; its title says all of it (encrypted end to end, how the phone proved itself, the path, DTLS). Only what the
* connection's own statistics say, and only once it's encrypted.
*/
var VERIFIED = {
	qr: "Verified by the QR code",
	code: "Verified by the code typed",
	lan: "Verified by a remembered pairing"
};
var PATH = {
	lan: ["Direct", "Direct, on the same network"],
	nat: ["Direct", "Direct, over the internet"],
	direct: ["Direct", "Direct, peer to peer"],
	relay: ["Relayed", "Relayed through TURN, which can’t read it"],
	unknown: ["", "Finding the path"]
};
/** Asked of the link every FACTS_MS while the popup is open, and at once when a phone connects. */
var FACTS_MS = 2e3;
async function pollFacts() {
	state.facts = state.link?.status === "connected" ? parseFacts(await send({
		to: "bg",
		type: "facts"
	})) : null;
	renderFacts();
}
function renderFacts() {
	const f = state.link?.status === "connected" ? state.facts : null;
	const el = $("facts");
	el.hidden = !f;
	if (!f) return;
	const rtt = f.rttMs !== void 0 ? `${f.rttMs} ms` : "";
	$("facts-t").textContent = [PATH[f.path][0], rtt].filter(Boolean).join(" · ");
	const path = f.path === "relay" && f.relay ? `Relayed through TURN over ${f.relay.toUpperCase()}, which can’t read it` : PATH[f.path][1];
	const dtls = [f.dtls, f.cipher].filter(Boolean).join(", ");
	el.title = [
		`Encrypted end to end${dtls ? ` (${dtls})` : ""}`,
		VERIFIED[f.verified],
		path,
		...rtt ? [`${rtt} round trip`] : []
	].join("\n");
	$("seal-facts").textContent = el.title.replaceAll("\n", " · ");
}
/** Remembered phones as chips: tap one to make the direct code for it, × to forget it. */
function renderRemembered(connected) {
	const box = $("remembered");
	const pairs = state.link?.pairs ?? [];
	box.hidden = connected || pairs.length === 0;
	box.replaceChildren();
	for (const p of pairs) {
		const chip = document.createElement("span");
		chip.className = "phone";
		chip.dataset.id = p.id;
		chip.setAttribute("aria-current", String(p.id === state.link?.lanFor));
		const pick = document.createElement("button");
		pick.type = "button";
		pick.className = "phone-pick";
		pick.title = "Direct code for this phone";
		pick.insertAdjacentHTML("afterbegin", ICONS.phone);
		const name = document.createElement("span");
		name.textContent = p.name;
		pick.append(name);
		pick.onclick = () => {
			if (p.id !== state.link?.lanFor) send({
				to: "bg",
				type: "lan",
				id: p.id
			});
		};
		const x = document.createElement("button");
		x.type = "button";
		x.className = "phone-x";
		x.title = `Forget ${p.name}`;
		x.setAttribute("aria-label", `Forget ${p.name}`);
		x.innerHTML = ICONS.close;
		x.onclick = () => void send({
			to: "bg",
			type: "forget",
			id: p.id
		});
		chip.append(pick, x);
		box.append(chip);
	}
}
/** Offline with nobody remembered: only an online pairing can start a direct link later. */
function offlineHint() {
	const l = state.link;
	if (!l || l.status !== "offline" || l.lan || l.pairs.length) return null;
	return { text: "ob.Pal can’t be reached. Pair once online and a phone can connect over Wi-Fi without it." };
}
/** New files, old worker: one click restarts the extension from its folder (as the reload button does). */
function staleHint() {
	return state.stale ? {
		text: "ob.Pal Link was updated. Restart it to finish.",
		action: {
			label: "Restart",
			run: () => chrome.runtime.reload()
		}
	} : null;
}
/**
* The controlled page shows a frame from another site (a hosted game, most often) and "All sites" is off: the
* extension can't reach inside it, so the phone's input would go nowhere. Offer the fix in one click.
*/
function framesHint() {
	const f = state.frames;
	const here = state.current?.id;
	if (!f || state.allSites || here === void 0 || state.tab !== here || f.tab !== here || f.count === 0) return null;
	const where = f.host ? ` from ${f.host}` : " from another site";
	return {
		text: f.big ? `The game runs in a frame${where}. Turn on All sites to reach it.` : `This page has a frame${where} that ob.Pal can't reach yet.`,
		action: {
			label: "Turn on",
			run: requestAllSites
		}
	};
}
var send = (m) => chrome.runtime.sendMessage(m).catch((e) => ({
	ok: false,
	error: String(e)
}));
var isOk = (r) => typeof r === "object" && r !== null && r.ok === true;
/** The helper's views that say what is controlled: those wait on the phone being let in. */
var CONTROL_VIEWS = /* @__PURE__ */ new Set([
	"desktop",
	"idle",
	"allow",
	"elevated",
	"active"
]);
/** The phone connected now, as the service worker has it (null while none is). */
var connectedPhone = () => state.link?.status === "connected" ? state.phone : null;
/**
* The PC card while the phone connected now isn't let in (ob.Pal Desktop stays disarmed meanwhile): waiting for the
* answer the prompt above asks for, or refused, with the way to allow it after all. Null: the helper's own state
* decides the card (the phone is allowed, none is connected, or the helper can't run anyway).
*/
function accessCard(v) {
	const phone = connectedPhone();
	if (!phone || !CONTROL_VIEWS.has(v.kind)) return null;
	const access = accessOf(state.answers, phone.key);
	if (access === "allow") return null;
	if (access === "ask") return {
		icon: ICONS.phone,
		title: "Waiting for your answer",
		sub: `${phone.name} asks to control this PC`,
		actions: [],
		kinds: false,
		live: false,
		tone: "plain"
	};
	return {
		icon: LINK_ICONS.shield,
		title: `${phone.name} can’t control this PC`,
		sub: "You said no. Its other targets still work.",
		kinds: false,
		live: false,
		tone: "warn",
		actions: [{
			label: `Allow ${phone.name}`,
			run: () => void send({
				to: "bg",
				type: "answer",
				key: phone.key,
				allow: true
			})
		}]
	};
}
var pcKinds = [...app.querySelectorAll("#pc-kinds .kind")];
var pressed = (b) => b.getAttribute("aria-pressed") === "true";
for (const b of pcKinds) b.addEventListener("click", () => b.setAttribute("aria-pressed", String(!pressed(b))));
$("pc-list").addEventListener("click", () => void chrome.runtime.openOptionsPage());
/** The PC card replaces the tab controls while the target is PC: the phone drives the PC, not a tab. */
function renderPc() {
	const on = state.mode === "pc";
	$("pc").hidden = !on;
	tabBtn.hidden = on;
	allBtn.hidden = on;
	if (!on) return;
	const view = state.pcPermission ? pcView(state.pc) : { kind: "permission" };
	const { icon, title, sub, actions, kinds, live, tone } = accessCard(view) ?? describe(view);
	$("pc-legend").hidden = !live;
	const ic = $("pc-ic");
	ic.innerHTML = icon;
	ic.dataset.tone = tone;
	$("pc-title").textContent = title;
	$("pc-sub").textContent = sub;
	$("pc-kinds").hidden = !kinds;
	renderHelper();
	const box = $("pc-actions");
	box.replaceChildren();
	for (const a of actions) {
		const b = document.createElement("button");
		b.type = "button";
		b.className = a.primary ? "btn primary" : "btn";
		b.textContent = a.label;
		b.onclick = a.run;
		box.append(b);
	}
	box.hidden = !actions.length;
}
/** Above the PC card, once ob.Pal Desktop answers: its version, the panic key that stops phone input, and the list. */
function renderHelper() {
	const pc = state.pc;
	const ready = state.pcPermission && pc.link === "ready";
	$("pc-helper").hidden = !ready;
	$("pc-list").hidden = pc.link !== "ready";
	if (!ready) return;
	const brand = document.createElement("span");
	brand.className = "pc-brand";
	brand.textContent = "ob.Pal ";
	$("pc-ver").replaceChildren(brand, `Desktop${pc.version ? ` ${pc.version}` : ""}`);
	$("pc-ver").title = pc.platform ? "macOS preview: awaiting a first Mac test. Ctrl shortcuts use " + (pc.platform.ctrlToCmd ? "⌘ Command" : "Control") + "; Alt is ⌥ Option." : "";
	const panic = $("pc-panic");
	panic.hidden = !pc.hotkey;
	panic.replaceChildren();
	const label = document.createElement("span");
	label.textContent = "Panic key";
	panic.append(label);
	for (const k of pc.hotkey?.split("+") ?? []) {
		const key = document.createElement("kbd");
		key.textContent = k;
		panic.append(key);
	}
}
function describe(v) {
	const pc = LINK_ICONS.pc;
	const retry = {
		label: "Retry",
		run: () => void send({
			to: "bg",
			type: "pc-connect"
		})
	};
	const pause = {
		label: "Pause",
		run: () => void send({
			to: "bg",
			type: "pc-pause",
			on: true
		})
	};
	/** Offered beside the one-program views: the whole PC, or the helper update that brings it. */
	const whole = (desktop, primary = false) => desktop ? {
		label: primary ? "Control the whole PC" : "Whole PC",
		primary,
		run: () => setDesktop(true)
	} : {
		label: "Update for whole PC",
		run: () => void chrome.tabs.create({ url: DESKTOP_URL })
	};
	switch (v.kind) {
		case "accessibility": return {
			icon: LINK_ICONS.shield,
			title: "Allow Accessibility on this Mac",
			sub: MAC_ACCESSIBILITY,
			actions: [{
				label: "Mac setup",
				run: () => void chrome.tabs.create({ url: `${DESKTOP_URL.replace("#readme", "")}#install-on-a-mac` })
			}],
			kinds: false,
			live: false,
			tone: "warn"
		};
		case "permission": return {
			icon: pc,
			title: "PC",
			sub: "This computer’s mouse and keyboard",
			actions: [{
				label: "Allow PC control",
				primary: true,
				run: requestNative
			}],
			kinds: false,
			live: false,
			tone: "plain"
		};
		case "connecting": return {
			icon: pc,
			title: "Starting…",
			sub: "ob.Pal Desktop",
			actions: [],
			kinds: false,
			live: false,
			tone: "plain"
		};
		case "missing": return {
			icon: LINK_ICONS.shield,
			title: "ob.Pal Desktop isn’t installed",
			sub: "Install it, then retry",
			kinds: false,
			live: false,
			tone: "warn",
			actions: [{
				label: "Install",
				primary: true,
				run: () => void chrome.tabs.create({ url: DESKTOP_URL })
			}, retry]
		};
		case "error": return {
			icon: LINK_ICONS.shield,
			title: "Helper stopped",
			sub: v.error,
			actions: [retry],
			kinds: false,
			live: false,
			tone: "warn"
		};
		case "paused": return {
			icon: LINK_ICONS.pause,
			title: "Paused",
			sub: "Nothing reaches any program",
			actions: [{
				label: "Resume",
				primary: true,
				run: () => void send({
					to: "bg",
					type: "pc-pause",
					on: false
				})
			}],
			kinds: false,
			live: false,
			tone: "rest"
		};
		case "panic": return {
			icon: LINK_ICONS.pause,
			title: "Stopped",
			sub: v.hotkey ? `Panic key ${v.hotkey}` : "Panic key",
			actions: [{
				label: "Resume",
				primary: true,
				run: () => void send({
					to: "bg",
					type: "pc-resume"
				})
			}],
			kinds: false,
			live: false,
			tone: "rest"
		};
		case "desktop": {
			const blocked = v.front?.elevated ? `${v.front.name} runs as administrator: Windows keeps it out of reach` : "";
			return {
				icon: pc,
				title: "Controlling this PC",
				sub: blocked || `${scopeLabel(v.scope)} · every window`,
				kinds: false,
				live: true,
				tone: blocked ? "warn" : "live",
				actions: [pause, {
					label: "One program",
					run: () => setDesktop(false)
				}]
			};
		}
		case "idle": return v.desktop ? {
			icon: pc,
			title: "This PC",
			sub: "Every window, or one program: switch to it, then come back",
			actions: [whole(true, true)],
			kinds: true,
			live: false,
			tone: "plain"
		} : {
			icon: pc,
			title: "Switch to a program",
			sub: "Then come back here to allow it",
			actions: [whole(false)],
			kinds: false,
			live: false,
			tone: "plain"
		};
		case "elevated": return {
			icon: LINK_ICONS.shield,
			title: v.program.name,
			sub: "Runs as administrator: can’t be controlled",
			actions: [whole(v.desktop)],
			kinds: v.desktop,
			live: false,
			tone: "warn"
		};
		case "allow": return {
			icon: pc,
			title: v.program.name,
			sub: v.program.title || v.program.path,
			kinds: true,
			live: false,
			tone: "plain",
			actions: [{
				label: `Allow ${v.program.name}`,
				primary: true,
				run: () => allowProgram(v.program.path)
			}, whole(v.desktop)]
		};
		case "active": return {
			icon: pc,
			title: v.inFront ? `Controlling ${v.program.name}` : v.program.name,
			live: v.inFront,
			kinds: false,
			tone: v.inFront ? "live" : "plain",
			sub: scopeLabel(v.scope) + (v.inFront ? "" : " · switch to it"),
			actions: [pause, whole(v.desktop)]
		};
	}
}
/** Whole-PC mode on (with the kinds chosen above) or off (back to one program at a time). */
function setDesktop(on) {
	const kind = (k) => pressed(pcKinds.find((b) => b.dataset.kind === k));
	send({
		to: "bg",
		type: "pc-desktop",
		on,
		keyboard: on ? kind("keyboard") : true,
		mouse: on ? kind("mouse") : true
	});
}
function allowProgram(path) {
	const kind = (k) => pressed(pcKinds.find((b) => b.dataset.kind === k));
	send({
		to: "bg",
		type: "pc-allow",
		path,
		keyboard: kind("keyboard"),
		mouse: kind("mouse")
	});
}
function requestNative(then) {
	chrome.permissions.request(NATIVE_PERMISSION).then((granted) => {
		state.pcPermission = granted;
		if (granted) then?.();
		render();
	}, () => render());
}
function setMode(mode) {
	state.mode = mode;
	render();
	send({
		to: "bg",
		type: "mode",
		mode
	});
}
tabBtn.addEventListener("click", async () => {
	const id = state.current?.id;
	if (id === void 0 || state.busy) return;
	const on = state.tab !== id;
	state.busy = true;
	state.notice = null;
	render();
	const res = await send({
		to: "bg",
		type: "enable",
		tabId: id,
		on
	});
	state.busy = false;
	if (isOk(res)) state.tab = on ? id : null;
	else state.notice = { text: "This page can’t be controlled." };
	render();
});
for (const chip of chips) chip.addEventListener("click", () => {
	const mode = chip.dataset.mode;
	if (!isTargetMode(mode) || mode === state.mode) return;
	if (mode === "pc" && !state.pcPermission) return requestNative(() => setMode("pc"));
	setMode(mode);
});
for (const b of codeBtns) b.addEventListener("click", () => {
	state.code = b.dataset.code === "lan" ? "lan" : "cloud";
	render();
});
function requestAllSites() {
	chrome.permissions.request(ALL_SITES).then((granted) => {
		state.allSites = granted;
		render();
	}, () => render());
}
allBtn.addEventListener("click", () => {
	state.notice = null;
	if (!state.allSites) return requestAllSites();
	chrome.permissions.remove(ALL_SITES).then((removed) => {
		if (removed) state.allSites = false;
		render();
	}, () => {
		state.notice = {
			text: "Turn off site access in the extension’s settings.",
			action: {
				label: "Open",
				run: openSettings
			}
		};
		render();
	});
});
function openSettings() {
	chrome.tabs.create({ url: `chrome://extensions/?id=${chrome.runtime.id}` });
}
$("unpair").addEventListener("click", () => void send({
	to: "bg",
	type: "unpair"
}));
chrome.storage.onChanged.addListener((changes, area) => {
	if (area === "session") {
		if (changes.tab) state.tab = typeof changes.tab.newValue === "number" ? changes.tab.newValue : null;
		if (changes.link) {
			const was = state.link?.status;
			state.link = parseLink(changes.link.newValue);
			if (momentReady) revealSeal();
			if (state.link?.status !== was) pollFacts();
		}
		if (changes.frames) state.frames = parseFrames(changes.frames.newValue);
		if (changes.pc) state.pc = parsePcState(changes.pc.newValue) ?? { ...EMPTY_PC };
		if (changes.phone) state.phone = parsePhone(changes.phone.newValue);
	} else if (area === "local") {
		if (changes.mode && isTargetMode(changes.mode.newValue)) state.mode = changes.mode.newValue;
		if (changes.answers) state.answers = parseAnswers(changes.answers.newValue);
	}
	render();
});
var refreshPermissions = async () => {
	[state.allSites, state.pcPermission] = await Promise.all([chrome.permissions.contains(ALL_SITES), chrome.permissions.contains(NATIVE_PERMISSION)]);
	render();
};
chrome.permissions.onAdded.addListener(() => void refreshPermissions());
chrome.permissions.onRemoved.addListener(() => void refreshPermissions());
async function init() {
	render();
	send({
		to: "bg",
		type: "ensure"
	});
	const [tabs, session, local, allSites, pcPermission] = await Promise.all([
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}),
		chrome.storage.session.get([
			"tab",
			"link",
			"frames",
			"pc",
			"phone"
		]),
		chrome.storage.local.get(["mode", "answers"]),
		chrome.permissions.contains(ALL_SITES),
		chrome.permissions.contains(NATIVE_PERMISSION)
	]);
	state.current = tabs[0] ?? null;
	state.tab = typeof session.tab === "number" ? session.tab : null;
	state.link = parseLink(session.link);
	state.frames = parseFrames(session.frames);
	state.pc = parsePcState(session.pc) ?? { ...EMPTY_PC };
	state.phone = parsePhone(session.phone);
	state.answers = parseAnswers(local.answers);
	state.mode = isTargetMode(local.mode) ? local.mode : DEFAULT_MODE;
	state.allSites = allSites;
	state.pcPermission = pcPermission;
	render();
	momentFor = momentKey(state.link);
	momentReady = true;
	settle();
	pollFacts();
	setInterval(() => void pollFacts(), FACTS_MS);
	if (state.mode === "pc" && pcPermission) send({
		to: "bg",
		type: "pc-connect"
	});
	state.stale = workerStale(await send({
		to: "bg",
		type: "version"
	}), chrome.runtime.getManifest().version);
	if (state.stale) render();
}
init();
//#endregion
