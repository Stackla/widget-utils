import { type Swiper } from "swiper"
import { SwiperOptions } from "swiper/types"

export type SwiperType = Swiper

export type SwiperMode = "inline" | "expanded" | "cross-sell" | "expanded-product-recs" | "tags"

export type SwiperProps = {
  id: string
  widgetSelector: HTMLElement
  prevButton?: string
  nextButton?: string
  mode: SwiperMode
  paramsOverrides?: SwiperOptions
}

export type AutoplayStatus = {
  muted: boolean
  paused: boolean
}

export type SwiperData = {
  instance?: Swiper
  perView?: number | "auto"
  isLoading?: boolean
  pageIndex: number
  autoplayStatus?: AutoplayStatus
}

export type SdkSwiper = {
  [id: string]: SwiperData | undefined
}
