const sdk = typeof import ("./types").ISdk
const swiper = typeof import("swiper").Swiper
type youtubePlayerHandle = import("./libs/vertical-expanded-tiles/youtube-player").YoutubePlayerHandle

interface Window {
  scrollLocked: boolean,
  __isLoading: boolean,
  ugc: {
    libs: {
      Swiper: swiper
    }
    swiperContainer: Record<string, Swiper>,
    youtubePlayers?: Record<string, youtubePlayerHandle>,
    getWidgetBySelector: (selector: string) => {
      sdk: sdk
    }
  },
  stackWidgetDomain: string,

}

declare module "*.scss" {
  const content: string
  export default content
}

declare module "*.css" {
  const content: string
  export default content
}