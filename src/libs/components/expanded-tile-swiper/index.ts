import { ExpandedTiles } from "./base.template"
import expandedTileStyle from "../../../styles/components/expanded-tile-swiper/base.scss"
import swiperExpandedStyles from "../../extensions/swiper/swiper-expanded.scss"
import { ISdk } from "../../../"
import addToCartStyleOverrides from "../../../styles/components/expanded-tile-swiper/add-to-cart.scss"
import productStyleOverrides from "../../../styles/components/expanded-tile-swiper/products.scss"
import { loadSwiperStyles } from "../../extensions/swiper"
import icons from "../../../styles/uikit/_icons.scss"

declare const sdk: ISdk

export interface ExpandedTileSettings {
  /**
   * Use default expanded tile styles
   * @default true
   */
  useDefaultExpandedTileStyles: boolean
  /**
   * Use default product styles
   * @default true
   */
  useDefaultProductStyles: boolean
  /**
   * Use default add to cart styles
   * @default true
   */
  useDefaultAddToCartStyles: boolean
  /**
   * Use default expanded tile templates
   * @default true
   */
  useDefaultExpandedTileTemplates: boolean
  /**
   * Default font - can be a google font link or an external font link
   * @default "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
   */
  defaultFont: string
  /**
   * Use default swiper styles
   * @default true
   */
  useDefaultSwiperStyles: boolean
  /**
   * Add expanded tile templates
   * @default true
   * */
}

function loadDefaultExpandedTileStyles(settings: ExpandedTileSettings) {
  if (settings.useDefaultExpandedTileStyles) {
    sdk.addCSSToComponent(expandedTileStyle, "expanded-tiles")
    sdk.addCSSToComponent(swiperExpandedStyles, "expanded-tiles")
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

export function loadExpandedTileTemplates(settings: ExpandedTileSettings) {
  loadDefaultExpandedTileStyles(settings)
  loadDefaultExpandedTileTemplates(settings.useDefaultExpandedTileTemplates)
  loadWidgetFonts(settings.defaultFont)
  loadDefaultIcons()

  if (settings.useDefaultSwiperStyles) {
    loadSwiperStyles()
  }
}
