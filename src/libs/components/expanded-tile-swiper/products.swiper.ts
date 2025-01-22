import { initializeSwiper } from "../../extensions/swiper/swiper.extension"

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
            beforeInit: swiper => {
              swiper.slideToLoop(0, 0, false)
            }
          }
        }
      })
    }
  }
}
