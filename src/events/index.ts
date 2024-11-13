import { handleTileClick } from "../libs"
import { ISdk } from "../types"
import { EnforcedWidgetSettings } from "../widget-loader"

declare const sdk: ISdk

export type Callback = (args: unknown) => void | Promise<void>
export type EventCallback = (event: Event) => void | Promise<void>

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

export const callbackDefaults = {
  onResize: [],
  onLoad: [],
  onExpandTile: [],
  onTileClose: [],
  onTileRendered: [],
  onTilesUpdated: [],
  onCrossSellersRendered: [],
  onWidgetInitComplete: [],
  onTileBgImgRenderComplete: [],
  onTileBgImageError: [],
  onProductActionClick: [],
  onExpandedTileImageLoad: [],
  onExpandedTileOpen: [],
  onExpandedTileClose: [],
  onBeforeExpandedTileImageResize: [],
  onBeforeExpandedTileClose: [],
  onBeforeExpandedTileOpen: [],
  onShopspotFlyoutExpand: [],
  onShopspotToggle: [],
  onShopspotOpen: [],
  onShopspotActionClick: [],
  onUserClick: [],
  onShareClick: [],
  onImpression: [],
  onLoadMore: [],
  onLike: [],
  onDislike: [],
  onHover: [],
  onProductClick: [],
  onProductPinClick: [],
  onProductUserClick: [],
  onShopspotFlyout: [],
  onTileMetadataLoaded: [],
  onTileDataSet: [],
  onHtmlRendered: [],
  onJsRendered: [],
  onGlobalsLoaded: [],
  onProductPageLoaded: [],
  onProductsUpdated: [],
  onAddToCartFailed: [],
  onEmailTileLoad: [],
  onEmailTileClick: [],
  onLikeClick: [],
  onDislikeClick: [],
  onTileExpandRendered: [],
  onTileExpandProductRecsRendered: [],
  onTileExpandCrossSellersRendered: []
}

export interface Callbacks {
  onResize: Callback[]
  onLoad: Callback[]
  onExpandTile: Callback[]
  onTileClose: Callback[]
  onTileRendered: Callback[]
  onTilesUpdated: Callback[]
  onCrossSellersRendered: Callback[]
  onWidgetInitComplete: Callback[]
  onTileBgImgRenderComplete: Callback[]
  onTileBgImageError: EventCallback[]
  onProductActionClick: Callback[]
  onExpandedTileImageLoad: Callback[]
  onExpandedTileOpen: Callback[]
  onExpandedTileClose: Callback[]
  onBeforeExpandedTileImageResize: Callback[]
  onBeforeExpandedTileClose: Callback[]
  onBeforeExpandedTileOpen: Callback[]
  onShopspotFlyoutExpand: Callback[]
  onShopspotToggle: Callback[]
  onShopspotOpen: Callback[]
  onShopspotActionClick: Callback[]
  onUserClick: Callback[]
  onShareClick: Callback[]
  onImpression: Callback[]
  onLoadMore: Callback[]
  onLike: Callback[]
  onDislike: Callback[]
  onHover: Callback[]
  onProductClick: Callback[]
  onProductPinClick: Callback[]
  onProductUserClick: Callback[]
  onShopspotFlyout: Callback[]
  onTileMetadataLoaded: Callback[]
  onTileDataSet: Callback[]
  onHtmlRendered: Callback[]
  onJsRendered: Callback[]
  onGlobalsLoaded: Callback[]
  onProductPageLoaded: Callback[]
  onProductsUpdated: Callback[]
  onAddToCartFailed: Callback[]
  onEmailTileLoad: Callback[]
  onEmailTileClick: Callback[]
  onLikeClick: Callback[]
  onDislikeClick: Callback[]
  onTileExpandRendered: Callback[]
  onTileExpandProductRecsRendered: Callback[]
  onTileExpandCrossSellersRendered: Callback[]
}

