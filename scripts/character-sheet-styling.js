import { injectCSS } from "./utils.js";

Hooks.once("init", async () => {
  injectCSS("character-sheet");
});
