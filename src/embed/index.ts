import { STAGING_DATA_URL, PRODUCTION_DATA_URL } from "../constants"
import { getWidgetV2EmbedCode } from "./v2"
import { getWidgetV3EmbedCode } from "./v3"

export type Environment = "staging" | "production"
type Generation = "2" | "3"

interface EmbedOptions<T> {
  widgetId: string
  root: T
  environment: Environment
  version?: Generation
  dataProperties: Record<string, string | number | boolean>
}

interface JSONSchema {
  version: string
}

export function getWidgetDataUrl(env: Environment) {
  switch (env) {
    case "staging":
      return STAGING_DATA_URL
    case "production":
      return PRODUCTION_DATA_URL
  }
}

function getRequestUrl(widgetId: string, environment: Environment) {
  return `${getWidgetDataUrl(environment)}/${widgetId}/version`
}

async function retrieveWidgetVersionFromServer(widgetId: string, environment: Environment): Promise<string> {
  const response = await fetch(getRequestUrl(widgetId, environment))
  const json: JSONSchema = await response.json()

  return json.version
}

export async function embed<T extends ShadowRoot | HTMLElement>(options: EmbedOptions<T>) {
  const { environment = "production", widgetId, root, version, dataProperties } = options

  try {
    const widgetVersion = version ?? (await retrieveWidgetVersionFromServer(widgetId, environment))

    switch (widgetVersion) {
      case "2":
        root.innerHTML += getWidgetV2EmbedCode(dataProperties, environment)
        break
      case "3":
        root.innerHTML += getWidgetV3EmbedCode(dataProperties, environment)
        break
      default:
        throw new Error(`No widget code accessible with version ${widgetVersion}`)
    }
  } catch (error) {
    console.error(`Failed to embed widget. ${error}`)
  }
}
