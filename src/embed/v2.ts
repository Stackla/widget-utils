import { STAGING_LEGACY_WIDGET_URL, PRODUCTION_LEGACY_WIDGET_URL } from "../constants"
import { Environment } from "."
import { generateDataHTMLStringByParams } from "./embed.params"

const getUrlByEnv = (environment: Environment) => {
  switch (environment) {
    case "staging":
      return STAGING_LEGACY_WIDGET_URL
    case "production":
    default:
      return PRODUCTION_LEGACY_WIDGET_URL
  }
}

const getWidgetV2EmbedCode = (data: Record<string, string | boolean | number>) => {
  const dataParams = generateDataHTMLStringByParams(data)

  return `
    <!-- Nosto Widget Embed Code (start) -->
    <div class="stackla-widget" style="width: 100%; overflow: hidden;"${dataParams}></div>
    <!-- Nosto Widget Embed Code (end) -->
    `
}

const invokeV2Javascript = (environment: Environment, root: HTMLElement | ShadowRoot) => {
  const invocationScript = document.createElement("script")
  invocationScript.textContent = `
    (function (d, id) {
        var t, el = d.scripts[d.scripts.length - 1].previousElementSibling;
        if (el) el.dataset.initTimestamp = (new Date()).getTime();
        if (d.getElementById(id)) return;
        t = d.createElement('script');
        t.src = '//${getUrlByEnv(environment)}/media/js/widget/fluid-embed.min.js';
        t.id = id;
        (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(t);
    }(document, 'stackla-widget-js'));`

  root.appendChild(invocationScript)
}

export { getWidgetV2EmbedCode, invokeV2Javascript }
