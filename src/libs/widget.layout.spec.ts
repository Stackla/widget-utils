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
})
