import { ISdk } from "../../../"
import { waitForElements } from "../../"

declare const sdk: ISdk

export function updateTagListMask() {
  const tilesContainer = sdk.querySelector(".ugc-tiles")

  waitForElements(tilesContainer, ".swiper-tags", () => {
    const container = sdk.querySelector(".swiper-tags")
    const arrowRight = sdk.querySelector<HTMLElement>(".swiper-tags-button-next")
    const arrowLeft = sdk.querySelector<HTMLElement>(".swiper-tags-button-prev")

    if (!container) return

    const updateMask = () => {
      container.className = container.className.replace(/mask-\w+/g, "").trim()

      const isArrowRightEnabled = arrowRight && !arrowRight.classList.contains("swiper-button-disabled")
      const isArrowLeftEnabled = arrowLeft && !arrowLeft.classList.contains("swiper-button-disabled")

      if (isArrowRightEnabled && isArrowLeftEnabled) {
        container.classList.add("mask-both")
      } else if (isArrowLeftEnabled) {
        container.classList.add("mask-left")
      } else {
        container.classList.add("mask-right")
      }
    }

    const observer = new MutationObserver(updateMask)
    if (arrowRight) {
      observer.observe(arrowRight, { attributes: true, attributeFilter: ["class"] })
    }

    if (arrowLeft) {
      observer.observe(arrowLeft, { attributes: true, attributeFilter: ["class"] })
    }

    updateMask()
  })
}
