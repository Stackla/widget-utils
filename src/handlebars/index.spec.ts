import Handlebars from "handlebars"
import { renderTemplateWithPartials } from "./index"

// Mock helpers
jest.mock("./helpers", () => ({
  loadIfEqualsHelper: jest.fn(),
  loadLazyHelper: jest.fn(),
  loadTileHelper: jest.fn(),
  loadJoinHelper: jest.fn()
}))

describe("Handlebars Rendering Tests", () => {
  const tileTemplate = `<div><p>{{title}}</p>{{#if options.add_to_cart_enabled}}<p>bingo</p>{{/if}}{{#if options.blah_enabled}}<p>blah</p>{{/if}}`

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("renderTemplateWithPartials", () => {
    it("should register partials correctly and return the Handlebars instance", () => {
      const hbs = renderTemplateWithPartials(Handlebars.create(), {
        name: "tpl-tile",
        template: tileTemplate
      })

      const compiledTemplate = hbs.compile("{{> tpl-tile}}")
      const result = compiledTemplate({
        title: "Test Tile",
        options: {
          add_to_cart_enabled: true,
          blah_enabled: false
        }
      })
      expect(result).toEqual("<div><p>Test Tile</p><p>bingo</p>")
    })
  })
})
