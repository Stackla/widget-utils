import Handlebars from "handlebars"

export const loadIfAutoPlayVideoHelper = (hbs: typeof Handlebars) => {
  hbs.registerHelper("ifAutoPlayVideo", function (media, autoPlayVideoEnabled, options) {
    if (media === "video" && autoPlayVideoEnabled) {
      return options.fn(this)
    }
    return options.inverse(this)
  })
}
