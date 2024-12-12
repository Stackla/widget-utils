import {
  addAutoAddTileFeature,
  addCSSVariablesToPlacement,
  addLoadMoreButtonFeature,
  addTilesPerPageFeature,
  loadExpandedTileFeature,
  loadTitle,
  loadWidgetIsEnabled
} from "./libs"
import getCSSVariables from "./libs/css-variables"
import { ISdk, Template } from "./types"
import {
  handleTileImageError,
  handleAllTileImageRendered,
  renderMasonryLayout
} from "./libs/extensions/masonry/masonry.extension"
import { ExpandedTileSettings, loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { callbackDefaults, Callbacks, loadListeners } from "./events"

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
   * @description Expanded tile settings
   */
  expandedTileSettings: ExpandedTileSettings
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

interface CustomTemplate {
  template?: Template
}

type Templates = Record<string, CustomTemplate>

export interface MyWidgetSettings {
  features?: Partial<Features>
  callbacks?: Partial<Callbacks>
  extensions?: Partial<Extensions>
  templates?: Partial<Templates>
  /**
   * Default font - can be a google font link or an external font link
   * @default "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
   */
  font?: string
}

export interface EnforcedWidgetSettings {
  features: Features
  callbacks: Callbacks
  extensions: Extensions
  templates: Partial<Templates>
}

function loadMasonryCallbacks(settings: EnforcedWidgetSettings) {
  settings.callbacks.onTilesUpdated.push(() => {
    renderMasonryLayout()
  })

  settings.callbacks.onTileBgImgRenderComplete.push(() => {
    handleAllTileImageRendered()
    setTimeout(handleAllTileImageRendered, 1000)
  })

  settings.callbacks.onTileBgImageError.push((event: Event) => {
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

function mergeSettingsWithDefaults(settings?: MyWidgetSettings): EnforcedWidgetSettings {
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
      expandedTileSettings: {
        useDefaultExpandedTileStyles: true,
        useDefaultProductStyles: true,
        useDefaultAddToCartStyles: true,
        useDefaultExpandedTileTemplates: true,
        useDefaultSwiperStyles: true,
        defaultFont: settings?.font ?? "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
      },
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
    templates: settings?.templates ?? {}
  }
}

async function loadFeatures(settings: EnforcedWidgetSettings) {
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
      limitTilesPerPage: true
    }
  }

  return settings
}

export function loadTemplates(settings: EnforcedWidgetSettings) {
  const { expandedTileSettings } = settings.features
  const {
    useDefaultExpandedTileStyles,
    useDefaultProductStyles,
    useDefaultAddToCartStyles,
    useDefaultExpandedTileTemplates,
    defaultFont,
    useDefaultSwiperStyles
  } = expandedTileSettings

  if (settings.features.loadExpandedTileSlider) {
    loadExpandedTileTemplates({
      useDefaultExpandedTileStyles: useDefaultExpandedTileStyles,
      useDefaultProductStyles: useDefaultProductStyles,
      useDefaultAddToCartStyles: useDefaultAddToCartStyles,
      useDefaultExpandedTileTemplates: useDefaultExpandedTileTemplates,
      defaultFont: defaultFont,
      useDefaultSwiperStyles: useDefaultSwiperStyles
    })
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

export function loadWidget(settings?: MyWidgetSettings) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addCSSVariablesToPlacement(getCSSVariables(settings?.features))
  loadTemplates(settingsWithDefaults)
  loadFeatures(settingsWithDefaults)
  loadExtensions(settingsWithDefaults)
  loadListeners(settingsWithDefaults)
}
