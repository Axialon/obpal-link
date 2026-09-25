import { n as renderSVG } from "./dist-lkpp0okm.js";
import { C as isTargetMode, S as TARGET_MODES, a as parseLink, v as DEFAULT_MODE } from "./messages-Pseg0PpG.js";
//#region ../src/family/family.js
(function(global) {
	"use strict";
	if (global.BlackboxesFamily) return;
	var doc = global.document;
	var PRODUCTS = [
		{
			id: "ecosystem",
			name: "Blackboxes",
			category: "The ecosystem",
			host: "ecosystem.blackboxes.net",
			accent: "#7dd3fc"
		},
		{
			id: "boxem",
			name: "Box'em",
			category: "Projects & planning",
			host: "boxem.blackboxes.net",
			accent: "#38bdf8"
		},
		{
			id: "orbitem",
			name: "Orbit'em",
			category: "Cloud architecture",
			host: "orbitem.blackboxes.net",
			accent: "#22d3ee"
		},
		{
			id: "pulseem",
			name: "Pulse'em",
			category: "Training & recovery",
			host: "pulseem.blackboxes.net",
			accent: "#fb7185"
		},
		{
			id: "capem",
			name: "Cap'em",
			category: "Ownership & runway",
			host: "capem.blackboxes.net",
			accent: "#fcd34d"
		},
		{
			id: "synthem",
			name: "Synth'em",
			category: "Sound design",
			host: "synthem.blackboxes.net",
			accent: "#f0abfc"
		},
		{
			id: "balancem",
			name: "Balanc'em",
			category: "Resource balance",
			host: "balancem.blackboxes.net",
			accent: "#6ee7b7"
		},
		{
			id: "printem",
			name: "Print'em",
			category: "Making & printing",
			host: "printem.blackboxes.net",
			accent: "#ffa866"
		},
		{
			id: "wattem",
			name: "Watt'em",
			category: "Energy",
			host: "wattem.blackboxes.net",
			accent: "#7be2ae"
		},
		{
			id: "reachem",
			name: "Reach'em",
			category: "Growth & reach",
			host: "reachem.blackboxes.net",
			accent: "#ff9b99"
		},
		{
			id: "obpal",
			name: "ob.Pal",
			category: "Phone as a 3D remote",
			host: "obpal.blackboxes.net",
			accent: "#c6ff34"
		}
	];
	var THEMES = [
		{
			id: "carbon",
			name: "Carbon",
			page: "#0b0b0c",
			surface: "#1e1e20",
			light: false
		},
		{
			id: "navy",
			name: "Navy",
			page: "#070d17",
			surface: "#111d32",
			light: false
		},
		{
			id: "violet",
			name: "Violet",
			page: "#0c0717",
			surface: "#36255c",
			light: false
		},
		{
			id: "wine",
			name: "Wine ash",
			page: "#110c0f",
			surface: "#32292f",
			light: false
		},
		{
			id: "onyx",
			name: "Onyx",
			page: "#020202",
			surface: "#10151a",
			light: false
		},
		{
			id: "light",
			name: "Light",
			page: "#eef1f6",
			surface: "#ffffff",
			light: true
		}
	];
	var ACCENTS = [
		{
			id: "product",
			name: "Product colour"
		},
		{
			id: "lime",
			name: "Lime",
			color: "#c6ff34"
		},
		{
			id: "lavender",
			name: "Lavender",
			color: "#d2c3f6"
		},
		{
			id: "turquoise",
			name: "Turquoise",
			color: "#99e1d9"
		},
		{
			id: "candy",
			name: "Candy blue",
			color: "#b2d5e5"
		},
		{
			id: "sky",
			name: "Sky",
			color: "#38bdf8"
		},
		{
			id: "rose",
			name: "Rose",
			color: "#fb7185"
		},
		{
			id: "amber",
			name: "Amber",
			color: "#fcd34d"
		},
		{
			id: "mint",
			name: "Mint",
			color: "#6ee7b7"
		}
	];
	var DEFAULT_THEME = "carbon";
	var KEY = "bb_theme";
	var ACCENT_KEY = "bb_accent";
	var byId = function(list, id) {
		for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
		return null;
	};
	var esc = function(s) {
		return String(s).replace(/[&<>"']/g, function(c) {
			return "&#" + c.charCodeAt(0) + ";";
		});
	};
	var store = {
		get: function(k) {
			try {
				return global.localStorage.getItem(k);
			} catch (e) {
				return null;
			}
		},
		set: function(k, v) {
			try {
				global.localStorage.setItem(k, v);
			} catch (e) {}
		},
		sget: function(k) {
			try {
				return global.sessionStorage.getItem(k);
			} catch (e) {
				return null;
			}
		},
		sset: function(k, v) {
			try {
				global.sessionStorage.setItem(k, v);
			} catch (e) {}
		}
	};
	/** Registrable parent domain for the shared cookie (blackboxes.net or blackboxes.dev), or null elsewhere. */
	function parentDomain() {
		var h = global.location && global.location.hostname || "";
		var m = /(?:^|\.)(blackboxes\.(?:net|dev))$/.exec(h);
		return m ? m[1] : null;
	}
	function readCookie() {
		var m = /(?:^|;\s*)bb_theme=([a-z]+)/.exec(doc.cookie || "");
		return m ? m[1] : null;
	}
	function getTheme() {
		var t = readCookie() || store.get(KEY);
		return byId(THEMES, t) ? t : DEFAULT_THEME;
	}
	function applyTheme(id) {
		var t = byId(THEMES, id) ? id : getTheme();
		doc.documentElement.setAttribute("data-bb-theme", t);
		var meta = doc.querySelector("meta[name=\"theme-color\"]");
		if (meta) meta.setAttribute("content", byId(THEMES, t).page);
		return t;
	}
	function setTheme(id) {
		if (!byId(THEMES, id)) return getTheme();
		var d = parentDomain();
		var secure = global.location && global.location.protocol === "https:" ? "; Secure" : "";
		doc.cookie = KEY + "=" + id + "; Max-Age=31536000; Path=/; SameSite=Lax" + (d ? "; Domain=." + d : "") + secure;
		store.set(KEY, id);
		var prev = doc.documentElement.getAttribute("data-bb-theme");
		applyTheme(id);
		if (prev !== id) global.dispatchEvent(new CustomEvent("bb-theme", { detail: { theme: id } }));
		return id;
	}
	function watchTheme() {
		var sync = function() {
			var t = getTheme();
			if (t !== doc.documentElement.getAttribute("data-bb-theme")) {
				applyTheme(t);
				global.dispatchEvent(new CustomEvent("bb-theme", { detail: { theme: t } }));
			}
		};
		global.addEventListener("focus", sync);
		doc.addEventListener("visibilitychange", function() {
			if (!doc.hidden) sync();
		});
		global.addEventListener("storage", function(e) {
			if (e.key === KEY) sync();
		});
	}
	function setProduct(id) {
		if (byId(PRODUCTS, id)) doc.documentElement.setAttribute("data-bb-product", id);
	}
	function product() {
		return byId(PRODUCTS, doc.documentElement.getAttribute("data-bb-product")) || PRODUCTS[0];
	}
	function getAccent() {
		var a = store.get(ACCENT_KEY);
		return a && byId(ACCENTS, a) ? a : "product";
	}
	function applyAccent(id) {
		var a = id && byId(ACCENTS, id) ? id : getAccent();
		if (a === "product") doc.documentElement.removeAttribute("data-bb-accent");
		else doc.documentElement.setAttribute("data-bb-accent", a);
		return a;
	}
	function setAccent(id) {
		if (!byId(ACCENTS, id)) return getAccent();
		var prev = getAccent();
		if (id === "product") try {
			global.localStorage.removeItem(ACCENT_KEY);
		} catch (e) {}
		else store.set(ACCENT_KEY, id);
		applyAccent(id);
		if (prev !== id) global.dispatchEvent(new CustomEvent("bb-accent", { detail: { accent: id } }));
		return id;
	}
	/** The accent in effect as a hex colour (the product colour unless overridden). */
	function accentColor() {
		var a = byId(ACCENTS, getAccent());
		return a && a.color ? a.color : product().accent;
	}
	var markSeq = 0;
	/**
	* The family mark: an obsidian isometric cube whose lower faces and front edges catch the product's light.
	* ob.Pal adds its orbit ring and satellite (behind and in front of the cube). Returns an SVG string.
	* opts.accent overrides the colour (e.g. 'currentColor' is not supported; pass a hex).
	*/
	function mark(productId, opts) {
		opts = opts || {};
		var p = byId(PRODUCTS, productId) || PRODUCTS[0];
		var a = opts.accent || p.accent;
		var id = "bbm" + ++markSeq;
		var orbit = p.id === "obpal";
		var title = opts.title === false ? "" : "<title>" + esc(p.name) + "</title>";
		var ring = orbit ? "<ellipse cx=\"50\" cy=\"57\" rx=\"47\" ry=\"15\" transform=\"rotate(-14 50 57)\" fill=\"none\" stroke=\"" + a + "\" stroke-width=\"3\" opacity=\".32\"/>" : "";
		var front = orbit ? "<path d=\"M95.6 45.63 A47 15 -14 0 1 4.4 68.37\" fill=\"none\" stroke=\"" + a + "\" stroke-width=\"3.8\" stroke-linecap=\"round\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"4.8\" fill=\"" + a + "\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"1.8\" fill=\"#fff\"/>" : "";
		var g = orbit ? "<g>" : "<g transform=\"translate(50 50) scale(1.16) translate(-50 -49.8)\">";
		return "<svg class=\"bb-mark\" viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"" + esc(p.name) + "\" shape-rendering=\"geometricPrecision\">" + title + "<defs><linearGradient id=\"" + id + "t\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#565656\"/><stop offset=\".35\" stop-color=\"#2a2a2a\"/><stop offset=\".75\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"" + id + "l\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1d1d1d\"/><stop offset=\".45\" stop-color=\"#0a0a0a\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient><linearGradient id=\"" + id + "r\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#313131\"/><stop offset=\".5\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"" + id + "s\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\".42\" stop-color=\"" + a + "\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"" + a + "\" stop-opacity=\".5\"/></linearGradient></defs>" + ring + g + "<polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"#000\"/><polygon points=\"50,19 78,34.4 50,49.8 22,34.4\" fill=\"url(#" + id + "t)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#" + id + "l)\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#" + id + "r)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#" + id + "s)\" opacity=\".7\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#" + id + "s)\"/><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"none\" stroke=\"rgba(255,255,255,.4)\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M50,49.8 L50,80.6\" fill=\"none\" stroke=\"rgba(255,255,255,.3)\" stroke-width=\"1.3\"/><path d=\"M22,34.4 L50,49.8 L78,34.4\" fill=\"none\" stroke=\"" + a + "\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"rgba(255,255,255,.72)\" stroke-width=\"1.3\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"" + a + "\" stroke-width=\"1.4\" opacity=\".55\"/></g>" + front + "</svg>";
	}
	var ICON = {
		chevron: "<svg class=\"bb-ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg>",
		check: "<svg class=\"bb-ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg>"
	};
	var rgbOf = function(hex) {
		var n = parseInt(hex.slice(1), 16);
		return (n >> 16 & 255) + " " + (n >> 8 & 255) + " " + (n & 255);
	};
	/** Menu items linking to every product's home, current one marked. */
	function productMenu(current) {
		return PRODUCTS.map(function(p, i) {
			return (i === 1 ? "<div class=\"bb-label bb-menu-group\">Engines</div>" : i === PRODUCTS.length - 1 ? "<div class=\"bb-label bb-menu-group\">Tools</div>" : "") + "<a class=\"bb-menu-item\" role=\"menuitem\" href=\"https://" + p.host + "/\" style=\"--bb-item-rgb:" + rgbOf(p.accent) + "\"" + (p.id === current ? " aria-current=\"page\"" : "") + ">" + mark(p.id, { title: false }) + "<span><b style=\"color:" + p.accent + "\">" + esc(p.name) + "</b><small>" + esc(p.category) + "</small></span></a>";
		}).join("");
	}
	function themeMenu() {
		var cur = getTheme(), acc = getAccent(), own = product().accent;
		return "<div class=\"bb-label bb-menu-group\">Surface</div><div class=\"bb-themes\" role=\"radiogroup\" aria-label=\"Surface\">" + THEMES.map(function(t) {
			return "<button type=\"button\" class=\"bb-theme\" role=\"radio\" data-bb-theme-id=\"" + t.id + "\" aria-checked=\"" + (t.id === cur) + "\"><i style=\"background:linear-gradient(135deg," + t.surface + "," + t.page + ")\"></i>" + esc(t.name) + "</button>";
		}).join("") + "</div><div class=\"bb-label bb-menu-group\">Accent</div><div class=\"bb-accents\" role=\"radiogroup\" aria-label=\"Accent\">" + ACCENTS.filter(function(a) {
			return !a.color || a.color.toLowerCase() !== own.toLowerCase() || a.id === acc;
		}).map(function(a) {
			var label = a.id === "product" ? product().name + " colour (default)" : a.name;
			return "<button type=\"button\" class=\"bb-accent" + (a.id === "product" ? " product" : "") + "\" role=\"radio\" data-bb-accent-id=\"" + a.id + "\" aria-checked=\"" + (a.id === acc) + "\" aria-label=\"" + esc(label) + "\" data-tip=\"" + esc(label) + "\" style=\"--sw:" + (a.color || own) + "\">" + ICON.check + "</button>";
		}).join("") + "</div>";
	}
	var openMenus = [];
	function closeAll(except) {
		openMenus.slice().forEach(function(m) {
			if (m !== except) m.close();
		});
	}
	/**
	* Wire a button to a popover menu: toggles aria-expanded, closes on outside click or Escape, and places the
	* menu under the button (right-aligned when the button sits in the right half of the screen).
	*/
	function popover(button, menu, onOpen) {
		var api = {
			open: function() {
				closeAll(api);
				if (onOpen) onOpen(menu);
				menu.hidden = false;
				button.setAttribute("aria-expanded", "true");
				place();
				if (openMenus.indexOf(api) < 0) openMenus.push(api);
			},
			close: function() {
				menu.hidden = true;
				button.setAttribute("aria-expanded", "false");
				var i = openMenus.indexOf(api);
				if (i >= 0) openMenus.splice(i, 1);
			},
			toggle: function() {
				if (menu.hidden) api.open();
				else api.close();
			}
		};
		function place() {
			var r = button.getBoundingClientRect();
			menu.style.position = "fixed";
			menu.style.top = Math.round(r.bottom + 10) + "px";
			var w = menu.offsetWidth;
			var x = r.left + r.width / 2 > global.innerWidth / 2 ? r.right - w : r.left;
			menu.style.left = Math.round(Math.max(12, Math.min(x, global.innerWidth - w - 12))) + "px";
		}
		button.setAttribute("aria-haspopup", "true");
		button.setAttribute("aria-expanded", "false");
		menu.hidden = true;
		button.addEventListener("click", function(e) {
			e.stopPropagation();
			api.toggle();
		});
		menu.addEventListener("click", function(e) {
			e.stopPropagation();
		});
		global.addEventListener("resize", function() {
			if (!menu.hidden) place();
		});
		return api;
	}
	doc.addEventListener("click", function() {
		closeAll(null);
	});
	doc.addEventListener("keydown", function(e) {
		if (e.key === "Escape") closeAll(null);
	});
	function mountSwitcher(button, menu, current) {
		menu.setAttribute("role", "menu");
		return popover(button, menu, function(m) {
			if (!m.childElementCount) m.innerHTML = productMenu(current);
		});
	}
	function mountThemes(button, menu) {
		var api = popover(button, menu, function(m) {
			m.innerHTML = themeMenu();
		});
		menu.addEventListener("click", function(e) {
			var t = e.target.closest ? e.target.closest("[data-bb-theme-id]") : null;
			var a = e.target.closest ? e.target.closest("[data-bb-accent-id]") : null;
			if (t) setTheme(t.getAttribute("data-bb-theme-id"));
			else if (a) setAccent(a.getAttribute("data-bb-accent-id"));
			else return;
			menu.innerHTML = themeMenu();
		});
		return api;
	}
	/** Secondary tools (.bb-t2 inside toolsRoot) are mirrored as tiles in the More menu on narrow screens. */
	function mountMore(button, menu, toolsRoot) {
		return popover(button, menu, function(m) {
			m.innerHTML = "";
			toolsRoot.querySelectorAll(".bb-t2").forEach(function(src) {
				if (src.classList.contains("bb-sep")) return;
				var item = doc.createElement("button");
				item.type = "button";
				item.className = "bb-menu-item";
				item.setAttribute("role", "menuitem");
				item.innerHTML = src.innerHTML + "<span>" + esc(src.getAttribute("aria-label") || src.getAttribute("data-tip") || "") + "</span>";
				item.addEventListener("click", function() {
					src.click();
				});
				m.appendChild(item);
			});
		});
	}
	/** Keep a .bb-range's accent fill in step with its value. */
	function rangeFill(el) {
		var min = parseFloat(el.min || "0"), max = parseFloat(el.max || "100"), v = parseFloat(el.value);
		var p = max > min ? (v - min) / (max - min) * 100 : 0;
		el.style.setProperty("--fill", Math.max(0, Math.min(100, p)).toFixed(2) + "%");
	}
	function syncRanges(root) {
		(root || doc).querySelectorAll(".bb-range").forEach(rangeFill);
	}
	doc.addEventListener("input", function(e) {
		var t = e.target;
		if (t && t.classList && t.classList.contains("bb-range")) rangeFill(t);
	}, true);
	var tipEl = null;
	function initTips() {
		if (tipEl || !global.matchMedia || !global.matchMedia("(hover: hover)").matches) return;
		tipEl = doc.createElement("div");
		tipEl.className = "bb-tip";
		tipEl.setAttribute("role", "tooltip");
		doc.body.appendChild(tipEl);
		var timer = 0, warmUntil = 0, cur = null;
		function show(el) {
			var text = el.getAttribute("data-tip");
			if (!text) return;
			tipEl.textContent = text;
			var r = el.getBoundingClientRect();
			var side = el.getAttribute("data-tip-side") || (r.top < 90 ? "bottom" : "top");
			tipEl.style.left = "0px";
			tipEl.style.top = "0px";
			var w = tipEl.offsetWidth, h = tipEl.offsetHeight;
			var x = side === "right" ? r.right + 10 : r.left + r.width / 2 - w / 2;
			var y = side === "right" ? r.top + r.height / 2 - h / 2 : side === "bottom" ? r.bottom + 8 : r.top - h - 8;
			tipEl.style.left = Math.round(Math.max(8, Math.min(x, global.innerWidth - w - 8))) + "px";
			tipEl.style.top = Math.round(Math.max(8, y)) + "px";
			tipEl.setAttribute("data-on", "");
		}
		function hide() {
			clearTimeout(timer);
			if (tipEl.hasAttribute("data-on")) warmUntil = Date.now() + 400;
			tipEl.removeAttribute("data-on");
			cur = null;
		}
		doc.addEventListener("pointerover", function(e) {
			var el = e.target.closest ? e.target.closest("[data-tip]") : null;
			if (el === cur) return;
			hide();
			if (!el || e.pointerType === "touch") return;
			cur = el;
			timer = setTimeout(function() {
				show(el);
			}, Date.now() < warmUntil ? 0 : 320);
		});
		doc.addEventListener("pointerdown", hide, true);
		global.addEventListener("scroll", hide, true);
	}
	var hints = {};
	/** Show a hint once per session next to anchor() (an element getter), unless it was dismissed. */
	function hint(id, anchor, text, opts) {
		opts = opts || {};
		if (store.sget("bb.hint." + id) || hints[id]) return;
		setTimeout(function() {
			if (!anchor() || store.sget("bb.hint." + id)) return;
			var el = doc.createElement("div");
			el.className = "bb-hint";
			el.setAttribute("role", "status");
			el.innerHTML = "<span></span><button type=\"button\" aria-label=\"Dismiss\">&times;</button>";
			el.firstChild.textContent = text;
			el.lastChild.addEventListener("click", function() {
				dismissHint(id);
			});
			doc.body.appendChild(el);
			hints[id] = el;
			var place = function() {
				var t = anchor();
				if (!t) return dismissHint(id, true);
				var r = t.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
				var below = opts.place === "below" || opts.place !== "above" && r.top < global.innerHeight / 2;
				el.style.left = Math.round(Math.max(12, Math.min(r.left + r.width / 2 - w / 2, global.innerWidth - w - 12))) + "px";
				el.style.top = Math.round(below ? r.bottom + 12 : r.top - h - 12) + "px";
			};
			place();
			global.addEventListener("resize", place);
			el._place = place;
		}, opts.delay || 900);
	}
	function dismissHint(id, silent) {
		var el = hints[id];
		if (!silent) store.sset("bb.hint." + id, "1");
		if (!el) return;
		global.removeEventListener("resize", el._place);
		el.remove();
		delete hints[id];
	}
	global.BlackboxesFamily = {
		PRODUCTS,
		THEMES,
		ACCENTS,
		DEFAULT_THEME,
		getTheme,
		setTheme,
		applyTheme,
		watchTheme,
		setProduct,
		product,
		getAccent,
		setAccent,
		applyAccent,
		accentColor,
		mark,
		productMenu,
		themeMenu,
		popover,
		mountSwitcher,
		mountThemes,
		mountMore,
		initTips,
		hint,
		dismissHint,
		icons: ICON,
		rangeFill,
		syncRanges
	};
	if (doc && doc.documentElement) {
		applyTheme();
		applyAccent();
	}
})(typeof window !== "undefined" ? window : globalThis);
//#endregion
//#region ../src/family/index.ts
var family = window.BlackboxesFamily;
//#endregion
//#region ../src/ui/icons.ts
/** Stroke icon set shared by the phone controller and the viewer. Names double as the protocol's standard tray icon vocabulary. */
var s$1 = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
var ICONS = {
	rotate: s$1("<path d=\"M19.5 12a7.5 7.5 0 1 1-2.2-5.3\"/><path d=\"M19.5 4.5v4h-4\"/>"),
	point: s$1("<circle cx=\"12\" cy=\"12\" r=\"7.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.4\"/><path d=\"M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3\"/>"),
	tilt: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M3.6 10.6h6.2M14.2 10.6h6.2M12 14.2v6.3\"/>"),
	match: s$1("<path d=\"M12 3.2 19.8 7.6v8.8L12 20.8 4.2 16.4V7.6L12 3.2Z\"/><path d=\"M4.2 7.6 12 12l7.8-4.4M12 12v8.8\"/>"),
	gyro: s$1("<circle cx=\"12\" cy=\"12\" r=\"2.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"3.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"3.6\" ry=\"9\"/>"),
	center: s$1("<circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><path d=\"M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2\"/>"),
	settings: s$1("<path d=\"M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9\"/><circle cx=\"15\" cy=\"7.5\" r=\"2.2\"/><circle cx=\"9\" cy=\"16.5\" r=\"2.2\"/>"),
	models: s$1("<rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/>"),
	reset: s$1("<path d=\"M4.5 12a7.5 7.5 0 1 0 2.2-5.3\"/><path d=\"M4.5 4.5v4h4\"/>"),
	frame: s$1("<path d=\"M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15\"/>"),
	spin: s$1("<path d=\"M12 5.5c4.4 0 8 1.6 8 3.5s-3.6 3.5-8 3.5-8-1.6-8-3.5\"/><path d=\"M4 9v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V9\"/><path d=\"M7.5 3.8 4 5.5l1.8 3.3\"/>"),
	grid: s$1("<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M3.5 9.5h17M3.5 14.5h17M9.5 3.5v17M14.5 3.5v17\"/>"),
	glow: s$1("<path d=\"M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7Z\"/><path d=\"M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z\"/>"),
	upload: s$1("<path d=\"M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 19.5h14\"/>"),
	close: s$1("<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/>"),
	plus: s$1("<path d=\"M12 5.5v13M5.5 12h13\"/>"),
	arrange: s$1("<rect x=\"2.8\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/><rect x=\"9.5\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/><rect x=\"16.2\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/>"),
	solo: s$1("<rect x=\"8\" y=\"6.5\" width=\"8\" height=\"11\" rx=\"2.2\"/><path d=\"M3.6 9v6M20.4 9v6\" stroke-dasharray=\"1.6 2.2\"/>"),
	chevron: s$1("<path d=\"M7 10l5 5 5-5\"/>"),
	left: s$1("<path d=\"M14.5 6.5 9 12l5.5 5.5\"/>"),
	right: s$1("<path d=\"M9.5 6.5 15 12l-5.5 5.5\"/>"),
	phone: s$1("<rect x=\"7\" y=\"2.8\" width=\"10\" height=\"18.4\" rx=\"2.8\"/><path d=\"M10.5 18h3\"/>"),
	more: s$1("<circle cx=\"5.5\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"18.5\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/>"),
	open: s$1("<path d=\"M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4\"/>"),
	orbit: s$1("<circle cx=\"12\" cy=\"12\" r=\"3\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9.5\" ry=\"4\" transform=\"rotate(-25 12 12)\"/>"),
	diamond: s$1("<path d=\"M7 4h10l4 5-9 11L3 9l4-5Z\"/><path d=\"M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5\"/>"),
	matrix: s$1("<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01\" stroke-width=\"2.6\"/>"),
	cube: s$1("<path d=\"M12 3.2 19.8 7.6v8.8L12 20.8 4.2 16.4V7.6L12 3.2Z\"/><path d=\"M4.2 7.6 12 12l7.8-4.4M12 12v8.8\"/>"),
	folder: s$1("<path d=\"M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7H9l1.9 2h7.9a1.7 1.7 0 0 1 1.7 1.7v8.1a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z\"/><path d=\"M3.5 10.5h17\"/>"),
	drag: s$1("<circle cx=\"9\" cy=\"12\" r=\"2.6\"/><path d=\"M13.5 12h7M18 9l3 3-3 3\"/>"),
	pan: s$1("<circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"11.5\" cy=\"12\" r=\"2.2\"/><path d=\"M15.5 12h5M18 9.5l2.5 2.5-2.5 2.5\"/>"),
	pinch: s$1("<path d=\"M4 4l5 5M4 4v4M4 4h4M20 20l-5-5M20 20v-4M20 20h-4\"/>"),
	twist: s$1("<path d=\"M18.5 8.5A7.5 7.5 0 1 0 19.5 13\"/><path d=\"M19.5 4.5v4h-4\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/>"),
	sun: s$1("<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6\"/>"),
	heart: s$1("<path d=\"M12 20.2s-7.3-4.4-8.9-9A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.9 4.8c-1.6 4.6-8.9 9-8.9 9Z\"/>"),
	palette: s$1("<path d=\"M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.8 1.9-1.7 0-1.2-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1a3.7 3.7 0 0 0 3.7-3.7C20.5 6.9 16.7 3.5 12 3.5Z\"/><circle cx=\"7.8\" cy=\"11\" r=\"1.1\" fill=\"currentColor\"/><circle cx=\"10.5\" cy=\"7.4\" r=\"1.1\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"7.6\" r=\"1.1\" fill=\"currentColor\"/>"),
	tap: s$1("<circle cx=\"12\" cy=\"9\" r=\"3\"/><path d=\"M12 14v6M7.5 6.5a6 6 0 0 1 9 0\"/>"),
	gamepad: s$1("<path d=\"M7.2 6.8h9.6c2 0 3.7 1.4 4.1 3.3l1 4.9c.4 1.9-1 3.6-2.9 3.6-.9 0-1.7-.4-2.3-1.1L15.3 16H8.7l-1.4 1.5c-.6.7-1.4 1.1-2.3 1.1-1.9 0-3.3-1.7-2.9-3.6l1-4.9c.4-1.9 2.1-3.3 4.1-3.3Z\"/><path d=\"M7.6 9.9v3.6M5.8 11.7h3.6\"/><circle cx=\"15.6\" cy=\"10.6\" r=\".9\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"12.7\" r=\".9\" fill=\"currentColor\"/>"),
	view: s$1("<rect x=\"3.5\" y=\"5.5\" width=\"11\" height=\"9\" rx=\"2\"/><path d=\"M17.5 9.5h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-.5\"/>"),
	menu: s$1("<path d=\"M5 7.5h14M5 12h14M5 16.5h14\"/>"),
	guide: s$1("<path d=\"M4.5 11.2 12 4.8l7.5 6.4\"/><path d=\"M6.8 9.6v8.2A1.2 1.2 0 0 0 8 19h8a1.2 1.2 0 0 0 1.2-1.2V9.6\"/><path d=\"M10.2 19v-4.2h3.6V19\"/>")
};
var markSeq = 0;
/**
* The ob.Pal mark: an obsidian isometric box (built like the Blackboxes cube: faceted gradients,
* hairline seams, a lit top edge) with an accent orbit wrapped around it and a satellite, the "." of ob.Pal.
* The ring and satellite take the theme accent; a scan line sweeps the box on hover.
*/
function logoMark() {
	const id = `obm${++markSeq}`;
	const A = "var(--accent, #C6FF34)";
	const ring = "M95.6 45.63 A47 15 -14 0 1 4.4 68.37";
	const orbit = "M95.6 45.63 A47 15 -14 0 1 4.4 68.37 A47 15 -14 0 1 95.6 45.63";
	const sat = (glow) => `<g><animateMotion dur="7.5s" repeatCount="indefinite" calcMode="linear"><mpath href="#${id}-orbit"/></animateMotion>${glow ? `<circle r="6.5" style="fill:${A}" opacity=".45" filter="url(#${id}-soft)"/>` : ""}<circle r="3.7" style="fill:${A}"/><circle r="1.4" fill="#fff"/></g>`;
	return `<svg class="mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false" shape-rendering="geometricPrecision">
  <defs>
    <linearGradient id="${id}-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4b4b4b"/><stop offset=".35" stop-color="#262626"/><stop offset=".75" stop-color="#131313"/><stop offset="1" stop-color="#050505"/></linearGradient>
    <linearGradient id="${id}-left" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b1b1b"/><stop offset=".45" stop-color="#0a0a0a"/><stop offset="1" stop-color="#000"/></linearGradient>
    <linearGradient id="${id}-right" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2c2c2c"/><stop offset=".5" stop-color="#121212"/><stop offset="1" stop-color="#040404"/></linearGradient>
    <linearGradient id="${id}-ring" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:${A};stop-opacity:.6"/><stop offset=".55" style="stop-color:${A}"/><stop offset="1" style="stop-color:var(--accent-soft, #E6FFA3)"/></linearGradient>
    <linearGradient id="${id}-spill" x1="0" y1="0" x2="0" y2="1"><stop offset=".42" style="stop-color:${A};stop-opacity:0"/><stop offset="1" style="stop-color:${A};stop-opacity:.24"/></linearGradient>
    <clipPath id="${id}-box"><polygon points="50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4"/></clipPath>
    <clipPath id="${id}-front"><polygon points="0,69.47 100,44.53 100,100 0,100"/></clipPath>
    <path id="${id}-orbit" d="${orbit}"/>
    <filter id="${id}-soft" filterUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <ellipse cx="50" cy="57" rx="47" ry="15" transform="rotate(-14 50 57)" fill="none" style="stroke:${A}" stroke-width="1.8" opacity=".3"/>
  <g opacity=".8">${sat(false)}</g>
  <polygon points="50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4" fill="#000"/>
  <polygon points="50,19 78,34.4 50,49.8 22,34.4" fill="url(#${id}-top)"/>
  <polygon points="22,34.4 50,49.8 50,80.6 22,65.2" fill="url(#${id}-left)"/>
  <polygon points="50,49.8 78,34.4 78,65.2 50,80.6" fill="url(#${id}-right)"/>
  <polygon points="22,34.4 50,49.8 50,80.6 22,65.2" fill="url(#${id}-spill)" opacity=".7"/>
  <polygon points="50,49.8 78,34.4 78,65.2 50,80.6" fill="url(#${id}-spill)"/>
  <g clip-path="url(#${id}-box)"><g class="mark-scan"><line x1="0" y1="24" x2="100" y2="24" style="stroke:${A}" stroke-width="6" filter="url(#${id}-soft)" opacity=".8"/><line x1="0" y1="24" x2="100" y2="24" stroke="#fff" stroke-width="1.4"/></g></g>
  <polygon points="50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M22,34.4 L50,49.8 L78,34.4 M50,49.8 L50,80.6" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2" stroke-linejoin="round"/>
  <line x1="50" y1="19" x2="78" y2="34.4" stroke="rgba(255,255,255,.66)" stroke-width="1.1" stroke-linecap="round"/>
  <path d="${ring}" fill="none" style="stroke:${A}" stroke-width="6" stroke-linecap="round" opacity=".35" filter="url(#${id}-soft)"/>
  <path d="${ring}" fill="none" stroke="url(#${id}-ring)" stroke-width="2.8" stroke-linecap="round"/>
  <g clip-path="url(#${id}-front)">${sat(true)}</g>
</svg>`;
}
/** Lockup: the mark with the ob.Pal wordmark (quiet "ob", accent full stop, bold "Pal"). */
var LOGO_WORD = "<span class=\"word\"><span class=\"ob\">ob</span><span class=\"pt\">.</span><b>Pal</b></span>";
var logo = () => `${logoMark()}${LOGO_WORD}`;
//#endregion
//#region src/popup/icons.ts
/** Popup-only glyphs in the same 24px stroke style as src/ui/icons.ts (which supplies the rest). */
var s = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
var LINK_ICONS = {
	gamepad: s("<path d=\"M7.2 7.2h9.6a4.2 4.2 0 0 1 4.1 3.4l.9 4.6a2.5 2.5 0 0 1-4.3 2.2l-2.1-2.3H8.6l-2.1 2.3a2.5 2.5 0 0 1-4.3-2.2l.9-4.6a4.2 4.2 0 0 1 4.1-3.4Z\"/><path d=\"M7.8 9.9v3.2M6.2 11.5h3.2\"/><path d=\"M15.4 10.4h.01M17.4 12.4h.01\" stroke-width=\"2.6\"/>"),
	keys: s("<rect x=\"2.8\" y=\"6\" width=\"18.4\" height=\"12\" rx=\"2.6\"/><path d=\"M6.6 9.6h.01M9.8 9.6h.01M13 9.6h.01M16.2 9.6h.01M6.6 12.4h.01M17.4 12.4h.01\" stroke-width=\"2.4\"/><path d=\"M9 14.9h6\"/>"),
	globe: s("<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M3.4 12h17.2\"/><path d=\"M12 3.4c2.3 2.3 3.4 5.2 3.4 8.6s-1.1 6.3-3.4 8.6c-2.3-2.3-3.4-5.2-3.4-8.6s1.1-6.3 3.4-8.6Z\"/>"),
	tab: s("<rect x=\"3.2\" y=\"4.6\" width=\"17.6\" height=\"14.8\" rx=\"2.6\"/><path d=\"M3.2 9h17.6\"/><path d=\"M6.4 6.8h.01M8.9 6.8h.01\" stroke-width=\"2.3\"/>")
};
//#endregion
//#region src/popup/popup.ts
/**
* Popup: the ob.Pal lockup, the pairing QR (or the connected phone), and three controls: control this tab,
* what the phone drives (Controller / 3D / Keys), and the optional "All sites" permission.
* It renders from storage (written by the service worker) and asks the worker to change things.
*/
family.setProduct("obpal");
var ALL_SITES = { origins: ["<all_urls>"] };
var MODES = {
	gamepad: {
		label: "Controller",
		icon: LINK_ICONS.gamepad,
		title: "Controller: a virtual gamepad for Gamepad API games"
	},
	viewer: {
		label: "3D",
		icon: ICONS.cube,
		title: "3D viewer: drag to rotate, pan and zoom"
	},
	keys: {
		label: "Keys",
		icon: LINK_ICONS.keys,
		title: "Keys: WASD, arrows, action keys and mouse"
	}
};
var STATUS = {
	starting: "Starting",
	ready: "Ready",
	connecting: "Connecting",
	connected: "Connected",
	offline: "Offline"
};
var state = {
	link: null,
	tab: null,
	mode: DEFAULT_MODE,
	allSites: false,
	current: null,
	busy: false,
	notice: null
};
var app = document.getElementById("app");
app.innerHTML = `
  <header class="bar">
    <span class="logo" aria-label="ob.Pal">${logo()}</span>
    <span class="tag">Link</span>
    <span class="status" id="status" role="status"><i aria-hidden="true"></i><span id="status-t"></span></span>
  </header>
  <section class="pair glass" aria-label="Phone">
    <div class="scan" id="scan">
      <div class="qr" id="qr" role="img" aria-label="Pairing QR code"></div>
      <p class="scan-hint">${ICONS.phone}<span>Scan with your phone</span></p>
    </div>
    <div class="device" id="device" hidden>
      <span class="device-ic">${ICONS.phone}</span>
      <span class="device-t"><b id="device-name"></b><small>Connected</small></span>
      <button class="icon-btn" id="unpair" type="button" title="Disconnect" aria-label="Disconnect the phone">${ICONS.close}</button>
    </div>
  </section>
  <section class="panel glass">
    <button class="row" id="tab" type="button" role="switch" aria-checked="false" title="Let the phone control this tab">
      <span class="row-ic">${LINK_ICONS.tab}</span>
      <span class="row-t"><b>This tab</b><small id="tab-host"></small></span>
      <span class="sw" aria-hidden="true"><i></i></span>
    </button>
    <div class="chips" role="radiogroup" aria-label="What the phone controls">
      ${TARGET_MODES.map((m) => `<button class="chip" type="button" role="radio" aria-checked="false" data-mode="${m}" title="${MODES[m].title}">${MODES[m].icon}<span>${MODES[m].label}</span></button>`).join("")}
    </div>
    <button class="row" id="all" type="button" role="switch" aria-checked="false" title="Reach game frames hosted on other sites, and keep control across navigation">
      <span class="row-ic">${LINK_ICONS.globe}</span>
      <span class="row-t"><b>All sites</b><small>Frames from other sites</small></span>
      <span class="sw" aria-hidden="true"><i></i></span>
    </button>
    <p class="note" id="note" role="alert" hidden></p>
  </section>`;
