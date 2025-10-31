import type { SwiperType } from "../../"
import { EVENT_PRODUCT_NAVIGATION } from "../../events"
import { initializeSwiper } from "../extensions"
import { ISdk } from "src/types"

export function loadProductsSwiper(sdk: ISdk, tileId: string, target: HTMLElement) {
  if (target) {
    const settings = sdk.getWidgetTemplateSettings().config?.components?.products?.swiper_options
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
            navigationPrev: (swiper: SwiperType) => {
              sdk.triggerEvent(`${EVENT_PRODUCT_NAVIGATION}:${tileId}`, {
                direction: "previous"
              })

              swiper.update()
            }
          },
          ...settings
        }
      })
    }
  }
}
