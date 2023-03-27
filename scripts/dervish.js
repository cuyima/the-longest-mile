import { MINDS_EDGE, SUPPORTED_SPELLS, TELEKINETIC_EXPERT } from "./consts.js";

export async function createDervishChatCardButtons(message, html) {
  //if flagged make invisible
  if (message.getFlag("the-longest-mile", "isVisible") === false) {
    html.addClass("tlm-hide");
    return;
  }

  //get spell from message if supported
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

  //prevent actor from switching between variants
  removeVariantsButton(message, html, spell);
  if (ampedId != spellId) {
    //add damage button to base variant
    addDamageButton(speaker, html);
  }

  //style it a little
  overrideDamageButton(html, slug);
}

async function isSupported(message) {
  //accept only spells
  const actionOrigin = message.flags.pf2e?.origin;
  if (!actionOrigin?.type === "spell") {
    return;
  }
  const spell = await fromUuid(actionOrigin.uuid);
  const { slug } = spell || {};

  //if spell is not on list return nothing
  if (!SUPPORTED_SPELLS.includes(slug)) {
    return;
  }
  return spell;
}

export async function consumePoints(message, amp) {
  //if spell is not on our list ignore and return
  if (!(await isSupported(message))) {
    return true;
  }

  //if actor actor has mind's edge and isn't amping make it free
  if (message.actor.items.find((item) => item.slug === MINDS_EDGE) && !amp) {
    return true;
  }

  //if actor actor has telekinetic expert make it free but notify
  if (
    message.actor.items.find((item) => item.slug === TELEKINETIC_EXPERT) &&
    amp
  ) {
    ui.notifications.info(
      "You have the feat Telekinetic Expert that lets you amp spells for free once a day.\nMake sure to adjust Focus Points accordingly if you have already used it."
    );
    return true;
  }

  //otherwise consume points
  const currentPoints = message.actor.system.resources.focus?.value ?? 0;
  if (currentPoints > 0) {
    await message.actor.update({
      "system.resources.focus.value": currentPoints - 1,
    });
    return true;
  } else {
    //if not enough points then warn and return false
    ui.notifications.warn(
      game.i18n.localize("PF2E.Focus.NotEnoughFocusPointsError")
    );
    return false;
  }
}

function removeVariantsButton(message, html, spell) {
  const variantButtons = html.find("[data-action=selectVariant]");
  //remove default version from button selection
  variantButtons.eq(0).remove();

  //remove original variant funtion from amp version and glue on our own
  let ampButton = variantButtons.eq(1);
  ampButton.find("span:last-child").text("Amp!");
  ampButton.removeAttr("data-action");
  ampButton.on("click", () => {
    ampSpell(spell, ampButton, html, message);
  });
}

async function addDamageButton(speaker, html) {
  //adding a new damage button to base variant so it can be cast
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
  //check if we have enough points to amp otherwise return
  if (! await consumePoints(message, true)) {
    return;
  }

  //taken from pf2e selectVariant but shortened for our purposes
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
  //spice up damage buttons a little and remove it entirely for psi movement
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
