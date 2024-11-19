type TiktokMessageType = "play" | "pause" | "mute" | "unMute" | "seekTo"

export function playTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "unMute")
  postTiktokMessage(frameWindow, "play")
}

export function pauseTiktokVideo(frameWindow: Window) {
  postTiktokMessage(frameWindow, "mute")
  postTiktokMessage(frameWindow, "pause")
  postTiktokMessage(frameWindow, "seekTo", 0)
}

export function postTiktokMessage(frameWindow: Window, type: TiktokMessageType, value?: number) {
  frameWindow.postMessage({ type, value, "x-tiktok-player": true }, "https://www.tiktok.com")
}
