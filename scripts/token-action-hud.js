import { MODULE_NAME, TAH } from "./consts.js";
import { injectCSS } from "./utils.js";

Hooks.once("render" + TAH, async () => {
  injectCSS("tah");
  console.log(
    MODULE_NAME + " | Injected CSS improvements for Token Action HUD."
  );
});
