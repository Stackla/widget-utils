import { addAutoAddTileFeature, loadTitle } from "./libs/widget.features"
import { addCSSVariablesToPlacement } from "./libs/widget.layout"
import getCSSVariables from "./libs/css-variables"
import { ISdk } from "./types"
import { callbackDefaults, loadListeners } from "./events"
import { EnforcedWidgetSettings, MyWidgetSettings } from "./types/loader"
import { injectFontFaces } from "./fonts"

function mergeSettingsWithDefaults(settings?: MyWidgetSettings): EnforcedWidgetSettings {
  return {
    features: {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      hideBrokenImages: true,
      loadTileContent: true,
      loadTimephrase: true,
      ...settings?.features
    },
    callbacks: {
      ...callbackDefaults,
      ...settings?.callbacks
    },
    templates: settings?.templates ?? {},
    config: settings?.config ?? {}
  }
}

async function loadFeatures(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const {
    showTitle,
    preloadImages,
    addNewTilesAutomatically,
    handleLoadMore,
    hideBrokenImages,
    loadTileContent,
    loadTimephrase
  } = settings.features

  sdk.setPreloadImages(preloadImages)
  sdk.setHideBrokenTiles(hideBrokenImages)

  const { show_shopspots: showShopspotsInline } = sdk.getInlineTileConfig()

  if (showShopspotsInline) {
    sdk.addLoadedComponents(["shopspots"])
  }

  if (loadTileContent) {
    sdk.addLoadedComponents(["tile-content", "timephrase", "tags", "share-menu"])
  } else if (loadTimephrase) {
    sdk.addLoadedComponents(["timephrase"])
  }

  if (showTitle) {
    loadTitle(sdk)
  }

  if (addNewTilesAutomatically) {
    addAutoAddTileFeature(sdk)
  }

  if (handleLoadMore) {
    sdk.addLoadedComponents(["load-more"])
  }

  return settings
}

export function initialiseFeatures(settings: MyWidgetSettings) {
  if (Object.keys(settings.features ?? {}).length === 0) {
    settings.features = {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      hideBrokenImages: true,
      loadTileContent: true,
      loadTimephrase: true
    }
  }

  return settings
}

export function loadTemplates(sdk: ISdk, settings: EnforcedWidgetSettings) {
  if (settings.templates && Object.keys(settings.templates).length) {
    Object.entries(settings.templates).forEach(([key, customTemplate]) => {
      if (!customTemplate) {
        return
      }

      sdk.addTemplateToComponent(customTemplate, key)
    })
  }
}

function addConfigStyles(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const { style } = settings.config

  if (style) {
    sdk.updateWidgetStyle(style)
  }
}

function addConfigExpandedTileSettings(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const { expandedTile } = settings.config

  if (expandedTile) {
    sdk.updateExpandedTileOptions(expandedTile)
  }
}

function addConfigInlineTileSettings(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const { inlineTile } = settings.config

  if (inlineTile) {
    sdk.updateInlineTileOptions(inlineTile)
  }
}

function addConfigFilter(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const { filter } = settings.config

  if (filter && filter.media) {
    sdk.setMediaType(filter.media)
  }
}

function showSyntaxWarning() {
  alert("This method of using loadWidget is deprecated. Please check console for details.")

  console.warn(`
    CORRECT USAGE:

    import { loadWidget, ISdk } from "@stackla/widget-utils"
    declare const sdk: ISdk

    loadWidget(sdk, {
      callbacks: {
        onHover: [
          event => {
            const tile = event.detail.tile
            tile.style.transition = "opacity 0.5s"
            tile.style.opacity = "0.5"
          }
        ],
        onMouseLeave: [
          event => {
            const tile = event.detail.tile
            tile.style.transition = "opacity 0.5s"
            tile.style.opacity = "1"
          }
        ]
      }
    }))
    `)
}

export function loadWidget(sdk: ISdk, settings?: MyWidgetSettings) {
  if (!sdk?.querySelectorAll) {
    showSyntaxWarning()
    return
  }

  const settingsWithDefaults = mergeSettingsWithDefaults(settings)

  sdk.storeWidgetTemplateSettings(settingsWithDefaults)

  addConfigStyles(sdk, settingsWithDefaults)
  addConfigExpandedTileSettings(sdk, settingsWithDefaults)
  addConfigInlineTileSettings(sdk, settingsWithDefaults)
  addCSSVariablesToPlacement(sdk, getCSSVariables(sdk, settings?.features))
  addConfigFilter(sdk, settingsWithDefaults)
  loadTemplates(sdk, settingsWithDefaults)
  loadFeatures(sdk, settingsWithDefaults)
  loadListeners(sdk, settingsWithDefaults)
  injectFontFaces(document.head, settings?.config?.fonts)
  injectFontFaces(sdk.getShadowRoot(), settings?.config?.fonts)
}
