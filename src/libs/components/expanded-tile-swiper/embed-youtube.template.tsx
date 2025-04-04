import { createElement } from "../../"

export type EmbedYoutubeProps = {
  tileId: string
  videoId: string
  onLoad?: (event: Event) => void
}

export function EmbedYoutube({ tileId, videoId, onLoad }: EmbedYoutubeProps) {
  const contentElement = loadYoutubeIframeContent(tileId, videoId)

  return (
    <iframe
      loading="lazy"
      id={`yt-frame-${tileId}-${videoId}`}
      tileid={tileId}
      class="video-content"
      height="360px"
      width="480px"
      frameborder="0"
      enablejsapi="1"
      onload={onLoad}
      srcdoc={contentElement.innerHTML}></iframe>
  )
}

function loadYoutubeIframeContent(tileId: string, videoId: string) {
  const scriptId = `yt-script-${tileId}-${videoId}`
  const playerId = `yt-player-${tileId}-${videoId}`
  return (
    <html>
      <head>
        <script id={scriptId} src="https://www.youtube.com/iframe_api"></script>
        <script>{loadYoutubePlayerAPI(playerId, videoId)}</script>
        <style>{`
          body {
            margin: 0;
          }
        `}</style>
      </head>
      <body>
        <div id={playerId}></div>
      </body>
    </html>
  )
}

export function loadYoutubePlayerAPI(playerId: string, videoId: string) {
  return `
  let player

  function loadPlayer(playDefault = false) {
    player = new YT.Player("${playerId}", {
      width: "100%",
      videoId: "${videoId}",
      playerVars: {
        playsinline: 1
      },
      events: {
        onReady: playDefault ? play : pause,
        onError: errorHandler
      }
    })
  }

  // API runs automatically once the iframe-api JS is downloaded.
  // This will not run when re-opening expanded tile
  function onYouTubeIframeAPIReady() {
    loadPlayer()
  }

  function errorHandler(e) {
   player?.getIframe().dispatchEvent(new CustomEvent("yt-video-error", { detail: e }))
  }

  function pause() {
    if (!player) {
      loadPlayer(false) //needed when expanded tile re-opened
    } else {
      if (!player || !player.mute) {
        setTimeout(() => {
          pause()
        }, 500)

        return
      }

      player.mute()
      player.pauseVideo()
    }
  }

  function destroy() {
    player?.destroy()
  }

  function reset() {
    player?.seekTo(0, false)
  }
  
   function mute() {
    player?.mute()
  }

  function unMute() {
    player?.unMute()
  }

  function play() {
    if (!player) {
      loadPlayer(true) //needed when expanded tile re-opened
    } else {
      if (player.isMuted()) {
        player.unMute()
      }
      player.playVideo()
    }
  } `
}
