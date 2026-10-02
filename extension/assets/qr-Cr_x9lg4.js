import { c as parseColor, l as toHex, o as darkenTo, s as lightenTo } from "./origin-Bxajh2ze.js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region ../node_modules/.pnpm/uqr@0.1.3/node_modules/uqr/dist/index.mjs
var QrCodeDataType = /* @__PURE__ */ ((QrCodeDataType2) => {
	QrCodeDataType2[QrCodeDataType2["Border"] = -1] = "Border";
	QrCodeDataType2[QrCodeDataType2["Data"] = 0] = "Data";
	QrCodeDataType2[QrCodeDataType2["Function"] = 1] = "Function";
	QrCodeDataType2[QrCodeDataType2["Position"] = 2] = "Position";
	QrCodeDataType2[QrCodeDataType2["Timing"] = 3] = "Timing";
	QrCodeDataType2[QrCodeDataType2["Alignment"] = 4] = "Alignment";
	return QrCodeDataType2;
})(QrCodeDataType || {});
var LOW = [0, 1];
var MEDIUM = [1, 0];
var QUARTILE = [2, 3];
var HIGH = [3, 2];
var EccMap = {
	L: LOW,
	M: MEDIUM,
	Q: QUARTILE,
	H: HIGH
};
var NUMERIC_REGEX = /^\d*$/;
var ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+./:-]*$/;
var ALPHANUMERIC_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
var MIN_VERSION = 1;
var MAX_VERSION = 40;
var PENALTY_N1 = 3;
var PENALTY_N2 = 3;
var PENALTY_N3 = 40;
var PENALTY_N4 = 10;
var ECC_CODEWORDS_PER_BLOCK = [
	[
		-1,
		7,
		10,
		15,
		20,
		26,
		18,
		20,
		24,
		30,
		18,
		20,
		24,
		26,
		30,
		22,
		24,
		28,
		30,
		28,
		28,
		28,
		28,
		30,
		30,
		26,
		28,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	],
	[
		-1,
		10,
		16,
		26,
		18,
		24,
		16,
		18,
		22,
		22,
		26,
		30,
		22,
		22,
		24,
		24,
		28,
		28,
		26,
		26,
		26,
		26,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28,
		28
	],
	[
		-1,
		13,
		22,
		18,
		26,
		18,
		24,
		18,
		22,
		20,
		24,
		28,
		26,
		24,
		20,
		30,
		24,
		28,
		28,
		26,
		30,
		28,
		30,
		30,
		30,
		30,
		28,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	],
	[
		-1,
		17,
		28,
		22,
		16,
		22,
		28,
		26,
		26,
		24,
		28,
		24,
		28,
		22,
		24,
		24,
		30,
		28,
		28,
		26,
		28,
		30,
		24,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30,
		30
	]
];
var NUM_ERROR_CORRECTION_BLOCKS = [
	[
		-1,
		1,
		1,
		1,
		1,
		1,
		2,
		2,
		2,
		2,
		4,
		4,
		4,
		4,
		4,
		6,
		6,
		6,
		6,
		7,
		8,
		8,
		9,
		9,
		10,
		12,
		12,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		19,
		20,
		21,
		22,
		24,
		25
	],
	[
		-1,
		1,
		1,
		1,
		2,
		2,
		4,
		4,
		4,
		5,
		5,
		5,
		8,
		9,
		9,
		10,
		10,
		11,
		13,
		14,
		16,
		17,
		17,
		18,
		20,
		21,
		23,
		25,
		26,
		28,
		29,
		31,
		33,
		35,
		37,
		38,
		40,
		43,
		45,
		47,
		49
	],
	[
		-1,
		1,
		1,
		2,
		2,
		4,
		4,
		6,
		6,
		8,
		8,
		8,
		10,
		12,
		16,
		12,
		17,
		16,
		18,
		21,
		20,
		23,
		23,
		25,
		27,
		29,
		34,
		34,
		35,
		38,
		40,
		43,
		45,
		48,
		51,
		53,
		56,
		59,
		62,
		65,
		68
	],
	[
		-1,
		1,
		1,
		2,
		4,
		4,
		4,
		5,
		6,
		8,
		8,
		11,
		11,
		16,
		16,
		18,
		16,
		19,
		21,
		25,
		25,
		25,
		34,
		30,
		32,
		35,
		37,
		40,
		42,
		45,
		48,
		51,
		54,
		57,
		60,
		63,
		66,
		70,
		74,
		77,
		81
	]
];
var QrCode = class {
	constructor(version, ecc, dataCodewords, msk) {
		this.version = version;
		this.ecc = ecc;
		if (version < MIN_VERSION || version > MAX_VERSION) throw new RangeError("Version value out of range");
		if (msk < -1 || msk > 7) throw new RangeError("Mask value out of range");
		this.size = version * 4 + 17;
		const row = Array.from({ length: this.size }).fill(false);
		for (let i = 0; i < this.size; i++) {
			this.modules.push(row.slice());
			this.types.push(row.map(() => 0));
		}
		this.drawFunctionPatterns();
		const allCodewords = this.addEccAndInterleave(dataCodewords);
		this.drawCodewords(allCodewords);
		if (msk === -1) {
			let minPenalty = 1e9;
			for (let i = 0; i < 8; i++) {
				this.applyMask(i);
				this.drawFormatBits(i);
				const penalty = this.getPenaltyScore();
				if (penalty < minPenalty) {
					msk = i;
					minPenalty = penalty;
				}
				this.applyMask(i);
			}
		}
		this.mask = msk;
		this.applyMask(msk);
		this.drawFormatBits(msk);
	}
	size;
	mask;
	modules = [];
	types = [];
	getModule(x, y) {
		return x >= 0 && x < this.size && y >= 0 && y < this.size && this.modules[y][x];
	}
	drawFunctionPatterns() {
		for (let i = 0; i < this.size; i++) {
			this.setFunctionModule(6, i, i % 2 === 0, QrCodeDataType.Timing);
			this.setFunctionModule(i, 6, i % 2 === 0, QrCodeDataType.Timing);
		}
		this.drawFinderPattern(3, 3);
		this.drawFinderPattern(this.size - 4, 3);
		this.drawFinderPattern(3, this.size - 4);
		const alignPatPos = this.getAlignmentPatternPositions();
		const numAlign = alignPatPos.length;
		for (let i = 0; i < numAlign; i++) for (let j = 0; j < numAlign; j++) if (!(i === 0 && j === 0 || i === 0 && j === numAlign - 1 || i === numAlign - 1 && j === 0)) this.drawAlignmentPattern(alignPatPos[i], alignPatPos[j]);
		this.drawFormatBits(0);
		this.drawVersion();
	}
	drawFormatBits(mask) {
		const data = this.ecc[1] << 3 | mask;
		let rem = data;
		for (let i = 0; i < 10; i++) rem = rem << 1 ^ (rem >>> 9) * 1335;
		const bits = (data << 10 | rem) ^ 21522;
		for (let i = 0; i <= 5; i++) this.setFunctionModule(8, i, getBit(bits, i));
		this.setFunctionModule(8, 7, getBit(bits, 6));
		this.setFunctionModule(8, 8, getBit(bits, 7));
		this.setFunctionModule(7, 8, getBit(bits, 8));
		for (let i = 9; i < 15; i++) this.setFunctionModule(14 - i, 8, getBit(bits, i));
		for (let i = 0; i < 8; i++) this.setFunctionModule(this.size - 1 - i, 8, getBit(bits, i));
		for (let i = 8; i < 15; i++) this.setFunctionModule(8, this.size - 15 + i, getBit(bits, i));
		this.setFunctionModule(8, this.size - 8, true);
	}
	drawVersion() {
		if (this.version < 7) return;
		let rem = this.version;
		for (let i = 0; i < 12; i++) rem = rem << 1 ^ (rem >>> 11) * 7973;
		const bits = this.version << 12 | rem;
		for (let i = 0; i < 18; i++) {
			const color = getBit(bits, i);
			const a = this.size - 11 + i % 3;
			const b = Math.floor(i / 3);
			this.setFunctionModule(a, b, color);
			this.setFunctionModule(b, a, color);
		}
	}
	drawFinderPattern(x, y) {
		for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
			const dist = Math.max(Math.abs(dx), Math.abs(dy));
			const xx = x + dx;
			const yy = y + dy;
			if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4, QrCodeDataType.Position);
		}
	}
	drawAlignmentPattern(x, y) {
		for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1, QrCodeDataType.Alignment);
	}
	setFunctionModule(x, y, isDark, type = QrCodeDataType.Function) {
		this.modules[y][x] = isDark;
		this.types[y][x] = type;
	}
	addEccAndInterleave(data) {
		const ver = this.version;
		const ecl = this.ecc;
		if (data.length !== getNumDataCodewords(ver, ecl)) throw new RangeError("Invalid argument");
		const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl[0]][ver];
		const blockEccLen = ECC_CODEWORDS_PER_BLOCK[ecl[0]][ver];
		const rawCodewords = Math.floor(getNumRawDataModules(ver) / 8);
		const numShortBlocks = numBlocks - rawCodewords % numBlocks;
		const shortBlockLen = Math.floor(rawCodewords / numBlocks);
		const blocks = [];
		const rsDiv = reedSolomonComputeDivisor(blockEccLen);
		for (let i = 0, k = 0; i < numBlocks; i++) {
			const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
			k += dat.length;
			const ecc = reedSolomonComputeRemainder(dat, rsDiv);
			if (i < numShortBlocks) dat.push(0);
			blocks.push(dat.concat(ecc));
		}
		const result = [];
		for (let i = 0; i < blocks[0].length; i++) blocks.forEach((block, j) => {
			if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
		});
		return result;
	}
	drawCodewords(data) {
		if (data.length !== Math.floor(getNumRawDataModules(this.version) / 8)) throw new RangeError("Invalid argument");
		let i = 0;
		for (let right = this.size - 1; right >= 1; right -= 2) {
			if (right === 6) right = 5;
			for (let vert = 0; vert < this.size; vert++) for (let j = 0; j < 2; j++) {
				const x = right - j;
				const y = (right + 1 & 2) === 0 ? this.size - 1 - vert : vert;
				if (!this.types[y][x] && i < data.length * 8) {
					this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
					i++;
				}
			}
		}
	}
	applyMask(mask) {
		if (mask < 0 || mask > 7) throw new RangeError("Mask value out of range");
		for (let y = 0; y < this.size; y++) for (let x = 0; x < this.size; x++) {
			let invert;
			switch (mask) {
				case 0:
					invert = (x + y) % 2 === 0;
					break;
				case 1:
					invert = y % 2 === 0;
					break;
				case 2:
					invert = x % 3 === 0;
					break;
				case 3:
					invert = (x + y) % 3 === 0;
					break;
				case 4:
					invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
					break;
				case 5:
					invert = x * y % 2 + x * y % 3 === 0;
					break;
				case 6:
					invert = (x * y % 2 + x * y % 3) % 2 === 0;
					break;
				case 7:
					invert = ((x + y) % 2 + x * y % 3) % 2 === 0;
					break;
				default: throw new Error("Unreachable");
			}
			if (!this.types[y][x] && invert) this.modules[y][x] = !this.modules[y][x];
		}
	}
	getPenaltyScore() {
		let result = 0;
		for (let y = 0; y < this.size; y++) {
			let runColor = false;
			let runX = 0;
			const runHistory = [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (let x = 0; x < this.size; x++) if (this.modules[y][x] === runColor) {
				runX++;
				if (runX === 5) result += PENALTY_N1;
				else if (runX > 5) result++;
			} else {
				this.finderPenaltyAddHistory(runX, runHistory);
				if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
				runColor = this.modules[y][x];
				runX = 1;
			}
			result += this.finderPenaltyTerminateAndCount(runColor, runX, runHistory) * PENALTY_N3;
		}
		for (let x = 0; x < this.size; x++) {
			let runColor = false;
			let runY = 0;
			const runHistory = [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			];
			for (let y = 0; y < this.size; y++) if (this.modules[y][x] === runColor) {
				runY++;
				if (runY === 5) result += PENALTY_N1;
				else if (runY > 5) result++;
			} else {
				this.finderPenaltyAddHistory(runY, runHistory);
				if (!runColor) result += this.finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
				runColor = this.modules[y][x];
				runY = 1;
			}
			result += this.finderPenaltyTerminateAndCount(runColor, runY, runHistory) * PENALTY_N3;
		}
		for (let y = 0; y < this.size - 1; y++) for (let x = 0; x < this.size - 1; x++) {
			const color = this.modules[y][x];
			if (color === this.modules[y][x + 1] && color === this.modules[y + 1][x] && color === this.modules[y + 1][x + 1]) result += PENALTY_N2;
		}
		let dark = 0;
		for (const row of this.modules) dark = row.reduce((sum, color) => sum + (color ? 1 : 0), dark);
		const total = this.size * this.size;
		const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
		result += k * PENALTY_N4;
		return result;
	}
	getAlignmentPatternPositions() {
		if (this.version === 1) return [];
		else {
			const numAlign = Math.floor(this.version / 7) + 2;
			const step = this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (numAlign * 2 - 2)) * 2;
			const result = [6];
			for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
			return result;
		}
	}
	finderPenaltyCountPatterns(runHistory) {
		const n = runHistory[1];
		const core = n > 0 && runHistory[2] === n && runHistory[3] === n * 3 && runHistory[4] === n && runHistory[5] === n;
		return (core && runHistory[0] >= n * 4 && runHistory[6] >= n ? 1 : 0) + (core && runHistory[6] >= n * 4 && runHistory[0] >= n ? 1 : 0);
	}
	finderPenaltyTerminateAndCount(currentRunColor, currentRunLength, runHistory) {
		if (currentRunColor) {
			this.finderPenaltyAddHistory(currentRunLength, runHistory);
			currentRunLength = 0;
		}
		currentRunLength += this.size;
		this.finderPenaltyAddHistory(currentRunLength, runHistory);
		return this.finderPenaltyCountPatterns(runHistory);
	}
	finderPenaltyAddHistory(currentRunLength, runHistory) {
		if (runHistory[0] === 0) currentRunLength += this.size;
		runHistory.pop();
		runHistory.unshift(currentRunLength);
	}
};
function appendBits(val, len, bb) {
	if (len < 0 || len > 31 || val >>> len !== 0) throw new RangeError("Value out of range");
	for (let i = len - 1; i >= 0; i--) bb.push(val >>> i & 1);
}
function getBit(x, i) {
	return (x >>> i & 1) !== 0;
}
var QrSegment = class {
	constructor(mode, numChars, bitData) {
		this.mode = mode;
		this.numChars = numChars;
		this.bitData = bitData;
		if (numChars < 0) throw new RangeError("Invalid argument");
		this.bitData = bitData.slice();
	}
	getData() {
		return this.bitData.slice();
	}
};
var MODE_NUMERIC = [
	1,
	10,
	12,
	14
];
var MODE_ALPHANUMERIC = [
	2,
	9,
	11,
	13
];
var MODE_BYTE = [
	4,
	8,
	16,
	16
];
function numCharCountBits(mode, ver) {
	return mode[Math.floor((ver + 7) / 17) + 1];
}
function makeBytes(data) {
	const bb = [];
	for (const b of data) appendBits(b, 8, bb);
	return new QrSegment(MODE_BYTE, data.length, bb);
}
function makeNumeric(digits) {
	if (!isNumeric(digits)) throw new RangeError("String contains non-numeric characters");
	const bb = [];
	for (let i = 0; i < digits.length;) {
		const n = Math.min(digits.length - i, 3);
		appendBits(Number.parseInt(digits.substring(i, i + n), 10), n * 3 + 1, bb);
		i += n;
	}
	return new QrSegment(MODE_NUMERIC, digits.length, bb);
}
function makeAlphanumeric(text) {
	if (!isAlphanumeric(text)) throw new RangeError("String contains unencodable characters in alphanumeric mode");
	const bb = [];
	let i = 0;
	for (; i + 2 <= text.length; i += 2) {
		let temp = ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
		temp += ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
		appendBits(temp, 11, bb);
	}
	if (i < text.length) appendBits(ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
	return new QrSegment(MODE_ALPHANUMERIC, text.length, bb);
}
function makeSegments(text) {
	if (text === "") return [];
	else if (isNumeric(text)) return [makeNumeric(text)];
	else if (isAlphanumeric(text)) return [makeAlphanumeric(text)];
	else return [makeBytes(toUtf8ByteArray(text))];
}
function isNumeric(text) {
	return NUMERIC_REGEX.test(text);
}
function isAlphanumeric(text) {
	return ALPHANUMERIC_REGEX.test(text);
}
function getTotalBits(segs, version) {
	let result = 0;
	for (const seg of segs) {
		const ccbits = numCharCountBits(seg.mode, version);
		if (seg.numChars >= 1 << ccbits) return Number.POSITIVE_INFINITY;
		result += 4 + ccbits + seg.bitData.length;
	}
	return result;
}
function toUtf8ByteArray(str) {
	str = encodeURI(str);
	const result = [];
	for (let i = 0; i < str.length; i++) if (str.charAt(i) !== "%") result.push(str.charCodeAt(i));
	else {
		result.push(Number.parseInt(str.substring(i + 1, i + 3), 16));
		i += 2;
	}
	return result;
}
function getNumRawDataModules(ver) {
	if (ver < MIN_VERSION || ver > MAX_VERSION) throw new RangeError("Version number out of range");
	let result = (16 * ver + 128) * ver + 64;
	if (ver >= 2) {
		const numAlign = Math.floor(ver / 7) + 2;
		result -= (25 * numAlign - 10) * numAlign - 55;
		if (ver >= 7) result -= 36;
	}
	return result;
}
function getNumDataCodewords(ver, ecl) {
	return Math.floor(getNumRawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[ecl[0]][ver] * NUM_ERROR_CORRECTION_BLOCKS[ecl[0]][ver];
}
function reedSolomonComputeDivisor(degree) {
	if (degree < 1 || degree > 255) throw new RangeError("Degree out of range");
	const result = [];
	for (let i = 0; i < degree - 1; i++) result.push(0);
	result.push(1);
	let root = 1;
	for (let i = 0; i < degree; i++) {
		for (let j = 0; j < result.length; j++) {
			result[j] = reedSolomonMultiply(result[j], root);
			if (j + 1 < result.length) result[j] ^= result[j + 1];
		}
		root = reedSolomonMultiply(root, 2);
	}
	return result;
}
function reedSolomonComputeRemainder(data, divisor) {
	const result = divisor.map((_) => 0);
	for (const b of data) {
		const factor = b ^ result.shift();
		result.push(0);
		divisor.forEach((coef, i) => result[i] ^= reedSolomonMultiply(coef, factor));
	}
	return result;
}
function reedSolomonMultiply(x, y) {
	if (x >>> 8 !== 0 || y >>> 8 !== 0) throw new RangeError("Byte out of range");
	let z = 0;
	for (let i = 7; i >= 0; i--) {
		z = z << 1 ^ (z >>> 7) * 285;
		z ^= (y >>> i & 1) * x;
	}
	return z;
}
function encodeSegments(segs, ecl, minVersion = 1, maxVersion = 40, mask = -1, boostEcl = true) {
	if (!(MIN_VERSION <= minVersion && minVersion <= maxVersion && maxVersion <= MAX_VERSION) || mask < -1 || mask > 7) throw new RangeError("Invalid value");
	let version;
	let dataUsedBits;
	for (version = minVersion;; version++) {
		const dataCapacityBits2 = getNumDataCodewords(version, ecl) * 8;
		const usedBits = getTotalBits(segs, version);
		if (usedBits <= dataCapacityBits2) {
			dataUsedBits = usedBits;
			break;
		}
		if (version >= maxVersion) throw new RangeError("Data too long");
	}
	for (const newEcl of [
		MEDIUM,
		QUARTILE,
		HIGH
	]) if (boostEcl && dataUsedBits <= getNumDataCodewords(version, newEcl) * 8) ecl = newEcl;
	const bb = [];
	for (const seg of segs) {
		appendBits(seg.mode[0], 4, bb);
		appendBits(seg.numChars, numCharCountBits(seg.mode, version), bb);
		for (const b of seg.getData()) bb.push(b);
	}
	const dataCapacityBits = getNumDataCodewords(version, ecl) * 8;
	appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
	appendBits(0, (8 - bb.length % 8) % 8, bb);
	for (let padByte = 236; bb.length < dataCapacityBits; padByte ^= 253) appendBits(padByte, 8, bb);
	const dataCodewords = Array.from({ length: Math.ceil(bb.length / 8) }, () => 0);
	bb.forEach((b, i) => dataCodewords[i >>> 3] |= b << 7 - (i & 7));
	return new QrCode(version, ecl, dataCodewords, mask);
}
function encode(data, options) {
	const { ecc = "L", boostEcc = false, minVersion = 1, maxVersion = 40, maskPattern = -1, border = 1 } = options || {};
	const segment = typeof data === "string" ? makeSegments(data) : Array.isArray(data) ? [makeBytes(data)] : void 0;
	if (!segment) throw new Error(`uqr only supports encoding string and binary data, but got: ${typeof data}`);
	const qr = encodeSegments(segment, EccMap[ecc], minVersion, maxVersion, maskPattern, boostEcc);
	const result = addBorder({
		version: qr.version,
		maskPattern: qr.mask,
		size: qr.size,
		data: qr.modules,
		types: qr.types
	}, border);
	if (options?.invert) result.data = result.data.map((row) => row.map((mod) => !mod));
	options?.onEncoded?.(result);
	return result;
}
function addBorder(input, border = 1) {
	if (!border) return input;
	const { size } = input;
	const newSize = size + border * 2;
	input.size = newSize;
	input.data.forEach((row) => {
		for (let i = 0; i < border; i++) {
			row.unshift(false);
			row.push(false);
		}
	});
	for (let i = 0; i < border; i++) {
		input.data.unshift(Array.from({ length: newSize }, (_) => false));
		input.data.push(Array.from({ length: newSize }, (_) => false));
	}
	const b = QrCodeDataType.Border;
	input.types.forEach((row) => {
		for (let i = 0; i < border; i++) {
			row.unshift(b);
			row.push(b);
		}
	});
	for (let i = 0; i < border; i++) {
		input.types.unshift(Array.from({ length: newSize }, (_) => b));
		input.types.push(Array.from({ length: newSize }, (_) => b));
	}
	return input;
}
//#endregion
//#region ../packages/host/src/svg.ts
var NS = "http://www.w3.org/2000/svg";
var escape = (v) => String(v).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
/** Markup for a node and its children. */
function svgString([tag, attrs, children = []]) {
	return `<${tag}${Object.entries(attrs).map(([k, v]) => ` ${k}="${escape(v)}"`).join("")}>${children.map(svgString).join("")}</${tag}>`;
}
/** The node and its children as elements of `doc`. */
function svgElement([tag, attrs, children = []], doc = document) {
	const el = doc.createElementNS(NS, tag);
	for (const [k, v] of Object.entries(attrs)) if (k !== "xmlns") el.setAttribute(k, String(v));
	for (const c of children) el.appendChild(svgElement(c, doc));
	return el;
}
//#endregion
//#region ../packages/host/src/mark.ts
/** The mark's shapes, for a 100 × 100 box. */
function markNodes(accent) {
	const box = "50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4";
	return [
		["ellipse", {
			cx: 50,
			cy: 57,
			rx: 47,
			ry: 15,
			transform: "rotate(-14 50 57)",
			fill: "none",
			stroke: accent,
			"stroke-width": 3,
			opacity: .35
		}],
		["polygon", {
			points: box,
			fill: "#050505"
		}],
		["polygon", {
			points: "50,19 78,34.4 50,49.8 22,34.4",
			fill: "#2f2f2f"
		}],
		["polygon", {
			points: "22,34.4 50,49.8 50,80.6 22,65.2",
			fill: "#0c0c0c"
		}],
		["polygon", {
			points: "50,49.8 78,34.4 78,65.2 50,80.6",
			fill: "#191919"
		}],
		["polygon", {
			points: box,
			fill: "none",
			stroke: "#fff",
			"stroke-opacity": .42,
			"stroke-width": 1.6,
			"stroke-linejoin": "round"
		}],
		["path", {
			d: "M50 49.8V80.6",
			stroke: "#fff",
			"stroke-opacity": .3,
			"stroke-width": 1.4
		}],
		["path", {
			d: "M22 34.4 50 49.8 78 34.4",
			fill: "none",
			stroke: accent,
			"stroke-width": 3,
			"stroke-linejoin": "round"
		}],
		["path", {
			d: "M50 19 78 34.4",
			stroke: "#fff",
			"stroke-opacity": .75,
			"stroke-width": 1.4,
			"stroke-linecap": "round"
		}],
		["path", {
			d: "M95.6 45.63A47 15-14 0 1 4.4 68.37",
			fill: "none",
			stroke: accent,
			"stroke-width": 4.4,
			"stroke-linecap": "round"
		}],
		["circle", {
			cx: 82.1,
			cy: 60.8,
			r: 5.4,
			fill: accent
		}],
		["circle", {
			cx: 82.1,
			cy: 60.8,
			r: 2,
			fill: "#fff"
		}]
	];
}
//#endregion
//#region ../packages/host/src/qr.ts
/**
* ob.Pal's QR code: uqr's matrix drawn in the brand. Round dots, finder squares as rounded boxes with an
* accent-tinted eye, and the ob.Pal mark in the middle over a cleared circle.
*
* Every camera must still read it, so the dark parts stay dark on a light plate whatever colours are asked for:
* the accent is darkened (in linear light, keeping its hue) until the eyes are nearly as dark as the ink, and ECC
* 'Q' covers the modules under the mark. The vivid accent goes only where scanning doesn't look: the mark, and
* around the plate (the pairing chip's glow). tests/qr.test.ts decodes it with two decoders over sizes, surfaces
* and accents, beside uqr's plain code of the same density. plainQr is the fallback.
*
* Each comes as markup (brandedQr, plainQr) or as an element (brandedQrElement, plainQrElement): the pairing chip
* builds elements, so it works on pages that enforce Trusted Types.
*/
var qr_exports = /* @__PURE__ */ __exportAll({
	brandedQr: () => brandedQr,
	brandedQrElement: () => brandedQrElement,
	brandedQrNode: () => brandedQrNode,
	plainQr: () => plainQr,
	plainQrElement: () => plainQrElement,
	plainQrNode: () => plainQrNode,
	qrColors: () => qrColors,
	qrDotPoints: () => qrDotPoints
});
var LIME = [
	198,
	255,
	52
];
var INK = [
	11,
	13,
	16
];
var WHITE = [
	255,
	255,
	255
];
/**
* Luminance limits: modules at least 13:1 against the plate, eyes at least 10:1. Lighter eyes (tried down to 6:1)
* cost decoders reads at small sizes; a finder's eye has to look as dark as its ring.
*/
var INK_MAX = .02;
var EYE_MAX = .04;
/** Dot diameter, in modules: round dots with a hair of space between them. */
var DOT = .92;
/** Module centres in the visible QR footprint, including its three-module quiet zone. */
function qrDotPoints(text) {
	const qr = encode(text, {
		ecc: "Q",
		border: 0
	});
	const points = [];
	const size = qr.size + 6;
	const radius = Math.round(qr.size * .24) / 2;
	for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) if (qr.data[y][x] && Math.hypot(x + .5 - qr.size / 2, y + .5 - qr.size / 2) >= radius + .2) points.push({
		x: (x + 3.5) / size,
		y: (y + 3.5) / size
	});
	return points;
}
/** The colours a code is drawn in, made safe to scan. */
function qrColors(style = {}) {
	const accent = parseColor(style.accent) ?? LIME;
	return {
		accent: toHex(accent),
		eye: toHex(darkenTo(accent, EYE_MAX * .97)),
		ink: toHex(darkenTo(parseColor(style.ink) ?? INK, INK_MAX * .97)),
		plate: toHex(lightenTo(parseColor(style.plate) ?? WHITE, .855))
	};
}
var f = (v) => String(Math.round(v * 1e3) / 1e3);
/** A rounded rectangle as a closed subpath (for even-odd rings). */
function box(x, y, w, h, r) {
	return `M${f(x + r)} ${f(y)}h${f(w - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}v${f(h - 2 * r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}h${f(2 * r - w)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}v${f(2 * r - h)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}z`;
}
/** The branded code, as SVG described in data. */
function brandedQrNode(text, style = {}) {
	const qr = encode(text, {
		ecc: style.ecc ?? "Q",
		border: 0
	});
	const n = qr.size;
	const m = style.margin ?? 3;
	const c = qrColors(style);
	const withMark = style.mark !== false;
	const rc = withMark ? Math.round(n * .24) / 2 : 0;
	const mid = n / 2;
	const cleared = (x, y, pad = .2) => withMark && Math.hypot(x + .5 - mid, y + .5 - mid) < rc + pad;
	const finder = (x, y) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
	const ALIGN = 4;
	const isAlign = (x, y) => qr.types[y]?.[x] === ALIGN;
	const aligns = [];
	for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) if (isAlign(x, y) && qr.data[y][x] && isAlign(x - 2, y - 2) && isAlign(x + 2, y + 2) && !qr.data[y][x + 1] && !qr.data[y + 1][x]) aligns.push([x, y]);
	const inAlign = (x, y) => aligns.some(([ax, ay]) => Math.abs(x - ax) <= 2 && Math.abs(y - ay) <= 2);
	let dots = "";
	for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.data[y][x] && !finder(x, y) && !inAlign(x, y) && !cleared(x, y)) dots += `M${x + .5} ${y + .5}h0`;
	let rings = "";
	let eyes = "";
	for (const [x, y] of [
		[0, 0],
		[n - 7, 0],
		[0, n - 7]
	]) {
		rings += box(x, y, 7, 7, 2.3) + box(x + 1, y + 1, 5, 5, 1.5);
		eyes += box(x + 2, y + 2, 3, 3, 1.05);
	}
	for (const [x, y] of aligns) {
		if (cleared(x, y, 3)) continue;
		rings += box(x - 2, y - 2, 5, 5, 1.5) + box(x - 1, y - 1, 3, 3, .8);
		dots += `M${x + .5} ${y + .5}h0`;
	}
	const size = n + 2 * m;
	const markSize = rc * 2 * .96;
	const children = [
		["rect", {
			x: -m,
			y: -m,
			width: size,
			height: size,
			rx: f(size * .06),
			fill: c.plate
		}],
		["path", {
			d: dots,
			fill: "none",
			stroke: c.ink,
			"stroke-width": DOT,
			"stroke-linecap": "round"
		}],
		["path", {
			d: rings,
			fill: c.ink,
			"fill-rule": "evenodd"
		}],
		["path", {
			d: eyes,
			fill: c.eye
		}]
	];
	if (withMark) children.push([
		"g",
		{ transform: `translate(${f(mid - markSize / 2)} ${f(mid - markSize / 2)}) scale(${f(markSize / 100)})` },
		markNodes(c.accent)
	]);
	return [
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `${-m} ${-m} ${size} ${size}`,
			...a11y(style.label),
			"shape-rendering": "geometricPrecision"
		},
		children
	];
}
var a11y = (label) => label ? {
	role: "img",
	"aria-label": label
} : { "aria-hidden": "true" };
/** The branded code as SVG markup. */
var brandedQr = (text, style = {}) => svgString(brandedQrNode(text, style));
/** The branded code as an SVG element (no markup parsed: safe under Trusted Types). */
var brandedQrElement = (text, style = {}, doc = document) => svgElement(brandedQrNode(text, style), doc);
/** The plain code, uqr's matrix as square modules, black on white: the fallback wherever the branded one can't be used. */
function plainQrNode(text, label) {
	const qr = encode(text, {
		ecc: "M",
		border: 2
	});
	let d = "";
	for (let y = 0; y < qr.size; y++) for (let x = 0; x < qr.size; x++) if (qr.data[y][x]) d += `M${x} ${y}h1v1h-1z`;
	return [
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: `0 0 ${qr.size} ${qr.size}`,
			...a11y(label),
			"shape-rendering": "crispEdges"
		},
		[["rect", {
			width: qr.size,
			height: qr.size,
			fill: "#fff"
		}], ["path", {
			d,
			fill: "#000"
		}]]
	];
}
/** The plain code as SVG markup. */
var plainQr = (text, label) => svgString(plainQrNode(text, label));
/** The plain code as an SVG element. */
var plainQrElement = (text, label, doc = document) => svgElement(plainQrNode(text, label), doc);
//#endregion
export { qrDotPoints as n, qr_exports as r, brandedQrElement as t };
