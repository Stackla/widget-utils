import { whenYTReady, type YTPlayerInstance } from "./youtube-api-loader"

export interface YoutubePlayerHandle {
  play(): void
  pause(): void
  isPaused(): boolean
  mute(): void
  unMute(): void
  destroy(): void
}

export interface MountYoutubePlayerParams {
  host: HTMLElement
  tileId: string
  videoId: string
  swiperId: string
  autoPlay?: boolean
  muted?: boolean
}

export async function mountYoutubePlayer(params: MountYoutubePlayerParams): Promise<YoutubePlayerHandle> {
  const { host, videoId, swiperId, autoPlay = true, muted = false } = params
  const hostId = host.id
  const hostClassName = host.className

  // Defensive against re-mounts on the same host id (e.g. EmbedYoutube
  // re-rendering for the same tile). Tear down the prior handle first.
  const existing = window.ugc.youtubePlayers?.[hostId]
  if (existing) existing.destroy()

  const YT = await whenYTReady()

  return new Promise<YoutubePlayerHandle>((resolve, reject) => {
    let observer: IntersectionObserver | undefined
    let destroyed = false
    let player: YTPlayerInstance

    const onReady = () => {
      // YT.Player replaces the host div with a new iframe and does not copy
      // the host's id/class. Restore them so existing selectors keep working
      // and event delegation can match the right tile.
      const iframe = player.getIframe()
      iframe.id = hostId
      iframe.className = hostClassName
      iframe.dispatchEvent(new Event("load", { bubbles: true }))

      if (muted) player.mute()
      if (autoPlay) observer = createVisibilityObserver(iframe)
      const handle: YoutubePlayerHandle = {
        play: () => player.playVideo(),
        pause: () => player.pauseVideo(),
        isPaused: () => {
          const state = player.getPlayerState()
          return state === YT.PlayerState.PAUSED || state === YT.PlayerState.UNSTARTED || state === YT.PlayerState.CUED
        },
        mute: () => player.mute(),
        unMute: () => player.unMute(),
        destroy: () => {
          if (destroyed) return
          destroyed = true
          observer?.disconnect()
          if (window.ugc.youtubePlayers?.[hostId] === handle) {
            delete window.ugc.youtubePlayers[hostId]
          }
          player.destroy()
        }
      }
      if (!autoPlay) handle.pause()
      window.ugc.youtubePlayers ??= {}
      window.ugc.youtubePlayers[hostId] = handle
      resolve(handle)
    }

    const onStateChange = (event: { data: number }) => {
      const swiperInstance = window.ugc.swiperContainer?.[swiperId]?.instance
      swiperInstance?.autoplay?.stop()

      const tile = player.getIframe().closest(".ugc-tile")
      const pauseButton = tile?.querySelector(".pause-video")
      const playButton = tile?.querySelector(".play-video")

      switch (event.data) {
        case YT.PlayerState.PLAYING:
          pauseButton?.classList.remove("hidden")
          playButton?.classList.add("hidden")
          break
        case YT.PlayerState.PAUSED:
          pauseButton?.classList.add("hidden")
          playButton?.classList.remove("hidden")
          break
        case YT.PlayerState.ENDED:
          swiperInstance?.autoplay?.start()
          swiperInstance?.slideNext()
          break
      }
    }

    const onError = (event: { data: number }) => {
      player.getIframe().dispatchEvent(new CustomEvent("yt-video-error", { detail: event, bubbles: true }))
    }

    const createVisibilityObserver = (target: HTMLIFrameElement) => {
      const obs = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              player.playVideo()
            } else {
              player.pauseVideo()
              window.ugc.swiperContainer?.[swiperId]?.instance?.autoplay?.start()
            }
          })
        },
        { threshold: 0.5 }
      )
      obs.observe(target)
      return obs
    }

    try {
      player = new YT.Player(host, {
        width: "100%",
        height: "100%",
        videoId,
        playerVars: { autoplay: autoPlay ? 1 : 0, controls: 1, rel: 0, playsinline: 1 },
        events: { onReady, onStateChange, onError }
      })
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  })
}
