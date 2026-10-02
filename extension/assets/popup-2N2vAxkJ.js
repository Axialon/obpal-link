import { n as qrDotPoints, t as brandedQrElement } from "./qr-BJ9kwVUy.js";
import { B as parseAnswers, D as scopeLabel, E as pcView, I as accessOf, L as askFor, T as parsePcState, V as parsePhone, X as LINK_TRY_URL, a as parseFacts, at as TARGET_MODES, d as DESKTOP_URL, et as DEFAULT_MODE, f as EMPTY_PC, m as MAC_ACCESSIBILITY, ot as isTargetMode, s as parseLink, u as workerStale } from "./messages-CWZnFxhW.js";
import { a as dotClock, i as DotLoader, n as DOT_LOADER_STYLE, r as DotField, u as dotTimeline } from "./origin-BKT9Ocdt.js";
import { a as mountLook, c as syncLook, d as showAsk, f as family, h as LINK_LOGO, i as mountLogo, l as radioGroup, m as ICONS, n as lightCards, o as settle, p as dotLoading, r as markContext, s as startLook, t as LINK_ICONS, u as askCard } from "./icons-CtH5l-hq.js";
import { a as glyphDots, i as SEAL_GLYPHS, n as sealNames } from "./seal-BlqsjHPq.js";
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
function sealElement(seal, compact = false) {
	const row = document.createElement("div");
	row.className = `connection-seal${compact ? " seal-compact" : ""}`;
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
		preservePoints: true,
		pixelAligned: true
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
.connection-seal,.seal-moment,.seal-stage{--ob-dot-active:var(--seal-ink,var(--bb-ink,var(--ink,currentColor)))}
.connection-seal{display:grid;justify-items:center;color:var(--ob-dot-active);padding:10px 0;gap:6px;background:var(--seal-plate,var(--bb-sheet,var(--sheet,#141415)));border-radius:12px}
.connection-seal canvas{display:block;width:224px;max-width:100%;height:70px;touch-action:pan-y}
.connection-seal.seal-compact{display:inline-grid;flex:none;padding:0;gap:0}
.seal-compact canvas{width:110px;height:34.6px;transition:transform 120ms var(--bb-ease,var(--ease,ease-out))}
@media(prefers-reduced-motion:reduce){.seal-compact canvas{transform:none!important;transition:none}}
.seal-compact .seal-names{display:none}
.seal-names{display:grid;grid-template-columns:repeat(3,1fr);width:224px;max-width:100%;text-align:center;gap:8px}
.seal-names small{font:600 11px/1.3 var(--font,system-ui);color:var(--ink,inherit)}
.seal-moment{position:fixed;bottom:max(88px,env(safe-area-inset-bottom));right:24px;width:288px;box-sizing:border-box;padding:18px;color:var(--ink);background:var(--s,var(--sheet));border:1px solid var(--line,var(--edge,#8885));border-radius:24px;box-shadow:var(--bb-frost-shadow,0 16px 48px #0006);backdrop-filter:var(--bb-frost-blur,blur(28px) saturate(150%));z-index:50;pointer-events:none;font:600 13px/1.4 var(--font,system-ui);text-align:center}
.seal-moment p{margin:4px 0}.seal-moment canvas{display:block;width:250px;max-width:100%;height:80px;margin:12px auto 0}
.seal-first{font-size:11px;font-weight:500}.seal-first>span{display:block}.seal-first .trust-domain{display:flex;justify-content:center;margin-bottom:4px}
.seal-moment .seal-names{margin:6px auto 0;width:250px;opacity:0}.seal-moment[data-settled] .seal-names{opacity:1}
@media(max-width:520px){.seal-moment{right:12px;left:12px;width:auto;bottom:auto;top:calc(72px + env(safe-area-inset-top))}}
`;
//#endregion
//#region ../packages/host/src/seal-surface.ts
var SEAL_SURFACE_STYLE = `
.seal-stage{position:relative;width:100%;height:100%;isolation:isolate;border-radius:16px;background:var(--seal-plate,var(--bb-sheet,var(--sheet,#141415)));color:var(--seal-ink,var(--bb-ink,var(--ink,#fff)));overflow:hidden}
.seal-stage .seal-plane{position:absolute;inset:0;transform-origin:50% 50%;will-change:transform}
.seal-stage .seal-qr{position:absolute;inset:0;display:grid;place-items:center;background:#fff;border-radius:inherit}
.seal-stage .seal-qr>svg{display:block;width:100%;height:100%}
.seal-stage .seal-qr .dot-loader{color:#0b0d10}
.seal-stage .dot-loader{position:absolute;left:50%;top:50%;translate:-50% -50%}
.seal-stage .seal-peers{position:absolute;inset:12px;display:grid;align-content:center;gap:8px;grid-template-columns:1fr}
.seal-stage[data-many] .seal-peers{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 6px;inset:8px}
.seal-stage[data-dense] .seal-peers{gap:4px 6px}.seal-stage[data-dense] .seal-peer>small{font-size:8px;line-height:1;margin-top:1px}
.seal-stage .seal-peer{display:grid;grid-template-columns:minmax(0,1fr);width:100%;justify-items:center;min-width:0;color:inherit;border:0;padding:0;background:none;cursor:pointer;font:500 10px/1.2 var(--font,system-ui)}
.seal-stage .connection-seal{grid-template-columns:minmax(0,1fr);width:100%;min-width:0;padding:0;background:var(--seal-plate,var(--bb-sheet,var(--sheet,#141415)));border-radius:6px}
.seal-stage .connection-seal canvas{width:100%;height:auto;aspect-ratio:35/11}
.seal-stage .seal-names{display:none}.seal-stage .seal-peer>small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:3px}
.seal-stage .seal-flight{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.seal-action{display:grid;place-items:center;flex:none;width:44px;height:44px;border:0;background:transparent;color:var(--seal-ink,var(--bb-ink,var(--ink,#fff)));border-radius:50%;font:300 24px/1 system-ui;cursor:pointer}
.seal-stage>.seal-action{position:absolute;right:2px;bottom:2px;z-index:2;background:var(--seal-plate,var(--bb-sheet,var(--sheet,#141415)))}
.seal-action:focus-visible,.seal-stage .seal-peer:focus-visible{outline:2px solid currentColor;outline-offset:-3px}
.seal-stage[data-qr] .seal-action{background:#fff;color:#14171c}
.seal-action[hidden],.seal-stage [hidden]{display:none!important}
@media(prefers-reduced-motion:reduce){.seal-stage .seal-plane{transform:none!important;filter:none!important}}
`;
/** The QR's footprint is also the resting connection surface. No pairing state removes it. */
var SealSurface = class {
	constructor(options) {
		this.options = options;
		this.el = document.createElement("div");
		this.plane = document.createElement("div");
		this.qr = document.createElement("div");
		this.peers = document.createElement("div");
		this.flight = document.createElement("canvas");
		this.action = document.createElement("button");
		this.loader = new DotLoader({
			size: 64,
			label: "Making a pairing QR code"
		});
		this.rows = /* @__PURE__ */ new Map();
		this.source = [];
		this.showingQr = true;
		this.adding = false;
		this.stop = () => {};
		this.busy = false;
		this.motion = matchMedia("(prefers-reduced-motion: reduce)");
		this.lastActivity = -Infinity;
		this.dead = false;
		this.motionChanged = () => {
			this.plane.style.removeProperty("transform");
			this.plane.style.removeProperty("filter");
		};
		this.el.className = "seal-stage";
		this.plane.className = "seal-plane";
		this.qr.className = "seal-qr";
		this.peers.className = "seal-peers";
		this.flight.className = "seal-flight";
		this.action.className = "seal-action";
		this.action.type = "button";
		this.flight.setAttribute("aria-hidden", "true");
		this.qr.append(this.loader.el);
		this.plane.append(this.qr, this.peers, this.flight);
		this.el.append(this.plane, this.action);
		this.field = new DotField(this.flight, {
			points: [],
			preservePoints: true,
			scale: "seal",
			surface: "transparent",
			idle: false
		});
		this.action.onclick = () => this.adding ? this.cancel() : this.add();
		this.el.addEventListener("pointermove", (event) => {
			if (this.motion.matches || this.busy || this.showingQr) return;
			const rect = this.el.getBoundingClientRect();
			this.plane.style.transform = `translate3d(${((event.clientX - rect.left) / rect.width - .5) * 3}px,${((event.clientY - rect.top) / rect.height - .5) * 2}px,0)`;
		}, { passive: true });
		this.el.addEventListener("pointerleave", () => this.plane.style.removeProperty("transform"));
		this.el.addEventListener("pointerenter", () => this.shimmer());
		this.el.addEventListener("focusin", () => this.shimmer());
		this.motion.addEventListener("change", this.motionChanged);
		this.rest();
	}
	/** Mount beside the QR when the card has a footer, keeping every peer's glyphs unobstructed. */
	get addControl() {
		return this.action;
	}
	/** An unavailable code is a static symbol, not work that appears to continue forever. */
	setPlaceholder(symbol) {
		this.loader.finish();
		this.source = [];
		this.qr.replaceChildren(symbol);
	}
	/** Reuse the same loader when the service starts making a code again. */
	loading() {
		this.source = [];
		this.qr.replaceChildren(this.loader.el);
		this.loader.start();
	}
	/** A scannable SVG stays still at rest; its own module centres become the moving source. */
	setQr(svg, modules) {
		this.source = modules;
		this.loader.finish();
		this.qr.replaceChildren(svg);
		if (this.busy && this.showingQr) this.field.setSource(modules);
		if (this.showingQr && !this.busy) {
			this.field.setPoints(modules);
			this.field.setSource([
				{
					x: .4,
					y: .5
				},
				{
					x: .5,
					y: .5
				},
				{
					x: .6,
					y: .5
				}
			]);
			this.animate(performance.now(), false, () => this.rest(), 240);
		}
	}
	sync(list) {
		if (this.dead) return;
		const leaving = [...this.rows.keys()].filter((id) => !list.some((peer) => peer.id === id));
		const old = leaving.length ? leaving.flatMap((id) => this.points(id)) : this.points();
		for (const id of leaving) {
			const row = this.rows.get(id);
			destroySeal(row.seal);
			row.button.remove();
			this.rows.delete(id);
		}
		for (const peer of list) {
			let row = this.rows.get(peer.id);
			if (row?.seal.dataset.seal !== peer.seal.join("-")) {
				if (row) {
					destroySeal(row.seal);
					row.button.remove();
				}
				const button = document.createElement("button");
				button.type = "button";
				button.className = "seal-peer";
				button.dataset.peer = peer.id;
				button.setAttribute("aria-label", `${peer.name}. Compare connection seal`);
				const seal = sealElement(peer.seal);
				const name = document.createElement("small");
				name.textContent = peer.name;
				button.append(seal, name);
				button.onclick = () => this.options.compare(peer.id);
				row = {
					peer,
					button,
					seal
				};
				this.rows.set(peer.id, row);
				this.peers.append(button);
			}
			row.peer = peer;
		}
		this.el.toggleAttribute("data-many", list.length > 1);
		this.el.toggleAttribute("data-dense", list.length > 4);
		if (leaving.length && !list.length) {
			this.adding = false;
			this.showingQr = true;
			this.field.setPoints(old);
			this.field.setSource(this.source);
			this.animate(performance.now(), true, () => this.rest());
		} else if (leaving.length) {
			const burst = old.filter((_, i) => i % 3 === 0);
			this.field.setPoints(burst);
			this.field.setSource([{
				x: .9,
				y: .9
			}]);
			this.animate(performance.now(), true, () => this.rest(), 480, false);
		} else if (!this.busy) this.rest();
	}
	/** The caller's scheduled clock survives delayed delivery and rendering work. */
	reveal(id, delayMs) {
		const row = this.rows.get(id);
		if (!row) return;
		const started = performance.now() + delayMs;
		const timeline = dotTimeline(Date.now() + delayMs);
		const first = this.showingQr;
		this.adding = false;
		this.showingQr = false;
		this.field.setPoints(this.points(id));
		this.field.setSource(first ? this.source : Array.from({ length: 60 }, (_, i) => ({
			x: .88 + Math.cos(i) * .035,
			y: .88 + Math.sin(i) * .035
		})));
		row.button.style.visibility = "hidden";
		this.flight.dataset.timeline = JSON.stringify(timeline);
		this.flight.dataset.started = String(started);
		this.animate(started, false, () => {
			row.button.style.removeProperty("visibility");
			this.rest();
		}, 1200, first);
	}
	add() {
		if (!this.rows.size || this.adding) return;
		this.options.add();
		this.adding = true;
		this.showingQr = true;
		this.field.setPoints(this.points());
		this.field.setSource(this.source);
		this.animate(performance.now(), true, () => this.rest());
	}
	cancel() {
		this.adding = false;
		this.showingQr = false;
		this.field.setPoints(this.points());
		this.field.setSource(this.source);
		this.animate(performance.now(), false, () => this.rest());
	}
	/** Opening an already connected surface shows its seal without replaying the handshake. */
	settle() {
		this.stop();
		this.busy = false;
		this.showingQr = !this.rows.size;
		this.adding = false;
		this.rest();
	}
	/** Activity is a finite breath, not an idle claim that a silent link is sending input. */
	activity() {
		const now = performance.now();
		if (now - this.lastActivity < 700 || this.busy || this.showingQr || this.motion.matches) return;
		this.lastActivity = now;
		this.stop();
		this.plane.style.removeProperty("filter");
		this.stop = dotClock((t) => {
			const p = Math.min(1, (t - now) / 640);
			this.plane.style.transform = `translate3d(0,${-Math.sin(p * Math.PI)}px,0)`;
			if (p === 1) this.plane.style.removeProperty("transform");
			return p < 1;
		});
	}
	shimmer() {
		if (this.motion.matches || this.busy || this.showingQr) return;
		const started = performance.now();
		this.stop();
		this.plane.style.removeProperty("transform");
		this.stop = dotClock((now) => {
			const p = Math.min(1, (now - started) / 700);
			this.plane.style.filter = `brightness(${1 + Math.sin(p * Math.PI) * .12})`;
			if (p === 1) this.plane.style.removeProperty("filter");
			return p < 1;
		});
	}
	points(id) {
		const rect = this.el.getBoundingClientRect();
		if (!rect.width || !rect.height) return [];
		const hidden = this.peers.hidden;
		this.peers.hidden = false;
		const points = [...this.rows.values()].filter((row) => !id || row.peer.id === id).flatMap((row) => {
			const canvas = row.seal.querySelector("canvas").getBoundingClientRect();
			return sealPoints(row.peer.seal).map((point) => ({
				x: (canvas.left - rect.left + point.x * canvas.width) / rect.width,
				y: (canvas.top - rect.top + point.y * canvas.height) / rect.height
			}));
		});
		this.peers.hidden = hidden;
		return points;
	}
	animate(started, reverse, done, duration = 1200, hidePeers = true) {
		this.stop();
		this.busy = true;
		this.plane.style.removeProperty("filter");
		this.plane.style.removeProperty("transform");
		this.flight.hidden = false;
		this.qr.hidden = true;
		this.peers.hidden = hidePeers;
		this.action.hidden = true;
		const finish = () => {
			this.busy = false;
			this.flight.hidden = true;
			done();
		};
		delete this.flight.dataset.settled;
		if (this.motion.matches || performance.now() - started >= duration) {
			this.flight.dataset.progress = "1.000";
			this.flight.dataset.settled = "";
			this.field.handshake(reverse ? 0 : 1);
			finish();
			return;
		}
		this.stop = dotClock((now) => {
			if (this.motion.matches || now - started >= duration) {
				this.flight.dataset.progress = "1.000";
				this.flight.dataset.settled = "";
				this.field.handshake(reverse ? 0 : 1);
				finish();
				return false;
			}
			const p = Math.max(0, Math.min(1, (now - started) / duration));
			this.flight.dataset.progress = p.toFixed(3);
			this.field.handshake(reverse ? 1 - p : p);
			return true;
		});
	}
	rest() {
		this.rows.forEach((row) => row.button.style.removeProperty("visibility"));
		this.el.toggleAttribute("data-qr", this.showingQr);
		this.qr.hidden = !this.showingQr;
		this.peers.hidden = this.showingQr;
		this.flight.hidden = true;
		this.action.hidden = !this.rows.size;
		this.action.textContent = this.adding ? "×" : "+";
		this.action.setAttribute("aria-label", this.adding ? "Cancel adding a phone" : "Add a phone");
	}
	destroy() {
		this.dead = true;
		this.stop();
		this.loader.destroy();
		this.field.destroy();
		this.rows.forEach((row) => destroySeal(row.seal));
		this.motion.removeEventListener("change", this.motionChanged);
	}
};
//#endregion
//#region src/popup/popup.ts
/**
* Popup: the ob.Pal lockup with the link's status, and the controls: what the phone drives (Controller / 3D / Keys /
* PC), and where: this tab (with the optional "All sites" permission), or for the PC target, ob.Pal Desktop: the whole
* PC, or the program in front (allow it, or see what is being controlled), with the gestures that drive it. While no
* phone is connected the pairing QR sits beside the controls; once one is, its dots become the persistent seal in
* that same area. The palette button picks the surface and colour
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
    <span class="logo" aria-label="ob.Pal Link">${LINK_LOGO}</span>
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
        <div class="pair-icons"><span role="img" aria-label="Scan with your phone’s camera" title="Scan with your phone’s camera">${LINK_ICONS.scan}</span><span role="img" aria-label="No app needed" title="No app needed">${LINK_ICONS.noApp}</span><span role="img" aria-label="No account needed" title="No account needed">${LINK_ICONS.noAccount}</span><span role="img" aria-label="Encrypted, peer to peer" title="Encrypted, peer to peer">${ICONS.lock}</span></div>
        <details class="scan-check"><summary aria-label="Pairing details">${ICONS.help}</summary><b>obpal.blackboxes.net</b><br />Opens in your phone’s browser · no app · no account<br />Check your camera shows obpal.blackboxes.net<br /><a href="https://obpal.blackboxes.net/trust/" target="_blank" rel="noopener">How to check ob.Pal</a></details>
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
sealStyle.textContent = SEAL_STYLE + SEAL_SURFACE_STYLE + DOT_LOADER_STYLE + `
.seal-popup:not([data-expanded]){padding:6px 12px}
.seal-popup:not([data-expanded])>b,.seal-popup:not([data-expanded])>p{display:none}
#seal-glyphs{display:grid;place-items:center;min-height:44px;cursor:pointer;border-radius:12px}
#seal-glyphs:focus-visible{outline:2px solid var(--bb-accent-text);outline-offset:2px}
`;
document.head.append(sealStyle);
var surface = new SealSurface({
	add: () => {},
	compare: () => {
		$("link-seal").hidden = false;
		if (!$("link-seal").hasAttribute("data-expanded")) $("seal-open").click();
	}
});
$("qr").removeAttribute("role");
$("qr").replaceChildren(surface.el);
document.querySelector(".pair-icons").append(surface.addControl);
chrome.runtime.onMessage.addListener((message, sender) => {
	if (sender.id === chrome.runtime.id && message?.to === "seal-ui" && message.type === "activity") surface.activity();
});
$("seal-open").addEventListener("click", () => {
	const show = !$("link-seal").hasAttribute("data-expanded");
	$("link-seal").toggleAttribute("data-expanded", show);
	$("link-seal").hidden = !show;
	$("seal-glyphs").querySelector(".connection-seal")?.classList.toggle("seal-compact", !show);
	$("seal-open").setAttribute("aria-expanded", String(show));
});
$("seal-glyphs").setAttribute("role", "button");
$("seal-glyphs").setAttribute("tabindex", "0");
$("seal-glyphs").setAttribute("aria-label", "Compare connection seal");
$("seal-glyphs").onclick = () => $("seal-open").click();
$("seal-glyphs").onkeydown = (event) => {
	if (event.key === "Enter" || event.key === " ") {
		event.preventDefault();
		$("seal-open").click();
	}
};
addEventListener("pagehide", () => {
	surface.destroy();
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
		momentFor = null;
		return;
	}
	const key = momentKey(link);
	if (!key || key === momentFor) return;
	momentFor = key;
	const delayMs = link.sealAt - Date.now();
	if (delayMs > 350) return;
	surface.reveal("phone", delayMs);
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
	app.querySelector(".pair-title").textContent = connected ? "Connection seal" : "Pair a phone";
	$("journey-pair").dataset.done = String(connected);
	const enabled = state.mode === "pc" ? state.pc.link === "ready" && state.pc.status?.enabled === true && !state.pc.config?.paused && !state.pc.status?.panic && connectedPhone() !== null && accessOf(state.answers, connectedPhone().key) === "allow" : state.tab !== null && state.tab === state.current?.id;
	$("journey-enable").dataset.done = String(enabled);
	$("journey-enable").querySelector("small").textContent = state.mode === "pc" ? "Allow phone + program scope" : enabled ? "This tab is enabled" : "This tab is off";
	$("try-route").hidden = state.mode === "pc";
	$("status").dataset.s = status;
	$("conn").dataset.s = status;
	$("status-t").textContent = STATUS[status];
	$("status-t").classList.toggle("dot-wait-label", [
		"starting",
		"ready",
		"connecting"
	].includes(status));
	dotLoading($("status"), status === "starting" || ["ready", "connecting"].includes(status) && !!link?.url, STATUS[status]);
	$("device-name").hidden = !connected;
	$("device-name").textContent = link?.device || "Phone";
	$("unpair").hidden = !connected;
	$("seal-open").hidden = !connected || !link?.seal;
	const oldSeal = $("seal-glyphs").querySelector(".connection-seal");
	if (oldSeal?.dataset.seal !== link?.seal?.join("-")) {
		if (oldSeal) destroySeal(oldSeal);
		$("seal-glyphs").replaceChildren(...connected && link?.seal ? [sealElement(link.seal, !$("link-seal").hasAttribute("data-expanded"))] : []);
	}
	$("seal-glyphs").setAttribute("aria-label", `${$("seal-glyphs").querySelector(".connection-seal")?.getAttribute("aria-label") ?? "Connection seal"}. Compare both screens`);
	$("link-seal").hidden = !connected || !link?.seal || !$("link-seal").hasAttribute("data-expanded");
	if (!connected || !link?.seal) {
		$("link-seal").removeAttribute("data-expanded");
		$("seal-open").setAttribute("aria-expanded", "false");
	}
	renderFacts();
	app.classList.toggle("linked", connected);
	$("pair").hidden = false;
	surface.sync(connected && link?.seal ? [{
		id: "phone",
		name: link.device || "Phone",
		seal: link.seal
	}] : []);
	if (connected && link?.seal && !momentReady) surface.settle();
	showAsk(askEl, askFor(state.mode, connectedPhone(), state.answers, state.pcPermission), () => chips.find((c) => c.getAttribute("aria-checked") === "true")?.focus());
	const code = shownCode();
	const lanPhone = link?.pairs.find((p) => p.id === link.lanFor);
	const qr = $("qr");
	const qrKey = code.url || (status === "offline" ? "offline" : "");
	if (qrKey !== qrFor) {
		qrFor = qrKey;
		if (code.url) surface.setQr(brandedQrElement(code.url), qrDotPoints(code.url));
		else if (status === "offline") {
			const symbol = document.createElement("span");
			symbol.className = "qr-off";
			symbol.setAttribute("role", "img");
			symbol.setAttribute("aria-label", "No internet. Pairing code unavailable.");
			symbol.innerHTML = LINK_ICONS.cloudOff;
			surface.setPlaceholder(symbol);
		} else surface.loading();
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
	dotLoading(tabBtn, state.busy, "Applying tab permission");
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
	const waiting = view.kind === "connecting" || accessOf(state.answers, connectedPhone()?.key ?? "") === "ask";
	$("pc-title").classList.toggle("dot-wait-label", waiting);
	dotLoading($("pc-title").parentElement, waiting, title);
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
