export interface YTPlayerInstance {
  playVideo(): void
  pauseVideo(): void
  mute(): void
  unMute(): void
  destroy(): void
  getIframe(): HTMLIFrameElement
  getPlayerState(): number
}

export interface YTPlayerOptions {
  width?: string | number
  height?: string | number
  videoId?: string
  playerVars?: Record<string, string | number>
  events?: {
    onReady?: (event: { target: YTPlayerInstance }) => void
    onStateChange?: (event: { target: YTPlayerInstance; data: number }) => void
    onError?: (event: { target: YTPlayerInstance; data: number }) => void
  }
}

export interface YTNamespace {
  Player: new (host: HTMLElement | string, opts: YTPlayerOptions) => YTPlayerInstance
  PlayerState: {
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
    UNSTARTED: number
  }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

const IFRAME_API_SRC = "https://www.youtube.com/iframe_api"

let readyPromise: Promise<YTNamespace> | null = null

export function whenYTReady(): Promise<YTNamespace> {
  if (readyPromise) return readyPromise

  readyPromise = new Promise<YTNamespace>(resolve => {
    if (window.YT?.Player) {
      resolve(window.YT)
      return
    }

    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
    }

    if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
      const tag = document.createElement("script")
      tag.src = IFRAME_API_SRC
      tag.async = true
      document.head.appendChild(tag)
    }
  })

  return readyPromise
}
