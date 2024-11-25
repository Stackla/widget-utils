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
import { loadAllUnloadedTiles } from "./libs/extensions/swiper/loader.extension"
import { ExpandedTileSettings, loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { callbackDefaults, Callbacks, loadListeners } from "./events"

declare const sdk: ISdk

interface Features {
  /**
   * Show the title of the widget
   * @default true
   */
  showTitle: boolean
  /**
   * Allow UGC to handle image preloading
   * @default true
   */
  preloadImages: boolean
  /**
   * Disable the widget if it is not enabled
   * @default true
   */
  disableWidgetIfNotEnabled: boolean
  /**
   * Automatically add new tiles to the widget
   * @default true
   */
  addNewTilesAutomatically: boolean
  /**
   * Handle the load more button
   * @default true
   */
  handleLoadMore: boolean
  /**
   * Limit the number of tiles per page
   * @default true
   */
  limitTilesPerPage: boolean
  /**
   * Hide broken images
   * @default true
   */
  hideBrokenImages: boolean
  /**
   * Load the expanded tile slider
   * @default true
   */
  loadExpandedTileSlider: boolean
  /**
   * Load the tile content web component
   * @default true
   */
  loadTileContent: boolean
  /**
   * Load the timephrase web component
   * @default true
   */
  loadTimephrase: boolean
  /**
   * Expanded tile settings
   */
  expandedTileSettings: ExpandedTileSettings
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

interface TemplateStyle {
  css: string
  global: boolean
}

interface CustomTemplate {
  styles?: TemplateStyle[]
  template?: Template
}

type Templates = Record<string, CustomTemplate>

export interface MyWidgetSettings {
  features: Partial<Features>
  callbacks: Partial<Callbacks>
  extensions: Partial<Extensions>
  templates: Partial<Templates>
  type: string
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
  templates: Partial<Templates>,
  type: string
}

function loadMasonryCallbacks(settings: EnforcedWidgetSettings) {
  settings.callbacks.onWidgetInitComplete.push(() => {
    loadAllUnloadedTiles()
    setTimeout(() => renderMasonryLayout(), 1000)
  })

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

  settings.callbacks.onResize!.push(() => {
    renderMasonryLayout(false, true)
  })

  return settings
}

function mergeSettingsWithDefaults(settings: MyWidgetSettings): EnforcedWidgetSettings {
  return {
    type: settings.type,
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
        defaultFont: settings.font ?? "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
      },
      ...settings.features
    },
    callbacks: {
      ...callbackDefaults,
      ...settings.callbacks
    },
    extensions: {
      swiper: false,
      masonry: false,
      ...settings.extensions
    },
    templates: settings.templates
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
    addTilesPerPageFeature(settings.type);
  }

  return settings
}

function loadExtensions(settings: EnforcedWidgetSettings) {
  const { extensions } = settings

  if (extensions?.masonry) {
    settings = loadMasonryCallbacks(settings)
  }

  return settings
}

export function initialiseFeatures(settings: MyWidgetSettings) {
  if (Object.keys(settings.features).length === 0) {
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

      const { styles, template } = customTemplate

      if (styles) {
        styles.forEach(style => {
          const { css, global } = style

          if (global) {
            const randomKey = Math.random().toString(36).substring(7)
            sdk.addSharedCssCustomStyles(randomKey, css, [sdk.placement.getWidgetId(), key])
          } else {
            sdk.addCSSToComponent(css, key)
          }
        })
      }

      if (template) {
        sdk.addTemplateToComponent(template, key)
      }
    })
  }
}

export function loadWidget(settings: MyWidgetSettings) {
  const settingsWithDefaults = mergeSettingsWithDefaults(settings)
  addCSSVariablesToPlacement(getCSSVariables(settingsWithDefaults.type))
  loadTemplates(settingsWithDefaults)
  loadFeatures(settingsWithDefaults)
  loadExtensions(settingsWithDefaults)
  loadListeners(settingsWithDefaults)
}
