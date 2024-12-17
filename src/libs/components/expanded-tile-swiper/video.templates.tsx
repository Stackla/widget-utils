import { EmbedYoutube, ImageTemplate, Tile, createElement } from "../../../"

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

export function UgcVideoTemplate({ tile }: { tile: Tile }) {
  const { url, width, height, mime } = getVideoData(tile)

  return (
    <video
      muted={true}
      tileid={tile.id}
      class="video-content"
      controls
      preload="none"
      playsinline="playsinline"
      oncanplay="this.muted=true">
      <source src={url} width={width.toString()} height={height.toString()} type={mime} />
    </video>
  )
}

export function TwitterTemplate({ tile }: { tile: Tile }) {
  const { standard_resolution } = tile.video

  return (
    <video
      tileid={tile.id}
      class="video-content"
      controls
      preload="none"
      playsinline="playsinline"
      oncanplay="this.muted=true">
      <source src={standard_resolution.url} />
    </video>
  )
}

export function TikTokTemplate({ tile }: { tile: Tile }) {
  const tiktokId = tile.tiktok_id

  return (
    <iframe
      id={`tiktok-frame-${tile.id}-${tiktokId}`}
      loading="lazy"
      class="video-content"
      frameborder="0"
      allowfullscreen
      height="100%"
      allow="autoplay" // refer https://developer.chrome.com/blog/autoplay/
      src={`https://www.tiktok.com/player/v1/${tiktokId}?rel=0`}
    />
  )
}

export function FacebookFallbackTemplate({ tile }: { tile: Tile }) {
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
          <p></p>Posted by <a href={`https://www.facebook.com/$${tile.source_user_id}`}>{tile.name}</a> on
          {tile.time_ago}
        </blockquote>
      </div>
    </div>
  )
  return (
    <iframe loading="lazy" class="video-content" frameborder="0" allowfullscreen srcdoc={embedBlock.innerHTML}></iframe>
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
  const originalImageUrl = tile.original_image_url as string
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

export function SourceVideoContent({ tile, parent }: { tile: Tile; parent?: string }) {
  // handle unplayable tiktok source
  // TODO handle vide_source "tiktok"
  if (tile.source === "tiktok" || tile.video_source === "tiktok") {
    return <TikTokTemplate tile={tile} />
  }

  if (tile.source === "youtube" && tile.youtube_id) {
    return <EmbedYoutube tileId={tile.id} videoId={tile.youtube_id} />
  }

  if (tile.source === "facebook") {
    const videoUrlPattern = /videos\/(\d)+?/
    if (!tile.video_files?.length || !videoUrlPattern.test(tile.video_files[0].url)) {
      return <VideoErrorFallbackTemplate tile={tile} parent={parent} defaultHidden={false} />
    }
  }

  if (tile.source === "twitter") {
    return <TwitterTemplate tile={tile} />
  }

  if (tile.video_files?.length || (tile.video && tile.video.standard_resolution)) {
    return <UgcVideoTemplate tile={tile} />
  }

  return <FacebookFallbackTemplate tile={tile} />
}

export function VideoContainer({ tile, parent }: { tile: Tile; parent?: string }) {
  return (
    <div class="video-content-wrapper">
      <div class="image-filler" style={{ "background-image": `url('${tile.original_image_url}')` }}></div>
      <SourceVideoContent tile={tile} parent={parent} />
    </div>
  )
}
