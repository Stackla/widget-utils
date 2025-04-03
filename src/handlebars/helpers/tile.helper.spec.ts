import Handlebars from "handlebars"
import { loadTileHelper } from "./tile.helper"
import { loadJoinHelper } from "./join.helper"

beforeAll(() => {
  loadTileHelper(Handlebars)
  loadJoinHelper(Handlebars)
})

describe("tile helper", () => {
  it("should render div with default class and style inferred from context", () => {
    const template = Handlebars.compile(`{{#tile}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "1234",
      media: "video",
      title: "Video Title"
    }

    const output = template(context)

    expect(output).toEqual('<div class="tile-video ugc-tile" data-id="1234"><p>Video Title</p></div>')
  })

  it("should merge custom class and style with default values", () => {
    const template = Handlebars.compile(`{{#tile class="custom-class" style="color: red;"}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "5678",
      media: "image",
      title: "Hello world!"
    }

    const output = template(context)

    expect(output).toEqual(
      '<div class="tile-image ugc-tile custom-class" data-id="5678" style="color: red;"><p>Hello world!</p></div>'
    )
  })

  it("should work when no custom class or style is provided", () => {
    const template = Handlebars.compile(`{{#tile}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "9101",
      media: "video",
      title: "Youtube Title"
    }

    const output = template(context)

    expect(output).toEqual('<div class="tile-video ugc-tile" data-id="9101"><p>Youtube Title</p></div>')
  })

  it("should handle empty context values gracefully", () => {
    const template = Handlebars.compile(`{{#tile}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "",
      media: "",
      title: "Another one"
    }

    const output = template(context)

    expect(output).toEqual('<div class="tile- ugc-tile" data-id=""><p>Another one</p></div>')
  })

  it("should allow only custom class and no style", () => {
    const template = Handlebars.compile(`{{#tile class="my-custom-class"}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "1112",
      media: "image",
      title: "Hello world!"
    }

    const output = template(context)

    expect(output).toEqual('<div class="tile-image ugc-tile my-custom-class" data-id="1112"><p>Hello world!</p></div>')
  })

  it("should allow only custom style and no class", () => {
    const template = Handlebars.compile(`{{#tile style="margin: 10px;"}}<p>{{title}}</p>{{/tile}}`)
    const context = {
      id: "1314",
      media: "video",
      title: "Hello world!"
    }

    const output = template(context)

    expect(output).toEqual(
      '<div class="tile-video ugc-tile" data-id="1314" style="margin: 10px;"><p>Hello world!</p></div>'
    )
  })

  it("should also render additional attrs", () => {
    const template = Handlebars.compile(
      `{{#tile style="margin: 10px;" data-hash="plugin-hash"}}<p>{{title}}</p>{{/tile}}`
    )
    const context = {
      id: "1314",
      media: "video",
      title: "Hello world!"
    }

    const output = template(context)

    expect(output).toEqual(
      '<div class="tile-video ugc-tile" data-hash="plugin-hash" data-id="1314" style="margin: 10px;"><p>Hello world!</p></div>'
    )
  })

  it("should render multiple tiles using the tpl-tile partial", () => {
    Handlebars.registerPartial(
      "tpl-tile",
      `{{#tile style="margin: 10px;" data-hash=(join "plugin-" @index)}}<p>{{title}}</p>{{/tile}}`
    )
    const hbsTemplate = Handlebars.compile(`
      {{#tiles}}
        {{>tpl-tile}}
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

    const expectedOutput = `
      <div class="tile-video ugc-tile" data-hash="plugin-0" data-id="1234" style=" margin: 10px;"><p>Video Title</p></div>        
      <div class="tile-image ugc-tile" data-hash="plugin-1" data-id="5678" style=" margin: 10px;"><p>Image Title</p></div>
    `.replaceAll(/[\r\n\s]+/g, "")

    expect(output.replaceAll(/[\r\n\s]+/g, "")).toEqual(expectedOutput)
  })
})
