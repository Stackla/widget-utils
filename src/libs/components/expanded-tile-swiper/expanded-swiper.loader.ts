import {
  destroySwiper,
  getActiveSlide,
  getActiveSlideElement,
  getInstance,
  getSwiperIndexforTile,
  initializeSwiper,
  LookupAttr,
  updateSwiperInstance
} from "../../extensions/swiper/swiper.extension"
import { waitForElm } from "../../widget.features"
import { type Swiper } from "swiper"
import { pauseTiktokVideo, playTiktokVideo } from "./tiktok-message"
import { ISdk, SwiperData } from "../../../types"
import { EVENT_LOAD_MORE } from "../../../events"
import { getExpandedSlides } from "./base.template"

declare const sdk: ISdk

type YoutubeContentWindow = Window & {
  play: () => void
  pause: () => void
  reset: () => void
}

type YoutubeIframeElementType = HTMLIFrameElement & {
  contentWindow: YoutubeContentWindow
}

type SwiperVideoElementType = Window | YoutubeContentWindow | HTMLVideoElement

type VideoSource = "video" | "youtube" | "tiktok"

type SwiperVideoElementData = {
  element: SwiperVideoElementType
  source: VideoSource
}

let tiktokDefaultPlayed = false

/**
 * Initialize/re-initialize swiper for loading expanded tiles
 *
 * @param { string } initialTileId  - id of the tile that should be displayed after loading swiper
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 */
function initializeSwiperForExpandedTiles(initialTileId: string, lookupAttr?: LookupAttr) {
  const expandedTile = sdk.querySelector("expanded-tiles")
  const expandedTileWrapper = expandedTile?.querySelector(".expanded-tile-wrapper")

  if (!expandedTile || !expandedTileWrapper) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  const isStory = expandedTileWrapper.getAttribute("variation") === "story"

  if (isStory) {
    initalizeStoryExpandedTile(initialTileId, widgetSelector, expandedTileWrapper, lookupAttr)
  } else {
    initalizeExpandedTile(initialTileId, widgetSelector, lookupAttr)
  }
}

function initalizeExpandedTile(initialTileId: string, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  initializeSwiper({
    id: "expanded",
    widgetSelector,
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
          const tileIndex = initialTileId ? getSwiperIndexforTile(widgetSelector, initialTileId, lookupAttr) : 0
          swiper.slideToLoop(tileIndex, 0, false)
        },
        autoplayTimeLeft: (swiper: Swiper, _timeLeft: number, percentage: number) => {
          storyAutoplayProgress(swiper, percentage)
        },
        navigationNext: controlVideoPlayback,
        navigationPrev: controlVideoPlayback
      }
    },
    getSliderTemplate: getExpandedSlides
  })
}

function initalizeStoryExpandedTile(
  initialTileId: string,
  widgetSelector: HTMLElement,
  expandedTileWrapper: Element,
  lookupAttr?: LookupAttr
) {
  initializeSwiper({
    id: "expanded",
    widgetSelector,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    paramsOverrides: {
      slidesPerView: "auto",
      autoHeight: true,
      autoplay: {
        delay: 5000
      },
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
      on: {
        beforeInit: (swiper: Swiper) => {
          const tileIndex = initialTileId ? getSwiperIndexforTile(widgetSelector, initialTileId, lookupAttr) : 0
          swiper.slideToLoop(tileIndex, 0, false)
        },
        reachEnd: () => {
          sdk.triggerEvent(EVENT_LOAD_MORE)
        },
        afterInit: (swiper: Swiper) => {
          registerStoryControls(expandedTileWrapper, swiper)
        },
        autoplayTimeLeft: (swiper: Swiper, _timeLeft: number, percentage: number) => {
          storyAutoplayProgress(swiper, percentage)
        },
        navigationNext: async (swiper: Swiper) => {
          await controlVideoPlaybackForStory(swiper)
        },
        navigationPrev: async (swiper: Swiper) => {
          await controlVideoPlaybackForStory(swiper)
        }
      }
    },
    getSliderTemplate: getExpandedSlides
  })
}

function storyAutoplayProgress(swiper: Swiper, progress: number) {
  const activeSlideElement = swiper.slides[swiper.realIndex]
  const progressLine = activeSlideElement.querySelector<HTMLElement>(".story-autoplay-progress > .progress-content")

  if (!progressLine) {
    return
  }

  progressLine.style.width = `${100 - Math.round(progress * 100)}%`
}

