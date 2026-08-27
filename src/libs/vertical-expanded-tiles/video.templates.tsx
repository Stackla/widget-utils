import { getMutatedId } from "../extensions"
import { Tile, createElement, createFragment } from "../../"
import { storyAutoplayProgress } from "./expanded-swiper.loader"
import { ImageTemplate, ShopSpotTemplate } from "./tile.template"
import { EmbedYoutube } from "./embed-youtube.template"
import { ISdk } from "../../types"

type OnLoad = (event: Event) => void

function getVideoData(tile: Tile) {
  if (tile.video_files?.length) {
    return tile.video_files[0]
  }

  if (tile.video && tile.video.standard_resolution) {
    return {
      width: "auto",
      height: "auto",
      mime: "video/mp4",
      url: tile.video.standard_resolution.url
    }
  }

  console.error("Failed to find video data")

  return
}

export function handlePauseAutoplay(swiperId: string) {
  const swiperInstance = window.ugc.swiperContainer[swiperId].instance
  if (swiperInstance) {
    swiperInstance?.autoplay?.stop()
  } else {
    console.error(`Swiper instance for id ${swiperId} not found`)
  }
}

export function handlePlayAutoplay(swiperId: string) {
  const swiperInstance = window.ugc.swiperContainer[swiperId].instance
  if (swiperInstance) {
    swiperInstance?.autoplay?.start()
  } else {
    console.error(`Swiper instance for id ${swiperId} not found`)
  }
}

export function UgcVideoTemplate({
  tile,
  onLoad,
  swiperId,
  controls = true,
  autoPlay = false,
  muted = true
}: {
  tile: Tile
  onLoad: OnLoad
  swiperId: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
}) {
  const videoData = getVideoData(tile)
  if (!videoData) {
    return <></>
  }

  const { url, width, height, mime } = videoData

  return (
    <video
      style={{
        visibility: "hidden"
      }}
      muted={muted}
      autoplay={autoPlay}
      tileid={tile.id}
      class="video-content lazy"
      controls={controls}
      preload="auto"
      playsinline="playsinline"
      onPause={() => {
        handlePauseAutoplay(swiperId)
      }}
      oncanplay={(event: Event) => {
        handlePauseAutoplay(swiperId)
        onLoad(event)
      }}
      onTimeupdate={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        const swiperInstance = window.ugc.swiperContainer[swiperId].instance

        const progressAmount = 1 - videoElement.currentTime / videoElement.duration
        storyAutoplayProgress(swiperInstance, progressAmount)
      }}
      onended={() => {
        handlePlayAutoplay(swiperId)

        const swiperInstance = window.ugc.swiperContainer[swiperId].instance
        swiperInstance?.slideNext()
      }}
      onloadeddata={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        videoElement.muted = muted
        videoElement.controls = controls
      }}>
      <source src={url} width={width.toString()} height={height.toString()} type={mime} />
    </video>
  )
}

export function TikTokTemplate({
  tile,
  onLoad,
  autoPlay = false,
  muted = false
}: {
  tile: Tile
  onLoad: OnLoad
  autoPlay?: boolean
  muted?: boolean
}) {
  const tiktokId = tile.tiktok_id
  const params = new URLSearchParams({ rel: "0" })
  if (autoPlay) params.set("autoplay", "1")
  if (muted) params.set("muted", "1")

  return (
    <iframe
      style={{
        display: "none"
      }}
      id={`tiktok-frame-${tile.id}-${tiktokId}`}
      loading="lazy"
      tileid={tile.id}
      class="video-content lazy tiktok-iframe"
      frameborder="0"
      allowfullscreen
      height="100%"
      onload={onLoad}
      allow="autoplay"
      title="tiktok video"
      src={`https://www.tiktok.com/player/v1/${encodeURIComponent(String(tiktokId))}?${params.toString()}`}
    />
  )
}

// Sources whose tiles are known to carry ready-to-render `full_embed_html` —
// gates the embed branch below so a stray/unexpected value on another
// network's tile can't be treated as embeddable HTML.
const EMBED_CONTENT_SOURCES = ["instagram", "tiktok"]

export function isEmbedContentTile(tile: Tile): boolean {
  return Boolean(tile.full_embed_html) && EMBED_CONTENT_SOURCES.includes(tile.source)
}

const EMBED_SRCDOC_STYLE = `
  html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .instagram-media, .tiktok-embed { width: 100% !important; height: 100% !important; max-width: 100% !important; min-width: 0 !important; margin: 0 !important; }
`

