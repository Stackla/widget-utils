import Handlebars from "handlebars"
import _ from "lodash"

export function createVideoTag(attributes: string, videoLink: string) {
  return `<video ${attributes} preload="metadata" class="video-content" loading="lazy" controls autoplay muted loop>
  <source src="${videoLink + "#t=0.1"}" type="video/mp4">
  </video>`
}

export function loadPlayVideoHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("playVideo", function (tile, width, height) {
    let videoTag = ""
    const escapedWidth = typeof width === "string" ? hbs.escapeExpression(width) : ""
    const escapedHeight = typeof height === "string" ? hbs.escapeExpression(height) : ""
    const source = tile.source

    switch (source) {
      case "tiktok": {
        const tiktokId = tile.original_url.split("/")[5].split("?")[0]
        const videoLink = `https://www.tiktok.com/player/v1/${tiktokId}?autoplay=1&loop=1`
        videoTag =
          `<iframe` +
          buildWidthHeightAttributes(escapedWidth, escapedHeight) +
          ` loading="lazy" class="video-content" allowfullscreen src="${videoLink}"></iframe>`
        break
      }
      case "youtube": {
        const youtubeEmbedUrl = _.get(tile, "embed_url", "")
        const youtubeVideoLink = `//www.youtube.com/embed/${youtubeEmbedUrl}?autoplay=1&mute=1&playlist=${youtubeEmbedUrl}&loop=1`
        videoTag =
          `<iframe` +
          buildWidthHeightAttributes(escapedWidth, escapedHeight) +
          ` loading="lazy" class="video-content" allowfullscreen src="${youtubeVideoLink}"></iframe>`
        break
      }
      default: {
        const videoUrl = _.get(tile, "video.standard_resolution.url")
        const escapedUrl = hbs.escapeExpression(videoUrl)
        const widthHeightAttributes = buildWidthHeightAttributes(escapedWidth, escapedHeight)

        videoTag = createVideoTag(widthHeightAttributes, escapedUrl)
      }
    }

    return new hbs.SafeString(videoTag)
  })
}

function buildWidthHeightAttributes(width: string, height: string) {
  return `${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""}`
}
