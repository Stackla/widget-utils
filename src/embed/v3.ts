import { generateDataHTMLStringByParams } from "./embed.params"

const getUrlByEnv = () => {
  switch (process.env.NODE_ENV) {
    case "staging":
      return "widget-ui.teaser.stackla.com"
    case "production":
    default:
      return "widget-ui.stackla.com"
  }
}

const getWidgetV3EmbedCode = (data: Record<string, string | boolean | number>) => {
  const dataParams = generateDataHTMLStringByParams(data)

  return `
    <div id="ugc-widget"${dataParams}></div>
    <script>
          (async () => {
            const widget = await import('https://${getUrlByEnv()}/core.esm.js');
            widget.init();
          })();
    </script>`
}

export { getWidgetV3EmbedCode }
