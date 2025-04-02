import Handlebars from "handlebars"
import { loadLazyHelper } from "./lazy.helper"

describe("loadLazyHelper", () => {
  beforeAll(() => {
    loadLazyHelper(Handlebars)
  })

  it("should generate a lazy-loading img tag with only the URL", () => {
    const template = Handlebars.compile(`{{lazy url}}`)

    const result = template({ url: "https://example.com/image.jpg" })
    expect(result.trim()).toBe('<img src="https://example.com/image.jpg" loading="lazy" />')
  })

  it("should generate a lazy-loading img tag with URL and alt text", () => {
    const template = Handlebars.compile(`{{lazy url null alt}}`)

    const result = template({
      url: "https://example.com/image.jpg",
      alt: "An example image"
    })
    expect(result.trim()).toBe('<img src="https://example.com/image.jpg" loading="lazy" alt="An example image" />')
  })

  it("should generate a lazy-loading img tag with URL, width, and alt text", () => {
    const template = Handlebars.compile(`{{lazy url width alt}}`)

    const result = template({
      url: "https://example.com/image.jpg",
      width: "300",
      alt: "An example image"
    })
    expect(result.trim()).toBe(
      '<img src="https://example.com/image.jpg" loading="lazy" alt="An example image" width="300" />'
    )
  })

  it("should escape the URL, alt, and width to prevent XSS", () => {
    const template = Handlebars.compile(`{{lazy url width alt}}`)

    const result = template({
      url: "https://example.com/<script>alert(1)</script>.jpg",
      width: '300" onerror="alert(1)',
      alt: "Image <danger>"
    })

    expect(result.trim()).toBe(
      `<img src="https://example.com/&lt;script&gt;alert(1)&lt;/script&gt;.jpg" loading="lazy" alt="Image &lt;danger&gt;" width="300&quot; onerror&#x3D;&quot;alert(1)" />`
    )
  })

  it("should handle undefined width and alt gracefully", () => {
    const template = Handlebars.compile(`{{lazy url}}`)

    const result = template({ url: "https://example.com/image.jpg" })
    expect(result.trim()).toBe('<img src="https://example.com/image.jpg" loading="lazy" />')
  })

  it("should return an empty string if URL is null or undefined", () => {
    const template = Handlebars.compile(`{{lazy url}}`)

    const result = template({ url: null })
    expect(result.trim()).toBe('<img src="" loading="lazy" />')
  })
})
