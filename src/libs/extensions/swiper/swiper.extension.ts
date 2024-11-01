import { SdkSwiper, SwiperData, SwiperProps } from "../../../types/SdkSwiper"
import Swiper from "swiper"
import { Keyboard, Manipulation, Mousewheel, Navigation } from "swiper/modules"

declare const sdk: SdkSwiper

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
    } else {
      // re-initialize
      swiperInstance.destroy(true)
    }
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
    breakpointsBase: "container",
    watchSlidesProgress: true,
    normalizeSlideIndex: true,
    watchOverflow: true,
    mousewheel: {
      enabled: true,
      releaseOnEdges: true,
      thresholdDelta: 5
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

export function getSwiperIndexforTile(swiperSelector: HTMLElement, tileId: string) {
  const slideElements = swiperSelector.querySelectorAll<HTMLElement>(".swiper-slide")
  const index = Array.from(slideElements).findIndex(element => element.getAttribute("data-id") === tileId)
  return index < 0 ? 0 : index
}

export function disableSwiper(id: string) {
  sdk[id]?.instance?.disable()
}

export function enableSwiper(id: string) {
  sdk[id]?.instance?.enable()
}

export function destroySwiper(id: string) {
  sdk[id]?.instance?.destroy(true, true)
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
