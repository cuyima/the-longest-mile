import { MODULE_NAME, CHARACTER_SHEET, TAH } from "./consts.js";
import { injectCSS, cleanTAHEffects, overrideTAHActionsClass } from "./utils.js";

Hooks.once("init", async () => {
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected CSS for character sheets.");
});

Hooks.on("render" + CHARACTER_SHEET, (app, html) => {
  html
    .find("div.pc.pc_deity")
    .find(".open-compendium")
    .attr("data-compendium", MODULE_NAME + ".deities");
  console.log(
    MODULE_NAME + " | Overwrote character sheet deities with custom compendium."
  );
});

Hooks.once("render" + TAH, async (app, html) => {
  injectCSS("tah");
  console.log(
    MODULE_NAME + " | Injected CSS improvements for Token Action HUD."
  );
});

Hooks.on("render" + TAH, async (app, html) => {
  overrideTAHActionsClass(html,"tah-category-attack","tah-actions tlm-nowrap");
  overrideTAHActionsClass(html,"tah-category-actions","tah-actions tlm-nowrap");
  cleanTAHEffects(html);
});
