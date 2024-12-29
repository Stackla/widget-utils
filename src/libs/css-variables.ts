import type { Features, ISdk, Style } from "../"

declare const sdk: ISdk

export function getTileSize(settings?: Features["tileSizeSettings"]) {
  const style = sdk.getStyleConfig()
  const { inline_tile_size } = style

  const tileSizes: { [key: string]: string } = {
    small: settings?.small ?? "173px",
    medium: settings?.medium ?? "265.5px",
    large: settings?.large ?? "400px"
  }

  if (!inline_tile_size) {
    return tileSizes["medium"]
  }

  return tileSizes[inline_tile_size]
}

export function getTileSizeByWidget(tileSizeSettings?: Features["tileSizeSettings"]) {
  const sizeWithUnit = getTileSize(tileSizeSettings)
  const sizeUnitless = sizeWithUnit.replace("px", "")
  return { "--tile-size": sizeWithUnit, "--tile-size-unitless": sizeUnitless }
}
export function trimHashValuesFromObject(obj: Style): Record<keyof Style, string> {
  return Object.entries(obj).reduce((acc: Record<string, string>, [key, value]) => {
    acc[key] = typeof value === "string" && value.startsWith("#") ? value.replace("#", "") : value
    return acc
  }, {})
}

/**
 * @description Get the CSS variables for the widget
 * @params tileSizeSettings - Custom tile size settings, small, medium, large
 */
export default function getCSSVariables(features?: Partial<Features>): string {
  const { tileSizeSettings, cssVariables } = features || {}
  const styles = sdk.getStyleConfig()
  const inlineTileSettings = sdk.getInlineTileConfig()
  const {
    widget_background,
    text_tile_background,
    text_tile_link_color,
    text_tile_user_handle_font_color,
    shopspot_btn_background,
    shopspot_btn_font_color,
    margin,
    text_tile_font_size,
    text_tile_user_name_font_size,
    text_tile_user_handle_font_size,
    shopspot_icon,
    expanded_tile_border_radius,
    inline_tile_border_radius,
    shopspot_btn_font_size,
    text_tile_font_color,
    text_tile_user_name_font_color
  } = trimHashValuesFromObject(styles)
  const { show_tags: show_tags_expanded, show_shopspots: show_shopspots_expanded } = sdk.getExpandedTileConfig()
  const {
    show_caption: show_caption_inline,
    show_tags: show_tags_inline,
    show_shopspots: show_shopspots_inline,
    show_timestamp: show_timestamp_inline,
    show_sharing: show_sharing_inline
  } = inlineTileSettings

  const mutatedCssVariables: { [key: string]: string } = {
    ...cssVariables,
    "--widget-background": `#${widget_background}`,
    "--inline-tile-background": `#${text_tile_background}`,
    "--text-tile-background": `#${text_tile_background}`,
    "--shopspot-btn-background": `#${shopspot_btn_background}`,
    "--cta-button-background-color": `#${shopspot_btn_background}`,
    "--tile-tag-background": `#bcbbbc`,
    "--text-tile-link-color": `#${text_tile_link_color}`,
    "--text-tile-user-handle-font-color": `#${text_tile_user_handle_font_color}`,
    "--shopspot-btn-font-color": `#${shopspot_btn_font_color}`,
    "--margin": `${margin ? margin : 0}px`,
    "--text-tile-font-size": `${text_tile_font_size}px`,
    "--text-caption-paragraph-font-size": `${text_tile_font_size || 12}px`,
    "--text-tile-user-name-font-size": `${text_tile_user_name_font_size}px`,
    "--text-tile-user-name-font-color": `#${text_tile_user_name_font_color}`,
    "--text-tile-user-handle-font-size": `${text_tile_user_handle_font_size || 12}px`,
    "--text-tile-font-color": `#${text_tile_font_color}`,
    "--show-caption-inline": `${show_caption_inline ? "block" : "none"}`,
    "--show-caption-inline-webkit": `${show_caption_inline ? "-webkit-box" : "none"}`,
    "--shopspot-icon": shopspot_icon ? shopspot_icon : `#000`,
    "--tags-gap": `4px`,
    // TODO - Replace these with cta_button_font_color and cta_button_font_size @Peng Zhou
    "--cta-button-font-color": `#${shopspot_btn_font_color}`,
    "--cta-button-font-size": `${shopspot_btn_font_size}px`,
    "--expanded-tile-border-radius": `${expanded_tile_border_radius}px`,
    ...getTileSizeByWidget(tileSizeSettings),
    "--inline-tile-border-radius": `${inline_tile_border_radius}px`,
    "--inline-tile-margin": `${margin}px`,
    "--tags-display-inline": `${show_tags_inline ? "flex" : "none"}`,
    "--tags-display-expanded": `${show_tags_expanded ? "flex" : "none"}`,
    "--shopspots-display-inline": `${show_shopspots_inline ? "block" : "none"}`,
    "--shopspots-display-expanded": `${show_shopspots_expanded ? "block" : "none"}`,
    "--timephrase-display-inline": `${show_timestamp_inline ? "block" : "none"}`,
    "--share-icon-display-inline": `${show_sharing_inline ? "inline-block" : "none"}`
  }

  return Object.entries(mutatedCssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n")
}
