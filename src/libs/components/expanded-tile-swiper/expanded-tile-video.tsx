import { type Swiper } from "swiper"
import { getTileIdFromSlide, isActiveTile } from "./expanded-swiper.loader"
import { getInstance } from "../../extensions/swiper"
import { LookupAttr } from "../../extensions/swiper/swiper.extension"
import { ISdk } from "../../../types"
import { playTiktokVideo, muteTiktokVideo, unMuteTiktokVideo, pauseTiktokVideo } from "./tiktok-message"

declare const sdk: ISdk

type YoutubeContentWindow = Window & {
  play: () => void
  pause: () => void
  reset: () => void
  mute: () => void
  unMute: () => void
}

export type YoutubeIframeElementType = HTMLIFrameElement & {
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
 * Play the video/audio attached to the slide on load where the element is a media element (video/youtube/tiktok)
 */
export async function playMediaOnLoad() {
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
export async function controlVideoPlayback(swiper: Swiper) {
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
export async function controlVideoPlaybackForStory(swiper: Swiper) {
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
export async function triggerPlay(elementData?: SwiperVideoElementData) {
  if (!elementData) {
    return
  }

  switch (elementData.source) {
    case "video": {
      const videoElement = elementData.element as HTMLVideoElement
      await videoElement.play()
      if (window.ugc.swiperContainer["expanded"]?.muted) {
        videoElement.muted = true
      } else {
        videoElement.muted = false
      }
      break
    }
    case "youtube": {
      const YoutubeContentWindow = elementData.element as YoutubeContentWindow
      await YoutubeContentWindow.play()
      if (window.ugc.swiperContainer["expanded"]?.muted) {
        YoutubeContentWindow.mute()
      } else {
        YoutubeContentWindow.unMute()
      }
      break
    }
    case "tiktok": {
      const tiktokFrameWindow = elementData.element as Window
      await playTiktokVideo(tiktokFrameWindow)
      if (window.ugc.swiperContainer["expanded"]?.muted) {
        await muteTiktokVideo(tiktokFrameWindow)
      } else {
        await unMuteTiktokVideo(tiktokFrameWindow)
      }
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
export function triggerPause(elementData?: SwiperVideoElementData) {
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
export function getSwiperVideoElement(
  swiper: Swiper,
  index: number,
  isStory = false
): SwiperVideoElementData | undefined {
  const element = swiper.slides[index]
  const tileId = getTileIdFromSlide(swiper, index)
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

  return undefined
}

/**
 * Setup onload and onerror (yt-video-error) events for youtube media
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
export function setupYoutubeEvents(tile: Element, widgetSelector: HTMLElement) {
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
export function playActiveMediaTileOnLoad(tile: Element, widgetSelector: HTMLElement, lookupAttr?: LookupAttr) {
  if (isActiveTile(tile, widgetSelector, lookupAttr)) {
    playMediaOnLoad()
  }
}

/**
 * Setup onload and onerror events for custom video source
 *
 * @param { Element } tile - the tile element
 * @param { HTMLElement } widgetSelector - the container of swiper element
 */
export function setupVideoEvents(tile: Element, widgetSelector: HTMLElement) {
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
