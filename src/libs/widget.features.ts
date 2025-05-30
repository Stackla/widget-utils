import {
  EVENT_TILE_EXPAND,
  EVENT_TILE_EXPAND_RENDERED,
  EVENT_TILES_UPDATED,
  EVENT_EXPANDED_TILE_CLOSE,
  registerDefaultClickEvents,
  registerGenericEventListener,
  registerShareMenuClosedListener,
  registerShareMenuOpenedListener,
  registerTileExpandListener,
  type ISdk,
  type Tile,
  registerProductsUpdatedListener,
  EVENT_TILES_DEPLETED
} from "../"
import { loadExpandSettingComponents } from "./widget.components"
import { useInfiniteScroller } from "../hooks"

import {
  onTileClosed,
  onTileExpand,
  onTileRendered,
  reduceBackgroundControlsVisibility,
  resetBackgroundControlsVisibility
} from "./components/expanded-tile-swiper/expanded-swiper.loader"
import { loadProductsSwiper } from "./components/expanded-tile-swiper/products.swiper"

declare const sdk: ISdk

export const getNextNavigatedTile = (currentTile: Tile, enabledTiles: HTMLElement[], direction: string) => {
  const currentIndex = enabledTiles.findIndex((tile: HTMLElement) => tile.getAttribute("data-id") === currentTile.id)

  if (direction === "previous") {
    const previousTile = getPreviousTile(enabledTiles, currentIndex)

    if (!previousTile) {
      throw new Error("Failed to find previous tile")
    }

    return previousTile.getAttribute("data-id")
  } else if (direction === "next") {
    const nextTile = getNextTile(enabledTiles, currentIndex)

    if (!nextTile) {
      throw new Error("Failed to find next tile")
    }

    return nextTile.getAttribute("data-id")
  }

  return null
}

export const getNextTile = (enabledTiles: HTMLElement[], currentIndex: number) => enabledTiles[currentIndex + 1]
export const getPreviousTile = (enabledTiles: HTMLElement[], currentIndex: number) => enabledTiles[currentIndex - 1]

export const arrowClickListener = (e: Event) => {
  if (!e.target) {
    throw new Error("Failed to find target element for arrow click listener")
  }

  const target = e.target as HTMLElement

  const type = target.classList.contains("tile-arrows-left") ? "previous" : "next"

  const currentTile = sdk.getTile()

  if (!currentTile) {
    throw new Error("Failed to find current tile")
  }

  const tilesAsHtml = sdk.querySelectorAll(".ugc-tile")

  if (!tilesAsHtml) {
    throw new Error("Failed to find tiles for arrow initialisation")
  }

  const tilesAsHtmlArray = Array.from(tilesAsHtml)

  const tileId = getNextNavigatedTile(currentTile, tilesAsHtmlArray, type)

  const tilesStore: Tile[] = sdk.getTiles()

  const tileData = {
    tileData: tilesStore.find(tile => tile.id === tileId),
    widgetId: sdk.getWidgetId(),
    filterId: sdk.getWidgetContainer().widgetOptions?.filter_id
  }

  sdk.triggerEvent(EVENT_EXPANDED_TILE_CLOSE)
  sdk.triggerEvent(EVENT_TILE_EXPAND, tileData)
}

export function addAutoAddTileFeature() {
  const { auto_refresh } = sdk.getStyleConfig()

  // FIXME: Make auto_refresh boolean across the board
  if (Boolean(auto_refresh) === true) {
    sdk.enableAutoAddNewTiles()
  }
}

export function loadExpandedTileFeature() {
  const widgetContainer = sdk.getStyleConfig()
  const { click_through_url } = widgetContainer

  if (click_through_url === "[EXPAND]") {
    loadExpandSettingComponents()
    registerTileExpandListener(onTileExpand)
    registerGenericEventListener(EVENT_EXPANDED_TILE_CLOSE, onTileClosed)
    registerGenericEventListener(EVENT_TILE_EXPAND_RENDERED, onTileRendered)
    registerShareMenuOpenedListener(reduceBackgroundControlsVisibility)
    registerShareMenuClosedListener(resetBackgroundControlsVisibility)
    registerProductsUpdatedListener(loadProductsSwiper)
  } else if (click_through_url === "[ORIGINAL_URL]" || /^https?:\/\/.+/.test(click_through_url ?? "")) {
    registerDefaultClickEvents()
  } else if (click_through_url === "[CUSTOM]") {
    alert("Custom URL integration Not implemented yet")
  }
}

