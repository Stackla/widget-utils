import { initializeSwiper } from "../../extensions/swiper/swiper.extension"

export function onExpandedTileCrossSellersRendered(tileId: string, target: HTMLElement) {
  if (target && target.shadowRoot) {
    const swiperCrossSell = target.shadowRoot.querySelector<HTMLElement>(".swiper-expanded-product-recs")

    if (swiperCrossSell) {
      initializeSwiper({
        id: `expanded-product-recs-${tileId}`,
        mode: "expanded-product-recs",
        widgetSelector: swiperCrossSell,
        prevButton: "swiper-exp-product-recs-button-prev",
        nextButton: "swiper-exp-product-recs-button-next",
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
