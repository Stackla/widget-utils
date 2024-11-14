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
export const EVENT_TILE_EXPAND_RENDERED = "expandedTileRendered"
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
  onTileExpandProductRecsRendered: [],
  onTileExpandCrossSellersRendered: []
}

/**
 * Interface representing various callback events.
 */
export interface Callbacks {
  /**
   * Called when the window is resized.
   */
  onResize: Callback[]

  /**
   * Called when the widget is loaded.
   */
  onLoad: Callback[]

  /**
   * Called when a tile is expanded.
   */
  onExpandTile: Callback[]

  /**
   * Called when a tile is closed.
   */
  onTileClose: Callback[]

  /**
   * Called when a tile is rendered.
   */
  onTileRendered: Callback[]

  /**
   * Called when tiles are updated.
   */
  onTilesUpdated: Callback[]

  /**
   * Called when cross-sellers are rendered.
   */
  onCrossSellersRendered: Callback[]

  /**
   * Called when the widget initialization is complete.
   */
  onWidgetInitComplete: Callback[]

  /**
   * Called when the background image of a tile is rendered.
   */
  onTileBgImgRenderComplete: Callback[]

  /**
   * Called when there is an error rendering the background image of a tile.
   */
  onTileBgImageError: EventCallback[]

  /**
   * Called when a product action is clicked.
   */
  onProductActionClick: Callback[]

  /**
   * Called when an expanded tile image is loaded.
   */
  onExpandedTileImageLoad: Callback[]

  /**
   * Called when an expanded tile is opened.
   */
  onExpandedTileOpen: Callback[]

  /**
   * Called when an expanded tile is closed.
   */
  onExpandedTileClose: Callback[]

  /**
   * Called before an expanded tile image is resized.
   */
  onBeforeExpandedTileImageResize: Callback[]

  /**
   * Called before an expanded tile is closed.
   */
  onBeforeExpandedTileClose: Callback[]

  /**
   * Called before an expanded tile is opened.
   */
  onBeforeExpandedTileOpen: Callback[]

  /**
   * Called when a shopspot flyout is expanded.
   */
  onShopspotFlyoutExpand: Callback[]

  /**
   * Called when a shopspot is toggled.
   */
  onShopspotToggle: Callback[]

  /**
   * Called when a shopspot is opened.
   */
  onShopspotOpen: Callback[]

  /**
   * Called when a shopspot action is clicked.
   */
  onShopspotActionClick: Callback[]

  /**
   * Called when a user clicks.
   */
  onUserClick: Callback[]

  /**
   * Called when a share button is clicked.
   */
  onShareClick: Callback[]

  /**
   * Called when an impression is made.
   */
  onImpression: Callback[]

  /**
   * Called when the load more button is clicked.
   */
  onLoadMore: Callback[]

  /**
   * Called when a like button is clicked.
   */
  onLike: Callback[]

  /**
   * Called when a dislike button is clicked.
   */
  onDislike: Callback[]

  /**
   * Called when an element is hovered over.
   */
  onHover: Callback[]

  /**
   * Called when a product is clicked.
   */
  onProductClick: Callback[]

  /**
   * Called when a product pin is clicked.
   */
  onProductPinClick: Callback[]

  /**
   * Called when a product user is clicked.
   */
  onProductUserClick: Callback[]

  /**
   * Called when a shopspot flyout is triggered.
   */
  onShopspotFlyout: Callback[]

  /**
   * Called when tile metadata is loaded.
   */
  onTileMetadataLoaded: Callback[]

  /**
   * Called when tile data is set.
   */
  onTileDataSet: Callback[]

  /**
   * Called when server side rendered HTML is appended to the page.
   */
  onHtmlRendered: Callback[]

  /**
   * Called when user's JavaScript is rendered.
   */
  onJsRendered: Callback[]

  /**
   * Called when global variables are loaded.
   */
  onGlobalsLoaded: Callback[]

  /**
   * Called when a product page is loaded.
   */
  onProductPageLoaded: Callback[]

  /**
   * Called when products are updated.
   */
  onProductsUpdated: Callback[]

  /**
   * Called when adding to cart fails.
   */
  onAddToCartFailed: Callback[]

  /**
   * Called when an email tile is loaded.
   */
  onEmailTileLoad: Callback[]

  /**
   * Called when an email tile is clicked.
   */
  onEmailTileClick: Callback[]

  /**
   * Called when a like button is clicked.
   */
  onLikeClick: Callback[]

