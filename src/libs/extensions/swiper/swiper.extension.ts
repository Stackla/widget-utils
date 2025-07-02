import { EVENT_TILES_UPDATED } from "../../../events"
import { ISdk, Tile } from "../../../types"
import { SwiperData, SwiperProps } from "../../../types/SdkSwiper"
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
import { loadAllUnloadedTiles } from "./loader.extension"

export type LookupAttr = {
  name: string
  value: string
}

function addTilesUpdatedListener(sdk: ISdk, id: string, getSlides?: (sdk: ISdk, tiles: Tile[]) => JSX.Element[]) {
  const swiper = getInstance(sdk, id)

  sdk.addEventListener(EVENT_TILES_UPDATED, event => {
    if (event instanceof CustomEvent) {
      const tiles = event.detail.data.tiles
      if (getSlides) {
        getSlides(sdk, tiles).forEach(
          slide => swiper && typeof swiper.appendSlide == "function" && swiper.appendSlide(slide)
        )
        swiper?.update()
      }

      loadAllUnloadedTiles(sdk)
    }
  })

  if (!swiper) {
    console.warn("Swiper instance not found")
    return
  }

  const observer = new MutationObserver(() => {
    swiper.update()
    sdk.querySelector(".tile-loading:not(.hidden)")?.classList.add("hidden")
  })

  observer.observe(sdk.querySelector(".ugc-tiles")!, {
    childList: true,
    subtree: true
  })
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

  const { id, widgetSelector, prevButton, nextButton, paramsOverrides, getSliderTemplate } = swiperProps

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

  window.ugc.swiperContainer[mutatedId]!.instance = new window.ugc.libs.Swiper(widgetSelector, {
    modules: [Navigation, Manipulation, Keyboard, Mousewheel, Autoplay, EffectCoverflow, Pagination, FreeMode],
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
  })

  if (!sdk.getCustomTemplate("expanded-tiles")) {
    addTilesUpdatedListener(sdk, id, getSliderTemplate)
  }
}

export function refreshSwiper(sdk: ISdk, id: string) {
  const instance = getSwiperInstance(sdk, id)
  if (instance) {
    instance.update()
  }
}

export function getSwiperIndexForTile(swiperSelector: HTMLElement, tileId: string) {
  const slide = swiperSelector.querySelector(`.swiper-slide[data-id="${tileId}"]`)

  if (!slide) {
    console.warn(`Slide with tileId ${tileId} not found in swiper`)
    return 0
  }

  return Number(slide.getAttribute("data-swiper-slide-index")) || 0
}

export function getSwiperInstance(sdk: ISdk, id: string) {
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
  if (getSwiperInstance(sdk, id)) {
    getSwiperInstance(sdk, id).destroy(true, true)
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
  const instance = container.instance

  if (instance) {
    return instance
  }

  console.error(`Swiper instance for id ${id} not found`)
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
    return window.ugc.swiperContainer[mutatedId]
  }

  console.error(`Swiper container for id ${mutatedId} not found`)
  return null
}

export function isSwiperLoading(sdk: ISdk, id: string) {
  return getSwiperContainer(sdk, id)?.isLoading || false
}

export function setSwiperLoadingStatus(sdk: ISdk, id: string, isLoading: boolean) {
  if (getSwiperContainer(sdk, id)) {
    getSwiperContainer(sdk, id).isLoading = isLoading
  }
}

export function updateSwiperInstance(sdk: ISdk, id: string, updateProps: (swiperData: SwiperData) => void) {
  const container = getSwiperContainer(sdk, id)
  if (container && container.instance) {
    updateProps(container)
    return
  }

  console.error(`Swiper instance for id ${id} not found`)
  return null
}
