import { injectCSS } from "./utils.js";
import { CHARACTER_SHEET, MODULE_NAME, TAH } from "./consts.js";
import {
  checkForRestoreFocus,
  createDervishChatCardButton,
} from "./dervish.js";

//replace character sheet styling
Hooks.once("init", async () => {
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected CSS for character sheets.");
});

//replace character sheet button
Hooks.on("render" + CHARACTER_SHEET, (app, html) => {
  html
    .find("div.pc.pc_deity")
    .find(".open-compendium")
    .attr("data-compendium", MODULE_NAME + ".deities");
  console.log(
    MODULE_NAME + " | Overwrote character sheet deities with custom compendium."
  );
});

//update TAH rendering
Hooks.once("render" + TAH, async () => {
  injectCSS("tah");
  console.log(
    MODULE_NAME + " | Injected CSS improvements for Token Action HUD."
  );
});

//add dervish buttons
Hooks.on(
  "renderChatMessage",
  async (message, html) => {
    createDervishChatCardButton(message, html);
  },
  { once: false }
);

Hooks.on(
  "preCreateChatMessage",
  (message) => {
    checkForRestoreFocus(message);
  },
  { once: false }
);
