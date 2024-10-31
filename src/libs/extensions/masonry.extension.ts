import { ISdk } from "@stackla/public-types"

declare const sdk: ISdk

let widths: number[] = []
let rowIndex = 0
let screenWidth = 0
let previousWidthHandled = 0

export function handleTileImageRendered(tileId?: string) {
  if (!tileId) {
    return
  }

  const gridItemElement = sdk.placement.getShadowRoot().querySelector(`.grid-item[data-id*="${tileId}"]`)
  const tileLoadingElement = gridItemElement?.querySelector(".tile-loading.loading")
  tileLoadingElement?.classList.remove("loading")
}

export function handleAllTileImageRendered() {
  const tileLoadingElements = sdk.placement.getShadowRoot().querySelectorAll(".grid-item .tile-loading.loading")
  tileLoadingElements?.forEach(element => element.classList.remove("loading"))

  const loadMoreHiddenElement = sdk.placement.getShadowRoot().querySelector("#buttons > #load-more.hidden")
  loadMoreHiddenElement?.classList.remove(".hidden")
}

function getGridItemRowIds() {
  const gridItems = sdk.placement.getShadowRoot().querySelectorAll(".grid-item:not(hidden)[row-id]")
  const allRowIds = Array.from(gridItems)
    .map(item => item.getAttribute("row-id"))
    .filter(rowIdString => rowIdString && !Number.isNaN(+rowIdString))
    .map(rowId => +rowId!)

  return [...new Set(allRowIds)]
}

export function handleTileImageError(tileWithError: HTMLElement) {
  const errorTileRowIdString = tileWithError.getAttribute("row-id")

  tileWithError.classList.remove("grid-item")
  tileWithError.classList.remove("ugc-tile")

  // add class
  tileWithError.classList.add("grid-item-error")
  tileWithError.classList.add("ugc-tile-error")
  tileWithError.classList.add("hidden")

  if (!errorTileRowIdString || Number.isNaN(+errorTileRowIdString)) {
    return
  }

  const errorTileRowId = +errorTileRowIdString
  const uniqueRowIds = getGridItemRowIds()

  const rowIdSelectors = uniqueRowIds.filter(rowId => rowId >= errorTileRowId).map(matched => `[row-id="${matched}"]`)

  const matchedGridItems = Array.from(
    sdk.placement.getShadowRoot().querySelectorAll<HTMLElement>(`.grid-item:is(${rowIdSelectors})`)
  )

  widths = []
  rowIndex = errorTileRowId

  resizeTiles(matchedGridItems)
}

function getPartitionWidth(min: number, max: number) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}

function adjustWidthToLimit(screenWidth: number, partitions: number[], newWidth: number, minWidth: number) {
  const partitionsTotal = partitions.reduce((a, b) => a + b, 0)
  const newTotal = partitionsTotal + newWidth

  const resultWidth = (() => {
    if (newTotal > screenWidth) {
      const excessWidth = newTotal - screenWidth
      return newWidth - excessWidth
    }
    return newWidth
  })()

  if (resultWidth < minWidth) {
    const smallestPartition = Math.min(...partitions)
    const smallestPartitionIndex = partitions.indexOf(smallestPartition)
    const increasedValue = smallestPartition + resultWidth
    partitions[smallestPartitionIndex] = increasedValue
  } else {
    partitions.push(resultWidth)
  }
  return resultWidth
}

function adjustMarginFromPartitions(partitions: number[], margin: number) {
  // adjust margin for both sides
  const marginLeftRight = margin * 2

  return partitions.map(partition => partition - marginLeftRight)
}

/**
 * Partition the screen width into random partitions
 * @param screenWidth
 * @param minPartitionWidth
 * @returns
 */
export function generateRandomPartitions(screenWidth: number, margin: number, minPartitionWidth = 100) {
  // Validate input
  if (screenWidth <= 0) {
    return []
  }

  // List to hold the widths of the partitions
  const partitions: number[] = []

  // Initialize the remaining width to be filled
  let remainingWidth = screenWidth

  // Define the maximum width for any partition
  const maxPartitionWidth = 400

  const minPartitionWidthWithMargin = minPartitionWidth + margin * 2

  while (remainingWidth > 0) {
    const currentPartitionWidth = getPartitionWidth(minPartitionWidthWithMargin, maxPartitionWidth)
    const adjustedWidth = adjustWidthToLimit(
      screenWidth,
      partitions,
      currentPartitionWidth,
      minPartitionWidthWithMargin
    )
    remainingWidth -= adjustedWidth
  }

  // adjust margin from partitions
  return adjustMarginFromPartitions(partitions, margin)
}

export function renderMasonryLayout(reset = false, resize = false) {
  if (resize || reset) {
    widths = []
    rowIndex = 0
    screenWidth = 0
  }

  // If screenWidth is not stored or has changed, reinitialize the widths array
  const ugcContainer = sdk.querySelector("#nosto-ugc-container")

  if (!ugcContainer) {
    throw new Error("Failed to find Nosto UGC container")
  }

  const currentScreenWidth = ugcContainer.clientWidth!

  if (currentScreenWidth === 0) {
    return
  }

  if (resize && previousWidthHandled === currentScreenWidth) {
    return
  }

  if (screenWidth == 0) {
    screenWidth = currentScreenWidth
    previousWidthHandled = currentScreenWidth
  }

  const allTiles = Array.from(sdk.querySelectorAll<HTMLElement>(".grid-item") ?? [])
  const ugcTiles = reset || resize ? allTiles : allTiles.filter(tile => tile.getAttribute("width-set") !== "true")

  resizeTiles(ugcTiles)
}

function resizeTiles(ugcTiles: HTMLElement[]) {
  const { margin } = sdk.getStyleConfig()

  // If no unprocessed UGC tiles, exit
  if (!ugcTiles || ugcTiles.length === 0) {
    return
  }

  ugcTiles.forEach((tile: HTMLElement) => {
    // If widths array is empty, regenerate new partitions
    if (!widths.length) {
      rowIndex += 1
      // FIXME: Make margin number across the board
      widths = generateRandomPartitions(screenWidth, parseInt(margin) ?? 0)
    }

    // Pop the next width from the array
    const randomWidth = widths.pop()!

    // Apply the width to the tile and mark it as processed
    tile.style.width = `${randomWidth}px`
    tile.setAttribute("width-set", "true")
    tile.setAttribute("row-id", rowIndex.toString())
  })
}
