import {
  destroySwiper,
  getActiveSlide,
  getActiveSlideElement,
  getSwiperIndexforTile,
  initializeSwiper,
  LookupAttr,
  updateSwiperInstance
} from "../../extensions/swiper/swiper.extension"
import { waitForElm } from "../../widget.features"
import { type Swiper } from "swiper"
import { muteTiktokVideo, unMuteTiktokVideo } from "./tiktok-message"
import { ISdk, SwiperData } from "../../../types"
import { EVENT_LOAD_MORE } from "../../../events"
import { getExpandedSlides } from "./base.template"
import {
  controlVideoPlayback,
  setupTikTokPlayerReadyEvent,
  setupVideoEvents,
  setupYoutubeEvents,
  YoutubeIframeElementType
} from "./expanded-tile-video"
import { SwiperOptions } from "swiper/types"

interface ExpandedTileSettings {
  initialTileId: string
  lookupAttr?: LookupAttr
  widgetSelector: HTMLElement
  expandedTileWrapper: Element
  swiperSettings?: SwiperOptions
}

/**
 * Initialize/re-initialize swiper for loading expanded tiles
 *
 * @param { string } initialTileId  - id of the tile that should be displayed after loading swiper
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 */
function initializeSwiperForExpandedTiles(
  sdk: ISdk,
  paritalSettings: Partial<ExpandedTileSettings> & {
    initialTileId: string
  }
) {
  const expandedTile = sdk.getExpandedTiles()
  const expandedTileWrapper = expandedTile?.querySelector(".expanded-tile-wrapper")

  if (!expandedTile || !expandedTileWrapper) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  const isStory = expandedTileWrapper.getAttribute("variation") === "story"

  const { initialTileId, lookupAttr } = paritalSettings

  const settings: ExpandedTileSettings = {
    initialTileId,
    widgetSelector,
    expandedTileWrapper,
    lookupAttr,
    swiperSettings: paritalSettings.swiperSettings || {}
  }

  if (isStory) {
    initalizeStoryExpandedTile(sdk, settings)
  } else {
    initalizeExpandedTile(sdk, settings)
  }
}

function initalizeExpandedTile(sdk: ISdk, settings: ExpandedTileSettings) {
  initializeSwiper(sdk, {
    id: "expanded",
    widgetSelector: settings.widgetSelector,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    paramsOverrides: {
      loop: false,
      slidesPerView: 1,
      autoHeight: true,
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      on: {
        reachEnd: () => {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        },
        beforeInit: (swiper: Swiper) => {
          const tileIndex = settings.initialTileId
            ? getSwiperIndexforTile(settings.widgetSelector, settings.initialTileId)
            : 0
          swiper.slideToLoop(tileIndex, 0, false)
        },
        autoplayTimeLeft: (swiper: Swiper, _timeLeft: number, percentage: number) => {
          storyAutoplayProgress(swiper, percentage)
        },
        navigationNext: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper),
        navigationPrev: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper),
        ...settings.swiperSettings?.on
      }
    },
    getSliderTemplate: getExpandedSlides
  })
}

function initalizeStoryExpandedTile(sdk: ISdk, settings: ExpandedTileSettings) {
  const { initialTileId, widgetSelector, expandedTileWrapper, swiperSettings } = settings
  initializeSwiper(sdk, {
    id: "expanded",
    widgetSelector,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    paramsOverrides: {
      slidesPerView: "auto",
      autoHeight: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      direction: "horizontal",
      centeredSlides: true,
      effect: "coverflow",
      coverflowEffect: {
        rotate: 0,
        scale: 0.8,
        stretch: -1,
        depth: 1,
        modifier: 1,
        slideShadows: false
      },
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      loop: true,
      on: {
        reachEnd: () => {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        },
        afterInit: (swiper: Swiper) => {
          swiper.slideToLoop(getSwiperIndexforTile(settings.widgetSelector, initialTileId), 0, false)
          registerStoryControls(sdk, expandedTileWrapper, swiper)
        },
        autoplayTimeLeft: (swiper: Swiper, _timeLeft: number, percentage: number) => {
          storyAutoplayProgress(swiper, percentage)
        },
        slideChange: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper),
        autoplay: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper),
        navigationNext: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper),
        navigationPrev: (swiper: Swiper) => swiperNavigationHandler(sdk, swiper)
      },
      ...swiperSettings
    },
    getSliderTemplate: getExpandedSlides
  })
}

