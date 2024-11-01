interface Variant {
  id: string
  availability: string
  brand: string
  condition: string
  description: string
  google_product_category: string
  group: string
  image_link: string
  item_group_id: string
  link: string
  price: string
  title: string
  via_feed: number | null
}

export interface Video {
  standard_resolution: {
    url: string
  }
}

export interface VideoFile {
  url: string
  mime: string
  size: number
  width: number
  height: number
  duration: number
}

export interface TagExtended {
  active?: boolean
  auto_apply?: boolean
  availability: number
  availability_status?: string
  brand?: string
  categories?: string
  created_at?: string
  cta_text?: string
  currency?: string
  custom_fields?: string
  custom_slug?: string
  custom_url: string
  description?: string
  ext_product_id?: string
  id: string
  image?: string
  image_medium_height?: string
  image_medium_url?: string
  image_medium_width?: string
  image_small_height?: string
  image_small_url?: string
  image_small_width?: string
  ingested_at?: string
  is_from_nosto?: number
  lock_cta_text?: number
  merchant_id?: string
  migrated_from_variant?: number
  original_price?: string
  price: string
  priority?: string
  processed?: number
  publicly_visible?: number
  rm_id?: string
  slug?: string
  stack_id?: number
  system_tag?: number
  is_cross_seller: boolean
  tag: string
  tag_sanitized?: string
  target?: string
  tracking_tile_clicks?: string
  tracking_tile_impressions?: string
  type: string
  ugc_update_required?: string
  ugc_update_required_created_at?: string
  updated_at?: string
  variant?: Variant[]
}

export type Tile = {
  id: string
  preloaded?: boolean
  _id?: { $id: string }
  carousel: number
  created_at: number
  disabled: boolean
  hotspots?: Hotspot[]
  image: string
  avatar: string
  image_expire_at: number
  lang_detection_type?: string
  media: string
  message: string
  name: null | string
  original_url: string
  original_link: string
  page_post: boolean
  parent_url: string
  queued: boolean
  reviewed: boolean
  scheduled: boolean
  score: number
  source: string
  source_id: string
  source_created_at: number
  source_unique_id: string
  stackla_sentiment_score: number
  status: string
  tags: string[]
  tags_extended?: TagExtended[]
  terms: string[]
  updated_at: number
  user: string
  video: Video
  video_files: VideoFile[]
  original_image_url: string
  embed_url: string
  youtube_id: string
  title: string
  full_embed_html: string
  attrs: string[]
  [key: string]: undefined | object | null | string | string[] | number | number[] | boolean | TagExtended[]
}

export type Hotspot = {
  id: number
  x: number
  y: number
  width: number
  height: number
  type: string
  custom_url: string
  product_link_attribute: string
  tag: TagExtended
  coords: number[]
} & TagExtended
