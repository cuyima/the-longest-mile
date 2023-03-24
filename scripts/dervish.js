import { MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";

export async function createDervishChatCardButtons(message, html) {
  const spell = await (isSupported(message));
  if (!spell) {return};
  const speaker = message.actor;
  const { slug } = spell || {};
  const ampedId = spell.overlays.contents[1]._id;
  const spellId = html
    .find(".pf2e.chat-card.item-card")
    .eq(0)
    .attr("data-item-id");

  removeVariantsButton(message, html);
  if (ampedId != spellId) {
    addDamageButton(speaker, html);
  }
  overrideDamageButton(html, slug);
}

export function checkForRestoreFocus(message) {
  if (message.actor.items.find((item) => item.slug === MINDS_EDGE)) {
    //TODO before lvl 4
  }
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

function removeVariantsButton(message, html) {
  const variantButton = html.find("[data-action=selectVariant]");
  variantButton.eq(0).remove();

  if (message.actor.system.resources.focus.value > 0) {
    variantButton.eq(1).find("span:last-child").text("Amp!");
    variantButton.eq(1).on("click", () => {
      consumePoints(message);
    });
  } else {
    variantButton.eq(1).remove();
  }
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

export async function consumePoints(message) {
  if (! await (isSupported(message))) {
    return;
  }
  const currentPoints = message.actor.system.resources.focus?.value ?? 0;
  if (currentPoints > 0) {
    await message.actor.update({ "system.resources.focus.value": currentPoints - 1 });
    return true;
  } else {
    ui.notifications.warn(
      game.i18n.localize("You do not have enough Focus Points!")
    );
    return false;
  }
}

async function isSupported(message) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (!actionOrigin?.type === "spell") {
    return;
  }
  const spell = await fromUuid(actionOrigin.uuid);
  const { slug } = spell || {};

  if (!SUPPORTED_SPELLS.includes(slug)) {
    return;
  }
  return spell;
}
