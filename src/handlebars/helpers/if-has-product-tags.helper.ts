import type { TagExtended, Tile } from "../../types"
import Handlebars from "handlebars"

export const loadIfHasProductTags = (hbs: typeof Handlebars) => {
  hbs.registerHelper("ifHasProductTags", function (tile: Tile, options) {
    const tag = tile.tags_extended?.length && tile.tags_extended.find((tag: TagExtended) => tag.type === "product")

    if (tag) {
      return options.fn(this)
    }

    return options.inverse(this)
  })
}
