//#region ../packages/core/src/pairing.ts
var enc = new TextEncoder();
function b64url(bytes) {
	let s = "";
	for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
	return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s) {
	let t = s.replace(/-/g, "+").replace(/_/g, "/");
	while (t.length % 4) t += "=";
	const bin = atob(t);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}
function concat(...parts) {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
	let o = 0;
	for (const p of parts) {
		out.set(p, o);
		o += p.length;
	}
	return out;
}
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let d = 0;
	for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
	return d === 0;
}
var newSecret = () => crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16));
var randomBytes = (n) => crypto.getRandomValues(new Uint8Array(n));
function encodePairing(p) {
	if (p.room) return `3.${p.capability === "watch" ? "w" : "p"}.${p.room}.${b64url(p.secret)}.${b64url(p.fp)}`;
	return `1.${b64url(p.secret)}.${b64url(p.fp)}`;
}
/** A signaling admission verifier, separate from the DTLS binding MAC. It reveals neither key. */
async function admissionFor(secret) {
	return b64url(await hkdf(secret, enc.encode("obpal admission v2"), "room admission", 32));
}
/** Short links encrypt only scene metadata; the capability secret stays in the browser's URL fragment. */
async function sealShareTarget(secret, target) {
	const key = await shareTargetKey(secret), iv = randomBytes(12);
	const encrypted = await crypto.subtle.encrypt({
		name: "AES-GCM",
		iv
	}, key, enc.encode(JSON.stringify(target)));
	return b64url(concat(iv, new Uint8Array(encrypted)));
}
async function shareTargetKey(secret) {
	const base = await hkdfKey(secret, "deriveKey");
	return crypto.subtle.deriveKey({
		name: "HKDF",
		hash: "SHA-256",
		salt: enc.encode("obpal short link v2"),
		info: enc.encode("scene metadata")
	}, base, {
		name: "AES-GCM",
		length: 256
	}, false, ["encrypt", "decrypt"]);
}
/** Public room id: a hash of the secret, so the room service never learns the secret. */
async function roomIdFor(secret) {
	const d = await crypto.subtle.digest("SHA-256", concat(enc.encode("obpal-room-v1"), secret));
	return b64url(new Uint8Array(d)).slice(0, 22);
}
/**
* The SHA-256 DTLS fingerprint an SDP blob commits to, read strictly: the description must have exactly one media
* section and exactly one `a=fingerprint` line (at session level or in that section, so it is the one DTLS checks),
* and it must be a well-formed sha-256 fingerprint. Anything else is null. A description that says more (a second
* fingerprint anywhere, one hidden in another line's text, a second media section) could show one fingerprint to
* this parser and another to DTLS, which is how someone relaying between two DTLS sessions would pass a check.
*/
function sdpFingerprint(sdp) {
	const lines = (sdp ?? "").split(/\r?\n/);
	if (lines.filter((l) => l.startsWith("m=")).length !== 1) return null;
	const fps = lines.filter((l) => l.startsWith("a=fingerprint:"));
	if (fps.length !== 1) return null;
	const m = /^a=fingerprint:sha-256 ((?:[0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2})$/i.exec(fps[0].trimEnd());
	return m ? Uint8Array.from(m[1].split(":").map((h) => parseInt(h, 16))) : null;
}
/**
* The session an SDP blob belongs to: its o= line's session id, which stays the same through every offer one peer
* connection makes (RFC 8829 §5.2.2), so a later offer with it renegotiates that connection. Null without one.
*/
function sdpSession(sdp) {
	return /^o=\S+ (\d{1,20}) \d+ IN /m.exec(sdp ?? "")?.[1] ?? null;
}
/** Fingerprint as SDP writes it: upper-case hex pairs joined by colons. */
var fingerprintHex = (fp) => Array.from(fp, (b) => b.toString(16).padStart(2, "0").toUpperCase()).join(":");
/** Fingerprint of a certificate, via getFingerprints() or a throwaway offer where unsupported. */
async function certFingerprint(cert) {
	const f = (cert.getFingerprints?.())?.find((x) => x.algorithm?.toLowerCase() === "sha-256");
	if (f?.value) return Uint8Array.from(f.value.split(":").map((h) => parseInt(h, 16)));
	const pc = new RTCPeerConnection({ certificates: [cert] });
	pc.createDataChannel("fp");
	const offer = await pc.createOffer();
	pc.close();
	const fp = sdpFingerprint(offer.sdp);
	if (!fp) throw new Error("Could not read the DTLS fingerprint");
	return fp;
}
/**
* A remembered pairing's key as both ends keep it: a non-extractable HKDF key, good for the binding's MAC (deriveKey)
* and the direct code's ICE credentials (deriveBits). Script can use it, but no script, the page's own included, can
* read it back.
*/
function importPairKey(raw) {
	return crypto.subtle.importKey("raw", raw, "HKDF", false, ["deriveBits", "deriveKey"]);
}
/** HKDF's input key: bytes are imported for this one use, and a kept key is used as it is. */
var hkdfKey = (key, usage) => key instanceof Uint8Array ? crypto.subtle.importKey("raw", key, "HKDF", false, [usage]) : Promise.resolve(key);
async function hkdf(key, salt, info, bytes) {
	const base = await hkdfKey(key, "deriveBits");
	const bits = await crypto.subtle.deriveBits({
		name: "HKDF",
		hash: "SHA-256",
		salt,
		info: enc.encode(info)
	}, base, bytes * 8);
	return new Uint8Array(bits);
}
/**
* Channel binding: proves the device holds the pairing key and binds it to both DTLS identities and to the
* context of this attempt (the room id online, "lan:<nonce>" for a direct LAN connection).
* mac = HMAC-SHA256(HKDF(key, salt=context, info="obpal bind v1"), fpDevice || fpHost || context)
*/
async function bindMac(key, fpDevice, fpHost, context) {
	const base = await hkdfKey(key, "deriveKey");
	const mac = await crypto.subtle.deriveKey({
		name: "HKDF",
		hash: "SHA-256",
		salt: enc.encode(context),
		info: enc.encode("obpal bind v1")
	}, base, {
		name: "HMAC",
		hash: "SHA-256",
		length: 256
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", mac, concat(fpDevice, fpHost, enc.encode(context)));
	return b64url(new Uint8Array(sig));
}
/** The direct code's binding context (also the salt of the derived ICE credentials). */
var lanContext = (nonce) => `lan:${b64url(nonce)}`;
var UUID = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i;
var IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
var IPV6 = /^[0-9a-f:]+(%[A-Za-z0-9._-]{1,16})?$/i;
var HOSTNAME = /^[A-Za-z0-9]([A-Za-z0-9-]{0,62}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,62}[A-Za-z0-9])?)*$/;
var isLanHost = (h) => h.length <= 253 && (IPV4.test(h) || h.includes(":") && IPV6.test(h) || HOSTNAME.test(h));
var uuidBytes = (name) => {
	const m = UUID.exec(name);
	if (!m) return null;
	const hex = m.slice(1).join("");
	return Uint8Array.from({ length: 16 }, (_, i) => parseInt(hex.slice(i * 2, i * 2 + 2), 16));
};
/** mDNS names (36-char UUIDs) shrink to 22 characters; everything else travels as written. */
function encodeCandidate(c) {
	const u = c.host.endsWith(".local") ? uuidBytes(c.host.slice(0, -6)) : null;
	return `${u ? `m${b64url(u)}` : `a${c.host}`}~${c.port}`;
}
/** The direct code: `2.<id>.<nonce>.<ufrag>.<pwd>.<candidates>`, in the same URL fragment position as the online code. */
function encodeLanPairing(p) {
	return `2.${b64url(p.id)}.${b64url(p.nonce)}.${p.ufrag}.${p.pwd}.${p.cands.slice(0, 4).map(encodeCandidate).join(",")}`;
}
/**
* The phone's ICE credentials for a direct code, known to both sides without any exchange:
* HKDF-SHA256(key, salt = nonce, info = "obpal lan ice v1") -> 24 bytes -> base64 (the ice-char alphabet):
* 8 characters of ufrag and 24 of password.
*/
async function lanIceCredentials(key, nonce) {
	const bytes = await hkdf(key, nonce, "obpal lan ice v1", 24);
	const s = btoa(String.fromCharCode(...bytes));
	return {
		ufrag: s.slice(0, 8),
		pwd: s.slice(8, 32)
	};
}
/** Read the ICE credentials and UDP host candidates of a gathered local description. */
function readLocalIce(sdp) {
	const ufrag = /^a=ice-ufrag:(\S+)/m.exec(sdp ?? "")?.[1];
	const pwd = /^a=ice-pwd:(\S+)/m.exec(sdp ?? "")?.[1];
	if (!ufrag || !pwd) return null;
	return {
		ufrag,
		pwd,
		cands: candidatesOf(sdp ?? "")
	};
}
/** UDP host candidates from candidate lines (SDP a= lines or RTCIceCandidate.candidate strings), deduplicated. */
function candidatesOf(text) {
	const out = [];
	for (const m of text.matchAll(/candidate:\S+ 1 udp \d+ (\S+) (\d+) typ host/gi)) {
		const c = {
			host: m[1],
			port: Number(m[2])
		};
		if (isLanHost(c.host) && c.port > 0 && !out.some((o) => o.host === c.host && o.port === c.port)) out.push(c);
	}
	return out.slice(0, 4);
}
var sdpHead = (ufrag, pwd, fp, setup) => [
	"v=0",
	"o=- 0 0 IN IP4 127.0.0.1",
	"s=-",
	"t=0 0",
	"a=group:BUNDLE 0",
	"a=msid-semantic: WMS",
	"m=application 9 UDP/DTLS/SCTP webrtc-datachannel",
	"c=IN IP4 0.0.0.0",
	`a=ice-ufrag:${ufrag}`,
	`a=ice-pwd:${pwd}`,
	"a=ice-options:trickle",
	`a=fingerprint:sha-256 ${fingerprintHex(fp)}`,
	`a=setup:${setup}`,
	"a=mid:0",
	"a=sctp-port:5000",
	"a=max-message-size:262144"
];
/** The phone's answer as the host reconstructs it: derived credentials, the remembered phone fingerprint, no candidates. */
function lanAnswerSdp(p) {
	return [...sdpHead(p.ufrag, p.pwd, p.fp, "active"), ""].join("\r\n");
}
var glyph = (name, pattern) => Object.freeze({
	name,
	rows: Object.freeze(pattern.split("/"))
});
/** Each occupied cell is one round dot. Large gaps preserve the objects at 28 pixels. */
var SEAL_GLYPHS = Object.freeze([
	glyph("comet", ".......###./......#####/......#####/.......###./..##..###../.###.###.../###.###..../...###...../..###....../.###......./###........"),
	glyph("anchor", "....###..../...##.##.../....###..../.....#...../..#######../.....#...../##...#...##/##...#...##/.##..#..##./..#######../....###...."),
	glyph("leaf", ".......###./....#######/...########/..####..###/.####..####/####..####./###..####../##..####.../##.####..../.#####...../###........"),
	glyph("balloon", "...#####.../..#######../.#########./.#########./.#########./..#######../...#####.../....###..../.....#...../....##...../.....##...."),
	glyph("bell", "....###..../...#####.../..#######../..#######../..#######../..#######../.#########./###########/###########/....###..../....###...."),
	glyph("boot", "..####...../..####...../..####...../..####...../..####...../..####...../..######.../..########./###########/###########/###...#####"),
	glyph("bow", ".###...###./#####.#####/#####.#####/.#########./..#######../...#####.../...#####.../..###.###../..##...##../.###...###./.##.....##."),
	glyph("bridge", "##.......##/##.......##/###########/###########/####...####/###.....###/##.......##/##.......##/##.......##/###########/###########"),
	glyph("butterfly", "..#.....#../..##...##../####.#.####/#####.#####/###########/.#########./...#####.../.#########./####.#.####/.###.#.###./..##...##.."),
	glyph("cactus", ".....##..../....####.##/....####.##/##..####.##/##..#######/##..######./##..####.../########.../.#######.../....####.../....####..."),
	glyph("castle", "##..###..##/##..###..##/###########/###########/###########/###########/####...####/###.....###/###.....###/###.....###/###.....###"),
	glyph("cat", "..#...#..../..##.##..../..#####..../..#.#.#..../..#####..../...###...../..#####..../.######..../.######..##/.######..##/.#########."),
	glyph("chair", "..##......./..##......./..##......./..##......./..##......./..##......./..#########/..#########/..##.....##/..##.....##/..##.....##"),
	glyph("cherry", ".....####../....#####../...##.###../...#..##.../..##...##../..#.....#../.###...###./#####.#####/#####.#####/.###..#####/.......###."),
	glyph("cloud", ".........../....###..../...#####.../.########../##########./###########/###########/###########/.#########./.........../..........."),
	glyph("crown", ".....#...../....###..../#...###...#/##.#####.##/###########/###########/.#########./.#########./..#######../..#######../..........."),
	glyph("cup", ".........../.#########./.##########/.######..##/.######..##/.##########/.#########./..#####..../...###...../#########../#########.."),
	glyph("dice", ".#########./###########/##..###..##/##..###..##/###########/####...####/###########/##..###..##/##..###..##/###########/.#########."),
	glyph("fish", ".........../....##...##/..#####.###/.##########/##..#######/##..#######/.##########/..#####.###/....##...##/.........../..........."),
	glyph("flag", ".##......../.########../.#########./.##########/.##########/.####..####/.##.....###/.##......../.##......../.##......../.##........"),
	glyph("flower", "....###..../...#####.../...#####.../.###...###./####...####/####...####/####...####/.###...###./...#####.../...#####.../....###...."),
	glyph("fork", "##..###..##/##..###..##/##..###..##/##..###..##/.#########./..#######../...#####.../....###..../....###..../....###..../....###...."),
	glyph("glasses", ".........../.##.....##./##.......##/#####.#####/###########/##.##.##.##/##.##.##.##/##.##.##.##/#####.#####/.###...###./..........."),
	glyph("guitar", "........###/.......####/......###../.....###.../...####..../..######.../.###..###../####..###../#########../.#######.../..#####...."),
	glyph("hammer", "###########/###########/###########/#####.#####/....###..../....###..../....###..../....###..../....###..../....###..../....###...."),
	glyph("hat", ".........../...#####.../...#####.../...#####.../...#####.../...#####.../...#####.../###########/###########/.........../..........."),
	glyph("heart", ".###...###./#####.#####/###########/###########/###########/.#########./..#######../...#####.../....###..../.....#...../..........."),
	glyph("house", ".....#...../....###..../...#####.../..#######../.#########./###########/..#######../..##...##../..##...##../..##...##../..##...##.."),
	glyph("key", ".####....../##..##...../##..##...../##..##...../.#####...../...####..../....####.##/.....######/......####./.......####/........###"),
	glyph("kite", ".....#...../....###..../...#####.../..#######../.#########./..#######../...#####.../....###..../.....#.#.../.....###.../.......##.."),
	glyph("ladder", "..##...##../..#######../..#######../..##...##../..#######../..#######../..##...##../..#######../..#######../..##...##../..##...##.."),
	glyph("lamp", "...#####.../...#####.../..##...##../..##...##../.##.....##./###########/....###..../....###..../....###..../....###..../..#######.."),
	glyph("lightning", "......###../.....###.../....###..../...###...../..########./.########../.....###.../....###..../...###...../..###....../.###......."),
	glyph("magnet", ".###...###./.###...###./.###...###./.###...###./.###...###./.###...###./.###...###./.###...###./.#########./..#######../...#####..."),
	glyph("mountain", "...#......./..###....../..###...#../.#####.###./.##.####.#./###..###.##/###########/###########/###########/###########/###########"),
	glyph("mushroom", "...#####.../..#######../.##..#####./###..##..##/#######..##/###########/###########/....###..../....###..../...#####.../...#####..."),
	glyph("music", ".........../......####./..########./..#####.##./..##....##./..##....##./..##....##./..##...###./.###..####./####..####./####...##.."),
	glyph("envelope", ".........../###########/###.....###/####...####/##.#####.##/##..###..##/##...#...##/##.......##/###########/###########/..........."),
	glyph("octopus", "...#####.../..#######../..##.#.##../..##.#.##../..#######../...#####.../..#######../.##.###.##./##..#.#..##/##..#.#..##/.##.#.#.##."),
	glyph("owl", ".##.....##./.####.####./.#########./.##..#..##./.##..#..##./.#########./..###.###../..#######../..#######../...#####.../...##.##..."),
	glyph("lock", "...#####.../..#######../..##...##../..##...##../..##...##../.#########./.#########./.####.####./.####.####./.#########./.#########."),
	glyph("pencil", "........##./.......####/......#####/.....#####./....#####../...#####.../..#####..../.#####...../.####....../.###......./.#........."),
	glyph("pineapple", "..#..#..#../..#######../...#####.../...#####.../..#######../.###.#.###./.##.###.##./.###.#.###./.##.###.##./..#######../...#####..."),
	glyph("plane", "....###..../....###..../....###..../....###..../...#####.../..#######../###########/###########/....###..../...#####.../..#######.."),
	glyph("plug", "..##...##../..##...##../..##...##../.#########./.#########./.#########./..#######../...#####.../....###..../....###..../....###...."),
	glyph("puzzle", "....###..../....###..../.#########./.#########./#######...#/#######...#/#######...#/.#########./.#########./.###...###./.###...###."),
	glyph("rocket", ".....#...../....###..../...#####.../...#...#.../...#...#.../...#####.../.#########./###.###.###/##..###..##/...#.#.#.../...#.#.#..."),
	glyph("sailboat", ".....#...../....##...../...###.#.../..####.##../.#####.###./######.####/.....#...../###########/.#########./..#######../..........."),
	glyph("scissors", ".##.....##./..##...##../...##.##.../....###..../.....#...../....###..../.####.####./##..###..##/##..#.#..##/##..#.#..##/.###...###."),
	glyph("shell", "...#####.../.####.####./###.#.#.###/###.#.#.###/###.#.#.###/.##.#.#.##./..#.#.#.#../..#######../...#####.../...#####.../....###...."),
	glyph("shirt", "..##...##../.###...###./####...####/###########/###########/##.#####.##/...#####.../...#####.../...#####.../...#####.../...#####..."),
	glyph("snowflake", "..#..#..#../..##.#.##../...#####.../.#..###..#./.####.####./...#####.../.####.####./.#..###..#./...#####.../..##.#.##../..#..#..#.."),
	glyph("spider", "#.#.....#.#/#.##...##.#/.#.#####.#./..#######../.#########./##.#####.##/...#####.../##.#####.##/.#.#####.#./#.##...##.#/#.#.....#.#"),
	glyph("spoon", "...#####.../..#######../..#######../..#######../...#####.../....###..../....###..../....###..../....###..../....###..../....###...."),
	glyph("sun", ".....#...../.#...#...#./..#.....#../....###..../...#####.../##.#####.##/...#####.../....###..../..#.....#../.#...#...#./.....#....."),
	glyph("tent", ".....#...../....###..../....###..../...#####.../...#####.../..#######../..###.###../.###...###./.###...###./###.....###/###.....###"),
	glyph("train", "..#######../.#########./.##..#..##./.##..#..##./.#########./.#########./.##..#..##./.#########./..#######../.###...###./###.....###"),
	glyph("tree", ".....#...../....###..../...#####.../.....#...../...#####.../..#######../.....#...../..#######../###########/....###..../....###...."),
	glyph("trophy", "..#######../..#######../###########/##.#####.##/##.#####.##/.#########./...#####.../....###..../....###..../..#######../..#######.."),
	glyph("umbrella", ".....#...../...#####.../..#######../.#########./###########/###########/.....##..../.....##..../.##..##..../.##..##..../..####....."),
	glyph("wave", "....#####../..########./.####..###./.###....##./###......../###......../###....##../####..####./.##########/###########/###########"),
	glyph("whale", "...#.#...../....#....../....#....../...#####.../.########../#########.#/##.########/##.########/#########.#/.########../...#####..."),
	glyph("windmill", "..##....##./..###..###./...######../#######..../###########/....#######/..######.../.###.###.../.##..####../....#####../...#######."),
	glyph("wrench", ".......#.##/......##.##/.....###.##/.....######/.....#####./....#####../...####..../..####...../.####....../####......./###........")
]);
var dots = SEAL_GLYPHS.map(({ rows }) => Object.freeze(rows.flatMap((row, y) => [...row].flatMap((cell, x) => cell === "#" ? [Object.freeze({
	x: (x + .5) / 11,
	y: (y + .5) / 11
})] : []))));
/** Dot centres within the unit square, in row order. */
function glyphDots(index) {
	if (!Number.isInteger(index) || index < 0 || index >= dots.length) throw new RangeError("Invalid seal glyph");
	return dots[index];
}
//#endregion
//#region ../packages/core/src/seal.ts
/**
* Online: the ordered, verified DTLS fingerprints and room. LAN: the remembered key, salted by both fingerprints
* and the fresh LAN context. Peers authenticate a fresh session nonce before using it here, even with persistent
* certificates. A separate HKDF label keeps this display value apart from authentication and ICE keys.
*/
async function connectionSeal(fpDevice, fpHost, context, lanKey, nonce = "") {
	if (fpDevice.length !== 32 || fpHost.length !== 32 || !context) throw new Error("Invalid seal binding");
	const enc = new TextEncoder();
	const room = enc.encode(nonce ? sealSessionContext(context, nonce) : context);
	const binding = new Uint8Array(64 + room.length);
	binding.set(fpDevice);
	binding.set(fpHost, 32);
	binding.set(room, 64);
	const key = lanKey instanceof Uint8Array ? await importPairKey(lanKey) : lanKey ?? await importPairKey(binding);
	const bits = new Uint8Array(await crypto.subtle.deriveBits({
		name: "HKDF",
		hash: "SHA-256",
		salt: binding,
		info: enc.encode("obpal connection seal v1")
	}, key, 24));
	return [
		bits[0] >> 2,
		(bits[0] & 3) << 4 | bits[1] >> 4,
		(bits[1] & 15) << 2 | bits[2] >> 6
	];
}
/** Freshness is authenticated by a MAC under the already-proven pairing key before either end shows the seal. */
function sealSessionContext(context, nonce) {
	if (!/^[A-Za-z0-9_-]{22}$/.test(nonce)) throw new Error("Invalid seal nonce");
	return `${context}\0seal:${nonce}`;
}
var sealNames = (seal) => seal.map((i) => SEAL_GLYPHS[i].name).join(", ");
//#endregion
export { sdpFingerprint as C, roomIdFor as S, sealShareTarget as T, lanContext as _, glyphDots as a, randomBytes as b, bindMac as c, encodeLanPairing as d, encodePairing as f, lanAnswerSdp as g, importPairKey as h, SEAL_GLYPHS as i, candidatesOf as l, fromB64url as m, sealNames as n, admissionFor as o, equalBytes as p, sealSessionContext as r, b64url as s, connectionSeal as t, certFingerprint as u, lanIceCredentials as v, sdpSession as w, readLocalIce as x, newSecret as y };
