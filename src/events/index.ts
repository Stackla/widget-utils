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
export const EVENT_SHARE_CLICK = "shareClick" //GA Specific. Needs cleanup
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
export const EVENT_SHARE_MENU_OPENED = "shareMenuOpened"
export const EVENT_SHARE_MENU_CLOSED = "shareMenuClosed"

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
  EVENT_TILE_BG_IMG_RENDER_COMPLETE,
  EVENT_SHARE_MENU_OPENED,
  EVENT_SHARE_MENU_CLOSED
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
  onTileExpandCrossSellersRendered: [],
  onShareMenuOpened: [],
  onShareMenuClosed: []
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

  /**
   * Called when a shared menu is opened
   */
  onShareMenuOpened: Callback[]

  /**
   * Called when a shared menu is closed
   */
  onShareMenuClosed: Callback[]
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
    onTileExpandCrossSellersRendered,
    onShareMenuOpened,
    onShareMenuClosed
  } = settings.callbacks

  onLoad?.forEach(event => registerGenericEventListener(EVENT_LOAD, event))
  onExpandTile?.forEach(event => registerGenericEventListener(EVENT_TILE_EXPAND_RENDERED, event))
  onTileClose?.forEach(event => registerGenericEventListener("onTileClose", event))
  onTileRendered?.forEach(event => registerTileExpandListener(event))
  onCrossSellersRendered?.forEach(event => registerGenericEventListener("crossSellersRendered", event))
  onWidgetInitComplete?.forEach(event => registerGenericEventListener("widgetInit", event))
  onTileBgImgRenderComplete?.forEach(event => registerGenericEventListener(EVENT_TILE_BG_IMG_RENDER_COMPLETE, event))
  onTileBgImageError?.forEach(event => registerGenericEventListener(EVENT_TILE_BG_IMG_ERROR, event))
  onResize?.forEach(event => window.addEventListener("resize", event))
  onTilesUpdated?.forEach(event => registerGenericEventListener(EVENT_TILES_UPDATED, event))
  onLoadMore?.forEach(event => registerGenericEventListener("loadMore", event))
  onProductActionClick?.forEach(event => registerGenericEventListener(PRODUCT_ACTION_CLICK, event))
  onExpandedTileImageLoad?.forEach(event => registerGenericEventListener(EXPANDED_TILE_IMAGE_LOAD, event))
  onExpandedTileOpen?.forEach(event => registerGenericEventListener(EXPANDED_TILE_OPEN, event))
  onExpandedTileClose?.forEach(event => registerGenericEventListener(EXPANDED_TILE_CLOSE, event))
  onBeforeExpandedTileImageResize?.forEach(event =>
    registerGenericEventListener(BEFORE_EXPANDED_TILE_IMAGE_RESIZE, event)
  )
  onBeforeExpandedTileClose?.forEach(event => registerGenericEventListener(BEFORE_EXPANDED_TILE_CLOSE, event))
  onBeforeExpandedTileOpen?.forEach(event => registerGenericEventListener(BEFORE_EXPANDED_TILE_OPEN, event))
  onShopspotFlyoutExpand?.forEach(event => registerGenericEventListener(SHOPSPOT_FLYOUT_EXPAND, event))
  onShopspotToggle?.forEach(event => registerGenericEventListener(SHOPSPOT_TOGGLE, event))
  onShopspotOpen?.forEach(event => registerGenericEventListener(SHOPSPOT_OPEN, event))
  onShopspotActionClick?.forEach(event => registerGenericEventListener(SHOPSPOT_ACTION_CLICK, event))
  onUserClick?.forEach(event => registerGenericEventListener(USER_CLICK, event))
  // TODO - Clean this with not required for GA
  onShareClick?.forEach(event => registerGenericEventListener(EVENT_SHARE_CLICK, event))
  onImpression?.forEach(event => registerGenericEventListener(EVENT_IMPRESSION, event))
  onLike?.forEach(event => registerGenericEventListener(EVENT_LIKE, event))
  onDislike?.forEach(event => registerGenericEventListener(EVENT_DISLIKE, event))
  onHover?.forEach(event => registerGenericEventListener(EVENT_HOVER, event))
  onProductClick?.forEach(event => registerGenericEventListener(EVENT_PRODUCT_CLICK, event))
  onProductPinClick?.forEach(event => registerGenericEventListener(EVENT_PRODUCT_PINCLICK, event))
  onProductUserClick?.forEach(event => registerGenericEventListener(EVENT_PRODUCT_USER_CLICK, event))
  onShopspotFlyout?.forEach(event => registerGenericEventListener(EVENT_SHOPSPOT_FLYOUT, event))
  onTileMetadataLoaded?.forEach(event => registerGenericEventListener(EVENT_TILE_METADATA_LOADED, event))
  onTileDataSet?.forEach(event => registerGenericEventListener(EVENT_TILE_DATA_SET, event))
  onHtmlRendered?.forEach(event => registerGenericEventListener(EVENT_HTML_RENDERED, event))
  onJsRendered?.forEach(event => registerGenericEventListener(EVENT_JS_RENDERED, event))
  onGlobalsLoaded?.forEach(event => registerGenericEventListener(EVENT_GLOBALS_LOADED, event))
  onProductPageLoaded?.forEach(event => registerGenericEventListener(EVENT_PRODUCT_PAGE_LOADED, event))
  onProductsUpdated?.forEach(event => registerGenericEventListener(EVENT_PRODUCTS_UPDATED, event))
  onAddToCartFailed?.forEach(event => registerGenericEventListener(EVENT_ADD_TO_CART_FAILED, event))
  onEmailTileLoad?.forEach(event => registerGenericEventListener(EMAIL_TILE_LOAD, event))
  onEmailTileClick?.forEach(event => registerGenericEventListener(EMAIL_TILE_CLICK, event))
  onLikeClick?.forEach(event => registerGenericEventListener(LIKE_CLICK, event))
  onDislikeClick?.forEach(event => registerGenericEventListener(DISLIKE_CLICK, event))
  onTileExpandProductRecsRendered?.forEach(event =>
    registerGenericEventListener(EVENT_TILE_EXPAND_PROD_RECS_RENDERED, event)
  )
  onTileExpandCrossSellersRendered?.forEach(event =>
    registerGenericEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, event)
  )
  onShareMenuOpened?.forEach(event => registerGenericEventListener(EVENT_SHARE_MENU_OPENED, event))
  onShareMenuClosed?.forEach(event => registerGenericEventListener(EVENT_SHARE_MENU_CLOSED, event))
}

