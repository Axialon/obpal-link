(function() {
	//#region src/shared/constants.ts
	/**
	* ob.Pal room service (signaling + TURN credentials). Also the only required host permission. A build of your own
	* names yours: OBPAL_PUBLIC_ORIGIN=https://your.host pnpm run build:extension (spec/SECURITY.md §6).
	*/
	var SERVICE = "https://obpal.blackboxes.net";
	//#endregion
	//#region src/shared/desktop-guide.ts
	var DESKTOP_GUIDE_CHANNEL = "obpal-link/desktop-guide/v1";
	`${SERVICE}`;
	`${SERVICE}`;
	/** No phone identities, paths, permissions, input, credentials or native error strings cross into the page. */
	function guideStatus(pc) {
		return {
			channel: DESKTOP_GUIDE_CHANNEL,
			status: pc.link,
			...typeof pc.version === "string" && /^[0-9]+(?:\.[0-9]+){1,3}$/.test(pc.version) ? { version: pc.version } : {}
		};
	}
	function parseGuideStatus(raw) {
		if (!raw || typeof raw !== "object") return null;
		const value = raw;
		if (value.channel !== "obpal-link/desktop-guide/v1" || ![
			"off",
			"permission",
			"connecting",
			"missing",
			"error",
			"ready"
		].includes(value.status)) return null;
		return guideStatus({
			link: value.status,
			version: value.version ?? null
		});
	}
	//#endregion
	//#region src/content/desktop-guide.ts
	var timer;
	async function report() {
		clearTimeout(timer);
		if (document.hidden) return;
		try {
			const status = parseGuideStatus(await chrome.runtime.sendMessage({
				to: "bg",
				type: "desktop-guide-status"
			}));
			if (status) window.postMessage(status, location.origin);
		} catch {}
		timer = setTimeout(report, 2e3);
	}
	document.addEventListener("click", (event) => {
		if (event.isTrusted && event.target.closest("#desktop-check")) try {
			chrome.runtime.sendMessage({
				to: "bg",
				type: "desktop-guide-open"
			}).catch(() => {});
		} catch {}
	});
	document.addEventListener("visibilitychange", () => {
		clearTimeout(timer);
		if (!document.hidden) report();
	});
	window.addEventListener("pagehide", () => clearTimeout(timer));
	window.addEventListener("pageshow", () => void report());
	report();
	//#endregion
})();
