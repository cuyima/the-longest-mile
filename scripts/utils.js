import { MODULE_NAME } from "./consts.js";

export const injectCSS = ( filename ) => {
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
}