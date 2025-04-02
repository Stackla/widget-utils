import Handlebars from "handlebars"
import { loadIfAutoPlayVideoHelper } from "./if-auto-play-video.helper"

describe("loadIfAutoPlayVideoHelper", () => {
  beforeAll(() => {
    loadIfAutoPlayVideoHelper(Handlebars)
  })

  it("should render the block if the media is video and config is enabled", () => {
    const template = Handlebars.compile(`
      {{#ifAutoPlayVideo media auto_play_video}}
        Equal
      {{else}}
        Not Equal
      {{/ifAutoPlayVideo}}
    `)

    const result = template({ media: "video", auto_play_video: true })
    expect(result.trim()).toBe("Equal")
  })

  it("should render the inverse block if auto_play_video is not enabled", () => {
    const template = Handlebars.compile(`
      {{#ifAutoPlayVideo media auto_play_video}}
        Equal
      {{else}}
        Not Equal
      {{/ifAutoPlayVideo}}
    `)

    const result = template({ media: "video", auto_play_video: false })
    expect(result.trim()).toBe("Not Equal")
  })

  it("should render the inverse block if media is not video", () => {
    const template = Handlebars.compile(`
      {{#ifAutoPlayVideo media auto_play_video}}
        Equal
      {{else}}
        Not Equal
      {{/ifAutoPlayVideo}}
    `)

    const result = template({ media: "image", auto_play_video: true })
    expect(result.trim()).toBe("Not Equal")
  })
})
