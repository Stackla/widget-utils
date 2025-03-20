import {
  Config,
  ExpandedTileOptions,
  InlineTileOptions,
  Style,
  WidgetOptions,
  WidgetResponse
} from "@stackla/widget-utils"

export interface OptionsWithDefaults {
  style: Style
  config: Config
}

export interface StyleDefaults {
  getStyleDefaults(): Style
}

export interface ConfigDefaults {
  getConfigDefaults(): Config
}

export interface OptionsWithDefaultsFunction {
  getOptionsWithDefaults(widgetOptions: WidgetOptions): OptionsWithDefaults
}

export interface ConfigManager {
  updateInlineTileOptions: (mutatedInlineTileOptions: Partial<InlineTileOptions>) => void
  updateExpandedTileOptions: (mutatedExpandedTileOptions: Partial<ExpandedTileOptions>) => void
  updateWidgetStyle: (mutatedStyle: Partial<Style>) => void
  getConfig: () => Config
  getWidgetStyle: () => Style
  getClaimConfig: () => Config["claim_config"]
  getInlineTileConfig: () => InlineTileOptions
  getExpandedTileConfig: () => ExpandedTileOptions
  isWidgetEnabled: () => boolean
  getTileCount: () => number
}

export interface ConfigManagerFunction {
  ConfigManager(widgetContainer: WidgetResponse): ConfigManager
}