async function swiperNavigationHandler(sdk: ISdk, swiper: Swiper) {
  controlVideoPlayback(sdk, swiper)
  const tileId = getTileIdFromSlide(swiper, swiper.realIndex)
  if (!tileId) {
    throw Error("Tile ID is not found in next slide from swiper")
  }
  const tile = sdk.getTileById(tileId)
  if (!tile) {
    throw Error("Tile is not found in next slide from swiper")
  }
  sdk.setTile(tile)
}

export function storyAutoplayProgress(swiper: Swiper, progress: number) {
  const activeSlideElement = getActiveSlideFromSlides(swiper)
  const progressLine = activeSlideElement?.querySelector<HTMLElement>(".story-autoplay-progress > .progress-content")

  if (!progressLine) {
    return
  }

  progressLine.style.width = `${100 - Math.round(progress * 100)}%`
}

function registerStoryControls(sdk: ISdk, tileWrapper: Element, swiper: Swiper) {
  const storyCtrls = tileWrapper.querySelector(".story-controls")

  if (!storyCtrls) {
    return
  }

  const playCtrl = storyCtrls.querySelector(".play-ctrl")
  const pauseCtrl = storyCtrls.querySelector(".pause-ctrl")

  const volumeCtrl = storyCtrls.querySelector(".volume-ctrl")
  const muteCtrl = storyCtrls.querySelector(".mute-ctrl")

  playCtrl?.addEventListener("click", () => {
    playCtrl.classList.add("hidden")
    pauseCtrl?.classList.remove("hidden")
    swiper.autoplay.start()
  })

  pauseCtrl?.addEventListener("click", () => {
    pauseCtrl.classList.add("hidden")
    playCtrl?.classList.remove("hidden")
    swiper.autoplay.stop()
  })

  volumeCtrl?.addEventListener("click", () => {
    volumeCtrl.classList.add("hidden")
    muteCtrl?.classList.remove("hidden")
    updateSwiperInstance(sdk, "expanded", (swiperData: SwiperData) => {
      swiperData.muted = true
    })

    const videoEles = tileWrapper.querySelectorAll("video")
    videoEles.forEach(ele => {
      ele.muted = true
    })

    const iFramePlayers = tileWrapper.querySelectorAll<YoutubeIframeElementType>(`iframe.video-content`)
    iFramePlayers.forEach(iFramePlayer => {
      const iFramePlayerId = iFramePlayer.getAttribute("id")
      if (iFramePlayerId) {
        if (iFramePlayerId.includes("yt-frame")) {
          const iFramePlayerWindow = iFramePlayer.contentWindow
          iFramePlayerWindow.mute()
        } else if (iFramePlayerId.includes("tiktok-frame")) {
          const iFramePlayerWindow = iFramePlayer.contentWindow
          muteTiktokVideo(iFramePlayerWindow)
        }
      }
    })
  })

  muteCtrl?.addEventListener("click", () => {
    muteCtrl.classList.add("hidden")
    volumeCtrl?.classList.remove("hidden")
    updateSwiperInstance(sdk, "expanded", (swiperData: SwiperData) => {
      swiperData.muted = false
    })

    const videoEles = tileWrapper.querySelectorAll("video")
    videoEles.forEach(ele => {
      ele.muted = false
    })

    const iFramePlayers = tileWrapper.querySelectorAll<YoutubeIframeElementType>(`iframe.video-content`)
    iFramePlayers.forEach(iFramePlayer => {
      const iFramePlayerId = iFramePlayer.getAttribute("id")
      if (iFramePlayerId) {
        if (iFramePlayerId.includes("yt-frame")) {
          const iFramePlayerWindow = iFramePlayer.contentWindow
          iFramePlayerWindow.unMute()
        } else if (iFramePlayerId.includes("tiktok-frame")) {
          const iFramePlayerWindow = iFramePlayer.contentWindow
          unMuteTiktokVideo(iFramePlayerWindow)
        }
      }
    })
  })

  handleAutoplayProgress(tileWrapper, swiper, playCtrl)
}

