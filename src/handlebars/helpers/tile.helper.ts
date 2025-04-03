import Handlebars from "handlebars"

export function loadTileHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("tile", function (options) {
    const attrs = Object.keys(options.hash)
      .filter(item => !["class", "style"].includes(item))
      .map(function (key) {
        return key + '="' + options.hash[key] + '"'
      })
      .join(" ")

    const attributesContent = attrs ? ` ${attrs} ` : " "
    const defaultClass = `tile-${this.media} ugc-tile`
    const customClass = options.hash.class || ""
    const customStyle = options.hash.style || ""
    const className = `${defaultClass} ${customClass}`.trim()
    const style = customStyle.trim()

    return `<div class="${className}"${attributesContent}data-id="${this.id}"${style ? ` style="${style}"` : ""}>${options.fn(this)}</div>`
  })
}
