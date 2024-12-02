import { SdkSwiper, SwiperData, SwiperProps } from "../../../types/SdkSwiper"
import Swiper from "swiper"
import { Keyboard, Manipulation, Mousewheel, Navigation } from "swiper/modules"

declare const sdk: SdkSwiper

export type LookupAttr = {
  name: string
  value: string
}

export function initializeSwiper({
  id,
  widgetSelector,
  prevButton = "swiper-button-prev",
  nextButton = "swiper-button-next",
  paramsOverrides
}: SwiperProps) {
  const prev = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${prevButton}`)
  const next = widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${nextButton}`)

  if (!prev || !next) {
    throw new Error("Missing swiper Navigation elements for previous and next navigation")
  }

  if (!sdk[id]) {
    sdk[id] = {} as SwiperData
  }

  const swiperInstance = sdk[id]?.instance

  if (swiperInstance) {
    if (!swiperInstance.params?.enabled) {
      enableSwiper(id)
      return
    }
    // re-initialize
    swiperInstance.destroy(true)
  } else {
    sdk[id] = { pageIndex: 1 }
  }

  sdk[id]!.instance = new Swiper(widgetSelector, {
    modules: [Navigation, Manipulation, Keyboard, Mousewheel],
    spaceBetween: 10,
    observer: true,
    grabCursor: true,
    allowTouchMove: true,
    direction: "horizontal",
    watchSlidesProgress: true,
    normalizeSlideIndex: true,
    watchOverflow: true,
    mousewheel: {
      enabled: true,
      releaseOnEdges: false,
      thresholdDelta: 5,
      invert: true
    },
    navigation: {
      nextEl: next,
      prevEl: prev
    },
    resizeObserver: true,
    ...paramsOverrides
  })
}

export function refreshSwiper(id: string) {
  if (sdk[id]?.instance) {
    sdk[id].instance.update()
  }
}

export function getSwiperIndexforTile(swiperSelector: HTMLElement, tileId: string, lookupAttr?: LookupAttr) {
  const slideElements = swiperSelector.querySelectorAll<HTMLElement>(".swiper-slide")
  const index = (() => {
    if (lookupAttr) {
      return Array.from(slideElements).findIndex(
        element =>
          element.getAttribute("data-id") === tileId && element.getAttribute(lookupAttr.name) === lookupAttr.value
      )
    }
    return Array.from(slideElements).findIndex(element => element.getAttribute("data-id") === tileId)
  })()
  return index < 0 ? 0 : index
}

export function disableSwiper(id: string) {
  sdk[id]?.instance?.disable()
}

export function enableSwiper(id: string) {
  sdk[id]?.instance?.enable()
}

export function destroySwiper(id: string) {
  if (sdk[id]?.instance) {
    sdk[id].instance.destroy(true, true)
    delete sdk[id]
  }
}

export function getClickedIndex(id: string) {
  if (sdk[id]?.instance) {
    const clickedSlide = sdk[id].instance.clickedSlide
    const indexFromAttribute = clickedSlide.getAttribute("data-swiper-slide-index")
    return indexFromAttribute && !Number.isNaN(parseInt(indexFromAttribute))
      ? parseInt(indexFromAttribute)
      : sdk[id].instance.clickedIndex
  }
  return 0
}

export function getInstance(id: string) {
  return sdk[id]?.instance
}

export function getActiveSlide(id: string) {
  return sdk[id]?.instance?.realIndex || 0
}

export function getActiveSlideElement(id: string) {
  return sdk[id]?.instance?.slides[getActiveSlide(id) || 0]
}
