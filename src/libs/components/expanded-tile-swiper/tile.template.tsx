import { Tile } from "../../../"
import { createElement, createFragment } from "../../"
import { VideoContainer, VideoErrorFallbackTemplate } from "./video.templates"
import { ExpandedTileProps, ShopspotProps } from "./types"

export function ExpandedTile({ sdk, tile }: ExpandedTileProps) {
  const {
    show_shopspots,
    show_products,
    show_tags,
    show_sharing,
    show_caption,
    show_timestamp,
    show_carousel_grouping
  } = sdk.getExpandedTileConfig()

  const shopspotEnabled = sdk.isComponentLoaded("shopspots") && show_shopspots && !!tile.hotspots?.length
  const tileHasCarouselItems = tile.instagram_media_type === "CAROUSEL_ALBUM"
  const carouselGroupingEnabled =
    sdk.isComponentLoaded("carousel-grouping") && show_carousel_grouping && tileHasCarouselItems
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
                <ImageTemplate
                  tile={tile}
                  image={tile.image}
                  shopspotEnabled={shopspotEnabled}
                  carouselGroupingEnabled={carouselGroupingEnabled}
                  parent={parent}
                />
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

export function IconSection({ tile, productsEnabled }: { tile: Tile; productsEnabled: boolean }) {
  const topSectionIconContent = []
  const bottomSectionIconContent = []

  if (tile.attrs?.includes("instagram.reel")) {
    topSectionIconContent.push(<div class="content-icon icon-reel"></div>)
  } else if (tile.attrs?.includes("youtube.short")) {
    topSectionIconContent.push(<div class="content-icon icon-youtube-short"></div>)
  }
  if (
    productsEnabled &&
    tile.tags_extended &&
    tile.tags_extended.length &&
    tile.tags_extended.find(tag => tag.type == "product")
  ) {
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

export function ShopSpotTemplate({ shopspotEnabled, parent, tileId }: ShopspotProps) {
  return shopspotEnabled ? (
    <>
      <shopspot-icon parent={parent} mode="expanded" tile-id={tileId} />
    </>
  ) : (
    <></>
  )
}

export function ImageTemplate({
  tile,
  image,
  shopspotEnabled = false,
  carouselGroupingEnabled = false,
  parent
}: {
  tile: Tile
  image: string
  shopspotEnabled?: boolean
  carouselGroupingEnabled?: boolean
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
        {carouselGroupingEnabled ? (
          <carousel-grouping parent={parent} tile-id={tile.id} mode="expanded" />
        ) : (
          <img class="image-element" src={image} loading="lazy" alt={tile.description || "Image"} />
        )}
      </div>
    </>
  ) : (
    <></>
  )
}
