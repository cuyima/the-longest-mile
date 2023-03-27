import { MODULE_NAME, CHARACTER_SHEET, TAH } from "./consts.js";
import {
  injectCSS,
  cleanTAHEffects,
  overrideTAHActionsClass,
} from "./utils.js";
import { consumePoints, createDervishChatCardButtons } from "./dervish.js";

//replace character sheet styling
Hooks.once("init", async () => {
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected CSS for character sheets.");
  injectCSS("tlm-dervish");
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

//update TAH css
Hooks.once("render" + TAH, async () => {
  injectCSS("tah");
  console.log(
    MODULE_NAME + " | Injected CSS improvements for Token Action HUD."
  );
});

//update TAH html
Hooks.on("render" + TAH, async (app, html) => {
  overrideTAHActionsClass(
    html,
    "tah-category-attack",
    "tah-actions tlm-nowrap"
  );
  overrideTAHActionsClass(
    html,
    "tah-category-actions",
    "tah-actions tlm-nowrap"
  );
  console.log(MODULE_NAME + " | Updated HTML classes of of Token Action HUD.");
  cleanTAHEffects(html);
  console.log(
    MODULE_NAME + " | Cleaned up Effects section of Token Action HUD."
  );
});

//add dervish buttons
Hooks.on(
  "renderChatMessage",
  (message, html, data) => {
    createDervishChatCardButtons(message, html);
  },
  { once: false }
);

Hooks.on(
  "createChatMessage",
  async (message) => {
    if (!message.isRoll && ! await consumePoints(message, undefined)) {
      message.update({
        "flags.the-longest-mile.isVisible": false,
      });
    }
  },
  { once: false }
);
