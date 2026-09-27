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
	/**
	* Menu items linking to every product's home, current one marked. A site can give its own link for a product
	* (`opts.href(product)`: a local preview, a .dev alias) and a class for each item (`opts.itemClass`).
	*/
	function productMenu(current, opts) {
		opts = opts || {};
		var href = function(p) {
			return (typeof opts.href === "function" ? opts.href(p) : "") || "https://" + p.host + "/";
		};
		var cls = "bb-menu-item" + (opts.itemClass ? " " + opts.itemClass : "");
		return PRODUCTS.map(function(p, i) {
			return (i === 1 ? "<div class=\"bb-label bb-menu-group\">Engines</div>" : i === PRODUCTS.length - 1 ? "<div class=\"bb-label bb-menu-group\">Tools</div>" : "") + "<a class=\"" + cls + "\" role=\"menuitem\" href=\"" + esc(href(p)) + "\" style=\"--bb-item-rgb:" + rgbOf(p.accent) + "\"" + (p.id === current ? " aria-current=\"page\"" : "") + ">" + mark(p.id, { title: false }) + "<span><b style=\"color:" + p.accent + "\">" + esc(p.name) + "</b><small>" + esc(p.category) + "</small></span></a>";
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
	var menuSeq = 0;
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
			var top = Math.round(r.bottom + 10);
			menu.style.position = "fixed";
			menu.style.top = top + "px";
			menu.style.maxHeight = Math.max(160, global.innerHeight - top - 12) + "px";
			menu.style.overflowY = "auto";
			var w = menu.offsetWidth;
			var x = r.left + r.width / 2 > global.innerWidth / 2 ? r.right - w : r.left;
			menu.style.left = Math.round(Math.max(12, Math.min(x, global.innerWidth - w - 12))) + "px";
		}
		function items() {
			return Array.prototype.slice.call(menu.querySelectorAll("a[href],button:not([disabled])"));
		}
		function focusItem(i) {
			var list = items();
			if (list.length) list[(i + list.length) % list.length].focus();
		}
		button.setAttribute("aria-haspopup", "true");
		button.setAttribute("aria-expanded", "false");
		if (!menu.id) menu.id = "bb-menu-" + ++menuSeq;
		button.setAttribute("aria-controls", menu.id);
		menu.hidden = true;
		button.addEventListener("click", function(e) {
			e.stopPropagation();
			api.toggle();
		});
		button.addEventListener("keydown", function(e) {
			if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
			e.preventDefault();
			if (menu.hidden) api.open();
			focusItem(e.key === "ArrowDown" ? 0 : -1);
		});
		menu.addEventListener("keydown", function(e) {
			var i = items().indexOf(doc.activeElement);
			if (e.key === "ArrowDown") {
				e.preventDefault();
				focusItem(i + 1);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				focusItem(i - 1);
			} else if (e.key === "Home") {
				e.preventDefault();
				focusItem(0);
			} else if (e.key === "End") {
				e.preventDefault();
				focusItem(-1);
			} else if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				api.close();
				button.focus();
			}
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
		if (e.key !== "Escape" || !openMenus.length) return;
		var owner = doc.activeElement;
		closeAll(null);
		if (owner && owner.focus) owner.focus();
	});
	function mountSwitcher(button, menu, current, opts) {
		menu.setAttribute("role", "menu");
		return popover(button, menu, function(m) {
			if (!m.childElementCount) m.innerHTML = productMenu(current, opts);
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
	/** The filled share (0 to 1) of a slider at `value` between `min` and `max`: clamped, and empty for an empty range. */
	function rangeShare(value, min, max) {
		if (!(max > min) || value !== value) return 0;
		return value <= min ? 0 : value >= max ? 1 : (value - min) / (max - min);
	}
	/** A range input's bound: its attribute as a number, else the HTML default (min 0, max 100). */
	function bound(attr, fallback) {
		var n = parseFloat(attr);
		return isFinite(n) ? n : fallback;
	}
	/** Keep a .bb-range's accent fill in step with its value. */
	function rangeFill(el) {
		el.style.setProperty("--fill", (rangeShare(parseFloat(el.value), bound(el.min, 0), bound(el.max, 100)) * 100).toFixed(2) + "%");
		watchRange(el);
	}
	function syncRanges(root) {
		(root || doc).querySelectorAll(".bb-range").forEach(rangeFill);
	}
	var inputProto = global.HTMLInputElement && global.HTMLInputElement.prototype;
	var valueDesc = inputProto && Object.getOwnPropertyDescriptor(inputProto, "value");
	var numberDesc = inputProto && Object.getOwnPropertyDescriptor(inputProto, "valueAsNumber");
	function watchRange(el) {
		if (el._bbRange || !valueDesc || el.type !== "range") return;
		el._bbRange = true;
		var refill = function(desc) {
			return {
				configurable: true,
				enumerable: true,
				get: desc.get,
				set: function(v) {
					desc.set.call(this, v);
					rangeFill(this);
				}
			};
		};
		Object.defineProperty(el, "value", refill(valueDesc));
		if (numberDesc) Object.defineProperty(el, "valueAsNumber", refill(numberDesc));
		["stepUp", "stepDown"].forEach(function(m) {
			var step = inputProto[m];
			if (step) el[m] = function() {
				step.apply(this, arguments);
				rangeFill(this);
			};
		});
		if (el.classList.contains("vertical")) checkVertical();
	}
	/** Browsers whose form controls can't stand up (before Chrome 124, Safari 17.4, Firefox 120) turn vertical sliders. */
	var vertical = null;
	function checkVertical() {
		var root = doc.documentElement;
		if (vertical !== null || !root) return;
		var probe = doc.createElement("input");
		probe.type = "range";
		probe.style.cssText = "position:absolute;visibility:hidden;writing-mode:vertical-lr";
		root.appendChild(probe);
		vertical = probe.offsetHeight > probe.offsetWidth;
		root.removeChild(probe);
		if (!vertical) root.setAttribute("data-bb-vranges", "rotate");
	}
	doc.addEventListener("input", function(e) {
		var t = e.target;
		if (t && t.classList && t.classList.contains("bb-range")) rangeFill(t);
	}, true);
	doc.addEventListener("reset", function(e) {
		var form = e.target;
		setTimeout(function() {
			if (form.querySelectorAll) syncRanges(form);
		}, 0);
	}, true);
	if (global.MutationObserver && doc.documentElement) {
		new global.MutationObserver(function(records) {
			for (var i = 0; i < records.length; i++) {
				var r = records[i];
				if (r.type === "attributes") {
					if (r.target.classList.contains("bb-range")) rangeFill(r.target);
					continue;
				}
				for (var j = 0; j < r.addedNodes.length; j++) {
					var n = r.addedNodes[j];
					if (n.nodeType !== 1) continue;
					if (n.classList.contains("bb-range")) rangeFill(n);
					else if (n.firstElementChild) syncRanges(n);
				}
			}
		}).observe(doc.documentElement, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [
				"min",
				"max",
				"step",
				"value"
			]
		});
		syncRanges(doc);
	}
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
		rangeShare,
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
	lock: s$1("<rect x=\"5.5\" y=\"10.5\" width=\"13\" height=\"9.5\" rx=\"2.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5\"/><path d=\"M12 14.4v2\" stroke-width=\"2.2\"/>"),
	unlock: s$1("<rect x=\"5.5\" y=\"10.5\" width=\"13\" height=\"9.5\" rx=\"2.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 6.6-1.6\"/><path d=\"M12 14.4v2\" stroke-width=\"2.2\"/>"),
	point: s$1("<circle cx=\"12\" cy=\"12\" r=\"7.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.4\"/><path d=\"M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3\"/>"),
	tilt: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M3.6 10.6h6.2M14.2 10.6h6.2M12 14.2v6.3\"/>"),
	match: s$1("<path d=\"M12 3.2 19.8 7.6v8.8L12 20.8 4.2 16.4V7.6L12 3.2Z\"/><path d=\"M4.2 7.6 12 12l7.8-4.4M12 12v8.8\"/>"),
	gyro: s$1("<circle cx=\"12\" cy=\"12\" r=\"2.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"3.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"3.6\" ry=\"9\"/>"),
	center: s$1("<circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><path d=\"M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2\"/>"),
	settings: s$1("<path d=\"M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9\"/><circle cx=\"15\" cy=\"7.5\" r=\"2.2\"/><circle cx=\"9\" cy=\"16.5\" r=\"2.2\"/>"),
	models: s$1("<rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/>"),
	reset: s$1("<path d=\"M4.5 12a7.5 7.5 0 1 0 2.2-5.3\"/><path d=\"M4.5 4.5v4h4\"/>"),
	grip: s$1("<path d=\"M12 21v-5.5\"/><path d=\"M6.5 15.5h11\"/><path d=\"M6.5 15.5V9.2l2.6-4.7\"/><path d=\"M17.5 15.5V9.2l-2.6-4.7\"/>"),
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
	guide: s$1("<path d=\"M4.5 11.2 12 4.8l7.5 6.4\"/><path d=\"M6.8 9.6v8.2A1.2 1.2 0 0 0 8 19h8a1.2 1.2 0 0 0 1.2-1.2V9.6\"/><path d=\"M10.2 19v-4.2h3.6V19\"/>"),
	plane: s$1("<path d=\"M3.5 12.2 20.2 4.4l-4.4 15.4-4.2-6.3-8.1-1.3Z\"/><path d=\"M11.6 13.5 20.2 4.4\"/>"),
	wheel: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M12 3.5v5.9M4.7 15.3l5-2.3M19.3 15.3l-5-2.3\"/>"),
	cursor: s$1("<path d=\"M6 4.2 18.4 12.6l-5.3 1.1 2.7 5.4-2.5 1.2-2.7-5.4L6.6 18.6Z\"/>"),
	sound: s$1("<path d=\"M4.5 9.6h3.1L12 6v12l-4.4-3.6H4.5Z\"/><path d=\"M15.2 9.3a3.8 3.8 0 0 1 0 5.4M17.8 6.8a7.4 7.4 0 0 1 0 10.4\"/>"),
	mute: s$1("<path d=\"M4.5 9.6h3.1L12 6v12l-4.4-3.6H4.5Z\"/><path d=\"M15.5 9.7l4.6 4.6M20.1 9.7l-4.6 4.6\"/>"),
	"mouse-left": s$1("<rect x=\"6\" y=\"2.8\" width=\"12\" height=\"18.4\" rx=\"6\"/><path d=\"M12 2.8v7M6 9.8h12\"/><path d=\"M12 2.8A6 6 0 0 0 6 8.8v1h6Z\" fill=\"currentColor\"/>"),
	"mouse-right": s$1("<rect x=\"6\" y=\"2.8\" width=\"12\" height=\"18.4\" rx=\"6\"/><path d=\"M12 2.8v7M6 9.8h12\"/><path d=\"M12 2.8a6 6 0 0 1 6 6v1h-6Z\" fill=\"currentColor\"/>"),
	autoscroll: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><path d=\"M9.9 8.4 12 5.9l2.1 2.5ZM9.9 15.6l2.1 2.5 2.1-2.5Z\" fill=\"currentColor\"/>"),
	"zoom-in": s$1("<circle cx=\"10.5\" cy=\"10.5\" r=\"6.3\"/><path d=\"M15.1 15.1 20 20M7.8 10.5h5.4M10.5 7.8v5.4\"/>"),
	"zoom-out": s$1("<circle cx=\"10.5\" cy=\"10.5\" r=\"6.3\"/><path d=\"M15.1 15.1 20 20M7.8 10.5h5.4\"/>"),
	mouse: s$1("<rect x=\"7\" y=\"3.5\" width=\"10\" height=\"17\" rx=\"5\"/><path d=\"M12 3.5v6.2M7 9.7h10\"/>"),
	stick: s$1("<circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/>"),
	stickL: s$1("<circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/><path d=\"M3.5 4.5v6h3.6\" stroke-width=\"2\"/>"),
	stickR: s$1("<circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/><path d=\"M17.2 10.5v-6h2.2a1.6 1.6 0 0 1 0 3.2h-2.2l2.8 2.8\" stroke-width=\"2\"/>"),
	fly: s$1("<path d=\"M4 15.5c2.2-1.6 5-2.5 8-2.5s5.8.9 8 2.5\"/><path d=\"M12 13V7.5M9.5 9.2 12 6.5l2.5 2.7\"/><path d=\"M4.5 19h15\"/>"),
	keyboard: s$1("<rect x=\"2.6\" y=\"5.6\" width=\"18.8\" height=\"12.8\" rx=\"2.8\"/><path d=\"M6.2 9.4h.01M9.1 9.4h.01M12 9.4h.01M14.9 9.4h.01M17.8 9.4h.01M7.65 12.2h.01M10.55 12.2h.01M13.45 12.2h.01M16.35 12.2h.01\" stroke-width=\"2.2\"/><path d=\"M8.4 15.2h7.2\"/>"),
	"kb-hide": s$1("<rect x=\"3\" y=\"3.2\" width=\"18\" height=\"11.4\" rx=\"2.6\"/><path d=\"M7 6.9h.01M10.3 6.9h.01M13.7 6.9h.01M17 6.9h.01\" stroke-width=\"2.2\"/><path d=\"M8.6 10.7h6.8\"/><path d=\"M8.6 17.9 12 21l3.4-3.1\"/>"),
	backspace: s$1("<path d=\"M9.3 5.8h9.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H9.3L3.4 12Z\"/><path d=\"M11.8 9.7l4.6 4.6M16.4 9.7l-4.6 4.6\"/>"),
	enter: s$1("<path d=\"M19.4 5.2v6a2.6 2.6 0 0 1-2.6 2.6H5.4\"/><path d=\"M9.4 9.8 5.4 13.8l4 4\"/>"),
	"arrow-left": s$1("<path d=\"M19 12H5.4M11 6.4 5.4 12l5.6 5.6\"/>"),
	"arrow-right": s$1("<path d=\"M5 12h13.6M13 6.4l5.6 5.6-5.6 5.6\"/>"),
	"arrow-up": s$1("<path d=\"M12 19V5.4M6.4 11 12 5.4l5.6 5.6\"/>"),
	"arrow-down": s$1("<path d=\"M12 5v13.6M6.4 13l5.6 5.6 5.6-5.6\"/>")
};
var markSeq = 0;
/**
* The ob.Pal mark: the Blackboxes family cube (obsidian facets, hairline seams) whose lower faces and front
* edges catch the accent light, wrapped in ob.Pal's orbit with a satellite, the "." of ob.Pal. Everything lit
* takes the theme accent; a scan line sweeps the box on hover. Static twin: public/favicon.svg (scripts/brand-icons.mjs).
*/
/**
* Let the logo's satellite finish `orbits` orbits (7.5 s each), then hold still. Its motion redraws the mark (and its
* blurred glow) every frame, which a page that stays open for long, like the phone controller, shouldn't pay for.
*/
function calmMarks(root, orbits = 1) {
	const marks = [...root.querySelectorAll("svg.mark")];
	const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
	setTimeout(() => {
		for (const m of marks) m.pauseAnimations?.();
	}, still ? 0 : orbits * 7500);
}
/** Fill each `[data-mark]` slot with the inline logo mark (crisp at any size); a phone lets it settle after two orbits. */
function mountMarks(root = document) {
	for (const slot of root.querySelectorAll("[data-mark]")) slot.innerHTML = logoMark();
	if (matchMedia("(pointer: coarse)").matches) calmMarks(root, 2);
}
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
    <linearGradient id="${id}-spill" x1="0" y1="0" x2="0" y2="1"><stop offset=".42" style="stop-color:${A};stop-opacity:0"/><stop offset="1" style="stop-color:${A};stop-opacity:.5"/></linearGradient>
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
  <path d="M50,49.8 L50,80.6" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2"/>
  <path d="M22,34.4 L50,49.8 L78,34.4" fill="none" style="stroke:${A}" stroke-width="2.4" stroke-linejoin="round"/>
  <line x1="50" y1="19" x2="78" y2="34.4" stroke="rgba(255,255,255,.66)" stroke-width="1.1" stroke-linecap="round"/>
  <line x1="50" y1="19" x2="78" y2="34.4" style="stroke:${A}" stroke-width="1.3" opacity=".55" stroke-linecap="round"/>
  <path d="${ring}" fill="none" style="stroke:${A}" stroke-width="6" stroke-linecap="round" opacity=".35" filter="url(#${id}-soft)"/>
  <path d="${ring}" fill="none" stroke="url(#${id}-ring)" stroke-width="2.8" stroke-linecap="round"/>
  <g clip-path="url(#${id}-front)">${sat(true)}</g>
