import { MODULE_NAME } from "./consts.js";

export function registerSettings() {
  game.settings.register(MODULE_NAME, "sc-hack", {
    scope: "user",
    config: true,
    name: "Enable Dorako UI Style Calendar",
    hint: "Enable Simple Calendar styling to mimick Dorako UI (will respect window app theme settings from Dorako UI).",
    type: Boolean,
    default: true,
    requiresReload: true,
  });
}
