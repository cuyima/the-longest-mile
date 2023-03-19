import { MODULE_NAME } from "./consts.js";
import { injectCSS } from "./utils.js";

Hooks.once("renderTokenActionHud", async () => {
     injectCSS("tah");
     console.log( MODULE_NAME + " | token action hud loaded -> loaded css improvements");
});