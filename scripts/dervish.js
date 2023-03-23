import { AMPED_SPELLS, MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";
//import {ItemPF2e} from "../../../systems/pf2e/main.bundle.js";
//Creates the button in the chat tile for actions and feats
export async function createDervishChatCardButton(message, html) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (actionOrigin?.type === "spell") {
    const { name, slug } = (await fromUuid(actionOrigin.uuid)) || {};
    if (SUPPORTED_SPELLS.includes(slug)) {
      const user = game.user;
      const speaker = message.actor;
      html = html.find(".owner-buttons");
      const contentArea = html.find(".card-content");
      html.prepend(
        $(
          `<button type="button" data-action="amp" ${
            user.character?.uuid === speaker?.uuid || user.isGM
              ? ""
              : 'style="visibility:hidden"'
          } title="Amp">Amp</button>`
        ).on({
          click: () => {
            amp(speaker, slug);
          },
        })
      );
    }
  }
}

export function checkForRestoreFocus(message) {
  const actor = message.actor;
  if (actor.items.find((item) => item.slug === MINDS_EDGE)) {
    //TODO before lvl 4
  }
}

async function amp(actor, slug) {
  let spell;
  switch (slug) {
    case SUPPORTED_SPELLS[0]:
      spell = await fromUuid(AMPED_SPELLS[0]);
      break;
    case SUPPORTED_SPELLS[1]:
      spell = await fromUuid(AMPED_SPELLS[1]);
      break;
    case SUPPORTED_SPELLS[2]:
      spell = await fromUuid(AMPED_SPELLS[2]);
      break;
    default:
      break;
  }

  const entry = actor.itemTypes.spellcastingEntry.find((list) =>
    list.spells.some((item) => item.slug == slug)
  );
  let spellEntry = await entry.addSpell(spell, {});

  entry.cast(spellEntry, {});
  actor.items.find((item) => item.id === spellEntry.id).delete();
}