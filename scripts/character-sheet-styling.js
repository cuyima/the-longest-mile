import { injectCSS, MODULE_NAME } from "./utils.js";

Hooks.once("init", async () => {
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected CSS for character sheets.");
});
