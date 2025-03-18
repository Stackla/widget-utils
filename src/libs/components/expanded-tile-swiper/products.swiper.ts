import type { Swiper } from "swiper/types"
import { EVENT_PRODUCT_NAVIGATION } from "../../../events"
import { Sdk } from "../../../types"
import { initializeSwiper } from "../../extensions/swiper/swiper.extension"

declare const sdk: Sdk

export function loadProductsSwiper(tileId: string, target: HTMLElement) {
  if (target) {
    const swiperCrossSell = target.querySelector<HTMLElement>(".swiper-expanded-product-recs")

    if (swiperCrossSell) {
      initializeSwiper({
        id: `expanded-product-recs-${tileId}`,
        mode: "expanded-product-recs",
        widgetSelector: swiperCrossSell,
        prevButton: "swiper-exp-product-recs-button-prev",
        nextButton: "swiper-exp-product-recs-button-next",
        paramsOverrides: {
          slidesPerView: "auto",
          mousewheel: {
            enabled: false
          },
          grabCursor: false,
          on: {
            navigationNext: () => {
              sdk.triggerEvent(`${EVENT_PRODUCT_NAVIGATION}:${tileId}`, {
                direction: "next"
              })
            },
            navigationPrev: (swiper: Swiper) => {
              sdk.triggerEvent(`${EVENT_PRODUCT_NAVIGATION}:${tileId}`, {
                direction: "previous"
              })

              swiper.update()
            }
          }
        }
      })
    }
  }
}
