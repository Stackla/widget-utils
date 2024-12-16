import type { ISdk } from "../../../"
import { Tile } from "../../../"
import { createElement, createFragment } from "../../"
import { EmbedYoutube } from "./embed-youtube.template"

export type ExpandedTileProps = {
  sdk: ISdk
  tile: Tile
}

type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
}

export function ExpandedTile({ sdk, tile }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_tags, show_sharing, show_caption, show_timestamp } =
    sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length
  const productsEnabled = sdk.isComponentLoaded("products") && show_products && !!tile.tags_extended?.length
  const tagsEnabled = show_tags
  const sharingToolsEnabled = show_sharing

  const parent = sdk.getNodeId()

  return (
    <>
      <div class="panel">
        <div class="panel-left">
          <IconSection tile={tile} productsEnabled={productsEnabled} />
          <div class="image-wrapper">
            <div class="image-wrapper-inner">
              {tile.media === "video" ? (
                <>
                  <VideoContainer tile={tile} parent={parent} />
                  <VideoErrorFallbackTemplate tile={tile} />
                </>
              ) : tile.media === "image" ? (
                <ImageTemplate tile={tile} image={tile.image} shopspotEnabled={shopspotEnabled} parent={parent} />
              ) : tile.media === "text" ? (
                <span class="content-text">{tile.message}</span>
              ) : tile.media === "html" ? (
                <span class="content-html">{tile.html}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div class="panel-right">
          <div class="panel-right-wrapper">
            <div class="content-wrapper">
              <div class="content-inner-wrapper">
                <tile-content
                  tileId={tile.id}
                  render-share-menu={sharingToolsEnabled}
                  render-caption={show_caption}
                  render-timephrase={show_timestamp}
                />
                {tagsEnabled && (
                  <tile-tags tile-id={tile.id} mode="swiper" context="expanded" navigation-arrows="true" />
                )}
                {productsEnabled && (
                  <>
                    <ugc-products parent={parent} tile-id={tile.id} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function IconSection({ tile, productsEnabled }: { tile: Tile; productsEnabled: boolean }) {
  const topSectionIconContent = []
  const bottomSectionIconContent = []

  if (tile.attrs.includes("instagram.reel")) {
    topSectionIconContent.push(<div class="content-icon icon-reel"></div>)
  } else if (tile.attrs.includes("youtube.short")) {
    topSectionIconContent.push(<div class="content-icon icon-youtube-short"></div>)
  }
  if (productsEnabled) {
    topSectionIconContent.push(<div class="shopping-icon icon-products"></div>)
  }

  bottomSectionIconContent.push(<div class={`network-icon icon-${tile.source}`}></div>)

  return (
    <div class="icon-section">
      <div class="top-section">{...topSectionIconContent}</div>
      <div class="bottom-section">{...bottomSectionIconContent}</div>
    </div>
  )
}

function ShopSpotTemplate({ shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon parent={parent} mode="expanded" tile-id={tileId} />
    </>
  ) : (
    <></>
  )
}

function ImageTemplate({
  tile,
  image,
  shopspotEnabled = false,
  parent
}: {
  tile: Tile
  image: string
  shopspotEnabled?: boolean
  parent?: string
}) {
  return image ? (
    <>
      <div class="image-filler" style={{ "background-image": `url('${image}')` }}></div>
      <div class="image">
        {shopspotEnabled ? (
          <ShopSpotTemplate shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        ) : (
          <></>
        )}
        <img class="image-element" src={image} loading="lazy" alt={tile.description || "Image"} />
      </div>
    </>
  ) : (
    <></>
  )
}

function VideoContainer({ tile, parent }: { tile: Tile; parent?: string }) {
  return (
    <div class="video-content-wrapper">
      <div class="image-filler" style={{ "background-image": `url('${tile.original_image_url}')` }}></div>
      <SourceVideoContent tile={tile} parent={parent} />
    </div>
  )
}

function SourceVideoContent({ tile, parent }: { tile: Tile; parent?: string }) {
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

function UgcVideoTemplate({ tile }: { tile: Tile }) {
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

function TwitterTemplate({ tile }: { tile: Tile }) {
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

function TikTokTemplate({ tile }: { tile: Tile }) {
  const tiktokId = tile.tiktok_id

  return (
    <iframe
      id={`tiktok-frame-${tile.id}-${tiktokId}`}
      loading="lazy"
      class="video-content"
      frameborder="0"
      allowfullscreen
      allow="autoplay" // refer https://developer.chrome.com/blog/autoplay/
      src={`https://www.tiktok.com/player/v1/${tiktokId}?rel=0`}
    />
  )
}

function FacebookFallbackTemplate({ tile }: { tile: Tile }) {
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

function VideoErrorFallbackTemplate({
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
