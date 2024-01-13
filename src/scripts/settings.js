import { MODULE_NAME } from "./consts.js";

export function registerSettings() {
  game.settings.register(MODULE_NAME, "dorako-sc", {
    scope: "user",
    config: true,
    name: "Dorako UI Style Calendar",
    hint: "Enable to mimick Dorako UI styling on Simple Calendar. This setting will respect window app theme settings from Dorako UI and automatically disable itself when no Dorako winddow app theme is chosen.",
    type: Boolean,
    default: true,
    requiresReload: true,
  });

  game.settings.register(MODULE_NAME, "dorako-combat-dock", {
    scope: "user",
    config: true,
    name: "Dorako UI Style Carousel Combat Tracker",
    hint: "Enable to mimick Dorako UI styling on Carousel Combat Tracker. This setting will respect app theme settings from Dorako UI and automatically disable itself when no Dorako app theme is chosen. NOTE: \"window app theme\" and \"app theme\" are two different settings in Dorako UI.",
    type: Boolean,
    default: true,
    requiresReload: true,
  });

  game.settings.register(MODULE_NAME, "custom-combat-dock", {
    scope: "user",
    config: true,
    name: "Additional styling for Carousel Combat Tracker",
    hint: "Removes participant borders and backgrounds from the combat dock and restyles the tracked attributes.",
    type: Boolean,
    default: true,
    requiresReload: true,
  });
}
