import type { Swiper } from "swiper/types"
import { EVENT_PRODUCT_NAVIGATION } from "../../../events"
import { initializeSwiper } from "../../extensions/swiper/swiper.extension"
import { ISdk } from "../../../types"

export function loadProductsSwiper(sdk: ISdk, tileId: string, target: HTMLElement) {
  if (target) {
    const swiperCrossSell = target.querySelector<HTMLElement>(".swiper-expanded-product-recs")

    if (swiperCrossSell) {
      initializeSwiper(sdk, {
        id: `expanded-product-recs-${tileId}`,
        mode: "expanded-product-recs",
        widgetSelector: swiperCrossSell,
        paramsOverrides: {
          slidesPerView: "auto",
          spaceBetween: 2,
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
