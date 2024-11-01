import { isEnabled, hasMinimumTilesRequired } from "./widget.layout"

const sdk = {
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(),
  getExpandedTileConfig: jest.fn(),
  getStyleConfig: jest.fn(),
  getConfig: jest.fn(),
  getWidgetOptions: jest.fn()
}

const defaultStyleSettings = {
  tiles_per_page: 10,
  enable_custom_tiles_per_page: false,
  auto_refresh: false
}

const defaultExpandedTileSettings = {
  show_shopspots: false,
  show_products: false,
  show_add_to_cart: false,
  show_nav_arrows: true
}

describe("Widget Settings Functions", () => {
  beforeEach(() => {
    // @ts-expect-error sdk is not defined in global since its exclusive to this test.
    global.sdk = sdk

    sdk.getStyleConfig.mockReturnValue(defaultStyleSettings)
    sdk.getExpandedTileConfig.mockReturnValue(defaultExpandedTileSettings)
    sdk.getWidgetOptions.mockReturnValue({
      enabled: true
    })
  })

  describe("hasMinimumTilesRequired", () => {
    it("returns true when minimal_tiles is not set", () => {
      const styleSettings = { ...defaultStyleSettings, minimal_tiles: undefined }
      sdk.getStyleConfig.mockReturnValue(styleSettings)
      expect(hasMinimumTilesRequired()).toBe(true)
    })

    it("returns true when minimal_tiles is set to 0", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 0 }
      sdk.getStyleConfig.mockReturnValue(widgetSettings)
      expect(hasMinimumTilesRequired()).toBe(true)
    })

    it("returns true when minimal_tiles is set and there are enough tiles", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 3 }
      sdk.getStyleConfig.mockReturnValue(widgetSettings)
      sdk.querySelectorAll.mockReturnValue([{}, {}, {}])
      expect(hasMinimumTilesRequired()).toBe(true)
    })

    it("throws error when minimum tiles is set and there are not enough tiles", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 3 }
      sdk.getStyleConfig.mockReturnValue(widgetSettings)
      sdk.querySelectorAll.mockReturnValue([{}])

      try {
        hasMinimumTilesRequired()
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe("Not enough tiles to render widget. Expected 3 but found 1")
        }
      }
    })
  })

  describe("isEnabled", () => {
    it("returns true when enabled is true and hasMinimumTilesRequired returns true", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 3 }
      sdk.getStyleConfig.mockReturnValue(widgetSettings)
      sdk.querySelectorAll.mockReturnValue([{}, {}, {}])
      expect(isEnabled()).toBe(true)
    })

    it("returns exception when enabled is true but hasMinimumTilesRequired returns false", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 3 }
      sdk.getStyleConfig.mockReturnValue(widgetSettings)

      sdk.querySelectorAll.mockReturnValue([{}])
      try {
        isEnabled()
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error)
        if (error instanceof Error) {
          expect(error.message).toBe("Not enough tiles to render widget. Expected 3 but found 1")
        }
      }
    })

    it("returns false when enabled is false", () => {
      const widgetSettings = { ...defaultStyleSettings, minimal_tiles: 1 }
      sdk.getWidgetOptions.mockReturnValue({
        enabled: false
      })
      sdk.getStyleConfig.mockReturnValue(widgetSettings)

      expect(isEnabled()).toBe(false)
    })
  })
})
