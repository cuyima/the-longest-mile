import {
  MODULE_NAME,
  CHARACTER_SHEET,
  DERVISH_CONSUME_ACTIONS,
  DERVISH_STRIKE_CHARGE,
  DERVISH_STRIKE_EFFECT,
  DERVISH_STRIKE_EFFECT_AMP,
} from "./consts.js";
import { injectCSS, addEffect, removeEffect } from "./utils.js";
import { registerSettings } from "./settings.js";

import "../../static/styles/tlm-character-sheet.css";
import "../../static/styles/tlm-simple-calendar.css";
import "../../static/styles/tlm-carousel.css";

//replace character sheet styling
Hooks.once("init", async () => {
  registerSettings();
  injectCSS("tlm-character-sheet");
  console.log(MODULE_NAME + " | Injected character sheets CSS.");
});

//replace character sheet button
Hooks.on("render" + CHARACTER_SHEET, (app, html) => {
  html
    .find("div.pc.deity")
    .find(".open-compendium")
    .attr("data-compendium", MODULE_NAME + ".deities");
  console.log(
    MODULE_NAME + " | Overwrote character sheet deities with custom compendium."
  );
});

Hooks.once("simple-calendar-ready", async (app, html, data) => {
  const theme = game.settings.get("pf2e-dorako-ui", "theme.window-app-theme");

  if (!game.settings.get(MODULE_NAME, "dorako-sc") || theme == "no-theme")
    return;

  injectCSS("tlm-simple-calendar");

  console.log(MODULE_NAME + " | Injected CSS for Simple Calendar.");
});

Hooks.on("renderApplication", async (app, html, data) => {
  if (
    !game.settings.get(MODULE_NAME, "dorako-sc") ||
    (html.eq(0).attr("id") !== "fsc-ng" &&
      !html.eq(0).hasClass("journal-sheet"))
  )
    return;

  html.removeClass("simple-calendar").addClass("simple-calendar-tlm");
  console.log(MODULE_NAME + " | Injected HTML for Simple Calendar.");
});

Hooks.on("renderCombatDock", async (app, html, data) => {
  if (game.settings.get(MODULE_NAME, "dorako-combat-dock")) {
    const theme = game.settings.get("pf2e-dorako-ui", "theme.app-theme");
    if (theme) {
      html.attr("data-theme", theme);
      html.attr("data-dorako-ui-scope", "controls");

      console.log(
        MODULE_NAME +
          " | Injected Dorako attributes for Carousel Combat Tracker."
      );
    }
  }

  if (game.settings.get(MODULE_NAME, "custom-combat-dock")) {
    html.attr("tlm-combat-dock", "on");

    console.log(
      MODULE_NAME + " | Injected custom attribute for Carousel Combat Tracker."
    );
  }
});

Hooks.once("renderCombatDock", async (app, html, data) => {
  injectCSS("tlm-carousel");
  console.log(MODULE_NAME + " | Injected CSS for Carousel Combat Tracker.");
});

Hooks.on("preCreateChatMessage", async (message, user, _options, userId) => {
  if (!game?.combats?.active) return;
  if (
    !message?.flags?.pf2e?.origin?.type == "action" &&
    !message?.flags?.pf2e?.origin?.type == "spell"
  )
    return;

  let origin = await fromUuid(message?.flags?.pf2e?.origin?.uuid);

  if (!origin) return;

  if (DERVISH_CONSUME_ACTIONS.includes(origin.slug)) {
    removeEffect(message.actor);
  }

  console.log(DERVISH_STRIKE_CHARGE == origin.slug);

  if (DERVISH_STRIKE_CHARGE == origin.slug) {
    addEffect(message.actor, DERVISH_STRIKE_EFFECT);
  }

  if (DERVISH_STRIKE_CHARGE + "-amped" == origin.slug) {
    addEffect(message.actor, DERVISH_STRIKE_EFFECT_AMP);
  }
});
