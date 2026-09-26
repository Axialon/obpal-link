(function() {
	//#region src/shared/constants.ts
	/** Name of the runtime.connect() port a page bridge opens to the offscreen link. */
	var PORT_NAME = "obpal-link/page";
	/** window.postMessage channel id shared by the isolated-world bridge and the MAIN-world page script. */
	var CHANNEL = "obpal-link/v1";
	new TextEncoder();
	//#endregion
	//#region ../packages/core/src/catalogue.ts
	var Utility = {
		pad: "pad",
		aim: "motion.aim",
		steer: "motion.steer",
		point: "motion.point",
		trackpad: "touch.trackpad",
		hold: "motion.hold",
		tilt: "motion.tilt"
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
	//#endregion
	//#region src/shared/math.ts
	/** Small numeric helpers shared by the key and 3D mappers. Pure. */
	var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
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
	var RUMBLE_MAX_MS = 5e3;
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
	var isPointerTuple = (x) => tuple(x, 5) && within(x[0], -400, 400) && within(x[1], -400, 400) && Number.isInteger(x[2]) && within(x[2], 0, 255) && Number.isInteger(x[3]) && within(x[3], 0, 255) && Number.isInteger(x[4]) && within(x[4], 0, 3);
	/** Validate an input frame and return a clean copy (unknown fields dropped), or null. */
	function parseInputFrame(x) {
		if (!isObj(x) || x.t !== "in") return null;
		const { m, dt, p, d, tl, pt } = x;
		if (m !== 0 && m !== 1 && m !== 2 || !within(dt, 0, 1e3)) return null;
		if (p !== null && !isPadTuple(p)) return null;
		if (d !== null && !isDeltaTuple(d)) return null;
		if (tl !== null && !isTilt(tl)) return null;
		if (pt !== void 0 && pt !== null && !isPointerTuple(pt)) return null;
		const f = {
			t: "in",
			m,
			dt,
			p: p ? [...p] : null,
			d: d ? [...d] : null,
			tl: tl ? [tl[0], tl[1]] : null
		};
		if (pt) f.pt = [...pt];
		return f;
	}
	function parseToPage(x) {
		if (isObj(x) && (x.t === "rel" || x.t === "off")) return { t: x.t };
		return parseInputFrame(x);
	}
	/** Clamp a rumble request to sane ranges: magnitudes 0..1, at most RUMBLE_MAX_MS. Non-numbers are rejected. */
	function sanitizeRumble(s, w, ms) {
		if (!fin(s) || !fin(w) || !fin(ms)) return null;
		return {
			t: "rumble",
			s: clamp(s, 0, 1),
			w: clamp(w, 0, 1),
			ms: Math.round(clamp(ms, 0, RUMBLE_MAX_MS))
		};
	}
	var envelope = (sid, dir, m) => ({
		ch: CHANNEL,
		sid,
		dir,
		m
	});
	/** Read a page -> bridge envelope. 'loaded' may carry any sid; the bridge checks the sid of everything else. */
	function readUp(data) {
		if (!isObj(data) || data.ch !== "obpal-link/v1" || data.dir !== "up" || typeof data.sid !== "string" || data.sid.length > 64 || !isObj(data.m)) return null;
		const m = data.m;
		if ((m.t === "loaded" || m.t === "ready") && Number.isInteger(m.v)) return {
			sid: data.sid,
			m: {
				t: m.t,
				v: m.v
			}
		};
		if (m.t === "rumble") {
			const r = sanitizeRumble(m.s, m.w, m.ms);
			return r ? {
				sid: data.sid,
				m: r
			} : null;
		}
		return null;
	}
	function parseBridgeRequest(x) {
		return isObj(x) && x.to === "bridge" && (x.type === "activate" || x.type === "deactivate" || x.type === "reconnect") ? {
			to: "bridge",
			type: x.type
		} : null;
	}
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
	/** The focused element, looking inside open shadow roots. */
	function deepActiveElement() {
		let el = document.activeElement;
		for (let i = 0; el?.shadowRoot?.activeElement && i < 16; i++) el = el.shadowRoot.activeElement;
		return el;
	}
	/** Focus sits on a child frame's element, so that frame (not this one) receives the keys. */
	var isFrameElement = (el) => !!el && (el.tagName === "IFRAME" || el.tagName === "FRAME");
	/**
	* Visible child frames from another site. The bridge here can't reach into them, and without "All sites" the
	* extension can't either, so a game hosted in one (itch.io and most embeds) would get no input.
	*/
	function foreignFrames() {
		let count = 0;
		let host = "";
		let area = 0;
		for (const f of document.querySelectorAll("iframe, frame")) {
			let reachable = false;
			try {
				reachable = !!f.contentDocument;
			} catch {}
			if (reachable) continue;
			const rect = visibleRect(f);
			if (!rect) continue;
			count++;
			const a = rect.width * rect.height;
			if (a > area) {
				area = a;
				try {
					host = new URL(f.src || "about:blank", location.href).host;
				} catch {
					host = "";
				}
			}
		}
		return {
			count,
			host,
			area
		};
	}
	//#endregion
	//#region src/content/bridge.ts
	/**
	* Isolated-world bridge, one per frame of the controlled tab (injected by the service worker).
	*
	* - Asks the service worker whether this tab is controlled; if so, the worker injects the MAIN-world page
	*   script into this frame, and the bridge opens a runtime port to the offscreen link.
	* - Relays input frames from the port to the page script with window.postMessage on CHANNEL, tagged with a
	*   random per-instance session id, and accepts only same-window, same-origin replies (rumble).
	* - Reports this frame's focus and largest 3D canvas, so the link sends keys and drags to the right frame.
	*/
	function startBridge() {
		const sid = randomSid();
		const targetOrigin = /^https?:$/.test(location.protocol) ? location.origin : "*";
		let active = false;
		let dead = false;
		let port = null;
		let retryMs = 250;
		let retryTimer;
		let reportTimer;
		let rescanTimer;
		let lastReport = "";
		let lastFrames = "";
		const frames = new MutationObserver((records) => {
			for (const r of records) for (const n of r.addedNodes) if (n instanceof Element && (isFrameElement(n) || n.getElementsByTagName("iframe").length)) return rescan();
		});
		const alive = () => {
			if (dead) return false;
			try {
				return !!chrome.runtime?.id;
			} catch {
				return false;
			}
		};
		const toMain = (m) => window.postMessage(envelope(sid, "down", m), targetOrigin);
		const send = (m) => {
			try {
				port?.postMessage(m);
			} catch {}
		};
		function onWindowMessage(e) {
			if (e.source !== window || e.origin !== location.origin) return;
			const msg = readUp(e.data);
			if (!msg) return;
			if (!alive()) return teardown();
			if (!active) return;
			if (msg.m.t === "loaded") toMain({ t: "hello" });
			else if (msg.m.t === "rumble" && msg.sid === sid) send(msg.m);
		}
		function onRuntimeMessage(raw, sender) {
			if (sender.id !== chrome.runtime.id) return;
			const req = parseBridgeRequest(raw);
			if (!req) return;
			if (req.type === "deactivate") deactivate();
			else hello();
		}
		async function hello() {
			if (!alive()) return teardown();
			let res;
			try {
				res = await chrome.runtime.sendMessage({
					to: "bg",
					type: "hello"
				});
			} catch {
				return;
			}
			if (typeof res === "object" && res !== null && res.active === true) activate();
			else deactivate();
		}
		function activate() {
			if (!active) {
				active = true;
				addEventListener("focus", report, true);
				addEventListener("blur", report, true);
				addEventListener("resize", report);
				document.addEventListener("focusin", report, true);
				document.addEventListener("visibilitychange", report);
				document.addEventListener("pointerlockchange", report);
				addEventListener("load", onLoadCapture, true);
				frames.observe(document, {
					childList: true,
					subtree: true
				});
				reportTimer = setInterval(report, 700);
			}
			toMain({ t: "hello" });
			connect();
		}
		function connect() {
			if (port || !active) return;
			if (!alive()) return teardown();
			let p;
			try {
				p = chrome.runtime.connect({ name: PORT_NAME });
			} catch {
				return retry();
			}
			port = p;
			lastReport = "";
			p.onMessage.addListener((raw) => {
				retryMs = 250;
				const m = parseToPage(raw);
				if (m) toMain(m);
			});
			p.onDisconnect.addListener(() => {
				chrome.runtime.lastError;
				if (port === p) port = null;
				toMain({ t: "rel" });
				retry();
			});
			report();
		}
		function retry() {
			clearTimeout(retryTimer);
			if (!active || !alive()) return;
			retryTimer = setTimeout(connect, retryMs);
			retryMs = Math.min(retryMs * 2, 5e3);
		}
		function deactivate() {
			if (!active) return;
			active = false;
			lastFrames = "";
			clearTimeout(retryTimer);
			clearInterval(reportTimer);
			clearTimeout(rescanTimer);
			removeEventListener("focus", report, true);
			removeEventListener("blur", report, true);
			removeEventListener("resize", report);
			document.removeEventListener("focusin", report, true);
			document.removeEventListener("visibilitychange", report);
			document.removeEventListener("pointerlockchange", report);
			removeEventListener("load", onLoadCapture, true);
			frames.disconnect();
			toMain({ t: "off" });
			const p = port;
			port = null;
			try {
				p?.disconnect();
			} catch {}
		}
		/** The extension was reloaded or removed: this copy can never reach it again, so let the page go. */
		function teardown() {
			deactivate();
			dead = true;
			removeEventListener("message", onWindowMessage, true);
			try {
				chrome.runtime.onMessage.removeListener(onRuntimeMessage);
			} catch {}
		}
		function report() {
			reportFrames();
			if (!port) return;
			const view = largestView();
			const rep = {
				t: "rep",
				focus: document.hasFocus() && !isFrameElement(deepActiveElement()),
				area: Math.round(view?.area ?? 0),
				lock: !!document.pointerLockElement
			};
			const key = `${rep.focus}|${Math.round(rep.area / 1e3)}|${rep.lock}`;
			if (key === lastReport) return;
			lastReport = key;
			send(rep);
		}
		/**
		* Top frame only: tell the service worker about visible frames from other sites, so the popup can offer
		* "All sites" when the game lives in one. Sent when the picture changes.
		*/
		function reportFrames() {
			if (!active || window.top !== window) return;
			const f = foreignFrames();
			const view = largestView();
			const big = f.area > .15 * innerWidth * innerHeight && f.area > (view?.area ?? 0);
			const key = `${f.count}|${f.host}|${big}`;
			if (key === lastFrames) return;
			lastFrames = key;
			chrome.runtime.sendMessage({
				to: "bg",
				type: "frames",
				count: f.count,
				host: f.host,
				big
			}).catch(() => {});
		}
		function onLoadCapture(e) {
			if (e.target instanceof Element && isFrameElement(e.target)) rescan();
		}
		function rescan() {
			clearTimeout(rescanTimer);
			rescanTimer = setTimeout(() => {
				if (active && alive()) chrome.runtime.sendMessage({
					to: "bg",
					type: "rescan"
				}).catch(() => {});
			}, 400);
		}
		addEventListener("message", onWindowMessage, true);
		chrome.runtime.onMessage.addListener(onRuntimeMessage);
		hello();
		return {
			alive,
			poke: () => void hello()
		};
	}
	function randomSid() {
		return Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	}
	var KEY = "__obpalLinkBridge";
	var scope = globalThis;
	var previous = scope[KEY];
	if (previous?.alive()) previous.poke();
	else scope[KEY] = startBridge();
	//#endregion
})();
