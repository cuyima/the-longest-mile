import { MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";

export async function createDervishChatCardButtons(message, html) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (!actionOrigin?.type === "spell") {
    return;
  }
  const spell = await fromUuid(actionOrigin.uuid);
  const { slug } = spell || {};

  if (!SUPPORTED_SPELLS.includes(slug)) {
    return;
  }
  const speaker = message.actor;
  const ampedId = spell.overlays.contents[1]._id;
  const spellId = html
    .find(".pf2e.chat-card.item-card")
    .eq(0)
    .attr("data-item-id");

  if (ampedId != spellId) {
    addDamageButton(speaker, html);
  }
  removeVariantsButton(speaker, html);
  overrideDamageButton(html, slug);
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

async function addDamageButton(speaker, html) {
  const user = game.user;
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

function overrideDamageButton(html, slug) {
  const btn = html.find("[data-action=spellDamage]").eq(0);
  switch (slug) {
    case SUPPORTED_SPELLS[1]:
      html.find("[data-action=spellDamage]").eq(0).text("Shield");
      break;
    case SUPPORTED_SPELLS[2]:
      btn.remove();
      break;
    default:
      break;
  }
}
