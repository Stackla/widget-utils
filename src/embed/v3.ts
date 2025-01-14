import { Environment } from "."
import { generateDataHTMLStringByParams } from "./embed.params"

declare const STAGING_UI_URL: string
declare const PRODUCTION_UI_URL: string

const getUrlByEnv = (environment: Environment) => {
  switch (environment) {
    case "staging":
      return STAGING_UI_URL
    case "production":
    default:
      return PRODUCTION_UI_URL
  }
}

const getWidgetV3EmbedCode = (data: Record<string, string | boolean | number>, environment: Environment) => {
  const dataParams = generateDataHTMLStringByParams(data)

  return `
    <div id="ugc-widget"${dataParams}></div>
    <script type="module">
          (async () => {
            const widget = await import('https://${getUrlByEnv(environment)}/core.esm.js');
            widget.init();
          })();
    </script>`
}

export { getWidgetV3EmbedCode }