export function loadListeners(settings: EnforcedWidgetSettings) {
  const {
    onLoad,
    onExpandTile,
    onTileClose,
    onTileRendered,
    onCrossSellersRendered,
    onTilesUpdated,
    onWidgetInitComplete,
    onTileBgImgRenderComplete,
    onTileBgImageError,
    onResize,
    onLoadMore,
    onProductActionClick,
    onExpandedTileImageLoad,
    onExpandedTileOpen,
    onExpandedTileClose,
    onBeforeExpandedTileImageResize,
    onBeforeExpandedTileClose,
    onBeforeExpandedTileOpen,
    onShopspotFlyoutExpand,
    onShopspotToggle,
    onShopspotOpen,
    onShopspotActionClick,
    onUserClick,
    onShareClick,
    onImpression,
    onLike,
    onDislike,
    onHover,
    onProductClick,
    onProductPinClick,
    onProductUserClick,
    onShopspotFlyout,
    onTileMetadataLoaded,
    onTileDataSet,
    onHtmlRendered,
    onJsRendered,
    onGlobalsLoaded,
    onProductPageLoaded,
    onProductsUpdated,
    onAddToCartFailed,
    onEmailTileLoad,
    onEmailTileClick,
    onLikeClick,
    onDislikeClick,
    onTileExpandRendered,
    onTileExpandProductRecsRendered,
    onTileExpandCrossSellersRendered
  } = settings.callbacks

  if (onLoad && onLoad.length) onLoad.forEach(event => registerGenericEventListener("load", event))
  if (onExpandTile && onExpandTile.length)
    onExpandTile.forEach(event => registerGenericEventListener("expandedTileRendered", event))
  if (onTileClose && onTileClose.length)
    onTileClose.forEach(event => registerGenericEventListener("onTileClose", event))
  if (onTileRendered && onTileRendered.length) onTileRendered.forEach(event => registerTileExpandListener(event))
  if (onCrossSellersRendered && onCrossSellersRendered.length)
    onCrossSellersRendered.forEach(event => registerGenericEventListener("crossSellersRendered", event))
  if (onWidgetInitComplete && onWidgetInitComplete.length)
    onWidgetInitComplete.forEach(event => registerGenericEventListener("widgetInit", event))
  if (onTileBgImgRenderComplete && onTileBgImgRenderComplete.length)
    onTileBgImgRenderComplete.forEach(event => registerGenericEventListener("tileBgImgRenderComplete", event))
  if (onTileBgImageError && onTileBgImageError.length)
    onTileBgImageError.forEach(event => registerGenericEventListener("tileBgImageError", event))
  if (onResize && onResize.length) onResize.forEach(event => registerGenericEventListener("resize", event))
  if (onTilesUpdated && onTilesUpdated.length)
    onTilesUpdated.forEach(event => registerGenericEventListener("tilesUpdated", event))
  if (onLoadMore && onLoadMore.length) onLoadMore.forEach(event => registerGenericEventListener("loadMore", event))
  if (onProductActionClick && onProductActionClick.length)
    onProductActionClick.forEach(event => registerGenericEventListener("productActionClick", event))
  if (onExpandedTileImageLoad && onExpandedTileImageLoad.length)
    onExpandedTileImageLoad.forEach(event => registerGenericEventListener("expandedTileImageLoad", event))
  if (onExpandedTileOpen && onExpandedTileOpen.length)
    onExpandedTileOpen.forEach(event => registerGenericEventListener("expandedTileOpen", event))
  if (onExpandedTileClose && onExpandedTileClose.length)
    onExpandedTileClose.forEach(event => registerGenericEventListener("expandedTileClose", event))
  if (onBeforeExpandedTileImageResize && onBeforeExpandedTileImageResize.length)
    onBeforeExpandedTileImageResize.forEach(event =>
      registerGenericEventListener("beforeExpandedTileImageResize", event)
    )
  if (onBeforeExpandedTileClose && onBeforeExpandedTileClose.length)
    onBeforeExpandedTileClose.forEach(event => registerGenericEventListener("beforeExpandedTileClose", event))
  if (onBeforeExpandedTileOpen && onBeforeExpandedTileOpen.length)
    onBeforeExpandedTileOpen.forEach(event => registerGenericEventListener("beforeExpandedTileOpen", event))
  if (onShopspotFlyoutExpand && onShopspotFlyoutExpand.length)
    onShopspotFlyoutExpand.forEach(event => registerGenericEventListener("shopspotFlyoutExpand", event))
  if (onShopspotToggle && onShopspotToggle.length)
    onShopspotToggle.forEach(event => registerGenericEventListener("shopspotToggle", event))
  if (onShopspotOpen && onShopspotOpen.length)
    onShopspotOpen.forEach(event => registerGenericEventListener("shopspotOpen", event))
  if (onShopspotActionClick && onShopspotActionClick.length)
    onShopspotActionClick.forEach(event => registerGenericEventListener("shopspotActionClick", event))
  if (onUserClick && onUserClick.length) onUserClick.forEach(event => registerGenericEventListener("userClick", event))
  if (onShareClick && onShareClick.length)
    onShareClick.forEach(event => registerGenericEventListener("shareClick", event))
  if (onImpression && onImpression.length)
    onImpression.forEach(event => registerGenericEventListener("impression", event))
  if (onLike && onLike.length) onLike.forEach(event => registerGenericEventListener("like", event))
  if (onDislike && onDislike.length) onDislike.forEach(event => registerGenericEventListener("dislike", event))
  if (onHover && onHover.length) onHover.forEach(event => registerGenericEventListener("tileHover", event))
  if (onProductClick && onProductClick.length)
    onProductClick.forEach(event => registerGenericEventListener("productClick", event))
  if (onProductPinClick && onProductPinClick.length)
    onProductPinClick.forEach(event => registerGenericEventListener("pinClick", event))
  if (onProductUserClick && onProductUserClick.length)
    onProductUserClick.forEach(event => registerGenericEventListener("userClick", event))
  if (onShopspotFlyout && onShopspotFlyout.length)
    onShopspotFlyout.forEach(event => registerGenericEventListener("shopspotFlyout", event))
  if (onTileMetadataLoaded && onTileMetadataLoaded.length)
    onTileMetadataLoaded.forEach(event => registerGenericEventListener("tileMetadataLoaded", event))
  if (onTileDataSet && onTileDataSet.length)
    onTileDataSet.forEach(event => registerGenericEventListener("tileDataSet", event))
  if (onHtmlRendered && onHtmlRendered.length)
    onHtmlRendered.forEach(event => registerGenericEventListener("htmlRendered", event))
  if (onJsRendered && onJsRendered.length)
    onJsRendered.forEach(event => registerGenericEventListener("jsRendered", event))
  if (onGlobalsLoaded && onGlobalsLoaded.length)
    onGlobalsLoaded.forEach(event => registerGenericEventListener("globalsLoaded", event))
  if (onProductPageLoaded && onProductPageLoaded.length)
    onProductPageLoaded.forEach(event => registerGenericEventListener("productPageLoaded", event))
  if (onProductsUpdated && onProductsUpdated.length)
    onProductsUpdated.forEach(event => registerGenericEventListener("productsUpdated", event))
  if (onAddToCartFailed && onAddToCartFailed.length)
    onAddToCartFailed.forEach(event => registerGenericEventListener("addToCartFailed", event))
  if (onEmailTileLoad && onEmailTileLoad.length)
    onEmailTileLoad.forEach(event => registerGenericEventListener("emailTileLoad", event))
  if (onEmailTileClick && onEmailTileClick.length)
    onEmailTileClick.forEach(event => registerGenericEventListener("emailTileClick", event))
  if (onLikeClick && onLikeClick.length) onLikeClick.forEach(event => registerGenericEventListener("likeClick", event))
  if (onDislikeClick && onDislikeClick.length)
    onDislikeClick.forEach(event => registerGenericEventListener("dislikeClick", event))
  if (onTileExpandRendered && onTileExpandRendered.length)
    onTileExpandRendered.forEach(event => registerGenericEventListener("tileExpandRendered", event))
  if (onTileExpandProductRecsRendered && onTileExpandProductRecsRendered.length)
    onTileExpandProductRecsRendered.forEach(event =>
      registerGenericEventListener("tileExpandProductRecsRendered", event)
    )
  if (onTileExpandCrossSellersRendered && onTileExpandCrossSellersRendered.length)
    onTileExpandCrossSellersRendered.forEach(event =>
      registerGenericEventListener("tileExpandCrossSellersRendered", event)
    )
}

export function registerDefaultClickEvents() {
  const { click_through_url } = sdk.getStyleConfig()
  const urlPattern = /^https?:\/\/.+/

  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles UI element")
  }

  tiles.forEach((tile: HTMLElement) => {
    const url = click_through_url ?? ""
    const urlIsValid = urlPattern.test(url)

    if (urlIsValid) {
      tile.onclick = e => {
        handleTileClick(e, url)
      }
    }
  })
}

export function registerTileExpandListener(fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener("tileExpand", (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data.tileId as string
    fn(tileId)
  })
}

export function registerGenericEventListener(eventName: EventName, fn: Callback | EventCallback) {
  sdk.addEventListener(eventName, fn)
}
