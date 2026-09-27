(function() {
	var ACCENT_KEY = "bb_accent";
	/** The family's default surface, worn while nothing is cached (so the first paint matches what the family applies). */
	var DEFAULT_THEME = "carbon";
	var ID = /^[a-z]{1,16}$/;
	var isId = (x) => typeof x === "string" && ID.test(x);
	/**
	* The cached look as the attributes the family and ./look.ts set on <html>, for the first paint: the surface (the
	* cookie first, as the family reads it, then localStorage), ob.Pal as the product, and a chosen accent.
	*/
	function wearCachedLook(root, cookie, storage) {
		const read = (key) => {
			try {
				return storage?.getItem(key) ?? null;
			} catch {
				return null;
			}
		};
		const cached = new RegExp(`(?:^|;\\s*)bb_theme=([a-z]+)`).exec(cookie)?.[1] ?? read("bb_theme");
		const theme = isId(cached) ? cached : DEFAULT_THEME;
		root.setAttribute("data-bb-product", "obpal");
		root.setAttribute("data-bb-theme", theme);
		root.dataset.theme = theme;
		const accent = read(ACCENT_KEY);
		if (isId(accent) && accent !== "product") root.setAttribute("data-bb-accent", accent);
	}
	//#endregion
	//#region src/ui/first-paint.ts
	/**
	* The look before the first paint: a classic script in the options page's <head>, built on its own (first-paint.js).
	* It runs before the page is drawn and puts the last look on <html> from its cache (./lookcache.ts), so a light or
	* other surface never shows the default one first. MV3 allows no inline script, and the page's module is deferred
	* (it may run after the first paint); ./look.ts takes over from there. The popup needs none: Chrome shows it only
	* once it has loaded, by when its module has put the look on.
	*/
	var storage = null;
	try {
		storage = localStorage;
	} catch {}
	wearCachedLook(document.documentElement, document.cookie, storage);
	//#endregion
})();
