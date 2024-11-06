import { initializeSwiper } from "../../extensions/swiper/swiper.extension"

export function initializeSwiperForTags(tileId: string, target: HTMLElement) {
  if (target && target.shadowRoot) {
    const swiperTags = target.shadowRoot.querySelector<HTMLElement>(".swiper-tags")

    if (swiperTags) {
      initializeSwiper({
        id: `tags-${tileId}`,
        mode: "tags",
        widgetSelector: swiperTags,
        prevButton: "swiper-tags-button-prev",
        nextButton: "swiper-tags-button-next",
        paramsOverrides: {
          slidesPerView: "auto",
          grabCursor: false,
          on: {
            beforeInit: swiper => {
              swiper.slideToLoop(0, 0, false)
            }
          }
        }
      })
    }
  }
}
