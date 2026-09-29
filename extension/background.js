import { $ as parseAnswers, C as parseNativeFrame, H as DEFAULT_MODE, J as isTargetMode, O as toHelperRequest, S as parseHelperMessage, T as parsePcState, X as askFor, Y as accessOf, et as parsePhone, f as EMPTY_PC, h as NATIVE_HOST, k as typingField, l as senderKind, n as linkConfig, nt as withAnswer, r as parseBgRequest, rt as withoutAnswer, s as parseLink, t as allowedFrom, w as parseNativeText, x as isTypingRefusal } from "./assets/messages-BtNPASMo.js";
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
	/** This connection's first config is through: handled, and passed on to the offscreen link if it changed whole PC. */
	configured = false;
	armed = false;
	wantMode = false;
	/** The phone connected now may control this PC: the person at the PC said so (shared/access.ts). */
	allowed = false;
	/** Extension pages holding a PC_PAGE_PORT_NAME port. */
	pages = 0;
	retries = 0;
	retryTimer;
	/** The helper types (0.3 and later). */
	textCap = false;
	field = null;
	/**
	* The helper's config as this worker's previous run mirrored it (storage.session "pc"), picked back up when the
	* worker starts again. Everything that reads whole PC or changes the state waits for it.
	*/
	restored = chrome.storage.session.get("pc").then((r) => {
		const config = parsePcState(r.pc)?.config;
		if (config) this.state = {
			...this.state,
			config
		};
	}, () => {});
	/** Called when whole-PC control turns on or off; the helper is armed once what it returns has settled. */
	onDesktop = null;
	/** Called when the field that would take typing changes (null: none). */
	onTextField = null;
	/** Called when typing from the phone didn't get through. */
	onTyping = null;
	/** ob.Pal Desktop controls the whole PC (not one program). */
	get desktop() {
		return !!this.state.config?.desktop;
	}
	/** Whether ob.Pal Desktop controls the whole PC, as it last said (before this worker started, if not since). */
	async wholePc() {
		await this.restored;
		return this.desktop;
	}
	/** A text or password field in front would take typing now (see typingField). */
	get textField() {
		return this.field;
	}
	/**
	* Reconcile with the target mode and the phone: connect for PC, and arm only while a phone the person at the PC
	* allowed is connected; disarm (and let go) otherwise.
	*/
	async sync(mode, allowed) {
		this.wantMode = mode === "pc";
		this.allowed = allowed;
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
	/** Typing from the phone, through the offscreen link: to a helper that is up, armed and types; otherwise the phone hears why not. */
	text(t) {
		if (!this.ready || !this.armed) this.onTyping?.("offline");
		else if (!this.textCap) this.onTyping?.("no-text");
		else this.send(t);
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
		await this.restored;
		if (!this.wantMode && !this.pages) return this.drop("off");
		if (!await chrome.permissions.contains(NATIVE_PERMISSION)) return this.drop("permission");
		if (!this.port) this.connect();
		this.arm(this.wantMode && this.allowed);
	}
	arm(on) {
		if (!this.ready || !this.configured || this.armed === on) return;
		this.armed = on;
		this.send({
			t: "enable",
			on
		});
	}
	connect() {
		clearTimeout(this.retryTimer);
		this.retryTimer = void 0;
		this.configured = false;
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
			case "platform":
				this.set({ platform: {
					os: m.os,
					accessibility: m.accessibility,
					ctrlToCmd: m.ctrlToCmd
				} });
				break;
			case "hello":
				this.ready = true;
				this.retries = 0;
				this.textCap = m.caps.text;
				this.set({
					platform: m.os === "macos" ? {
						os: "macos",
						accessibility: false,
						ctrlToCmd: true
					} : void 0,
					link: "ready",
					version: m.version,
					desktopCap: m.caps.desktop,
					hotkey: m.hotkey,
					error: null
				});
				break;
			case "config": {
				const was = this.desktop;
				this.set({ config: {
					paused: m.paused,
					desktop: m.desktop,
					programs: m.programs
				} });
				const passed = this.desktop !== was ? this.onDesktop?.(this.desktop) : void 0;
				const through = () => {
					if (port !== this.port) return;
					this.configured = true;
					this.arm(this.wantMode && this.allowed);
				};
				Promise.resolve(passed).then(through, through);
				break;
			}
			case "status":
				this.set({ status: {
					enabled: m.enabled,
					panic: m.panic,
					held: m.held,
					front: m.front,
					program: m.program,
					text: m.text
				} });
				break;
			case "error":
				console.warn(`[ob.Pal Link] helper: ${m.code}: ${m.msg}`);
				if (isTypingRefusal(m.code)) this.onTyping?.(m.code);
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
		this.configured = false;
		this.armed = false;
		this.textCap = false;
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
		this.configured = false;
		this.armed = false;
		this.textCap = false;
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
		const field = typingField(this.state);
		if (field !== this.field) {
			this.field = field;
			this.onTextField?.(field);
		}
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
*  - Which phones may control the PC (shared/access.ts): the answers in storage.local, the phone connected now in
*    storage.session. ob.Pal Desktop is armed only for a phone the person at the PC allowed; a phone nobody has
*    answered for yet gets the popup's prompt, a badge, and a notification when those are allowed.
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
native.onDesktop = () => pushConfig();
native.onTextField = (field) => void toOffscreen({
	to: "offscreen",
	type: "text-field",
	field
});
native.onTyping = (refused) => void toOffscreen({
	to: "offscreen",
	type: "typing",
	refused
});
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
var NOTIFY = { permissions: ["notifications"] };
/** The one notification: a phone asks for the PC. Its buttons answer, and a click on it opens the options page's prompt. */
var ASK_NOTE = "obpal-ask";
/** The phone connected now, as the link says (null: none). */
async function currentPhone() {
	const { phone } = await chrome.storage.session.get("phone");
	return parsePhone(phone);
}
/** The person at the PC's answers, per phone. */
async function answers() {
	const { answers: a } = await chrome.storage.local.get("answers");
	return parseAnswers(a);
}
/** The phone the badge and the notification ask about now (its key), or null. */
async function asking() {
	const { asking: key } = await chrome.storage.session.get("asking");
	return typeof key === "string" ? key : null;
}
var reviewed = Promise.resolve();
/**
* Bring the helper and the question in line with who is connected and what they may do: ob.Pal Desktop is armed only
* for the PC target and a phone the person at the PC allowed, and a phone nobody has answered for yet is asked about.
* One review at a time, each reading the state after the one before: so the last to run, after the last change, has
* the last word (an older read never arms the helper for a phone that has gone meanwhile).
*/
function reviewAccess() {
	const review = async () => {
		const [mode, phone, list, pcReady] = await Promise.all([
			targetMode(),
			currentPhone(),
			answers(),
			chrome.permissions.contains(NATIVE_PERMISSION)
		]);
		await native.sync(mode, !!phone && accessOf(list, phone.key) === "allow");
		await showAsk(askFor(mode, phone, list, pcReady));
	};
	reviewed = reviewed.then(review).catch((e) => console.warn("[ob.Pal Link] could not review PC access", e));
	return reviewed;
}
/**
* The question on show: '!' on the toolbar icon while a phone waits (the popup has the prompt), and a notification with
* Allow and Deny while notifications are allowed (options page). Nothing changes while it stays the same question.
*/
async function showAsk(ask) {
	if ((ask?.key ?? null) === await asking()) return;
	await chrome.storage.session.set({ asking: ask?.key ?? null });
	await refreshBadge();
	const notes = chrome.notifications;
	if (!notes?.create) return;
	if (!ask) return void notes.clear(ASK_NOTE).catch(() => {});
	if (!await chrome.permissions.contains(NOTIFY)) return;
	listenToNotes();
	await notes.create(ASK_NOTE, {
		type: "basic",
		iconUrl: chrome.runtime.getURL("icons/icon-128.png"),
		title: `${ask.name} wants to control this PC`,
		message: "Mouse, keyboard and typing, through ob.Pal Desktop",
		buttons: [{ title: "Allow" }, { title: "Deny" }],
		requireInteraction: true,
		priority: 2
	}).catch(() => {});
}
/**
* The person at the PC answers for a phone: the popup's prompt or its PC card, the options page, or the notification.
* Saying no to a phone that had just switched to the PC itself takes it back to the target it had, so it keeps working.
*/
async function answerFor(key, allow) {
	const [phone, list, mode, { phoneSwitch }] = await Promise.all([
		currentPhone(),
		answers(),
		targetMode(),
		chrome.storage.session.get("phoneSwitch")
	]);
	const name = phone?.key === key ? phone.name : list[key]?.name;
	if (!name) return { ok: false };
	await chrome.storage.local.set({ answers: withAnswer(list, {
		key,
		name
	}, allow, Date.now()) });
	if (!allow && phone?.key === key && mode === "pc" && isTargetMode(phoneSwitch) && phoneSwitch !== "pc") await setMode(phoneSwitch, false);
	await reviewAccess();
	if (phone?.key === key) toOffscreen({
		to: "offscreen",
		type: "access",
		key,
		access: allow ? "allow" : "deny"
	});
	return { ok: true };
}
var notesHeard = false;
/** The notification's Allow and Deny, and a click on it. Registered once notifications are allowed. */
function listenToNotes() {
	const notes = chrome.notifications;
	if (notesHeard || !notes?.onButtonClicked) return;
	notesHeard = true;
	notes.onButtonClicked.addListener((id, button) => {
		if (id !== ASK_NOTE) return;
		(async () => {
			const key = await asking();
			if (key) await answerFor(key, button === 0);
		})();
	});
	notes.onClicked.addListener((id) => {
		if (id === ASK_NOTE) chrome.runtime.openOptionsPage().catch(() => {});
	});
}
/**
* A new target. From the phone's tray, the PC is refused for a phone this PC said no to (the target stays), and a
* switch to it is remembered as the phone's own: if the person at the PC says no, the phone goes back to what it had.
*/
async function setMode(mode, fromPhone) {
	const prev = await targetMode();
	if (fromPhone && mode === "pc") {
		const [phone, list] = await Promise.all([currentPhone(), answers()]);
		if (phone && accessOf(list, phone.key) === "deny") return {
			ok: false,
			refused: "deny"
		};
		if (prev !== "pc") await chrome.storage.session.set({ phoneSwitch: prev });
	} else if (mode !== prev) await chrome.storage.session.remove("phoneSwitch");
	await chrome.storage.local.set({ mode });
	await pushConfig();
	await reviewAccess();
	return { ok: true };
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
/**
* What the link document runs with: the controlled tab, the target, and whether the PC target is the whole PC (as
* ob.Pal Desktop last said, from before this worker started if it hasn't said since). Pushed on every change, and the
* answer to a link document that has just started, so a new one never falls back to the game keys on a whole PC.
*/
async function currentConfig() {
	const [tabId, mode, wholePc] = await Promise.all([
		controlledTab(),
		targetMode(),
		native.wholePc()
	]);
	return linkConfig(tabId, mode, wholePc);
}
async function pushConfig() {
	await toOffscreen({
		to: "offscreen",
		type: "config",
		...await currentConfig()
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
var ASK_BADGE = {
	text: "!",
	color: "#FCD34D",
	ink: "#2A1D02"
};
async function clearBadge(tabId) {
	await chrome.action.setBadgeText({
		tabId,
		text: ""
	}).catch(() => {});
}
async function refreshBadge() {
	const [tabId, link, ask] = await Promise.all([
		controlledTab(),
		linkState(),
		asking()
	]);
	await Promise.all([
		chrome.action.setBadgeBackgroundColor({ color: ASK_BADGE.color }),
		chrome.action.setBadgeTextColor({ color: ASK_BADGE.ink }),
		chrome.action.setBadgeText({ text: ask ? ASK_BADGE.text : "" })
	]).catch(() => {});
	if (tabId === null) return;
	const live = link?.status === "connected";
	await Promise.all([
		chrome.action.setBadgeBackgroundColor({
			tabId,
			color: ask ? ASK_BADGE.color : live ? "#C6FF34" : "#5C5C5C"
		}),
		chrome.action.setBadgeTextColor({
			tabId,
			color: ask ? ASK_BADGE.ink : live ? "#172100" : "#F4F4F4"
		}),
		chrome.action.setBadgeText({
			tabId,
			text: ask ? ASK_BADGE.text : "●"
		})
	]).catch(() => {});
}
async function handle(msg, sender) {
	switch (msg.type) {
		case "ensure":
			await ensureOffscreen();
			return { ok: true };
		case "version": return { version: chrome.runtime.getManifest().version };
		case "enable": return msg.on ? enableTab(msg.tabId) : disableTab(msg.tabId);
		case "mode": return setMode(msg.mode, senderKind({
			id: sender.id,
			url: sender.url,
			tabId: sender.tab?.id
		}, SELF) === "offscreen");
		case "pc-connect":
		case "pc-allow":
		case "pc-scope":
		case "pc-forget":
		case "pc-desktop":
		case "pc-macshortcuts":
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
			await chrome.storage.local.set({ answers: withoutAnswer(await answers(), msg.id) });
			await reviewAccess();
			await ensureOffscreen();
			await toOffscreen({
				to: "offscreen",
				type: "forget",
				id: msg.id
			});
			return { ok: true };
		case "lan":
			await ensureOffscreen();
			await toOffscreen({
				to: "offscreen",
				type: "lan",
				id: msg.id
			});
			return { ok: true };
		case "phone":
			await chrome.storage.session.set({ phone: msg.phone });
			await reviewAccess();
			return { access: msg.phone ? accessOf(await answers(), msg.phone.key) : null };
		case "answer": return answerFor(msg.key, msg.allow);
		case "facts": return await toOffscreen({
			to: "offscreen",
			type: "facts"
		}) ?? null;
		case "diag": return await toOffscreen({
			to: "offscreen",
			type: "diag"
		}) ?? null;
		case "link":
			await chrome.storage.session.set({ link: msg.link });
			await refreshBadge();
			return { ok: true };
		case "offscreen-ready": {
			await chrome.storage.session.set({ phone: null });
			await reviewAccess();
			const config = await currentConfig();
			if (config.tabId !== null) tellTab(config.tabId, {
				to: "bridge",
				type: "reconnect"
			});
			if (native.textField) toOffscreen({
				to: "offscreen",
				type: "text-field",
				field: native.textField
			});
			return config;
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
	reviewAccess();
	port.onMessage.addListener((raw) => {
		const f = parseNativeFrame(raw);
		if (f) return native.frame(f);
		const t = parseNativeText(raw);
		if (t) native.text(t);
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
		listenToNotes();
		await reviewAccess();
	})();
});
chrome.permissions.onRemoved.addListener(() => void Promise.all([syncRegistration(), reviewAccess()]));
var warm = () => void Promise.all([syncRegistration(), ensureOffscreen().catch(() => {})]);
chrome.runtime.onStartup.addListener(warm);
chrome.runtime.onInstalled.addListener(warm);
listenToNotes();
reviewAccess();
//#endregion
