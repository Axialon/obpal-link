import { R as DEFAULT_MODE, W as isTargetMode, a as parseLink, n as parseBgRequest, s as senderKind, t as allowedFrom } from "./assets/messages-B_-Maqev.js";
import { d as parseNativeFrame, g as toHelperRequest, i as NATIVE_HOST, n as EMPTY_PC, u as parseHelperMessage } from "./assets/native-CYWtXzmG.js";
//#region src/native.ts
var NATIVE_PERMISSION = { permissions: ["nativeMessaging"] };
var RETRY_MS = [
	1e3,
	3e3,
	1e4,
	3e4
];
var NativeBridge = class {
	port = null;
	state = { ...EMPTY_PC };
	ready = false;
	armed = false;
	wantMode = false;
	/** Extension pages holding a PC_PAGE_PORT_NAME port. */
	pages = 0;
	retries = 0;
	retryTimer;
	/** Reconcile with the target mode: connect and arm for PC, disarm (and let go) otherwise. */
	async sync(mode) {
		this.wantMode = mode === "pc";
		await this.reconcile();
	}
	/** Connect now if the helper is wanted (a Retry, or a page that just opened). */
	async request() {
		this.retries = 0;
		await this.reconcile();
	}
	/** An extension page shows the helper's state (the allowlist) whatever the target is: keep it up while it is open. */
	pageOpened() {
		this.pages++;
		this.reconcile();
	}
	pageClosed() {
		this.pages = Math.max(0, this.pages - 1);
		this.reconcile();
	}
	/** An action frame from the offscreen link; dropped unless the helper is up and armed. */
	frame(f) {
		if (this.ready && this.armed) this.send(f);
	}
	/** Popup and options page requests. */
	async handle(req) {
		if (req.type === "pc-connect") {
			await this.request();
			return { ok: true };
		}
		if (!this.ready) return {
			ok: false,
			error: "helper not connected"
		};
		const m = toHelperRequest(req);
		return m && this.send(m) ? { ok: true } : {
			ok: false,
			error: "helper not connected"
		};
	}
	async reconcile() {
		if (!this.wantMode && !this.pages) return this.drop("off");
		if (!await chrome.permissions.contains(NATIVE_PERMISSION)) return this.drop("permission");
		if (!this.port) this.connect();
		this.arm(this.wantMode);
	}
	arm(on) {
		if (!this.ready || this.armed === on) return;
		this.armed = on;
		this.send({
			t: "enable",
			on
		});
	}
	connect() {
		clearTimeout(this.retryTimer);
		this.retryTimer = void 0;
		this.set({
			link: "connecting",
			error: null
		});
		let port;
		try {
			port = chrome.runtime.connectNative(NATIVE_HOST);
		} catch (e) {
			this.set({
				link: "error",
				error: e instanceof Error ? e.message : String(e),
				status: null
			});
			return;
		}
		this.port = port;
		port.onMessage.addListener((raw) => this.onMessage(port, raw));
		port.onDisconnect.addListener(() => this.onDisconnect(port));
		this.send({
			t: "hello",
			v: 1
		});
	}
	onMessage(port, raw) {
		if (port !== this.port) return;
		const m = parseHelperMessage(raw);
		if (!m) return;
		switch (m.t) {
			case "hello":
				this.ready = true;
				this.retries = 0;
				this.set({
					link: "ready",
					version: m.version,
					desktopCap: m.caps.desktop,
					hotkey: m.hotkey,
					error: null
				});
				this.arm(this.wantMode);
				break;
			case "config":
				this.set({ config: {
					paused: m.paused,
					desktop: m.desktop,
					programs: m.programs
				} });
				break;
			case "status":
				this.set({ status: {
					enabled: m.enabled,
					panic: m.panic,
					held: m.held,
					front: m.front,
					program: m.program
				} });
				break;
			case "error":
				console.warn(`[ob.Pal Link] helper: ${m.code}: ${m.msg}`);
				break;
			case "stats": this.set({ stats: {
				frames: m.frames,
				injected: m.injected,
				refused: m.refused
			} });
		}
	}
	onDisconnect(port) {
		const msg = chrome.runtime.lastError?.message ?? "";
		if (port !== this.port) return;
		const wasReady = this.ready;
		this.port = null;
		this.ready = false;
		this.armed = false;
		if (/not found/i.test(msg)) return this.set({
			link: "missing",
			error: null,
			status: null
		});
		if (/forbidden/i.test(msg)) return this.set({
			link: "error",
			error: "This copy of ob.Pal Link is not allowed by the installed helper (its extension ID differs).",
			status: null
		});
		this.set({
			link: "error",
			error: msg || (wasReady ? "The helper stopped." : "The helper did not answer."),
			status: null
		});
		if ((this.wantMode || this.pages) && this.retries < RETRY_MS.length) this.retryTimer = setTimeout(() => void this.reconcile(), RETRY_MS[this.retries++]);
	}
	drop(link) {
		clearTimeout(this.retryTimer);
		this.retryTimer = void 0;
		const p = this.port;
		this.port = null;
		this.ready = false;
		this.armed = false;
		try {
			p?.disconnect();
		} catch {}
		this.set({
			link,
			error: null,
			status: null
		});
	}
	set(patch) {
		this.state = {
			...this.state,
			...patch
		};
		chrome.storage.session.set({ pc: this.state }).catch(() => void 0);
	}
	send(m) {
		const p = this.port;
		if (!p) return false;
		try {
			p.postMessage(m);
			return true;
		} catch {
			return false;
		}
	}
};
//#endregion
//#region src/background.ts
/**
* Service worker: message routing and per-tab enablement.
*  - Keeps the offscreen link document (the ob.Pal Remote) alive while it is needed.
*  - "Control this tab" injects the bridge into every permitted frame of that tab; each bridge then says hello
*    and gets the MAIN-world page script injected into its frame. Only one tab is controlled at a time.
*  - With the optional "All sites" permission it also registers the bridge for new frames and navigations.
*  - State: target mode in storage.local; controlled tab and link status in storage.session (the popup reads both).
*/
var OFFSCREEN_PATH = "offscreen.html";
var BRIDGE_JS = "bridge.js";
var PAGE_JS = "page.js";
var REGISTERED_ID = "obpal-link-bridge";
var ALL_SITES = { origins: ["<all_urls>"] };
var SELF = {
	id: chrome.runtime.id,
	origin: chrome.runtime.getURL("").replace(/\/$/, "")
};
/** The PC target: the native messaging port to ob.Pal Desktop, connected while the target is PC. */
var native = new NativeBridge();
async function controlledTab() {
	const { tab } = await chrome.storage.session.get("tab");
	return typeof tab === "number" ? tab : null;
}
async function targetMode() {
	const { mode } = await chrome.storage.local.get("mode");
	return isTargetMode(mode) ? mode : DEFAULT_MODE;
}
async function linkState() {
	const { link } = await chrome.storage.session.get("link");
	return parseLink(link);
}
var creating = null;
async function hasOffscreen() {
	return (await chrome.runtime.getContexts({
		contextTypes: ["OFFSCREEN_DOCUMENT"],
		documentUrls: [chrome.runtime.getURL(OFFSCREEN_PATH)]
	})).length > 0;
}
async function ensureOffscreen() {
	if (await hasOffscreen()) return;
	creating ??= (async () => {
		await chrome.storage.session.set({ link: {
			status: "starting",
			url: "",
			device: null,
			lan: "",
			lanFor: null,
			pairs: []
		} });
		await chrome.offscreen.createDocument({
			url: OFFSCREEN_PATH,
			reasons: ["WEB_RTC"],
			justification: "Holds the WebRTC connection to the paired phone that sends controller input."
		});
	})().catch((e) => {
		if (!/single offscreen/i.test(String(e))) throw e;
	}).finally(() => {
		creating = null;
	});
	await creating;
}
var toOffscreen = (m) => chrome.runtime.sendMessage(m).catch(() => void 0);
async function pushConfig() {
	const [tabId, mode] = await Promise.all([controlledTab(), targetMode()]);
	await toOffscreen({
		to: "offscreen",
		type: "config",
		tabId,
		mode
	});
}
/** The bridge goes into every frame we may access: the tab's own origin via activeTab, all frames with "All sites". */
async function injectBridge(tabId) {
	await chrome.scripting.executeScript({
		target: {
			tabId,
			allFrames: true
		},
		files: [BRIDGE_JS],
		injectImmediately: true
	});
}
var tellTab = (tabId, m) => chrome.tabs.sendMessage(tabId, m).catch(() => void 0);
/** A bridge asked whether its tab is controlled. If so, give its frame the MAIN-world page script. */
async function bridgeHello(sender) {
	const tabId = sender.tab?.id;
	if (tabId === void 0 || tabId !== await controlledTab()) return { active: false };
	await ensureOffscreen();
	const target = sender.documentId ? {
		tabId,
		documentIds: [sender.documentId]
	} : {
		tabId,
		frameIds: [sender.frameId ?? 0]
	};
	await chrome.scripting.executeScript({
		target,
		world: "MAIN",
		files: [PAGE_JS],
		injectImmediately: true
	}).catch(() => {});
	return { active: true };
}
/** With "All sites", new frames and navigations in the controlled tab get a bridge at document_start. */
async function syncRegistration() {
	const [tabId, all] = await Promise.all([controlledTab(), chrome.permissions.contains(ALL_SITES)]);
	const want = tabId !== null && all;
	const have = (await chrome.scripting.getRegisteredContentScripts({ ids: [REGISTERED_ID] })).length > 0;
	if (want && !have) await chrome.scripting.registerContentScripts([{
		id: REGISTERED_ID,
		js: [BRIDGE_JS],
		matches: ["<all_urls>"],
		allFrames: true,
		matchOriginAsFallback: true,
		runAt: "document_start",
		persistAcrossSessions: false
	}]).catch(() => {});
	else if (!want && have) await chrome.scripting.unregisterContentScripts({ ids: [REGISTERED_ID] }).catch(() => {});
}
async function enableTab(tabId) {
	const prev = await controlledTab();
	await ensureOffscreen();
	await chrome.storage.session.set({
		tab: tabId,
		frames: null
	});
	try {
		await injectBridge(tabId);
	} catch (e) {
		await chrome.storage.session.set({
			tab: prev === tabId ? null : prev,
			frames: null
		});
		throw e;
	}
	if (prev !== null && prev !== tabId) {
		await tellTab(prev, {
			to: "bridge",
			type: "deactivate"
		});
		await clearBadge(prev);
	}
	await Promise.all([
		pushConfig(),
		syncRegistration(),
		refreshBadge()
	]);
	return { ok: true };
}
async function disableTab(tabId) {
	if (await controlledTab() === tabId) {
		await chrome.storage.session.set({
			tab: null,
			frames: null
		});
		await tellTab(tabId, {
			to: "bridge",
			type: "deactivate"
		});
		await Promise.all([
			pushConfig(),
			syncRegistration(),
			clearBadge(tabId)
		]);
	}
	return { ok: true };
}
async function clearBadge(tabId) {
	await chrome.action.setBadgeText({
		tabId,
		text: ""
	}).catch(() => {});
}
async function refreshBadge() {
	const tabId = await controlledTab();
	if (tabId === null) return;
	const live = (await linkState())?.status === "connected";
	await Promise.all([
		chrome.action.setBadgeBackgroundColor({
			tabId,
			color: live ? "#C6FF34" : "#5C5C5C"
		}),
		chrome.action.setBadgeTextColor({
			tabId,
			color: live ? "#172100" : "#F4F4F4"
		}),
		chrome.action.setBadgeText({
			tabId,
			text: "●"
		})
	]).catch(() => {});
}
async function handle(msg, sender) {
	switch (msg.type) {
		case "ensure":
			await ensureOffscreen();
			return { ok: true };
		case "enable": return msg.on ? enableTab(msg.tabId) : disableTab(msg.tabId);
		case "mode":
			await chrome.storage.local.set({ mode: msg.mode });
			await pushConfig();
			await native.sync(msg.mode);
			return { ok: true };
		case "pc-connect":
		case "pc-allow":
		case "pc-scope":
		case "pc-forget":
		case "pc-desktop":
		case "pc-pause":
		case "pc-resume":
		case "pc-stats": return native.handle(msg);
		case "unpair":
			await toOffscreen({
				to: "offscreen",
				type: "unpair"
			});
			return { ok: true };
		case "forget":
		case "lan":
			await ensureOffscreen();
			await toOffscreen({
				to: "offscreen",
				type: msg.type,
				id: msg.id
			});
			return { ok: true };
		case "diag": return await toOffscreen({
			to: "offscreen",
			type: "diag"
		}) ?? null;
		case "link":
			await chrome.storage.session.set({ link: msg.link });
			await refreshBadge();
			return { ok: true };
		case "offscreen-ready": {
			const [tabId, mode] = await Promise.all([controlledTab(), targetMode()]);
			if (tabId !== null) tellTab(tabId, {
				to: "bridge",
				type: "reconnect"
			});
			return {
				tabId,
				mode
			};
		}
		case "hello": return bridgeHello(sender);
		case "frames": {
			const tabId = await controlledTab();
			if (tabId === null || sender.tab?.id !== tabId || (sender.frameId ?? 0) !== 0) return { ok: false };
			await chrome.storage.session.set({ frames: {
				tab: tabId,
				count: msg.count,
				host: msg.host,
				big: msg.big
			} });
			return { ok: true };
		}
		case "rescan": {
			const tabId = await controlledTab();
			if (tabId !== null && sender.tab?.id === tabId) await injectBridge(tabId).catch(() => {});
			return { ok: true };
		}
	}
}
chrome.runtime.onMessage.addListener((raw, sender, respond) => {
	const msg = parseBgRequest(raw);
	if (!msg) return false;
	const kind = senderKind({
		id: sender.id,
		url: sender.url,
		tabId: sender.tab?.id
	}, SELF);
	if (!allowedFrom(msg.type, kind)) return false;
	handle(msg, sender).then(respond, (e) => respond({
		ok: false,
		error: e instanceof Error ? e.message : String(e)
	}));
	return true;
});
chrome.runtime.onConnect.addListener((port) => {
	if (port.name === "obpal-link/pc-page") {
		const s = port.sender;
		if (senderKind({
			id: s?.id,
			url: s?.url,
			tabId: s?.tab?.id
		}, SELF) !== "extension") return port.disconnect();
		native.pageOpened();
		port.onDisconnect.addListener(() => native.pageClosed());
		return;
	}
	if (port.name !== "obpal-link/native") return;
	const s = port.sender;
	if (senderKind({
		id: s?.id,
		url: s?.url,
		tabId: s?.tab?.id
	}, SELF) !== "offscreen") {
		port.disconnect();
		return;
	}
	targetMode().then((mode) => native.sync(mode));
	port.onMessage.addListener((raw) => {
		const f = parseNativeFrame(raw);
		if (f) native.frame(f);
	});
});
chrome.tabs.onRemoved.addListener((tabId) => {
	(async () => {
		if (tabId !== await controlledTab()) return;
		await chrome.storage.session.set({
			tab: null,
			frames: null
		});
		await Promise.all([pushConfig(), syncRegistration()]);
	})();
});
chrome.tabs.onUpdated.addListener((tabId, info) => {
	if (info.status !== "complete") return;
	(async () => {
		if (tabId !== await controlledTab()) return;
		try {
			await injectBridge(tabId);
			await refreshBadge();
		} catch {
			await disableTab(tabId);
		}
	})();
});
chrome.permissions.onAdded.addListener(() => {
	(async () => {
		await syncRegistration();
		const tabId = await controlledTab();
		if (tabId !== null) await injectBridge(tabId).catch(() => {});
		await native.sync(await targetMode());
	})();
});
chrome.permissions.onRemoved.addListener(() => void Promise.all([syncRegistration(), targetMode().then((m) => native.sync(m))]));
var warm = () => void Promise.all([syncRegistration(), ensureOffscreen().catch(() => {})]);
chrome.runtime.onStartup.addListener(warm);
chrome.runtime.onInstalled.addListener(warm);
targetMode().then((mode) => native.sync(mode));
//#endregion
