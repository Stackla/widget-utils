import Handlebars from "handlebars"
import { loadIconsHelper } from "./load-icons.helper"
import { TagExtended } from "../../types"

describe("loadIconsHelper", () => {
  beforeAll(() => {
    loadIconsHelper(Handlebars)
  })

  it("should generate HTML with Instagram reel icon and product tags", () => {
    const tile = {
      id: "123",
      attrs: ["instagram.reel"],
      tags_extended: [{ type: "product" } as TagExtended],
      media: "image",
      source: "instagram"
    }

    const template = Handlebars.compile(`{{loadIcons tile}}`)
    const result = template({ tile })

    expect(result).toContain('<div class="content-icon icon-reel"></div>')
    expect(result).toContain('<div class="shopping-icon icon-products"></div>')
    expect(result).toContain('<div class="network-icon icon-instagram"></div>')
  })

  it("should generate HTML with video play icon", () => {
    const tile = {
      id: "456",
      attrs: [],
      tags_extended: [],
      media: "video",
      source: "youtube"
    }

    const template = Handlebars.compile(`{{loadIcons tile}}`)
    const result = template({ tile })

    expect(result).toContain('<div class="icon-play"></div>')
    expect(result).toContain('<div class="network-icon icon-youtube"></div>')
  })

  it("should generate HTML without Instagram reel or product tags", () => {
    const tile = {
      id: "789",
      attrs: [],
      tags_extended: [],
      media: "image",
      source: "twitter"
    }

    const template = Handlebars.compile(`{{loadIcons tile}}`)
    const result = template({ tile })

    expect(result).not.toContain('<div class="content-icon icon-reel"></div>')
    expect(result).not.toContain('<div class="shopping-icon icon-products"></div>')
    expect(result).toContain('<div class="network-icon icon-twitter"></div>')
  })
})
