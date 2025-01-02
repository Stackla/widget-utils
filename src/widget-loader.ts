import {
  addAutoAddTileFeature,
  addLoadMoreButtonFeature,
  addTilesPerPageFeature,
  loadExpandedTileFeature,
  loadTitle,
  loadWidgetIsEnabled
} from "./libs/widget.features"
import { addCSSVariablesToPlacement } from "./libs/widget.layout"
import getCSSVariables from "./libs/css-variables"
import { ExpandedTileOptions, InlineTileOptions, ISdk, Style, Template } from "./types"
import {
  handleTileImageError,
  handleAllTileImageRendered,
  renderMasonryLayout
} from "./libs/extensions/masonry/masonry.extension"
import { loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { callbackDefaults, Callbacks, loadListeners } from "./events"
import IWidgetRequest from "./types/core/widget-request"

declare const sdk: ISdk

export interface Features {
  /**
   * @description Show the title of the widget
   * @default true
   */
  showTitle: boolean
  /**
   * @description Allow UGC to handle image preloading
   * @default true
   */
  preloadImages: boolean
  /**
   * @description Disable the widget if it is not enabled
   * @default true
   */
  disableWidgetIfNotEnabled: boolean
  /**
   * @description Automatically add new tiles to the widget
   * @default true
   */
  addNewTilesAutomatically: boolean
  /**
   * @description Handle the load more button
   * @default true
   */
  handleLoadMore: boolean
  /**
   * @description Limit the number of tiles per page
   * @default true
   */
  limitTilesPerPage: boolean
  /**
   * @description Hide broken images
   * @default true
   */
  hideBrokenImages: boolean
  /**
   * @description Load the expanded tile slider
   * @default true
   */
  loadExpandedTileSlider: boolean
  /**
   * @description Load the tile content web component
   * @default true
   */
  loadTileContent: boolean
  /**
   * @description Load the timephrase web component
   * @default true
   */
  loadTimephrase: boolean
  /**
   * @description Modify default tile size settings
   */
  tileSizeSettings?: {
    small: string
    medium: string
    large: string
  }
  /**
   * @description Add css variables to the placement
   */
  cssVariables?: Record<string, string>
}

interface Extensions {
  /**
   * Load the Swiper extension for inline tiles
   * @default false
   * */
  swiper: boolean
  /**
   * Load the Masonry extension for inline tiles
   * @default false
   * */
  masonry: boolean
}

interface CustomTemplate<C> {
  template?: Template<C>
}

interface WidgetConfig {
  style: Partial<Style>
  expandedTile: Partial<ExpandedTileOptions>
  inlineTile: Partial<InlineTileOptions>
  filter: Partial<IWidgetRequest>
}

type Templates<C> = Record<string, CustomTemplate<C>>

export interface MyWidgetSettings<C> {
  features?: Partial<Features>
  callbacks?: Partial<Callbacks>
  extensions?: Partial<Extensions>
  templates?: Partial<Templates<C>>
  config?: Partial<WidgetConfig>
}

export interface EnforcedWidgetSettings<C> extends Required<MyWidgetSettings<C>> {
  features: Features
  callbacks: Callbacks
  extensions: Extensions
}

function loadMasonryCallbacks<C>(settings: EnforcedWidgetSettings<C>) {
  settings.callbacks.onTilesUpdated.push(() => {
    renderMasonryLayout()
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
    renderMasonryLayout(false, true)
  })

  observer.observe(grid)

  return settings
}

function mergeSettingsWithDefaults<C>(settings?: MyWidgetSettings<C>): EnforcedWidgetSettings<C> {
  return {
    features: {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      limitTilesPerPage: true,
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

async function loadFeatures<C>(settings: EnforcedWidgetSettings<C>) {
  const {
    showTitle,
    preloadImages,
    disableWidgetIfNotEnabled,
    addNewTilesAutomatically,
    handleLoadMore,
    limitTilesPerPage,
    hideBrokenImages,
    loadTileContent,
    loadTimephrase
  } = settings.features

  sdk.tiles.preloadImages = preloadImages
  sdk.tiles.hideBrokenTiles = hideBrokenImages

  const { show_shopspots: showShopspotsInline } = sdk.getInlineTileConfig()

  if (showShopspotsInline) {
    sdk.addLoadedComponents(["shopspots"])
  }

  if (loadTileContent) {
    sdk.addLoadedComponents(["tile-content", "timephrase", "tags", "share-menu"])
  } else if (loadTimephrase) {
    sdk.addLoadedComponents(["timephrase"])
  }

  if (disableWidgetIfNotEnabled) {
    loadWidgetIsEnabled()
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

  if (limitTilesPerPage) {
    addTilesPerPageFeature()
  }

  return settings
}

function loadExtensions<C>(settings: EnforcedWidgetSettings<C>) {
  const { extensions } = settings

  if (extensions?.masonry) {
    settings = loadMasonryCallbacks(settings)
    renderMasonryLayout()
  }

  return settings
}

export function initialiseFeatures<C>(settings: MyWidgetSettings<C>) {
  if (Object.keys(settings.features ?? {}).length === 0) {
    settings.features = {
      showTitle: true,
      preloadImages: true,
      disableWidgetIfNotEnabled: true,
      addNewTilesAutomatically: true,
      handleLoadMore: true,
      limitTilesPerPage: true,
      hideBrokenImages: true,
      loadExpandedTileSlider: true,
      loadTileContent: true,
      loadTimephrase: true
    }
  }

  return settings
}

export function loadTemplates<C>(settings: EnforcedWidgetSettings<C>) {
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

function addConfigStyles<C>(settings: EnforcedWidgetSettings<C>) {
  const { style } = settings.config

  if (style) {
    sdk.placement.updateWidgetStyle(style)
  }
}

function addConfigExpandedTileSettings<C>(settings: EnforcedWidgetSettings<C>) {
  const { expandedTile } = settings.config

  if (expandedTile) {
    sdk.placement.updateExpandedTileOptions(expandedTile)
  }
}

function addConfigInlineTileSettings<C>(settings: EnforcedWidgetSettings<C>) {
  const { inlineTile } = settings.config

  if (inlineTile) {
    sdk.placement.updateInlineTileOptions(inlineTile)
  }
}

function addConfigFilter<C>(settings: EnforcedWidgetSettings<C>) {
  const { filter } = settings.config

  if (filter && filter.media) {
    sdk.tiles.setMediaType(filter.media)
  }
}

export function loadWidget<C>(settings?: MyWidgetSettings<C>) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addConfigStyles(settingsWithDefaults)
  addConfigExpandedTileSettings(settingsWithDefaults)
  addConfigInlineTileSettings(settingsWithDefaults)
  addCSSVariablesToPlacement(getCSSVariables(settings?.features))
  addConfigFilter(settingsWithDefaults)
  loadTemplates(settingsWithDefaults)
  loadFeatures(settingsWithDefaults)
  loadExtensions(settingsWithDefaults)
  loadListeners<C>(settingsWithDefaults)
}
