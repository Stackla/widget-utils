import {
  STAGING_DATA_URL,
  PRODUCTION_DATA_URL,
  STAGING_LEGACY_WIDGET_DOMAIN,
  PRODUCTION_LEGACY_WIDGET_DOMAIN
} from "../constants"
import { getWidgetV2EmbedCode, invokeV2Javascript } from "./v2"
import { getWidgetV3EmbedCode, invokeV3Javascript } from "./v3"

export type Environment = "staging" | "production"
type Generation = 2 | 3

interface EmbedOptions<T> {
  widgetId: string
  root: T
  environment: Environment
  version?: Generation
  dataProperties: Record<string, string | number | boolean>
}

interface JSONSchema {
  version: number
}

export function getWidgetDataUrl(env: Environment) {
  switch (env) {
    case "staging":
      return STAGING_DATA_URL
    case "production":
      return PRODUCTION_DATA_URL
  }
}

export function getLegacyWidgetDomain(env: Environment) {
  switch (env) {
    case "staging":
      return STAGING_LEGACY_WIDGET_DOMAIN
    case "production":
      return PRODUCTION_LEGACY_WIDGET_DOMAIN
  }
}

function getRequestUrl(widgetId: string, environment: Environment) {
  return `${getWidgetDataUrl(environment)}/widgets/${widgetId}/version`
}

async function retrieveWidgetVersionFromServer(widgetId: string, environment: Environment): Promise<number> {
  const response = await fetch(getRequestUrl(widgetId, environment))
  const json: JSONSchema = await response.json()

  return json.version
}

export async function embed<T extends ShadowRoot | HTMLElement>(options: EmbedOptions<T>) {
  const { environment = "production", widgetId, root, version, dataProperties } = options

  try {
    const widgetVersion = version ?? (await retrieveWidgetVersionFromServer(widgetId, environment))

    switch (widgetVersion) {
      case 2:
        window.stackWidgetDomain = STAGING_LEGACY_WIDGET_DOMAIN
        dataProperties["hash"] = widgetId
        root.innerHTML += getWidgetV2EmbedCode(dataProperties)
        invokeV2Javascript(environment, root)
        break
      case 3:
        dataProperties["wid"] = widgetId
        root.innerHTML += getWidgetV3EmbedCode(dataProperties)
        invokeV3Javascript(environment, root)
        break
      default:
        throw new Error(`No widget code accessible with version ${widgetVersion}`)
    }
  } catch (error) {
    console.error(`Failed to embed widget. ${error}`)
  }
}
