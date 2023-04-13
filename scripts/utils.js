import { MODULE_NAME } from "./consts.js";

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

export function cleanTAHEffects(html) {
  html = html.find("[id='tah-category-effects']");
  const actions = html.find(".tah-actions")[0];
  let buttonsnew = $();

  //add only unique effects
  html.find(".tah-action.toggle").each(function (index, element) {
    let elemvalue = $(element).find(".toggle")[0].value;
    let selector = "[value=" + elemvalue.replace(/([|])/g, "\\$1") + "]";

    if (buttonsnew.find(selector).length === 0) {
      buttonsnew = buttonsnew.add(element);
    }
  });

  //sort alphabetically
  buttonsnew.sort(function (a, b) {
    let nameA = $(a).find(".toggle")[0].value.split("|")[1];
    let nameB = $(b).find(".toggle")[0].value.split("|")[1];
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  //replace original buttons
  actions.innerHTML = "";
  buttonsnew.each(function (index, element) {
    actions.append(element);
  });
}

export function overrideTAHActionsClass(html, id, className) {
  html
    .find(`[id='${id}']`)
    .find(".tah-actions")
    .each(function (i, e) {
      e.className = className;
    });
}
