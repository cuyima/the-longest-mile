import { MODULE_NAME, CHARACTER_SHEET, TAH } from "./consts.js";
import {
  injectCSS,
  cleanTAHEffects,
} from "./utils.js";
import {
  consumePoints,
  createDervishChatCardButtons,
  isOwnerOrGM,
  isSupported,
} from "./dervish.js";

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

//update TAH effects
Hooks.on("render" + TAH, async (app, html) => {
  cleanTAHEffects(html);
  console.log(
    MODULE_NAME + " | Cleaned up Effects section of Token Action HUD."
  );
});

//add custom buttons to dervish chat cards
Hooks.on("renderChatMessage", async (message, html) => {
  if (!game.settings.get(MODULE_NAME, "dervish-ui")) return;
  createDervishChatCardButtons(message, html);
});

//flag invalid dervish spells as invisible
Hooks.on("createChatMessage", async (message) => {
  if (
    !game.settings.get(MODULE_NAME, "dervish-ui") ||
    message.isRoll ||
    !isOwnerOrGM(message) ||
    !(await isSupported(message))
  ) {
    return;
  }
  if (!(await consumePoints(message, undefined))) {
    message.update({
      "flags.the-longest-mile.isVisible": false,
    });
  }
});

Hooks.once("simple-calendar-ready", async (app, html, data) => {
  injectCSS("tlm-simple-calendar");
});


Hooks.on("renderApplication", async (app, html, data) => {
  if ( html.eq(0).attr("id") !== "fsc-ng") {
    return;
  }
  html.removeClass("simple-calendar").addClass("simple-calendar-tlm");
});