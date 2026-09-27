import { n as renderSVG } from "./dist-lkpp0okm.js";
import { i as family, n as ICONS, r as logo, t as LINK_ICONS } from "./icons-oOncADSv.js";
import { G as isTargetMode, W as TARGET_MODES, a as parseLink, c as workerStale, z as DEFAULT_MODE } from "./messages-Cj9v-zYH.js";
import { h as scopeLabel, m as pcView, n as EMPTY_PC, p as parsePcState, t as DESKTOP_URL } from "./native-CYWtXzmG.js";
//#region src/popup/popup.ts
/**
* Popup: the ob.Pal lockup, the pairing QR (or the connected phone), and the controls: control this tab,
* what the phone drives (Controller / 3D / Keys / PC), the optional "All sites" permission, and for the PC
* target: the whole PC, or the program in front (allow it, or see what is being controlled).
* It renders from storage (written by the service worker) and asks the worker to change things.
*
* Two kinds of code: the online one (through the room service) and, for a remembered phone, a direct LAN code
* that needs no server. The direct code takes over by itself while the service is unreachable; the chips under
* the QR switch by hand. Remembered phones can be forgotten here.
*/
family.setProduct("obpal");
var ALL_SITES = { origins: ["<all_urls>"] };
var NATIVE_PERMISSION = { permissions: ["nativeMessaging"] };
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
	},
	pc: {
		label: "PC",
		icon: LINK_ICONS.pc,
		title: "PC: this computer’s mouse and keyboard, through ob.Pal Desktop"
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
	notice: null,
	frames: null,
	code: "auto",
	pc: { ...EMPTY_PC },
	pcPermission: false,
	stale: false
};
var parseFrames = (x) => {
	const f = x;
	return f && typeof f === "object" && Number.isInteger(f.tab) && Number.isInteger(f.count) && typeof f.host === "string" ? f : null;
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
      <p class="scan-hint" id="scan-hint">${ICONS.phone}<span id="scan-t">Scan with your phone</span></p>
      <div class="codes" id="codes" role="radiogroup" aria-label="Which code to show" hidden>
        <button class="code" type="button" role="radio" data-code="cloud" title="Through ob.Pal (needs internet)">${LINK_ICONS.cloud}<span>Online</span></button>
        <button class="code" type="button" role="radio" data-code="lan" title="Direct over Wi-Fi, no internet needed (remembered phones only)">${LINK_ICONS.lan}<span>Direct</span></button>
      </div>
      <div class="remembered" id="remembered" aria-label="Remembered phones" hidden></div>
    </div>
    <div class="device" id="device" hidden>
      <span class="device-ic">${ICONS.phone}</span>
      <span class="device-t"><b id="device-name"></b><small id="device-how">Connected</small></span>
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
    <div class="pc" id="pc" hidden>
      <div class="pc-main">
        <span class="row-ic" id="pc-ic"></span>
        <span class="row-t"><b id="pc-title"></b><small id="pc-sub"></small></span>
        <button class="icon-btn" id="pc-list" type="button" title="Allowed programs" aria-label="Allowed programs">${ICONS.settings}</button>
      </div>
      <div class="kinds" id="pc-kinds" role="group" aria-label="What to allow" hidden>
        <button class="kind" type="button" data-kind="keyboard" aria-pressed="true">${LINK_ICONS.keys}<span>keys</span></button>
        <button class="kind" type="button" data-kind="mouse" aria-pressed="true">${LINK_ICONS.mouse}<span>mouse</span></button>
      </div>
      <div class="pc-actions" id="pc-actions"></div>
      <div class="pc-legend" id="pc-legend" hidden>
        <p><b>Trackpad</b><span>tap click</span><span>hold right-click</span><span>hold, move drag</span><span>two fingers scroll</span><span>pinch zoom</span></p>
        <p><b>Point</b><span>A click</span><span>hold A right-click</span><span>hold B, aim scroll</span><span>+ − zoom</span></p>
      </div>
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
var codeBtns = [...app.querySelectorAll(".code")];
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
	$("status").dataset.s = status;
	$("status-t").textContent = STATUS[status];
	const connected = status === "connected";
	$("scan").hidden = connected;
	$("device").hidden = !connected;
	$("device-name").textContent = link?.device || "Phone";
	const code = shownCode();
	const lanPhone = link?.pairs.find((p) => p.id === link.lanFor);
	if (!connected && code.url !== qrFor) {
		qrFor = code.url;
		$("qr").innerHTML = code.url ? renderSVG(code.url, {
			ecc: code.kind === "lan" ? "L" : "M",
			border: 1,
			blackColor: "#0a0a0a",
			whiteColor: "#ffffff"
		}) : "<span class=\"qr-wait\"></span>";
	}
	$("qr").dataset.kind = code.kind;
	$("scan-hint").replaceChildren();
	$("scan-hint").insertAdjacentHTML("afterbegin", code.kind === "lan" ? LINK_ICONS.lan : ICONS.phone);
	const hint = document.createElement("span");
	hint.id = "scan-t";
	hint.textContent = code.kind === "lan" ? `Direct link${lanPhone ? ` · ${lanPhone.name}` : ""}` : status === "offline" ? "No internet" : "Scan with your phone";
	$("scan-hint").append(hint);
	$("scan-hint").classList.toggle("warn", code.kind === "cloud" && status === "offline");
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
	allBtn.setAttribute("aria-checked", String(state.allSites));
	renderPc();
	const note = $("note");
	const notice = staleHint() ?? state.notice ?? offlineHint() ?? (state.mode === "pc" ? null : framesHint());
	note.hidden = !notice;
	note.replaceChildren();
	if (notice) {
		const { text, action } = notice;
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
/**
* The controlled page shows a frame from another site (a hosted game, most often) and "All sites" is off: the
* extension can't reach inside it, so the phone's input would go nowhere. Offer the fix in one click.
*/
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
	const { icon, title, sub, actions, kinds, live } = describe(state.pcPermission ? pcView(state.pc) : { kind: "permission" });
	$("pc-legend").hidden = !live;
	const ic = $("pc-ic");
	ic.innerHTML = icon;
	ic.classList.toggle("on", live);
	$("pc-title").textContent = title;
	$("pc-sub").textContent = sub;
	$("pc-kinds").hidden = !kinds;
	$("pc-list").hidden = state.pc.link !== "ready";
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
			live: false
		};
		case "connecting": return {
			icon: pc,
			title: "Starting…",
			sub: "ob.Pal Desktop",
			actions: [],
			kinds: false,
			live: false
		};
		case "missing": return {
			icon: LINK_ICONS.shield,
			title: "ob.Pal Desktop isn’t installed",
			sub: "Install it, then retry",
			kinds: false,
			live: false,
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
			live: false
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
			live: false
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
			live: false
		};
		case "desktop": return {
			icon: pc,
			title: "Controlling this PC",
			sub: (v.front?.elevated ? `${v.front.name} runs as administrator: Windows keeps it out of reach` : "") || `${scopeLabel(v.scope)} · every window`,
			kinds: false,
			live: true,
			actions: [pause, {
				label: "One program",
				run: () => setDesktop(false)
			}]
		};
		case "idle": return v.desktop ? {
			icon: pc,
			title: "This PC",
			sub: "Every window, or one program: switch to it, then come back",
			actions: [whole(true, true)],
			kinds: true,
			live: false
		} : {
			icon: pc,
			title: "Switch to a program",
			sub: "Then come back here to allow it",
			actions: [whole(false)],
			kinds: false,
			live: false
		};
		case "elevated": return {
			icon: LINK_ICONS.shield,
			title: v.program.name,
			sub: "Runs as administrator: can’t be controlled",
			actions: [whole(v.desktop)],
			kinds: v.desktop,
			live: false
		};
		case "allow": return {
			icon: pc,
			title: v.program.name,
			sub: v.program.title || v.program.path,
			kinds: true,
			live: false,
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
		if (changes.link) state.link = parseLink(changes.link.newValue);
		if (changes.frames) state.frames = parseFrames(changes.frames.newValue);
		if (changes.pc) state.pc = parsePcState(changes.pc.newValue) ?? { ...EMPTY_PC };
	} else if (area === "local" && changes.mode && isTargetMode(changes.mode.newValue)) state.mode = changes.mode.newValue;
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
			"pc"
		]),
		chrome.storage.local.get("mode"),
		chrome.permissions.contains(ALL_SITES),
		chrome.permissions.contains(NATIVE_PERMISSION)
	]);
	state.current = tabs[0] ?? null;
	state.tab = typeof session.tab === "number" ? session.tab : null;
	state.link = parseLink(session.link);
	state.frames = parseFrames(session.frames);
	state.pc = parsePcState(session.pc) ?? { ...EMPTY_PC };
	state.mode = isTargetMode(local.mode) ? local.mode : DEFAULT_MODE;
	state.allSites = allSites;
	state.pcPermission = pcPermission;
	render();
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
