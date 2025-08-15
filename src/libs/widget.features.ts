import { ISdk, Tile } from "src/types"

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

export function addAutoAddTileFeature(sdk: ISdk) {
  const { auto_refresh } = sdk.getStyleConfig()

  if (Boolean(auto_refresh) === true) {
    sdk.enableAutoAddNewTiles()
  }
}

export function loadTitle(sdk: ISdk) {
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
