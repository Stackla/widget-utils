import { useClipboard } from "../clipboard-polyfills"

export async function copyToClipboard(inputElement: HTMLInputElement) {
  try {
    const writeText = useClipboard()
    await writeText(inputElement)
    const buttonElement = inputElement.closest(".url-copy")?.querySelector<HTMLElement>(".copy-button")
    if (buttonElement) {
      buttonElement.textContent = "Copied"
      setInterval(() => {
        buttonElement.textContent = "Copy"
      }, 2000)
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to copy text: ", err)
  }
}

function reduceBackgroundControlsVisibility(hostElement: HTMLElement) {
  const navigationPrevButton = hostElement.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = hostElement.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = hostElement.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.add("swiper-button-disabled")
  navigationPrevButton?.classList.add("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.style.opacity = "0.4"
  }
}

function resetBackgroundControlsVisibility(hostElement: HTMLElement) {
  const navigationPrevButton = hostElement.querySelector<HTMLElement>(".swiper-expanded-button-prev")
  const navigationNextButton = hostElement.querySelector<HTMLElement>(".swiper-expanded-button-next")
  const exitTileButton = hostElement.querySelector<HTMLElement>(".exit")

  navigationNextButton?.classList.remove("swiper-button-disabled")
  navigationPrevButton?.classList.remove("swiper-button-disabled")

  if (exitTileButton) {
    exitTileButton.removeAttribute("style")
  }
}

function addShareMenuListeners(shareMenuWrapper: HTMLElement, callback: () => void) {
  // Exit button listener
  const shareExitButton = shareMenuWrapper.querySelector<HTMLElement>(".share-modal-exit")
  const panelOverlay = shareMenuWrapper.querySelector<HTMLElement>(".panel-overlay")

  if (shareExitButton) {
    shareExitButton.addEventListener("click", shareExitButtonEvent => {
      shareExitButtonEvent.preventDefault()
      shareExitButtonEvent.stopPropagation()
      shareMenuWrapper.style.display = "none"
      panelOverlay?.classList.remove("active")
      callback()
    })
  }

  // copy to clipboard listener
  const clipboardElement = shareMenuWrapper.querySelector<HTMLElement>(".url-copy .copy-button")
  const shareUrlElement = shareMenuWrapper.querySelector<HTMLInputElement>(".url-copy .share-url")

  if (shareUrlElement && clipboardElement) {
    clipboardElement.addEventListener("click", () => copyToClipboard(shareUrlElement))
  }
}

export function registerShareMenuListenersWithSwiper(
  hostElement: HTMLElement,
  shareButtonElement: HTMLElement,
  parent: Element
) {
  shareButtonElement.addEventListener("click", (shareButtonEvent: MouseEvent) => {
    shareButtonEvent.preventDefault()
    shareButtonEvent.stopPropagation()
    const wrapper = parent.querySelector<HTMLElement>(".share-socials-popup-wrapper")
    const panelOverlay = parent.querySelector<HTMLElement>(".panel-overlay")
    const panelRightWrapper = parent.querySelector<HTMLElement>(".panel-right-wrapper")

    if (!wrapper) {
      throw new Error("Share menu wrapper not found")
    }
    wrapper.style.display = "flex"
    panelOverlay?.classList.add("active")

    if (panelRightWrapper) {
      panelRightWrapper.style.overflow = "unset"
    }
    reduceBackgroundControlsVisibility(hostElement)
    addShareMenuListeners(wrapper, () => {
      resetBackgroundControlsVisibility(hostElement)
      if (panelRightWrapper) {
        panelRightWrapper.removeAttribute("style")
      }
    })
  })
}

export function registerShareMenuListeners(shareButtonElement: HTMLElement, parent: Element) {
  shareButtonElement.addEventListener("click", (shareButtonEvent: MouseEvent) => {
    shareButtonEvent.preventDefault()
    shareButtonEvent.stopPropagation()
    const wrapper = parent.querySelector<HTMLElement>(".share-socials-popup-wrapper")
    const panelOverlay = parent.querySelector<HTMLElement>(".panel-overlay")
    const panelRightWrapper = parent.querySelector<HTMLElement>(".panel-right-wrapper")

    if (!wrapper) {
      throw new Error("Share menu wrapper not found")
    }
    wrapper.style.display = "flex"
    panelOverlay?.classList.add("active")

    if (panelRightWrapper) {
      panelRightWrapper.style.overflow = "unset"
    }
    addShareMenuListeners(wrapper, () => {})
  })
}
