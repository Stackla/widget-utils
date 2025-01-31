const swiper = typeof import("swiper").Swiper

interface Window {
  scrollLocked: boolean,
  __isLoading: boolean,
  ugc: {
    libs: {
      Swiper: swiper
    }
    swiperContainer: Record<string, Swiper>
  },
  stackWidgetDomain: string
}

declare module "*.scss" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: string
  export default content
}