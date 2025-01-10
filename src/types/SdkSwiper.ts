import { type Swiper } from "swiper"
import { SwiperOptions } from "swiper/types"
import { Tile } from "./core"

export type SwiperType = Swiper

export type SwiperMode = "inline" | "expanded" | "cross-sell" | "expanded-product-recs" | "tags"

export type SwiperProps = {
  id: string
  widgetSelector: HTMLElement
  prevButton?: string
  nextButton?: string
  mode: SwiperMode
  paramsOverrides?: SwiperOptions
  /**
   * @description
   * Adds support for additional slides that appear when load more is invoked. Note: not all sliders require this, especially if static.
   */
  getSliderTemplate?: (tiles: Record<string, Tile>) => JSX.Element[]
}

export type SwiperData = {
  instance?: Swiper
  perView?: number | "auto"
  isLoading?: boolean
  pageIndex: number
  muted?: boolean
}

export type SdkSwiper = {
  [id: string]: SwiperData | undefined
}