var $ = (id) => document.getElementById(id);
var tabBtn = $("tab");
var allBtn = $("all");
var chips = [...app.querySelectorAll(".chip")];
var qrFor = null;
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
function render() {
	const status = state.link?.status ?? "starting";
	$("status").dataset.s = status;
	$("status-t").textContent = STATUS[status];
	const connected = status === "connected";
	$("scan").hidden = connected;
	$("device").hidden = !connected;
	$("device-name").textContent = state.link?.device || "Phone";
	const url = state.link?.url ?? "";
	if (!connected && url !== qrFor) {
		qrFor = url;
		$("qr").innerHTML = url ? renderSVG(url, {
			ecc: "M",
			border: 1,
			blackColor: "#0a0a0a",
			whiteColor: "#ffffff"
		}) : "<span class=\"qr-wait\"></span>";
	}
	const cur = state.current;
	const can = scriptable(cur?.url);
	tabBtn.setAttribute("aria-checked", String(cur?.id !== void 0 && state.tab === cur.id));
	tabBtn.setAttribute("aria-busy", String(state.busy));
	tabBtn.disabled = state.busy || !can;
	$("tab-host").textContent = can ? hostOf(cur?.url) : "Not available on this page";
	for (const c of chips) c.setAttribute("aria-checked", String(c.dataset.mode === state.mode));
	allBtn.setAttribute("aria-checked", String(state.allSites));
	const note = $("note");
	note.hidden = !state.notice;
	note.replaceChildren();
	if (state.notice) {
		const { text, action } = state.notice;
		note.append(text);
		if (action) {
			const b = document.createElement("button");
			b.type = "button";
			b.textContent = action.label;
			b.onclick = action.run;
			note.append(" ", b);
		}
	}
}
var send = (m) => chrome.runtime.sendMessage(m).catch((e) => ({
	ok: false,
	error: String(e)
}));
var isOk = (r) => typeof r === "object" && r !== null && r.ok === true;
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
	state.mode = mode;
	render();
	send({
		to: "bg",
		type: "mode",
		mode
	});
});
allBtn.addEventListener("click", () => {
	state.notice = null;
	if (!state.allSites) {
		chrome.permissions.request(ALL_SITES).then((granted) => {
			state.allSites = granted;
			render();
		}, () => render());
		return;
	}
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
		if (changes.link) state.link = parseLink(changes.link.newValue);
	} else if (area === "local" && changes.mode && isTargetMode(changes.mode.newValue)) state.mode = changes.mode.newValue;
	render();
});
var refreshAllSites = async () => {
	state.allSites = await chrome.permissions.contains(ALL_SITES);
	render();
};
chrome.permissions.onAdded.addListener(() => void refreshAllSites());
chrome.permissions.onRemoved.addListener(() => void refreshAllSites());
async function init() {
	render();
	send({
		to: "bg",
		type: "ensure"
	});
	const [tabs, session, local, allSites] = await Promise.all([
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}),
		chrome.storage.session.get(["tab", "link"]),
		chrome.storage.local.get("mode"),
		chrome.permissions.contains(ALL_SITES)
	]);
	state.current = tabs[0] ?? null;
	state.tab = typeof session.tab === "number" ? session.tab : null;
	state.link = parseLink(session.link);
	state.mode = isTargetMode(local.mode) ? local.mode : DEFAULT_MODE;
	state.allSites = allSites;
	render();
}
init();
//#endregion
