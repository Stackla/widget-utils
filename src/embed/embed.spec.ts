import { embed } from "."
import fetchMock from "jest-fetch-mock"
import { getWidgetV2EmbedCode } from "./v2"
import { getWidgetV3EmbedCode } from "./v3"
fetchMock.enableMocks()

const REQUEST_URL = "https://widget-data.stackla.com/123/version"

describe("load embed code", () => {
  beforeEach(() => {
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
      }
    })

    expect(createdDiv.innerHTML).toBe(getWidgetV2EmbedCode({ foo: "bar", baz: 123 }))
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
      }
    })

    expect(createdDiv.innerHTML).toBe(getWidgetV3EmbedCode({ foo: "bar", baz: 123 }))
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
        }
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
      }
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(createdDiv.innerHTML).toBe(getWidgetV3EmbedCode({ foo: "bar", baz: 123 }))
  })
})
