import { MODULE_NAME } from "./consts.js";

Hooks.once("init", () => {
    game.settings.register(MODULE_NAME, "dervish-ui", {
		scope: "user",
		config: true,
		name: "Enable Dervish Archetype Automation",
		hint: "Enable automatic Focus Points consumption and handling of amped spells.",
		type: Boolean,
		onChange: () => {
            const messages = game.messages.filter((m) => m instanceof ChatMessage);
            for (const message of messages) {
              ui.chat.updateMessage(message);
            }
          },
		default: true
	});
});