import { ISdk, Tile, createElement, createFragment } from "../../../"
import { EmbedYoutube, ImageTemplate, ShopSpotTemplate } from "../../components"

declare const sdk: ISdk

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

  throw new Error("Failed to find video data")
}

export function UgcVideoTemplate({ tile, onLoad }: { tile: Tile; onLoad: OnLoad }) {
  const { url, width, height, mime } = getVideoData(tile)

  return (
    <video
      style={{
        display: "none"
      }}
      muted={true}
      tileid={tile.id}
      class="video-content"
      controls
      preload="none"
      playsinline="playsinline"
      oncanplay={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        videoElement.muted = true
        onLoad(event)
      }}>
      <source src={url} width={width.toString()} height={height.toString()} type={mime} />
    </video>
  )
}

export function TwitterTemplate({ tile, onLoad }: { tile: Tile; onLoad: OnLoad }) {
  if (!tile.video) {
    return <VideoErrorFallbackTemplate tile={tile} defaultHidden={false} />
  }

  const { standard_resolution } = tile.video

  return (
    <video
      style={{
        display: "none"
      }}
      tileid={tile.id}
      class="video-content"
      controls
      preload="none"
      playsinline="playsinline"
      oncanplay={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        videoElement.muted = true
        videoElement.style.display = "flex"
        onLoad(event)
      }}>
      <source src={standard_resolution.url} />
    </video>
  )
}

export function TikTokTemplate({ tile, onLoad }: { tile: Tile; onLoad: OnLoad }) {
  const tiktokId = tile.tiktok_id

  return (
    <iframe
      style={{
        display: "none"
      }}
      id={`tiktok-frame-${tile.id}-${tiktokId}`}
      loading="lazy"
      tileid={tile.id}
      class="video-content"
      frameborder="0"
      allowfullscreen
      height="100%"
      onload={onLoad}
      allow="autoplay" // refer https://developer.chrome.com/blog/autoplay/
      src={`https://www.tiktok.com/player/v1/${tiktokId}?rel=0`}
    />
  )
}

export function FacebookFallbackTemplate({ tile, onLoad }: { tile: Tile; onLoad: OnLoad }) {
  const embedBlock = (
    <div class="fb-content-wrapper">
      <div id="fb-root"></div>
      <script
        async
        defer
        crossorigin="anonymous"
        src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v21.0"></script>

      <div class="fb-video" data-href={tile.original_link} data-width="500" data-show-text="false">
        <blockquote cite={tile.original_link} class="fb-xfbml-parse-ignore">
          <a href={tile.original_link}></a>
          <p></p>Posted by <a href={`https://www.facebook.com/${tile.source_user_id}`}>{tile.name}</a> on
          {tile.time_ago}
        </blockquote>
      </div>
    </div>
  )
  return (
    <iframe
      style={{
        display: "none"
      }}
      onload={onLoad}
      loading="lazy"
      class="video-content"
      frameborder="0"
      allowfullscreen
      srcdoc={embedBlock.innerHTML}></iframe>
  )
}

export function VideoErrorFallbackTemplate({
  tile,
  defaultHidden = true
}: {
  tile: Tile
  parent?: string
  defaultHidden?: boolean
}) {
  const originalImageUrl = tile.image
  const fallbackCss = `video-fallback-content${defaultHidden ? " hidden" : ""}`

  return (
    <div class={fallbackCss}>
      <div class="center-section">
        <div class="play-icon"></div>
      </div>
      <a href={tile.original_url || tile.original_link} target="_blank">
        <ImageTemplate image={originalImageUrl} tile={tile} />
        <div class="play-icon"></div>
      </a>
    </div>
  )
}

export function SourceVideoContent({ tile, parent, onLoad }: { tile: Tile; parent?: string; onLoad: OnLoad }) {
  // handle unplayable tiktok source
  // TODO handle vide_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <TikTokTemplate tile={tile} onLoad={onLoad} />
  }

  if (tile.source === "youtube" && tile.youtube_id) {
    return <EmbedYoutube tileId={tile.id} videoId={tile.youtube_id} onLoad={onLoad} />
  }

  if (tile.source === "facebook") {
    const videoUrlPattern = /videos\/(\d)+?/
    if (
      (!tile.video_files?.length || !videoUrlPattern.test(tile.video_files[0].url)) &&
      !tile.video?.standard_resolution
    ) {
      return <VideoErrorFallbackTemplate tile={tile} parent={parent} defaultHidden={false} />
    } else {
      return <FacebookFallbackTemplate tile={tile} onLoad={onLoad} />
    }
  }

  if (tile.source === "twitter") {
    return <TwitterTemplate tile={tile} onLoad={onLoad} />
  }

  if (tile.video_files?.length || (tile.video && tile.video.standard_resolution)) {
    return <UgcVideoTemplate tile={tile} onLoad={onLoad} />
  }

  return <></>
}

export function VideoContainer({
  tile,
  parent,
  shopspotEnabled
}: {
  tile: Tile
  parent?: string
  shopspotEnabled: boolean
}) {
  return (
    <div class="video-content-wrapper">
      <div class="center-section">
        <div data-tile-id={tile.id} class="play-icon"></div>
      </div>
      <a href={tile.original_url} target="_blank">
        <div data-tile-id={tile.id} class="image-filler" style={{ "background-image": `url('${tile.image}')` }}></div>
      </a>
      <div class="image">
        {shopspotEnabled ? (
          <ShopSpotTemplate shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        ) : (
          <></>
        )}
      </div>
      <SourceVideoContent
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
        parent={parent}
      />
    </div>
  )
}
