import { MODULE_NAME } from "./consts.js";
import { injectCSS } from "./utils.js";

Hooks.on("renderTokenActionHud", (app, html, data) => {
     injectCSS("tlm-tah");
     console.log( MODULE_NAME + " | token action hud loaded -> loaded css improvements");
});