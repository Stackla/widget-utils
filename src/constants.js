export const STAGING_LEGACY_WIDGET_URL = "assetscdn.teaser.stackla.com"
export const PRODUCTION_LEGACY_WIDGET_URL = "assetscdn.stackla.com"

export const STAGING_DATA_URL = "https://widget-data.teaser.stackla.com"
export const STAGING_UI_URL = "https://widget-ui.teaser.stackla.com"

export const PRODUCTION_DATA_URL = "https://widget-data.stackla.com"
export const PRODUCTION_UI_URL = "https://widget-ui.stackla.com"

export const SERVER_URLS = {
  STAGING_LEGACY_WIDGET_URL,
  PRODUCTION_LEGACY_WIDGET_URL,
  STAGING_DATA_URL,
  STAGING_UI_URL,
  PRODUCTION_DATA_URL,
  PRODUCTION_UI_URL
}

export const SERVER_URLS_AS_JSON = Object.entries(SERVER_URLS).reduce((acc, [key, value]) => {
  acc[`process.env.${key}`] = JSON.stringify(value)
  return acc
}, {})
