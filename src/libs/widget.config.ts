import { EnforcedWidgetSettings } from "src/widget-loader"
import { ISdk } from "../types"

declare const sdk: ISdk

export function addTilesPerPageConfig() {
  const { enable_custom_tiles_per_page, tiles_per_page } = sdk.getStyleConfig()

  if (enable_custom_tiles_per_page) {
    // FIXME: Make tiles_per_page number across the board
    sdk.tiles.setVisibleTilesCount(parseInt(tiles_per_page))
  } else {
    sdk.tiles.setVisibleTilesCount(40)
  }
}

export function addAutoAddTileConfig() {
  const { auto_refresh } = sdk.getStyleConfig()

  // FIXME: Make auto_refresh boolean across the board
  if (Boolean(auto_refresh) === true) {
    sdk.tiles.enableAutoAddNewTiles()
  }
}

export function addTileImagePreloadConfig(preloadImages: boolean, hideBrokenImages: boolean) {
  sdk.tiles.preloadImages = preloadImages
  sdk.tiles.hideBrokenTiles = hideBrokenImages
}

export function loadConfig(settings: EnforcedWidgetSettings) {
  if (settings.features.limitTilesPerPage) {
    addTilesPerPageConfig()
  }

  if (settings.features.addNewTilesAutomatically) {
    addAutoAddTileConfig()
  }

  addTileImagePreloadConfig(settings.features.preloadImages, settings.features.hideBrokenImages)
}
