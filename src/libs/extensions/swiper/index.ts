import { ISdk } from "../../../"
import swiperFont from "./font.scss"
import swiperBundleCss from "swiper/swiper-bundle.css"

declare const sdk: ISdk

export function loadSwiperStyles() {
  // some of the css styles are inherited across the shadow DOM components
  // https://www.w3.org/TR/CSS22/propidx.html#q0
  // Injects @font-face into placement head
  sdk.addWidgetCustomStyles(swiperFont)

  // Swiper specific styles to be available for both carousel and expanded tile
  sdk.addSharedCssCustomStyles("swiper-bundle", swiperBundleCss, [
    sdk.placement.getWidgetId(),
    "expanded-tiles",
    "ugc-products"
  ])
}

export * from "./loader.extension"
export * from "./swiper.extension"
