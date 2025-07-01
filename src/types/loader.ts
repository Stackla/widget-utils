import { Callbacks } from "../events"
import { Template, WidgetConfig } from "./"

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
   * @description Hide broken images
   * @default true
   */
  hideBrokenImages: boolean
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
   * @description Modify default tile width settings
   */
  tileWidthSettings?: {
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

type Templates = Record<string, Template>

export interface MyWidgetSettings {
  features?: Partial<Features>
  callbacks?: Partial<Callbacks>
  extensions?: Partial<Extensions>
  templates?: Partial<Templates>
  config?: Partial<WidgetConfig>
}

export interface EnforcedWidgetSettings extends Required<MyWidgetSettings> {
  features: Features
  callbacks: Callbacks
  extensions: Extensions
}
