import { createElement } from "../../"
import { mountYoutubePlayer } from "./youtube-player"

export type EmbedYoutubeProps = {
  tileId: string
  videoId: string
  onLoad?: (event: Event) => void
  swiperId: string
}

export function EmbedYoutube({ tileId, videoId, onLoad, swiperId }: EmbedYoutubeProps) {
  const hostId = `yt-frame-${tileId}-${videoId}`

  const scheduleMount = (host: HTMLElement) => {
    const start = async () => {
      try {
        await mountYoutubePlayer({ host, tileId, videoId, swiperId })
        const event = new Event("load")
        host.dispatchEvent(event)
        onLoad?.(event)
      } catch (error) {
        console.error("Failed to mount YouTube player", error)
      }
    }

    if (host.isConnected) {
      void start()
      return
    }

    // The JSX `ref` callback fires synchronously during element creation,
    // before the caller appends the node. Wait until the host is in the DOM
    // because YT.Player requires it (it calls document.getElementById).
    const observer = new MutationObserver(() => {
      if (host.isConnected) {
        observer.disconnect()
        void start()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  return (
    <div
      id={hostId}
      data-tile-id={tileId}
      data-video-id={videoId}
      data-swiper-id={swiperId}
      class="video-content yt-player-host"
      title="YouTube video player"
      aria-label="YouTube video player"
      ref={scheduleMount}
    />
  )
}
