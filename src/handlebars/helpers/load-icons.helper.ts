import Handlebars from "handlebars"
import { TagExtended, Tile } from "../../types"

export function getIcons(tile: Tile) {
  const hasInstagramReel = tile.attrs && tile.attrs.includes("instagram.reel")
  const hasProductTags =
    tile.tags_extended && tile.tags_extended.filter((tag: TagExtended) => tag.type === "product").length > 0
  const isVideo = tile.media === "video"
  return `<div class="icon-section">
        <div class="top-section">
            ${hasInstagramReel ? `<div class="content-icon icon-reel"></div>` : ""}
            ${hasProductTags ? `<div class="shopping-icon icon-products"></div>` : ""}
        </div>
        <div class="center-section">
            ${isVideo ? `<div class="icon-play"></div>` : ""}
        </div>
        <div class="bottom-section">
            <div class="network-icon icon-${tile.source}"></div>
            <shopspot-icon tile-id="${tile.id}" />
        </div>
    </div>`
}

export function loadIconsHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("loadIcons", function (tile) {
    return new hbs.SafeString(getIcons(tile))
  })
}
