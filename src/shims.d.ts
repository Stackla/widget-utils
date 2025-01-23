const swiper = typeof import("swiper").Swiper

interface Window {
  scrollLocked: boolean,
  __isLoading: boolean,
  ugc: {
    libs: {
      Swiper: swiper
    }
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