// Renders a tile's own ready-to-render embed HTML (e.g. an Instagram
// `<blockquote>` + embed.js
export function EmbedHtmlTemplate({ tile, onLoad }: { tile: Tile; onLoad?: OnLoad }) {
  return (
    <iframe
      tileid={tile.id}
      class="video-content lazy embed-content"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      onload={onLoad}
      title={`${tile.source} video`}
      srcdoc={`<!doctype html><html><head><style>${EMBED_SRCDOC_STYLE}</style></head><body>${tile.full_embed_html}</body></html>`}
    />
  )
}

export function VideoErrorFallbackTemplate({
  tile,
  defaultHidden = true,
  sdk
}: {
  tile: Tile
  parent?: string
  defaultHidden?: boolean
  sdk: ISdk
}) {
  const originalImageUrl = tile.image
  const fallbackCss = `video-fallback-content${defaultHidden ? " hidden" : ""}`

  return (
    <div class={fallbackCss}>
      <div class="center-section">
        <div class="play-icon"></div>
      </div>
      <a class="fallback-link" href={tile.original_url || tile.original_link} target="_blank">
        <ImageTemplate sdk={sdk} image={originalImageUrl} tile={tile} />
        <div class="play-icon"></div>
      </a>
    </div>
  )
}

export function SourceVideoContent({
  tile,
  onLoad,
  swiperId,
  controls,
  autoPlay,
  muted
}: {
  tile: Tile
  onLoad: OnLoad
  swiperId: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
}) {
  // handle unplayable tiktok source
  // TODO handle video_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <TikTokTemplate tile={tile} onLoad={onLoad} autoPlay={autoPlay} muted={muted} />
  }

  if (tile.source === "youtube" && tile.youtube_id) {
    return (
      <EmbedYoutube
        tileId={tile.id}
        videoId={tile.youtube_id}
        onLoad={onLoad}
        swiperId={swiperId}
        autoPlay={autoPlay}
        muted={muted}
      />
    )
  }

  // Embed-based video tiles
  if (isEmbedContentTile(tile)) {
    return <EmbedHtmlTemplate tile={tile} onLoad={onLoad} />
  }

  if (tile.video_files?.length || (tile.video && tile.video.standard_resolution)) {
    return (
      <UgcVideoTemplate
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        tile={tile}
        onLoad={onLoad}
        swiperId={swiperId}
      />
    )
  }

  return (
    <UgcVideoTemplate
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      tile={tile}
      onLoad={onLoad}
      swiperId={swiperId}
    />
  )
}

export function VideoContainer({
  tile,
  shopspotEnabled,
  sdk,
  controls = true
}: {
  tile: Tile
  shopspotEnabled: boolean
  sdk: ISdk
  controls?: boolean
}) {
  const { auto_play_video = false, video_mute = false } = sdk.getExpandedTileConfig()
  // Embed-based tiles (rendered via EmbedHtmlTemplate, see SourceVideoContent)
  const isEmbedContent = isEmbedContentTile(tile)

  return (
    <div class="video-content-wrapper">
      <div class="center-section">
        <a href={tile.original_url} target="_blank">
          <div data-tile-id={tile.id} class="play-icon"></div>
        </a>
      </div>
      {isEmbedContent ? (
        <></>
      ) : (
        <div
          onClick={() => {
            window.location.href = tile.original_url || tile.original_link
          }}
          data-tile-id={tile.id}
          class="image-filler"
          style={{ "background-image": `url('${tile.image}')` }}></div>
      )}
      <div class="image">
        {shopspotEnabled ? <ShopSpotTemplate sdk={sdk} shopspotEnabled={shopspotEnabled} tileId={tile.id} /> : <></>}
      </div>
      <SourceVideoContent
        swiperId={getMutatedId(sdk, "expanded")}
        onLoad={(event: Event) => {
          const imageFiller = sdk.querySelector(`.image-filler[data-tile-id="${tile.id}"]`)
          if (imageFiller) {
            imageFiller.classList.add("blurred")
          }

          const arrowIcon = sdk.querySelector(`.play-icon[data-tile-id="${tile.id}"]`)
          if (arrowIcon) {
            arrowIcon.style.display = "none"
          }

          const videoElement = event.target as HTMLVideoElement
          videoElement.style.display = "inherit"
        }}
        tile={tile}
        controls={controls}
        autoPlay={auto_play_video}
        muted={video_mute}
      />
    </div>
  )
}
