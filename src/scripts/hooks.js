import {
  MODULE_NAME,
  CHARACTER_SHEET,
  TAH,
  DERVISH_CHARGE_ACTIONS,
  DERVISH_CONSUME_ACTIONS,
} from "./consts.js";
import {
  injectCSS,
  cleanTAHEffects,
  addEffect,
  removeEffect,
} from "./utils.js";
import { registerSettings } from "./settings.js";

//replace character sheet styling
Hooks.once("init", async () => {
  registerSettings();
  injectCSS("character-sheet");
  console.log(MODULE_NAME + " | Injected character sheets CSS.");
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
    MODULE_NAME + " | Cleaned up effects section of Token Action HUD."
  );
});

Hooks.once("simple-calendar-ready", async (app, html, data) => {
  if (game.settings.get(MODULE_NAME, "sc-hack")) {
    injectCSS("tlm-simple-calendar");

    const theme = game.settings.get(
      "pf2e-dorako-ui",
      "theme.application-theme"
    );
    if (theme === "light-theme") {
      injectCSS("tlm-simple-calendar-light");
    } else if (theme === "dark-theme") {
      injectCSS("tlm-simple-calendar-dark");
    } else if (theme === "no-theme") {
      injectCSS("tlm-simple-calendar-def");
    }

    console.log(MODULE_NAME + " | Injected CSS for Simple Calendar.");
  }
});

Hooks.on("renderApplication", async (app, html, data) => {
  //currently dead due to sc update, need to change to fsc-og for hook but css is currently shitfucked
  if (
    !game.settings.get(MODULE_NAME, "sc-hack") ||
    html.eq(0).attr("id") !== "fsc-ng"
  ) {
    return;
  }
  html.removeClass("simple-calendar").addClass("simple-calendar-tlm");
  console.log(MODULE_NAME + " | Injected HTML for Simple Calendar.");
});

Hooks.on("preCreateChatMessage", async (message, user, _options, userId) => {
  if (!game?.combats?.active) return;
  if (
    !message?.flags?.pf2e?.origin?.type == "action" &&
    !message?.flags?.pf2e?.origin?.type == "spell"
  ) return;

  let origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);
  if (DERVISH_CHARGE_ACTIONS.includes(origin.slug)) {
    addEffect(message.actor);
  } else if (DERVISH_CONSUME_ACTIONS.includes(origin.slug)) {
    removeEffect(message.actor);
  }
});
