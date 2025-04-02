import Handlebars from "handlebars"
import { loadIfEqualsHelper } from "./ifequals.helper"

describe("loadIfEqualsHelper", () => {
  beforeAll(() => {
    loadIfEqualsHelper(Handlebars)
  })

  it("should render the block if the values are equal", () => {
    const template = Handlebars.compile(`
      {{#ifequals a b}}
        Equal
      {{else}}
        Not Equal
      {{/ifequals}}
    `)

    const result = template({ a: 1, b: 1 })
    expect(result.trim()).toBe("Equal")
  })

  it("should render the inverse block if the values are not equal", () => {
    const template = Handlebars.compile(`
      {{#ifequals a b}}
        Equal
      {{else}}
        Not Equal
      {{/ifequals}}
    `)

    const result = template({ a: 1, b: 2 })
    expect(result.trim()).toBe("Not Equal")
  })

  it("should render correctly when dealing with strings", () => {
    const template = Handlebars.compile(`
      {{#ifequals a b}}
        Same
      {{else}}
        Different
      {{/ifequals}}
    `)

    const result = template({ a: "hello", b: "hello" })
    expect(result.trim()).toBe("Same")
  })

  it("should handle undefined or null values correctly", () => {
    const template = Handlebars.compile(`
      {{#ifequals a b}}
        Match
      {{else}}
        No Match
      {{/ifequals}}
    `)

    const result = template({ a: null, b: undefined })
    expect(result.trim()).toBe("No Match")
  })

  it("should render empty string for missing inverse block and unequal values", () => {
    const template = Handlebars.compile(`
      {{#ifequals a b}}
        Match
      {{/ifequals}}
    `)

    const result = template({ a: 1, b: 2 })
    expect(result.trim()).toBe("")
  })
})
