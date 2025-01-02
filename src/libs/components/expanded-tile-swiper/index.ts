import { ExpandedTiles } from "./base.template"
import { ISdk } from "../../../"

declare const sdk: ISdk

function loadDefaultExpandedTileTemplates(addExpandedTileTemplates: boolean) {
  if (!addExpandedTileTemplates) {
    return
  }

  sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
}

export function loadExpandedTileTemplates(templateEnabled: boolean) {
  loadDefaultExpandedTileTemplates(templateEnabled)
}

export * from "./tile.template"
export * from "./embed-youtube.template"
export * from "./video.templates"
export * from "./types"
