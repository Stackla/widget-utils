import { getMutatedId } from "../../../libs/extensions/swiper/swiper.extension"
import { ISdk, Tile, createElement, createFragment } from "../../../"
import { EmbedYoutube, ImageTemplate, ShopSpotTemplate } from "../../components"
import { storyAutoplayProgress } from "./expanded-swiper.loader"

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

export function handlePauseAutoplay(swiperId: string) {
  const swiperInstance = window.ugc.swiperContainer[swiperId].instance
  if (swiperInstance) {
    swiperInstance.autoplay.stop()
  } else {
    console.error(`Swiper instance for id ${swiperId} not found`)
  }
}

export function handlePlayAutoplay(swiperId: string) {
  const swiperInstance = window.ugc.swiperContainer[swiperId].instance
  if (swiperInstance) {
    swiperInstance.autoplay.start()
  } else {
    console.error(`Swiper instance for id ${swiperId} not found`)
  }
}

export function UgcVideoTemplate({ tile, onLoad, swiperId }: { tile: Tile; onLoad: OnLoad; swiperId: string }) {
  const { url, width, height, mime } = getVideoData(tile)

  return (
    <video
      style={{
        display: "none"
      }}
      muted={true}
      tileid={tile.id}
      class="video-content lazy"
      controls
      preload="none"
      playsinline="playsinline"
      onPause={() => {
        handlePauseAutoplay(swiperId)
      }}
      oncanplay={(event: Event) => {
        handlePauseAutoplay(swiperId)
        const videoElement = event.target as HTMLVideoElement
        videoElement.muted = true
        onLoad(event)
      }}
      onTimeupdate={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        const swiperInstance = window.ugc.swiperContainer[swiperId].instance

        const progressAmount = 1 - videoElement.currentTime / videoElement.duration
        console.log(`Video progress: ${progressAmount}`, videoElement.currentTime, videoElement.duration)

        storyAutoplayProgress(swiperInstance, progressAmount)
      }}
      onended={(event: Event) => {
        const videoElement = event.target as HTMLVideoElement
        videoElement.muted = true
        handlePlayAutoplay(swiperId)

        const swiperInstance = window.ugc.swiperContainer[swiperId].instance
        swiperInstance?.slideNext()
      }}>
      <source src={url} width={width.toString()} height={height.toString()} type={mime} />
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
      class="video-content lazy tiktok-iframe"
      frameborder="0"
      allowfullscreen
      height="100%"
      onload={onLoad}
      allow="autoplay"
      src={`https://www.tiktok.com/player/v1/${tiktokId}?rel=0`}
    />
  )
}
export function FacebookFallbackTemplate({ tile, onLoad }: { tile: Tile; onLoad: OnLoad }) {
  // Construct the embed URL for Facebook video with autoplay
  const videoEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    tile.original_link
  )}&show_text=false&autoplay=true`

  return (
    <iframe
      className="video-content lazy"
      src={videoEmbedUrl}
      onLoad={onLoad}
      loading="lazy"
      allow="autoplay; fullscreen"
      allowFullScreen
      frameBorder="0"
      style={{ width: "100%", height: "100%" }}></iframe>
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

export function SourceVideoContent({ tile, onLoad, swiperId }: { tile: Tile; onLoad: OnLoad; swiperId: string }) {
  // handle unplayable tiktok source
  // TODO handle vide_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <TikTokTemplate tile={tile} onLoad={onLoad} />
  }

  if (tile.source === "youtube" && tile.youtube_id) {
    return <EmbedYoutube tileId={tile.id} videoId={tile.youtube_id} onLoad={onLoad} swiperId={swiperId} />
  }

  if (tile.video_files?.length || (tile.video && tile.video.standard_resolution)) {
    return <UgcVideoTemplate tile={tile} onLoad={onLoad} swiperId={swiperId} />
  }

  return <UgcVideoTemplate tile={tile} onLoad={onLoad} swiperId={swiperId} />
}

export function VideoContainer({ tile, shopspotEnabled, sdk }: { tile: Tile; shopspotEnabled: boolean; sdk: ISdk }) {
  return (
    <div class="video-content-wrapper">
      <div class="center-section">
        <a href={tile.original_url} target="_blank">
          <div data-tile-id={tile.id} class="play-icon"></div>
        </a>
      </div>
      <div
        onClick={() => {
          window.location.href = tile.original_url || tile.original_link
        }}
        data-tile-id={tile.id}
        class="image-filler"
        style={{ "background-image": `url('${tile.image}')` }}></div>
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
      />
    </div>
  )
}
