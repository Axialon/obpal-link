import { C as isTargetMode, a as parseLink, n as parseBgRequest, s as senderKind, t as allowedFrom, v as DEFAULT_MODE } from "./assets/messages-Pseg0PpG.js";
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
			device: null
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
	await chrome.storage.session.set({ tab: tabId });
	try {
		await injectBridge(tabId);
	} catch (e) {
		await chrome.storage.session.set({ tab: prev === tabId ? null : prev });
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
		await chrome.storage.session.set({ tab: null });
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
			return { ok: true };
		case "unpair":
			await toOffscreen({
				to: "offscreen",
				type: "unpair"
			});
			return { ok: true };
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
chrome.tabs.onRemoved.addListener((tabId) => {
	(async () => {
		if (tabId !== await controlledTab()) return;
		await chrome.storage.session.set({ tab: null });
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
	})();
});
chrome.permissions.onRemoved.addListener(() => void syncRegistration());
chrome.runtime.onStartup.addListener(() => void syncRegistration());
chrome.runtime.onInstalled.addListener(() => void syncRegistration());
//#endregion
