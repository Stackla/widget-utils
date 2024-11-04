import { disableSwiper, getSwiperIndexforTile, initializeSwiper } from "../../extensions/swiper/swiper.extension"
import { waitForElm } from "../../widget.features"
import { registerExpandedTileShareMenuListeners } from "../../templates/share-menu/share-menu.listener"
import { SdkSwiper } from "../../../types/SdkSwiper"
import Swiper from "swiper"

declare const sdk: SdkSwiper

function initializeSwiperForExpandedTiles(initialTileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")
  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }
  const widgetSelector = expandedTile.shadowRoot.querySelector<HTMLElement>(".swiper-expanded")

  if (!widgetSelector) {
    throw new Error("Failed to find widget UI element. Failed to initialise Glide")
  }

  sdk.tiles.setVisibleTilesCount(2)

  initializeSwiper({
    id: "expanded",
    widgetSelector,
    mode: "expanded",
    prevButton: "swiper-expanded-button-prev",
    nextButton: "swiper-expanded-button-next",
    paramsOverrides: {
      slidesPerView: 1,
      keyboard: {
        enabled: true,
        onlyInViewport: false
      },
      on: {
        beforeInit: (swiper: Swiper) => {
          const tileIndex = initialTileId ? getSwiperIndexforTile(widgetSelector, initialTileId) : 0
          swiper.slideToLoop(tileIndex, 0, false)
        }
      }
    }
  })
}

export function onTileExpand(tileId: string) {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.add("expanded-tile-overlay")

  waitForElm(expandedTile.shadowRoot, [".swiper-expanded"], () => initializeSwiperForExpandedTiles(tileId))
}

export function onTileRendered() {
  const expandedTilesElement = sdk.querySelector("expanded-tiles")

  if (!expandedTilesElement) {
    throw new Error("Expanded tiles element not found")
  }

  const tiles = expandedTilesElement.shadowRoot?.querySelectorAll(".swiper-slide")

  tiles?.forEach(tile => {
    const shareButton = tile.querySelector<HTMLElement>(".panel-right .share-button")
    if (!shareButton) {
      throw new Error(`Share button not found in expanded tile ${tile.getAttribute("data-id")}`)
    }
    registerExpandedTileShareMenuListeners(expandedTilesElement, shareButton, tile)

    const videoSourceElement = tile.querySelector<HTMLVideoElement>("video.video-content > source")
    if (videoSourceElement) {
      videoSourceElement.addEventListener("error", () => {
        videoSourceElement.closest(".video-content-wrapper")?.classList.add("hidden")
        tile.querySelector(".video-fallback-content")?.classList.remove("hidden")
      })
    }
  })
}

export function onTileClosed() {
  const expandedTile = sdk.querySelector("expanded-tiles")

  if (!expandedTile?.shadowRoot) {
    throw new Error("The expanded tile element not found")
  }

  expandedTile.parentElement!.classList.remove("expanded-tile-overlay")

  disableSwiper("expanded")
}
