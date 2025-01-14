/* eslint-disable no-var */
import { embed } from "."
import fetchMock from "jest-fetch-mock"
import { getWidgetV2EmbedCode } from "./v2"
import { getWidgetV3EmbedCode } from "./v3"
import { generateDataHTMLStringByParams } from "./embed.params"
import {
  STAGING_LEGACY_WIDGET_URL,
  PRODUCTION_LEGACY_WIDGET_URL,
  STAGING_DATA_URL,
  STAGING_UI_URL,
  PRODUCTION_DATA_URL,
  PRODUCTION_UI_URL
} from "../constants"

declare global {
  var STAGING_LEGACY_WIDGET_URL: string
  var PRODUCTION_LEGACY_WIDGET_URL: string
  var STAGING_DATA_URL: string
  var STAGING_UI_URL: string
  var PRODUCTION_DATA_URL: string
  var PRODUCTION_UI_URL: string
}

fetchMock.enableMocks()

const REQUEST_URL = "https://widget-data.stackla.com/123/version"

describe("load embed code", () => {
  beforeEach(() => {
    global.STAGING_LEGACY_WIDGET_URL = STAGING_LEGACY_WIDGET_URL
    global.PRODUCTION_LEGACY_WIDGET_URL = PRODUCTION_LEGACY_WIDGET_URL
    global.STAGING_DATA_URL = STAGING_DATA_URL
    global.STAGING_UI_URL = STAGING_UI_URL
    global.PRODUCTION_DATA_URL = PRODUCTION_DATA_URL
    global.PRODUCTION_UI_URL = PRODUCTION_UI_URL
    fetchMock.resetMocks()
  })

  it("should return the correct embed code for v2", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: "2" })
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

    expect(createdDiv.innerHTML).toBe(getWidgetV2EmbedCode({ foo: "bar", baz: 123 }, "production"))
  })

  it("should return the correct embed code for v3", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: "3" })
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

    expect(createdDiv.innerHTML).toBe(getWidgetV3EmbedCode({ foo: "bar", baz: 123 }, "production"))
  })

  it("should throw an error if the version is not supported", async () => {
    fetchMock.mockIf(REQUEST_URL, async () => {
      return JSON.stringify({ version: "4" })
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
      version: "3",
      dataProperties: {
        foo: "bar",
        baz: 123
      },
      environment: "production"
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(createdDiv.innerHTML).toBe(getWidgetV3EmbedCode({ foo: "bar", baz: 123 }, "production"))
  })

  it("should test param string method", async () => {
    const params = generateDataHTMLStringByParams({ foo: "bar", baz: 123 })

    expect(params).toBe(' data-foo="bar" data-baz="123"')
  })
})