export function registerDefaultClickEvents() {
  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles UI element")
  }

  tiles.forEach((tile: HTMLElement) => {
    const tileDataId = tile.getAttribute("data-id")

    if (!tileDataId) {
      throw new Error("Failed to find tile data ID")
    }

    const url = sdk.tiles.getTile(tileDataId)?.original_url

    if (!url) {
      console.warn("Failed to find tile URL", tile)
      return
    }

    tile.onclick = e => {
      handleTileClick(e, url)
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

export function registerCrossSellersLoadListener(fn: (tileId: string, target: HTMLElement) => void = () => {}) {
  sdk.addEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data as string
    const target = customEvent.detail.target as HTMLElement
    fn(tileId, target)
  })
}

export function registerGenericEventListener(eventName: EventName, fn: Callback | EventCallback) {
  sdk.addEventListener(eventName, fn)
}

export function registerShareMenuOpenedListener(fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener(EVENT_SHARE_MENU_OPENED, (event: Event) => {
    const customEvent = event as CustomEvent
    const sourceId = customEvent.detail.sourceId as string
    fn(sourceId)
  })
}

export function registerShareMenuClosedListener(fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener(EVENT_SHARE_MENU_CLOSED, (event: Event) => {
    const customEvent = event as CustomEvent
    const sourceId = customEvent.detail.sourceId as string
    fn(sourceId)
  })
}
