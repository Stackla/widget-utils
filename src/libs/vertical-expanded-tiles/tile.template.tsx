import { ISdk, Tile, type SwiperType } from "@app/types"
import { createElement, createFragment } from "../jsx-html"
import { VideoContainer, VideoErrorFallbackTemplate, isEmbedContentTile } from "./video.templates"
import { getInstance } from "../extensions"
import { getSwiperVideoElement, triggerPlay, triggerPause } from "./expanded-tile-video"
import { isTiktokPaused } from "./tiktok-message"

export type ExpandedTileProps = {
  tile: Tile
  sdk: ISdk
}

export type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
  sdk: ISdk
}

export type ContentWrapperProps = {
  id: string
  parent?: string
  sdk: ISdk
}

export async function togglePlayPause(sdk: ISdk) {
  const swiper = getInstance(sdk, "expanded") as SwiperType
  if (!swiper) return

  const expandedTiles = sdk.getExpandedTiles()
  const activeSlide = expandedTiles.querySelector(".ugc-tile.swiper-slide-active")
  const pauseButton = activeSlide?.querySelector(".pause-video")
  const playButton = activeSlide?.querySelector(".play-video")

  const elementData = getSwiperVideoElement(sdk, swiper, swiper.realIndex)
  if (!elementData) {
    console.warn("Can't find the video element")
    return
  }

  let paused: boolean
  if (elementData.source === "video") {
    paused = (elementData.element as HTMLVideoElement).paused
  } else if (elementData.source === "youtube") {
    const ytPlayer = window.ugc.youtubePlayers?.[(elementData.element as HTMLElement).id]
    paused = ytPlayer?.isPaused() ?? true
  } else if (elementData.source === "tiktok") {
    paused = isTiktokPaused(elementData.element as Window)
  } else {
    return
  }

  if (paused) {
    triggerPlay(sdk, elementData)
    pauseButton?.classList.remove("hidden")
    playButton?.classList.add("hidden")
  } else {
    triggerPause(elementData, false)
    pauseButton?.classList.add("hidden")
    playButton?.classList.remove("hidden")
  }
}

export function StoryControls({ video, tile, sdk }: { video: boolean; tile: Tile; sdk: ISdk }) {
  const { auto_play_video = false } = sdk.getExpandedTileConfig()
  // Embed-based tiles (e.g. Instagram) render entirely inside their own iframe, whose
  // playback isn't wired up to togglePlayPause — keep the story play/pause controls hidden.
  const isEmbedContent = isEmbedContentTile(tile)

  return (
    <div class="story-controls">
      {video ? (
        <>
          <a
            class={`icon-story-video-pause pause-video${!isEmbedContent && auto_play_video ? "" : " hidden"}`}
            onClick={() => togglePlayPause(sdk)}
          />
          <a
            class={`icon-story-video-play play-video${!isEmbedContent && !auto_play_video ? "" : " hidden"}`}
            onClick={() => togglePlayPause(sdk)}
          />
        </>
      ) : (
        <></>
      )}
      <a class="exit widget-icon close-cross" href="javascript:void(0);"></a>
    </div>
  )
}

export function VerticalExpandedTile({ tile, sdk }: ExpandedTileProps) {
  const { show_shopspots, show_products, show_timestamp } = sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length

  let productsEnabled = false

  if (sdk.isComponentLoaded("products") && show_products && sdk.getProductTagsFromTile(tile)?.length) {
    productsEnabled = true
  }

  const sharingToolsEnabled = false

  return (
    <>
      <div class="panel-active">
        <div class="overlay"></div>
        <AutoplayProgress />
        <tile-content
          widgetId={sdk.getWidgetId()}
          tileId={tile.id}
          render-share-menu={sharingToolsEnabled}
          render-description="false"
          render-caption="false"
          mode="custom"
          render-timephrase={show_timestamp}
          render-header-timephrase="true"
          render-products-icon={productsEnabled}
        />
        <IconSection tile={tile} sdk={sdk} />
        <div class="image-wrapper">
          <div class="image-wrapper-inner">
            {tile.media === "video" ? (
              <StoryControls sdk={sdk} tile={tile} video={true} />
            ) : (
              <StoryControls sdk={sdk} tile={tile} video={false} />
            )}

            {tile.media === "video" ? (
              <>
                <VideoContainer controls={false} shopspotEnabled={shopspotEnabled} tile={tile} sdk={sdk} />
                <VideoErrorFallbackTemplate sdk={sdk} tile={tile} />
              </>
            ) : tile.media === "image" ? (
              <ImageTemplate sdk={sdk} tile={tile} image={tile.image} shopspotEnabled={shopspotEnabled} />
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
    </>
  )
}

export function IconSection({ tile, sdk }: { tile: Tile; sdk: ISdk }) {
  const parent = sdk.getNodeId()
  const bottomSectionIconContent = []

  bottomSectionIconContent.push(
    <inline-products
      navigation-arrows={"true"}
      parent={parent}
      tile-id={tile.id}
      mode={"swiper"}
      context={"story-expanded"}
      widgetId={sdk.getWidgetId()}
    />
  )

  return (
    <div class="icon-section">
      <div class="bottom-section">{...bottomSectionIconContent}</div>
    </div>
  )
}

export function ShopSpotTemplate({ sdk, shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon
        widgetId={sdk.getWidgetId()}
        parent={parent}
        mode="expanded"
        tile-id={tileId}
        show-tooltip="false"
      />
    </>
  ) : (
    <></>
  )
}

export function ImageTemplate({
  tile,
  image,
  shopspotEnabled = false,
  parent,
  sdk
}: {
  tile: Tile
  image: string
  shopspotEnabled?: boolean
  parent?: string
  sdk: ISdk
}) {
  return image ? (
    <>
      <div class="image-filler" style={{ "background-image": `url('${image}')` }}></div>
      <div class="image">
        {shopspotEnabled ? (
          <ShopSpotTemplate sdk={sdk} shopspotEnabled={shopspotEnabled} parent={parent} tileId={tile.id} />
        ) : (
          <></>
        )}
      </div>
    </>
  ) : (
    <></>
  )
}

function AutoplayProgress() {
  return (
    <div class="story-progress-wrapper">
      <div class="story-autoplay-progress">
        <div class="progress-content"></div>
      </div>
    </div>
  )
}
