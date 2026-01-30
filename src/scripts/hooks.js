import {
  MODULE_NAME,
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

  if (DERVISH_STRIKE_CHARGE == origin.slug) {
    addEffect(message.actor, DERVISH_STRIKE_EFFECT);
  }

  if (DERVISH_STRIKE_CHARGE + "-amped" == origin.slug) {
    addEffect(message.actor, DERVISH_STRIKE_EFFECT_AMP);
  }
});

// Borrowed from PF2e Workbench, but made conditional
Hooks.on("pf2e.reroll", (_oldRoll, newRoll, resource, keep = "new") => {
  const heroPoints = typeof resource === "boolean" ? resource : resource.slug === "hero-points";
  
  if (!heroPoints
    || keep !== "new"
    || !game.settings.get(MODULE_NAME, "keeleys-combat-hero-points")
    || !game.combat) {
    return;
  }

  if( game.settings.get("xdy-pf2e-workbench", "heroPointRules") !== "no" ) {
    console.log( MODULE_NAME + " | A Hero Point rule from PF2e Workbench is active, this module's Hero Point rule will not be applied." );
    return;
  }

  const die = newRoll.dice.find((d) => d instanceof foundry.dice.terms.Die && d.number === 1 && d.faces === 20);
  const result = die?.results.find((r) => r.active && r.result <= 10);

  if (die && result) {
      newRoll.terms.push(
          foundry.dice.terms.OperatorTerm.fromData({ class: "OperatorTerm", operator: "+", evaluated: true }),
          foundry.dice.terms.NumericTerm.fromData({ class: "NumericTerm", number: 10, evaluated: true }),
      );
      newRoll._total += 10;
      newRoll.options.keeleyAdd10 = true;
  }
    return;
});

