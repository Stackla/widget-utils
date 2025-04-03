import type { TagExtended, Tile } from "../../types"
import Handlebars from "handlebars"

export const loadIfHasPublicTags = (hbs: typeof Handlebars) => {
  hbs.registerHelper("ifHasPublicTags", function (tile: Tile, options) {
    // public tags
    const tag = tile.tags_extended?.length && tile.tags_extended.find((tag: TagExtended) => tag.publicly_visible)

    if (tag) {
      return options.fn(this)
    }

    return options.inverse(this)
  })
}
