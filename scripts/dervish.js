import { AMPED_SPELLS, MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";


export async function createDervishChatCardButtons(message, html) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (actionOrigin?.type === "spell") {
    const spell = await fromUuid(actionOrigin.uuid);
    const { slug } = spell || {};
    if (!SUPPORTED_SPELLS.includes(slug)) {
      return;
    }

    const user = game.user;
    const speaker = message.actor;
    const ampedId = spell.overlays.contents[1]._id;
    const spellId = html
      .find(".pf2e.chat-card.item-card")
      .eq(0)
      .attr("data-item-id");

    if (ampedId != spellId) {
      addDamageButton(user, speaker, html);
    }
    removeVariantsButton(speaker, html)
  }
}

export function checkForRestoreFocus(message) {
  const actor = message.actor;
  if (actor.items.find((item) => item.slug === MINDS_EDGE)) {
    //TODO before lvl 4
  }
}
function consumeFocus(actor) {
  const points = actor.system.resources.focus.value--;
  actor.update({ "system.resources.focus.value": points });
}

function addDamageButton(user, speaker, html) {
  html = html.find(".owner-buttons");
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

function removeVariantsButton(speaker, html) {
  const variantButton = html.find("[data-action=selectVariant]");
  variantButton.eq(0).remove();
  variantButton.eq(1).find("span:last-child").text("Amp!");
  variantButton.eq(1).on("click", () => {
    consumeFocus(speaker);
  });
}
