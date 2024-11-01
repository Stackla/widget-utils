import { ISdk } from "../"
import { EVENT_LOAD_MORE } from "../events/constants"

function exceedsBoundaries(sdk: ISdk, windowInstance: Window) {
  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles for boundary check")
  }

  const lastTile = tiles.item(tiles.length - 1)

  if (!lastTile) {
    throw new Error("Failed to find last tile")
  }

  const lastTilePosition = lastTile.getBoundingClientRect().top + lastTile.offsetHeight

  return lastTilePosition <= windowInstance.innerHeight + 100
}

function useInfiniteScroller(
  sdk: ISdk,
  windowInstance: Window = window,
  onLoadMore: () => void = () => {
    sdk.triggerEvent(EVENT_LOAD_MORE)
  }
) {
  function onScroll() {
    if (windowInstance.scrollLocked) return
    windowInstance.scrollLocked = true

    if (exceedsBoundaries(sdk, windowInstance)) {
      onLoadMore()
    }

    windowInstance.scrollLocked = false
  }

  windowInstance.addEventListener("scroll", onScroll)
}

export default useInfiniteScroller
