import { copyToClipboard } from "./share-menu.listener"

describe("share menu listener", () => {
  beforeEach(() => {
    if (!global.document.execCommand) {
      Object.defineProperty(global.document, "execCommand", {
        value: jest.fn()
      })
    }

    if (!global.navigator.clipboard) {
      Object.defineProperty(global.navigator, "clipboard", {
        value: { writeText: jest.fn() }
      })
    }
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it("clipboard functionality with async api", async () => {
    const writeTextSpy = jest.spyOn(global.navigator.clipboard, "writeText")

    const inputElement = document.createElement("input")
    inputElement.value = "text to copy"

    await copyToClipboard(inputElement)

    expect(writeTextSpy).toHaveBeenCalledTimes(1)
    expect(global.document.execCommand).not.toHaveBeenCalled()
  })

  it("clipboard functionality with no async api", async () => {
    Object.defineProperty(global, "navigator", {
      value: { clipboard: undefined }
    })

    const execCommandSpy = jest.spyOn(global.document, "execCommand")

    const inputElement = document.createElement("input")
    inputElement.value = "text to copy"

    await copyToClipboard(inputElement)

    expect(execCommandSpy).toHaveBeenCalledTimes(1)
    // verifying if the input element text is selected during fallback
    expect(inputElement.selectionEnd).toBe(inputElement.value.length)
  })
})
