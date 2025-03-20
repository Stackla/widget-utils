import { ISdk } from "../../../"

declare const sdk: ISdk

function enableTileContent(slide: HTMLElement) {
  slide.querySelector(".tile-loading")?.classList.add("hidden")
  slide.querySelector(".icon-section.hidden")?.classList.remove("hidden")
}

function enableTileImage(slide: HTMLElement) {
  const tileImage = slide.querySelector<HTMLImageElement>(".tile-image-wrapper > img")
  if (tileImage) {
    if (tileImage.complete) {
      enableTileContent(slide)
    }
    tileImage.onload = () => enableTileContent(slide)
    tileImage.onerror = () => slide.remove()
  }
}

export function enableTileImages(wrapper: HTMLElement) {
  const elements = wrapper.querySelectorAll<HTMLElement>(".ugc-tile:has(.icon-section.hidden)")
  elements.forEach(element => enableTileImage(element))
}

export function loadAllUnloadedTiles() {
  const tileWrapper = sdk.querySelector(".ugc-tiles")
  if (tileWrapper) {
    enableTileImages(tileWrapper)
  }
}
