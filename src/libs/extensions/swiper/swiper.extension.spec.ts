import { Autoplay } from "swiper/modules"
import { establishSwiperConfig } from "./swiper.extension"

beforeAll(() => {
  document.body.innerHTML = `
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  `
})

describe("establishSwiperConfig", () => {
  const userProperties = {
    prev: window.document.querySelector(".swiper-button-prev") as HTMLElement,
    next: window.document.querySelector(".swiper-button-next") as HTMLElement,
    paramsOverrides: {
      slidesPerView: 3,
      spaceBetween: 10
    }
  }
  it("should create a valid swiper config and not contain autoplay", () => {
    const config = establishSwiperConfig(userProperties)
    expect(config).toBeDefined()

    if (config.navigation && typeof config.navigation === "object") {
      expect(config.navigation.nextEl).toBe(userProperties.next)
      expect(config.navigation.prevEl).toBe(userProperties.prev)
    } else {
      throw new Error("config.navigation is not NavigationOptions")
    }

    expect(config.slidesPerView).toBe(3)
    expect(config.spaceBetween).toBe(10)
    expect(config.modules).not.toContain(Autoplay)
  })

  it("should create a valid swiper config and contain autoplay", () => {
    const mutatedUserProperties = {
      ...userProperties,
      paramsOverrides: {
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }
      }
    }

    const config = establishSwiperConfig(mutatedUserProperties)
    expect(config).toBeDefined()

    if (config.navigation && typeof config.navigation === "object") {
      expect(config.navigation.nextEl).toBe(userProperties.next)
      expect(config.navigation.prevEl).toBe(userProperties.prev)
    } else {
      throw new Error("config.navigation is not NavigationOptions")
    }

    expect(config.slidesPerView).toBe(undefined)
    expect(config.spaceBetween).toBe(10)
    expect(config.modules).toContain(Autoplay)
  })
})
