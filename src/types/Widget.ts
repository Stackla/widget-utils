export type SharedWidgetOptions = {
  customCSS: string | null;
  customJS: string | null;
  widgetOptions: WidgetOptions & {
    plugins?: Record<
      string,
      {
        config: Record<string, never>;
      }
    >;
  };
  guid?: string;
  filterId: number | null;
  enabled: boolean;
};

export type WidgetOptions = {
  id?: number;
  widget_type_id?: number;
  stack_id?: number;
  guid?: string;
  css?: string;
  filter_id: string;
  enabled: boolean;
  processing_assets?: number;
  custom_css?: string;
  lightbox_custom_css?: string;
  source_css?: string;
  lightbox_source_css?: string;
  use_default_css?: number;
  custom_js?: string;
  lightbox_custom_js?: string;
  use_default_js?: number;
  custom_tile?: string;
  external_js?: string;
  created?: string;
  modified?: string;
  tracking_impressions?: number;
  rm_id?: string;
  widgetType?: WidgetType;
  embed_code?: string;
  is_draft?: number;
  draft_id?: string;
  has_content?: number;
  has_samplefilter?: number;
  gen?: number;
  style_name?: string;
  custom_templates?: CustomTemplates;
  assets?: Assets;
  filter_name?: string;
  type?: Type;
  enable_old_widget_styling?: boolean;
  style: Style;
  config: Config;
};

export interface ExpandedTileOptions {
  apply_custom_sharing_title_on_miss_title: boolean;
  disable_short_url: boolean;
  fallback_share_image: string;
  layout: string;
  post_comments: boolean;
  sharing_text: string;
  sharing_title: string;
  show_additional_info: boolean;
  show_caption: boolean;
  show_timestamp: boolean;
  show_comments: boolean;
  show_dislikes: boolean;
  show_likes: boolean;
  show_nav: boolean;
  show_sharing: boolean;
  show_shopspots: boolean;
  show_products: boolean;
  show_tags: boolean;
  show_votes: boolean;
  show_cross_sellers: boolean;
  show_add_to_cart: boolean;
}

export interface InlineTileOptions {
  show_comments: boolean;
  show_dislikes: boolean;
  show_likes: boolean;
  show_nav: boolean;
  show_sharing: boolean;
  show_shopspots: boolean;
  show_tags: boolean;
  show_votes: boolean;
  show_timestamp: boolean;
  show_caption: boolean;
  show_products: boolean;
  show_add_to_cart: boolean;
}

export interface ClaimConfig {
  show_claim_button: boolean;
  show_claim_button_on_tags: boolean[];
}

export interface WidgetType {
  id: number;
  widget_category_id: number;
  name: string;
  style: Partial<string>;
  active: number;
  display_order: number;
  gen: number;
  created: string;
  modified: string;
}

export interface Config {
  lightbox: ExpandedTileOptions;
  tile_options: InlineTileOptions;
  claim_config?: ClaimConfig;
}

export type Type = {
  id: number;
  name: string;
  style: string;
}

export type StylePropertyValue = string | boolean | DynamicFilterFallback;

export interface Style {
  auto_refresh: string;
  click_through_url: string;
  enable_custom_tiles_per_page: boolean;
  load_more_type: string;
  margin: string;
  name: string;
  plugin_instance_id: string;
  polling_frequency: string;
  rows_per_page: string;
  shopspot_btn_background: string;
  shopspot_btn_font_color: string;
  shopspot_btn_font_size: string;
  shopspot_icon: string;
  style: string;
  text_tile_background: string;
  text_tile_font_color: string;
  text_tile_font_size: string;
  text_tile_user_handle_font_color: string;
  text_tile_user_handle_font_size: string;
  text_tile_user_name_font_color: string;
  text_tile_user_name_font_size: string;
  text_tile_link_color: string;
  tile_background: string;
  tiles_per_page: string;
  minimal_tiles: string;
  type: string;
  widget_background: string;
  widget_height: string;
  widget_loading_image: string;
  unavailable_products_behaviour: string;
  dynamic_filter: string;
  dynamic_filter_fallback: DynamicFilterFallback;
  inline_tile_size: string;
  inline_tile_border_radius: string;
  expanded_tile_border_radius: string;
}

export interface DynamicFilterFallback {
  category: boolean;
  brand: boolean;
  custom: number;
}

export interface Assets {}

export interface CustomTemplates {
  layout: Layout;
  tile: Tile;
}

export interface Layout {
  display_name: string;
  html_id: string;
  mandatory: number;
  use_default_template: number;
  template: string;
  created: string;
  modified: string;
}

export interface Tile {
  display_name: string;
  html_id: string;
  mandatory: number;
  use_default_template: number;
  template: string;
  created: string;
  modified: string;
}

export type WidgetResponse = {
  html: string;
  customCSS: string | null;
  customJS: string | null;
  merchantId: string | null;
  stackId: number | null;
  tileCount: number;
  title: string;
} & SharedWidgetOptions;

export type ExpandedTileProperty = keyof ExpandedTileOptions;
export type TileOptionsProperty = keyof InlineTileOptions;
export type OptionsProperty = keyof WidgetOptions;
export type StyleOptionsProperty = keyof Style;
export type DynamicFilterFallbackProperty = keyof DynamicFilterFallback;