</svg>`;
}
/** Pause the logo's SVG animations for people who prefer reduced motion (satellite rests in front). */
function settleMotion(root = document) {
	if (!matchMedia("(prefers-reduced-motion: reduce)").matches) return;
	root.querySelectorAll("svg.mark").forEach((svg) => {
		svg.pauseAnimations();
		svg.setCurrentTime(1.4);
	});
}
/** Lockup: the mark with the ob.Pal wordmark (quiet "ob", accent full stop, bold "Pal"). */
var LOGO_WORD = "<span class=\"word\"><span class=\"ob\">ob</span><span class=\"pt\">.</span><b>Pal</b></span>";
//#endregion
//#region src/ui/ask.ts
/**
* The question Link's pages put to the person at the PC when a phone wants PC control (spec/SECURITY.md §8, L1):
* "<phone> wants to control this PC", with Allow and Deny. One prompt, answered once per phone: the service worker
* keeps the answer (shared/access.ts). As it appears it takes the keyboard's focus itself, not a button's, so a screen
* reader reads the question and a stray Enter answers nothing; Tab goes on to Allow, then Deny.
*/
/** The prompt's card, hidden until there's a question. `answer` is called with the phone's key and the answer. */
function askCard(answer) {
	const el = document.createElement("section");
	el.className = "card ask";
	el.id = "ask";
	el.tabIndex = -1;
	el.hidden = true;
	el.setAttribute("aria-labelledby", "ask-t");
	el.setAttribute("aria-describedby", "ask-d");
	el.innerHTML = `
    <span class="ask-ic" aria-hidden="true">${ICONS.phone}</span>
    <div class="ask-text">
      <h2 id="ask-t"><b></b> wants to control this PC</h2>
      <p id="ask-d">Mouse, keyboard and typing, through ob.Pal Desktop</p>
    </div>
    <div class="ask-actions">
      <button class="btn primary" type="button" data-allow="true">Allow</button>
      <button class="btn" type="button" data-allow="false">Deny</button>
    </div>`;
	el.addEventListener("click", (e) => {
		const b = e.target.closest("button[data-allow]");
		const key = el.dataset.key;
		if (!b || !key || el.getAttribute("aria-busy") === "true") return;
		el.setAttribute("aria-busy", "true");
		answer(key, b.dataset.allow === "true");
	});
	return el;
}
/**
* Show the question about `ask`, or none. A new question takes the focus (the popup opened for it, or it came while
* the page was open); the page hands the focus on (`away`) once the question is gone, if the prompt still had it.
*/
function showAsk(el, ask, away) {
	const was = el.dataset.key ?? "";
	const had = el.contains(document.activeElement);
	el.dataset.key = ask?.key ?? "";
	el.hidden = !ask;
	if (!ask) {
		el.removeAttribute("aria-busy");
		if (was && had) away?.();
		return;
	}
	el.querySelector("#ask-t b").textContent = ask.name;
	if (ask.key === was) return;
	el.removeAttribute("aria-busy");
	requestAnimationFrame(() => {
		if (!el.hidden) el.focus();
	});
}
//#endregion
//#region ../src/ui/themes.ts
/**
* ob.Pal themes are the Blackboxes family surfaces (src/family). The theme only picks what the UI sits on;
* ob.Pal's identity accent stays lime on every surface. UI colours come from the family CSS tokens, while
* the 3D stage colours (backdrop gradient and ground grid) live here because three.js needs them as values.
*/
var ACCENT = "#C6FF34";
var STAGE = {
	carbon: {
		scene: [
			"#262626",
			"#121212",
			"#050505"
		],
		grid: "#8fb04a"
	},
	navy: {
		scene: [
			"#17283f",
			"#0a1424",
			"#03070e"
		],
		grid: "#6f8fbf"
	},
	violet: {
		scene: [
			"#2b1f4b",
			"#140d27",
			"#07040e"
		],
		grid: "#8b7bc9"
	},
	wine: {
		scene: [
			"#3a2e35",
			"#1b1418",
			"#090607"
		],
		grid: "#b09aa6"
	},
	onyx: {
		scene: [
			"#151c22",
			"#08090b",
			"#020202"
		],
		grid: "#7a99aa"
	},
	light: {
		scene: [
			"#ffffff",
			"#edf1f6",
			"#dce3ec"
		],
		grid: "#8a9ab0"
	}
};
var THEMES = family.THEMES.map((t) => ({
	id: t.id,
	name: t.name,
	base: t.page,
	surface: t.surface,
	accent: ACCENT,
	light: t.light,
	...STAGE[t.id]
}));
family.DEFAULT_THEME;
/** Earlier ob.Pal themes paired an accent with a surface; map them onto the nearest family surface. */
var LEGACY = {
	lime: "carbon",
	lavender: "violet",
	turquoise: "wine",
	candy: "onyx"
};
var themeById = (id) => {
	const key = id && LEGACY[id] || id;
	return THEMES.find((t) => t.id === key) ?? THEMES.find((t) => t.id === family.getTheme()) ?? THEMES[0];
};
/** The surface to start with: the ecosystem-wide choice, else a pre-family ob.Pal choice, else the default. */
function initialTheme() {
	let chosen = /(?:^|;\s*)bb_theme=/.test(document.cookie);
	try {
		chosen ||= !!localStorage.getItem("bb_theme");
	} catch {}
	if (chosen) return themeById(family.getTheme());
	let legacy = null;
	try {
		legacy = localStorage.getItem("obpal.theme2");
	} catch {}
	const accent = legacy && LEGACY_ACCENT[legacy];
	if (accent && family.getAccent() === "product") family.setAccent(accent);
	return themeById(legacy);
}
var LEGACY_ACCENT = {
	lavender: "lavender",
	turquoise: "turquoise",
	candy: "candy"
};
/**
* Apply a surface: family tokens switch through data-bb-theme. Only a visitor's own pick (`remember`) is saved,
* across *.blackboxes.net; a default just shows, so opening ob.Pal never picks a surface for the other sites.
*/
function applyTheme(t, remember = false) {
	family.setProduct("obpal");
	if (remember) family.setTheme(t.id);
	else family.applyTheme(t.id);
	document.documentElement.dataset.theme = t.id;
	if (document.documentElement.classList.contains("site")) document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", SITE_PAGE);
}
var SITE_PAGE = "#0a0718";
//#endregion
//#region src/ui/lookcache.ts
/**
* Where the look (the surface and the accent, ./look.ts) is kept. chrome.storage.local "look" is the truth: it
* survives what clearing browsing data takes from a page's own storage. The family's own keys in the page's
* localStorage (and its cookie), which the family reads synchronously, are its cache: a page can wear the last look
* before it first paints (./first-paint.ts), long before chrome.storage could answer. Every change updates both.
* Nothing here touches the family itself, so the first-paint script stays a few hundred bytes.
*/
/** chrome.storage.local key of the look. */
var LOOK_KEY = "look";
var ID = /^[a-z]{1,16}$/;
var isId = (x) => typeof x === "string" && ID.test(x);
/** A stored look, or null. Ids are checked for shape only: the family falls back to its defaults for one it doesn't know. */
function parseLook(x) {
	if (typeof x !== "object" || x === null) return null;
	const { theme, accent } = x;
	return isId(theme) && isId(accent) ? {
		theme,
		accent
	} : null;
}
//#endregion
//#region src/ui/radios.ts
/**
* Keyboard access for the pages' radio groups (the targets, the codes, the surfaces and the colours), after the
* WAI-ARIA radio group pattern: a group is one stop in the tab order, its checked radio (a roving tabindex); the
* arrow keys move to the next or the previous radio and choose it, wrapping around, and Home and End move to the
* first and the last. Choosing is a click on the radio, so it does whatever a click does there.
*/
/** Where a key moves the focus from radio `i` of `n`, or null for a key the group leaves alone. */
function radioStep(key, i, n) {
	switch (key) {
		case "ArrowRight":
		case "ArrowDown": return (i + 1) % n;
		case "ArrowLeft":
		case "ArrowUp": return (i - 1 + n) % n;
		case "Home": return 0;
		case "End": return n - 1;
		default: return null;
	}
}
/** Make the radios in `group` ([role=radio], checked by aria-checked) one tab stop that the arrow keys move through. */
function radioGroup(group) {
	const radios = () => [...group.querySelectorAll("[role=radio]")];
	const usable = () => radios().filter((r) => !r.hidden && !r.disabled);
	const stopAt = (stop) => {
		for (const r of radios()) r.tabIndex = r === stop ? 0 : -1;
	};
	const rove = () => {
		const list = usable();
		stopAt(list.find((r) => r.getAttribute("aria-checked") === "true") ?? list[0]);
	};
	group.addEventListener("keydown", (e) => {
		if (e.altKey || e.ctrlKey || e.metaKey) return;
		const list = usable();
		const i = list.indexOf(e.target);
		const to = i < 0 ? null : radioStep(e.key, i, list.length);
		if (to === null) return;
		e.preventDefault();
		e.stopPropagation();
		const radio = list[to];
		stopAt(radio);
		radio.focus();
		if (radio.getAttribute("aria-checked") !== "true") radio.click();
	});
	new MutationObserver(rove).observe(group, {
		subtree: true,
		attributeFilter: ["aria-checked"]
	});
	rove();
}
//#endregion
//#region src/ui/look.ts
/**
* The look of ob.Pal Link's pages (the popup and the options page).
*
* The surface and the accent are the Blackboxes family's (src/family), offered as the phone's settings sheet offers
* them. A pick applies at once and is kept in chrome.storage (the Link's choice, apart from the websites'), with the
* family's own keys as its cache for the first paint (./lookcache.ts); the other Link page, if it is open, follows it
* through that cache. Also here: the animated logo, the light that follows the mouse across the cards, the radio
* groups' keys (./radios.ts), and the switch that lets state changes animate only once a page has shown its first
* real state.
*/
var LIME = "#c6ff34";
/** A pick, here or in the other page, has been applied: it is newer than the stored look, should that arrive after it. */
var picked = false;
/**
* Apply the remembered surface and accent: the cached look at once (before the page first renders, as its
* first-paint script did), then the stored one. A pick in the other page reaches this one through the cache: the
* storage event fires in every page but the one that wrote it.
*/
function startLook() {
	applyTheme(initialTheme());
	chrome.storage.local.get(LOOK_KEY).then((r) => {
		if (!picked) wear(parseLook(r[LOOK_KEY]));
	}, () => {});
	addEventListener("storage", (e) => {
		if (e.key !== null && e.key !== "bb_theme" && e.key !== "bb_accent") return;
		picked = true;
		applyTheme(themeById(family.getTheme()));
		family.applyAccent();
		syncLook(document);
	});
}
/**
* Wear the stored look, and cache it (the family keeps what it applies in its own keys). Nothing stored yet (no pick
* since 1.5): the cached look, if any, stays.
*/
function wear(look) {
	if (!look) return;
	applyTheme(themeById(look.theme), true);
	family.setAccent(look.accent);
	syncLook(document);
}
/** Store the look in effect (a pick: the family has cached it already). */
function saveLook() {
	picked = true;
	const look = {
		theme: document.documentElement.dataset.theme ?? family.getTheme(),
		accent: family.getAccent()
	};
	chrome.storage.local.set({ [LOOK_KEY]: look }).catch(() => {});
}
/**
* The popup is sized by its content, which Chrome measures (up to 800 × 600), so its layout has a set width. Opened
* in a tab instead (a test, or someone opening popup.html), it flows with the window: `in-tab` on <html>.
*/
function markContext() {
	let popup = false;
	try {
		popup = chrome.extension.getViews({ type: "popup" }).includes(window);
	} catch {}
	document.documentElement.classList.toggle("in-tab", !popup && innerWidth > 200);
}
/**
* State changes animate (a switch sliding, a card appearing) only after the page has shown its first real state, so
* opening it shows that state at once rather than animating into it.
*/
function settle() {
	requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("settled")));
}
/** The surfaces, each a small window of itself with the accent lit in it, and the accents, as the phone offers them. */
function lookMarkup() {
	const theme = document.documentElement.dataset.theme;
	const accent = family.getAccent();
	const accents = family.ACCENTS.filter((a) => a.id !== "lime" || accent === "lime");
	return `
    <p class="look-k">Surface</p>
    <div class="looks" role="radiogroup" aria-label="Surface">${THEMES.map((t) => `<button class="look" type="button" role="radio" data-theme="${t.id}" aria-checked="${t.id === theme}" style="--pv-page:${t.base};--pv-surface:${t.surface}"><i aria-hidden="true"></i><span>${t.name}</span></button>`).join("")}</div>
    <p class="look-k">Colour</p>
    <div class="accents" role="radiogroup" aria-label="Colour">${accents.map((a) => {
		const name = a.id === "product" ? "ob.Pal lime (default)" : a.name;
		return `<button class="bb-accent${a.id === "product" ? " product" : ""}" type="button" role="radio" data-accent="${a.id}" aria-checked="${a.id === accent}" aria-label="${name}" title="${name}" style="--sw:${a.color ?? LIME}">${family.icons.check}</button>`;
	}).join("")}</div>`;
}
/** Fill `root` with the look choices (radio groups the arrow keys move through) and apply a pick at once. */
function mountLook(root, onPick) {
	root.innerHTML = lookMarkup();
	for (const group of root.querySelectorAll("[role=radiogroup]")) radioGroup(group);
	root.addEventListener("click", (e) => {
		const target = e.target;
		const surface = target.closest(".look[data-theme]");
		const accent = target.closest(".accents [data-accent]");
		if (surface && root.contains(surface)) applyTheme(themeById(surface.dataset.theme), true);
		else if (accent && root.contains(accent)) family.setAccent(accent.dataset.accent);
		else return;
		syncLook(document);
		saveLook();
		onPick?.();
	});
}
/** Mark the surface and accent in effect in every look picker under `root`. */
function syncLook(root) {
	const theme = document.documentElement.dataset.theme;
	const accent = family.getAccent();
	for (const b of root.querySelectorAll(".look[data-theme]")) b.setAttribute("aria-checked", String(b.dataset.theme === theme));
	for (const b of root.querySelectorAll(".accents [data-accent]")) b.setAttribute("aria-checked", String(b.dataset.accent === accent));
}
/**
* The logo mark in each `[data-mark]` slot, its satellite orbiting (still for people who prefer less motion).
* `orbits`: let it settle after that many, for a page that may stay open for long.
*/
function mountLogo(root = document, orbits) {
	mountMarks(root);
	settleMotion(root);
	if (orbits !== void 0) calmMarks(root, orbits);
}
/** A light follows the mouse across the cards, and their edges catch it (a mouse only, as on the home page). */
function lightCards(selector = ".card") {
	if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
	let raf = 0;
	let at = null;
	document.addEventListener("pointermove", (e) => {
		if (e.pointerType !== "mouse") return;
		at = e;
		if (raf) return;
		raf = requestAnimationFrame(() => {
			raf = 0;
			const card = (at?.target)?.closest?.(selector);
			if (!card || !at) return;
			const r = card.getBoundingClientRect();
			card.style.setProperty("--mx", `${(at.clientX - r.left).toFixed(0)}px`);
			card.style.setProperty("--my", `${(at.clientY - r.top).toFixed(0)}px`);
		});
	}, { passive: true });
}
//#endregion
//#region src/popup/icons.ts
/** Popup-only glyphs in the same 24px stroke style as src/ui/icons.ts (which supplies the rest). */
var s = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
/** A fingertip on the trackpad: the gesture pictograms draw it as a filled dot. */
var tip = (x, y, r = 3.1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;
var LINK_ICONS = {
	gamepad: s("<path d=\"M7.2 7.2h9.6a4.2 4.2 0 0 1 4.1 3.4l.9 4.6a2.5 2.5 0 0 1-4.3 2.2l-2.1-2.3H8.6l-2.1 2.3a2.5 2.5 0 0 1-4.3-2.2l.9-4.6a4.2 4.2 0 0 1 4.1-3.4Z\"/><path d=\"M7.8 9.9v3.2M6.2 11.5h3.2\"/><path d=\"M15.4 10.4h.01M17.4 12.4h.01\" stroke-width=\"2.6\"/>"),
	keys: s("<rect x=\"2.8\" y=\"6\" width=\"18.4\" height=\"12\" rx=\"2.6\"/><path d=\"M6.6 9.6h.01M9.8 9.6h.01M13 9.6h.01M16.2 9.6h.01M6.6 12.4h.01M17.4 12.4h.01\" stroke-width=\"2.4\"/><path d=\"M9 14.9h6\"/>"),
	globe: s("<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M3.4 12h17.2\"/><path d=\"M12 3.4c2.3 2.3 3.4 5.2 3.4 8.6s-1.1 6.3-3.4 8.6c-2.3-2.3-3.4-5.2-3.4-8.6s1.1-6.3 3.4-8.6Z\"/>"),
	tab: s("<rect x=\"3.2\" y=\"4.6\" width=\"17.6\" height=\"14.8\" rx=\"2.6\"/><path d=\"M3.2 9h17.6\"/><path d=\"M6.4 6.8h.01M8.9 6.8h.01\" stroke-width=\"2.3\"/>"),
	/** Through the room service. */
	cloud: s("<path d=\"M7.2 18.5a4.2 4.2 0 0 1-.6-8.35A5.6 5.6 0 0 1 17.4 9.2a3.9 3.9 0 0 1-.6 7.75Z\"/><path d=\"M12 12.8v6M9.6 15.2 12 12.8l2.4 2.4\"/>"),
	/** The room service out of reach. */
	cloudOff: s("<path d=\"M7.2 18.5a4.2 4.2 0 0 1-.6-8.35A5.6 5.6 0 0 1 17.4 9.2a3.9 3.9 0 0 1-.6 7.75Z\"/><path d=\"M4 4l16 16\"/>"),
	/** Direct over the local network: two devices, one link. */
	lan: s("<rect x=\"3\" y=\"14\" width=\"7\" height=\"6\" rx=\"1.8\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"6\" rx=\"1.8\"/><path d=\"M6.5 14v-2.4a1.6 1.6 0 0 1 1.6-1.6h7.8a1.6 1.6 0 0 1 1.6 1.6V14M12 10V6.5\"/><path d=\"M9.2 5.2a4 4 0 0 1 5.6 0M7.2 3.2a6.8 6.8 0 0 1 9.6 0\"/>"),
	/** A monitor: the PC target. */
	pc: s("<rect x=\"3\" y=\"4.4\" width=\"18\" height=\"12.2\" rx=\"2.4\"/><path d=\"M12 16.6v3M8.5 19.6h7\"/>"),
	mouse: s("<rect x=\"7.5\" y=\"3.5\" width=\"9\" height=\"17\" rx=\"4.5\"/><path d=\"M12 3.5v5.5M7.5 9h9\"/>"),
	pause: s("<rect x=\"6\" y=\"5\" width=\"4\" height=\"14\" rx=\"1.4\"/><rect x=\"14\" y=\"5\" width=\"4\" height=\"14\" rx=\"1.4\"/>"),
	shield: s("<path d=\"M12 3.2 19 6v5.4c0 4.4-3 8-7 9.4-4-1.4-7-5-7-9.4V6Z\"/><path d=\"M9.2 12.1l1.9 1.9 3.8-3.9\"/>"),
	play: s("<path d=\"M8 5.5v13l10-6.5Z\"/>"),
	/** Something to know (the popup's notes). */
	info: s("<circle cx=\"12\" cy=\"12\" r=\"8.6\"/><path d=\"M12 11v5.2\"/><path d=\"M12 7.8h.01\" stroke-width=\"2.4\"/>"),
	/** A notification: a phone's question for the PC can come as one. */
	bell: s("<path d=\"M6.3 16.4V11a5.7 5.7 0 0 1 11.4 0v5.4l1.7 1.9H4.6Z\"/><path d=\"M10 20.4a2.1 2.1 0 0 0 4 0\"/>"),
	tap: s(`${tip(12, 12)}<circle cx="12" cy="12" r="7.6" opacity=".45"/>`),
	hold: s(`${tip(12, 12)}<path d="M12 4.4a7.6 7.6 0 1 1-7.6 7.6"/><path d="M4.4 12A7.6 7.6 0 0 1 12 4.4" opacity=".3"/>`),
	drag: s(`${tip(7.4, 12)}<path d="M12.4 12h8.2M17.6 9l3 3-3 3"/>`),
	scroll: s(`${tip(8.7, 12, 2.6)}${tip(15.3, 12, 2.6)}<path d="M12 2.8v3.4M9.9 4.7 12 2.6l2.1 2.1M12 21.2v-3.4M9.9 19.3l2.1 2.1 2.1-2.1"/>`),
	pinch: s(`${tip(9.4, 14.6, 2.6)}${tip(14.6, 9.4, 2.6)}<path d="M5.4 18.6 3.2 20.8M3.2 17v3.8H7M18.6 5.4l2.2-2.2M17 3.2h3.8V7"/>`),
	/** Typing: the phone's own keyboard (its tray button's glyph), a fingertip on its keys. */
	type: s(`<rect x="2.6" y="5.6" width="18.8" height="12.8" rx="2.8"/><path d="M6.2 9.4h.01M9.1 9.4h.01M12 9.4h.01M7.65 12.2h.01M10.55 12.2h.01" stroke-width="2.2"/><path d="M8.4 15.2h4.4"/>${tip(16.3, 11.3, 2.6)}`)
};
//#endregion
export { mountLook as a, syncLook as c, showAsk as d, ICONS as f, mountLogo as i, radioGroup as l, family as m, lightCards as n, settle as o, LOGO_WORD as p, markContext as r, startLook as s, LINK_ICONS as t, askCard as u };
