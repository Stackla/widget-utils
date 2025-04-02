import Handlebars from "handlebars"

export const loadIfEqualsHelper = (hbs: typeof Handlebars) => {
  hbs.registerHelper("ifequals", function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  })
}
