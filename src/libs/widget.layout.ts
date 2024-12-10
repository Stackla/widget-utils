import type { ISdk } from "../"

declare const sdk: ISdk
export function addCSSVariablesToPlacement(cssVariables: Record<string, string>) {
  const hostElement = sdk.placement.getElement()
  Object.entries(cssVariables).forEach(([key, value]) => hostElement.style.setProperty(key, value))
}

export function isEnabled() {
  const { enabled } = sdk.getWidgetOptions()
  return enabled && hasMinimumTilesRequired()
}

export function hasMinimumTilesRequired() {
  const { minimal_tiles } = sdk.getStyleConfig()
  // FIXME: Make minimal_tiles number across the board
  const minimalTiles = parseInt(minimal_tiles)

  if (minimalTiles && minimalTiles > 0) {
    const tiles = sdk.querySelectorAll(".ugc-tile")

    if (tiles && tiles.length >= minimalTiles) {
      return true
    }

    throw new Error(`Not enough tiles to render widget. Expected ${minimalTiles} but found ${tiles!.length}`)
  }

  // Feature is not enabled via user config, so we default to true.
  return true
}
