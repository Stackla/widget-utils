import Handlebars from "handlebars"

export const loadJoinHelper = (hbs: typeof Handlebars) => {
  hbs.registerHelper("join", function (...args) {
    const argsToJoin = args.slice(0, -1)
    return argsToJoin.join("")
  })
}
