import { injectCSS } from "./utils.js";
import { MODULE_NAME } from "./consts.js";

Hooks.once("init", async () => {
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected CSS for character sheets.");
});
