import Handlebars from "handlebars"
import { loadJoinHelper } from "./join.helper"

describe("loadJoinHelper", () => {
  beforeAll(() => {
    loadJoinHelper(Handlebars)
  })

  it("should concatenate simple strings", () => {
    const template = Handlebars.compile(`
      {{join a b}}
    `)

    const result = template({ a: "data-", b: "value" })
    expect(result.trim()).toBe("data-value")
  })

  it("should concatenate expression strings", () => {
    const hbsTemplate = Handlebars.compile(`
      {{#tiles}}
        {{join "data-" @index}}
      {{/tiles}}
    `)

    const context = {
      tiles: [
        {
          id: "1234",
          media: "video",
          title: "Video Title"
        },
        {
          id: "5678",
          media: "image",
          title: "Image Title"
        }
      ]
    }

    const output = hbsTemplate(context)

    const expectedOutput = `data-0data-1`

    expect(output.replaceAll(/[\r\n\s]+/g, "")).toEqual(expectedOutput)
  })
})
