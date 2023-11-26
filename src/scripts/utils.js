import { MODULE_NAME, DERVISH_EFFECT, DERVISH_EFFECT_SLUG } from "./consts.js";

export const injectCSS = (filename) => {
  const head = document.getElementsByTagName("head")[0];
  const mainCss = document.createElement("link");
  mainCss.setAttribute("rel", "stylesheet");
  mainCss.setAttribute("type", "text/css");
  mainCss.setAttribute(
    "href",
    "modules/" + MODULE_NAME + "/styles/" + filename + ".css"
  );
  mainCss.setAttribute("media", "all");
  head.insertBefore(mainCss, head.lastChild);
};

export function overrideTAHActionsClass(html, id, className) {
  html
    .find(`[id='${id}']`)
    .find(".tah-actions")
    .each(function (i, e) {
      e.className = className;
    });
}

function hasPermissions(item) {
  return 3 == item.ownership[game.user.id] || game.user.isGM;
}

export async function addEffect(actor, effect) {
  if (!hasPermissions(actor)) return;
  let source = await fromUuid(effect);
  source = source.toObject();
  source.flags = mergeObject(source.flags ?? {}, {
    core: { sourceId: effect },
  });
  await actor.createEmbeddedDocuments("Item", [source]);
}

export function removeEffect(actor) {
  if (!hasPermissions(actor)) return;
  let effect = actor.itemTypes.effect.find(e => DERVISH_EFFECT_SLUG === e.system.slug)
  if (!effect) return;
  actor.deleteEmbeddedDocuments("Item", [effect._id]);
}
