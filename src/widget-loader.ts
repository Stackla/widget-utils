import {
  addAutoAddTileFeature,
  addLoadMoreButtonFeature,
  loadExpandedTileFeature,
  loadTitle
} from "./libs/widget.features"
import { addCSSVariablesToPlacement } from "./libs/widget.layout"
import getCSSVariables from "./libs/css-variables"
import { ISdk } from "./types"
import {
  handleTileImageError,
  handleAllTileImageRendered,
  renderMasonryLayout
} from "./libs/extensions/masonry/masonry.extension"
import { loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { callbackDefaults, loadListeners } from "./events"
import { EnforcedWidgetSettings, MyWidgetSettings } from "./types/loader"
import { injectFontFaces } from "./fonts"

declare const sdk: ISdk

function loadMasonryCallbacks(settings: EnforcedWidgetSettings) {
  const tilesUpdatedObserver = new MutationObserver(() => {
    renderMasonryLayout()
  })

  tilesUpdatedObserver.observe(sdk.querySelector(".ugc-tiles")!, {
    childList: true,
    subtree: true
  })

  settings.callbacks.onTileBgImgRenderComplete.push(() => {
    handleAllTileImageRendered()
    setTimeout(handleAllTileImageRendered, 1000)
  })

  settings.callbacks.onTileBgImageError.push(event => {
    const customEvent = event as CustomEvent
    const tileWithError = customEvent.detail.data.target as HTMLElement
    handleTileImageError(tileWithError)
  })

  const grid = sdk.querySelector(".grid")
  const observer = new ResizeObserver(() => {
    renderMasonryLayout()
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
      loadExpandedTileSlider: true,
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

async function loadFeatures(settings: EnforcedWidgetSettings) {
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
    loadTitle()
  }

  loadExpandedTileFeature()

  if (addNewTilesAutomatically) {
    addAutoAddTileFeature()
  }

  if (handleLoadMore) {
    await import("./libs/components/load-more")
    addLoadMoreButtonFeature()
  }

  return settings
}

function loadExtensions(settings: EnforcedWidgetSettings) {
  const { extensions } = settings

  if (extensions?.masonry) {
    settings = loadMasonryCallbacks(settings)
    renderMasonryLayout()
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
      loadExpandedTileSlider: true,
      loadTileContent: true,
      loadTimephrase: true
    }
  }

  return settings
}

export function loadTemplates(settings: EnforcedWidgetSettings) {
  if (settings.features.loadExpandedTileSlider) {
    loadExpandedTileTemplates(settings.templates["expanded-tiles"]?.template ? false : true)
  }

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

function addConfigStyles(settings: EnforcedWidgetSettings) {
  const { style } = settings.config

  if (style) {
    sdk.updateWidgetStyle(style)
  }
}

function addConfigExpandedTileSettings(settings: EnforcedWidgetSettings) {
  const { expandedTile } = settings.config

  if (expandedTile) {
    sdk.updateExpandedTileOptions(expandedTile)
  }
}

function addConfigInlineTileSettings(settings: EnforcedWidgetSettings) {
  const { inlineTile } = settings.config

  if (inlineTile) {
    sdk.updateInlineTileOptions(inlineTile)
  }
}

function addConfigFilter(settings: EnforcedWidgetSettings) {
  const { filter } = settings.config

  if (filter && filter.media) {
    sdk.setMediaType(filter.media)
  }
}

export function loadWidget(settings?: MyWidgetSettings) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addConfigStyles(settingsWithDefaults)
  addConfigExpandedTileSettings(settingsWithDefaults)
  addConfigInlineTileSettings(settingsWithDefaults)
  addCSSVariablesToPlacement(getCSSVariables(settings?.features))
  addConfigFilter(settingsWithDefaults)
  loadTemplates(settingsWithDefaults)
  loadFeatures(settingsWithDefaults)
  loadExtensions(settingsWithDefaults)
  loadListeners(settingsWithDefaults)
  injectFontFaces(document.head, settings?.config?.fonts)
  injectFontFaces(sdk.getShadowRoot(), settings?.config?.fonts)
}
