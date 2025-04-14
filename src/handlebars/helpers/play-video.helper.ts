import Handlebars from "handlebars"

function getImageTag(imageLink: string, tileId: string) {
  return `
  <div class="icon-play"></div>
  <img class='fallback-image' tile-id="${tileId}" src="${imageLink}" loading="lazy" width="120"/>
  `
}

function getManipulateFunctionString() {
  return `this.removeAttribute('controls'); 
  this.muted=true; 
  this.parentElement.querySelector('.fallback-image').style.display='none'; 
  this.style.display='flex';
  this.parentElement.parentElement.querySelector('.icon-play').style.display='none';
  `
}

export function createVideoTag(attributes: string, videoLink: string, imageLink: string, tileId: string) {
  return `${getImageTag(imageLink, tileId)}<video style="display:none;" ${attributes} preload="metadata" class="video-content" loading="lazy"  
  oncanplaythrough="${getManipulateFunctionString()}" 
  controls autoplay muted loop>
  <source src="${videoLink + "#t=0.1"}" type="video/mp4">
  </video>`
}

export function loadPlayVideoHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("playVideo", function (tile, width, height) {
    let videoTag = ""
    const escapedWidth = typeof width === "string" ? hbs.escapeExpression(width) : ""
    const escapedHeight = typeof height === "string" ? hbs.escapeExpression(height) : ""
    const source = tile.source
    const imageTag = getImageTag(tile.image, tile.id)

    switch (source) {
      case "tiktok": {
        const tiktokId = tile.original_url.split("/")[5].split("?")[0]
        const videoLink = `https://www.tiktok.com/player/v1/${tiktokId}?autoplay=1&loop=1`
        videoTag =
          `${imageTag}<iframe` +
          buildWidthHeightAttributes(escapedWidth, escapedHeight) +
          ` loading="lazy" onload="${getManipulateFunctionString()}" class="video-content" allowfullscreen src="${videoLink}"></iframe>`
        break
      }
      case "youtube": {
        const youtubeEmbedUrl = tile.embed_url ?? ""
        const youtubeVideoLink = `//www.youtube.com/embed/${youtubeEmbedUrl}?autoplay=1&mute=1&playlist=${youtubeEmbedUrl}&loop=1`
        videoTag =
          `${imageTag}<iframe` +
          buildWidthHeightAttributes(escapedWidth, escapedHeight) +
          ` loading="eager" onload="${getManipulateFunctionString()}" class="video-content" allowfullscreen src="${youtubeVideoLink}"></iframe>`
        break
      }
      default: {
        const videoUrl = tile?.video?.standard_resolution.url ?? ""
        const escapedVideoUrl = hbs.escapeExpression(videoUrl)
        const widthHeightAttributes = buildWidthHeightAttributes(escapedWidth, escapedHeight)

        videoTag = createVideoTag(widthHeightAttributes, escapedVideoUrl, tile.image, tile.id)
      }
    }

    return new hbs.SafeString(videoTag)
  })
}

function buildWidthHeightAttributes(width: string, height: string) {
  return `${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""}`
}
