import { getWidgetV2EmbedCode } from "./v2"
import { getWidgetV3EmbedCode } from "./v3"

type Environment = "staging" | "production"
type Generation = "2" | "3"

interface EmbedOptions<T> {
  widgetId: string
  root: T
  environment?: Environment
  version?: Generation
  dataProperties: Record<string, string | number | boolean>
}

interface JSONSchema {
  version: string
}

export function getWidgetDataUrl(env: Environment) {
  switch (env) {
    case "staging":
      return "https://widget-data.teaser.stackla.com"
    case "production":
      return "https://widget-data.stackla.com"
  }
}

export function loadWidgetCodeByGen(gen: Generation, data: Record<string, string | number | boolean>) {
  switch (gen) {
    case "2":
      return getWidgetV2EmbedCode(data)
    case "3":
      return getWidgetV3EmbedCode(data)
    default:
      throw new Error(`No widget code accessible with generation ${gen}`)
  }
}

const getRequestUrl = (widgetId: string, environment: Environment) =>
  `${getWidgetDataUrl(environment)}/${widgetId}/version`

async function retrieveWidgetVersionFromServer(widgetId: string, environment: Environment): Promise<string> {
  const response = await fetch(getRequestUrl(widgetId, environment))
  const json: JSONSchema = await response.json()

  return json.version
}

export async function embed<T extends ShadowRoot | HTMLElement>(options: EmbedOptions<T>) {
  const { environment = "production", widgetId, root, version } = options

  try {
    if (version) {
      const html = loadWidgetCodeByGen(version, options.dataProperties)
      root.innerHTML += html
      return
    }

    const widgetVersion = await retrieveWidgetVersionFromServer(widgetId, environment)

    switch (widgetVersion) {
      case "2":
        root.innerHTML += getWidgetV2EmbedCode(options.dataProperties)
        break
      case "3":
        root.innerHTML += getWidgetV3EmbedCode(options.dataProperties)
        break
      default:
        throw new Error(`No widget code accessible with version ${widgetVersion}`)
    }
  } catch (error) {
    console.error(`Failed to embed widget. ${error}`)
  }
}
