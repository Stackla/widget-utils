/* eslint-disable no-var */
import { embed } from "."
import fetchMock from "jest-fetch-mock"
import { getWidgetV2EmbedCode } from "./v2"
import { getWidgetV3EmbedCode } from "./v3"
import { generateDataHTMLStringByParams } from "./embed.params"

fetchMock.enableMocks()

const REQUEST_URL = "https://widget-data.stackla.com/widgets/123/version"
const STAGING_REQUEST_URL = "https://widget-data.teaser.stackla.com/widgets/123/version"

describe("load embed code", () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it("should return the correct embed code for v2", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: 2 })
    })

    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "production"
    })

    expect(createdDiv.innerHTML).toContain(getWidgetV2EmbedCode({ foo: "bar", baz: 123, hash: "123" }))
    expect(createdDiv.innerHTML).toMatchSnapshot()
  })

  it("should test staging for v2", async () => {
    fetchMock.mockIf(STAGING_REQUEST_URL, async () => {
      return JSON.stringify({ version: 2 })
    })

    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "staging"
    })

    expect(window.stackWidgetDomain).toBe("widgetapp.teaser.stackla.com")
  })

  it("should test production for v2", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: 2 })
    })

    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "production"
    })

    expect(window.stackWidgetDomain).toBe("widgetapp.stackla.com")
  })

  it("should return the correct embed code for v3", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: 3 })
    })

    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "production"
    })

    expect(createdDiv.innerHTML).toContain(getWidgetV3EmbedCode({ foo: "bar", baz: 123, wid: "123" }))
    expect(createdDiv.innerHTML).toContain(`<div id="ugc-widget" data-foo="bar" data-baz="123" data-wid="123"></div>`)
  })

  it("should throw an error if the version is not supported", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: 4 })
    })

    const createdDiv = document.createElement("div")
    try {
      await embed({
        widgetId: "123",
        root: createdDiv,
        dataProperties: {
          foo: "bar",
          baz: 123
        },
        environment: "production"
      })
    } catch (error) {
      expect(error).toBe("Failed to embed widget. No widget code accessible with version 4")
    }
  })

  it("should skip the fetch call if the version is provided", async () => {
    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      version: 3,
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "production"
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(createdDiv.innerHTML).toContain(getWidgetV3EmbedCode({ foo: "bar", baz: 123, wid: "123" }))
    expect(createdDiv.innerHTML).toContain('<div id="ugc-widget" data-foo="bar" data-baz="123" data-wid="123"></div>')
  })

  it("should test param string method", async () => {
    const params = generateDataHTMLStringByParams({ foo: "bar", baz: 123, wid: "123" })

    expect(params).toBe(' data-foo="bar" data-baz="123" data-wid="123"')
  })

  it("should deal with malicious payloads", async () => {
    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      version: 3,
      dataProperties: {
        foo: "bar",
        baz: 123,
        '><img src="x" onerror="alert(1)">': '"><img src="x" onerror="alert(1)">'
      },
      environment: "production"
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(createdDiv.innerHTML).toContain(
      // eslint-disable-next-line no-useless-escape
      `<div id=\"ugc-widget\" data-foo=\"bar\" data-baz=\"123\" data-&gt;<img=\"\" src=\"x\">=\"\"&gt;<img src=\"x\">\" data-wid=\"123\"&gt;</div>`
    )
  })

  it("should deal with malicious payloads", async () => {
    const createdDiv = document.createElement("div")
    await embed({
      widgetId: "123",
      root: createdDiv,
      version: 3,
      dataProperties: {
        foo: "bar",
        baz: 123,
        tags: "ext%3A8794633601273"
      },
      environment: "production"
    })

    expect(createdDiv.innerHTML).toBe(
      // eslint-disable-next-line no-useless-escape
      `<div id=\"ugc-widget\" data-foo=\"bar\" data-baz=\"123\" data-tags=\"ext%3A8794633601273\" data-wid=\"123\"></div>`
    )
  })
})