  /**
   * Called when a dislike button is clicked.
   */
  onDislikeClick: Callback[]

  /**
   * Called when product recommendations are rendered on an expanded tile.
   */
  onTileExpandProductRecsRendered: Callback[]

  /**
   * Called when cross-sellers are rendered on an expanded tile.
   */
  onTileExpandCrossSellersRendered: Callback[]
}

/**
 * Registers event listeners for the widget.
 * @param settings
 */
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
    onTileExpandProductRecsRendered,
    onTileExpandCrossSellersRendered
  } = settings.callbacks

  if (onLoad && onLoad.length) onLoad.forEach(event => registerGenericEventListener(EVENT_LOAD, event))
  if (onExpandTile && onExpandTile.length)
    onExpandTile.forEach(event => registerGenericEventListener(EVENT_TILE_EXPAND_RENDERED, event))
  if (onTileClose && onTileClose.length)
    onTileClose.forEach(event => registerGenericEventListener("onTileClose", event))
  if (onTileRendered && onTileRendered.length) onTileRendered.forEach(event => registerTileExpandListener(event))
  if (onCrossSellersRendered && onCrossSellersRendered.length)
    onCrossSellersRendered.forEach(event => registerGenericEventListener("crossSellersRendered", event))
  if (onWidgetInitComplete && onWidgetInitComplete.length)
    onWidgetInitComplete.forEach(event => registerGenericEventListener("widgetInit", event))
  if (onTileBgImgRenderComplete && onTileBgImgRenderComplete.length)
    onTileBgImgRenderComplete.forEach(event => registerGenericEventListener(EVENT_TILE_BG_IMG_RENDER_COMPLETE, event))
  if (onTileBgImageError && onTileBgImageError.length)
    onTileBgImageError.forEach(event => registerGenericEventListener(EVENT_TILE_BG_IMG_ERROR, event))
  if (onResize && onResize.length) onResize.forEach(event => registerGenericEventListener("resize", event))
  if (onTilesUpdated && onTilesUpdated.length)
    onTilesUpdated.forEach(event => registerGenericEventListener(EVENT_TILES_UPDATED, event))
  if (onLoadMore && onLoadMore.length) onLoadMore.forEach(event => registerGenericEventListener("loadMore", event))
  if (onProductActionClick && onProductActionClick.length)
    onProductActionClick.forEach(event => registerGenericEventListener(PRODUCT_ACTION_CLICK, event))
  if (onExpandedTileImageLoad && onExpandedTileImageLoad.length)
    onExpandedTileImageLoad.forEach(event => registerGenericEventListener(EXPANDED_TILE_IMAGE_LOAD, event))
  if (onExpandedTileOpen && onExpandedTileOpen.length)
    onExpandedTileOpen.forEach(event => registerGenericEventListener(EXPANDED_TILE_OPEN, event))
  if (onExpandedTileClose && onExpandedTileClose.length)
    onExpandedTileClose.forEach(event => registerGenericEventListener(EXPANDED_TILE_CLOSE, event))
  if (onBeforeExpandedTileImageResize && onBeforeExpandedTileImageResize.length)
    onBeforeExpandedTileImageResize.forEach(event =>
      registerGenericEventListener(BEFORE_EXPANDED_TILE_IMAGE_RESIZE, event)
    )
  if (onBeforeExpandedTileClose && onBeforeExpandedTileClose.length)
    onBeforeExpandedTileClose.forEach(event => registerGenericEventListener(BEFORE_EXPANDED_TILE_CLOSE, event))
  if (onBeforeExpandedTileOpen && onBeforeExpandedTileOpen.length)
    onBeforeExpandedTileOpen.forEach(event => registerGenericEventListener(BEFORE_EXPANDED_TILE_OPEN, event))
  if (onShopspotFlyoutExpand && onShopspotFlyoutExpand.length)
    onShopspotFlyoutExpand.forEach(event => registerGenericEventListener(SHOPSPOT_FLYOUT_EXPAND, event))
  if (onShopspotToggle && onShopspotToggle.length)
    onShopspotToggle.forEach(event => registerGenericEventListener(SHOPSPOT_TOGGLE, event))
  if (onShopspotOpen && onShopspotOpen.length)
    onShopspotOpen.forEach(event => registerGenericEventListener(SHOPSPOT_OPEN, event))
  if (onShopspotActionClick && onShopspotActionClick.length)
    onShopspotActionClick.forEach(event => registerGenericEventListener(SHOPSPOT_ACTION_CLICK, event))
  if (onUserClick && onUserClick.length) onUserClick.forEach(event => registerGenericEventListener(USER_CLICK, event))
  if (onShareClick && onShareClick.length)
    onShareClick.forEach(event => registerGenericEventListener(SHARE_CLICK, event))
  if (onImpression && onImpression.length)
    onImpression.forEach(event => registerGenericEventListener(EVENT_IMPRESSION, event))
  if (onLike && onLike.length) onLike.forEach(event => registerGenericEventListener(EVENT_LIKE, event))
  if (onDislike && onDislike.length) onDislike.forEach(event => registerGenericEventListener(EVENT_DISLIKE, event))
  if (onHover && onHover.length) onHover.forEach(event => registerGenericEventListener(EVENT_HOVER, event))
  if (onProductClick && onProductClick.length)
    onProductClick.forEach(event => registerGenericEventListener(EVENT_PRODUCT_CLICK, event))
  if (onProductPinClick && onProductPinClick.length)
    onProductPinClick.forEach(event => registerGenericEventListener(EVENT_PRODUCT_PINCLICK, event))
  if (onProductUserClick && onProductUserClick.length)
    onProductUserClick.forEach(event => registerGenericEventListener(EVENT_PRODUCT_USER_CLICK, event))
  if (onShopspotFlyout && onShopspotFlyout.length)
    onShopspotFlyout.forEach(event => registerGenericEventListener(EVENT_SHOPSPOT_FLYOUT, event))
  if (onTileMetadataLoaded && onTileMetadataLoaded.length)
    onTileMetadataLoaded.forEach(event => registerGenericEventListener(EVENT_TILE_METADATA_LOADED, event))
  if (onTileDataSet && onTileDataSet.length)
    onTileDataSet.forEach(event => registerGenericEventListener(EVENT_TILE_DATA_SET, event))
  if (onHtmlRendered && onHtmlRendered.length)
    onHtmlRendered.forEach(event => registerGenericEventListener(EVENT_HTML_RENDERED, event))
  if (onJsRendered && onJsRendered.length)
    onJsRendered.forEach(event => registerGenericEventListener(EVENT_JS_RENDERED, event))
  if (onGlobalsLoaded && onGlobalsLoaded.length)
    onGlobalsLoaded.forEach(event => registerGenericEventListener(EVENT_GLOBALS_LOADED, event))
  if (onProductPageLoaded && onProductPageLoaded.length)
    onProductPageLoaded.forEach(event => registerGenericEventListener(EVENT_PRODUCT_PAGE_LOADED, event))
  if (onProductsUpdated && onProductsUpdated.length)
    onProductsUpdated.forEach(event => registerGenericEventListener(EVENT_PRODUCTS_UPDATED, event))
  if (onAddToCartFailed && onAddToCartFailed.length)
    onAddToCartFailed.forEach(event => registerGenericEventListener(EVENT_ADD_TO_CART_FAILED, event))
  if (onEmailTileLoad && onEmailTileLoad.length)
    onEmailTileLoad.forEach(event => registerGenericEventListener(EMAIL_TILE_LOAD, event))
  if (onEmailTileClick && onEmailTileClick.length)
    onEmailTileClick.forEach(event => registerGenericEventListener(EMAIL_TILE_CLICK, event))
  if (onLikeClick && onLikeClick.length) onLikeClick.forEach(event => registerGenericEventListener(LIKE_CLICK, event))
  if (onDislikeClick && onDislikeClick.length)
    onDislikeClick.forEach(event => registerGenericEventListener(DISLIKE_CLICK, event))
  if (onTileExpandProductRecsRendered && onTileExpandProductRecsRendered.length)
    onTileExpandProductRecsRendered.forEach(event =>
      registerGenericEventListener(EVENT_TILE_EXPAND_PROD_RECS_RENDERED, event)
    )
  if (onTileExpandCrossSellersRendered && onTileExpandCrossSellersRendered.length)
    onTileExpandCrossSellersRendered.forEach(event =>
      registerGenericEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, event)
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
  sdk.addEventListener(EVENT_TILE_EXPAND, (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data.tileId as string
    fn(tileId)
  })
}

export function registerGenericEventListener(eventName: EventName, fn: Callback | EventCallback) {
  sdk.addEventListener(eventName, fn)
}
