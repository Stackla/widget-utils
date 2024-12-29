import { ExpandedTiles } from "./base.template"
import { StoryExpandedTiles } from "./story/base.template"
import { ISdk } from "../../../"

declare const sdk: ISdk

function loadDefaultExpandedTileTemplates(addExpandedTileTemplates: boolean, story: boolean) {
  if (!addExpandedTileTemplates) {
    return
  }

  if (story) {
    sdk.addTemplateToComponent(StoryExpandedTiles, "expanded-tiles")
  } else {
    sdk.addTemplateToComponent(ExpandedTiles, "expanded-tiles")
  }
}

export function loadExpandedTileTemplates(settings: ExpandedTileSettings, story: boolean) {
  loadDefaultExpandedTileTemplates(templateEnabled, story)
}

export * from "./tile.template"
export * from "./embed-youtube.template"
export * from "./video.templates"
export * from "./types"
