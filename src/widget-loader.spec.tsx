import { callbackDefaults } from "./events"
import { injectFontFaces } from "./fonts"
import { loadExpandedTileTemplates } from "./libs/components/expanded-tile-swiper"
import { EnforcedWidgetSettings } from "./types"
import { loadTemplates } from "./widget-loader"

const sdk = {
  addTemplateToComponent: jest.fn(),
  placement: {
    getWidgetId: jest.fn().mockReturnValue("widget-id"),
    injectStaticComponentStyle: jest.fn()
  }
}

// @ts-expect-error globals
global.sdk = sdk

jest.mock("./libs/components/expanded-tile-swiper", () => ({
  loadExpandedTileTemplates: jest.fn()
}))

const settings: EnforcedWidgetSettings = {
  features: {
    showTitle: true,
    preloadImages: true,
    disableWidgetIfNotEnabled: true,
    addNewTilesAutomatically: true,
    handleLoadMore: true,
    hideBrokenImages: true,
    loadExpandedTileSlider: true,
    loadTileContent: true,
    loadTimephrase: true
  },
  callbacks: {
    ...callbackDefaults
  },
  extensions: {
    swiper: false,
    masonry: false
  },
  templates: {
    direct_uploader: {
      template: () => "<p>Hello!</p>"
    },
    shopspots: {
      template: () => "<p>Hi!</p>"
    }
  },
  config: {}
}

describe("loadTemplates", () => {
  beforeEach(() => {
    jest.clearAllMocks() // Clear mocks before each test
  })

  it("should call loadExpandedTileTemplates when loadExpandedTileSlider is true", () => {
    loadTemplates(settings)

    expect(loadExpandedTileTemplates).toHaveBeenCalled()
  })

  it("should not call loadExpandedTileTemplates when loadExpandedTileSlider is false", () => {
    const mutatedSettings = {
      ...settings,
      features: {
        ...settings.features,
        loadExpandedTileSlider: false
      }
    }

    loadTemplates(mutatedSettings)

    expect(loadExpandedTileTemplates).not.toHaveBeenCalled()
  })

  it("should not add templates if settings.templates is empty or undefined", () => {
    const mutatedSettings = {
      ...settings,
      templates: {}
    }

    loadTemplates(mutatedSettings)
    expect(sdk.addTemplateToComponent).not.toHaveBeenCalled()
  })

  it("should process templates with custom templates correctly", () => {
    const mutatedSettings = {
      ...settings,
      templates: {
        shopspots: {
          styles: [
            {
              css: "body { color: red; }",
              global: false
            }
          ],
          template: () => "<p>Hello!</p>"
        }
      }
    }

    loadTemplates(mutatedSettings)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(sdk.addTemplateToComponent).toHaveBeenCalledWith(expect.any(Function), "shopspots")
  })

  it("should process global styles correctly", () => {
    const mutatedSettings = {
      ...settings,
      templates: {
        shopspots: {
          styles: [
            {
              css: "body { color: red; }",
              global: true
            },
            {
              css: "body { color: blue; }",
              global: false
            }
          ],
          template: () => "<p>Hello!</p>"
        }
      }
    }

    loadTemplates(mutatedSettings)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    expect(sdk.addTemplateToComponent).toHaveBeenCalledWith(expect.any(Function), "shopspots")
  })

  it("should inject fonts when provided in config", () => {
    const mutatedSettings = {
      ...settings,
      config: {
        fonts: [
          {
            fontFamily: "Arial",
            fontWeight: "400",
            fontStyle: "normal",
            src: [
              {
                url: "https://example.com/font.woff2",
                format: "woff2"
              }
            ]
          }
        ]
      }
    }

    injectFontFaces(document.head, mutatedSettings.config.fonts)

    expect(document.head.querySelector("style")).toBeTruthy()
    expect(document.head.querySelector("style")?.innerHTML).toContain("font-family: Arial")
    expect(document.head.querySelector("style")?.innerHTML).toContain(
      'src: url("https://example.com/font.woff2") format("woff2")'
    )
    expect(document.head.querySelector("style")?.innerHTML).toContain("font-weight: 400")
    expect(document.head.querySelector("style")?.innerHTML).toContain("font-style: normal")
    expect(document.head.querySelector("style")?.innerHTML).not.toContain("font-display")
  })
})
