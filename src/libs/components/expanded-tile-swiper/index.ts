import { ExpandedTiles } from "./base.template"
import { ISdk } from "../../../"
import { loadSwiperStyles } from "../../extensions/swiper"

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

export function loadExpandedTileTemplates(settings: ExpandedTileSettings) {
  loadDefaultExpandedTileTemplates(settings.useDefaultExpandedTileTemplates)
  loadWidgetFonts(settings.defaultFont)

  if (settings.useDefaultSwiperStyles) {
    loadSwiperStyles()
  }
}
