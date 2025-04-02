import Handlebars from "handlebars"

export const loadIfShortVideoHelper = (hbs: typeof Handlebars) => {
  hbs.registerHelper("ifShortVideo", function (tile, options) {
    let isShortVideo = false
    if (tile.media === "video") {
      switch (tile.source) {
        case "instagram": {
          if (tile.attrs?.includes("instagram.reel")) {
            isShortVideo = true
          }
          break
        }
        case "youtube": {
          if (tile.attrs?.includes("youtube.short")) {
            isShortVideo = true
          }
          break
        }
        case "tiktok": {
          if (tile.attrs?.includes("tiktok.short")) {
            isShortVideo = true
          }
          break
        }
      }
    }

    if (isShortVideo) {
      return options.fn(this)
    }

    return options.inverse(this)
  })
}
