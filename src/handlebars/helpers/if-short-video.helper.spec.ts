import Handlebars from "handlebars"
import { loadIfShortVideoHelper } from "./if-short-video.helper"

describe("loadIfShortVideoHelper", () => {
  beforeAll(() => {
    loadIfShortVideoHelper(Handlebars)
  })

  it("should render the Display block if the media is instagram reel", () => {
    const template = Handlebars.compile(`
      {{#ifShortVideo tile}}
        Display
      {{else}}
        Not Display
      {{/ifShortVideo}}
    `)

    const result = template({
      tile: {
        source: "instagram",
        attrs: ["src:graph", "instagram.reel"],
        media: "video"
      }
    })
    expect(result.trim()).toBe("Display")
  })

  it("should render the Display block if the media is youtube short", () => {
    const template = Handlebars.compile(`
      {{#ifShortVideo tile}}
        Display
      {{else}}
        Not Display
      {{/ifShortVideo}}
    `)

    const result = template({
      tile: {
        source: "youtube",
        attrs: ["src:graph", "youtube.short"],
        media: "video"
      }
    })
    expect(result.trim()).toBe("Display")
  })

  it("should render the Display block if the media is tiktok short", () => {
    const template = Handlebars.compile(`
      {{#ifShortVideo tile}}
        Display
      {{else}}
        Not Display
      {{/ifShortVideo}}
    `)

    const result = template({
      tile: {
        source: "tiktok",
        attrs: ["src:graph", "tiktok.short"],
        media: "video"
      }
    })
    expect(result.trim()).toBe("Display")
  })

  it("should render the Not Display block if the media is not youtube short", () => {
    const template = Handlebars.compile(`
      {{#ifShortVideo tile}}
        Display
      {{else}}
        Not Display
      {{/ifShortVideo}}
    `)

    const result = template({
      tile: {
        source: "youtube",
        attrs: ["src:graph"],
        media: "video"
      }
    })
    expect(result.trim()).toBe("Not Display")
  })

  it("should render the Not Display block if the media is other platforms", () => {
    const template = Handlebars.compile(`
      {{#ifShortVideo tile}}
        Display
      {{else}}
        Not Display
      {{/ifShortVideo}}
    `)

    const result = template({
      tile: {
        source: "Pinterest",
        attrs: ["src:graph", "tiktok.short"],
        media: "video"
      }
    })
    expect(result.trim()).toBe("Not Display")
  })
})