/**
 * pause autoplay progress when hover over active slide
 * resume autoplay progress when mouse leave the active slide
 * @param tileWrapper
 * @param swiper
 * @param playCtrl
 */
function handleAutoplayProgress(tileWrapper: Element, swiper: Swiper, playCtrl: Element | null) {
  const swiperWrapperEle = tileWrapper.querySelector(".swiper-wrapper")

  swiperWrapperEle?.addEventListener("mouseleave", () => {
    if (playCtrl?.classList.contains("hidden")) {
      if (swiper.autoplay.paused) {
        swiper.autoplay.resume()
      }
    }
  })
}

export function getSwiperSlideById(swiper: Swiper, id: number): HTMLElement | undefined {
  return swiper.slides[id]
}

export function getActiveSlideFromSlides(swiper: Swiper): HTMLElement | undefined {
  return swiper.slides.find(slide => slide.classList.contains("swiper-slide-active"))
}

/*
 Get Tile ID
*/

export function getTileIdFromSlide(swiper: Swiper, index: number) {
  const element = getSwiperSlideById(swiper, index)
  return element?.getAttribute("data-id")
}

/**
 * Triggered when an inline tile is clicked
 * Adds background overlay for expanded tile and initializes swiper for expanded tile
 *
 * @param { string } tileId - the id of clicked inline tile and the tile that will be displayed on expanded tile load
 */
export function onTileExpand(sdk: ISdk, tileId: string) {
  const expandedTileSettings = sdk.getWidgetTemplateSettings().config?.expandedTile
  const swiperSettings = expandedTileSettings?.swiper_options
  const expandedTile = sdk.getExpandedTiles()
  const body = document.querySelector("body")

  if (body) {
    body.style.overflow = "hidden"
  }

  const overlay: HTMLDialogElement = expandedTile.parentElement as HTMLDialogElement

  overlay.showModal()
  overlay.classList.add("expanded-tile-overlay")

  waitForElm(expandedTile, [".swiper-expanded"], () => {
    const tileElement = expandedTile.shadowRoot?.querySelector(`.swiper-slide[data-id="${tileId}"]`)
    const youtubeId = tileElement?.getAttribute("data-yt-id")
    const tiktokId = tileElement?.getAttribute("data-tiktok-id")

    if (youtubeId) {
      const lookupYtAttr: LookupAttr = { name: "data-yt-id", value: youtubeId }
      const settings = {
        initialTileId: tileId,
        lookupAttr: lookupYtAttr,
        swiperSettings: swiperSettings || {}
      }
      initializeSwiperForExpandedTiles(sdk, settings)
    } else if (tiktokId) {
      const lookupTiktokAttr: LookupAttr = { name: "data-tiktok-id", value: tiktokId }
      const settings = {
        initialTileId: tileId,
        lookupAttr: lookupTiktokAttr,
        swiperSettings: swiperSettings || {}
      }
      initializeSwiperForExpandedTiles(sdk, settings)
    } else {
      const settings = {
        initialTileId: tileId,
        swiperSettings: swiperSettings || {}
      }
      initializeSwiperForExpandedTiles(sdk, settings)
    }
  })
}

/**
 * Triggered after all slides in expanded tiles are loaded
 * Setup onload and onerror events for media sources (video/youtube/tiktok)
 */
