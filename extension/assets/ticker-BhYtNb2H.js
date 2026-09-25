//#region src/ticker.ts
/** Dedicated-worker clock for the offscreen sampler: worker timers keep a steady 60 Hz where a hidden document's may be throttled. */
const scope = self;
setInterval(() => scope.postMessage(0), 1e3 / 60);
//#endregion
