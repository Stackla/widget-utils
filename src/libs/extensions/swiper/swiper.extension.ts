import { ISdk } from "../../../types"
import { SwiperProps } from "../../../types/SdkSwiper"
import {
  Autoplay,
  EffectCoverflow,
  FreeMode,
  Keyboard,
  Manipulation,
  Mousewheel,
  Navigation,
  Pagination
} from "swiper/modules"
import Swiper from "swiper"
import { SwiperOptions } from "swiper/types"

export interface SwiperWithExtensions extends Swiper {
  getSlideIndex?: (element: HTMLElement) => number | undefined
  isLoading?: boolean
  instance?: SwiperWithExtensions
  pageIndex?: number | undefined
  muted?: boolean
}

export type LookupAttr = {
  name: string
  value: string
}

type SwiperConfigContainer = {
  prev: HTMLElement | null | undefined
  next: HTMLElement | null | undefined
  paramsOverrides: SwiperOptions | undefined
}

export function establishSwiperConfig(userConfig: SwiperConfigContainer) {
  const { prev, next, paramsOverrides } = userConfig
  const config = {
    modules: [Navigation, Manipulation, Keyboard, Mousewheel, EffectCoverflow, Pagination, FreeMode],
    spaceBetween: 10,
    observer: true,
    grabCursor: true,
    allowTouchMove: true,
    direction: "horizontal",
    watchSlidesProgress: true,
    normalizeSlideIndex: true,
    watchOverflow: true,
    mousewheel: {
      enabled: false
    },
    touchStartPreventDefault: false,
    navigation: {
      enabled: !!(prev && next),
      nextEl: next,
      prevEl: prev
    },
    resizeObserver: true,
    ...paramsOverrides
  }

  if (config.autoplay) {
    config.modules.push(Autoplay)
  }

  return config as SwiperOptions
}

export function initializeSwiper(sdk: ISdk, swiperProps: SwiperProps) {
  // check if constructor is available
  if (!window.ugc.libs.Swiper) {
    console.warn("Swiper library not found. Retrying in 100ms")
    setTimeout(() => initializeSwiper(sdk, swiperProps), 100)
    return
  }

  if (!window.ugc.libs.Swiper.prototype) {
    console.warn("Swiper library cant be initialised. Retrying in 100ms")
    setTimeout(() => initializeSwiper(sdk, swiperProps), 100)
  }

  window.ugc.swiperContainer = window.ugc?.swiperContainer ?? {}

  const { id, widgetSelector, prevButton, nextButton, paramsOverrides } = swiperProps

  const prev = prevButton ? widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${prevButton}`) : undefined
  const next = nextButton ? widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${nextButton}`) : undefined

  const mutatedId = getMutatedId(sdk, id)

  if (!window.ugc.swiperContainer[mutatedId]) {
    window.ugc.swiperContainer[mutatedId] = { ...(window.ugc.swiperContainer ?? {}) }
  }

  const swiperInstance = window.ugc.swiperContainer[mutatedId]?.instance

  if (swiperInstance) {
    if (!swiperInstance.params?.enabled) {
      enableSwiper(sdk, mutatedId)
      return
    }
    // re-initialize
    swiperInstance.destroy(true)
  } else {
    window.ugc.swiperContainer[mutatedId] = { pageIndex: 1 }
  }

  const config = establishSwiperConfig({ prev, next, paramsOverrides })

  const settings = new window.ugc.libs.Swiper(widgetSelector, config)

  window.ugc.swiperContainer[mutatedId]!.instance = settings
}

export function refreshSwiper(sdk: ISdk, id: string) {
  const instance = getSwiperInstance(sdk, id)
  if (instance) {
    instance.update()
  }
}

export function getSwiperIndexByElement(tileElement: HTMLElement, swiperInstance: SwiperWithExtensions) {
  if (!swiperInstance.getSlideIndex) {
    console.warn("Swiper instance does not have getSlideIndex method")
    return 0
  }

  const slideId = swiperInstance.getSlideIndex(tileElement)
  if (slideId === undefined) {
    console.warn("Slide ID not found for the given tile element")
    return 0
  }
  return slideId
}

export function getSwiperIndexForTile(swiperSelector: HTMLElement, tileId: string) {
  const slide = swiperSelector.querySelector(`.swiper-slide[data-id="${tileId}"]`)

  if (!slide) {
    console.warn(`Slide with tileId ${tileId} not found in swiper`)
    return 0
  }

  return Number(slide.getAttribute("data-swiper-slide-index")) || 0
}

export function getSwiperInstance(sdk: ISdk, id: string): SwiperWithExtensions | null {
  const container = getSwiperContainer(sdk, id)
  if (container && container.instance) {
    return container.instance
  }

  console.error(`Swiper instance for id ${id} not found`)
  return null
}

export function disableSwiper(sdk: ISdk, id: string) {
  getSwiperInstance(sdk, id)?.disable()
}

export function enableSwiper(sdk: ISdk, id: string) {
  getSwiperInstance(sdk, id)?.enable()
}

export function getMutatedId(sdk: ISdk, id: string) {
  return `${id}-wid-${sdk.getWidgetId()}`
}

export function destroySwiper(sdk: ISdk, id: string) {
  const mutatedId = getMutatedId(sdk, id)
  const swiperInstance = getSwiperInstance(sdk, id)
  if (swiperInstance) {
    swiperInstance.destroy(true, true)
    delete window.ugc.swiperContainer[mutatedId]
  }
}

export function getClickedIndex(sdk: ISdk, id: string) {
  const instance = getInstance(sdk, id)
  if (instance) {
    const clickedSlide = instance.clickedSlide
    const indexFromAttribute = clickedSlide.getAttribute("data-swiper-slide-index")
    return indexFromAttribute && !Number.isNaN(parseInt(indexFromAttribute))
      ? parseInt(indexFromAttribute)
      : instance.clickedIndex
  }

  console.error(`Swiper instance for id ${id} not found`)

  return 0
}

export function getInstance(sdk: ISdk, id: string) {
  const container = getSwiperContainer(sdk, id)

  if (!container) {
    console.error(`Swiper container for id ${id} not found`)
    return null
  }

  const instance = container.instance

  if (instance) {
    return instance
  }

  console.error(`Swiper instance for id ${id} not found`)
  return null
}

export function getActiveSlide(sdk: ISdk, id: string) {
  return getInstance(sdk, id)?.realIndex || 0
}

export function getActiveSlideElement(sdk: ISdk, id: string) {
  return getInstance(sdk, id)?.slides[getActiveSlide(sdk, id) || 0] || null
}

export function getSwiperContainer(sdk: ISdk, id: string) {
  const mutatedId = getMutatedId(sdk, id)
  if (window.ugc.swiperContainer[mutatedId]) {
    return window.ugc.swiperContainer[mutatedId] as SwiperWithExtensions
  }

  console.error(`Swiper container for id ${mutatedId} not found`)
  return null
}

export function isSwiperLoading(sdk: ISdk, id: string) {
  return getSwiperContainer(sdk, id)?.isLoading || false
}

export function setSwiperLoadingStatus(sdk: ISdk, id: string, isLoading: boolean) {
  const swiperContainer = getSwiperContainer(sdk, id)

  if (swiperContainer) {
    swiperContainer.isLoading = isLoading
  }
}

export function updateSwiperInstance(sdk: ISdk, id: string, updateProps: (swiperData: SwiperWithExtensions) => void) {
  const container = getSwiperContainer(sdk, id)
  if (container && container.instance) {
    updateProps(container)
    return
  }

  console.error(`Swiper instance for id ${id} not found`)
  return null
}
