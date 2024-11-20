import getCSSVariables, { getTileSizeByWidget, trimHashValuesFromObject } from "./css-variables"

// Mock sdk object globally
const sdk = {
  getStyleConfig: jest.fn(),
  getInlineTileConfig: jest.fn()
}

// @ts-expect-error global properties are not typed
global.sdk = sdk

describe("Widget Functions", () => {
  // Tests for getTileSizeByWidget
  describe("getTileSizeByWidget", () => {
    it("should return medium size when inline_tile_size is not defined", () => {
      sdk.getStyleConfig.mockReturnValue({})

      const result = getTileSizeByWidget()
      expect(result).toEqual({ "--tile-size": "265.5px", "--tile-size-unitless": "265.5" })
    })

    it("should return correct tile size based on inline_tile_size", () => {
      sdk.getStyleConfig.mockReturnValue({ inline_tile_size: "small" })
      expect(getTileSizeByWidget()).toEqual({ "--tile-size": "173px", "--tile-size-unitless": "173" })

      sdk.getStyleConfig.mockReturnValue({ inline_tile_size: "medium" })
      expect(getTileSizeByWidget()).toEqual({ "--tile-size": "265.5px", "--tile-size-unitless": "265.5" })

      sdk.getStyleConfig.mockReturnValue({ inline_tile_size: "large" })
      expect(getTileSizeByWidget()).toEqual({ "--tile-size": "400px", "--tile-size-unitless": "400" })
    })
  })
  // Tests for getCSSVariables
  describe("getCSSVariables", () => {
    it("should return the correct CSS variables", () => {
      sdk.getStyleConfig.mockReturnValue({
        widget_background: "ffffff",
        text_tile_background: "000000",
        text_tile_font_color: "333333",
        text_tile_link_color: "ff0000",
        text_tile_user_name_font_color: "0000ff",
        text_tile_user_handle_font_color: "00ff00",
        shopspot_btn_background: "ff00ff",
        shopspot_btn_font_color: "00ffff",
        margin: 10,
        text_tile_font_size: 16,
        text_caption_paragraph_font_size: 12,
        text_tile_user_name_font_size: 16,
        text_tile_user_handle_font_size: null,
        shopspot_icon: null,
        expanded_tile_border_radius: 5,
        tile_tag_background: "D6D4D5"
      })

      sdk.getInlineTileConfig.mockReturnValue({
        show_timestamp: true,
        show_caption: false
      })

      // Check if the generated CSS variables match the snapshot
      const cssVariables = getCSSVariables()
      expect(cssVariables).toMatchSnapshot()
    })

    it("should replace hashes with nothing in the returned object", () => {
      const value = trimHashValuesFromObject({
        widget_background: "#ffffff",
        text_tile_background: "#000000",
        text_tile_font_color: "#333333",
        text_tile_link_color: "#ff0000",
        text_tile_user_name_font_color: "#0000ff",
        text_tile_user_handle_font_color: "#00ff00",
        shopspot_btn_background: "#ff00ff",
        shopspot_btn_font_color: "#00ffff",
        margin: "10",
        text_tile_font_size: "16",
        text_caption_paragraph_font_size: "12",
        text_tile_user_name_font_size: "16",
        tile_tag_background: "#D6D4D5",
        auto_refresh: "",
        click_through_url: "",
        enable_custom_tiles_per_page: false,
        load_more_type: "",
        name: "",
        plugin_instance_id: "",
        polling_frequency: "",
        rows_per_page: "",
        shopspot_btn_font_size: "",
        shopspot_icon: "",
        style: "",
        text_tile_user_handle_font_size: "",
        tile_background: "",
        tiles_per_page: "",
        minimal_tiles: "",
        type: "",
        widget_height: "",
        widget_loading_image: "",
        unavailable_products_behaviour: "",
        dynamic_filter: "",
        dynamic_filter_fallback: {
          category: false,
          brand: false,
          custom: 0
        },
        inline_tile_size: "",
        inline_tile_border_radius: "",
        expanded_tile_border_radius: "",
        map_content_feed_filter_id: "31915",
        map_content_feed_filter_name: "Map Feed",
        displayMode: "map_only",
        isScrollZoomDisabled: false,
        providerApiKey: "",
        providerLayer: "OpenStreetMap.BlackAndWhite",
        connectedContentWidgetId: "",
        defaultBounds: "-33.8336347704208,151.26371383666992,-33.876401620744,151.18646621704102",
        pinColor: "f7584c",
        pinTextColor: "ffffff"
      })

      expect(value).toEqual({
        widget_background: "ffffff",
        text_tile_background: "000000",
        text_tile_font_color: "333333",
        text_tile_link_color: "ff0000",
        text_tile_user_name_font_color: "0000ff",
        text_tile_user_handle_font_color: "00ff00",
        shopspot_btn_background: "ff00ff",
        shopspot_btn_font_color: "00ffff",
        margin: "10",
        text_tile_font_size: "16",
        text_caption_paragraph_font_size: "12",
        text_tile_user_name_font_size: "16",
        tile_tag_background: "D6D4D5",
        auto_refresh: "",
        click_through_url: "",
        enable_custom_tiles_per_page: false,
        load_more_type: "",
        name: "",
        plugin_instance_id: "",
        polling_frequency: "",
        rows_per_page: "",
        shopspot_btn_font_size: "",
        shopspot_icon: "",
        style: "",
        text_tile_user_handle_font_size: "",
        tile_background: "",
        tiles_per_page: "",
        minimal_tiles: "",
        type: "",
        widget_height: "",
        widget_loading_image: "",
        unavailable_products_behaviour: "",
        dynamic_filter: "",
        dynamic_filter_fallback: {
          category: false,
          brand: false,
          custom: 0
        },
        inline_tile_size: "",
        inline_tile_border_radius: "",
        expanded_tile_border_radius: "",
        map_content_feed_filter_id: "31915",
        map_content_feed_filter_name: "Map Feed",
        displayMode: "map_only",
        isScrollZoomDisabled: false,
        providerApiKey: "",
        providerLayer: "OpenStreetMap.BlackAndWhite",
        connectedContentWidgetId: "",
        defaultBounds: "-33.8336347704208,151.26371383666992,-33.876401620744,151.18646621704102",
        pinColor: "f7584c",
        pinTextColor: "ffffff"
      })
    })
  })
})
