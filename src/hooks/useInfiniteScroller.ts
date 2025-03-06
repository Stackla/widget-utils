import { ISdk } from "../"
import { EVENT_LOAD_MORE } from "../events"

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
