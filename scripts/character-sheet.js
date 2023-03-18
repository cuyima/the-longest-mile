// import { MODULE_NAME } from "./consts.js";
import { injectCSS } from "./utils.js";

Hooks.once("init", async () => {
  injectCSS("character-sheet");
});
