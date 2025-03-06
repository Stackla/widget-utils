import { ISdk } from "../"
import { EVENT_LOAD_MORE } from "../events"

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

  return lastTilePosition <= windowInstance.innerHeight + 200
}

function useInfiniteScroller(
  sdk: ISdk,
  _windowInstance: Window,
  onLoadMore: () => void = () => {
    sdk.triggerEvent(EVENT_LOAD_MORE)
  }
) {
  const sentinel = document.createElement("div")
  let isIntersecting = false

  sentinel.className = "sentinel"
  sentinel.style.height = "1px"
  sdk.querySelector("#nosto-ugc-container").appendChild(sentinel)

  const observer = new IntersectionObserver(
    entries => {
      const entry = entries[0]

      if (entry.isIntersecting) {
        isIntersecting = true
        onLoadMore()

        setTimeout(() => {
          if (isIntersecting) {
            onLoadMore()
          }
        }, 1000)
      } else {
        isIntersecting = false
      }
    },
    {
      root: null,
      threshold: 0.8
    }
  )
  observer.observe(sentinel)
}

export default useInfiniteScroller
