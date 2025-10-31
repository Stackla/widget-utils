import { ISdk, Tile } from "src/types"
import { VerticalExpandedTile } from "./tile.template"
import { createElement } from "../jsx-html"

export function getExpandedSlides(sdk: ISdk, tiles: Tile[]) {
  return tiles.map(tile => (
    <div
      class="ugc-tile swiper-slide"
      data-id={tile.id}
      data-yt-id={tile.youtube_id || ""}
      data-tiktok-id={tile.tiktok_id || ""}
      data-media={tile.media}>
      <VerticalExpandedTile tile={tile} sdk={sdk} />
    </div>
  ))
}

export function VerticalExpandedTiles(sdk: ISdk) {
  const tiles = sdk.getTiles()
  const { show_nav } = sdk.getExpandedTileConfig()
  const navigationArrowsEnabled = show_nav

  return (
    <div class="expanded-tile-wrapper" variation="vertical">
      <div class="swiper swiper-expanded story-expanded">
        <div class="align-center">
          <div class="swiper-expanded-button-wrapper">
            <div
              class="swiper-expanded-button-prev swiper-button-prev btn-lg"
              style={{ display: navigationArrowsEnabled ? "flex" : "none" }}>
              <span class="chevron-left" alt="Previous arrow" />
            </div>
            <div
              class="swiper-expanded-button-next swiper-button-next btn-lg"
              style={{ display: navigationArrowsEnabled ? "flex" : "none" }}>
              <span class="chevron-right" alt="Next arrow" />
            </div>
          </div>
        </div>
        <div class="swiper-wrapper ugc-tiles">
          {tiles.map(tile => (
            <div
              class="ugc-tile swiper-slide"
              data-id={tile.id}
              data-yt-id={tile.youtube_id || ""}
              data-tiktok-id={tile.tiktok_id || ""}>
              <VerticalExpandedTile sdk={sdk} tile={tile} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
