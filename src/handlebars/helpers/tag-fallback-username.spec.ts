import Handlebars from "handlebars"
import { loadTagFallbackUsernameHelper } from "./tag-fallback-username"

describe("tagFallbackUsername helper", () => {
  beforeAll(() => {
    loadTagFallbackUsernameHelper(Handlebars)
  })

  const compile = (context: unknown, fallback = "fallback") => {
    const template = Handlebars.compile(
      `{{tagFallbackUsername tags_extended=tile.tags_extended user=tile.user terms=tile.terms fallback='${fallback}'}}`
    )
    return template({ tile: context })
  }

  it("returns public content tag with @ if present", () => {
    const tile = {
      tags_extended: [
        { type: "content", publicly_visible: 1, tag: "@public_handle" },
        { type: "content", publicly_visible: 1, tag: "not_a_handle" }
      ],
      user: "user1",
      terms: ["term1"]
    }
    expect(compile(tile)).toContain("@public_handle")
  })

  it("returns user handle if no matching tag", () => {
    const tile = {
      tags_extended: [{ type: "content", publicly_visible: 1, tag: "not_a_handle" }],
      user: "user2",
      terms: ["term2"]
    }
    expect(compile(tile)).toContain("@user2")
  })

  it("returns first term if no tag and no user", () => {
    const tile = {
      tags_extended: [],
      terms: ["term3"]
    }
    expect(compile(tile)).toContain("@term3")
  })

  it("returns fallback if no tag, no user, no terms", () => {
    const tile = {
      tags_extended: []
    }
    expect(compile(tile, "oneractive")).toContain("@oneractive")
  })

  it("returns first matching tag if multiple present", () => {
    const tile = {
      tags_extended: [
        { type: "content", publicly_visible: 1, tag: "@first" },
        { type: "content", publicly_visible: 1, tag: "@second" }
      ],
      user: "user3"
    }
    expect(compile(tile)).toContain("@first")
  })
})
