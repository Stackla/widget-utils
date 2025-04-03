import Handlebars from "handlebars"
import { loadIfHasPublicTags } from "./if-has-public-tags.helper"

describe("hasPublicTagsHelper", () => {
  beforeAll(() => {
    loadIfHasPublicTags(Handlebars)
  })

  it("should render the public tags item because public tags exist", () => {
    const template = Handlebars.compile(`
      {{#ifHasPublicTags tile}}
        Display
      {{else}}
        Not Display
      {{/ifHasPublicTags}}
    `)

    const result = template({
      tile: {
        tags_extended: [
          {
            publicly_visible: 1
          }
        ]
      }
    })
    expect(result.trim()).toBe("Display")
  })

  it("should not render the public tags item because public tags do not exist", () => {
    const template = Handlebars.compile(`
      {{#ifHasPublicTags tile}}
        Display
      {{else}}
        Not Display
      {{/ifHasPublicTags}}
    `)

    const result = template({
      tile: {
        publicly_visible: 0
      }
    })
    expect(result.trim()).toBe("Not Display")
  })
})