function registerStoryControls(tileWrapper: Element, swiper: Swiper) {
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
    updateSwiperInstance("expanded", (swiperData: SwiperData) => {
      swiperData.muted = false
    })
  })

  muteCtrl?.addEventListener("click", () => {
    muteCtrl.classList.add("hidden")
    volumeCtrl?.classList.remove("hidden")
    updateSwiperInstance("expanded", (swiperData: SwiperData) => {
      swiperData.muted = true
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
  swiperWrapperEle?.addEventListener("mouseover", (e: Event) => {
    const eventTarget = e.target as HTMLElement
    const panelActiveEle = eventTarget ? eventTarget.closest(".swiper-slide-active") : null
    if (panelActiveEle) {
      if (!swiper.autoplay.paused) {
        swiper.autoplay.pause()
      }
    } else {
      if (playCtrl?.classList.contains("hidden")) {
        if (swiper.autoplay.paused) {
          swiper.autoplay.resume()
        }
      }
    }
  })

  swiperWrapperEle?.addEventListener("mouseleave", () => {
    if (playCtrl?.classList.contains("hidden")) {
      if (swiper.autoplay.paused) {
        swiper.autoplay.resume()
      }
    }
  })
}

/**
 * Play the video/audio attached to the slide on load where the element is a media element (video/youtube/tiktok)
 */
async function playMediaOnLoad() {
  const swiper = getInstance("expanded")
  if (swiper) {
    const activeElementData = getSwiperVideoElement(swiper, swiper.realIndex)
    await triggerPlay(activeElementData)
  }
}

/**
 * Play/Pause the video/audio attached to the slide on navigation where the element is a media element (video/youtube/tiktok)
 * @param { Swiper } swiper - the swiper element
 */
async function controlVideoPlayback(swiper: Swiper) {
  const activeElement = getSwiperVideoElement(swiper, swiper.realIndex)
  const previousElement = getSwiperVideoElement(swiper, swiper.previousIndex)

  if (activeElement) {
    await triggerPlay(activeElement)
  }

  if (previousElement) {
    await triggerPause(previousElement)
  }
}

/**
 * For story widget
 * Play/Pause the video/audio attached to the slide on navigation where the element is a media element (video/youtube/tiktok)
 * @param { Swiper } swiper - the swiper element
 */
async function controlVideoPlaybackForStory(swiper: Swiper) {
  const activeElement = getSwiperVideoElement(swiper, swiper.realIndex, true)
  const previousElement = getSwiperVideoElement(swiper, swiper.previousIndex, true)

  if (activeElement) {
    await triggerPlay(activeElement)
  }

  if (previousElement) {
    await triggerPause(previousElement)
  }
}

/**
 * Trigger media play for different media element sources ("video", "youtube", "tiktok")
 *
 * @param elementData - the media container element and the source
 * @param elementData.element - the container element of the media (video tag or iframe.contentWindow)
 * @param elementData.source - the media source (video for custom video source, youtube/tiktok)
 */
async function triggerPlay(elementData?: SwiperVideoElementData) {
  if (!elementData) {
    return
  }

  switch (elementData.source) {
    case "video": {
      const videoElement = elementData.element as HTMLVideoElement
      await videoElement.play()
      break
    }
    case "youtube": {
      const YoutubeContentWindow = elementData.element as YoutubeContentWindow
      await YoutubeContentWindow.play()
      break
    }
    case "tiktok": {
      const tiktokFrameWindow = elementData.element as Window
      await playTiktokVideo(tiktokFrameWindow)
      break
    }
    default:
      throw new Error(`unsupported video source ${elementData.source}`)
  }
}

/**
 * Trigger media pause for different element sources ("video", "youtube", "tiktok")
 *
 * @param elementData - the media container element and the source
 * @param elementData.element - the container element of the media (video tag or iframe.contentWindow)
 * @param elementData.source - the media source (video for custom video source, youtube/tiktok)
 */
function triggerPause(elementData?: SwiperVideoElementData) {
  if (!elementData) {
    throw new Error("elementData is required")
  }

  switch (elementData.source) {
    case "video": {
      const videoElement = elementData.element as HTMLVideoElement
      videoElement.pause()
      videoElement.currentTime = 0
      break
    }
    case "youtube": {
      const YoutubeContentWindow = elementData.element as YoutubeContentWindow
      YoutubeContentWindow.pause()
      YoutubeContentWindow.reset()
      break
    }
    case "tiktok": {
      const tiktokFrameWindow = elementData.element as Window
      pauseTiktokVideo(tiktokFrameWindow)
      break
    }
    default:
      throw new Error(`unsupported video source ${elementData.source}`)
  }
}

/**
 * Get swiper video/audio element at the provided index.
 *
 * @param { Swiper } swiper - the swiper element
 * @param { number } index - index of the slide to be returned
 * @param { number } isStory - if it is story widget
 * @returns the video/iframe element or undefined if the element at index is not a video/audio
 */
function getSwiperVideoElement(swiper: Swiper, index: number, isStory = false): SwiperVideoElementData | undefined {
  const element = swiper.slides[index]
  const tileId = element.getAttribute("data-id")
  const youtubeId = element.getAttribute("data-yt-id")

  if (!tileId) {
    throw new Error(`Failed to find tile id for the slide at index ${index}`)
  }

  const media = sdk.tiles.tiles[tileId].media

  if (media !== "video" && media !== "short") {
    return undefined
  }

  if (youtubeId) {
    const youtubeFrame = element.querySelector<YoutubeIframeElementType>(`iframe#yt-frame-${tileId}-${youtubeId}`)
    if (youtubeFrame) {
      return { element: youtubeFrame.contentWindow, source: "youtube" }
    }
  }

  const tiktokId = element.getAttribute("data-tiktok-id")

  if (tiktokId) {
    const tiktokFrame = element.querySelector<HTMLIFrameElement>(`iframe#tiktok-frame-${tileId}-${tiktokId}`)
    if (tiktokFrame && tiktokFrame.contentWindow) {
      return { element: tiktokFrame.contentWindow, source: "tiktok" }
    }
  }

  const videoElement = element.querySelector<HTMLVideoElement>(
    `${isStory ? "" : " .panel .panel-left"} .video-content-wrapper video`
  )

  if (videoElement) {
    return { element: videoElement, source: "video" }
  }

  throw new Error(`Failed to find video element for tile ${tileId} ${sdk.tiles.tiles[tileId].media}`)
}

/**
 * Triggered when an inline tile is clicked
 * Adds background overlay for expanded tile and initializes swiper for expanded tile
 *
 * @param { string } tileId - the id of clicked inline tile and the tile that will be displayed on expanded tile load
 */
export function onTileExpand(tileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile) {
    throw new Error("The expanded tile element not found")
  }

  const body = document.querySelector("body")

  if (body) {
    body.style.overflow = "hidden"
  }

  expandedTile.parentElement!.classList.add("expanded-tile-overlay")

  waitForElm(expandedTile, [".swiper-expanded"], () => {
    const tileElement = expandedTile.shadowRoot?.querySelector(`.swiper-slide[data-id="${tileId}"]`)
    const youtubeId = tileElement?.getAttribute("data-yt-id")
    const tiktokId = tileElement?.getAttribute("data-tiktok-id")
    if (youtubeId) {
      const lookupYtAttr: LookupAttr = { name: "data-yt-id", value: youtubeId }
      initializeSwiperForExpandedTiles(tileId, lookupYtAttr)
    } else if (tiktokId) {
      const lookupTiktokAttr: LookupAttr = { name: "data-tiktok-id", value: tiktokId }
      initializeSwiperForExpandedTiles(tileId, lookupTiktokAttr)
    } else {
      initializeSwiperForExpandedTiles(tileId)
    }
  })
}

/**
 * Triggered after all slides in expanded tiles are loaded
 * Setup onload and onerror events for media sources (video/youtube/tiktok)
 */
export function onTileRendered() {
  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  if (!expandedTilesElement) {
    throw new Error("Expanded tiles element not found")
  }

  const tiles = expandedTilesElement.querySelectorAll(".swiper-slide")

  const widgetSelector = expandedTilesElement.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Widget selector for expanded tile (swiper-expanded) is not found")
  }

  setupTikTokPlayerReadyEvent()

  tiles?.forEach(tile => {
    setupVideoEvents(tile, widgetSelector)
    setupYoutubeEvents(tile, widgetSelector)
  })
}

/**
 * Reduces visibility of swiper controls when share menu is opened
 */
export function reduceBackgroundControlsVisibility(sourceId: string) {
  if (!isValidEventSource(sourceId)) {
    return
  }

  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  const wrapper = expandedTilesElement.querySelector<HTMLElement>(".expanded-tile-wrapper")

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
export function resetBackgroundControlsVisibility(sourceId: string) {
  if (!isValidEventSource(sourceId)) {
    return
  }

  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  const wrapper = expandedTilesElement.querySelector<HTMLElement>(".expanded-tile-wrapper")

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
function isValidEventSource(sourceId: string) {
  const activeSlideElement = getActiveSlideElement("expanded")
  return activeSlideElement?.getAttribute("data-id") === sourceId
}

/**
 * Setup onload and onerror events for custom video source
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
function setupVideoEvents(tile: Element, widgetSelector: HTMLElement) {
  const videoSourceElement = tile.querySelector<HTMLVideoElement>("video.video-content > source")
  if (videoSourceElement) {
    videoSourceElement.addEventListener("load", () => {
      playActiveMediaTileOnLoad(tile, widgetSelector)
    })
    videoSourceElement.addEventListener("error", () => {
      videoSourceElement.closest(".video-content-wrapper")?.classList.add("hidden")
      tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
    })
  }
}

/**
 * Setup onload and onerror (yt-video-error) events for youtube media
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
function setupYoutubeEvents(tile: Element, widgetSelector: HTMLElement) {
  const tileId = tile.getAttribute("data-id")
  const youtubeId = tile.getAttribute("data-yt-id")

  if (youtubeId && tileId) {
    const youtubeFrame = tile.querySelector<HTMLIFrameElement>(`iframe#yt-frame-${tileId}-${youtubeId}`)
    youtubeFrame?.addEventListener("load", () => {
      playActiveMediaTileOnLoad(tile, widgetSelector, { name: "data-yt-id", value: youtubeId })
    })
    youtubeFrame?.addEventListener("yt-video-error", () => {
      youtubeFrame.closest(".video-content-wrapper")?.classList.add("hidden")
      tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
    })
  }
}

/**
 * Setup tiktok player events using window.postMessage api
 * All media are paused by defult and only the media in the active slide is played
 */
export function setupTikTokPlayerReadyEvent() {
  tiktokDefaultPlayed = false
  window.onmessage = (
    event: MessageEvent<{
      type: string
      value?: number
      "x-tiktok-player": boolean
    }>
  ) => {
    if (event.data["x-tiktok-player"] && event.data.type === "onPlayerReady") {
      const frameWindow = event.source as Window
      pauseTiktokVideo(frameWindow)

      if (!tiktokDefaultPlayed) {
        tiktokDefaultPlayed = true
        setTimeout(() => playMediaOnLoad(), 300)
      }
    }
  }
}

/**
 * Play media associated with currently active tile
 *
 * @param { Element } tile - tile element to check
 * @param { HTMLElement } widgetSelector - the container of the swiper element
 * @param { LookupAttr } lookupAttr - additional attribute lookup options for finding the first slide to load
 * @param { LookupAttr.name } lookupAttr.name - name of the attribute for e.g. data-yt-id or data-tiktok-id
 * @param { LookupAttr.value } lookupAttr.value - required value of the attribute
 */
function playActiveMediaTileOnLoad(tile: Element, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  if (isActiveTile(tile, widgetSelector, lookupAttr)) {
    playMediaOnLoad()
  }
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
function isActiveTile(tile: Element, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  const tileId = tile.getAttribute("data-id")

  if (lookupAttr) {
    const originalLookupAttrValue = tile.getAttribute(lookupAttr.name)
    const activeSwiperElement = getActiveSlideElement("expanded")
    const activeElementTileId = activeSwiperElement?.getAttribute("data-id")
    const activeElementLookupAttrValue = activeSwiperElement?.getAttribute(lookupAttr.name)
    return originalLookupAttrValue === activeElementLookupAttrValue && tileId === activeElementTileId
  }
  const tileIndex = tileId ? getSwiperIndexforTile(widgetSelector, tileId, lookupAttr) : 0
  return getActiveSlide("expanded") === tileIndex
}

/**
 * Triggered when expanded tile is closed
 * Destroys swiper instance for expanded tile and removes background overlay
 */
export function onTileClosed() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.remove("expanded-tile-overlay")

  const body = document.querySelector("body")

  if (body) {
    body.style.overflow = "auto"
  }

  destroySwiper("expanded")
}