function loadMore() {
  if (window.__isLoading) {
    return
  }

  window.__isLoading = true

  sdk.loadMore()

  setTimeout(() => {
    window.__isLoading = false
  }, 500)
}

const getLoadMoreButton = () => {
  const loadMoreComponent = sdk.querySelector("load-more")

  if (!loadMoreComponent) {
    throw new Error("Failed to find load more component")
  }

  const loadMoreButton = loadMoreComponent?.querySelector<HTMLElement>("#load-more")

  if (!loadMoreButton) {
    throw new Error("Failed to find load more button")
  }

  return loadMoreButton
}

const loadMoreWrappedWithEasedLoader = () => {
  const loadMoreButton = getLoadMoreButton()
  loadMoreButton.classList.add("hidden")
  loadMore()
}

export function addLoadMoreButtonFeature() {
  const { load_more_type } = sdk.getStyleConfig()
  const loadMoreType = load_more_type

  switch (loadMoreType) {
    case "button":
      attachLoadMoreButtonListener()

      sdk.addEventListener(EVENT_TILES_UPDATED, () => {
        const loadMoreButton = getLoadMoreButton()
        loadMoreButton.classList.remove("hidden")
      })

      sdk.addEventListener(EVENT_TILES_DEPLETED, () => {
        disableLoadMoreButtonIfExists()
      })

      break
    case "scroll":
      useInfiniteScroller(sdk, window)
      break
    case "static":
      disableLoadMoreButtonIfExists()
      break
    default:
      throw new Error("Invalid load more type")
  }
}

export function attachLoadMoreButtonListener() {
  const loadMoreButton = getLoadMoreButton()

  loadMoreButton.onclick = loadMoreWrappedWithEasedLoader
}

export function disableLoadMoreButtonIfExists() {
  const loadMoreButton = getLoadMoreButton()

  loadMoreButton.classList.add("hidden")
}

export function loadTitle() {
  const widgetTitle = document.createElement("p")
  const widgetContainer = sdk.getWidgetContainer()
  const title = widgetContainer.title

  if (title) {
    widgetTitle.innerHTML = title
  }
}

export function waitForElm(parent: Element | ShadowRoot, targets: string[], callback: (elements: Element[]) => void) {
  if (targets.every(it => !!parent.querySelector(it))) {
    callback(targets.map(it => parent.querySelector(it)!))
  }

  const observer = new MutationObserver((_, observer) => {
    if (targets.every(it => !!parent.querySelector(it))) {
      observer.disconnect()
      callback(targets.map(it => parent.querySelector(it)!))
    }
  })

  observer.observe(parent, {
    childList: true,
    subtree: true
  })
}

export function waitForElements(
  parent: Element | ShadowRoot,
  target: string,
  callback: (elements: NodeListOf<HTMLElement>) => void
) {
  const elements = parent.querySelectorAll<HTMLElement>(target)

  if (elements.length > 0) {
    callback(elements)
  }

  const observer = new MutationObserver(() => {
    const newElements = parent.querySelectorAll<HTMLElement>(target)
    if (newElements.length > 0) {
      callback(newElements)
      observer.disconnect()
    }
  })

  observer.observe(parent, {
    childList: true,
    subtree: true
  })
}

export function getSdk() {
  if (sdk) {
    return sdk
  }

  const firstChild = document.querySelector("#ugc-widget")?.firstChild as HTMLElement
  const tagName = firstChild?.tagName
  const widget = window.ugc.getWidgetBySelector(tagName)

  if (!widget) {
    throw new Error(`Failed to load SDK, widget not found ${tagName}`)
  }

  return widget.sdk
}
