import { ExpandedTiles } from "./base.template"
import expandedTileStyle from "../../../styles/components/expanded-tile-swiper/base.scss"
import swiperExpandedStyles from "../../extensions/swiper/swiper-expanded.scss"
import tileTagStyles from "../../../styles/templates/tags/tags.scss"
import { ISdk } from "../../../"
import shareMenuStyle from "../../../styles/templates/share-menu/share-menu.scss"
import addToCartStyleOverrides from "../../../styles/components/expanded-tile-swiper/add-to-cart.scss"
import productStyleOverrides from "../../../styles/components/expanded-tile-swiper/products.scss"
import { loadSwiperStyles } from "../../extensions/swiper"
import icons from "../../../styles/uikit/icon.scss"

declare const sdk: ISdk

interface ExpandedTileSettings {
  useDefaultExpandedTileStyles: boolean
  useDefaultProductStyles: boolean
  useDefaultAddToCartStyles: boolean
  useDefaultExpandedTileTemplates: boolean
  defaultFont: string
  useDefaultSwiperStyles: boolean
}

function loadDefaultExpandedTileStyles(settings: ExpandedTileSettings) {
  if (settings.useDefaultExpandedTileStyles) {
    sdk.addCSSToComponent(expandedTileStyle, "expanded-tiles")
    sdk.addCSSToComponent(shareMenuStyle, "expanded-tiles")
    sdk.addCSSToComponent(swiperExpandedStyles, "expanded-tiles")
    sdk.addCSSToComponent(tileTagStyles, "expanded-tiles")
  }
  if (settings.useDefaultAddToCartStyles) {
    sdk.addCSSToComponent(addToCartStyleOverrides, "add-to-cart")
  }
  if (settings.useDefaultProductStyles) {
    sdk.addCSSToComponent(productStyleOverrides, "ugc-products")
  }
}

function loadDefaultExpandedTileTemplates(addExpandedTileTemplates: boolean) {
  if (addExpandedTileTemplates) {
    sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
  }
}

function loadWidgetFonts(defaultFont: string) {
  sdk.addWidgetCustomStyles(` 
    @import url('${defaultFont}');
  body {
    font-family: 'Inter', sans-serif;
  }`)
}

function loadDefaultIcons() {
  sdk.addSharedCssCustomStyles("icons", icons, [sdk.placement.getWidgetId(), "expanded-tiles"])
}

function loadSettingsWithDefaults(settings: Partial<ExpandedTileSettings>): ExpandedTileSettings {
  return {
    useDefaultExpandedTileStyles: settings.useDefaultExpandedTileStyles ?? true,
    useDefaultProductStyles: settings.useDefaultProductStyles ?? true,
    useDefaultAddToCartStyles: settings.useDefaultAddToCartStyles ?? true,
    useDefaultExpandedTileTemplates: settings.useDefaultExpandedTileTemplates ?? true,
    defaultFont:
      settings.defaultFont ?? "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    useDefaultSwiperStyles: settings.useDefaultSwiperStyles ?? true
  }
}

export function loadExpandedTileTemplates(settings: ExpandedTileSettings) {
  const settingsWithDefaults = loadSettingsWithDefaults(settings)

  loadDefaultExpandedTileStyles(settingsWithDefaults)
  loadDefaultExpandedTileTemplates(settingsWithDefaults.useDefaultExpandedTileTemplates)
  loadWidgetFonts(settingsWithDefaults.defaultFont)
  loadDefaultIcons()

  if (settingsWithDefaults.useDefaultSwiperStyles) {
    loadSwiperStyles()
  }
}
