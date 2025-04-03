import Handlebars from "handlebars"
import type { Tile, WidgetOptions } from "../types"

import { loadIfEqualsHelper, loadJoinHelper, loadLazyHelper } from "./helpers"
import { loadTileHelper } from "./helpers/tile.helper"
import { loadIfAutoPlayVideoHelper } from "./helpers/if-auto-play-video.helper"
import { loadPlayVideoHelper } from "./helpers/play-video.helper"
import { loadIfShortVideoHelper } from "./helpers/if-short-video.helper"
import { loadIfHasProductTags } from "./helpers/if-has-product-tags.helper"
import { loadIfHasPublicTags } from "./helpers/if-has-public-tags.helper"

export interface HandlebarsPartial {
  name: string
  template: string
}

export async function renderHTMLWithTemplates(
  tileTemplate: string,
  layoutTemplate: string,
  tiles: Tile[],
  options: WidgetOptions
) {
  loadHelpers(Handlebars)

  const hbs = await renderTemplateWithPartials(Handlebars.create(), {
    name: "tpl-tile",
    template: tileTemplate
  })

  const handlebarsTemplate = hbs.compile(layoutTemplate)
  return handlebarsTemplate({
    tiles,
    options
  })
}

export async function renderTilesWithTemplate(tileTemplate: string, tiles: Tile[], options: WidgetOptions) {
  loadHelpers(Handlebars)

  const hbs = await renderTemplateWithPartials(Handlebars.create(), {
    name: "tpl-tile",
    template: tileTemplate
  })

  const handlebarsTemplate = hbs.compile(tileTemplate)

  return tiles.map(tile =>
    handlebarsTemplate({
      ...tile,
      options
    })
  )
}

export function renderTemplateWithPartials(hbs: typeof Handlebars, partial: HandlebarsPartial) {
  loadHelpers(hbs)
  hbs.registerPartial(partial.name, partial.template)

  return hbs
}

export function loadHelpers(hbs: typeof Handlebars) {
  loadIfEqualsHelper(hbs)
  loadLazyHelper(hbs)
  loadJoinHelper(hbs)
  loadTileHelper(hbs)
  loadIfAutoPlayVideoHelper(hbs)
  loadPlayVideoHelper(hbs)
  loadIfShortVideoHelper(hbs)
  loadIfHasProductTags(hbs)
  loadIfHasPublicTags(hbs)
}
