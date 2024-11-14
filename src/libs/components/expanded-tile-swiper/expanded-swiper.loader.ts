import {
  destroySwiper,
  getActiveSlide,
  getInstance,
  getSwiperIndexforTile,
  initializeSwiper
} from "../../extensions/swiper/swiper.extension"
import { waitForElm } from "../../widget.features"
import { registerExpandedTileShareMenuListeners } from "../../templates/share-menu/share-menu.listener"
import { SdkSwiper } from "../../../types/SdkSwiper"
import Swiper from "swiper"

declare const sdk: SdkSwiper

type YoutubeIframeElement = HTMLIFrameElement & {
  contentWindow: {
    play: () => void
    pause: () => void
    reset: () => void
  }
}

function initializeSwiperForExpandedTiles(initialTileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")
  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.shadowRoot.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  sdk.tiles.setVisibleTilesCount(2)

  initializeSwiper({
    id: "expanded",
    widgetSelector,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    paramsOverrides: {
      slidesPerView: 1,
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      on: {
        beforeInit: (swiper: Swiper) => {
          const tileIndex = initialTileId ? getSwiperIndexforTile(widgetSelector, initialTileId) : 0
          swiper.slideToLoop(tileIndex, 0, false)
        },
        navigationNext: controlVideoPlayback,
        navigationPrev: controlVideoPlayback
      }
    }
  })
}

function controlOnLoadPlayback() {
  const swiper = getInstance("expanded")
  if (swiper) {
    const activeElement = getSwiperVideoElement(swiper, swiper.realIndex)
    activeElement?.play()
  }
}

function controlVideoPlayback(swiper: Swiper) {
  const activeElement = getSwiperVideoElement(swiper, swiper.realIndex)
  const previousElement = getSwiperVideoElement(swiper, swiper.previousIndex)

  activeElement?.play()

  if (previousElement) {
    previousElement.pause()
    if ("currentTime" in previousElement) {
      previousElement.currentTime = 0
    }
    if ("reset" in previousElement) {
      previousElement.reset()
    }
  }
}

function getSwiperVideoElement(swiper: Swiper, index: number) {
  const element = swiper.slides[index]
  const youtubeId = element.getAttribute("data-yt-id")

  if (youtubeId) {
    const tileId = element.getAttribute("data-id")
    const youtubeFrame = element.querySelector<YoutubeIframeElement>(`iframe#yt-frame-${tileId}-${youtubeId}`)
    return youtubeFrame?.contentWindow
  }

  return element.querySelector<HTMLVideoElement>(".panel .panel-left .video-content-wrapper video")
}

export function onTileExpand(tileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.add("expanded-tile-overlay")

  waitForElm(expandedTile.shadowRoot, [".swiper-expanded"], () => initializeSwiperForExpandedTiles(tileId))
}

export function onTileRendered() {
  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  if (!expandedTilesElement || !expandedTilesElement.shadowRoot) {
    throw new Error("Expanded tiles element not found")
  }

  const tiles = expandedTilesElement.shadowRoot.querySelectorAll(".swiper-slide")

  const widgetSelector = expandedTilesElement.shadowRoot.querySelector<HTMLElement>(".swiper-expanded")

  tiles?.forEach(tile => {
    const tileId = tile.getAttribute("data-id")
    const shareButton = tile.querySelector<HTMLElement>(".panel-right .share-button")
    if (!shareButton) {
      throw new Error(`Share button not found in expanded tile ${tileId}`)
    }
    registerExpandedTileShareMenuListeners(expandedTilesElement, shareButton, tile)

    const videoSourceElement = tile.querySelector<HTMLVideoElement>("video.video-content > source")
    if (videoSourceElement) {
      videoSourceElement.addEventListener("error", () => {
        videoSourceElement.closest(".video-content-wrapper")?.classList.add("hidden")
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
      })
    }

    const youtubeId = tile.getAttribute("data-yt-id")

    if (youtubeId) {
      const youtubeFrame = tile.querySelector<HTMLIFrameElement>(`iframe#yt-frame-${tileId}-${youtubeId}`)
      youtubeFrame?.addEventListener("load", () => {
        const tileIndex = tileId ? getSwiperIndexforTile(widgetSelector!, tileId) : 0
        if (getActiveSlide("expanded") === tileIndex) {
          controlOnLoadPlayback()
        }
      })
      youtubeFrame?.addEventListener("yt-video-error", () => {
        youtubeFrame.closest(".video-content-wrapper")?.classList.add("hidden")
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
      })
    }
  })
}

export function onTileClosed() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.remove("expanded-tile-overlay")

  destroySwiper("expanded")
}
