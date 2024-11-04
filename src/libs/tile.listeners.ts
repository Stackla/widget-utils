import type { ISdk } from "../"
import { handleTileClick } from "./tile.lib"

declare const sdk: ISdk

export type Callback = (args: unknown) => void
export type EventCallback = (event: Event) => void

export function registerDefaultClickEvents() {
  const { click_through_url } = sdk.getStyleConfig()
  const urlPattern = /^https?:\/\/.+/

  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles UI element")
  }

  tiles.forEach((tile: HTMLElement) => {
    const url = click_through_url ?? ""
    const urlIsValid = urlPattern.test(url)

    if (urlIsValid) {
      tile.onclick = e => {
        handleTileClick(e, url)
      }
    }
  })
}

export function registerTileExpandListener(fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener("tileExpand", (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data.tileId as string
    fn(tileId)
  })
}

export function registerTileClosedListener(fn: Callback = () => {}) {
  sdk.addEventListener("expandedTileClose", fn)
}

export function registerExpandedTileRenderedListener(fn: Callback = () => {}) {
  sdk.addEventListener("tileExpandRendered", fn)
}

export function registerLoadListener(fn: Callback) {
  sdk.addEventListener("load", fn)
}

export function registerTilesUpdated(fn: Callback) {
  sdk.addEventListener("tilesUpdated", () => setTimeout(fn, 200))
}

export function registerWidgetInitComplete(fn: Callback) {
  sdk.events.listenOrFindEvent("widgetInitComplete", () => setTimeout(fn, 1000))
}

export function registerExpandedTileCrossSellersRendered(fn: (tileId: string, target: HTMLElement) => void = () => {}) {
  sdk.events.addUgcEventListener("tileExpandCrossSellersRendered", (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data as string
    const element = customEvent.detail.target as HTMLElement
    fn(tileId, element)
  })
}

export function registerTileBgImgRenderComplete(fn: Callback) {
  sdk.addEventListener("tileBgImgRenderComplete", fn)
}

export function registerTileBgImageError(fn: EventCallback) {
  sdk.addEventListener("tileBgImageError", fn)
}

export function registerResizeListener(fn: Callback) {
  sdk.addEventListener("resize", fn)
}