export function onTileRendered(event: CustomEvent) {
  const widgetSelectorId = event.detail.widgetSelector as string
  const sdk = window.ugc.getWidgetBySelector(widgetSelectorId).sdk as ISdk
  const expandedTilesElement = sdk.getExpandedTiles()
  const tiles = expandedTilesElement.querySelectorAll(".swiper-slide")

  const widgetSelector = expandedTilesElement.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Widget selector for expanded tile (swiper-expanded) is not found")
  }

  setupTikTokPlayerReadyEvent(sdk)

  tiles?.forEach(tile => {
    setupVideoEvents(sdk, tile, widgetSelector)
    setupYoutubeEvents(sdk, tile, widgetSelector)
  })
}

/**
 * Reduces visibility of swiper controls when share menu is opened
 */
export function reduceBackgroundControlsVisibility(sdk: ISdk, sourceId: string) {
  if (!isValidEventSource(sdk, sourceId)) {
    return
  }

  const expandedTile = sdk.getExpandedTiles()
  const wrapper = expandedTile.querySelector<HTMLElement>(".expanded-tile-wrapper")

  if (!wrapper) {
    return
  }

  const navigationPrevButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = wrapper.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.add("swiper-button-disabled")
  navigationPrevButton?.classList.add("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.style.opacity = "0.4"
  }
}

/**
 * Resets visibility of swiper controls when share menu is closed
 */
export function resetBackgroundControlsVisibility(sdk: ISdk, sourceId: string) {
  if (!isValidEventSource(sdk, sourceId)) {
    return
  }

  const expandedTile = sdk.getExpandedTiles()
  const wrapper = expandedTile.querySelector<HTMLElement>(".expanded-tile-wrapper")

  if (!wrapper) {
    return
  }

  const navigationPrevButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = wrapper.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = wrapper.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.remove("swiper-button-disabled")
  navigationPrevButton?.classList.remove("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.removeAttribute("style")
  }
}

/**
 * Checks if the source id from the event matches the active slide tile id
 * TODO - Improve this if the tile id can be repeated real time
 *
 * @param { string } sourceId - an event identifier. usually a tileId or a combinations of ids
 * @returns
 */
function isValidEventSource(sdk: ISdk, sourceId: string) {
  const activeSlideElement = getActiveSlideElement(sdk, "expanded")
  return activeSlideElement?.getAttribute("data-id") === sourceId
}

/**
 * Checks if the supplied tile element is currently active in the slide
 *
 * @param { Element } tile - tile element to check
 * @param { HTMLElement } widgetSelector - the container of the swiper element
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 * @returns true if the supplied tile element is the currently displayed element. false, otherwise.
 */
export function isActiveTile(sdk: ISdk, tile: Element, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  const tileId = tile.getAttribute("data-id")

  if (lookupAttr) {
    const originalLookupAttrValue = tile.getAttribute(lookupAttr.name)
    const activeSwiperElement = getActiveSlideElement(sdk, "expanded")
    const activeElementTileId = activeSwiperElement?.getAttribute("data-id")
    const activeElementLookupAttrValue = activeSwiperElement?.getAttribute(lookupAttr.name)
    return originalLookupAttrValue === activeElementLookupAttrValue && tileId === activeElementTileId
  }
  const tileIndex = tileId ? getSwiperIndexforTile(widgetSelector, tileId) : 0
  return getActiveSlide(sdk, "expanded") === tileIndex
}

/**
 * Triggered when expanded tile is closed
 * Destroys swiper instance for expanded tile and removes background overlay
 */
export function onTileClosed(event: CustomEvent) {
  const widgetSelectorId = event.detail.widgetSelector as string
  const sdk = window.ugc.getWidgetBySelector(widgetSelectorId).sdk as ISdk
  const expandedTile = sdk.getExpandedTiles()

  const overlay: HTMLDialogElement = expandedTile.parentElement as HTMLDialogElement
  overlay.close()
  overlay.classList.remove("expanded-tile-overlay")

  const body = document.querySelector("body")

  if (body) {
    body.style.overflow = "auto"
  }

  destroySwiper(sdk, "expanded")
}
