import { MODULE_NAME } from "./consts.js";

Hooks.once("init", () => {
	game.settings.register(MODULE_NAME, "sc-hack", {
		scope: "user",
		config: true,
		name: "Enable Dorako UI Style Calendar",
		hint: "Enable Simple Calendar styling to mimick Dorako UI.",
		type: Boolean,
		default: true
	  });
});