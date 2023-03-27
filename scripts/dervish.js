import { MINDS_EDGE, SUPPORTED_SPELLS,TELEKINETIC_EXPERT } from "./consts.js";

export async function createDervishChatCardButtons(message, html) {
  if (message.getFlag("the-longest-mile", "isVisible") === false) {
    html.addClass("tlm-hide");
    return;
  }

  const spell = await isSupported(message);
  if (!spell) {
    return;
  }

  const speaker = message.actor;
  const { slug } = spell || {};
  const ampedId = spell.overlays.contents[1]._id;
  const spellId = html
    .find(".pf2e.chat-card.item-card")
    .eq(0)
    .attr("data-item-id");

  removeVariantsButton(message, html, spell);
  if (ampedId != spellId) {
    addDamageButton(speaker, html);
  }
  overrideDamageButton(html, slug);
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

export async function consumePoints(message, amp) {
  if (!(await isSupported(message))) {
    return true;
  }

  if (message.actor.items.find((item) => item.slug === MINDS_EDGE) && !amp) {
    return true;
  }

  if (message.actor.items.find((item) => item.slug === TELEKINETIC_EXPERT) && amp) {
    ui.notifications.info("You have the feat Telekinetic Expert that lets you amp spells for free once a day.\nMake sure to adjust Focus Points accordingly if you have already used it.");
    return true;
  }
  const currentPoints = message.actor.system.resources.focus?.value ?? 0;
  if (currentPoints > 0) {
    await message.actor.update({
      "system.resources.focus.value": currentPoints - 1,
    });
    return true;
  } else {
    ui.notifications.warn(
      game.i18n.localize("PF2E.Focus.NotEnoughFocusPointsError")
    );
    return false;
  }
}

function removeVariantsButton(message, html, spell) {
  const variantButtons = html.find("[data-action=selectVariant]");
  variantButtons.eq(0).remove();

  if (message.actor.system.resources.focus.value > 0) {
    let ampButton = variantButtons.eq(1);
    ampButton.find("span:last-child").text("Amp!");
    ampButton.removeAttr("data-action");
    ampButton.on("click", () => {
      ampSpell(spell, ampButton, html, message);
    });
  } else {
    variantButtons.eq(1).remove();
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
async function ampSpell(spell, button, html, message) {
  if(!consumePoints(message, true)){
    return;
  }
  
  const castLevel =
    Number(
      html.find(".pf2e.chat-card.item-card").eq(0).attr("data-spell-lvl")
    ) || 1;
  const overlayIdString = button.attr("data-overlay-ids");
  if (overlayIdString) {
    const overlayIds = overlayIdString.split(",").map((id) => id.trim());
    const variantSpell = spell?.loadVariant({ overlayIds, castLevel });
    if (variantSpell) {
      const variantMessage = await variantSpell.toMessage(undefined, {
        create: false,
        data: { castLevel },
      });
      if (variantMessage) {
        const messageSource = variantMessage.toObject();
        await message.update(messageSource);
      }
    }
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