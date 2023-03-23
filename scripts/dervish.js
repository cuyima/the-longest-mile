import { AMPED_SPELLS, MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";
//import {ItemPF2e} from "../../../systems/pf2e/main.bundle.js";
//Creates the button in the chat tile for actions and feats
export async function createDervishChatCardButton(message, html) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (actionOrigin?.type === "spell") {
    const spell = await fromUuid(actionOrigin.uuid);
    const { slug } = spell || {};
    if (SUPPORTED_SPELLS.includes(slug)) {
      const user = game.user;
      const speaker = message.actor;

      const chatId = html
        .find(".pf2e.chat-card.item-card")
        .eq(0)
        .attr("data-item-id");
      const ampId = spell.overlays.contents[1]._id;

      html = html.find(".owner-buttons");
      if (ampId != chatId) {
        html.append(
          $(
            `<button type="button"  ${
              user.character?.uuid === speaker?.uuid || user.isGM
                ? ""
                : 'style="visibility:hidden"'
            } data-action="spellDamage">Damage</button>`
          )
        );
      }

      const variantButton = html.find("[data-action=selectVariant]");
      variantButton.eq(0).remove();
      variantButton.eq(1).find("span:last-child").text("Amp!");
      variantButton.eq(1).on("click", () => {
        consumeFocus(speaker);
      });
    }
  }
}

export function checkForRestoreFocus(message) {
  const actor = message.actor;
  if (actor.items.find((item) => item.slug === MINDS_EDGE)) {
    //TODO before lvl 4
  }
}
function consumeFocus(actor) {
  const points = actor.system.resources.focus.value --;
  actor.update({ "system.resources.focus.value": points });
}
