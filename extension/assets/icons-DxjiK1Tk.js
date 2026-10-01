import { t as communityMarker } from "./origin-fHVBxSre.js";
//#endregion
//#region ../src/ui/markup.ts
/** Code-owned templates. Values become text, attributes or nested DOM, never input to the HTML policy. */
var allowed = /* @__PURE__ */ new Set([
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">obpal-slot-0-end</svg>",
	"<svg><svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\">obpal-slot-0-end</svg></svg>",
	"<path d=\"M4.5 14.5v-2a7.5 7.5 0 0 1 15 0v2\"/><rect x=\"3.5\" y=\"13.5\" width=\"4.2\" height=\"6.5\" rx=\"1.8\"/><rect x=\"16.3\" y=\"13.5\" width=\"4.2\" height=\"6.5\" rx=\"1.8\"/>",
	"<svg><path d=\"M4.5 14.5v-2a7.5 7.5 0 0 1 15 0v2\"/><rect x=\"3.5\" y=\"13.5\" width=\"4.2\" height=\"6.5\" rx=\"1.8\"/><rect x=\"16.3\" y=\"13.5\" width=\"4.2\" height=\"6.5\" rx=\"1.8\"/></svg>",
	"<path d=\"M9.5 7.5 5 12l4.5 4.5\"/><path d=\"M5.5 12h8.5a4.5 4.5 0 0 1 0 9h-2\"/>",
	"<svg><path d=\"M9.5 7.5 5 12l4.5 4.5\"/><path d=\"M5.5 12h8.5a4.5 4.5 0 0 1 0 9h-2\"/></svg>",
	"<div class=\"bt-src\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end<b>0</b><span>obpal-slot-2-end</span></div>",
	"<svg><div class=\"bt-src\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end<b>0</b><span>obpal-slot-2-end</span></div></svg>",
	"<li data-src=\"obpal-slot-0-end\"><i></i><b>obpal-slot-1-end</b><span>obpal-slot-2-endobpal-slot-3-end</span><time>obpal-slot-4-end</time></li>",
	"<svg><li data-src=\"obpal-slot-0-end\"><i></i><b>obpal-slot-1-end</b><span>obpal-slot-2-endobpal-slot-3-end</span><time>obpal-slot-4-end</time></li></svg>",
	"<li class=\"empty\">Nothing yet</li>",
	"<svg><li class=\"empty\">Nothing yet</li></svg>",
	"\n    <header><span>obpal-slot-0-end</span><div><b>obpal-slot-1-end</b><small>obpal-slot-2-end · obpal-slot-3-end buttons · obpal-slot-4-end axes · #obpal-slot-5-end</small></div>\n      obpal-slot-6-end</header>\n    <div class=\"bt-pbtns\">obpal-slot-7-end</div>\n    <div class=\"bt-paxes\">obpal-slot-8-end</div>",
	"<svg>\n    <header><span>obpal-slot-0-end</span><div><b>obpal-slot-1-end</b><small>obpal-slot-2-end · obpal-slot-3-end buttons · obpal-slot-4-end axes · #obpal-slot-5-end</small></div>\n      obpal-slot-6-end</header>\n    <div class=\"bt-pbtns\">obpal-slot-7-end</div>\n    <div class=\"bt-paxes\">obpal-slot-8-end</div></svg>",
	"<button class=\"bt-chip\" type=\"button\">Rumble</button>",
	"<svg><button class=\"bt-chip\" type=\"button\">Rumble</button></svg>",
	"<em>no rumble</em>",
	"<svg><em>no rumble</em></svg>",
	"<span class=\"bt-pb\"><i></i>obpal-slot-0-end</span>",
	"<svg><span class=\"bt-pb\"><i></i>obpal-slot-0-end</span></svg>",
	"<span class=\"bt-pa\"><em>obpal-slot-0-end</em><span class=\"bt-bar\"><i></i></span><b>0.00</b></span>",
	"<svg><span class=\"bt-pa\"><em>obpal-slot-0-end</em><span class=\"bt-bar\"><i></i></span><b>0.00</b></span></svg>",
	"<article class=\"cat-card pack-card\" data-pack=\"obpal-slot-0-end\">\n      <div class=\"pack-art\"><span class=\"pack-kind\" aria-label=\"obpal-slot-1-end\">obpal-slot-2-end</span>\n        <span class=\"st obpal-slot-3-end\">obpal-slot-4-end</span>\n        obpal-slot-5-end</div>\n      <b>obpal-slot-6-end</b><p class=\"pack-purpose\" title=\"obpal-slot-7-end\">obpal-slot-8-end</p><p class=\"pack-credit\">obpal-slot-9-end</p>\n      obpal-slot-10-end\n      <details class=\"pack-options\"><summary>More options</summary><div class=\"pack-option-list\">\n        <details class=\"pack-data\"><summary>Preview pack data</summary><code>obpal-slot-11-end · obpal-slot-12-end · obpal-slot-13-end</code><pre>obpal-slot-14-end</pre></details>\n        obpal-slot-15-end\n        <a href=\"#credits\">Credit and source</a>\n        obpal-slot-16-end\n      </div></details>\n    </article>",
	"<svg><article class=\"cat-card pack-card\" data-pack=\"obpal-slot-0-end\">\n      <div class=\"pack-art\"><span class=\"pack-kind\" aria-label=\"obpal-slot-1-end\">obpal-slot-2-end</span>\n        <span class=\"st obpal-slot-3-end\">obpal-slot-4-end</span>\n        obpal-slot-5-end</div>\n      <b>obpal-slot-6-end</b><p class=\"pack-purpose\" title=\"obpal-slot-7-end\">obpal-slot-8-end</p><p class=\"pack-credit\">obpal-slot-9-end</p>\n      obpal-slot-10-end\n      <details class=\"pack-options\"><summary>More options</summary><div class=\"pack-option-list\">\n        <details class=\"pack-data\"><summary>Preview pack data</summary><code>obpal-slot-11-end · obpal-slot-12-end · obpal-slot-13-end</code><pre>obpal-slot-14-end</pre></details>\n        obpal-slot-15-end\n        <a href=\"#credits\">Credit and source</a>\n        obpal-slot-16-end\n      </div></details>\n    </article></svg>",
	"<img class=\"pack-preview\" src=\"obpal-slot-0-end\" alt=\"obpal-slot-1-end preview\" loading=\"lazy\">",
	"<svg><img class=\"pack-preview\" src=\"obpal-slot-0-end\" alt=\"obpal-slot-1-end preview\" loading=\"lazy\"></svg>",
	"<p>Deprecated: obpal-slot-0-end</p>",
	"<svg><p>Deprecated: obpal-slot-0-end</p></svg>",
	"<a class=\"btn pack-primary\" href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Open scene obpal-slot-1-end</a>",
	"<svg><a class=\"btn pack-primary\" href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Open scene obpal-slot-1-end</a></svg>",
	"<a class=\"btn pack-primary\" href=\"/p/?pack=obpal-slot-0-end\">Use on my phone</a>",
	"<svg><a class=\"btn pack-primary\" href=\"/p/?pack=obpal-slot-0-end\">Use on my phone</a></svg>",
	"<p>Specification only</p>",
	"<svg><p>Specification only</p></svg>",
	"<details class=\"pack-handoff\"><summary>Send to a phone</summary>\n          <p>Scan this pack link with your phone, then connect to a screen.</p>\n          obpal-slot-0-end</details>",
	"<svg><details class=\"pack-handoff\"><summary>Send to a phone</summary>\n          <p>Scan this pack link with your phone, then connect to a screen.</p>\n          obpal-slot-0-end</details></svg>",
	"<a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Source obpal-slot-1-end</a>",
	"<svg><a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Source obpal-slot-1-end</a></svg>",
	"<li><b>obpal-slot-0-end</b> (obpal-slot-1-end · obpal-slot-2-end) — obpal-slot-3-end\n      <span>obpal-slot-4-end</span>\n      obpal-slot-5-end\n      <a href=\"obpal-slot-6-end\" target=\"_blank\" rel=\"noopener noreferrer\">Licence</a>\n      obpal-slot-7-end</li>",
	"<svg><li><b>obpal-slot-0-end</b> (obpal-slot-1-end · obpal-slot-2-end) — obpal-slot-3-end\n      <span>obpal-slot-4-end</span>\n      obpal-slot-5-end\n      <a href=\"obpal-slot-6-end\" target=\"_blank\" rel=\"noopener noreferrer\">Licence</a>\n      obpal-slot-7-end</li></svg>",
	"<a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Author</a>",
	"<svg><a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Author</a></svg>",
	"<a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Source</a>",
	"<svg><a href=\"obpal-slot-0-end\" target=\"_blank\" rel=\"noopener noreferrer\">Source</a></svg>",
	"\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st obpal-slot-1-end\">obpal-slot-2-end</span></header>\n      <code>obpal-slot-3-end</code>\n      <p>obpal-slot-4-end</p>\n      obpal-slot-5-end\n    </article>",
	"<svg>\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st obpal-slot-1-end\">obpal-slot-2-end</span></header>\n      <code>obpal-slot-3-end</code>\n      <p>obpal-slot-4-end</p>\n      obpal-slot-5-end\n    </article></svg>",
	"<a href=\"obpal-slot-0-end\">Try it →</a>",
	"<svg><a href=\"obpal-slot-0-end\">Try it →</a></svg>",
	"\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st\">obpal-slot-1-end</span></header>\n      <code>obpal-slot-2-end</code>\n      <p>obpal-slot-3-end</p>\n      obpal-slot-4-end\n      <a href=\"/sim/?face=obpal-slot-5-end\">Try it in a sim →</a>\n    </article>",
	"<svg>\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st\">obpal-slot-1-end</span></header>\n      <code>obpal-slot-2-end</code>\n      <p>obpal-slot-3-end</p>\n      obpal-slot-4-end\n      <a href=\"/sim/?face=obpal-slot-5-end\">Try it in a sim →</a>\n    </article></svg>",
	"<div class=\"routes\">obpal-slot-0-end</div>",
	"<svg><div class=\"routes\">obpal-slot-0-end</div></svg>",
	"<span>obpal-slot-0-end</span>",
	"<svg><span>obpal-slot-0-end</span></svg>",
	"<span><i>obpal-slot-0-end</i>obpal-slot-1-end</span>",
	"<svg><span><i>obpal-slot-0-end</i>obpal-slot-1-end</span></svg>",
	"\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st obpal-slot-1-end\">obpal-slot-2-end</span></header>\n      <code>obpal-slot-3-end</code>\n      <p>obpal-slot-4-end</p>\n      <div class=\"routes\">obpal-slot-5-end</div>\n    </article>",
	"<svg>\n    <article class=\"cat-card\">\n      <header><b>obpal-slot-0-end</b><span class=\"st obpal-slot-1-end\">obpal-slot-2-end</span></header>\n      <code>obpal-slot-3-end</code>\n      <p>obpal-slot-4-end</p>\n      <div class=\"routes\">obpal-slot-5-end</div>\n    </article></svg>",
	"<label class=\"chk\"><input type=\"checkbox\" value=\"obpal-slot-0-end\"> obpal-slot-1-end</label>",
	"<svg><label class=\"chk\"><input type=\"checkbox\" value=\"obpal-slot-0-end\"> obpal-slot-1-end</label></svg>",
	"<label class=\"rng\"><span>obpal-slot-0-end</span><input class=\"bb-range\" type=\"range\" name=\"obpal-slot-1-end\" min=\"obpal-slot-2-end\" max=\"obpal-slot-3-end\" step=\"obpal-slot-4-end\"><output></output></label>",
	"<svg><label class=\"rng\"><span>obpal-slot-0-end</span><input class=\"bb-range\" type=\"range\" name=\"obpal-slot-1-end\" min=\"obpal-slot-2-end\" max=\"obpal-slot-3-end\" step=\"obpal-slot-4-end\"><output></output></label></svg>",
	"\n    <fieldset class=\"bld-u\" data-key=\"obpal-slot-0-end\">\n      <legend>obpal-slot-1-end <code>obpal-slot-2-end</code></legend>\n      <label class=\"fld\"><span>Goes to</span><select name=\"route\">obpal-slot-3-end</select></label>\n      obpal-slot-4-endobpal-slot-5-endobpal-slot-6-end\n      <label class=\"chk\"><input type=\"checkbox\" name=\"invertY\"> Invert up and down</label>\n      obpal-slot-7-end\n    </fieldset>",
	"<svg>\n    <fieldset class=\"bld-u\" data-key=\"obpal-slot-0-end\">\n      <legend>obpal-slot-1-end <code>obpal-slot-2-end</code></legend>\n      <label class=\"fld\"><span>Goes to</span><select name=\"route\">obpal-slot-3-end</select></label>\n      obpal-slot-4-endobpal-slot-5-endobpal-slot-6-end\n      <label class=\"chk\"><input type=\"checkbox\" name=\"invertY\"> Invert up and down</label>\n      obpal-slot-7-end\n    </fieldset></svg>",
	"<option>obpal-slot-0-end</option>",
	"<svg><option>obpal-slot-0-end</option></svg>",
	"<label class=\"chk\"><input type=\"checkbox\" name=\"edgeTurn\"> Turn at the screen’s edge</label>",
	"<svg><label class=\"chk\"><input type=\"checkbox\" name=\"edgeTurn\"> Turn at the screen’s edge</label></svg>",
	"<input type=\"checkbox\" name=\"edgeTurn\" hidden>",
	"<svg><input type=\"checkbox\" name=\"edgeTurn\" hidden></svg>",
	"<select class=\"bin\" aria-label=\"Press\">obpal-slot-0-end</select>",
	"<svg><select class=\"bin\" aria-label=\"Press\">obpal-slot-0-end</select></svg>",
	"<optgroup label=\"obpal-slot-0-end\">obpal-slot-1-end</optgroup>",
	"<svg><optgroup label=\"obpal-slot-0-end\">obpal-slot-1-end</optgroup></svg>",
	"<option value=\"obpal-slot-0-end\">obpal-slot-1-end</option>",
	"<svg><option value=\"obpal-slot-0-end\">obpal-slot-1-end</option></svg>",
	"obpal-slot-0-endobpal-slot-1-endobpal-slot-2-endobpal-slot-3-end",
	"<svg>obpal-slot-0-endobpal-slot-1-endobpal-slot-2-endobpal-slot-3-end</svg>",
	"<optgroup label=\"Keys on the screen\">obpal-slot-0-end</optgroup>",
	"<svg><optgroup label=\"Keys on the screen\">obpal-slot-0-end</optgroup></svg>",
	"<option value=\"obpal-slot-0-end\">Key obpal-slot-1-end</option>",
	"<svg><option value=\"obpal-slot-0-end\">Key obpal-slot-1-end</option></svg>",
	"<optgroup label=\"On the phone\">obpal-slot-0-end</optgroup>",
	"<svg><optgroup label=\"On the phone\">obpal-slot-0-end</optgroup></svg>",
	"<optgroup label=\"Other\"><option value=\"tray:\">A tray button…</option><option value=\"none\">Nothing (takes it away)</option></optgroup>",
	"<svg><optgroup label=\"Other\"><option value=\"tray:\">A tray button…</option><option value=\"none\">Nothing (takes it away)</option></optgroup></svg>",
	"obpal-slot-0-endobpal-slot-1-end",
	"<svg>obpal-slot-0-endobpal-slot-1-end</svg>",
	"obpal-slot-0-end<span aria-hidden=\"true\">→</span><select class=\"bto\" aria-label=\"Does\">obpal-slot-1-end</select>",
	"<svg>obpal-slot-0-end<span aria-hidden=\"true\">→</span><select class=\"bto\" aria-label=\"Does\">obpal-slot-1-end</select></svg>",
	"<input class=\"btray\" placeholder=\"tray id\" spellcheck=\"false\" aria-label=\"Tray button id\" hidden><button class=\"bdel\" type=\"button\" aria-label=\"Remove\">×</button>",
	"<svg><input class=\"btray\" placeholder=\"tray id\" spellcheck=\"false\" aria-label=\"Tray button id\" hidden><button class=\"bdel\" type=\"button\" aria-label=\"Remove\">×</button></svg>",
	"<li>obpal-slot-0-end</li>",
	"<svg><li>obpal-slot-0-end</li></svg>",
	"<rect x=\"7.2\" y=\"2.8\" width=\"9.6\" height=\"18.4\" rx=\"3.2\"/><circle cx=\"12\" cy=\"8.2\" r=\"2.1\"/><path d=\"M10.2 13.4h3.6M10.2 16.6h3.6\"/>",
	"<svg><rect x=\"7.2\" y=\"2.8\" width=\"9.6\" height=\"18.4\" rx=\"3.2\"/><circle cx=\"12\" cy=\"8.2\" r=\"2.1\"/><path d=\"M10.2 13.4h3.6M10.2 16.6h3.6\"/></svg>",
	"obpal-slot-0-end<button class=\"bt-n-x\" aria-label=\"Dismiss\">obpal-slot-1-end</button>",
	"<svg>obpal-slot-0-end<button class=\"bt-n-x\" aria-label=\"Dismiss\">obpal-slot-1-end</button></svg>",
	"\n      <span class=\"bt-n-ic\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end</span>\n      <span class=\"bt-n-txt\"><b>obpal-slot-2-end found</b><span>obpal-slot-3-end</span></span>\n      <button class=\"bt-n-go\">Change</button>",
	"<svg>\n      <span class=\"bt-n-ic\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end</span>\n      <span class=\"bt-n-txt\"><b>obpal-slot-2-end found</b><span>obpal-slot-3-end</span></span>\n      <button class=\"bt-n-go\">Change</button></svg>",
	"\n      <span class=\"bt-n-ic\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end</span>\n      <span class=\"bt-n-txt\"><b>obpal-slot-2-end</b><span>Use it for</span></span>\n      <span class=\"bt-n-picks\">obpal-slot-3-end<button class=\"bt-n-go\">More</button></span>",
	"<svg>\n      <span class=\"bt-n-ic\" data-src=\"obpal-slot-0-end\">obpal-slot-1-end</span>\n      <span class=\"bt-n-txt\"><b>obpal-slot-2-end</b><span>Use it for</span></span>\n      <span class=\"bt-n-picks\">obpal-slot-3-end<button class=\"bt-n-go\">More</button></span></svg>",
	"<button class=\"bt-n-pick\" data-target=\"obpal-slot-0-end\">obpal-slot-1-end</button>",
	"<svg><button class=\"bt-n-pick\" data-target=\"obpal-slot-0-end\">obpal-slot-1-end</button></svg>",
	"<i data-src=\"obpal-slot-0-end\" class=\"obpal-slot-1-end\">obpal-slot-2-end</i>",
	"<svg><i data-src=\"obpal-slot-0-end\" class=\"obpal-slot-1-end\">obpal-slot-2-end</i></svg>",
	"<i class=\"more\">+obpal-slot-0-end</i>",
	"<svg><i class=\"more\">+obpal-slot-0-end</i></svg>",
	"\n      <div class=\"sheet btns glass\" role=\"dialog\" aria-label=\"Buttons\">\n        <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button class=\"icon-btn glass sheet-x\" data-act=\"close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n        <div class=\"bt-title\"><h2>Buttons</h2><span class=\"bt-ctl\"></span></div>\n        <div class=\"bt-grids\"></div>\n        <p class=\"bt-line\" role=\"status\" aria-live=\"polite\"></p>\n        <div class=\"bt-assign\" hidden></div>\n        <p class=\"sheet-k\">What reaches this phone</p>\n        <div class=\"bt-srcs\"></div>\n        <label class=\"row\"><input type=\"checkbox\" data-act=\"badges\"> Show them on the controls</label>\n        <a class=\"support-link\" href=\"/buttons/\" target=\"_blank\" rel=\"noopener\">obpal-slot-1-end<span>Test your buttons</span></a>\n        <div class=\"actions\"><button class=\"btn\" data-act=\"reset\">Reset</button><button class=\"btn primary\" data-act=\"done\">Done</button></div>\n      </div>",
	"<svg>\n      <div class=\"sheet btns glass\" role=\"dialog\" aria-label=\"Buttons\">\n        <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button class=\"icon-btn glass sheet-x\" data-act=\"close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n        <div class=\"bt-title\"><h2>Buttons</h2><span class=\"bt-ctl\"></span></div>\n        <div class=\"bt-grids\"></div>\n        <p class=\"bt-line\" role=\"status\" aria-live=\"polite\"></p>\n        <div class=\"bt-assign\" hidden></div>\n        <p class=\"sheet-k\">What reaches this phone</p>\n        <div class=\"bt-srcs\"></div>\n        <label class=\"row\"><input type=\"checkbox\" data-act=\"badges\"> Show them on the controls</label>\n        <a class=\"support-link\" href=\"/buttons/\" target=\"_blank\" rel=\"noopener\">obpal-slot-1-end<span>Test your buttons</span></a>\n        <div class=\"actions\"><button class=\"btn\" data-act=\"reset\">Reset</button><button class=\"btn primary\" data-act=\"done\">Done</button></div>\n      </div></svg>",
	" <button class=\"bt-undo\">Undo</button>",
	"<svg> <button class=\"bt-undo\">Undo</button></svg>",
	"<i data-src=\"obpal-slot-0-end\">obpal-slot-1-end</i>",
	"<svg><i data-src=\"obpal-slot-0-end\">obpal-slot-1-end</i></svg>",
	"<button class=\"bt-cobpal-slot-0-endobpal-slot-1-end\" data-target=\"obpal-slot-2-end\" aria-pressed=\"obpal-slot-3-end\"><b>obpal-slot-4-end</b><span class=\"bt-bs\">obpal-slot-5-end</span></button>",
	"<svg><button class=\"bt-cobpal-slot-0-endobpal-slot-1-end\" data-target=\"obpal-slot-2-end\" aria-pressed=\"obpal-slot-3-end\"><b>obpal-slot-4-end</b><span class=\"bt-bs\">obpal-slot-5-end</span></button></svg>",
	"obpal-slot-0-end<div class=\"bt-gridobpal-slot-1-end\" role=\"group\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</div>",
	"<svg>obpal-slot-0-end<div class=\"bt-gridobpal-slot-1-end\" role=\"group\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</div></svg>",
	"<p class=\"sheet-k\">obpal-slot-0-end</p>",
	"<svg><p class=\"sheet-k\">obpal-slot-0-end</p></svg>",
	"\n      <div class=\"bt-og\" data-src=\"obpal-slot-0-end\">\n        <span class=\"bt-og-ic\" title=\"obpal-slot-1-end\">obpal-slot-2-end</span>\n        <div class=\"bt-og-list\">obpal-slot-3-end</div>\n      </div>",
	"<svg>\n      <div class=\"bt-og\" data-src=\"obpal-slot-0-end\">\n        <span class=\"bt-og-ic\" title=\"obpal-slot-1-end\">obpal-slot-2-end</span>\n        <div class=\"bt-og-list\">obpal-slot-3-end</div>\n      </div></svg>",
	"<button class=\"bt-oobpal-slot-0-end\" data-input=\"obpal-slot-1-end\" aria-pressed=\"obpal-slot-2-end\">obpal-slot-3-end</button>",
	"<svg><button class=\"bt-oobpal-slot-0-end\" data-input=\"obpal-slot-1-end\" aria-pressed=\"obpal-slot-2-end\">obpal-slot-3-end</button></svg>",
	"\n      <div class=\"bt-srcobpal-slot-0-endobpal-slot-1-endobpal-slot-2-end\" data-src=\"obpal-slot-3-end\">\n        <span class=\"bt-src-ic\">obpal-slot-4-end</span>\n        <span class=\"bt-src-t\"><b>obpal-slot-5-end</b><small>obpal-slot-6-end</small></span>\n        obpal-slot-7-end\n      </div>",
	"<svg>\n      <div class=\"bt-srcobpal-slot-0-endobpal-slot-1-endobpal-slot-2-end\" data-src=\"obpal-slot-3-end\">\n        <span class=\"bt-src-ic\">obpal-slot-4-end</span>\n        <span class=\"bt-src-t\"><b>obpal-slot-5-end</b><small>obpal-slot-6-end</small></span>\n        obpal-slot-7-end\n      </div></svg>",
	"<input type=\"checkbox\" data-sw=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end\" checked=\"obpal-slot-2-end\" disabled=\"obpal-slot-3-end\">",
	"<svg><input type=\"checkbox\" data-sw=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end\" checked=\"obpal-slot-2-end\" disabled=\"obpal-slot-3-end\"></svg>",
	"obpal-slot-0-end<span>obpal-slot-1-end</span>",
	"<svg>obpal-slot-0-end<span>obpal-slot-1-end</span></svg>",
	"<div class=\"music-heading\"><b>Drums</b><span class=\"music-part\">Your instrument</span></div>\n      <div class=\"music-options\"><label>Layout<select aria-label=\"Drum layout\"><option value=\"kit\">Kit</option><option value=\"hand\">Hand drums</option></select></label><button type=\"button\" class=\"music-toggle\" aria-pressed=\"false\">Strike mode</button></div>\n      <div class=\"drum-pads\"></div><button type=\"button\" class=\"strike-pad\" hidden><b>Hold to play</b><svg class=\"strike-map\" viewBox=\"-100 -100 200 200\" aria-hidden=\"true\"></svg><span>Point to aim · flick down to strike</span><small>Keep a secure grip · flick down gently</small></button><p class=\"music-hint\">Centre hits harder · play with both hands</p>",
	"<svg><div class=\"music-heading\"><b>Drums</b><span class=\"music-part\">Your instrument</span></div>\n      <div class=\"music-options\"><label>Layout<select aria-label=\"Drum layout\"><option value=\"kit\">Kit</option><option value=\"hand\">Hand drums</option></select></label><button type=\"button\" class=\"music-toggle\" aria-pressed=\"false\">Strike mode</button></div>\n      <div class=\"drum-pads\"></div><button type=\"button\" class=\"strike-pad\" hidden><b>Hold to play</b><svg class=\"strike-map\" viewBox=\"-100 -100 200 200\" aria-hidden=\"true\"></svg><span>Point to aim · flick down to strike</span><small>Keep a secure grip · flick down gently</small></button><p class=\"music-hint\">Centre hits harder · play with both hands</p></svg>",
	"<i aria-hidden=\"true\"></i><span>obpal-slot-0-end</span>",
	"<svg><i aria-hidden=\"true\"></i><span>obpal-slot-0-end</span></svg>",
	"<button class=\"gp-trig\" data-trig=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end trigger\"><i class=\"gp-fill\"></i><b>obpal-slot-2-end</b></button>",
	"<svg><button class=\"gp-trig\" data-trig=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end trigger\"><i class=\"gp-fill\"></i><b>obpal-slot-2-end</b></button></svg>",
	"<button class=\"gp-bump\" data-b=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end bumper\"><b>obpal-slot-2-endB</b></button>",
	"<svg><button class=\"gp-bump\" data-b=\"obpal-slot-0-end\" aria-label=\"obpal-slot-1-end bumper\"><b>obpal-slot-2-endB</b></button></svg>",
	"<button class=\"obpal-slot-0-end\" data-b=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button>",
	"<svg><button class=\"obpal-slot-0-end\" data-b=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button></svg>",
	"<button class=\"gp-f\" data-k=\"obpal-slot-0-end\" data-b=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button>",
	"<svg><button class=\"gp-f\" data-k=\"obpal-slot-0-end\" data-b=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button></svg>",
	"<i data-dir=\"obpal-slot-0-end\" data-bit=\"obpal-slot-1-end\">obpal-slot-2-end</i>",
	"<svg><i data-dir=\"obpal-slot-0-end\" data-bit=\"obpal-slot-1-end\">obpal-slot-2-end</i></svg>",
	"<div class=\"gp-stick\" data-stick=\"obpal-slot-0-end\" role=\"group\" aria-label=\"obpal-slot-1-end stick, tap to click\"><i class=\"gp-base\"><i class=\"gp-knob\"></i></i></div>",
	"<svg><div class=\"gp-stick\" data-stick=\"obpal-slot-0-end\" role=\"group\" aria-label=\"obpal-slot-1-end stick, tap to click\"><i class=\"gp-base\"><i class=\"gp-knob\"></i></i></div></svg>",
	"\n    <div class=\"gp\" hidden role=\"application\" aria-label=\"Gamepad\">\n      <div class=\"gp-sh l\">obpal-slot-0-endobpal-slot-1-end</div>\n      <div class=\"gp-top\">\n        <div class=\"gp-sys l\"><button class=\"gp-mini\" data-act=\"exit\" aria-label=\"Back\">obpal-slot-2-end</button><button class=\"gp-mini\" data-act=\"controllers\" aria-haspopup=\"dialog\" aria-label=\"All controllers\">obpal-slot-3-end</button></div>\n        obpal-slot-4-end\n        <div class=\"gp-sys r\"><button class=\"gp-mini\" data-act=\"settings\" aria-label=\"Settings\">obpal-slot-5-end</button></div>\n      </div>\n      <div class=\"gp-sh r\">obpal-slot-6-endobpal-slot-7-end</div>\n      <div class=\"gp-cue\" role=\"img\" aria-label=\"Turn your phone sideways for the full controller\">obpal-slot-8-end</div>\n      <div class=\"gp-side l\">\n        obpal-slot-9-end\n        <div class=\"gp-dpad\" role=\"group\" aria-label=\"D-pad\">obpal-slot-10-endobpal-slot-11-endobpal-slot-12-endobpal-slot-13-end</div>\n      </div>\n      <div class=\"gp-mid\">\n        <div class=\"gp-center\">obpal-slot-14-end<div class=\"gp-wheel\" aria-hidden=\"true\"><i>obpal-slot-15-end</i></div>obpal-slot-16-end</div>\n        <button class=\"gp-scope\" data-act=\"scope\" type=\"button\" aria-label=\"Scene scope\" hidden><i class=\"gp-scope-ic\">obpal-slot-17-end</i><span>Object</span><small hidden></small></button>\n        <div class=\"gp-motion\" role=\"group\" aria-label=\"Motion\">\n          <div class=\"gp-chips\"></div>\n          <div class=\"gp-tools\">\n            <button class=\"gp-chip gp-prof\" data-act=\"profile\" aria-haspopup=\"dialog\" aria-label=\"Profile\"></button>\n            <button class=\"gp-chip gp-centre\" data-act=\"centre\" aria-label=\"Centre here\" hidden>obpal-slot-18-end</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"gp-side r\">\n        obpal-slot-19-end\n        <div class=\"gp-face\">obpal-slot-20-endobpal-slot-21-endobpal-slot-22-endobpal-slot-23-end</div>\n      </div>\n    </div>",
	"<svg>\n    <div class=\"gp\" hidden role=\"application\" aria-label=\"Gamepad\">\n      <div class=\"gp-sh l\">obpal-slot-0-endobpal-slot-1-end</div>\n      <div class=\"gp-top\">\n        <div class=\"gp-sys l\"><button class=\"gp-mini\" data-act=\"exit\" aria-label=\"Back\">obpal-slot-2-end</button><button class=\"gp-mini\" data-act=\"controllers\" aria-haspopup=\"dialog\" aria-label=\"All controllers\">obpal-slot-3-end</button></div>\n        obpal-slot-4-end\n        <div class=\"gp-sys r\"><button class=\"gp-mini\" data-act=\"settings\" aria-label=\"Settings\">obpal-slot-5-end</button></div>\n      </div>\n      <div class=\"gp-sh r\">obpal-slot-6-endobpal-slot-7-end</div>\n      <div class=\"gp-cue\" role=\"img\" aria-label=\"Turn your phone sideways for the full controller\">obpal-slot-8-end</div>\n      <div class=\"gp-side l\">\n        obpal-slot-9-end\n        <div class=\"gp-dpad\" role=\"group\" aria-label=\"D-pad\">obpal-slot-10-endobpal-slot-11-endobpal-slot-12-endobpal-slot-13-end</div>\n      </div>\n      <div class=\"gp-mid\">\n        <div class=\"gp-center\">obpal-slot-14-end<div class=\"gp-wheel\" aria-hidden=\"true\"><i>obpal-slot-15-end</i></div>obpal-slot-16-end</div>\n        <button class=\"gp-scope\" data-act=\"scope\" type=\"button\" aria-label=\"Scene scope\" hidden><i class=\"gp-scope-ic\">obpal-slot-17-end</i><span>Object</span><small hidden></small></button>\n        <div class=\"gp-motion\" role=\"group\" aria-label=\"Motion\">\n          <div class=\"gp-chips\"></div>\n          <div class=\"gp-tools\">\n            <button class=\"gp-chip gp-prof\" data-act=\"profile\" aria-haspopup=\"dialog\" aria-label=\"Profile\"></button>\n            <button class=\"gp-chip gp-centre\" data-act=\"centre\" aria-label=\"Centre here\" hidden>obpal-slot-18-end</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"gp-side r\">\n        obpal-slot-19-end\n        <div class=\"gp-face\">obpal-slot-20-endobpal-slot-21-endobpal-slot-22-endobpal-slot-23-end</div>\n      </div>\n    </div></svg>",
	"<button class=\"gp-chip\" data-chip=\"obpal-slot-0-end\" aria-pressed=\"false\" aria-haspopup=\"dialog\" title=\"obpal-slot-1-end\"><i class=\"gp-chip-ic\"></i><span>obpal-slot-2-end</span></button>",
	"<svg><button class=\"gp-chip\" data-chip=\"obpal-slot-0-end\" aria-pressed=\"false\" aria-haspopup=\"dialog\" title=\"obpal-slot-1-end\"><i class=\"gp-chip-ic\"></i><span>obpal-slot-2-end</span></button></svg>",
	"obpal-slot-0-end<span>obpal-slot-1-endobpal-slot-2-endobpal-slot-3-end</span>",
	"<svg>obpal-slot-0-end<span>obpal-slot-1-endobpal-slot-2-endobpal-slot-3-end</span></svg>",
	"<small class=\"pack-credit\">obpal-slot-0-end</small>",
	"<svg><small class=\"pack-credit\">obpal-slot-0-end</small></svg>",
	"<small class=\"pack-credit\">obpal-slot-0-end · obpal-slot-1-end</small>",
	"<svg><small class=\"pack-credit\">obpal-slot-0-end · obpal-slot-1-end</small></svg>",
	"<div class=\"sheet gp-sheet glass\" role=\"dialog\" aria-label=\"obpal-slot-0-end\"><div class=\"grip\" aria-hidden=\"true\"></div>obpal-slot-1-end</div>",
	"<svg><div class=\"sheet gp-sheet glass\" role=\"dialog\" aria-label=\"obpal-slot-0-end\"><div class=\"grip\" aria-hidden=\"true\"></div>obpal-slot-1-end</div></svg>",
	"<div class=\"routes\" role=\"radiogroup\" aria-label=\"Route\">obpal-slot-0-end</div>",
	"<svg><div class=\"routes\" role=\"radiogroup\" aria-label=\"Route\">obpal-slot-0-end</div></svg>",
	"<button role=\"radio\" data-route=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\">obpal-slot-2-end<span>obpal-slot-3-end</span></button>",
	"<svg><button role=\"radio\" data-route=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\">obpal-slot-2-end<span>obpal-slot-3-end</span></button></svg>",
	"<label class=\"bb-field\"><span>Deadzone jump</span><output id=\"gp-dz\"></output><input class=\"bb-range\" type=\"range\" id=\"gp-dead\" min=\"0\" max=\"0.4\" step=\"0.02\"></label>",
	"<svg><label class=\"bb-field\"><span>Deadzone jump</span><output id=\"gp-dz\"></output><input class=\"bb-range\" type=\"range\" id=\"gp-dead\" min=\"0\" max=\"0.4\" step=\"0.02\"></label></svg>",
	"<label class=\"row\"><input type=\"checkbox\" id=\"gp-edge\"> Edge turn</label>",
	"<svg><label class=\"row\"><input type=\"checkbox\" id=\"gp-edge\"> Edge turn</label></svg>",
	"\n      <div class=\"sheet-title\"><i class=\"gp-chip-ic\">obpal-slot-0-end</i><h2>obpal-slot-1-end</h2><span class=\"sheet-sub\">obpal-slot-2-end</span></div>\n      obpal-slot-3-end\n      <label class=\"bb-field\"><span>Sensitivity</span><output id=\"gp-gv\"></output><input class=\"bb-range\" type=\"range\" id=\"gp-gain\" min=\"0.25\" max=\"3\" step=\"0.05\"></label>\n      obpal-slot-4-end\n      <label class=\"row\"><input type=\"checkbox\" id=\"gp-inv\"> Invert Y</label>\n      obpal-slot-5-end\n      <div class=\"row gap\"><button class=\"btn\" data-act=\"reset\">Reset</button><button class=\"btn primary\" data-act=\"done\">Done</button></div>",
	"<svg>\n      <div class=\"sheet-title\"><i class=\"gp-chip-ic\">obpal-slot-0-end</i><h2>obpal-slot-1-end</h2><span class=\"sheet-sub\">obpal-slot-2-end</span></div>\n      obpal-slot-3-end\n      <label class=\"bb-field\"><span>Sensitivity</span><output id=\"gp-gv\"></output><input class=\"bb-range\" type=\"range\" id=\"gp-gain\" min=\"0.25\" max=\"3\" step=\"0.05\"></label>\n      obpal-slot-4-end\n      <label class=\"row\"><input type=\"checkbox\" id=\"gp-inv\"> Invert Y</label>\n      obpal-slot-5-end\n      <div class=\"row gap\"><button class=\"btn\" data-act=\"reset\">Reset</button><button class=\"btn primary\" data-act=\"done\">Done</button></div></svg>",
	"<button class=\"pick\" data-profile=\"obpal-slot-0-end\" aria-selected=\"obpal-slot-1-end\" title=\"obpal-slot-2-end\">\n        <span class=\"pick-art\">obpal-slot-3-end</span><span class=\"pick-name\">obpal-slot-4-end</span>obpal-slot-5-endobpal-slot-6-end</button>",
	"<svg><button class=\"pick\" data-profile=\"obpal-slot-0-end\" aria-selected=\"obpal-slot-1-end\" title=\"obpal-slot-2-end\">\n        <span class=\"pick-art\">obpal-slot-3-end</span><span class=\"pick-name\">obpal-slot-4-end</span>obpal-slot-5-endobpal-slot-6-end</button></svg>",
	"<span class=\"pick-tag\">suggested</span>",
	"<svg><span class=\"pick-tag\">suggested</span></svg>",
	"\n      <div class=\"sheet-title\"><i class=\"gp-chip-ic\">obpal-slot-0-end</i><h2>Profile</h2><span class=\"sheet-sub\">obpal-slot-1-end</span></div>\n      <div class=\"pick-grid profiles\">obpal-slot-2-end</div>\n      <p class=\"pick-for\" id=\"gp-for\">obpal-slot-3-end</p>\n      <h3>Community mappings and moves</h3>\n      <div class=\"pick-grid profiles\">obpal-slot-4-end</div>\n      <button class=\"pick\" data-clear-mapping>Clear community mapping</button>\n      <p role=\"status\" id=\"gp-pack-status\"></p>\n      <a href=\"/catalogue/#credits\" target=\"_blank\" rel=\"noopener\">Pack credits and sources</a>",
	"<svg>\n      <div class=\"sheet-title\"><i class=\"gp-chip-ic\">obpal-slot-0-end</i><h2>Profile</h2><span class=\"sheet-sub\">obpal-slot-1-end</span></div>\n      <div class=\"pick-grid profiles\">obpal-slot-2-end</div>\n      <p class=\"pick-for\" id=\"gp-for\">obpal-slot-3-end</p>\n      <h3>Community mappings and moves</h3>\n      <div class=\"pick-grid profiles\">obpal-slot-4-end</div>\n      <button class=\"pick\" data-clear-mapping>Clear community mapping</button>\n      <p role=\"status\" id=\"gp-pack-status\"></p>\n      <a href=\"/catalogue/#credits\" target=\"_blank\" rel=\"noopener\">Pack credits and sources</a></svg>",
	"<button class=\"pick\" data-pack=\"obpal-slot-0-end\" disabled=\"obpal-slot-1-end\">\n        <span class=\"pick-name\">obpal-slot-2-end</span><small class=\"pack-credit\">obpal-slot-3-end</small>\n        <small>obpal-slot-4-end</small></button>",
	"<svg><button class=\"pick\" data-pack=\"obpal-slot-0-end\" disabled=\"obpal-slot-1-end\">\n        <span class=\"pick-name\">obpal-slot-2-end</span><small class=\"pack-credit\">obpal-slot-3-end</small>\n        <small>obpal-slot-4-end</small></button></svg>",
	"<button class=\"kbd-keyobpal-slot-0-end\" data-code=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button>",
	"<svg><button class=\"kbd-keyobpal-slot-0-end\" data-code=\"obpal-slot-1-end\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button></svg>",
	"\n      <div class=\"kbd glass\" id=\"kbd\" role=\"group\" aria-label=\"Keyboard\" hidden>\n        <div class=\"kbd-in\" id=\"kbd-in\">\n          <span class=\"kbd-ic\" aria-hidden=\"true\"></span>\n          <textarea class=\"kbd-field\" id=\"kbd-text\" rows=\"1\" wrap=\"off\" autocapitalize=\"off\" spellcheck=\"false\" enterkeyhint=\"enter\" aria-label=\"Type on the screen\"></textarea>\n          <input class=\"kbd-field\" id=\"kbd-pass\" type=\"password\" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" spellcheck=\"false\" enterkeyhint=\"enter\" aria-label=\"Type a password on the screen\" hidden>\n          <span class=\"kbd-ph\" aria-hidden=\"true\"></span>\n          <span class=\"kbd-dots\" aria-hidden=\"true\"></span>\n        </div>\n        <div class=\"kbd-keys\">obpal-slot-0-end</div>\n        <button class=\"kbd-hide\" id=\"kbd-hide\" aria-label=\"Hide the keyboard\">obpal-slot-1-end</button>\n      </div>\n      <button class=\"type-prompt\" id=\"type-prompt\" hidden><span class=\"tp-ic\" aria-hidden=\"true\"></span><b>Type</b><small>password</small></button>",
	"<svg>\n      <div class=\"kbd glass\" id=\"kbd\" role=\"group\" aria-label=\"Keyboard\" hidden>\n        <div class=\"kbd-in\" id=\"kbd-in\">\n          <span class=\"kbd-ic\" aria-hidden=\"true\"></span>\n          <textarea class=\"kbd-field\" id=\"kbd-text\" rows=\"1\" wrap=\"off\" autocapitalize=\"off\" spellcheck=\"false\" enterkeyhint=\"enter\" aria-label=\"Type on the screen\"></textarea>\n          <input class=\"kbd-field\" id=\"kbd-pass\" type=\"password\" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" spellcheck=\"false\" enterkeyhint=\"enter\" aria-label=\"Type a password on the screen\" hidden>\n          <span class=\"kbd-ph\" aria-hidden=\"true\"></span>\n          <span class=\"kbd-dots\" aria-hidden=\"true\"></span>\n        </div>\n        <div class=\"kbd-keys\">obpal-slot-0-end</div>\n        <button class=\"kbd-hide\" id=\"kbd-hide\" aria-label=\"Hide the keyboard\">obpal-slot-1-end</button>\n      </div>\n      <button class=\"type-prompt\" id=\"type-prompt\" hidden><span class=\"tp-ic\" aria-hidden=\"true\"></span><b>Type</b><small>password</small></button></svg>",
	"<div class=\"music-heading\"><b>Keys</b><span class=\"music-part\"></span></div>\n      <div class=\"music-options\"><label>Key<select aria-label=\"Musical key\">obpal-slot-0-end</select></label>\n      <label>Scale<select aria-label=\"Scale\"><option value=\"pentatonic\">Pentatonic</option><option value=\"major\">Major</option><option value=\"minor\">Minor</option></select></label>\n      <button type=\"button\" aria-label=\"Octave down\">−</button><output aria-label=\"Octave\">4</output><button type=\"button\" aria-label=\"Octave up\">+</button></div>\n      <div class=\"tone-keys\"></div><div class=\"keys-expression\"><button type=\"button\" class=\"sustain\">Hold to sustain</button><button type=\"button\" class=\"air-pad\">Hold for Air</button><button type=\"button\" class=\"music-toggle\" aria-label=\"Set position for music\">Set position</button></div><p class=\"music-hint\">Tilt to bend · every key belongs</p>",
	"<svg><div class=\"music-heading\"><b>Keys</b><span class=\"music-part\"></span></div>\n      <div class=\"music-options\"><label>Key<select aria-label=\"Musical key\">obpal-slot-0-end</select></label>\n      <label>Scale<select aria-label=\"Scale\"><option value=\"pentatonic\">Pentatonic</option><option value=\"major\">Major</option><option value=\"minor\">Minor</option></select></label>\n      <button type=\"button\" aria-label=\"Octave down\">−</button><output aria-label=\"Octave\">4</output><button type=\"button\" aria-label=\"Octave up\">+</button></div>\n      <div class=\"tone-keys\"></div><div class=\"keys-expression\"><button type=\"button\" class=\"sustain\">Hold to sustain</button><button type=\"button\" class=\"air-pad\">Hold for Air</button><button type=\"button\" class=\"music-toggle\" aria-label=\"Set position for music\">Set position</button></div><p class=\"music-hint\">Tilt to bend · every key belongs</p></svg>",
	"<small>obpal-slot-0-end</small><span>obpal-slot-1-end</span>",
	"<svg><small>obpal-slot-0-end</small><span>obpal-slot-1-end</span></svg>",
	"<div class=\"aurora\" aria-hidden=\"true\"><i></i><i></i><i></i></div>",
	"<svg><div class=\"aurora\" aria-hidden=\"true\"><i></i><i></i><i></i></div></svg>",
	"\n    <main class=\"msg\">\n      <div class=\"logo\">obpal-slot-0-end</div>\n      <div class=\"msg-card glass\">\n        obpal-slot-1-end\n        <h1>obpal-slot-2-end</h1>\n        <p>obpal-slot-3-end</p>\n        obpal-slot-4-end\n      </div>\n    </main>",
	"<svg>\n    <main class=\"msg\">\n      <div class=\"logo\">obpal-slot-0-end</div>\n      <div class=\"msg-card glass\">\n        obpal-slot-1-end\n        <h1>obpal-slot-2-end</h1>\n        <p>obpal-slot-3-end</p>\n        obpal-slot-4-end\n      </div>\n    </main></svg>",
	"<div class=\"spinner\" aria-hidden=\"true\"></div>",
	"<svg><div class=\"spinner\" aria-hidden=\"true\"></div></svg>",
	"<div class=\"msg-art\">obpal-slot-0-end</div>",
	"<svg><div class=\"msg-art\">obpal-slot-0-end</div></svg>",
	"<button class=\"btn primary\" id=\"act\">obpal-slot-0-end</button>",
	"<svg><button class=\"btn primary\" id=\"act\">obpal-slot-0-end</button></svg>",
	"\n    <form class=\"code-form\" id=\"code-form\" novalidate>\n      <label class=\"sr\" for=\"code-in\">Code from your screen</label>\n      <input class=\"code-in\" id=\"code-in\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"characters\"\n        spellcheck=\"false\" enterkeyhint=\"go\" placeholder=\"000 000 0000\" maxlength=\"24\" aria-describedby=\"code-say\" />\n      <button class=\"btn primary big\" id=\"code-go\" type=\"submit\" disabled>Connect</button>\n      <p class=\"code-say\" id=\"code-say\" role=\"status\"></p>\n    </form>\n    <p id=\"pack-arrival\" class=\"start-foot\" role=\"status\" hidden></p>\n    <p class=\"start-foot\">Nothing on the screen yet? Open <b>obpal-slot-0-end/view</b> there.</p>",
	"<svg>\n    <form class=\"code-form\" id=\"code-form\" novalidate>\n      <label class=\"sr\" for=\"code-in\">Code from your screen</label>\n      <input class=\"code-in\" id=\"code-in\" type=\"text\" inputmode=\"numeric\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"characters\"\n        spellcheck=\"false\" enterkeyhint=\"go\" placeholder=\"000 000 0000\" maxlength=\"24\" aria-describedby=\"code-say\" />\n      <button class=\"btn primary big\" id=\"code-go\" type=\"submit\" disabled>Connect</button>\n      <p class=\"code-say\" id=\"code-say\" role=\"status\"></p>\n    </form>\n    <p id=\"pack-arrival\" class=\"start-foot\" role=\"status\" hidden></p>\n    <p class=\"start-foot\">Nothing on the screen yet? Open <b>obpal-slot-0-end/view</b> there.</p></svg>",
	"\n      <div class=\"gate\" id=\"gate\">\n        <div class=\"gate-card glass\">\n          <div class=\"gate-art\" aria-hidden=\"true\">obpal-slot-0-end</div>\n          <h1>Tap to start</h1>\n          <p>Your phone's motion steers the view. Nothing is recorded.</p>\n          <button class=\"btn primary big\" id=\"start\">Start</button>\n        </div>\n      </div>",
	"<svg>\n      <div class=\"gate\" id=\"gate\">\n        <div class=\"gate-card glass\">\n          <div class=\"gate-art\" aria-hidden=\"true\">obpal-slot-0-end</div>\n          <h1>Tap to start</h1>\n          <p>Your phone's motion steers the view. Nothing is recorded.</p>\n          <button class=\"btn primary big\" id=\"start\">Start</button>\n        </div>\n      </div></svg>",
	"\n      <div class=\"surfaceobpal-slot-0-end\" id=\"surface\">\n        <header class=\"bar\">\n          <span class=\"host-ic\">obpal-slot-1-end</span>\n          <button class=\"host-name connection-title\" aria-label=\"Connections\"><span class=\"host-t\"></span>obpal-slot-2-end</button>\n          <span id=\"link-badge\"></span>\n          <button class=\"bar-btn lock-btn\" id=\"lock\" aria-label=\"Lock screen rotation\" aria-pressed=\"false\">obpal-slot-3-end</button>\n          <button class=\"bar-btn\" id=\"gear\" aria-label=\"Settings\">obpal-slot-4-end</button>\n        </header>\n        <div class=\"banner glass\" id=\"banner\" hidden></div>\n        obpal-slot-5-end\n        <div class=\"pad glass\" id=\"pad\" aria-label=\"Trackpad\">\n          <div class=\"pad-part glass\" id=\"pad-part\" hidden><span class=\"pp-dot\"></span><span class=\"pp-name\"></span><span class=\"pp-tag\"></span><button class=\"pp-x\" aria-label=\"Release part\">obpal-slot-6-end</button></div>\n          <div class=\"gestures\" id=\"gestures\" aria-hidden=\"true\"></div>\n          <div class=\"pad-wheel\" id=\"pad-wheel\" role=\"button\" aria-label=\"Scroll wheel · turn it to scroll\" hidden></div>\n          <div class=\"level\" id=\"level\" aria-hidden=\"true\"><div class=\"level-ring\"></div><div class=\"level-dot\" id=\"level-dot\"></div></div>\n          <div class=\"hold-spot\" id=\"hold-spot\" aria-hidden=\"true\" hidden><i>obpal-slot-7-end</i></div>\n          <button class=\"track-start glass\" id=\"track-start\" hidden>obpal-slot-8-end<b>Start 3D</b><small></small></button>\n          <button class=\"glow-end\" id=\"glow-end\" hidden aria-label=\"Stop glowing\">obpal-slot-9-end</button>\n          <button class=\"glow-stop\" id=\"glow-stop\" hidden>Stop</button>\n          obpal-slot-10-end\n        </div>\n        <div class=\"wii\" id=\"wii\" hidden>\n          <div class=\"wii-part\" id=\"wii-part\" hidden><span class=\"pp-dot\"></span><span class=\"wii-part-name\"></span><span class=\"wii-part-value\"></span></div>\n          <button class=\"wii-a\" id=\"wii-a\" aria-label=\"A: select\">A</button>\n          <div class=\"wii-row\">\n            <button class=\"wii-round\" id=\"wii-minus\" aria-label=\"Zoom out\">−</button>\n            <button class=\"wii-round home\" id=\"wii-home\" aria-label=\"Centre the pointer\">obpal-slot-11-end</button>\n            <button class=\"wii-round\" id=\"wii-plus\" aria-label=\"Zoom in\">+</button>\n          </div>\n          <button class=\"wii-b\" id=\"wii-b\" aria-label=\"B: hold to grab\"><b>B</b><span>hold to grab</span></button>\n        </div>\n        <div class=\"mouse\" id=\"mouse\" hidden>obpal-slot-12-end</div>\n        <div class=\"tray\" id=\"tray\"></div>\n        <div class=\"dock\">\n          <button class=\"gyro glass\" id=\"gyro\" aria-pressed=\"false\"><span class=\"gyro-ic\">obpal-slot-13-end</span><span class=\"gyro-label\">Motion</span><span class=\"gyro-sw\" aria-hidden=\"true\"><i></i></span></button>\n          <span id=\"styles-slot\"></span>\n          <button class=\"icon-btn square glass\" id=\"center\" aria-label=\"Recenter\">obpal-slot-14-end<span class=\"center-t\">Set position</span></button>\n        </div>\n      </div>\n      obpal-slot-15-end\n      <div class=\"toast glass\" id=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n      <div class=\"rest\" id=\"rest\" aria-hidden=\"true\"><span>Resting to keep your phone cool · touch to wake</span></div>",
	"<svg>\n      <div class=\"surfaceobpal-slot-0-end\" id=\"surface\">\n        <header class=\"bar\">\n          <span class=\"host-ic\">obpal-slot-1-end</span>\n          <button class=\"host-name connection-title\" aria-label=\"Connections\"><span class=\"host-t\"></span>obpal-slot-2-end</button>\n          <span id=\"link-badge\"></span>\n          <button class=\"bar-btn lock-btn\" id=\"lock\" aria-label=\"Lock screen rotation\" aria-pressed=\"false\">obpal-slot-3-end</button>\n          <button class=\"bar-btn\" id=\"gear\" aria-label=\"Settings\">obpal-slot-4-end</button>\n        </header>\n        <div class=\"banner glass\" id=\"banner\" hidden></div>\n        obpal-slot-5-end\n        <div class=\"pad glass\" id=\"pad\" aria-label=\"Trackpad\">\n          <div class=\"pad-part glass\" id=\"pad-part\" hidden><span class=\"pp-dot\"></span><span class=\"pp-name\"></span><span class=\"pp-tag\"></span><button class=\"pp-x\" aria-label=\"Release part\">obpal-slot-6-end</button></div>\n          <div class=\"gestures\" id=\"gestures\" aria-hidden=\"true\"></div>\n          <div class=\"pad-wheel\" id=\"pad-wheel\" role=\"button\" aria-label=\"Scroll wheel · turn it to scroll\" hidden></div>\n          <div class=\"level\" id=\"level\" aria-hidden=\"true\"><div class=\"level-ring\"></div><div class=\"level-dot\" id=\"level-dot\"></div></div>\n          <div class=\"hold-spot\" id=\"hold-spot\" aria-hidden=\"true\" hidden><i>obpal-slot-7-end</i></div>\n          <button class=\"track-start glass\" id=\"track-start\" hidden>obpal-slot-8-end<b>Start 3D</b><small></small></button>\n          <button class=\"glow-end\" id=\"glow-end\" hidden aria-label=\"Stop glowing\">obpal-slot-9-end</button>\n          <button class=\"glow-stop\" id=\"glow-stop\" hidden>Stop</button>\n          obpal-slot-10-end\n        </div>\n        <div class=\"wii\" id=\"wii\" hidden>\n          <div class=\"wii-part\" id=\"wii-part\" hidden><span class=\"pp-dot\"></span><span class=\"wii-part-name\"></span><span class=\"wii-part-value\"></span></div>\n          <button class=\"wii-a\" id=\"wii-a\" aria-label=\"A: select\">A</button>\n          <div class=\"wii-row\">\n            <button class=\"wii-round\" id=\"wii-minus\" aria-label=\"Zoom out\">−</button>\n            <button class=\"wii-round home\" id=\"wii-home\" aria-label=\"Centre the pointer\">obpal-slot-11-end</button>\n            <button class=\"wii-round\" id=\"wii-plus\" aria-label=\"Zoom in\">+</button>\n          </div>\n          <button class=\"wii-b\" id=\"wii-b\" aria-label=\"B: hold to grab\"><b>B</b><span>hold to grab</span></button>\n        </div>\n        <div class=\"mouse\" id=\"mouse\" hidden>obpal-slot-12-end</div>\n        <div class=\"tray\" id=\"tray\"></div>\n        <div class=\"dock\">\n          <button class=\"gyro glass\" id=\"gyro\" aria-pressed=\"false\"><span class=\"gyro-ic\">obpal-slot-13-end</span><span class=\"gyro-label\">Motion</span><span class=\"gyro-sw\" aria-hidden=\"true\"><i></i></span></button>\n          <span id=\"styles-slot\"></span>\n          <button class=\"icon-btn square glass\" id=\"center\" aria-label=\"Recenter\">obpal-slot-14-end<span class=\"center-t\">Set position</span></button>\n        </div>\n      </div>\n      obpal-slot-15-end\n      <div class=\"toast glass\" id=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n      <div class=\"rest\" id=\"rest\" aria-hidden=\"true\"><span>Resting to keep your phone cool · touch to wake</span></div></svg>",
	"<span>obpal-slot-0-end<b>obpal-slot-1-end</b></span>",
	"<svg><span>obpal-slot-0-end<b>obpal-slot-1-end</b></span></svg>",
	"<img src=\"obpal-slot-0-end\" alt=\"\" loading=\"lazy\" decoding=\"async\">",
	"<svg><img src=\"obpal-slot-0-end\" alt=\"\" loading=\"lazy\" decoding=\"async\"></svg>",
	"<span style=\"color:obpal-slot-0-end\">obpal-slot-1-end</span>",
	"<svg><span style=\"color:obpal-slot-0-end\">obpal-slot-1-end</span></svg>",
	"obpal-slot-0-end<span class=\"tray-label\"></span>",
	"<svg>obpal-slot-0-end<span class=\"tray-label\"></span></svg>",
	"<span class=\"sel-thumb\"><span class=\"seat-dot\"></span></span><span class=\"sel-v\"></span>obpal-slot-0-end",
	"<svg><span class=\"sel-thumb\"><span class=\"seat-dot\"></span></span><span class=\"sel-v\"></span>obpal-slot-0-end</svg>",
	"<span class=\"sel-thumb\">obpal-slot-0-end</span><span class=\"sel-v\"></span>obpal-slot-1-end",
	"<svg><span class=\"sel-thumb\">obpal-slot-0-end</span><span class=\"sel-v\"></span>obpal-slot-1-end</svg>",
	"<span class=\"tray-label\"></span>",
	"<svg><span class=\"tray-label\"></span></svg>",
	"<div class=\"sheet picker glass\" role=\"dialog\"><div class=\"grip\" aria-hidden=\"true\"></div><div class=\"picker-head\"><h2></h2><button class=\"icon-btn glass\" id=\"pick-close\" aria-label=\"Close\">obpal-slot-0-end</button></div><div class=\"picker-list\"></div></div>",
	"<svg><div class=\"sheet picker glass\" role=\"dialog\"><div class=\"grip\" aria-hidden=\"true\"></div><div class=\"picker-head\"><h2></h2><button class=\"icon-btn glass\" id=\"pick-close\" aria-label=\"Close\">obpal-slot-0-end</button></div><div class=\"picker-list\"></div></div></svg>",
	"<span class=\"pick-art\">obpal-slot-0-end</span><span class=\"pick-name\"></span>",
	"<svg><span class=\"pick-art\">obpal-slot-0-end</span><span class=\"pick-name\"></span></svg>",
	"\n      <div class=\"sheet settings glass\" role=\"dialog\" aria-label=\"Settings\">\n        <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button class=\"icon-btn glass sheet-x\" id=\"set-close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n        <button class=\"set-row set-cam glass\" id=\"scan-open\">obpal-slot-1-end<span>Scan a code<small>Connect another screen</small></span>obpal-slot-2-end</button>\n        obpal-slot-3-end\n        obpal-slot-4-end\n        <p class=\"sheet-k\"><b>01</b>Feel</p>\n        <label class=\"bb-field\"><span>Sensitivity</span><output id=\"gv\"></output><input class=\"bb-range\" type=\"range\" id=\"gain\" min=\"0.5\" max=\"3\" step=\"0.1\"></label>\n        <label class=\"bb-field\"><span>Steadiness</span><output id=\"sv\"></output><input class=\"bb-range\" type=\"range\" id=\"smooth\" min=\"0\" max=\"1\" step=\"0.05\"></label>\n        <p class=\"meta\">These adjust tilt and aiming. 1:1 turn follows your phone exactly.</p>\n        <label class=\"row sw-row\"><span>Feedback on phone and gamepad</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"feedback\"></label>\n        <p class=\"sheet-k\"><b>02</b>Surface</p>\n        <div class=\"theme-row\" role=\"radiogroup\" aria-label=\"Surface\">obpal-slot-5-end</div>\n        <p class=\"sheet-k\"><b>03</b>Colourobpal-slot-6-end</p>\n        <div class=\"accent-row\" role=\"radiogroup\" aria-label=\"Colour\">obpal-slot-7-end</div>\n        <p class=\"sheet-k\"><b>04</b>Holding it</p>\n        <label class=\"row sw-row\"><span>Left-handed</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"left\"></label>\n        <label class=\"row sw-row\"><span>Lock rotation while motion steers</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"lockgyro\"></label>\n        <div class=\"row track3d\" role=\"radiogroup\" aria-label=\"3D position comes from\"><span>3D position comes from</span>obpal-slot-8-endobpal-slot-9-end</div>\n        <p class=\"sheet-k\"><b>05</b>More</p>\n        <button class=\"set-row glass\" id=\"buttons-open\">obpal-slot-10-end<span>Buttons<small>Headset, remote, clicker, pad</small></span><span class=\"set-srcs\">obpal-slot-11-end</span>obpal-slot-12-end</button>\n        <button class=\"set-row glass\" id=\"connections-open\">obpal-slot-13-end<span>Connections<small>Switch, rename or forget a screen</small></span>obpal-slot-14-end</button>\n        <button class=\"set-row glass\" id=\"connection-details\">obpal-slot-15-end<span>Connection details<small>Compare the seal and see what this shares</small></span>obpal-slot-16-end</button>\n        <a class=\"support-link\" href=\"/sponsor/\" target=\"_blank\" rel=\"noopener\">obpal-slot-17-end<span>Support ob.Pal</span></a>\n        <div class=\"actions\"><button class=\"btn\" id=\"disc\">Disconnect</button><button class=\"btn primary\" id=\"done\">Done</button></div>\n      </div>",
	"<svg>\n      <div class=\"sheet settings glass\" role=\"dialog\" aria-label=\"Settings\">\n        <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button class=\"icon-btn glass sheet-x\" id=\"set-close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n        <button class=\"set-row set-cam glass\" id=\"scan-open\">obpal-slot-1-end<span>Scan a code<small>Connect another screen</small></span>obpal-slot-2-end</button>\n        obpal-slot-3-end\n        obpal-slot-4-end\n        <p class=\"sheet-k\"><b>01</b>Feel</p>\n        <label class=\"bb-field\"><span>Sensitivity</span><output id=\"gv\"></output><input class=\"bb-range\" type=\"range\" id=\"gain\" min=\"0.5\" max=\"3\" step=\"0.1\"></label>\n        <label class=\"bb-field\"><span>Steadiness</span><output id=\"sv\"></output><input class=\"bb-range\" type=\"range\" id=\"smooth\" min=\"0\" max=\"1\" step=\"0.05\"></label>\n        <p class=\"meta\">These adjust tilt and aiming. 1:1 turn follows your phone exactly.</p>\n        <label class=\"row sw-row\"><span>Feedback on phone and gamepad</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"feedback\"></label>\n        <p class=\"sheet-k\"><b>02</b>Surface</p>\n        <div class=\"theme-row\" role=\"radiogroup\" aria-label=\"Surface\">obpal-slot-5-end</div>\n        <p class=\"sheet-k\"><b>03</b>Colourobpal-slot-6-end</p>\n        <div class=\"accent-row\" role=\"radiogroup\" aria-label=\"Colour\">obpal-slot-7-end</div>\n        <p class=\"sheet-k\"><b>04</b>Holding it</p>\n        <label class=\"row sw-row\"><span>Left-handed</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"left\"></label>\n        <label class=\"row sw-row\"><span>Lock rotation while motion steers</span><input type=\"checkbox\" class=\"kit-switch\" role=\"switch\" id=\"lockgyro\"></label>\n        <div class=\"row track3d\" role=\"radiogroup\" aria-label=\"3D position comes from\"><span>3D position comes from</span>obpal-slot-8-endobpal-slot-9-end</div>\n        <p class=\"sheet-k\"><b>05</b>More</p>\n        <button class=\"set-row glass\" id=\"buttons-open\">obpal-slot-10-end<span>Buttons<small>Headset, remote, clicker, pad</small></span><span class=\"set-srcs\">obpal-slot-11-end</span>obpal-slot-12-end</button>\n        <button class=\"set-row glass\" id=\"connections-open\">obpal-slot-13-end<span>Connections<small>Switch, rename or forget a screen</small></span>obpal-slot-14-end</button>\n        <button class=\"set-row glass\" id=\"connection-details\">obpal-slot-15-end<span>Connection details<small>Compare the seal and see what this shares</small></span>obpal-slot-16-end</button>\n        <a class=\"support-link\" href=\"/sponsor/\" target=\"_blank\" rel=\"noopener\">obpal-slot-17-end<span>Support ob.Pal</span></a>\n        <div class=\"actions\"><button class=\"btn\" id=\"disc\">Disconnect</button><button class=\"btn primary\" id=\"done\">Done</button></div>\n      </div></svg>",
	"<button class=\"set-row glass\" id=\"hand-settings\">obpal-slot-0-end<span>Hand camera<small>Control with your other hand</small></span>obpal-slot-1-end</button>",
	"<svg><button class=\"set-row glass\" id=\"hand-settings\">obpal-slot-0-end<span>Hand camera<small>Control with your other hand</small></span>obpal-slot-1-end</button></svg>",
	"<button class=\"set-row glass\" id=\"body-settings\">obpal-slot-0-end<span>Body camera<small>Prop the phone facing you</small></span>obpal-slot-1-end</button>",
	"<svg><button class=\"set-row glass\" id=\"body-settings\">obpal-slot-0-end<span>Body camera<small>Prop the phone facing you</small></span>obpal-slot-1-end</button></svg>",
	"<button class=\"theme-opt\" role=\"radio\" data-theme=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\">obpal-slot-2-end<span>obpal-slot-3-end</span></button>",
	"<svg><button class=\"theme-opt\" role=\"radio\" data-theme=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\">obpal-slot-2-end<span>obpal-slot-3-end</span></button></svg>",
	"<small> · yours in this scene</small>",
	"<svg><small> · yours in this scene</small></svg>",
	"<button class=\"bb-accentobpal-slot-0-end\" role=\"radio\" data-accent=\"obpal-slot-1-end\" aria-checked=\"obpal-slot-2-end\" aria-label=\"obpal-slot-3-end\" style=\"--sw:obpal-slot-4-end\">obpal-slot-5-end</button>",
	"<svg><button class=\"bb-accentobpal-slot-0-end\" role=\"radio\" data-accent=\"obpal-slot-1-end\" aria-checked=\"obpal-slot-2-end\" aria-label=\"obpal-slot-3-end\" style=\"--sw:obpal-slot-4-end\">obpal-slot-5-end</button></svg>",
	"<button class=\"way-opt\" role=\"radio\" data-way=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\" aria-disabled=\"obpal-slot-2-end\" title=\"obpal-slot-3-end\">obpal-slot-4-end<span>obpal-slot-5-end</span></button>",
	"<svg><button class=\"way-opt\" role=\"radio\" data-way=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\" aria-disabled=\"obpal-slot-2-end\" title=\"obpal-slot-3-end\">obpal-slot-4-end<span>obpal-slot-5-end</span></button></svg>",
	"<small class=\"way-why\">obpal-slot-0-end</small>",
	"<svg><small class=\"way-why\">obpal-slot-0-end</small></svg>",
	"You left <b>obpal-slot-0-end</b>. Reconnect, or scan another code.",
	"<svg>You left <b>obpal-slot-0-end</b>. Reconnect, or scan another code.</svg>",
	"\n      <div class=\"mouse-top\">\n        <button class=\"mouse-round\" id=\"mouse-zoom-out\" aria-label=\"Zoom out\">obpal-slot-0-end</button>\n        <button class=\"mouse-round home\" id=\"mouse-home\" aria-label=\"Centre the pointer\">obpal-slot-1-end</button>\n        <button class=\"mouse-round\" id=\"mouse-zoom-in\" aria-label=\"Zoom in\">obpal-slot-2-end</button>\n      </div>\n      <div class=\"mouse-shell\">\n        <button class=\"mouse-btn left\" id=\"mouse-left\" aria-label=\"Left click · hold and aim to drag\">obpal-slot-3-end</button>\n        <div class=\"mouse-seam\">\n          <div class=\"mouse-wheel\" id=\"mouse-wheel\" role=\"button\" aria-label=\"Scroll wheel · turn it to scroll, tap to middle-click, hold and aim to scroll\"></div>\n        </div>\n        <button class=\"mouse-btn right\" id=\"mouse-right\" aria-label=\"Right click\">obpal-slot-4-end</button>\n        <div class=\"mouse-auto\" aria-hidden=\"true\">obpal-slot-5-end<span>Aim to scroll</span></div>\n      </div>",
	"<svg>\n      <div class=\"mouse-top\">\n        <button class=\"mouse-round\" id=\"mouse-zoom-out\" aria-label=\"Zoom out\">obpal-slot-0-end</button>\n        <button class=\"mouse-round home\" id=\"mouse-home\" aria-label=\"Centre the pointer\">obpal-slot-1-end</button>\n        <button class=\"mouse-round\" id=\"mouse-zoom-in\" aria-label=\"Zoom in\">obpal-slot-2-end</button>\n      </div>\n      <div class=\"mouse-shell\">\n        <button class=\"mouse-btn left\" id=\"mouse-left\" aria-label=\"Left click · hold and aim to drag\">obpal-slot-3-end</button>\n        <div class=\"mouse-seam\">\n          <div class=\"mouse-wheel\" id=\"mouse-wheel\" role=\"button\" aria-label=\"Scroll wheel · turn it to scroll, tap to middle-click, hold and aim to scroll\"></div>\n        </div>\n        <button class=\"mouse-btn right\" id=\"mouse-right\" aria-label=\"Right click\">obpal-slot-4-end</button>\n        <div class=\"mouse-auto\" aria-hidden=\"true\">obpal-slot-5-end<span>Aim to scroll</span></div>\n      </div></svg>",
	"<div class=\"nstrip\" id=\"nstrip\" role=\"toolbar\" aria-label=\"What the trackpad moves\" aria-orientation=\"vertical\" hidden><div class=\"ns-list\"></div></div><div class=\"ns-tag glass\" id=\"ns-tag\" aria-hidden=\"true\"></div>",
	"<svg><div class=\"nstrip\" id=\"nstrip\" role=\"toolbar\" aria-label=\"What the trackpad moves\" aria-orientation=\"vertical\" hidden><div class=\"ns-list\"></div></div><div class=\"ns-tag glass\" id=\"ns-tag\" aria-hidden=\"true\"></div></svg>",
	"<b class=\"ns-mono\">obpal-slot-0-end</b>",
	"<svg><b class=\"ns-mono\">obpal-slot-0-end</b></svg>",
	"obpal-slot-0-end<button type=\"button\" class=\"ns-item\" data-part=\"obpal-slot-1-end\" data-kind=\"obpal-slot-2-end\" aria-pressed=\"obpal-slot-3-end\" aria-label=\"obpal-slot-4-endobpal-slot-5-end\" title=\"obpal-slot-6-end\">obpal-slot-7-endobpal-slot-8-end<i class=\"ns-lock\" aria-hidden=\"true\">obpal-slot-9-end</i></button>",
	"<svg>obpal-slot-0-end<button type=\"button\" class=\"ns-item\" data-part=\"obpal-slot-1-end\" data-kind=\"obpal-slot-2-end\" aria-pressed=\"obpal-slot-3-end\" aria-label=\"obpal-slot-4-endobpal-slot-5-end\" title=\"obpal-slot-6-end\">obpal-slot-7-endobpal-slot-8-end<i class=\"ns-lock\" aria-hidden=\"true\">obpal-slot-9-end</i></button></svg>",
	"<i class=\"ns-sep\" aria-hidden=\"true\"></i>",
	"<svg><i class=\"ns-sep\" aria-hidden=\"true\"></i></svg>",
	"<i class=\"ns-count\" aria-hidden=\"true\">obpal-slot-0-end</i>",
	"<svg><i class=\"ns-count\" aria-hidden=\"true\">obpal-slot-0-end</i></svg>",
	"<b></b>",
	"<svg><b></b></svg>",
	"obpal-slot-0-end<span></span>",
	"<svg>obpal-slot-0-end<span></span></svg>",
	"<span class=\"ctl-gauge\" aria-hidden=\"true\">\n    obpal-slot-0-end\n    <span class=\"ctl-disc\">obpal-slot-1-end</span>\n    obpal-slot-2-end\n  </span>",
	"<svg><span class=\"ctl-gauge\" aria-hidden=\"true\">\n    obpal-slot-0-end\n    <span class=\"ctl-disc\">obpal-slot-1-end</span>\n    obpal-slot-2-end\n  </span></svg>",
	"<i class=\"ctl-mark ctl-best\">obpal-slot-0-end</i>",
	"<svg><i class=\"ctl-mark ctl-best\">obpal-slot-0-end</i></svg>",
	"<i class=\"ctl-mark ctl-no\">obpal-slot-0-end</i>",
	"<svg><i class=\"ctl-mark ctl-no\">obpal-slot-0-end</i></svg>",
	"<i class=\"ctl-mark ctl-need\">obpal-slot-0-end</i>",
	"<svg><i class=\"ctl-mark ctl-need\">obpal-slot-0-end</i></svg>",
	"<nav class=\"ctl-bar modes glass\" aria-label=\"Controller\">\n      <span class=\"ctl-tabs\" role=\"tablist\" aria-label=\"Controller\"></span>\n      <span class=\"ctl-sep\" aria-hidden=\"true\"></span>\n      <button type=\"button\" class=\"ctl-more\" id=\"ctl-more\" aria-haspopup=\"dialog\" aria-label=\"All controllers\">obpal-slot-0-end</button>\n    </nav>",
	"<svg><nav class=\"ctl-bar modes glass\" aria-label=\"Controller\">\n      <span class=\"ctl-tabs\" role=\"tablist\" aria-label=\"Controller\"></span>\n      <span class=\"ctl-sep\" aria-hidden=\"true\"></span>\n      <button type=\"button\" class=\"ctl-more\" id=\"ctl-more\" aria-haspopup=\"dialog\" aria-label=\"All controllers\">obpal-slot-0-end</button>\n    </nav></svg>",
	"<button type=\"button\" role=\"tab\" class=\"ctl-tab\" data-tab=\"obpal-slot-0-end\" data-c=\"obpal-slot-1-end\" aria-selected=\"false\" aria-label=\"obpal-slot-2-end\">\n        <span class=\"ctl-tab-ic\">obpal-slot-3-endobpal-slot-4-end</span><span class=\"ctl-tab-t\">obpal-slot-5-end</span></button>",
	"<svg><button type=\"button\" role=\"tab\" class=\"ctl-tab\" data-tab=\"obpal-slot-0-end\" data-c=\"obpal-slot-1-end\" aria-selected=\"false\" aria-label=\"obpal-slot-2-end\">\n        <span class=\"ctl-tab-ic\">obpal-slot-3-endobpal-slot-4-end</span><span class=\"ctl-tab-t\">obpal-slot-5-end</span></button></svg>",
	"<i class=\"ctl-tab-best\"></i>",
	"<svg><i class=\"ctl-tab-best\"></i></svg>",
	"<span class=\"ctl-tab-ic\">obpal-slot-0-end</span><span class=\"ctl-tab-t\">Hand</span>",
	"<svg><span class=\"ctl-tab-ic\">obpal-slot-0-end</span><span class=\"ctl-tab-t\">Hand</span></svg>",
	"<span class=\"ctl-tab-ic\">obpal-slot-0-end</span><span class=\"ctl-tab-t\">Body</span>",
	"<svg><span class=\"ctl-tab-ic\">obpal-slot-0-end</span><span class=\"ctl-tab-t\">Body</span></svg>",
	"<div class=\"sheet ctl-sheet glass\" role=\"dialog\" aria-label=\"Controllers\">\n      <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button type=\"button\" class=\"icon-btn sheet-x\" data-act=\"close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n      <header class=\"ctl-head\"><h2>Controllers</h2><p class=\"ctl-for\"><i></i><span></span></p></header>\n      <div class=\"ctl-list\" role=\"radiogroup\" aria-label=\"Controllers\"></div>\n      <footer class=\"ctl-legend\" aria-hidden=\"true\">\n        <span><i class=\"ctl-mark ctl-best\">obpal-slot-1-end</i>Best</span>\n        <span>obpal-slot-2-endFit</span>\n        <span class=\"ctl-legend-need\"><i class=\"ctl-mark ctl-need\">obpal-slot-3-end</i>Motion</span>\n        <span><i class=\"ctl-mark ctl-no\">obpal-slot-4-end</i>Not here</span>\n      </footer>\n      <p class=\"ctl-tip\" role=\"status\" aria-live=\"polite\" hidden></p>\n    </div>",
	"<svg><div class=\"sheet ctl-sheet glass\" role=\"dialog\" aria-label=\"Controllers\">\n      <div class=\"sheet-head\"><div class=\"grip\" aria-hidden=\"true\"></div><button type=\"button\" class=\"icon-btn sheet-x\" data-act=\"close\" aria-label=\"Close\">obpal-slot-0-end</button></div>\n      <header class=\"ctl-head\"><h2>Controllers</h2><p class=\"ctl-for\"><i></i><span></span></p></header>\n      <div class=\"ctl-list\" role=\"radiogroup\" aria-label=\"Controllers\"></div>\n      <footer class=\"ctl-legend\" aria-hidden=\"true\">\n        <span><i class=\"ctl-mark ctl-best\">obpal-slot-1-end</i>Best</span>\n        <span>obpal-slot-2-endFit</span>\n        <span class=\"ctl-legend-need\"><i class=\"ctl-mark ctl-need\">obpal-slot-3-end</i>Motion</span>\n        <span><i class=\"ctl-mark ctl-no\">obpal-slot-4-end</i>Not here</span>\n      </footer>\n      <p class=\"ctl-tip\" role=\"status\" aria-live=\"polite\" hidden></p>\n    </div></svg>",
	"<button type=\"button\" class=\"ctl-card\" role=\"radio\" data-c=\"obpal-slot-0-end\" data-fit=\"obpal-slot-1-end\" aria-checked=\"false\" aria-disabled=\"obpal-slot-2-end\">obpal-slot-3-end<span class=\"ctl-name\">obpal-slot-4-end</span></button>",
	"<svg><button type=\"button\" class=\"ctl-card\" role=\"radio\" data-c=\"obpal-slot-0-end\" data-fit=\"obpal-slot-1-end\" aria-checked=\"false\" aria-disabled=\"obpal-slot-2-end\">obpal-slot-3-end<span class=\"ctl-name\">obpal-slot-4-end</span></button></svg>",
	"<p class=\"ctl-k\"><b>01</b>Ready here</p>",
	"<svg><p class=\"ctl-k\"><b>01</b>Ready here</p></svg>",
	"<div class=\"ctl-grid\">obpal-slot-0-end</div>",
	"<svg><div class=\"ctl-grid\">obpal-slot-0-end</div></svg>",
	"<p class=\"ctl-k\"><b>02</b>Not on this screen</p>",
	"<svg><p class=\"ctl-k\"><b>02</b>Not on this screen</p></svg>",
	"<b></b><span></span>",
	"<svg><b></b><span></span></svg>",
	"<i></i><b></b><small></small>",
	"<svg><i></i><b></b><small></small></svg>",
	"<span class=\"person\"></span><span></span><small></small>",
	"<svg><span class=\"person\"></span><span></span><small></small></svg>",
	"<title>obpal-slot-0-end</title>",
	"<svg><title>obpal-slot-0-end</title></svg>",
	"<ellipse cx=\"50\" cy=\"57\" rx=\"47\" ry=\"15\" transform=\"rotate(-14 50 57)\" fill=\"none\" stroke=\"obpal-slot-0-end\" stroke-width=\"3\" opacity=\".32\"/>",
	"<svg><ellipse cx=\"50\" cy=\"57\" rx=\"47\" ry=\"15\" transform=\"rotate(-14 50 57)\" fill=\"none\" stroke=\"obpal-slot-0-end\" stroke-width=\"3\" opacity=\".32\"/></svg>",
	"<path d=\"M95.6 45.63 A47 15 -14 0 1 4.4 68.37\" fill=\"none\" stroke=\"obpal-slot-0-end\" stroke-width=\"3.8\" stroke-linecap=\"round\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"4.8\" fill=\"obpal-slot-1-end\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"1.8\" fill=\"#fff\"/>",
	"<svg><path d=\"M95.6 45.63 A47 15 -14 0 1 4.4 68.37\" fill=\"none\" stroke=\"obpal-slot-0-end\" stroke-width=\"3.8\" stroke-linecap=\"round\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"4.8\" fill=\"obpal-slot-1-end\"/><circle cx=\"82.1\" cy=\"60.8\" r=\"1.8\" fill=\"#fff\"/></svg>",
	"<svg class=\"bb-mark\" viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"obpal-slot-0-end\" shape-rendering=\"geometricPrecision\">obpal-slot-1-end<defs><linearGradient id=\"obpal-slot-2-endt\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#565656\"/><stop offset=\".35\" stop-color=\"#2a2a2a\"/><stop offset=\".75\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"obpal-slot-3-endl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1d1d1d\"/><stop offset=\".45\" stop-color=\"#0a0a0a\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient><linearGradient id=\"obpal-slot-4-endr\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#313131\"/><stop offset=\".5\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"obpal-slot-5-ends\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\".42\" stop-color=\"obpal-slot-6-end\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"obpal-slot-7-end\" stop-opacity=\".5\"/></linearGradient></defs>obpal-slot-8-end<g transform=\"obpal-slot-9-end\"><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"#000\"/><polygon points=\"50,19 78,34.4 50,49.8 22,34.4\" fill=\"url(#obpal-slot-10-endt)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-11-endl)\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-12-endr)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-13-ends)\" opacity=\".7\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-14-ends)\"/><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"none\" stroke=\"rgba(255,255,255,.4)\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M50,49.8 L50,80.6\" fill=\"none\" stroke=\"rgba(255,255,255,.3)\" stroke-width=\"1.3\"/><path d=\"M22,34.4 L50,49.8 L78,34.4\" fill=\"none\" stroke=\"obpal-slot-15-end\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"rgba(255,255,255,.72)\" stroke-width=\"1.3\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"obpal-slot-16-end\" stroke-width=\"1.4\" opacity=\".55\"/></g>obpal-slot-17-end</svg>",
	"<svg><svg class=\"bb-mark\" viewBox=\"0 0 100 100\" role=\"img\" aria-label=\"obpal-slot-0-end\" shape-rendering=\"geometricPrecision\">obpal-slot-1-end<defs><linearGradient id=\"obpal-slot-2-endt\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#565656\"/><stop offset=\".35\" stop-color=\"#2a2a2a\"/><stop offset=\".75\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"obpal-slot-3-endl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1d1d1d\"/><stop offset=\".45\" stop-color=\"#0a0a0a\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient><linearGradient id=\"obpal-slot-4-endr\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#313131\"/><stop offset=\".5\" stop-color=\"#141414\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient><linearGradient id=\"obpal-slot-5-ends\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\".42\" stop-color=\"obpal-slot-6-end\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"obpal-slot-7-end\" stop-opacity=\".5\"/></linearGradient></defs>obpal-slot-8-end<g transform=\"obpal-slot-9-end\"><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"#000\"/><polygon points=\"50,19 78,34.4 50,49.8 22,34.4\" fill=\"url(#obpal-slot-10-endt)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-11-endl)\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-12-endr)\"/><polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-13-ends)\" opacity=\".7\"/><polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-14-ends)\"/><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"none\" stroke=\"rgba(255,255,255,.4)\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M50,49.8 L50,80.6\" fill=\"none\" stroke=\"rgba(255,255,255,.3)\" stroke-width=\"1.3\"/><path d=\"M22,34.4 L50,49.8 L78,34.4\" fill=\"none\" stroke=\"obpal-slot-15-end\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"rgba(255,255,255,.72)\" stroke-width=\"1.3\"/><line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"obpal-slot-16-end\" stroke-width=\"1.4\" opacity=\".55\"/></g>obpal-slot-17-end</svg></svg>",
	"<svg class=\"bb-ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m6 9 6 6 6-6\"/></svg>",
	"<svg class=\"bb-ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m5 12.5 4.5 4.5L19 7.5\"/></svg>",
	"<div class=\"bb-label bb-menu-group\">Engines</div>",
	"<svg><div class=\"bb-label bb-menu-group\">Engines</div></svg>",
	"<div class=\"bb-label bb-menu-group\">Tools</div>",
	"<svg><div class=\"bb-label bb-menu-group\">Tools</div></svg>",
	"obpal-slot-0-end<a class=\"obpal-slot-1-end\" role=\"menuitem\" href=\"obpal-slot-2-end\" style=\"--bb-item-rgb:obpal-slot-3-end\" aria-current=\"obpal-slot-4-end\">obpal-slot-5-end<span><b style=\"color:obpal-slot-6-end\">obpal-slot-7-end</b><small>obpal-slot-8-end</small></span></a>",
	"<svg>obpal-slot-0-end<a class=\"obpal-slot-1-end\" role=\"menuitem\" href=\"obpal-slot-2-end\" style=\"--bb-item-rgb:obpal-slot-3-end\" aria-current=\"obpal-slot-4-end\">obpal-slot-5-end<span><b style=\"color:obpal-slot-6-end\">obpal-slot-7-end</b><small>obpal-slot-8-end</small></span></a></svg>",
	"<div class=\"bb-label bb-menu-group\">Surface</div><div class=\"bb-themes\" role=\"radiogroup\" aria-label=\"Surface\">obpal-slot-0-end</div><div class=\"bb-label bb-menu-group\">Accent</div><div class=\"bb-accents\" role=\"radiogroup\" aria-label=\"Accent\">obpal-slot-1-end</div>",
	"<svg><div class=\"bb-label bb-menu-group\">Surface</div><div class=\"bb-themes\" role=\"radiogroup\" aria-label=\"Surface\">obpal-slot-0-end</div><div class=\"bb-label bb-menu-group\">Accent</div><div class=\"bb-accents\" role=\"radiogroup\" aria-label=\"Accent\">obpal-slot-1-end</div></svg>",
	"<button type=\"button\" class=\"bb-theme\" role=\"radio\" data-bb-theme-id=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\"><i style=\"background:linear-gradient(135deg,obpal-slot-2-end,obpal-slot-3-end)\"></i>obpal-slot-4-end</button>",
	"<svg><button type=\"button\" class=\"bb-theme\" role=\"radio\" data-bb-theme-id=\"obpal-slot-0-end\" aria-checked=\"obpal-slot-1-end\"><i style=\"background:linear-gradient(135deg,obpal-slot-2-end,obpal-slot-3-end)\"></i>obpal-slot-4-end</button></svg>",
	"<button type=\"button\" class=\"bb-accentobpal-slot-0-end\" role=\"radio\" data-bb-accent-id=\"obpal-slot-1-end\" aria-checked=\"obpal-slot-2-end\" aria-label=\"obpal-slot-3-end\" data-tip=\"obpal-slot-4-end\" style=\"--sw:obpal-slot-5-end\">obpal-slot-6-end</button>",
	"<svg><button type=\"button\" class=\"bb-accentobpal-slot-0-end\" role=\"radio\" data-bb-accent-id=\"obpal-slot-1-end\" aria-checked=\"obpal-slot-2-end\" aria-label=\"obpal-slot-3-end\" data-tip=\"obpal-slot-4-end\" style=\"--sw:obpal-slot-5-end\">obpal-slot-6-end</button></svg>",
	"<span></span><button type=\"button\" aria-label=\"Dismiss\">&times;</button>",
	"<svg><span></span><button type=\"button\" aria-label=\"Dismiss\">&times;</button></svg>",
	"<span></span><button type=\"button\" aria-label=\"Dismiss hint\" data-tip=\"Dismiss hint\"><span class=\"material-symbols-outlined\" aria-hidden=\"true\">close</span></button>",
	"<svg><span></span><button type=\"button\" aria-label=\"Dismiss hint\" data-tip=\"Dismiss hint\"><span class=\"material-symbols-outlined\" aria-hidden=\"true\">close</span></button></svg>",
	"<p class=\"pair-wait\">No code right now. <a href=\"/view/\">Open the viewer</a> to try it.</p>",
	"<svg><p class=\"pair-wait\">No code right now. <a href=\"/view/\">Open the viewer</a> to try it.</p></svg>",
	"<span class=\"play-cue\" aria-hidden=\"true\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"2.6\" /><circle cx=\"12\" cy=\"12\" r=\"7\" opacity=\".45\" /></svg><span class=\"play-cue-t\"><span>Hold to play</span><span>Tilt or hold to play</span></span></span>",
	"<svg><span class=\"play-cue\" aria-hidden=\"true\"><svg class=\"ic\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"2.6\" /><circle cx=\"12\" cy=\"12\" r=\"7\" opacity=\".45\" /></svg><span class=\"play-cue-t\"><span>Hold to play</span><span>Tilt or hold to play</span></span></span></svg>",
	"<span class=\"fx\"></span><span><b></b><small></small></span><span class=\"pts\"></span>",
	"<svg><span class=\"fx\"></span><span><b></b><small></small></span><span class=\"pts\"></span></svg>",
	"<input type=\"checkbox\" /> <span></span>",
	"<svg><input type=\"checkbox\" /> <span></span></svg>",
	"<header class=\"arm-head\"><span class=\"arm-n\"></span><span class=\"nn\"><b></b><small></small></span><span class=\"arm-badge\"></span><button class=\"chip-x arm-more\" aria-expanded=\"false\">⋯</button></header>\n    <div class=\"arm-tools\" hidden><label class=\"arm-prof\"><span>Control</span><select class=\"arm-profile\"></select></label><label class=\"arm-prof\"><span>3D: hand to arm</span><select class=\"arm-scale\"></select></label><div class=\"arm-btns\"><button class=\"btn sm arm-hw\"></button><button class=\"btn sm arm-live\" hidden></button><button class=\"btn sm arm-remove\">Remove</button></div></div>\n    <ul class=\"nodes arm-nodes\"></ul><ul class=\"jgrid\"></ul>",
	"<svg><header class=\"arm-head\"><span class=\"arm-n\"></span><span class=\"nn\"><b></b><small></small></span><span class=\"arm-badge\"></span><button class=\"chip-x arm-more\" aria-expanded=\"false\">⋯</button></header>\n    <div class=\"arm-tools\" hidden><label class=\"arm-prof\"><span>Control</span><select class=\"arm-profile\"></select></label><label class=\"arm-prof\"><span>3D: hand to arm</span><select class=\"arm-scale\"></select></label><div class=\"arm-btns\"><button class=\"btn sm arm-hw\"></button><button class=\"btn sm arm-live\" hidden></button><button class=\"btn sm arm-remove\">Remove</button></div></div>\n    <ul class=\"nodes arm-nodes\"></ul><ul class=\"jgrid\"></ul></svg>",
	"<i class=\"dot\"></i><span class=\"nn\"><b>Whole arm</b><small></small></span><span class=\"nv\"></span>",
	"<svg><i class=\"dot\"></i><span class=\"nn\"><b>Whole arm</b><small></small></span><span class=\"nv\"></span></svg>",
	"<i class=\"dot\"></i><b></b>",
	"<svg><i class=\"dot\"></i><b></b></svg>",
	"<span class=\"kit-card-n\"></span><h2 class=\"kit-card-title\" id=\"sim-sound-h\">Sound</h2><span class=\"kit-card-aside\"></span>",
	"<svg><span class=\"kit-card-n\"></span><h2 class=\"kit-card-title\" id=\"sim-sound-h\">Sound</h2><span class=\"kit-card-aside\"></span></svg>",
	"obpal-slot-0-end<span>Set position</span>",
	"<svg>obpal-slot-0-end<span>Set position</span></svg>",
	"<span class=\"dev-face-ic\">obpal-slot-0-end</span><span class=\"dev-face-name\"></span><i class=\"dots\"></i>",
	"<svg><span class=\"dev-face-ic\">obpal-slot-0-end</span><span class=\"dev-face-name\"></span><i class=\"dots\"></i></svg>",
	"<span class=\"dot\" aria-hidden=\"true\"></span><span class=\"nn\"><b></b><small></small></span><span class=\"nv\"></span>",
	"<svg><span class=\"dot\" aria-hidden=\"true\"></span><span class=\"nn\"><b></b><small></small></span><span class=\"nv\"></span></svg>",
	"<b><span class=\"ptz-rec\"></span><span class=\"ptz-name\"></span></b><i></i><span class=\"ptz-flash\"></span>",
	"<svg><b><span class=\"ptz-rec\"></span><span class=\"ptz-name\"></span></b><i></i><span class=\"ptz-flash\"></span></svg>",
	"<header class=\"kit-card-head\"><span class=\"kit-card-n\"></span><h2 class=\"kit-card-title\" id=\"studio-audio-h\">Sound</h2><span class=\"kit-card-aside\"><button type=\"button\" class=\"kit-action\" id=\"studio-start\">Start sound</button></span></header><small role=\"status\">Tap here to hear the room. Start with your speakers low.</small>",
	"<svg><header class=\"kit-card-head\"><span class=\"kit-card-n\"></span><h2 class=\"kit-card-title\" id=\"studio-audio-h\">Sound</h2><span class=\"kit-card-aside\"><button type=\"button\" class=\"kit-action\" id=\"studio-start\">Start sound</button></span></header><small role=\"status\">Tap here to hear the room. Start with your speakers low.</small></svg>",
	"<span class=\"dcard-ph\">obpal-slot-0-end</span><canvas></canvas><span class=\"dcard-kind\">obpal-slot-1-end<span>obpal-slot-2-end</span></span>",
	"<svg><span class=\"dcard-ph\">obpal-slot-0-end</span><canvas></canvas><span class=\"dcard-kind\">obpal-slot-1-end<span>obpal-slot-2-end</span></span></svg>",
	"<h2>obpal-slot-0-end</h2><p>obpal-slot-1-end</p><ul class=\"dcard-faces\" aria-label=\"Controllers that suit it\"></ul><div class=\"dcard-foot\"><a class=\"dcard-go\" href=\"obpal-slot-2-end\" aria-label=\"Try the obpal-slot-3-end\"><span>Try it</span>obpal-slot-4-end</a></div>",
	"<svg><h2>obpal-slot-0-end</h2><p>obpal-slot-1-end</p><ul class=\"dcard-faces\" aria-label=\"Controllers that suit it\"></ul><div class=\"dcard-foot\"><a class=\"dcard-go\" href=\"obpal-slot-2-end\" aria-label=\"Try the obpal-slot-3-end\"><span>Try it</span>obpal-slot-4-end</a></div></svg>",
	"<span class=\"dsoon-ic\">obpal-slot-0-end</span><div><b>obpal-slot-1-end</b><p>obpal-slot-2-end</p><ul class=\"dcard-faces\"></ul></div>",
	"<svg><span class=\"dsoon-ic\">obpal-slot-0-end</span><div><b>obpal-slot-1-end</b><p>obpal-slot-2-end</p><ul class=\"dcard-faces\"></ul></div></svg>",
	"<span class=\"kit-side-ic\" aria-hidden=\"true\">obpal-slot-0-end</span><span class=\"kit-side-text\">obpal-slot-1-end</span><span class=\"kit-side-n\"></span>",
	"<svg><span class=\"kit-side-ic\" aria-hidden=\"true\">obpal-slot-0-end</span><span class=\"kit-side-text\">obpal-slot-1-end</span><span class=\"kit-side-n\"></span></svg>",
	"obpal-slot-0-end",
	"<svg>obpal-slot-0-end</svg>",
	"<span id=\"sheet-done-text\">Show sims</span>obpal-slot-0-end",
	"<svg><span id=\"sheet-done-text\">Show sims</span>obpal-slot-0-end</svg>",
	"obpal-slot-0-end<span>obpal-slot-1-end</span><button type=\"button\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button>",
	"<svg>obpal-slot-0-end<span>obpal-slot-1-end</span><button type=\"button\" aria-label=\"obpal-slot-2-end\">obpal-slot-3-end</button></svg>",
	" <p class=\"driver-disclaimer\">Tested against simulated drivers only.</p>\n        <div class=\"driver-overview\">\n          <div data-twin></div>\n          <div>\n            <span class=\"driver-eyebrow\">Measured twin</span>\n            <h3 data-state>Disconnected</h3>\n            <p data-reason role=\"status\" aria-live=\"polite\"></p>\n          </div>\n        </div>\n        <div class=\"driver-row\" data-connection>\n          <button class=\"kit-action\" data-connect type=\"button\"></button>\n          <button class=\"kit-action\" data-disconnect type=\"button\"></button>\n        </div>\n        <details data-checklist>\n          <summary>Go-live checklist <span data-check-count></span></summary>\n          <ul class=\"driver-checks\" data-checks></ul>\n          <label class=\"sim-auto\" title=\"Joint map verified\"\n            ><input type=\"checkbox\" data-mapping aria-label=\"Joint map verified\" />Map checked</label\n          >\n          <label class=\"sim-auto\" title=\"Workspace clear; emergency stop reachable\"\n            ><input type=\"checkbox\" data-workspace aria-label=\"Workspace clear; emergency stop reachable\" />Workspace\n            and Stop clear</label\n          >\n          <details class=\"driver-map\">\n            <summary>Joint map · radians</summary>\n            <div data-map></div>\n          </details>\n        </details>\n        <details data-input>\n          <summary>Motion input <span data-source-name>Jog</span></summary>\n          <div class=\"driver-row\" data-source><button type=\"button\" class=\"kit-action\" data-camera></button></div>\n          <div data-jog>\n            <div data-joint></div>\n            <div data-slider></div>\n          </div>\n          <p class=\"driver-note\">Local webcam only. Camera images stay on this device.</p>\n        </details>\n        <div class=\"driver-leg-row\">\n          <button type=\"button\" class=\"kit-action\" data-legs></button\n          ><span>Driver legs locked · practice keeps full control</span>\n        </div>\n        <p class=\"driver-note\" data-leg-reason hidden></p>\n        <div class=\"driver-footer\">\n          <button type=\"button\" class=\"kit-action driver-deadman\" data-deadman aria-pressed=\"false\">\n            <span data-deadman-label>Deadman released</span>\n          </button>\n          <p class=\"driver-note\">Hold here + tap Go live · Shift · gamepad RT</p>\n          <div class=\"driver-actions\">\n            <button type=\"button\" class=\"kit-action kit-primary\" data-live>Go live</button\n            ><button type=\"button\" class=\"estop\" data-stop>Stop</button>\n          </div>\n        </div>",
	"<svg> <p class=\"driver-disclaimer\">Tested against simulated drivers only.</p>\n        <div class=\"driver-overview\">\n          <div data-twin></div>\n          <div>\n            <span class=\"driver-eyebrow\">Measured twin</span>\n            <h3 data-state>Disconnected</h3>\n            <p data-reason role=\"status\" aria-live=\"polite\"></p>\n          </div>\n        </div>\n        <div class=\"driver-row\" data-connection>\n          <button class=\"kit-action\" data-connect type=\"button\"></button>\n          <button class=\"kit-action\" data-disconnect type=\"button\"></button>\n        </div>\n        <details data-checklist>\n          <summary>Go-live checklist <span data-check-count></span></summary>\n          <ul class=\"driver-checks\" data-checks></ul>\n          <label class=\"sim-auto\" title=\"Joint map verified\"\n            ><input type=\"checkbox\" data-mapping aria-label=\"Joint map verified\" />Map checked</label\n          >\n          <label class=\"sim-auto\" title=\"Workspace clear; emergency stop reachable\"\n            ><input type=\"checkbox\" data-workspace aria-label=\"Workspace clear; emergency stop reachable\" />Workspace\n            and Stop clear</label\n          >\n          <details class=\"driver-map\">\n            <summary>Joint map · radians</summary>\n            <div data-map></div>\n          </details>\n        </details>\n        <details data-input>\n          <summary>Motion input <span data-source-name>Jog</span></summary>\n          <div class=\"driver-row\" data-source><button type=\"button\" class=\"kit-action\" data-camera></button></div>\n          <div data-jog>\n            <div data-joint></div>\n            <div data-slider></div>\n          </div>\n          <p class=\"driver-note\">Local webcam only. Camera images stay on this device.</p>\n        </details>\n        <div class=\"driver-leg-row\">\n          <button type=\"button\" class=\"kit-action\" data-legs></button\n          ><span>Driver legs locked · practice keeps full control</span>\n        </div>\n        <p class=\"driver-note\" data-leg-reason hidden></p>\n        <div class=\"driver-footer\">\n          <button type=\"button\" class=\"kit-action driver-deadman\" data-deadman aria-pressed=\"false\">\n            <span data-deadman-label>Deadman released</span>\n          </button>\n          <p class=\"driver-note\">Hold here + tap Go live · Shift · gamepad RT</p>\n          <div class=\"driver-actions\">\n            <button type=\"button\" class=\"kit-action kit-primary\" data-live>Go live</button\n            ><button type=\"button\" class=\"estop\" data-stop>Stop</button>\n          </div>\n        </div></svg>",
	"<thead>\n            <tr>\n              <th>Joint</th>\n              <th>Wire / index</th>\n              <th>Limits</th>\n            </tr>\n          </thead>\n          <tbody>\n            obpal-slot-0-end\n          </tbody>",
	"<svg><thead>\n            <tr>\n              <th>Joint</th>\n              <th>Wire / index</th>\n              <th>Limits</th>\n            </tr>\n          </thead>\n          <tbody>\n            obpal-slot-0-end\n          </tbody></svg>",
	"<tr>\n                  <td>obpal-slot-0-end</td>\n                  <td>obpal-slot-1-end / obpal-slot-2-end</td>\n                  <td>obpal-slot-3-end</td>\n                </tr>",
	"<svg><tr>\n                  <td>obpal-slot-0-end</td>\n                  <td>obpal-slot-1-end / obpal-slot-2-end</td>\n                  <td>obpal-slot-3-end</td>\n                </tr></svg>",
	"<time></time><i></i><span></span>",
	"<svg><time></time><i></i><span></span></svg>",
	"<span class=\"person\"></span><span class=\"pp-text\"><b></b><small></small></span>",
	"<svg><span class=\"person\"></span><span class=\"pp-text\"><b></b><small></small></span></svg>",
	"\n      <li>\n        <span class=\"gb-bar\" style=\"--w:obpal-slot-0-end%\"></span>\n        <div class=\"gb-row\">\n          <span class=\"gb-name\"><a href=\"obpal-slot-1-end\" rel=\"noopener\">obpal-slot-2-end</a><small>obpal-slot-3-end · obpal-slot-4-end · obpal-slot-5-end</small></span>\n          <span class=\"gb-share\">obpal-slot-6-end%</span>\n          <a class=\"gb-give\" href=\"obpal-slot-7-end\" target=\"_blank\" rel=\"noopener\">Give obpal-slot-8-end</a>\n        </div>\n      </li>",
	"<svg>\n      <li>\n        <span class=\"gb-bar\" style=\"--w:obpal-slot-0-end%\"></span>\n        <div class=\"gb-row\">\n          <span class=\"gb-name\"><a href=\"obpal-slot-1-end\" rel=\"noopener\">obpal-slot-2-end</a><small>obpal-slot-3-end · obpal-slot-4-end · obpal-slot-5-end</small></span>\n          <span class=\"gb-share\">obpal-slot-6-end%</span>\n          <a class=\"gb-give\" href=\"obpal-slot-7-end\" target=\"_blank\" rel=\"noopener\">Give obpal-slot-8-end</a>\n        </div>\n      </li></svg>",
	"<li><b>obpal-slot-0-end</b> <span>obpal-slot-1-end: obpal-slot-2-end</span></li>",
	"<svg><li><b>obpal-slot-0-end</b> <span>obpal-slot-1-end: obpal-slot-2-end</span></li></svg>",
	"<button class=\"amt\" data-a=\"obpal-slot-0-end\" aria-pressed=\"obpal-slot-1-end\">obpal-slot-2-end</button>",
	"<svg><button class=\"amt\" data-a=\"obpal-slot-0-end\" aria-pressed=\"obpal-slot-1-end\">obpal-slot-2-end</button></svg>",
	"<a href=\"obpal-slot-0-end\" rel=\"noopener\">Manage a sponsorship</a>",
	"<svg><a href=\"obpal-slot-0-end\" rel=\"noopener\">Manage a sponsorship</a></svg>",
	"<a href=\"obpal-slot-0-end\" rel=\"noopener\">GitHub Sponsors</a>",
	"<svg><a href=\"obpal-slot-0-end\" rel=\"noopener\">GitHub Sponsors</a></svg>",
	"<span>GitHub Sponsors coming soon</span>",
	"<svg><span>GitHub Sponsors coming soon</span></svg>",
	"<i aria-hidden=\"true\">·</i>",
	"<svg><i aria-hidden=\"true\">·</i></svg>",
	"<li><span>obpal-slot-0-end</span><b>obpal-slot-1-end</b></li>",
	"<svg><li><span>obpal-slot-0-end</span><b>obpal-slot-1-end</b></li></svg>",
	"<li class=\"empty\">Be the first supporter.</li>",
	"<svg><li class=\"empty\">Be the first supporter.</li></svg>",
	"<span class=\"hint-text\"></span><button class=\"hint-x\" aria-label=\"Dismiss hint\">obpal-slot-0-end</button>",
	"<svg><span class=\"hint-text\"></span><button class=\"hint-x\" aria-label=\"Dismiss hint\">obpal-slot-0-end</button></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m8 4 12 8-12 8Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 5v14M16 5v14\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m3 10 9-7 9 7M5.5 8.2V20h5v-6h3v6h5V8.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z\"/><circle cx=\"12\" cy=\"9\" r=\"2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 18a9 9 0 1 1 16 0M12 13l4-5\"/><circle cx=\"12\" cy=\"13\" r=\"1.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9 8.5a3 3 0 0 1 6 0c0 2-3 2-3 4.5M12 16.5v.1\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3v5M6 8h12M6 8l-3 5v7h4v-4M18 8l3 5v7h-4v-4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3v5M6 8h12M6 8v5l3 7h2v-4M18 8v5l-3 7h-2v-4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m9 15 6-6M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16 8l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19.5 12a7.5 7.5 0 1 1-2.2-5.3\"/><path d=\"M19.5 4.5v4h-4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"5.5\" y=\"10.5\" width=\"13\" height=\"9.5\" rx=\"2.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5\"/><path d=\"M12 14.4v2\" stroke-width=\"2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"5.5\" y=\"10.5\" width=\"13\" height=\"9.5\" rx=\"2.6\"/><path d=\"M8.5 10.5V8a3.5 3.5 0 0 1 6.6-1.6\"/><path d=\"M12 14.4v2\" stroke-width=\"2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"7.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.4\"/><path d=\"M12 1.8v3M12 19.2v3M1.8 12h3M19.2 12h3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M3.6 10.6h6.2M14.2 10.6h6.2M12 14.2v6.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3.2 19.8 7.6v8.8L12 20.8 4.2 16.4V7.6L12 3.2Z\"/><path d=\"M4.2 7.6 12 12l7.8-4.4M12 12v8.8\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9\" ry=\"3.6\"/><ellipse cx=\"12\" cy=\"12\" rx=\"3.6\" ry=\"9\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"7\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><path d=\"M12 2.5v3.2M12 18.3v3.2M2.5 12h3.2M18.3 12h3.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 7.5h9M17 7.5h3M4 16.5h3M11 16.5h9\"/><circle cx=\"15\" cy=\"7.5\" r=\"2.2\"/><circle cx=\"9\" cy=\"16.5\" r=\"2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"3.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"3.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/><rect x=\"13.5\" y=\"13.5\" width=\"7\" height=\"7\" rx=\"2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 12a7.5 7.5 0 1 0 2.2-5.3\"/><path d=\"M4.5 4.5v4h4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9.5V4h5.5M4 4l5.5 5.5M20 9.5V4h-5.5M20 4l-5.5 5.5M4 14.5V20h5.5M4 20l5.5-5.5M20 14.5V20h-5.5M20 20l-5.5-5.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9.5 4v5.5H4M9.5 9.5 4 4M14.5 4v5.5H20M14.5 9.5 20 4M9.5 20v-5.5H4M9.5 14.5 4 20M14.5 20v-5.5H20M14.5 14.5 20 20\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5.5c4.4 0 8 1.6 8 3.5s-3.6 3.5-8 3.5-8-1.6-8-3.5\"/><path d=\"M4 9v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V9\"/><path d=\"M7.5 3.8 4 5.5l1.8 3.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M3.5 9.5h17M3.5 14.5h17M9.5 3.5v17M14.5 3.5v17\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7Z\"/><path d=\"M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 19.5h14\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m6 5 9 7-9 7Z\"/><path d=\"M18 5v14\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5.5v13M5.5 12h13\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"2.8\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/><rect x=\"9.5\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/><rect x=\"16.2\" y=\"8\" width=\"5\" height=\"8\" rx=\"1.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"8\" y=\"6.5\" width=\"8\" height=\"11\" rx=\"2.2\"/><path d=\"M3.6 9v6M20.4 9v6\" stroke-dasharray=\"1.6 2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 10l5 5 5-5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14.5 6.5 9 12l5.5 5.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9.5 6.5 15 12l-5.5 5.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"7\" y=\"2.8\" width=\"10\" height=\"18.4\" rx=\"2.8\"/><path d=\"M10.5 18h3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"5.5\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"18.5\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><ellipse cx=\"12\" cy=\"12\" rx=\"9.5\" ry=\"4\" transform=\"rotate(-25 12 12)\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 4h10l4 5-9 11L3 9l4-5Z\"/><path d=\"M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01\" stroke-width=\"2.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7H9l1.9 2h7.9a1.7 1.7 0 0 1 1.7 1.7v8.1a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z\"/><path d=\"M3.5 10.5h17\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"12\" r=\"2.6\"/><path d=\"M13.5 12h7M18 9l3 3-3 3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"6.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"11.5\" cy=\"12\" r=\"2.2\"/><path d=\"M15.5 12h5M18 9.5l2.5 2.5-2.5 2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 4l5 5M4 4v4M4 4h4M20 20l-5-5M20 20v-4M20 20h-4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M18.5 8.5A7.5 7.5 0 1 0 19.5 13\"/><path d=\"M19.5 4.5v4h-4\"/><circle cx=\"12\" cy=\"12\" r=\"1.6\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 20.2s-7.3-4.4-8.9-9A4.9 4.9 0 0 1 12 6.4a4.9 4.9 0 0 1 8.9 4.8c-1.6 4.6-8.9 9-8.9 9Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.8 1.9-1.7 0-1.2-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1a3.7 3.7 0 0 0 3.7-3.7C20.5 6.9 16.7 3.5 12 3.5Z\"/><circle cx=\"7.8\" cy=\"11\" r=\"1.1\" fill=\"currentColor\"/><circle cx=\"10.5\" cy=\"7.4\" r=\"1.1\" fill=\"currentColor\"/><circle cx=\"15\" cy=\"7.6\" r=\"1.1\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"9\" r=\"3\"/><path d=\"M12 14v6M7.5 6.5a6 6 0 0 1 9 0\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7.2 6.8h9.6c2 0 3.7 1.4 4.1 3.3l1 4.9c.4 1.9-1 3.6-2.9 3.6-.9 0-1.7-.4-2.3-1.1L15.3 16H8.7l-1.4 1.5c-.6.7-1.4 1.1-2.3 1.1-1.9 0-3.3-1.7-2.9-3.6l1-4.9c.4-1.9 2.1-3.3 4.1-3.3Z\"/><path d=\"M7.6 9.9v3.6M5.8 11.7h3.6\"/><circle cx=\"15.6\" cy=\"10.6\" r=\".9\" fill=\"currentColor\"/><circle cx=\"17.5\" cy=\"12.7\" r=\".9\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"5.5\" width=\"11\" height=\"9\" rx=\"2\"/><path d=\"M17.5 9.5h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 7.5h14M5 12h14M5 16.5h14\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 11.2 12 4.8l7.5 6.4\"/><path d=\"M6.8 9.6v8.2A1.2 1.2 0 0 0 8 19h8a1.2 1.2 0 0 0 1.2-1.2V9.6\"/><path d=\"M10.2 19v-4.2h3.6V19\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 12.2 20.2 4.4l-4.4 15.4-4.2-6.3-8.1-1.3Z\"/><path d=\"M11.6 13.5 20.2 4.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M12 3.5v5.9M4.7 15.3l5-2.3M19.3 15.3l-5-2.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 4.2 18.4 12.6l-5.3 1.1 2.7 5.4-2.5 1.2-2.7-5.4L6.6 18.6Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 9.6h3.1L12 6v12l-4.4-3.6H4.5Z\"/><path d=\"M15.2 9.3a3.8 3.8 0 0 1 0 5.4M17.8 6.8a7.4 7.4 0 0 1 0 10.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 9.6h3.1L12 6v12l-4.4-3.6H4.5Z\"/><path d=\"M15.5 9.7l4.6 4.6M20.1 9.7l-4.6 4.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6\" y=\"2.8\" width=\"12\" height=\"18.4\" rx=\"6\"/><path d=\"M12 2.8v7M6 9.8h12\"/><path d=\"M12 2.8A6 6 0 0 0 6 8.8v1h6Z\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6\" y=\"2.8\" width=\"12\" height=\"18.4\" rx=\"6\"/><path d=\"M12 2.8v7M6 9.8h12\"/><path d=\"M12 2.8a6 6 0 0 1 6 6v1h-6Z\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.6\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\" fill=\"currentColor\"/><path d=\"M9.9 8.4 12 5.9l2.1 2.5ZM9.9 15.6l2.1 2.5 2.1-2.5Z\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.3\"/><path d=\"M15.1 15.1 20 20M7.8 10.5h5.4M10.5 7.8v5.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.3\"/><path d=\"M15.1 15.1 20 20M7.8 10.5h5.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"7\" y=\"3.5\" width=\"10\" height=\"17\" rx=\"5\"/><path d=\"M12 3.5v6.2M7 9.7h10\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/><path d=\"M3.5 4.5v6h3.6\" stroke-width=\"2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"7.8\" r=\"3.8\"/><path d=\"M12 11.6v4.6M5.5 19.5h13M8.2 16.2h7.6\"/><path d=\"M17.2 10.5v-6h2.2a1.6 1.6 0 0 1 0 3.2h-2.2l2.8 2.8\" stroke-width=\"2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 15.5c2.2-1.6 5-2.5 8-2.5s5.8.9 8 2.5\"/><path d=\"M12 13V7.5M9.5 9.2 12 6.5l2.5 2.7\"/><path d=\"M4.5 19h15\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"2.6\" y=\"5.6\" width=\"18.8\" height=\"12.8\" rx=\"2.8\"/><path d=\"M6.2 9.4h.01M9.1 9.4h.01M12 9.4h.01M14.9 9.4h.01M17.8 9.4h.01M7.65 12.2h.01M10.55 12.2h.01M13.45 12.2h.01M16.35 12.2h.01\" stroke-width=\"2.2\"/><path d=\"M8.4 15.2h7.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"3.2\" width=\"18\" height=\"11.4\" rx=\"2.6\"/><path d=\"M7 6.9h.01M10.3 6.9h.01M13.7 6.9h.01M17 6.9h.01\" stroke-width=\"2.2\"/><path d=\"M8.6 10.7h6.8\"/><path d=\"M8.6 17.9 12 21l3.4-3.1\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9.3 5.8h9.5a2 2 0 0 1 2 2v8.4a2 2 0 0 1-2 2H9.3L3.4 12Z\"/><path d=\"M11.8 9.7l4.6 4.6M16.4 9.7l-4.6 4.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19.4 5.2v6a2.6 2.6 0 0 1-2.6 2.6H5.4\"/><path d=\"M9.4 9.8 5.4 13.8l4 4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 12H5.4M11 6.4 5.4 12l5.6 5.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 12h13.6M13 6.4l5.6 5.6-5.6 5.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 19V5.4M6.4 11 12 5.4l5.6 5.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 5v13.6M6.4 13l5.6 5.6 5.6-5.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 4 4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m5.5 12.5 4.2 4.2 8.8-9.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"3.2\"/><path d=\"M9.5 4.5v15\"/><path class=\"ic-flip\" d=\"m15.4 9.6-2.4 2.4 2.4 2.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m12 3.8 2.45 5 5.5.8-3.98 3.88.94 5.47L12 16.37l-4.91 2.58.94-5.47L4.05 9.6l5.5-.8Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.5 20.5h10\"/><path d=\"M6.8 20.5v-2.1a1.4 1.4 0 0 1 1.4-1.4h2.6a1.4 1.4 0 0 1 1.4 1.4v2.1\"/><path d=\"m9.6 17 3.5-8.1\"/><circle cx=\"14\" cy=\"6.9\" r=\"2.1\"/><path d=\"m16 7.8 3.4 3.3\"/><path d=\"m17.4 14.2 1.9-2.9 2.2 1.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.8 16.2V13a1.8 1.8 0 0 1 1.3-1.7l2-.6 2.3-3.2a1.9 1.9 0 0 1 1.5-.8h2.7a1.9 1.9 0 0 1 1.5.7l2.7 3.3 1.3.4a1.8 1.8 0 0 1 1.3 1.7v3.4\"/><path d=\"M5.3 16.2h.5M9.6 16.2h4.8M18.2 16.2h.5\"/><circle cx=\"7.7\" cy=\"16.4\" r=\"1.9\"/><circle cx=\"16.3\" cy=\"16.4\" r=\"1.9\"/><path d=\"M7.3 10.8h10\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"9.6\" y=\"9.6\" width=\"4.8\" height=\"4.8\" rx=\"1.4\"/><path d=\"M9.7 9.7 7.6 7.6M14.3 9.7l2.1-2.1M9.7 14.3l-2.1 2.1M14.3 14.3l2.1 2.1\"/><circle cx=\"5.9\" cy=\"5.9\" r=\"2.4\"/><circle cx=\"18.1\" cy=\"5.9\" r=\"2.4\"/><circle cx=\"5.9\" cy=\"18.1\" r=\"2.4\"/><circle cx=\"18.1\" cy=\"18.1\" r=\"2.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.8 8.2h2.7l1.5-2h6l1.5 2h2.7a1.6 1.6 0 0 1 1.6 1.6v7.6a1.6 1.6 0 0 1-1.6 1.6H4.8a1.6 1.6 0 0 1-1.6-1.6V9.8a1.6 1.6 0 0 1 1.6-1.6Z\"/><circle cx=\"12\" cy=\"13.2\" r=\"3.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 20.5h17\"/><path d=\"M4.6 20.5V11.2l4.8 3.1v-3.1l4.8 3.1V5.8h4v14.7\"/><path d=\"M7.6 17.4h1.8M11.9 17.4h1.8\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9 17.4V6l10-2.2v11.6\"/><path d=\"M9 9.3l10-2.2\"/><circle cx=\"6.8\" cy=\"17.4\" r=\"2.3\"/><circle cx=\"16.8\" cy=\"15.4\" r=\"2.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"5\" width=\"17\" height=\"14\" rx=\"2.4\"/><path d=\"M12 5v14M8.1 12.6V19M15.9 12.6V19\"/><path d=\"M7 5h2.2v7.6H7ZM14.8 5H17v7.6h-2.2Z\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><ellipse cx=\"12\" cy=\"10.2\" rx=\"7.6\" ry=\"2.9\"/><path d=\"M4.4 10.2v5.6c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9v-5.6\"/><path d=\"M7.6 12.7v5.1M12 13.1v5.6M16.4 12.7v5.1\"/><path d=\"m9.2 3.6 3.2 4.9M18.4 4.2l-4.9 4.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"3\"/><path d=\"M3.5 15.3h17M12 15.3v4.2\"/><circle cx=\"11.4\" cy=\"9.7\" r=\"1.7\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"8.4\" y=\"5.2\" width=\"7.2\" height=\"16.3\" rx=\"2.6\"/><path d=\"M12 8.2v3.2M10.4 9.8h3.2\"/><circle cx=\"12\" cy=\"15.4\" r=\"1.4\"/><path d=\"M12 1.6v1.5M8.5 2.6l.9 1M15.5 2.6l-.9 1\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M8 12.6V6.3a1.4 1.4 0 0 1 2.8 0v5\"/><path d=\"M10.8 11V4.9a1.4 1.4 0 0 1 2.8 0V11\"/><path d=\"M13.6 11.2V6.1a1.4 1.4 0 0 1 2.8 0v6\"/><path d=\"M16.4 9.5a1.4 1.4 0 0 1 2.8 0v5.2c0 3.6-2.6 6.3-6.2 6.3h-1.3c-2.3 0-3.7-1-5-2.6l-3-3.9a1.45 1.45 0 0 1 2.2-1.9L8 14.3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3.2l2.2 6.6 6.6 2.2-6.6 2.2L12 20.8l-2.2-6.6L3.2 12l6.6-2.2Z\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M6 18 18 6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 8.5v-3A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3\"/><path d=\"M7.5 12h9\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 17.5 12 21l8.5-3.5M3.5 13 12 16.5l8.5-3.5\"/><path d=\"M12 3 3.5 6.5 12 10l8.5-3.5Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 12a8 8 0 1 1-2.34-5.66\"/><path d=\"M20 3.8v4.4h-4.4\"/><rect x=\"8.9\" y=\"11.4\" width=\"6.2\" height=\"4.9\" rx=\"1.3\"/><path d=\"M10.3 11.4V10a1.7 1.7 0 0 1 3.4 0v1.4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 12a8 8 0 1 1-2.34-5.66\"/><path d=\"M20 3.8v4.4h-4.4\"/><rect x=\"8.9\" y=\"11.4\" width=\"6.2\" height=\"4.9\" rx=\"1.3\"/><path d=\"M10.3 11.4V10a1.7 1.7 0 0 1 3.3-.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3.5v7M8.8 7.3 12 10.5l3.2-3.2\"/><path d=\"M5 13.5h14l-1.4 5.3a1.6 1.6 0 0 1-1.5 1.2H7.9a1.6 1.6 0 0 1-1.5-1.2Z\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3v11.5\"/><circle cx=\"12\" cy=\"14.5\" r=\"1\" fill=\"currentColor\"/><path d=\"M17.46 11.28a8.5 4.2 0 1 1-10.92 0\"/><path d=\"M4.87 14.04 6.54 11.28l-3.13-.76\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"5.5\" cy=\"18\" r=\"2.2\"/><path d=\"M7.1 16.5 15 9.2\"/><path d=\"M21 13.9A16 16 0 0 0 15.8 5.7\"/><path d=\"M18.8 5.9 15.8 5.7l.7 2.9\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 20 10.6 12\"/><circle cx=\"12\" cy=\"10.5\" r=\"2\"/><path d=\"M13.9 11.2 20.5 13.6\"/><path d=\"M14.4 4.9a6 6 0 0 1 4.2 4.4\"/><path d=\"M19.9 6.8l-1.3 2.5-2.6-1\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"7.5\" cy=\"12\" r=\"2.3\"/><path d=\"M9.8 12h5.7\"/><path d=\"M19 5.5v13M16.8 7.7 19 5.5l2.2 2.2M16.8 16.3l2.2 2.2 2.2-2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"3.2\"/><path d=\"M12 8.8v3.2\"/><path d=\"M19.5 12a7.5 7.5 0 1 1-2.2-5.3\"/><path d=\"M19.5 4.5v4h-4\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 3v18\"/><rect x=\"8.3\" y=\"9\" width=\"7.4\" height=\"6\" rx=\"1.6\"/><path d=\"M9.2 5.8 12 3l2.8 2.8M9.2 18.2 12 21l2.8-2.8\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M6 7h10a3 3 0 0 1 3 3v1.8a7.5 7.5 0 0 1-7.5 7.5H6Z\"/><path d=\"M6 10.6H3.6M6 14.2H3.6M6 17.8H3.6\"/><path d=\"M15.5 7l1.8-3\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 20.5h8\"/><path d=\"M8 20.5v-3.2\"/><path d=\"M8 17.3 11.2 10l5.3 1.5\"/><circle cx=\"11.2\" cy=\"10\" r=\"1.6\"/><path d=\"M18.3 8.8 21 11.5l-2.7 2.7\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 21v-3.8M8.3 17.2h7.4M8.3 17.2V13l1.7-2.6M15.7 17.2V13l-1.7-2.6\"/><path d=\"M5 8.2a8 8 0 0 1 14 0\"/><path d=\"M19.9 5.3 19 8.2l-2.9-.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M9.5 11H19l-1.3 5.2a2 2 0 0 1-1.9 1.5h-3.4a2 2 0 0 1-1.9-1.4Z\"/><path d=\"M12 17.7l-.4 2M15 17.7l.4 2\"/><path d=\"M4 12.5a8.5 8.5 0 0 1 7-8\"/><path d=\"M8.6 3.3l2.4 1.2-1 2.6\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"11.5\" width=\"9\" height=\"9\" rx=\"1.8\"/><path d=\"M11.2 12.8 19.5 4.5M14.3 4.5h5.2v5.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"6.5\" y=\"4.5\" width=\"11\" height=\"7.5\" rx=\"2\"/><circle cx=\"12\" cy=\"8.25\" r=\"2\"/><path d=\"M4 17.5h16M6.5 15 4 17.5 6.5 20M17.5 15l2.5 2.5-2.5 2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3.5\" y=\"8\" width=\"10.5\" height=\"8\" rx=\"2\"/><circle cx=\"8.75\" cy=\"12\" r=\"2\"/><path d=\"M19 4v16M16.5 6.5 19 4l2.5 2.5M16.5 17.5 19 20l2.5-2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"8.3\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"8.8\" cy=\"14.1\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"15.2\" cy=\"14.1\" r=\"1.6\" fill=\"currentColor\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M3.5 12H8M16 12h4.5M6 9.5 3.5 12 6 14.5M18 9.5l2.5 2.5-2.5 2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M12 3.5V8M12 16v4.5M9.5 6 12 3.5 14.5 6M9.5 18l2.5 2.5 2.5-2.5\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"7.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"12.5\" cy=\"12\" r=\"2.2\"/><path d=\"M19 4.5v15M16.8 6.7 19 4.5l2.2 2.2M16.8 17.3l2.2 2.2 2.2-2.2\"/></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"9.5\" cy=\"7.5\" r=\"2.2\"/><circle cx=\"14.5\" cy=\"7.5\" r=\"2.2\"/><path d=\"M4.5 16h15M6.7 13.8 4.5 16l2.2 2.2M17.3 13.8l2.2 2.2-2.2 2.2\"/></svg>",
	"<g><animateMotion dur=\"7.5s\" repeatCount=\"indefinite\" calcMode=\"linear\"><mpath href=\"#obpal-slot-0-end-orbit\"/></animateMotion>obpal-slot-1-end<circle r=\"3.7\" style=\"fill:obpal-slot-2-end\"/><circle r=\"1.4\" fill=\"#fff\"/></g>",
	"<svg><g><animateMotion dur=\"7.5s\" repeatCount=\"indefinite\" calcMode=\"linear\"><mpath href=\"#obpal-slot-0-end-orbit\"/></animateMotion>obpal-slot-1-end<circle r=\"3.7\" style=\"fill:obpal-slot-2-end\"/><circle r=\"1.4\" fill=\"#fff\"/></g></svg>",
	"<circle r=\"6.5\" style=\"fill:obpal-slot-0-end\" opacity=\".45\" filter=\"url(#obpal-slot-1-end-soft)\"/>",
	"<svg><circle r=\"6.5\" style=\"fill:obpal-slot-0-end\" opacity=\".45\" filter=\"url(#obpal-slot-1-end-soft)\"/></svg>",
	"<svg class=\"mark\" viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\" shape-rendering=\"geometricPrecision\">\n  <defs>\n    <linearGradient id=\"obpal-slot-0-end-top\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4b4b4b\"/><stop offset=\".35\" stop-color=\"#262626\"/><stop offset=\".75\" stop-color=\"#131313\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-1-end-left\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1b1b1b\"/><stop offset=\".45\" stop-color=\"#0a0a0a\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-2-end-right\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2c2c2c\"/><stop offset=\".5\" stop-color=\"#121212\"/><stop offset=\"1\" stop-color=\"#040404\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-3-end-ring\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" style=\"stop-color:obpal-slot-4-end;stop-opacity:.6\"/><stop offset=\".55\" style=\"stop-color:obpal-slot-5-end\"/><stop offset=\"1\" style=\"stop-color:var(--accent-soft, #E6FFA3)\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-6-end-spill\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\".42\" style=\"stop-color:obpal-slot-7-end;stop-opacity:0\"/><stop offset=\"1\" style=\"stop-color:obpal-slot-8-end;stop-opacity:.5\"/></linearGradient>\n    <clipPath id=\"obpal-slot-9-end-box\"><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\"/></clipPath>\n    <clipPath id=\"obpal-slot-10-end-front\"><polygon points=\"0,69.47 100,44.53 100,100 0,100\"/></clipPath>\n    <path id=\"obpal-slot-11-end-orbit\" d=\"obpal-slot-12-end\"/>\n    <filter id=\"obpal-slot-13-end-soft\" filterUnits=\"userSpaceOnUse\" x=\"-20\" y=\"-20\" width=\"140\" height=\"140\"><feGaussianBlur stdDeviation=\"2.4\"/></filter>\n  </defs>\n  <ellipse cx=\"50\" cy=\"57\" rx=\"47\" ry=\"15\" transform=\"rotate(-14 50 57)\" fill=\"none\" style=\"stroke:obpal-slot-14-end\" stroke-width=\"1.8\" opacity=\".3\"/>\n  <g opacity=\".8\">obpal-slot-15-end</g>\n  <polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"#000\"/>\n  <polygon points=\"50,19 78,34.4 50,49.8 22,34.4\" fill=\"url(#obpal-slot-16-end-top)\"/>\n  <polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-17-end-left)\"/>\n  <polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-18-end-right)\"/>\n  <polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-19-end-spill)\" opacity=\".7\"/>\n  <polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-20-end-spill)\"/>\n  <g clip-path=\"url(#obpal-slot-21-end-box)\"><g class=\"mark-scan\"><line x1=\"0\" y1=\"24\" x2=\"100\" y2=\"24\" style=\"stroke:obpal-slot-22-end\" stroke-width=\"6\" filter=\"url(#obpal-slot-23-end-soft)\" opacity=\".8\"/><line x1=\"0\" y1=\"24\" x2=\"100\" y2=\"24\" stroke=\"#fff\" stroke-width=\"1.4\"/></g></g>\n  <polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"none\" stroke=\"rgba(255,255,255,.38)\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n  <path d=\"M50,49.8 L50,80.6\" fill=\"none\" stroke=\"rgba(255,255,255,.3)\" stroke-width=\"1.2\"/>\n  <path d=\"M22,34.4 L50,49.8 L78,34.4\" fill=\"none\" style=\"stroke:obpal-slot-24-end\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>\n  <line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"rgba(255,255,255,.66)\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n  <line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" style=\"stroke:obpal-slot-25-end\" stroke-width=\"1.3\" opacity=\".55\" stroke-linecap=\"round\"/>\n  <path d=\"obpal-slot-26-end\" fill=\"none\" style=\"stroke:obpal-slot-27-end\" stroke-width=\"6\" stroke-linecap=\"round\" opacity=\".35\" filter=\"url(#obpal-slot-28-end-soft)\"/>\n  <path d=\"obpal-slot-29-end\" fill=\"none\" stroke=\"url(#obpal-slot-30-end-ring)\" stroke-width=\"2.8\" stroke-linecap=\"round\"/>\n  <g clip-path=\"url(#obpal-slot-31-end-front)\">obpal-slot-32-end</g>\n</svg>",
	"<svg><svg class=\"mark\" viewBox=\"0 0 100 100\" aria-hidden=\"true\" focusable=\"false\" shape-rendering=\"geometricPrecision\">\n  <defs>\n    <linearGradient id=\"obpal-slot-0-end-top\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4b4b4b\"/><stop offset=\".35\" stop-color=\"#262626\"/><stop offset=\".75\" stop-color=\"#131313\"/><stop offset=\"1\" stop-color=\"#050505\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-1-end-left\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#1b1b1b\"/><stop offset=\".45\" stop-color=\"#0a0a0a\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-2-end-right\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2c2c2c\"/><stop offset=\".5\" stop-color=\"#121212\"/><stop offset=\"1\" stop-color=\"#040404\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-3-end-ring\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" style=\"stop-color:obpal-slot-4-end;stop-opacity:.6\"/><stop offset=\".55\" style=\"stop-color:obpal-slot-5-end\"/><stop offset=\"1\" style=\"stop-color:var(--accent-soft, #E6FFA3)\"/></linearGradient>\n    <linearGradient id=\"obpal-slot-6-end-spill\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\".42\" style=\"stop-color:obpal-slot-7-end;stop-opacity:0\"/><stop offset=\"1\" style=\"stop-color:obpal-slot-8-end;stop-opacity:.5\"/></linearGradient>\n    <clipPath id=\"obpal-slot-9-end-box\"><polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\"/></clipPath>\n    <clipPath id=\"obpal-slot-10-end-front\"><polygon points=\"0,69.47 100,44.53 100,100 0,100\"/></clipPath>\n    <path id=\"obpal-slot-11-end-orbit\" d=\"obpal-slot-12-end\"/>\n    <filter id=\"obpal-slot-13-end-soft\" filterUnits=\"userSpaceOnUse\" x=\"-20\" y=\"-20\" width=\"140\" height=\"140\"><feGaussianBlur stdDeviation=\"2.4\"/></filter>\n  </defs>\n  <ellipse cx=\"50\" cy=\"57\" rx=\"47\" ry=\"15\" transform=\"rotate(-14 50 57)\" fill=\"none\" style=\"stroke:obpal-slot-14-end\" stroke-width=\"1.8\" opacity=\".3\"/>\n  <g opacity=\".8\">obpal-slot-15-end</g>\n  <polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"#000\"/>\n  <polygon points=\"50,19 78,34.4 50,49.8 22,34.4\" fill=\"url(#obpal-slot-16-end-top)\"/>\n  <polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-17-end-left)\"/>\n  <polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-18-end-right)\"/>\n  <polygon points=\"22,34.4 50,49.8 50,80.6 22,65.2\" fill=\"url(#obpal-slot-19-end-spill)\" opacity=\".7\"/>\n  <polygon points=\"50,49.8 78,34.4 78,65.2 50,80.6\" fill=\"url(#obpal-slot-20-end-spill)\"/>\n  <g clip-path=\"url(#obpal-slot-21-end-box)\"><g class=\"mark-scan\"><line x1=\"0\" y1=\"24\" x2=\"100\" y2=\"24\" style=\"stroke:obpal-slot-22-end\" stroke-width=\"6\" filter=\"url(#obpal-slot-23-end-soft)\" opacity=\".8\"/><line x1=\"0\" y1=\"24\" x2=\"100\" y2=\"24\" stroke=\"#fff\" stroke-width=\"1.4\"/></g></g>\n  <polygon points=\"50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4\" fill=\"none\" stroke=\"rgba(255,255,255,.38)\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n  <path d=\"M50,49.8 L50,80.6\" fill=\"none\" stroke=\"rgba(255,255,255,.3)\" stroke-width=\"1.2\"/>\n  <path d=\"M22,34.4 L50,49.8 L78,34.4\" fill=\"none\" style=\"stroke:obpal-slot-24-end\" stroke-width=\"2.4\" stroke-linejoin=\"round\"/>\n  <line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" stroke=\"rgba(255,255,255,.66)\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n  <line x1=\"50\" y1=\"19\" x2=\"78\" y2=\"34.4\" style=\"stroke:obpal-slot-25-end\" stroke-width=\"1.3\" opacity=\".55\" stroke-linecap=\"round\"/>\n  <path d=\"obpal-slot-26-end\" fill=\"none\" style=\"stroke:obpal-slot-27-end\" stroke-width=\"6\" stroke-linecap=\"round\" opacity=\".35\" filter=\"url(#obpal-slot-28-end-soft)\"/>\n  <path d=\"obpal-slot-29-end\" fill=\"none\" stroke=\"url(#obpal-slot-30-end-ring)\" stroke-width=\"2.8\" stroke-linecap=\"round\"/>\n  <g clip-path=\"url(#obpal-slot-31-end-front)\">obpal-slot-32-end</g>\n</svg></svg>",
	"<span class=\"word\"><span class=\"ob\">ob</span><span class=\"pt\">.</span><b>Pal</b></span>",
	"<div class=\"kit-side-body\"><p class=\"kit-side-label\"><b>02</b> Categories</p><ul class=\"kit-side-list\">obpal-slot-0-end</ul></div>",
	"<svg><div class=\"kit-side-body\"><p class=\"kit-side-label\"><b>02</b> Categories</p><ul class=\"kit-side-list\">obpal-slot-0-end</ul></div></svg>",
	"<li><button type=\"button\" class=\"kit-side-item\" aria-pressed=\"obpal-slot-0-end\"><span class=\"kit-side-ic\" aria-hidden=\"true\">obpal-slot-1-end</span><span class=\"kit-side-text\">obpal-slot-2-end</span><span class=\"kit-side-n\">obpal-slot-3-end</span></button></li>",
	"<svg><li><button type=\"button\" class=\"kit-side-item\" aria-pressed=\"obpal-slot-0-end\"><span class=\"kit-side-ic\" aria-hidden=\"true\">obpal-slot-1-end</span><span class=\"kit-side-text\">obpal-slot-2-end</span><span class=\"kit-side-n\">obpal-slot-3-end</span></button></li></svg>",
	"<header class=\"kd-head\"><p class=\"kd-eyebrow\">ob.Pal · UI system</p><h1>The glass kit. <span>Every control, one family.</span></h1><p>Lime on Carbon, frosted glass, rounded corners, hairline edges. Keyboard, touch, focus rings and reduced motion throughout.</p></header><div class=\"kd-grid\"></div>",
	"<svg><header class=\"kd-head\"><p class=\"kd-eyebrow\">ob.Pal · UI system</p><h1>The glass kit. <span>Every control, one family.</span></h1><p>Lime on Carbon, frosted glass, rounded corners, hairline edges. Keyboard, touch, focus rings and reduced motion throughout.</p></header><div class=\"kd-grid\"></div></svg>",
	"<span>Show 33 sims</span>obpal-slot-0-end",
	"<svg><span>Show 33 sims</span>obpal-slot-0-end</svg>",
	"obpal-slot-0-end<span>obpal-slot-1-end</span><button type=\"button\" aria-label=\"Remove\">obpal-slot-2-end</button>",
	"<svg>obpal-slot-0-end<span>obpal-slot-1-end</span><button type=\"button\" aria-label=\"Remove\">obpal-slot-2-end</button></svg>",
	"<span>Take the seat</span>obpal-slot-0-end",
	"<svg><span>Take the seat</span>obpal-slot-0-end</svg>",
	"<button type=\"button\" class=\"kit-seg-item\" role=\"radio\" data-i=\"obpal-slot-0-end\" data-value=\"obpal-slot-1-end\" aria-checked=\"false\"><span class=\"kit-seg-ic\" aria-hidden=\"true\">obpal-slot-2-end</span><span class=\"kit-seg-label\">obpal-slot-3-end</span>obpal-slot-4-end</button>",
	"<svg><button type=\"button\" class=\"kit-seg-item\" role=\"radio\" data-i=\"obpal-slot-0-end\" data-value=\"obpal-slot-1-end\" aria-checked=\"false\"><span class=\"kit-seg-ic\" aria-hidden=\"true\">obpal-slot-2-end</span><span class=\"kit-seg-label\">obpal-slot-3-end</span>obpal-slot-4-end</button></svg>",
	"<span class=\"kit-seg-badge\"></span>",
	"<svg><span class=\"kit-seg-badge\"></span></svg>",
	"<span class=\"kit-select-ic\" aria-hidden=\"true\">obpal-slot-0-end</span><span class=\"kit-select-v\">obpal-slot-1-end</span>obpal-slot-2-end<span class=\"kit-select-chev\" aria-hidden=\"true\">obpal-slot-3-end</span>",
	"<svg><span class=\"kit-select-ic\" aria-hidden=\"true\">obpal-slot-0-end</span><span class=\"kit-select-v\">obpal-slot-1-end</span>obpal-slot-2-end<span class=\"kit-select-chev\" aria-hidden=\"true\">obpal-slot-3-end</span></svg>",
	"<span class=\"kit-select-badge\">obpal-slot-0-end</span>",
	"<svg><span class=\"kit-select-badge\">obpal-slot-0-end</span></svg>",
	"<div class=\"kit-option\" role=\"option\" id=\"obpal-slot-0-end-oobpal-slot-1-end\" data-i=\"obpal-slot-2-end\" data-value=\"obpal-slot-3-end\" aria-selected=\"obpal-slot-4-end\" aria-disabled=\"obpal-slot-5-end\"><span class=\"kit-option-ic\" aria-hidden=\"true\">obpal-slot-6-end</span><span class=\"kit-option-text\"><span class=\"kit-option-label\">obpal-slot-7-end</span>obpal-slot-8-end</span>obpal-slot-9-end<span class=\"kit-option-check\" aria-hidden=\"true\">obpal-slot-10-end</span></div>",
	"<svg><div class=\"kit-option\" role=\"option\" id=\"obpal-slot-0-end-oobpal-slot-1-end\" data-i=\"obpal-slot-2-end\" data-value=\"obpal-slot-3-end\" aria-selected=\"obpal-slot-4-end\" aria-disabled=\"obpal-slot-5-end\"><span class=\"kit-option-ic\" aria-hidden=\"true\">obpal-slot-6-end</span><span class=\"kit-option-text\"><span class=\"kit-option-label\">obpal-slot-7-end</span>obpal-slot-8-end</span>obpal-slot-9-end<span class=\"kit-option-check\" aria-hidden=\"true\">obpal-slot-10-end</span></div></svg>",
	"<small>obpal-slot-0-end</small>",
	"<svg><small>obpal-slot-0-end</small></svg>",
	"<span class=\"kit-option-badge\">obpal-slot-0-end</span>",
	"<svg><span class=\"kit-option-badge\">obpal-slot-0-end</span></svg>",
	"<div class=\"kit-listbox-set\" role=\"group\" aria-labelledby=\"obpal-slot-0-end-gobpal-slot-1-end\"><div class=\"kit-listbox-group\" id=\"obpal-slot-2-end-gobpal-slot-3-end\" role=\"presentation\">obpal-slot-4-end</div>obpal-slot-5-end</div>",
	"<svg><div class=\"kit-listbox-set\" role=\"group\" aria-labelledby=\"obpal-slot-0-end-gobpal-slot-1-end\"><div class=\"kit-listbox-group\" id=\"obpal-slot-2-end-gobpal-slot-3-end\" role=\"presentation\">obpal-slot-4-end</div>obpal-slot-5-end</div></svg>",
	"<div class=\"kit-sheet-head\"><span class=\"kit-grabber\" aria-hidden=\"true\"></span><h2 class=\"kit-sheet-title\"></h2><button type=\"button\" class=\"kit-icon-btn kit-sheet-x\" aria-label=\"Close\">obpal-slot-0-end</button></div><div class=\"kit-sheet-body\"></div><div class=\"kit-sheet-foot\"></div>",
	"<svg><div class=\"kit-sheet-head\"><span class=\"kit-grabber\" aria-hidden=\"true\"></span><h2 class=\"kit-sheet-title\"></h2><button type=\"button\" class=\"kit-icon-btn kit-sheet-x\" aria-label=\"Close\">obpal-slot-0-end</button></div><div class=\"kit-sheet-body\"></div><div class=\"kit-sheet-foot\"></div></svg>",
	"<span class=\"swatch\" style=\"--sw-a:obpal-slot-0-end\" aria-hidden=\"true\"><i></i><i></i></span>",
	"<svg><span class=\"swatch\" style=\"--sw-a:obpal-slot-0-end\" aria-hidden=\"true\"><i></i><i></i></span></svg>",
	"<span class=\"lf-sub lf-formats\">obpal-slot-0-end</span>",
	"<svg><span class=\"lf-sub lf-formats\">obpal-slot-0-end</span></svg>",
	"<i>obpal-slot-0-end</i>",
	"<svg><i>obpal-slot-0-end</i></svg>",
	"<svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7H9l1.9 2h7.9a1.7 1.7 0 0 1 1.7 1.7v8.1a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z\"/><path d=\"M12 11.3v5M9.5 13.8h5\"/></svg>",
	"<svg><svg class=\"ic\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3.5 7.2a1.7 1.7 0 0 1 1.7-1.7H9l1.9 2h7.9a1.7 1.7 0 0 1 1.7 1.7v8.1a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7Z\"/><path d=\"M12 11.3v5M9.5 13.8h5\"/></svg></svg>",
	"<span class=\"lf-art\"><i class=\"lf-ring\"></i></span><span class=\"lf-title\"></span><span class=\"lf-sub\"></span>",
	"<svg><span class=\"lf-art\"><i class=\"lf-ring\"></i></span><span class=\"lf-title\"></span><span class=\"lf-sub\"></span></svg>",
	"<span class=\"lf-art\">obpal-slot-0-end</span><span class=\"lf-title\">Reconnect</span><span class=\"lf-name\"></span>",
	"<svg><span class=\"lf-art\">obpal-slot-0-end</span><span class=\"lf-title\">Reconnect</span><span class=\"lf-name\"></span></svg>",
	"<span class=\"lf-art\">obpal-slot-0-end</span><span class=\"lf-title\">Connect a folder</span>obpal-slot-1-end",
	"<svg><span class=\"lf-art\">obpal-slot-0-end</span><span class=\"lf-title\">Connect a folder</span>obpal-slot-1-end</svg>",
	"<span class=\"lf-art\">obpal-slot-0-end</span><span>No 3D files here</span>obpal-slot-1-end",
	"<svg><span class=\"lf-art\">obpal-slot-0-end</span><span>No 3D files here</span>obpal-slot-1-end</svg>",
	"<span>obpal-slot-0-end</span><output></output><input class=\"bb-range\" type=\"range\" min=\"obpal-slot-1-end\" max=\"obpal-slot-2-end\" step=\"obpal-slot-3-end\" data-key=\"obpal-slot-4-end\">",
	"<svg><span>obpal-slot-0-end</span><output></output><input class=\"bb-range\" type=\"range\" min=\"obpal-slot-1-end\" max=\"obpal-slot-2-end\" step=\"obpal-slot-3-end\" data-key=\"obpal-slot-4-end\"></svg>",
	"<span class=\"tile-art\">obpal-slot-0-end</span><span class=\"tile-name\"></span>",
	"<svg><span class=\"tile-art\">obpal-slot-0-end</span><span class=\"tile-name\"></span></svg>",
	"<button class=\"sc-pick\"><span class=\"sc-dot\"></span><span class=\"sc-name\"></span></button><button class=\"sc-x\">obpal-slot-0-end</button>",
	"<svg><button class=\"sc-pick\"><span class=\"sc-dot\"></span><span class=\"sc-name\"></span></button><button class=\"sc-x\">obpal-slot-0-end</button></svg>",
	"<button class=\"sc-tool\" data-act=\"arrange\" aria-label=\"Arrange in a row\" data-tip=\"Arrange\">obpal-slot-0-end</button><button class=\"sc-tool\" data-act=\"clear\" aria-label=\"Keep only the selected object\" data-tip=\"Keep only this\">obpal-slot-1-end</button>",
	"<svg><button class=\"sc-tool\" data-act=\"arrange\" aria-label=\"Arrange in a row\" data-tip=\"Arrange\">obpal-slot-0-end</button><button class=\"sc-tool\" data-act=\"clear\" aria-label=\"Keep only the selected object\" data-tip=\"Keep only this\">obpal-slot-1-end</button></svg>",
	"<span class=\"person\"></span><span class=\"pp-text\"><b></b><small></small></span><button class=\"chip-x\" data-icon=\"close\"></button>",
	"<svg><span class=\"person\"></span><span class=\"pp-text\"><b></b><small></small></span><button class=\"chip-x\" data-icon=\"close\"></button></svg>",
	"<div class=\"nc-head\"><span class=\"nc-dot\"></span><strong class=\"nc-title\"></strong><button class=\"nc-x\" aria-label=\"Release part\">×</button></div><div class=\"nc-rows\"></div><div class=\"nc-range bb-meter\" hidden><i></i></div><div class=\"nc-foot\"></div>",
	"<svg><div class=\"nc-head\"><span class=\"nc-dot\"></span><strong class=\"nc-title\"></strong><button class=\"nc-x\" aria-label=\"Release part\">×</button></div><div class=\"nc-rows\"></div><div class=\"nc-range bb-meter\" hidden><i></i></div><div class=\"nc-foot\"></div></svg>",
	"<span></span><b></b>",
	"<svg><span></span><b></b></svg>",
	"<i></i><b></b><span></span>",
	"<svg><i></i><b></b><span></span></svg>"
]);
var svgNS = "http://www.w3.org/2000/svg";
var marker = (i) => `obpal-slot-${i}-end`;
var slots = /obpal-slot-(\d+)-end/g;
/** Only skeletons extracted from our source at build time may reach the HTML parser. */
function guardMarkup(value) {
	if (!allowed.has(value)) throw new TypeError("Not an ob.Pal template");
	return value;
}
/** The controller's own offline worker is the only script URL this policy can issue. */
function guardScriptURL(value) {
	if (value !== "/p/sw.js") throw new TypeError("Not an ob.Pal script URL");
	return value;
}
var policy;
function ownPolicy() {
	const tt = globalThis.trustedTypes;
	if (tt) policy ??= tt.createPolicy("obpal-templates", {
		createHTML: guardMarkup,
		createScriptURL: guardScriptURL
	});
	return policy;
}
function trusted(s) {
	return ownPolicy()?.createHTML(s) ?? guardMarkup(s);
}
var Markup = class {
	constructor(strings, values) {
		this.strings = strings;
		this.values = values;
	}
	toString() {
		throw new TypeError("Compose templates as DOM, not strings");
	}
};
function html(strings, ...values) {
	return new Markup(strings, values);
}
function fragment(value, svg = false) {
	const result = document.createDocumentFragment();
	if (value == null || value === false) return result;
	if (Array.isArray(value)) {
		for (const v of value) result.append(fragment(v, svg));
		return result;
	}
	if (value instanceof Node) {
		result.append(value);
		return result;
	}
	if (typeof value === "string" && allowed.has(value)) value = new Markup([value], []);
	if (!(value instanceof Markup)) {
		result.append(document.createTextNode(String(value)));
		return result;
	}
	const skeleton = value.strings.map((s, i) => s + (i < value.values.length ? marker(i) : "")).join("");
	const template = document.createElement("template");
	template.innerHTML = trusted(svg ? `<svg>${skeleton}</svg>` : skeleton);
	const root = svg ? template.content.firstElementChild : template.content;
	const walk = (parent) => {
		for (const child of [...parent.childNodes]) if (child instanceof Element) {
			for (const a of [...child.attributes]) {
				if (a.name.includes("obpal-slot-")) throw new TypeError("Template attributes must have static names");
				if (!a.value.includes("obpal-slot-")) continue;
				if (/^on/i.test(a.name) || /^(srcdoc|is)$/i.test(a.name)) throw new TypeError("Executable template attribute");
				const text = a.value.replace(slots, (_, n) => String(value.values[Number(n)] ?? ""));
				if (/^(href|src|action|formaction|xlink:href)$/i.test(a.name) && /^\s*(javascript|vbscript):/i.test(text.replace(/[\u0000-\u0020]/g, ""))) throw new TypeError("Executable template URL");
				if (/^(checked|disabled|hidden|selected|multiple|readonly|required)$/.test(a.name) && /^obpal-slot-\d+-end$/.test(a.value)) child.toggleAttribute(a.name, !!value.values[Number(a.value.match(/\d+/)[0])]);
				else child.setAttributeNS(a.namespaceURI, a.name, text);
			}
			walk(child);
		} else if (child.nodeType === Node.TEXT_NODE && child.textContent?.includes("obpal-slot-")) {
			const text = child.textContent;
			const nodes = document.createDocumentFragment();
			let at = 0;
			for (const m of text.matchAll(slots)) {
				nodes.append(document.createTextNode(text.slice(at, m.index)));
				nodes.append(fragment(value.values[Number(m[1])], parent instanceof Element && parent.namespaceURI === svgNS));
				at = m.index + m[0].length;
			}
			nodes.append(document.createTextNode(text.slice(at)));
			parent.replaceChild(nodes, child);
		}
	};
	walk(root);
	result.append(...root.childNodes);
	return result;
}
function setMarkup(el, value) {
	el.replaceChildren(fragment(value, el.namespaceURI === svgNS));
}
//#endregion
//#region ../src/family/family.js
(function(global) {
	"use strict";
	if (global.BlackboxesFamily) return;
	var doc = global.document;
	var markup = null;
	var reactiveRanges = false;
	function isObpal() {
		return doc.documentElement.getAttribute("data-bb-product") === "obpal";
	}
	/** Hosts with a DOM template policy supply their tag and sink, without importing product code here. */
	function configure(options) {
		options = options || {};
		if (options.markup) markup = options.markup;
		if (options.reactiveRanges) {
			reactiveRanges = true;
			syncRanges(doc);
		}
	}
	function Template(strings, values) {
		this.strings = strings;
		this.values = values;
	}
	function html(strings) {
		var values = Array.prototype.slice.call(arguments, 1);
		return markup ? markup.html.apply(null, [strings].concat(values)) : new Template(strings, values);
	}
	function serialize(value) {
		if (value instanceof Template) return value.strings.map(function(s, i) {
			return s + (i < value.values.length ? serialize(value.values[i]) : "");
		}).join("");
		if (Array.isArray(value)) return value.map(serialize).join("");
		if (value === null || value === void 0) return "";
		if (value === ICON.check || value === ICON.chevron) return value;
		return esc(String(value));
	}
	function output(value) {
		return markup ? value : serialize(value);
	}
	function setMarkup(el, value) {
		if (markup) markup.setMarkup(el, value);
		else el.innerHTML = serialize(value);
	}
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
		var title = opts.title === false ? "" : html`<title>${p.name}</title>`;
		var ring = orbit ? html`<ellipse cx="50" cy="57" rx="47" ry="15" transform="rotate(-14 50 57)" fill="none" stroke="${a}" stroke-width="3" opacity=".32"/>` : "";
		var front = orbit ? html`<path d="M95.6 45.63 A47 15 -14 0 1 4.4 68.37" fill="none" stroke="${a}" stroke-width="3.8" stroke-linecap="round"/><circle cx="82.1" cy="60.8" r="4.8" fill="${a}"/><circle cx="82.1" cy="60.8" r="1.8" fill="#fff"/>` : "";
		return html`<svg class="bb-mark" viewBox="0 0 100 100" role="img" aria-label="${p.name}" shape-rendering="geometricPrecision">${title}<defs><linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#565656"/><stop offset=".35" stop-color="#2a2a2a"/><stop offset=".75" stop-color="#141414"/><stop offset="1" stop-color="#050505"/></linearGradient><linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d1d1d"/><stop offset=".45" stop-color="#0a0a0a"/><stop offset="1" stop-color="#000"/></linearGradient><linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#313131"/><stop offset=".5" stop-color="#141414"/><stop offset="1" stop-color="#050505"/></linearGradient><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset=".42" stop-color="${a}" stop-opacity="0"/><stop offset="1" stop-color="${a}" stop-opacity=".5"/></linearGradient></defs>${ring}<g transform="${orbit ? "" : "translate(50 50) scale(1.16) translate(-50 -49.8)"}"><polygon points="50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4" fill="#000"/><polygon points="50,19 78,34.4 50,49.8 22,34.4" fill="url(#${id}t)"/><polygon points="22,34.4 50,49.8 50,80.6 22,65.2" fill="url(#${id}l)"/><polygon points="50,49.8 78,34.4 78,65.2 50,80.6" fill="url(#${id}r)"/><polygon points="22,34.4 50,49.8 50,80.6 22,65.2" fill="url(#${id}s)" opacity=".7"/><polygon points="50,49.8 78,34.4 78,65.2 50,80.6" fill="url(#${id}s)"/><polygon points="50,19 78,34.4 78,65.2 50,80.6 22,65.2 22,34.4" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.3" stroke-linejoin="round"/><path d="M50,49.8 L50,80.6" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.3"/><path d="M22,34.4 L50,49.8 L78,34.4" fill="none" stroke="${a}" stroke-width="2.4" stroke-linejoin="round"/><line x1="50" y1="19" x2="78" y2="34.4" stroke="rgba(255,255,255,.72)" stroke-width="1.3"/><line x1="50" y1="19" x2="78" y2="34.4" stroke="${a}" stroke-width="1.4" opacity=".55"/></g>${front}</svg>`;
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
			return html`${i === 1 ? html`<div class="bb-label bb-menu-group">Engines</div>` : i === PRODUCTS.length - 1 ? html`<div class="bb-label bb-menu-group">Tools</div>` : ""}<a class="${cls}" role="menuitem" href="${href(p)}" style="--bb-item-rgb:${rgbOf(p.accent)}" aria-current="${p.id === current ? "page" : "false"}">${mark(p.id, { title: false })}<span><b style="color:${p.accent}">${p.name}</b><small>${p.category}</small></span></a>`;
		});
	}
	function themeMenu() {
		var cur = getTheme(), acc = getAccent(), own = product().accent;
		return html`<div class="bb-label bb-menu-group">Surface</div><div class="bb-themes" role="radiogroup" aria-label="Surface">${THEMES.map(function(t) {
			return html`<button type="button" class="bb-theme" role="radio" data-bb-theme-id="${t.id}" aria-checked="${t.id === cur}"><i style="background:linear-gradient(135deg,${t.surface},${t.page})"></i>${t.name}</button>`;
		})}</div><div class="bb-label bb-menu-group">Accent</div><div class="bb-accents" role="radiogroup" aria-label="Accent">${ACCENTS.filter(function(a) {
			return !a.color || a.color.toLowerCase() !== own.toLowerCase() || a.id === acc;
		}).map(function(a) {
			var label = a.id === "product" ? product().name + " colour (default)" : a.name;
			return html`<button type="button" class="bb-accent${a.id === "product" ? " product" : ""}" role="radio" data-bb-accent-id="${a.id}" aria-checked="${a.id === acc}" aria-label="${label}" data-tip="${label}" style="--sw:${a.color || own}">${ICON.check}</button>`;
		})}</div>`;
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
	function popover(button, menu, onOpen, placement) {
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
			},
			place: function() {
				if (!menu.hidden) place();
			}
		};
		function place() {
			if (isObpal() || placement) menu.style.maxHeight = "";
			if (placement) {
				placement(menu, button);
				return;
			}
			var r = button.getBoundingClientRect();
			var top = Math.round(r.bottom + 10);
			var height = menu.offsetHeight;
			if (isObpal() && top + height > global.innerHeight - 12) top = Math.max(12, r.top - height - 10);
			menu.style.position = "fixed";
			menu.style.top = top + "px";
			menu.style.maxHeight = Math.max(isObpal() ? 0 : 160, global.innerHeight - top - 12) + "px";
			menu.style.overflowY = "auto";
			var w = menu.offsetWidth;
			var x = r.left + r.width / 2 > global.innerWidth / 2 ? r.right - w : r.left;
			menu.style.left = Math.round(Math.max(12, Math.min(x, global.innerWidth - w - 12))) + "px";
		}
		function items() {
			return Array.prototype.slice.call(menu.querySelectorAll("a[href],button:not([disabled])")).filter(function(el) {
				return !isObpal() || el.getClientRects().length;
			});
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
			if (isObpal()) e.stopPropagation();
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
		global.addEventListener("resize", api.place);
		global.addEventListener("scroll", function(e) {
			if ((isObpal() || placement) && (e.target === global || !menu.contains(e.target))) api.place();
		}, true);
		if (global.visualViewport) {
			global.visualViewport.addEventListener("resize", function() {
				if (isObpal() || placement) api.place();
			});
			global.visualViewport.addEventListener("scroll", function() {
				if (isObpal() || placement) api.place();
			});
		}
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
			if (!m.childElementCount) setMarkup(m, productMenu(current, opts));
		});
	}
	function mountThemes(button, menu, placement) {
		var api = popover(button, menu, function(m) {
			setMarkup(m, themeMenu());
		}, placement);
		menu.addEventListener("click", function(e) {
			var t = e.target.closest ? e.target.closest("[data-bb-theme-id]") : null;
			var a = e.target.closest ? e.target.closest("[data-bb-accent-id]") : null;
			if (t) setTheme(t.getAttribute("data-bb-theme-id"));
			else if (a) setAccent(a.getAttribute("data-bb-accent-id"));
			else return;
			var scroll = menu.scrollTop;
			setMarkup(menu, themeMenu());
			if (!isObpal() && !placement) return;
			api.place();
			menu.scrollTop = scroll;
			var selected = t ? "[data-bb-theme-id=\"" + getTheme() + "\"]" : "[data-bb-accent-id=\"" + getAccent() + "\"]";
			menu.querySelector(selected).focus({ preventScroll: true });
		});
		return api;
	}
	/** Secondary tools (.bb-t2 inside toolsRoot) are mirrored as tiles in the More menu on narrow screens. */
	function mountMore(button, menu, toolsRoot) {
		return popover(button, menu, function(m) {
			m.replaceChildren();
			toolsRoot.querySelectorAll(".bb-t2").forEach(function(src) {
				if (src.classList.contains("bb-sep")) return;
				var item = doc.createElement("button");
				item.type = "button";
				item.className = "bb-menu-item";
				item.setAttribute("role", "menuitem");
				Array.prototype.forEach.call(src.childNodes, function(n) {
					item.appendChild(n.cloneNode(true));
				});
				var label = doc.createElement("span");
				label.textContent = src.getAttribute("aria-label") || src.getAttribute("data-tip") || "";
				item.appendChild(label);
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
		if (reactiveRanges || isObpal()) watchRange(el);
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
		if (!reactiveRanges && !isObpal()) return;
		var form = e.target;
		setTimeout(function() {
			if (form.querySelectorAll) syncRanges(form);
		}, 0);
	}, true);
	if (global.MutationObserver && doc.documentElement) {
		new global.MutationObserver(function(records) {
			if (!reactiveRanges && !isObpal()) return;
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
		if (isObpal()) syncRanges(doc);
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
			setMarkup(el, isObpal() ? html`<span></span><button type="button" aria-label="Dismiss">&times;</button>` : html`<span></span><button type="button" aria-label="Dismiss hint" data-tip="Dismiss hint"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>`);
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
				if (isObpal()) {
					var below = opts.place === "below" || opts.place !== "above" && r.top < global.innerHeight / 2;
					el.style.left = Math.round(Math.max(12, Math.min(r.left + r.width / 2 - w / 2, global.innerWidth - w - 12))) + "px";
					el.style.top = Math.round(below ? r.bottom + 12 : r.top - h - 12) + "px";
				} else {
					var side = opts.place;
					var below = side === "below" || side !== "above" && r.top < global.innerHeight / 2;
					var x = side === "right" ? r.right + 12 : side === "left" ? r.left - w - 12 : r.left + r.width / 2 - w / 2;
					var y = side === "right" || side === "left" ? r.top + r.height / 2 - h / 2 : below ? r.bottom + 12 : r.top - h - 12;
					el.style.left = Math.round(Math.max(12, Math.min(x, global.innerWidth - w - 12))) + "px";
					var minY = global.innerWidth <= 760 ? 142 : 12;
					if (global.innerWidth <= 760) y = minY;
					el.style.top = Math.round(Math.max(minY, Math.min(y, global.innerHeight - h - 12))) + "px";
				}
			};
			place();
			global.addEventListener("resize", place);
			if (!isObpal()) doc.addEventListener("pointermove", place, { passive: true });
			el._place = place;
		}, opts.delay || 900);
	}
	function dismissHint(id, silent) {
		var el = hints[id];
		if (!silent) store.sset("bb.hint." + id, "1");
		if (!el) return;
		global.removeEventListener("resize", el._place);
		doc.removeEventListener("pointermove", el._place);
		el.remove();
		delete hints[id];
	}
	global.BlackboxesFamily = {
		configure,
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
		mark: function(id, opts) {
			return output(mark(id, opts));
		},
		productMenu: function(current, opts) {
			return output(productMenu(current, opts));
		},
		themeMenu: function() {
			return output(themeMenu());
		},
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
//#region ../src/styles/ink.css?inline
var ink_default = "/* Visible glyph edges, including descenders and side bearings, supplied by ui/kit/ink.ts on every surface. */\r\n.kit-ink { display: inline-block; flex: none; text-box: trim-both cap alphabetic; margin-block: calc(var(--ink-ascent, 1cap) - 1cap) var(--ink-descent, 0px); margin-inline: var(--ink-left, 0px) var(--ink-right, 0px); transition-property: none; }\r\n.kit-ink[data-ink-lines] { flex: none; inline-size: var(--ink-width); }\r\n.kit-ink-box { display: inline-flex; align-items: center; justify-content: center; }\r\n.fact { padding-inline: 8px; justify-content: center; }\r\n@supports not (text-box: trim-both cap alphabetic) {\r\n  .kit-ink { line-height: 1; margin-block: var(--ink-top, 0px) var(--ink-bottom, 0px); }\r\n}\r\n/* Plain text actions use a centred flex line instead of the native inline baseline. Specific layouts still win. */\r\n:where(button:has(> .kit-ink), a.btn:has(> .kit-ink), .top-nav a, .page-top nav a) { display: inline-flex; align-items: center; justify-content: center; }\r\n:where(button:has(.kit-ink)) { align-content: center; }\r\n:root[data-bb-product='obpal'] .bb-theme { padding-block: 8.5px; align-content: center; }\r\n";
//#endregion
//#region ../src/ui/kit/ink.ts
/**
* Fit a control's text to its visible glyphs. Cap trimming alone misses descenders ("Try it"), accents and side
* bearings. The shared label uses the loaded font's metrics for those edges; it never stores a button-specific nudge.
*/
var controls = "button, [role=\"button\"], a.kit-action, a.kit-cta, a.dcard-go, a.sim-crumb, a.btn, .top-nav a, .page-top nav a, .kit-chip, .arm-badge, .sim-badge, .tag, .count, .fact";
var skip = "svg, kbd, sup, .kit-sr, .bb-header";
var fitted = /* @__PURE__ */ new WeakMap();
function fitControlInk(root = document.body) {
	const existing = fitted.get(root);
	if (existing) return existing;
	if (root instanceof ShadowRoot) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(ink_default);
		root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
	}
	const context = document.createElement("canvas").getContext("2d");
	const cache = /* @__PURE__ */ new Map();
	const baselines = /* @__PURE__ */ new Map();
	const pending = /* @__PURE__ */ new Set();
	const observed = /* @__PURE__ */ new WeakSet();
	let frame = 0, active = true;
	const visibility = new IntersectionObserver((entries) => {
		for (const entry of entries) if (entry.isIntersecting) pending.add(entry.target);
		if (pending.size && !frame) frame = requestAnimationFrame(flush);
	}, { rootMargin: "100px" });
	const labels = (button) => {
		for (const svg of button.querySelectorAll("svg")) {
			const view = svg.viewBox.baseVal, bounds = svg.getBBox();
			if (!view.width || !bounds.width || !bounds.height) continue;
			const style = getComputedStyle(svg);
			svg.style.translate = `${100 * (view.x + view.width / 2 - bounds.x - bounds.width / 2) / view.width}% ${100 * (view.y + view.height / 2 - bounds.y - bounds.height / 2) / view.height}%`;
			const owner = svg.parentElement === button ? svg : svg.parentElement?.matches(".kit-select-chev, .kit-select-ic, .kit-seg-ic, .ctl-tab-ic, .gp-chip-ic, .gp-scope-ic") ? svg.parentElement : null;
			const surface = owner && getComputedStyle(owner);
			const trim = surface && surface.backgroundColor === "rgba(0, 0, 0, 0)" && surface.backgroundImage === "none" && surface.boxShadow === "none" && !parseFloat(surface.borderTopWidth) && !parseFloat(surface.paddingLeft);
			if (owner && trim) {
				const gutter = parseFloat(style.width) * (1 - bounds.width / view.width) / 2;
				if (owner !== svg) svg.style.removeProperty("margin-inline");
				owner.style.marginInline = `${-gutter}px`;
			} else if (owner) owner.style.removeProperty("margin-inline");
			const layout = getComputedStyle(button), column = layout.flexDirection === "column" || layout.display.includes("grid") && layout.gridAutoFlow !== "column";
			if (owner && trim && column) {
				if (owner !== svg) svg.style.removeProperty("margin-block");
				owner.style.marginBlock = `${-parseFloat(style.height) * (1 - bounds.height / view.height) / 2}px`;
			} else if (owner) owner.style.removeProperty("margin-block");
		}
		const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT), nodes = [];
		while (walker.nextNode()) {
			const node = walker.currentNode;
			if (node.textContent?.trim() && !node.parentElement?.closest(skip)) nodes.push(node);
		}
		for (const node of nodes) {
			let label = node.parentElement;
			if (!label.classList.contains("kit-ink")) {
				const painted = label.matches(".badge, .kit-select-badge, .panel-badge, .sims-filters-n, .ns-count b, .sel-thumb, .person");
				if (painted) label.classList.add("kit-ink-box");
				if (!painted && /^(SPAN|B|SMALL|EM|I)$/.test(label.tagName) && !label.children.length && !label.matches(controls)) label.classList.add("kit-ink");
				else {
					label = document.createElement("span");
					label.className = "kit-ink";
					node.replaceWith(label);
					label.append(node);
				}
			}
			delete label.dataset.inkLines;
			const style = getComputedStyle(label);
			if (style.fontSize === "0px") continue;
			let text = node.textContent ?? "";
			if (style.textTransform === "uppercase") text = text.toUpperCase();
			if (style.textTransform === "lowercase") text = text.toLowerCase();
			const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
			const key = `${font}|${style.letterSpacing}|${text}`;
			let metrics = cache.get(key);
			if (!metrics) {
				context.font = font;
				context.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
				const ink = context.measureText(text);
				let line = baselines.get(font);
				if (!line) {
					const probe = document.createElement("span"), marker = document.createElement("i");
					probe.style.cssText = `position:fixed;left:-10000px;top:0;display:inline-block;font:${font};line-height:1;white-space:pre`;
					marker.style.cssText = "display:inline-block;width:0;height:0;margin:0;padding:0;vertical-align:baseline";
					probe.append("Hg", marker);
					document.body.append(probe);
					const box = probe.getBoundingClientRect();
					line = {
						baseline: marker.getBoundingClientRect().top - box.top,
						height: box.height
					};
					baselines.set(font, line);
					probe.remove();
				}
				metrics = {
					ascent: ink.actualBoundingBoxAscent,
					descent: ink.actualBoundingBoxDescent,
					left: ink.actualBoundingBoxLeft,
					right: ink.actualBoundingBoxRight - ink.width,
					top: ink.actualBoundingBoxAscent - line.baseline,
					bottom: ink.actualBoundingBoxDescent - (line.height - line.baseline)
				};
				cache.set(key, metrics);
			}
			for (const [name, value] of Object.entries(metrics)) label.style.setProperty(`--ink-${name}`, `${value}px`);
			const range = document.createRange();
			range.selectNodeContents(node);
			const lines = [...range.getClientRects()];
			if (lines.length > 1 && style.whiteSpace !== "nowrap") {
				label.style.setProperty("--ink-width", `${Math.max(...lines.map((line) => line.width))}px`);
				label.dataset.inkLines = "true";
				const rendered = /* @__PURE__ */ new Map();
				for (let i = 0; i < node.length; i++) {
					if (/\s/.test(node.data[i])) continue;
					range.setStart(node, i);
					range.setEnd(node, i + 1);
					const key = range.getBoundingClientRect().y.toFixed(3), line = rendered.get(key);
					if (line) line.end = i + 1;
					else rendered.set(key, {
						start: i,
						end: i + 1
					});
				}
				const edges = [...rendered.values()];
				if (edges.length) {
					context.font = font;
					context.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
					const first = context.measureText(text.slice(edges[0].start, edges[0].end)), last = context.measureText(text.slice(edges.at(-1).start, edges.at(-1).end));
					label.style.setProperty("--ink-ascent", `${first.actualBoundingBoxAscent}px`);
					label.style.setProperty("--ink-descent", `${last.actualBoundingBoxDescent}px`);
					const line = baselines.get(font);
					label.style.setProperty("--ink-top", `${first.actualBoundingBoxAscent - line.baseline}px`);
					label.style.setProperty("--ink-bottom", `${last.actualBoundingBoxDescent - (line.height - line.baseline)}px`);
				}
			}
		}
	};
	const scan = (node) => {
		if (!node?.isConnected) return;
		const add = (button) => {
			if (button.closest(skip)) return;
			if (button.matches(".sim-badge")) {
				const style = getComputedStyle(button);
				if (style.backgroundColor === "rgba(0, 0, 0, 0)" && !parseFloat(style.borderWidth) && style.boxShadow === "none") return;
			}
			pending.add(button);
			if (!observed.has(button)) {
				observed.add(button);
				visibility.observe(button);
			}
		};
		const button = node.closest(controls);
		if (button) add(button);
		for (const el of node.querySelectorAll(controls)) add(el);
		for (const el of [node, ...node.querySelectorAll("*")]) if (el.shadowRoot) fitControlInk(el.shadowRoot);
	};
	const observer = new MutationObserver((records) => {
		for (const record of records) if (record.type === "attributes") {
			if (record.target.getAttribute(record.attributeName) !== record.oldValue) scan(record.target);
		} else if (record.type === "characterData") scan(record.target.parentElement);
		else {
			for (const node of record.removedNodes) if (node instanceof HTMLElement && !node.isConnected) for (const el of [node, ...node.querySelectorAll(controls)]) {
				visibility.unobserve(el);
				observed.delete(el);
				pending.delete(el);
			}
			for (const node of record.addedNodes) if (node instanceof Element) scan(node instanceof HTMLElement ? node : node.parentElement);
			else if (node.nodeType === Node.TEXT_NODE) scan(node.parentElement);
		}
		if (pending.size && !frame) frame = requestAnimationFrame(flush);
	});
	const watch = () => observer.observe(root, {
		subtree: true,
		childList: true,
		characterData: true,
		attributes: true,
		attributeOldValue: true,
		attributeFilter: [
			"hidden",
			"class",
			"aria-expanded"
		]
	});
	function flush() {
		frame = 0;
		observer.disconnect();
		for (const button of pending) if (button.isConnected) labels(button);
		pending.clear();
		watch();
	}
	const scanRoot = () => {
		if (root instanceof HTMLElement) scan(root);
		else for (const el of root.children) if (el instanceof HTMLElement) scan(el);
	};
	document.fonts.ready.then(() => {
		if (active) {
			scanRoot();
			flush();
		}
	});
	const refresh = () => {
		cache.clear();
		baselines.clear();
		scanRoot();
		if (!frame) frame = requestAnimationFrame(flush);
	};
	const resize = new ResizeObserver(() => {
		scanRoot();
		if (!frame) frame = requestAnimationFrame(flush);
	});
	resize.observe(root instanceof ShadowRoot ? root.host : root);
	document.fonts.addEventListener("loadingdone", refresh);
	addEventListener("resize", refresh);
	const release = () => {
		active = false;
		fitted.delete(root);
		observer.disconnect();
		resize.disconnect();
		visibility.disconnect();
		cancelAnimationFrame(frame);
		document.fonts.removeEventListener("loadingdone", refresh);
		removeEventListener("resize", refresh);
	};
	fitted.set(root, release);
	return release;
}
//#endregion
//#region ../src/family/index.ts
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => fitControlInk(), { once: true });
else fitControlInk();
var family = window.BlackboxesFamily;
family.configure({
	markup: {
		html,
		setMarkup
	},
	reactiveRanges: true
});
//#endregion
//#region ../src/ui/icons.ts
/** Stroke icon set shared by the phone controller and the viewer. Names double as the protocol's standard tray icon vocabulary. */
var s$1 = (d) => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
var ICONS = {
	play: s$1("<path d=\"m8 4 12 8-12 8Z\"/>"),
	pause: s$1("<path d=\"M8 5v14M16 5v14\"/>"),
	record: s$1("<circle cx=\"12\" cy=\"12\" r=\"6\" fill=\"currentColor\"/>"),
	home: s$1("<path d=\"m3 10 9-7 9 7M5.5 8.2V20h5v-6h3v6h5V8.2\"/>"),
	position: s$1("<path d=\"M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 0 1 14 0Z\"/><circle cx=\"12\" cy=\"9\" r=\"2.5\"/>"),
	speed: s$1("<path d=\"M4 18a9 9 0 1 1 16 0M12 13l4-5\"/><circle cx=\"12\" cy=\"13\" r=\"1.4\"/>"),
	help: s$1("<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9 8.5a3 3 0 0 1 6 0c0 2-3 2-3 4.5M12 16.5v.1\"/>"),
	"grip-open": s$1("<path d=\"M12 3v5M6 8h12M6 8l-3 5v7h4v-4M18 8l3 5v7h-4v-4\"/>"),
	"grip-close": s$1("<path d=\"M12 3v5M6 8h12M6 8v5l3 7h2v-4M18 8v5l-3 7h-2v-4\"/>"),
	stop: s$1("<rect x=\"5\" y=\"5\" width=\"14\" height=\"14\" rx=\"3\"/>"),
	link: s$1("<path d=\"m9 15 6-6M8 16l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16 8l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0\"/>"),
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
	grip: s$1("<path d=\"M12 3v5M6 8h12M6 8l-3 5v7h4v-4M18 8l3 5v7h-4v-4\"/>"),
	frame: s$1("<path d=\"M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15\"/>"),
	fullscreen: s$1("<path d=\"M4 9.5V4h5.5M4 4l5.5 5.5M20 9.5V4h-5.5M20 4l-5.5 5.5M4 14.5V20h5.5M4 20l5.5-5.5M20 14.5V20h-5.5M20 20l-5.5-5.5\"/>"),
	"fullscreen-exit": s$1("<path d=\"M9.5 4v5.5H4M9.5 9.5 4 4M14.5 4v5.5H20M14.5 9.5 20 4M9.5 20v-5.5H4M9.5 14.5 4 20M14.5 20v-5.5H20M14.5 14.5 20 20\"/>"),
	spin: s$1("<path d=\"M12 5.5c4.4 0 8 1.6 8 3.5s-3.6 3.5-8 3.5-8-1.6-8-3.5\"/><path d=\"M4 9v5c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V9\"/><path d=\"M7.5 3.8 4 5.5l1.8 3.3\"/>"),
	grid: s$1("<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"3\"/><path d=\"M3.5 9.5h17M3.5 14.5h17M9.5 3.5v17M14.5 3.5v17\"/>"),
	glow: s$1("<path d=\"M11 3.5l1.7 4.8 4.8 1.7-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7Z\"/><path d=\"M18 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z\"/>"),
	upload: s$1("<path d=\"M12 15.5V4.5M7.5 9 12 4.5 16.5 9M5 19.5h14\"/>"),
	close: s$1("<path d=\"M6.5 6.5l11 11M17.5 6.5l-11 11\"/>"),
	skip: s$1("<path d=\"m6 5 9 7-9 7Z\"/><path d=\"M18 5v14\"/>"),
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
	"arrow-down": s$1("<path d=\"M12 5v13.6M6.4 13l5.6 5.6 5.6-5.6\"/>"),
	search: s$1("<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 4 4\"/>"),
	check: s$1("<path d=\"m5.5 12.5 4.2 4.2 8.8-9.4\"/>"),
	sidebar: s$1("<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"3.2\"/><path d=\"M9.5 4.5v15\"/><path class=\"ic-flip\" d=\"m15.4 9.6-2.4 2.4 2.4 2.4\"/>"),
	star: s$1("<path d=\"m12 3.8 2.45 5 5.5.8-3.98 3.88.94 5.47L12 16.37l-4.91 2.58.94-5.47L4.05 9.6l5.5-.8Z\"/>"),
	arm: s$1("<path d=\"M4.5 20.5h10\"/><path d=\"M6.8 20.5v-2.1a1.4 1.4 0 0 1 1.4-1.4h2.6a1.4 1.4 0 0 1 1.4 1.4v2.1\"/><path d=\"m9.6 17 3.5-8.1\"/><circle cx=\"14\" cy=\"6.9\" r=\"2.1\"/><path d=\"m16 7.8 3.4 3.3\"/><path d=\"m17.4 14.2 1.9-2.9 2.2 1.6\"/>"),
	car: s$1("<path d=\"M3.8 16.2V13a1.8 1.8 0 0 1 1.3-1.7l2-.6 2.3-3.2a1.9 1.9 0 0 1 1.5-.8h2.7a1.9 1.9 0 0 1 1.5.7l2.7 3.3 1.3.4a1.8 1.8 0 0 1 1.3 1.7v3.4\"/><path d=\"M5.3 16.2h.5M9.6 16.2h4.8M18.2 16.2h.5\"/><circle cx=\"7.7\" cy=\"16.4\" r=\"1.9\"/><circle cx=\"16.3\" cy=\"16.4\" r=\"1.9\"/><path d=\"M7.3 10.8h10\"/>"),
	drone: s$1("<rect x=\"9.6\" y=\"9.6\" width=\"4.8\" height=\"4.8\" rx=\"1.4\"/><path d=\"M9.7 9.7 7.6 7.6M14.3 9.7l2.1-2.1M9.7 14.3l-2.1 2.1M14.3 14.3l2.1 2.1\"/><circle cx=\"5.9\" cy=\"5.9\" r=\"2.4\"/><circle cx=\"18.1\" cy=\"5.9\" r=\"2.4\"/><circle cx=\"5.9\" cy=\"18.1\" r=\"2.4\"/><circle cx=\"18.1\" cy=\"18.1\" r=\"2.4\"/>"),
	camera: s$1("<path d=\"M4.8 8.2h2.7l1.5-2h6l1.5 2h2.7a1.6 1.6 0 0 1 1.6 1.6v7.6a1.6 1.6 0 0 1-1.6 1.6H4.8a1.6 1.6 0 0 1-1.6-1.6V9.8a1.6 1.6 0 0 1 1.6-1.6Z\"/><circle cx=\"12\" cy=\"13.2\" r=\"3.3\"/>"),
	factory: s$1("<path d=\"M3.5 20.5h17\"/><path d=\"M4.6 20.5V11.2l4.8 3.1v-3.1l4.8 3.1V5.8h4v14.7\"/><path d=\"M7.6 17.4h1.8M11.9 17.4h1.8\"/>"),
	note: s$1("<path d=\"M9 17.4V6l10-2.2v11.6\"/><path d=\"M9 9.3l10-2.2\"/><circle cx=\"6.8\" cy=\"17.4\" r=\"2.3\"/><circle cx=\"16.8\" cy=\"15.4\" r=\"2.3\"/>"),
	piano: s$1("<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"14\" rx=\"2.4\"/><path d=\"M12 5v14M8.1 12.6V19M15.9 12.6V19\"/><path d=\"M7 5h2.2v7.6H7ZM14.8 5H17v7.6h-2.2Z\" fill=\"currentColor\"/>"),
	drum: s$1("<ellipse cx=\"12\" cy=\"10.2\" rx=\"7.6\" ry=\"2.9\"/><path d=\"M4.4 10.2v5.6c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9v-5.6\"/><path d=\"M7.6 12.7v5.1M12 13.1v5.6M16.4 12.7v5.1\"/><path d=\"m9.2 3.6 3.2 4.9M18.4 4.2l-4.9 4.4\"/>"),
	trackpad: s$1("<rect x=\"3.5\" y=\"4.5\" width=\"17\" height=\"15\" rx=\"3\"/><path d=\"M3.5 15.3h17M12 15.3v4.2\"/><circle cx=\"11.4\" cy=\"9.7\" r=\"1.7\" fill=\"currentColor\"/>"),
	remote: s$1("<rect x=\"8.4\" y=\"5.2\" width=\"7.2\" height=\"16.3\" rx=\"2.6\"/><path d=\"M12 8.2v3.2M10.4 9.8h3.2\"/><circle cx=\"12\" cy=\"15.4\" r=\"1.4\"/><path d=\"M12 1.6v1.5M8.5 2.6l.9 1M15.5 2.6l-.9 1\"/>"),
	hand: s$1("<path d=\"M8 12.6V6.3a1.4 1.4 0 0 1 2.8 0v5\"/><path d=\"M10.8 11V4.9a1.4 1.4 0 0 1 2.8 0V11\"/><path d=\"M13.6 11.2V6.1a1.4 1.4 0 0 1 2.8 0v6\"/><path d=\"M16.4 9.5a1.4 1.4 0 0 1 2.8 0v5.2c0 3.6-2.6 6.3-6.2 6.3h-1.3c-2.3 0-3.7-1-5-2.6l-3-3.9a1.45 1.45 0 0 1 2.2-1.9L8 14.3\"/>"),
	best: s$1("<path d=\"M12 3.2l2.2 6.6 6.6 2.2-6.6 2.2L12 20.8l-2.2-6.6L3.2 12l6.6-2.2Z\" fill=\"currentColor\"/>"),
	ban: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><path d=\"M6 18 18 6\"/>"),
	scan: s$1("<path d=\"M4 8.5v-3A1.5 1.5 0 0 1 5.5 4h3M15.5 4h3A1.5 1.5 0 0 1 20 5.5v3M20 15.5v3a1.5 1.5 0 0 1-1.5 1.5h-3M8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3\"/><path d=\"M7.5 12h9\"/>"),
	scene: s$1("<path d=\"M3.5 17.5 12 21l8.5-3.5M3.5 13 12 16.5l8.5-3.5\"/><path d=\"M12 3 3.5 6.5 12 10l8.5-3.5Z\"/>"),
	"rotation-lock": s$1("<path d=\"M20 12a8 8 0 1 1-2.34-5.66\"/><path d=\"M20 3.8v4.4h-4.4\"/><rect x=\"8.9\" y=\"11.4\" width=\"6.2\" height=\"4.9\" rx=\"1.3\"/><path d=\"M10.3 11.4V10a1.7 1.7 0 0 1 3.4 0v1.4\"/>"),
	"rotation-free": s$1("<path d=\"M20 12a8 8 0 1 1-2.34-5.66\"/><path d=\"M20 3.8v4.4h-4.4\"/><rect x=\"8.9\" y=\"11.4\" width=\"6.2\" height=\"4.9\" rx=\"1.3\"/><path d=\"M10.3 11.4V10a1.7 1.7 0 0 1 3.3-.6\"/>"),
	take: s$1("<path d=\"M12 3.5v7M8.8 7.3 12 10.5l3.2-3.2\"/><path d=\"M5 13.5h14l-1.4 5.3a1.6 1.6 0 0 1-1.5 1.2H7.9a1.6 1.6 0 0 1-1.5-1.2Z\"/>"),
	turn: s$1("<path d=\"M12 3v11.5\"/><circle cx=\"12\" cy=\"14.5\" r=\"1\" fill=\"currentColor\"/><path d=\"M17.46 11.28a8.5 4.2 0 1 1-10.92 0\"/><path d=\"M4.87 14.04 6.54 11.28l-3.13-.76\"/>"),
	lift: s$1("<circle cx=\"5.5\" cy=\"18\" r=\"2.2\"/><path d=\"M7.1 16.5 15 9.2\"/><path d=\"M21 13.9A16 16 0 0 0 15.8 5.7\"/><path d=\"M18.8 5.9 15.8 5.7l.7 2.9\"/>"),
	bend: s$1("<path d=\"M4 20 10.6 12\"/><circle cx=\"12\" cy=\"10.5\" r=\"2\"/><path d=\"M13.9 11.2 20.5 13.6\"/><path d=\"M14.4 4.9a6 6 0 0 1 4.2 4.4\"/><path d=\"M19.9 6.8l-1.3 2.5-2.6-1\"/>"),
	nod: s$1("<circle cx=\"7.5\" cy=\"12\" r=\"2.3\"/><path d=\"M9.8 12h5.7\"/><path d=\"M19 5.5v13M16.8 7.7 19 5.5l2.2 2.2M16.8 16.3l2.2 2.2 2.2-2.2\"/>"),
	roll: s$1("<circle cx=\"12\" cy=\"12\" r=\"3.2\"/><path d=\"M12 8.8v3.2\"/><path d=\"M19.5 12a7.5 7.5 0 1 1-2.2-5.3\"/><path d=\"M19.5 4.5v4h-4\"/>"),
	slide: s$1("<path d=\"M12 3v18\"/><rect x=\"8.3\" y=\"9\" width=\"7.4\" height=\"6\" rx=\"1.6\"/><path d=\"M9.2 5.8 12 3l2.8 2.8M9.2 18.2 12 21l2.8-2.8\"/>"),
	bucket: s$1("<path d=\"M6 7h10a3 3 0 0 1 3 3v1.8a7.5 7.5 0 0 1-7.5 7.5H6Z\"/><path d=\"M6 10.6H3.6M6 14.2H3.6M6 17.8H3.6\"/><path d=\"M15.5 7l1.8-3\"/>"),
	reach: s$1("<path d=\"M4 20.5h8\"/><path d=\"M8 20.5v-3.2\"/><path d=\"M8 17.3 11.2 10l5.3 1.5\"/><circle cx=\"11.2\" cy=\"10\" r=\"1.6\"/><path d=\"M18.3 8.8 21 11.5l-2.7 2.7\"/>"),
	wrist: s$1("<path d=\"M12 21v-3.8M8.3 17.2h7.4M8.3 17.2V13l1.7-2.6M15.7 17.2V13l-1.7-2.6\"/><path d=\"M5 8.2a8 8 0 0 1 14 0\"/><path d=\"M19.9 5.3 19 8.2l-2.9-.6\"/>"),
	dig: s$1("<path d=\"M9.5 11H19l-1.3 5.2a2 2 0 0 1-1.9 1.5h-3.4a2 2 0 0 1-1.9-1.4Z\"/><path d=\"M12 17.7l-.4 2M15 17.7l.4 2\"/><path d=\"M4 12.5a8.5 8.5 0 0 1 7-8\"/><path d=\"M8.6 3.3l2.4 1.2-1 2.6\"/>"),
	depth: s$1("<rect x=\"3.5\" y=\"11.5\" width=\"9\" height=\"9\" rx=\"1.8\"/><path d=\"M11.2 12.8 19.5 4.5M14.3 4.5h5.2v5.2\"/>"),
	"look-x": s$1("<rect x=\"6.5\" y=\"4.5\" width=\"11\" height=\"7.5\" rx=\"2\"/><circle cx=\"12\" cy=\"8.25\" r=\"2\"/><path d=\"M4 17.5h16M6.5 15 4 17.5 6.5 20M17.5 15l2.5 2.5-2.5 2.5\"/>"),
	"look-y": s$1("<rect x=\"3.5\" y=\"8\" width=\"10.5\" height=\"8\" rx=\"2\"/><circle cx=\"8.75\" cy=\"12\" r=\"2\"/><path d=\"M19 4v16M16.5 6.5 19 4l2.5 2.5M16.5 17.5 19 20l2.5-2.5\"/>"),
	whole: s$1("<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"8.3\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"8.8\" cy=\"14.1\" r=\"1.6\" fill=\"currentColor\"/><circle cx=\"15.2\" cy=\"14.1\" r=\"1.6\" fill=\"currentColor\"/>"),
	"swipe-x": s$1("<circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M3.5 12H8M16 12h4.5M6 9.5 3.5 12 6 14.5M18 9.5l2.5 2.5-2.5 2.5\"/>"),
	"swipe-y": s$1("<circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M12 3.5V8M12 16v4.5M9.5 6 12 3.5 14.5 6M9.5 18l2.5 2.5 2.5-2.5\"/>"),
	"pan-y": s$1("<circle cx=\"7.5\" cy=\"12\" r=\"2.2\"/><circle cx=\"12.5\" cy=\"12\" r=\"2.2\"/><path d=\"M19 4.5v15M16.8 6.7 19 4.5l2.2 2.2M16.8 17.3l2.2 2.2 2.2-2.2\"/>"),
	"pan-x": s$1("<circle cx=\"9.5\" cy=\"7.5\" r=\"2.2\"/><circle cx=\"14.5\" cy=\"7.5\" r=\"2.2\"/><path d=\"M4.5 16h15M6.7 13.8 4.5 16l2.2 2.2M17.3 13.8l2.2 2.2-2.2 2.2\"/>")
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
	for (const slot of root.querySelectorAll("[data-mark]")) setMarkup(slot, logoMark());
	if (matchMedia("(pointer: coarse)").matches) calmMarks(root, 2);
}
function logoMark() {
	const id = `obm${++markSeq}`;
	const A = "var(--accent, #C6FF34)";
	const ring = "M95.6 45.63 A47 15 -14 0 1 4.4 68.37";
	const orbit = "M95.6 45.63 A47 15 -14 0 1 4.4 68.37 A47 15 -14 0 1 95.6 45.63";
	const sat = (glow) => html`<g><animateMotion dur="7.5s" repeatCount="indefinite" calcMode="linear"><mpath href="#${id}-orbit"/></animateMotion>${glow ? html`<circle r="6.5" style="fill:${A}" opacity=".45" filter="url(#${id}-soft)"/>` : ""}<circle r="3.7" style="fill:${A}"/><circle r="1.4" fill="#fff"/></g>`;
	return html`<svg class="mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false" shape-rendering="geometricPrecision">
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
var LOGO_WORD = `<span class="word"><span class="ob">ob</span><span class="pt">.</span><b>Pal</b></span>`;
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
      <h2 id="ask-t">Allow this phone? <b></b></h2>
      <p id="ask-d">PC mouse, keyboard and typing. Program scope is a separate choice.</p>
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
//#region ../src/ui/trust-origin.ts
/** Public pages keep the origin disclosure outside their rerendered app root. */
function mountOriginMarker() {
	if (document.querySelector("body > .community-build")) return;
	const marker = communityMarker(location.origin);
	if (marker) document.body.append(marker);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountOriginMarker, { once: true });
else mountOriginMarker();
//#endregion
//#region ../src/ui/themes.ts
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
	syncTheme();
}
/** Keep the app's legacy attribute and browser chrome in step with every family picker, including the tray. */
function syncTheme() {
	const root = document.documentElement;
	root.dataset.theme = root.dataset.bbTheme;
	document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", getComputedStyle(root).getPropertyValue("--bb-page").trim());
}
addEventListener("bb-theme", syncTheme);
family.watchTheme();
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
