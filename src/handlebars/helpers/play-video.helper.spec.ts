import Handlebars from "handlebars"
import { loadPlayVideoHelper } from "./play-video.helper"

describe("loadPlayVideoHelper", () => {
  beforeAll(() => {
    loadPlayVideoHelper(Handlebars)
  })

  it("should generate a video tag with url, width and height", () => {
    const template = Handlebars.compile(`{{playVideo tile width height}}`)

    const result = template({
      tile: {
        source: "instagram",
        video: {
          standard_resolution: {
            url: "https://example.com/video.mp4"
          }
        }
      },
      width: "100%",
      height: "100%"
    })
    expect(result.trim()).toMatchSnapshot()
  })

  it("should escape the URL, width and height to prevent XSS", () => {
    const template = Handlebars.compile(`{{playVideo tile width}}`)

    const result = template({
      tile: {
        source: "instagram",
        video: {
          standard_resolution: {
            url: "https://example.com/<script>alert(1)</script>.mp4"
          }
        }
      },
      width: '100" onClick="alert(1)',
      height: '100" onClick="alert(1)'
    })

    expect(result.trim()).toMatchSnapshot()
  })

  it("should handle undefined width and height gracefully", () => {
    const template = Handlebars.compile(`{{playVideo tile}}`)

    const result = template({
      tile: {
        source: "instagram",
        video: {
          standard_resolution: {
            url: "https://example.com/video.mp4"
          }
        }
      }
    })
    expect(result.trim()).toMatchSnapshot()
  })

  it("should return an empty string if URL is null or undefined", () => {
    const template = Handlebars.compile(`{{playVideo tile}}`)

    const result = template({
      tile: {
        source: "instagram",
        video: {
          standard_resolution: {
            url: null
          }
        }
      }
    })
    expect(result.trim()).toMatchSnapshot()
  })

  it("should generate a video with embedly html", () => {
    const template = Handlebars.compile(`{{playVideo tile width height}}`)

    const result = template({
      tile: {
        source: "tiktok",
        original_url:
          "https://www.tiktok.com/@jacquefromtheblock/video/7226405581324651819?is_from_webapp=1&sender_device=pc&web_id=7204611010241037826"
      },
      width: "100%",
      height: "100%"
    })
    expect(result.trim()).toMatchSnapshot()
  })
})
