import { t as encode } from "./dist-Dw4zoNcF.js";
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
//#region ../packages/host/src/svg.ts
var NS = "http://www.w3.org/2000/svg";
var escape = (v) => String(v).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
/** Markup for a node and its children. */
function svgString([tag, attrs, children = []]) {
	return `<${tag}${Object.entries(attrs).map(([k, v]) => ` ${k}="${escape(v)}"`).join("")}>${children.map(svgString).join("")}</${tag}>`;
}
/** The node and its children as elements of `doc`. */
function svgElement([tag, attrs, children = []], doc = document) {
	const el = doc.createElementNS(NS, tag);
	for (const [k, v] of Object.entries(attrs)) if (k !== "xmlns") el.setAttribute(k, String(v));
	for (const c of children) el.appendChild(svgElement(c, doc));
	return el;
}
//#endregion
//#region ../packages/host/src/mark.ts
/** The mark's shapes, for a 100 × 100 box. */
function markNodes(accent) {
	const box = "50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4";
	return [
		["ellipse", {
			cx: 50,
			cy: 57,
			rx: 47,
			ry: 15,
			transform: "rotate(-14 50 57)",
			fill: "none",
			stroke: accent,
			"stroke-width": 3,
			opacity: .35
		}],
		["polygon", {
			points: box,
			fill: "#050505"
		}],
		["polygon", {
			points: "50,19 78,34.4 50,49.8 22,34.4",
			fill: "#2f2f2f"
		}],
		["polygon", {
			points: "22,34.4 50,49.8 50,80.6 22,65.2",
			fill: "#0c0c0c"
		}],
		["polygon", {
			points: "50,49.8 78,34.4 78,65.2 50,80.6",
			fill: "#191919"
		}],
		["polygon", {
			points: box,
			fill: "none",
			stroke: "#fff",
			"stroke-opacity": .42,
			"stroke-width": 1.6,
			"stroke-linejoin": "round"
		}],
		["path", {
			d: "M50 49.8V80.6",
			stroke: "#fff",
			"stroke-opacity": .3,
			"stroke-width": 1.4
		}],
		["path", {
			d: "M22 34.4 50 49.8 78 34.4",
			fill: "none",
			stroke: accent,
			"stroke-width": 3,
			"stroke-linejoin": "round"
		}],
		["path", {
			d: "M50 19 78 34.4",
			stroke: "#fff",
			"stroke-opacity": .75,
			"stroke-width": 1.4,
			"stroke-linecap": "round"
		}],
		["path", {
			d: "M95.6 45.63A47 15-14 0 1 4.4 68.37",
			fill: "none",
			stroke: accent,
			"stroke-width": 4.4,
			"stroke-linecap": "round"
		}],
		["circle", {
			cx: 82.1,
			cy: 60.8,
			r: 5.4,
			fill: accent
		}],
		["circle", {
			cx: 82.1,
			cy: 60.8,
			r: 2,
			fill: "#fff"
		}]
	];
}
//#endregion
//#region ../packages/host/src/qr.ts
/**
* ob.Pal's QR code: uqr's matrix drawn in the brand. Round dots, finder squares as rounded boxes with an
* accent-tinted eye, and the ob.Pal mark in the middle over a cleared circle.
*
* Every camera must still read it, so the dark parts stay dark on a light plate whatever colours are asked for:
* the accent is darkened (in linear light, keeping its hue) until the eyes are nearly as dark as the ink, and ECC
* 'Q' covers the modules under the mark. The vivid accent goes only where scanning doesn't look: the mark, and
* around the plate (the pairing chip's glow). tests/qr.test.ts decodes it with two decoders over sizes, surfaces
* and accents, beside uqr's plain code of the same density. plainQr is the fallback.
*
* Each comes as markup (brandedQr, plainQr) or as an element (brandedQrElement, plainQrElement): the pairing chip
* builds elements, so it works on pages that enforce Trusted Types.
*/
var LIME = [
	198,
	255,
	52
];
var INK = [
	11,
	13,
	16
];
var WHITE = [
	255,
	255,
	255
];
/**
* Luminance limits: modules at least 13:1 against the plate, eyes at least 10:1. Lighter eyes (tried down to 6:1)
* cost decoders reads at small sizes; a finder's eye has to look as dark as its ring.
*/
var INK_MAX = .02;
var EYE_MAX = .04;
/** Dot diameter, in modules: round dots with a hair of space between them. */
var DOT = .92;
/** The colours a code is drawn in, made safe to scan. */
function qrColors(style = {}) {
	const accent = parseColor(style.accent) ?? LIME;
	return {
		accent: toHex(accent),
		eye: toHex(darkenTo(accent, EYE_MAX * .97)),
		ink: toHex(darkenTo(parseColor(style.ink) ?? INK, INK_MAX * .97)),
		plate: toHex(lightenTo(parseColor(style.plate) ?? WHITE, .855))
	};
}
var f = (v) => String(Math.round(v * 1e3) / 1e3);
/** A rounded rectangle as a closed subpath (for even-odd rings). */
function box(x, y, w, h, r) {
	return `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(h - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(2 * r - w)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(2 * r - h)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}z`;
}
/** The branded code, as SVG described in data. */
function brandedQrNode(text, style = {}) {
	const qr = encode(text, {
		ecc: style.ecc ?? "Q",
		border: 0
	});
	const n = qr.size;
	const m = style.margin ?? 3;
	const c = qrColors(style);
	const withMark = style.mark !== false;
	const rc = withMark ? Math.round(n * .24) / 2 : 0;
	const mid = n / 2;
	const cleared = (x, y, pad = .2) => withMark && Math.hypot(x + .5 - mid, y + .5 - mid) < rc + pad;
	const finder = (x, y) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
	const ALIGN = 4;
	const isAlign = (x, y) => qr.types[y]?.[x] === ALIGN;
	const aligns = [];
	for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) if (isAlign(x, y) && qr.data[y][x] && isAlign(x - 2, y - 2) && isAlign(x + 2, y + 2) && !qr.data[y][x + 1] && !qr.data[y + 1][x]) aligns.push([x, y]);
	const inAlign = (x, y) => aligns.some(([ax, ay]) => Math.abs(x - ax) <= 2 && Math.abs(y - ay) <= 2);
	let dots = "";
	for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.data[y][x] && !finder(x, y) && !inAlign(x, y) && !cleared(x, y)) dots += `M${x + .5} ${y + .5}h0`;
	let rings = "";
	let eyes = "";
	for (const [x, y] of [
		[0, 0],
		[n - 7, 0],
		[0, n - 7]
	]) {
		rings += box(x, y, 7, 7, 2.3) + box(x + 1, y + 1, 5, 5, 1.5);
		eyes += box(x + 2, y + 2, 3, 3, 1.05);
	}
	for (const [x, y] of aligns) {
		if (cleared(x, y, 3)) continue;
		rings += box(x - 2, y - 2, 5, 5, 1.5) + box(x - 1, y - 1, 3, 3, .8);
		dots += `M${x + .5} ${y + .5}h0`;
	}
	const size = n + 2 * m;
	const markSize = rc * 2 * .96;
	const children = [
		["rect", {
			x: -m,
			y: -m,
			width: size,
			height: size,
			rx: f(size * .06),
			fill: c.plate
		}],
		["path", {
			d: dots,
			fill: "none",
			stroke: c.ink,
			"stroke-width": DOT,
			"stroke-linecap": "round"
		}],
		["path", {
			d: rings,
			fill: c.ink,
			"fill-rule": "evenodd"
		}],
		["path", {
			d: eyes,
			fill: c.eye
		}]
	];
	if (withMark) children.push([
		"g",
		{ transform: `translate(${f(mid - markSize / 2)} ${f(mid - markSize / 2)}) scale(${f(markSize / 100)})` },
		markNodes(c.accent)
	]);
	return [
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `${-m} ${-m} ${size} ${size}`,
			...a11y(style.label),
			"shape-rendering": "geometricPrecision"
		},
		children
	];
}
var a11y = (label) => label ? {
	role: "img",
	"aria-label": label
} : { "aria-hidden": "true" };
/** The branded code as SVG markup. */
var brandedQr = (text, style = {}) => svgString(brandedQrNode(text, style));
/** The branded code as an SVG element (no markup parsed: safe under Trusted Types). */
var brandedQrElement = (text, style = {}, doc = document) => svgElement(brandedQrNode(text, style), doc);
/** The plain code, uqr's matrix as square modules, black on white: the fallback wherever the branded one can't be used. */
function plainQrNode(text, label) {
	const qr = encode(text, {
		ecc: "M",
		border: 2
	});
	let d = "";
	for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) if (qr.data[y][x]) d += `M${x} ${y}h1v1h-1z`;
	return [
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `0 0 ${qr.size} ${qr.size}`,
			...a11y(label),
			"shape-rendering": "crispEdges"
		},
		[["rect", {
			width: qr.size,
			height: qr.size,
			fill: "#fff"
		}], ["path", {
			d,
			fill: "#000"
		}]]
	];
}
/** The plain code as SVG markup. */
var plainQr = (text, label) => svgString(plainQrNode(text, label));
/** The plain code as an SVG element. */
var plainQrElement = (text, label, doc = document) => svgElement(plainQrNode(text, label), doc);
//#endregion
export { brandedQr, brandedQrElement, brandedQrNode, plainQr, plainQrElement, plainQrNode, qrColors };
