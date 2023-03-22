import { AMPED_SPELLS, MINDS_EDGE, SUPPORTED_SPELLS } from "./consts.js";

//Creates the button in the chat tile for actions and feats
export async function createDervishChatCardButton(message, html) {
  const actionOrigin = message.flags.pf2e?.origin;

  if (actionOrigin?.type === "spell") {
    const { name, slug } = (await fromUuid(actionOrigin.uuid)) || {};
    if (SUPPORTED_SPELLS.includes(slug)) {
      const user = game.user;
      const speaker = message.actor;
      html = html.find(".message-content");
      const contentArea = html.find(".card-content");
      contentArea.append(
        $(
          `<button class='dervish-amp-btn' ${
            user.character?.uuid === speaker?.uuid || user.isGM
              ? ""
              : 'style="visibility:hidden"'
          } title="Amp">${game.i18n.format("Amp", { action: name })}</button>`
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
    default:
      break;
  }

  let entry;
  actor.itemTypes.spellcastingEntry.forEach((list) => {
    if( list.spells.find((item) => item.slug == slug)){
        entry = list;
    }
  });
  //spell.actor = speaker;
  //await spell.toMessage(undefined, {});
  let flavor = `<strong>Spellstrike</strong><br>${spell.spell.link}${flavName} (${dos})<div class="tags">${ttags}</div><hr>`;
  if (spell.isSave) {
    let basic = false;
    if (spell.spell.system.save.basic === "basic") { basic = true }
    flavor += `@Check[type:${spell.spell.system.save.value}|dc:${spell.DC}|traits:damaging-effect,${spell.spell.system.traits.value.join()}|basic:${basic}]`;
  }

  const dmg = await spell.getDamage() ?? false;
  const roll = dmg ? dmg.template.damage.roll : undefined;
  await roll.toMessage({ flavor: flavor, speaker: ChatMessage.getSpeaker() });
  await entry.cast(spell,{message: false});

}
