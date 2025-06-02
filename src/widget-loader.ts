import { addAutoAddTileFeature, loadExpandedTileFeature, loadTitle } from "./libs/widget.features"
import { addCSSVariablesToPlacement } from "./libs/widget.layout"
import getCSSVariables from "./libs/css-variables"
import { ISdk } from "./types"
import {
  handleTileImageError,
  handleAllTileImageRendered,
  renderMasonryLayout
} from "./libs/extensions/masonry/masonry.extension"
import { callbackDefaults, loadListeners } from "./events"
import { EnforcedWidgetSettings, MyWidgetSettings } from "./types/loader"
import { injectFontFaces } from "./fonts"

function loadMasonryCallbacks(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const tilesUpdatedObserver = new MutationObserver(() => {
    renderMasonryLayout(sdk)
  })

  tilesUpdatedObserver.observe(sdk.querySelector(".ugc-tiles")!, {
    childList: true,
    subtree: true
  })

  settings.callbacks.onTileBgImgRenderComplete.push(() => {
    handleAllTileImageRendered(sdk)
    setTimeout(() => handleAllTileImageRendered(sdk), 1000)
  })

  settings.callbacks.onTileBgImageError.push(event => {
    const customEvent = event
    const tileWithError = customEvent.detail.data.target as HTMLElement
    handleTileImageError(sdk, tileWithError)
  })

  const grid = sdk.querySelector(".grid")

  if (!grid) {
    console.error("Grid element not found")
    return settings
  }

  const observer = new ResizeObserver(() => {
    renderMasonryLayout(sdk)
  })

  observer.observe(grid)

  return settings
}

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
    extensions: {
      swiper: false,
      masonry: false,
      ...settings?.extensions
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

  loadExpandedTileFeature(sdk)

  if (addNewTilesAutomatically) {
    addAutoAddTileFeature(sdk)
  }

  if (handleLoadMore) {
    sdk.addLoadedComponents(["load-more"])
  }

  return settings
}

function loadExtensions(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const { extensions } = settings

  if (extensions?.masonry) {
    settings = loadMasonryCallbacks(sdk, settings)
    renderMasonryLayout(sdk)
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

      const { template } = customTemplate

      if (template) {
        sdk.addTemplateToComponent(template, key)
      }
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

export function loadWidget(sdk: ISdk, settings?: MyWidgetSettings) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addConfigStyles(sdk, settingsWithDefaults)
  addConfigExpandedTileSettings(sdk, settingsWithDefaults)
  addConfigInlineTileSettings(sdk, settingsWithDefaults)
  addCSSVariablesToPlacement(sdk, getCSSVariables(sdk, settings?.features))
  addConfigFilter(sdk, settingsWithDefaults)
  loadTemplates(sdk, settingsWithDefaults)
  loadFeatures(sdk, settingsWithDefaults)
  loadExtensions(sdk, settingsWithDefaults)
  loadListeners(sdk, settingsWithDefaults)
  injectFontFaces(document.head, settings?.config?.fonts)
  injectFontFaces(sdk.getShadowRoot(), settings?.config?.fonts)
}
