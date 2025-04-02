import Handlebars from "handlebars"

export function loadLazyHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("lazy", function (url, width, alt) {
    const escapedUrl = hbs.escapeExpression(url)
    const escapedAlt = typeof alt == "string" ? hbs.escapeExpression(alt) : ""
    const escapedWidth = typeof width == "string" ? hbs.escapeExpression(width) : ""

    let imgTag = `<img src="${escapedUrl}" loading="lazy"`

    if (escapedAlt) {
      imgTag += ` alt="${escapedAlt}"`
    }

    if (escapedWidth) {
      imgTag += ` width="${escapedWidth}"`
    }

    imgTag += " />"

    return new hbs.SafeString(imgTag)
  })
}
