import {
  STAGING_DATA_URL,
  PRODUCTION_DATA_URL,
  STAGING_LEGACY_WIDGET_DOMAIN,
  PRODUCTION_LEGACY_WIDGET_DOMAIN
} from "../constants"
import { getWidgetV2EmbedCode, invokeV2Javascript } from "./v2"
import { getWidgetV3EmbedCode, invokeV3Javascript } from "./v3"

export type Environment = "staging" | "production"

interface EmbedOptions<T> {
  widgetId: string
  root: T
  environment: Environment
  dataProperties: Record<string, string | number | boolean>
}

export interface JSONSchema {
  widgetVersion: number
  scriptVersion: number
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
  return `${getWidgetDataUrl(environment)}/widgets/${widgetId}/version/`
}

async function retrieveWidgetMetaFromServer(widgetId: string, environment: Environment): Promise<JSONSchema> {
  const response = await fetch(getRequestUrl(widgetId, environment))
  return response.json()
}

function injectHTML(root: HTMLElement | ShadowRoot, html: string) {
  root.appendChild(document.createRange().createContextualFragment(html))
}

export async function embed<T extends ShadowRoot | HTMLElement>(options: EmbedOptions<T>) {
  const { environment, widgetId, root, dataProperties } = options

  try {
    const widgetMeta = await retrieveWidgetMetaFromServer(widgetId, environment)
    const { widgetVersion, scriptVersion } = widgetMeta
    switch (widgetVersion) {
      case 2:
        window.stackWidgetDomain = getLegacyWidgetDomain(environment)
        dataProperties["hash"] = widgetId
        injectHTML(root, getWidgetV2EmbedCode(dataProperties))
        invokeV2Javascript(environment)
        break
      case 3:
        dataProperties["wid"] = widgetId
        injectHTML(root, getWidgetV3EmbedCode(dataProperties))
        await invokeV3Javascript(environment, scriptVersion)
        break
      default:
        throw new Error(`No widget code accessible with version ${widgetVersion}`)
    }
  } catch (error) {
    console.error(`Failed to embed widget. ${error}`)
  }
}
