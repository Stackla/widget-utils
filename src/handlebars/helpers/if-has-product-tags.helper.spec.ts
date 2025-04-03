import Handlebars from "handlebars"
import { loadIfHasProductTags } from "./if-has-product-tags.helper"

describe("hasProductTagsHelper", () => {
  beforeAll(() => {
    loadIfHasProductTags(Handlebars)
  })

  it("should render the product tags item because product tags exist", () => {
    const template = Handlebars.compile(`
      {{#ifHasProductTags tile}}
        Display
      {{else}}
        Not Display
      {{/ifHasProductTags}}
    `)

    const result = template({
      tile: {
        tags_extended: [
          {
            type: "product"
          }
        ]
      }
    })
    expect(result.trim()).toBe("Display")
  })

  it("should not render the product tags item because product tags do not exist", () => {
    const template = Handlebars.compile(`
      {{#ifHasProductTags tile}}
        Display
      {{else}}
        Not Display
      {{/ifHasProductTags}}
    `)

    const result = template({
      tile: {
        tags_extended: []
      }
    })
    expect(result.trim()).toBe("Not Display")
  })

  it("should not render because all tags are system tags", () => {
    const template = Handlebars.compile(`
      {{#ifHasProductTags tile}}
        Display
      {{else}}
        Not Display
      {{/ifHasProductTags}}
    `)

    const result = template({
      tile: {
        tags_extended: [
          {
            type: "system"
          }
        ]
      }
    })
    expect(result.trim()).toBe("Not Display")
  })
})
