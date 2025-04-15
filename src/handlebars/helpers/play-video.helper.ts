import Handlebars from "handlebars"
import { getIcons } from "./load-icons.helper"
import { Tile } from "../../types"

function getImageTag(tile: Tile, variant: "dark" | "light", context: string, navigationArrows: "true" | "false") {
  const { id, image } = tile

  return `
  ${getIcons(tile, variant, context, navigationArrows)}
  <img class='fallback-image' tile-id="${id}" src="${image}" loading="lazy" width="120"/>
  `
}

function getManipulateFunctionString() {
  return `this.removeAttribute('controls'); 
  this.muted=true; 
  this.parentElement.querySelector('.fallback-image').style.display='none'; 
  this.style.display='flex';
  this.parentElement.parentElement.parentElement.querySelectorAll('.icon-play').forEach((el) => {
    el.style.display='none';
  });
  `
}

export function createVideoTag(
  tile: Tile,
  variant: "dark" | "light",
  context: string,
  navigationArrows: "true" | "false"
) {
  const videoUrl = tile?.video?.standard_resolution.url ?? ""
  const escapedVideoUrl = Handlebars.escapeExpression(videoUrl)

  return `${getImageTag(tile, variant, context, navigationArrows)}<video style="display:none;" reload="metadata" class="video-content" loading="lazy"  
  oncanplaythrough="${getManipulateFunctionString()}" 
  controls autoplay muted loop>
  <source src="${escapedVideoUrl + "#t=0.1"}" type="video/mp4">
  </video>`
}

export function loadPlayVideoHelper(hbs: typeof Handlebars) {
  hbs.registerHelper("playVideo", function (tile, options) {
    const { variant = "dark", context = "unknown", navigationArrows = "true" } = options
    let videoTag = ""
    const source = tile.source
    const imageTag = getImageTag(tile, variant, context, navigationArrows)

    switch (source) {
      case "tiktok": {
        const tiktokId = tile.original_url.split("/")[5].split("?")[0]
        const videoLink = `https://www.tiktok.com/player/v1/${tiktokId}?autoplay=1&loop=1&controls=0`
        videoTag =
          `${imageTag}<iframe` +
          ` loading="lazy" onload="${getManipulateFunctionString()}" class="video-content" allowfullscreen src="${videoLink}"></iframe>`
        break
      }
      case "youtube": {
        const youtubeEmbedUrl = tile.embed_url ?? ""
        const youtubeVideoLink = `//www.youtube.com/embed/${youtubeEmbedUrl}?autoplay=1&mute=1&playlist=${youtubeEmbedUrl}&loop=1&controls=0`
        videoTag =
          `${imageTag}<iframe` +
          ` loading="eager" onload="${getManipulateFunctionString()}" class="video-content" allowfullscreen src="${youtubeVideoLink}"></iframe>`
        break
      }
      default: {
        videoTag = createVideoTag(tile, variant, context, navigationArrows)
      }
    }

    return new hbs.SafeString(videoTag)
  })
}
