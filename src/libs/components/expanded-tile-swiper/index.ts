import { ExpandedTiles } from "./base.template"
import expandedTileStyle from "./base.scss"
import swiperExpandedStyles from "@libs/extensions/swiper/swiper-expanded.scss"
import tileTagStyles from "@libs/templates/tags/tags.scss"
import { ISdk } from "@stackla/public-types"
import shareMenuStyle from "@libs/templates/share-menu/share-menu.scss"
import addToCartStyleOverrides from "./add-to-cart.scss"
import productStyleOverrides from "./products.scss"
import { loadSwiperStyles } from "@libs/extensions/swiper"
import icons from "../../../../uikit/icon.scss"

declare const sdk: ISdk

export function loadExpandedTileTemplates() {
  sdk.addCSSToComponent(expandedTileStyle, "expanded-tiles")
  sdk.addCSSToComponent(shareMenuStyle, "expanded-tiles")
  sdk.addCSSToComponent(swiperExpandedStyles, "expanded-tiles")
  sdk.addCSSToComponent(tileTagStyles, "expanded-tiles")
  sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
  sdk.addCSSToComponent(addToCartStyleOverrides, "add-to-cart")
  sdk.addWidgetCustomStyles(` 
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  body {
    font-family: 'Inter', sans-serif;
  }`)
  sdk.addCSSToComponent(productStyleOverrides, "ugc-products")
  sdk.addSharedCssCustomStyles("icons", icons, [sdk.placement.getWidgetId(), "expanded-tiles"])

  loadSwiperStyles()
}
