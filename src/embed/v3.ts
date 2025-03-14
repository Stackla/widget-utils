import { STAGING_UI_URL, PRODUCTION_UI_URL } from "../constants"
import { Environment } from "."
import { generateDataHTMLStringByParams } from "./embed.params"

const getUrlByEnv = (environment: Environment) => {
  switch (environment) {
    case "staging":
      return STAGING_UI_URL
    case "production":
    default:
      return PRODUCTION_UI_URL
  }
}

const getWidgetV3EmbedCode = (data: Record<string, string | boolean | number>) => {
  const dataParams = generateDataHTMLStringByParams(data)

  return `<div id="ugc-widget"${dataParams}></div>`
}

const invokeV3Javascript = async (environment: Environment) => {
  const widget = await import(`${getUrlByEnv(environment)}/core.esm.js`)
  widget.init()
}

export { getWidgetV3EmbedCode, invokeV3Javascript }
