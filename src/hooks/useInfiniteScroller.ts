import { ISdk } from "../"
import { EVENT_LOAD_MORE, EVENT_TILES_DEPLETED } from "../events"

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

  const ugcContainer = sdk.querySelector("#nosto-ugc-container")

  if (!ugcContainer) {
    console.error("Nosto UGC container not found")
    return
  }

  ugcContainer.appendChild(sentinel)

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

  sdk.addEventListener(EVENT_TILES_DEPLETED, () => {
    observer.disconnect()
  })
}

export default useInfiniteScroller
