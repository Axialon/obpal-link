//#region ../packages/host/src/origin.ts
var OFFICIAL_ORIGIN = "https://obpal.blackboxes.net";
/** Exact origins only. Local loopback is for development, never a similarly named public host. */
function isOfficialOrigin(origin) {
	if (origin === "chrome-extension://jnnpcnoilofjaffabnhecfokjjknlemg") return true;
	try {
		const u = new URL(origin);
		return u.origin === "https://obpal.blackboxes.net" || ["http:", "https:"].includes(u.protocol) && [
			"localhost",
			"127.0.0.1",
			"[::1]"
		].includes(u.hostname);
	} catch {
		return false;
	}
}
/** An honest fork can keep this disclosure. A malicious copy can remove it; it is not authentication. */
function communityMarker(origin) {
	if (isOfficialOrigin(origin)) return null;
	const a = document.createElement("a");
	a.className = "community-build";
	a.href = `${OFFICIAL_ORIGIN}/trust/`;
	a.textContent = "Community build: not run by ob.Pal";
	a.rel = "noopener";
	return a;
}
//#endregion
export { communityMarker as t };
