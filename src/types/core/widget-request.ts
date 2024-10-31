type Template = {
  display_name: string
  html_id: string
  mandatory: number
  use_default_template: number
  template: string
  created: string
  modified: string
}

type Templates = {
  layout: Template
  tile: Template
}

export type Draft = {
  style?: string
  config?: string | null
  css?: string
  filter_id?: number
  custom_css?: string
  lightbox_custom_css?: string
  source_css?: string
  lightbox_source_css?: string
  use_default_css?: number
  custom_js?: string
  lightbox_custom_js?: string
  use_default_js?: number
  custom_tile?: string
  external_js?: string
  draft_id?: string
  short_name?: string
  custom_templates?: Templates
  [key: string]: string | number | undefined | null | Templates | Record<string, never>
}

export default interface IWidgetRequest {
  // TODO - Document new properties (draft,visible_tiles_count, uid);
  // Allow uid if the user wants to differ 2 widgets with the same filter_id (i.e. preview mode)
  uid?: string
  visible_tiles_count?: number
  draft?: Draft
  hash?: string
  wid?: string
  filter_id: number
  tags?: string
  tag_group?: string
  available_products_only?: boolean
  limit?: number
  page?: number
  ttl?: number
  visible_on?: string
  domain?: string
  tags_grouped_as?: string
  data_tags?: string
  brand?: string
  categories?: string
  fallbacks?: string
  fallback_filter_id?: number
  product_link_attribute?: string
  search?: string
  geohash?: string
  tile_id?: string
  style?: string
  media?: string
  exclude?: boolean
  status?: string
  filter?: string
  [key: string]: string | boolean | number | Draft | undefined | null | Templates | Record<string, never>
}

export interface ITransformedWidgetRequest extends IWidgetRequest {
  wid: string
  hash?: string
}
