export const PRODUCT_ACTION_CLICK = "productActionClick"
export const EXPANDED_TILE_IMAGE_LOAD = "expandedTileImageLoad"
export const EXPANDED_TILE_OPEN = "expandedTileOpen"
export const EXPANDED_TILE_CLOSE = "expandedTileClose"
export const BEFORE_EXPANDED_TILE_IMAGE_RESIZE = "beforeExpandedTileImageResize"
export const EXPANDED_TILE_IMAGE_RESIZE = "expandedTileImageResize"
export const BEFORE_EXPANDED_TILE_CLOSE = "beforeExpandedTileClose"
export const BEFORE_EXPANDED_TILE_OPEN = "beforeExpandedTileOpen"
export const SHOPSPOT_FLYOUT_EXPAND = "shopspotFlyoutExpand"
export const SHOPSPOT_TOGGLE = "shopspotToggle"
export const SHOPSPOT_OPEN = "shopspotOpen"
export const SHOPSPOT_ACTION_CLICK = "shopspotActionClick"
export const USER_CLICK = "userClick"
export const SHARE_CLICK = "shareClick"
export const EVENT_IMPRESSION = "impression"
export const EVENT_LOAD = "load"
export const EVENT_LOAD_MORE = "moreLoad"
export const EVENT_LIKE = "like"
export const EVENT_DISLIKE = "dislike"
export const EVENT_HOVER = "tileHover"
export const EVENT_PRODUCT_CLICK = "productClick"
export const EVENT_PRODUCT_PINCLICK = "pinClick"
export const EVENT_TILE_EXPAND = "tileExpand"
export const EVENT_PRODUCT_USER_CLICK = "userClick"
export const EVENT_SHARE_CLICK = "shareClick"
export const EVENT_SHOPSPOT_FLYOUT = "shopspotFlyout"
export const EVENT_TILE_METADATA_LOADED = "tileMetadataLoaded"
export const EVENT_TILE_DATA_SET = "tileDataSet"
export const EVENT_HTML_RENDERED = "htmlRendered"
export const EVENT_JS_RENDERED = "jsRendered"
export const EVENT_GLOBALS_LOADED = "globalsLoaded"
export const CROSS_SELLERS_LOADED = "crossSellersLoaded"
export const EVENT_PRODUCT_PAGE_LOADED = "productPageLoaded"
export const EVENT_PRODUCTS_UPDATED = "productsUpdated"
export const EVENT_ADD_TO_CART_FAILED = "addToCartFailed"
export const EVENT_TILES_UPDATED = "tilesUpdated"
export const WIDGET_INIT_COMPLETE = "widgetInitComplete"
export const EMAIL_TILE_LOAD = "emailTileLoad"
export const EMAIL_TILE_CLICK = "emailTileClick"
export const LIKE_CLICK = "likeClick"
export const DISLIKE_CLICK = "dislikeClick"
export const EVENT_TILE_EXPAND_RENDERED = "tileExpandRendered"
export const EVENT_TILE_EXPAND_PROD_RECS_RENDERED = "tileExpandProductRecsRendered"
export const EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED = "tileExpandCrossSellersRendered"
export const EVENT_TILE_BG_IMG_ERROR = "tileBgImageError"
export const EVENT_TILE_BG_IMG_RENDER_COMPLETE = "tileBgImgRenderComplete"

export const allEvents = [
  PRODUCT_ACTION_CLICK,
  EXPANDED_TILE_IMAGE_LOAD,
  EXPANDED_TILE_OPEN,
  EXPANDED_TILE_CLOSE,
  BEFORE_EXPANDED_TILE_IMAGE_RESIZE,
  EXPANDED_TILE_IMAGE_RESIZE,
  BEFORE_EXPANDED_TILE_CLOSE,
  BEFORE_EXPANDED_TILE_OPEN,
  SHOPSPOT_FLYOUT_EXPAND,
  SHOPSPOT_TOGGLE,
  SHOPSPOT_OPEN,
  SHOPSPOT_ACTION_CLICK,
  USER_CLICK,
  SHARE_CLICK,
  EVENT_IMPRESSION,
  EVENT_LOAD,
  EVENT_LOAD_MORE,
  EVENT_LIKE,
  EVENT_DISLIKE,
  EVENT_HOVER,
  EVENT_PRODUCT_CLICK,
  EVENT_PRODUCT_PINCLICK,
  EVENT_TILE_EXPAND,
  EVENT_PRODUCT_USER_CLICK,
  EVENT_SHARE_CLICK,
  EVENT_SHOPSPOT_FLYOUT,
  EVENT_TILE_METADATA_LOADED,
  EVENT_TILE_DATA_SET,
  EVENT_HTML_RENDERED,
  EVENT_JS_RENDERED,
  EVENT_GLOBALS_LOADED,
  CROSS_SELLERS_LOADED,
  EVENT_PRODUCT_PAGE_LOADED,
  EVENT_PRODUCTS_UPDATED,
  EVENT_ADD_TO_CART_FAILED,
  EVENT_TILES_UPDATED,
  WIDGET_INIT_COMPLETE,
  EMAIL_TILE_LOAD,
  EMAIL_TILE_CLICK,
  LIKE_CLICK,
  DISLIKE_CLICK,
  EVENT_TILE_EXPAND_RENDERED,
  EVENT_TILE_EXPAND_PROD_RECS_RENDERED,
  EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED,
  EVENT_TILE_BG_IMG_ERROR,
  EVENT_TILE_BG_IMG_RENDER_COMPLETE
]

export type EventName = (typeof allEvents)[number]

export type EventMapping = Record<EventName, Event>
