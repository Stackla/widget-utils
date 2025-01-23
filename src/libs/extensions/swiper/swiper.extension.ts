import { EVENT_TILES_UPDATED } from "../../../events"
import { Sdk, Tile } from "../../../types"
import { SwiperData, SwiperProps } from "../../../types/SdkSwiper"
import { Autoplay, EffectCoverflow, Keyboard, Manipulation, Mousewheel, Navigation } from "swiper/modules"
import { loadAllUnloadedTiles } from "./loader.extension"

declare const sdk: Sdk

window.ugc.swiperContainer = window.ugc.swiperContainer ?? {}

export type LookupAttr = {
  name: string
  value: string
}

function addTilesUpdatedListener(id: string, getSlides?: (tiles: Record<string, Tile>) => JSX.Element[]) {
  const swiper = getInstance(id)

  sdk.addEventListener(EVENT_TILES_UPDATED, event => {
    if (event instanceof CustomEvent) {
      const tiles = event.detail.data.tiles
      if (getSlides) {
        getSlides(tiles).forEach(slide => swiper?.appendSlide(slide))
        swiper?.update()
      }

      loadAllUnloadedTiles()
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

export function initializeSwiper(swiperProps: SwiperProps) {
  // check if constructor is available
  if (!window.ugc.libs.Swiper) {
    console.warn("Swiper library not found. Retrying in 100ms")
    setTimeout(() => initializeSwiper(swiperProps), 100)
    return
  }

  if (!window.ugc.libs.Swiper.prototype) {
    console.warn("Swiper library cant be initialised. Retrying in 100ms")
    setTimeout(() => initializeSwiper(swiperProps), 100)
  }

  const { id, widgetSelector, prevButton, nextButton, paramsOverrides, getSliderTemplate } = swiperProps

  const prev = prevButton ? widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${prevButton}`) : undefined
  const next = nextButton ? widgetSelector!.parentNode!.querySelector<HTMLElement>(`.${nextButton}`) : undefined

  if (!window.ugc.swiperContainer[id]) {
    window.ugc.swiperContainer[id] = { ...(window.ugc.swiperContainer ?? {}) }
  }

  const swiperInstance = window.ugc.swiperContainer[id]?.instance

  if (swiperInstance) {
    if (!swiperInstance.params?.enabled) {
      enableSwiper(id)
      return
    }
    // re-initialize
    swiperInstance.destroy(true)
  } else {
    window.ugc.swiperContainer[id] = { pageIndex: 1 }
  }

  window.ugc.swiperContainer[id]!.instance = new window.ugc.libs.Swiper(widgetSelector, {
    modules: [Navigation, Manipulation, Keyboard, Mousewheel, Autoplay, EffectCoverflow],
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
    navigation: {
      enabled: !!(prev && next),
      nextEl: next,
      prevEl: prev
    },
    resizeObserver: true,
    ...paramsOverrides
  })

  addTilesUpdatedListener(id, getSliderTemplate)
}

export function refreshSwiper(id: string) {
  if (window.ugc.swiperContainer[id]?.instance) {
    window.ugc.swiperContainer[id].instance.update()
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
  window.ugc.swiperContainer[id]?.instance?.disable()
}

export function enableSwiper(id: string) {
  window.ugc.swiperContainer[id]?.instance?.enable()
}

export function destroySwiper(id: string) {
  if (window.ugc.swiperContainer[id]?.instance) {
    window.ugc.swiperContainer[id].instance.destroy(true, true)
    delete window.ugc.swiperContainer[id]
  }
}

export function getClickedIndex(id: string) {
  if (window.ugc.swiperContainer[id]?.instance) {
    const clickedSlide = window.ugc.swiperContainer[id].instance.clickedSlide
    const indexFromAttribute = clickedSlide.getAttribute("data-swiper-slide-index")
    return indexFromAttribute && !Number.isNaN(parseInt(indexFromAttribute))
      ? parseInt(indexFromAttribute)
      : window.ugc.swiperContainer[id].instance.clickedIndex
  }
  return 0
}

export function getInstance(id: string) {
  return window.ugc.swiperContainer[id]?.instance
}

export function getActiveSlide(id: string) {
  return window.ugc.swiperContainer[id]?.instance?.realIndex || 0
}

export function getActiveSlideElement(id: string) {
  return window.ugc.swiperContainer[id]?.instance?.slides[getActiveSlide(id) || 0]
}

export function isSwiperLoading(id: string) {
  if (window.ugc.swiperContainer[id]) {
    return window.ugc.swiperContainer[id].isLoading
  }
  return false
}

export function setSwiperLoadingStatus(id: string, isLoading: boolean) {
  if (window.ugc.swiperContainer[id]) {
    window.ugc.swiperContainer[id].isLoading = isLoading
  }
}

export function updateSwiperInstance(id: string, updateProps: (swiperData: SwiperData) => void) {
  if (window.ugc.swiperContainer[id] && window.ugc.swiperContainer[id].instance) {
    updateProps(window.ugc.swiperContainer[id])
  }
}
