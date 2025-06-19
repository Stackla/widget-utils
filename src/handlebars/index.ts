import Handlebars from "handlebars"
import type { Tile, WidgetOptions } from "../types"

import { loadIfEqualsHelper, loadJoinHelper, loadLazyHelper } from "./helpers"
import { loadTileHelper } from "./helpers/tile.helper"
import { loadIfAutoPlayVideoHelper } from "./helpers/if-auto-play-video.helper"
import { loadPlayVideoHelper } from "./helpers/play-video.helper"
import { loadIfShortVideoHelper } from "./helpers/if-short-video.helper"
import { loadIfHasProductTags } from "./helpers/if-has-product-tags.helper"
import { loadIfHasPublicTags } from "./helpers/if-has-public-tags.helper"
import { loadIconsHelper } from "./helpers/load-icons.helper"
import { loadTagFallbackUsernameHelper } from "./helpers/tag-fallback-username"

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
  loadHelpers(Handlebars, options.wid)

  const hbs = await renderTemplateWithPartials(
    Handlebars.create(),
    {
      name: "tpl-tile",
      template: tileTemplate
    },
    options.wid
  )

  const handlebarsTemplate = hbs.compile(layoutTemplate)
  return handlebarsTemplate({
    tiles,
    options
  })
}

export async function renderTilesWithTemplate(
  tileTemplate: string,
  tiles: Tile[],
  options: WidgetOptions & {
    wid: string
  }
) {
  loadHelpers(Handlebars, options.wid)

  const hbs = await renderTemplateWithPartials(Handlebars.create(), {
    name: "tpl-tile",
    template: tileTemplate
  })
  const handlebarsTemplate = hbs.compile(tileTemplate)

  return tiles.map(tile =>
    handlebarsTemplate({
      ...tile,
      wid: options.wid,
      options
    })
  )
}

export function renderTemplateWithPartials(
  hbs: typeof Handlebars,
  partial: HandlebarsPartial,
  widgetId: string = "unknown"
) {
  loadHelpers(hbs, widgetId)
  hbs.registerPartial(partial.name, partial.template)

  return hbs
}

export function loadHelpers(hbs: typeof Handlebars, widgetId: string) {
  loadIfEqualsHelper(hbs)
  loadLazyHelper(hbs)
  loadJoinHelper(hbs)
  loadTileHelper(hbs)
  loadIfAutoPlayVideoHelper(hbs)
  loadPlayVideoHelper(hbs, widgetId)
  loadIfShortVideoHelper(hbs)
  loadIfHasProductTags(hbs)
  loadIfHasPublicTags(hbs)
  loadIconsHelper(hbs, widgetId)
  loadTagFallbackUsernameHelper(hbs)
}
