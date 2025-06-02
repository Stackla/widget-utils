import { handleTileClick } from "../libs/tile.lib"
import { ISdk, EnforcedWidgetSettings } from "../types"

export type EventCallback = (event: CustomEvent) => void | Promise<void>

export const EVENT_PRODUCT_ACTION_CLICK = "productActionClick"
export const EVENT_PRODUCT_HIDE_ICON_CLICK = "productHideIconClick"
export const EVENT_EXPANDED_TILE_IMAGE_LOAD = "expandedTileImageLoad"
export const EVENT_EXPANDED_TILE_OPEN = "expandedTileOpen"
export const EVENT_EXPANDED_TILE_CLOSE = "expandedTileClose"
export const EVENT_BEFORE_EXPANDED_TILE_IMAGE_RESIZE = "beforeExpandedTileImageResize"
export const EVENT_EXPANDED_TILE_IMAGE_RESIZE = "expandedTileImageResize"
export const EVENT_BEFORE_EXPANDED_TILE_CLOSE = "beforeExpandedTileClose"
export const EVENT_BEFORE_EVENT_EXPANDED_TILE_OPEN = "beforeExpandedTileOpen"
export const EVENT_SHOPSPOT_FLYOUT_EXPAND = "shopspotFlyoutExpand"
export const EVENT_SHOPSPOT_TOGGLE = "shopspotToggle"
export const EVENT_SHOPSPOT_OPEN = "shopspotOpen"
export const EVENT_SHOPSPOT_ACTION_CLICK = "shopspotActionClick"
export const EVENT_USER_CLICK = "userClick"
export const EVENT_IMPRESSION = "impression"
export const EVENT_LOAD = "load"
export const EVENT_LOAD_MORE = "moreLoad"
export const EVENT_LIKE = "like"
export const EVENT_DISLIKE = "dislike"
export const EVENT_HOVER = "tileHover"
export const EVENT_PRODUCT_CLICK = "productClick"
export const EVENT_PRODUCT_PINCLICK = "pinClick"
export const EVENT_TILE_EXPAND = "tileExpand"
export const EVENT_PRODUCT_EVENT_USER_CLICK = "userClick"
export const EVENT_SHARE_CLICK = "shareClick" //GA Specific. Needs cleanup
export const EVENT_SHOPSPOT_FLYOUT = "shopspotFlyout"
export const EVENT_TILE_METADATA_LOADED = "tileMetadataLoaded"
export const EVENT_TILE_DATA_SET = "tileDataSet"
export const EVENT_HTML_RENDERED = "htmlRendered"
export const EVENT_JS_RENDERED = "jsRendered"
export const EVENT_GLOBALS_LOADED = "globalsLoaded"
export const EVENT_CROSS_SELLERS_LOADED = "crossSellersLoaded"
export const EVENT_PRODUCT_PAGE_LOADED = "productPageLoaded"
export const EVENT_PRODUCTS_UPDATED = "productsUpdated"
export const EVENT_ADD_TO_CART_FAILED = "addToCartFailed"
export const EVENT_TILES_UPDATED = "tilesUpdated"
export const EVENT_WIDGET_INIT_COMPLETE = "widgetInitComplete"
export const EMAIL_TILE_LOAD = "emailTileLoad"
export const EMAIL_TILE_CLICK = "emailTileClick"
export const EVENT_LIKE_CLICK = "likeClick"
export const EVENT_DISLIKE_CLICK = "dislikeClick"
export const EVENT_TILE_EXPAND_RENDERED = "expandedTileRendered"
export const EVENT_TILE_EXPAND_PROD_RECS_RENDERED = "tileExpandProductRecsRendered"
export const EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED = "tileExpandCrossSellersRendered"
export const EVENT_TILE_BG_IMG_ERROR = "tileBgImageError"
export const EVENT_TILE_BG_IMG_RENDER_COMPLETE = "tileBgImgRenderComplete"
export const EVENT_SHARE_MENU_OPENED = "shareMenuOpened"
export const EVENT_SHARE_MENU_CLOSED = "shareMenuClosed"
export const EVENT_TAGS_LOADED = "tagsLoaded"
export const EVENT_PRODUCT_NAVIGATION = "productNavigation"
export const EVENT_TILES_DEPLETED = "tilesDepleted"
export const EVENT_MOUSE_LEAVE = "mouseLeave"

export const allEvents = [
  EVENT_PRODUCT_ACTION_CLICK,
  EVENT_PRODUCT_HIDE_ICON_CLICK,
  EVENT_EXPANDED_TILE_IMAGE_LOAD,
  EVENT_EXPANDED_TILE_OPEN,
  EVENT_EXPANDED_TILE_CLOSE,
  EVENT_BEFORE_EXPANDED_TILE_IMAGE_RESIZE,
  EVENT_EXPANDED_TILE_IMAGE_RESIZE,
  EVENT_BEFORE_EXPANDED_TILE_CLOSE,
  EVENT_BEFORE_EVENT_EXPANDED_TILE_OPEN,
  EVENT_SHOPSPOT_FLYOUT_EXPAND,
  EVENT_SHOPSPOT_TOGGLE,
  EVENT_SHOPSPOT_OPEN,
  EVENT_SHOPSPOT_ACTION_CLICK,
  EVENT_USER_CLICK,
  EVENT_IMPRESSION,
  EVENT_LOAD,
  EVENT_LOAD_MORE,
  EVENT_LIKE,
  EVENT_DISLIKE,
  EVENT_HOVER,
  EVENT_PRODUCT_CLICK,
  EVENT_PRODUCT_PINCLICK,
  EVENT_TILE_EXPAND,
  EVENT_PRODUCT_EVENT_USER_CLICK,
  EVENT_SHARE_CLICK,
  EVENT_SHOPSPOT_FLYOUT,
  EVENT_TILE_METADATA_LOADED,
  EVENT_TILE_DATA_SET,
  EVENT_HTML_RENDERED,
  EVENT_JS_RENDERED,
  EVENT_GLOBALS_LOADED,
  EVENT_CROSS_SELLERS_LOADED,
  EVENT_PRODUCT_PAGE_LOADED,
  EVENT_PRODUCTS_UPDATED,
  EVENT_ADD_TO_CART_FAILED,
  EVENT_TILES_UPDATED,
  EVENT_WIDGET_INIT_COMPLETE,
  EMAIL_TILE_LOAD,
  EMAIL_TILE_CLICK,
  EVENT_LIKE_CLICK,
  EVENT_DISLIKE_CLICK,
  EVENT_TILE_EXPAND_RENDERED,
  EVENT_TILE_EXPAND_PROD_RECS_RENDERED,
  EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED,
  EVENT_TILE_BG_IMG_ERROR,
  EVENT_TILE_BG_IMG_RENDER_COMPLETE,
  EVENT_SHARE_MENU_OPENED,
  EVENT_SHARE_MENU_CLOSED,
  EVENT_TAGS_LOADED,
  EVENT_TILES_DEPLETED,
  EVENT_MOUSE_LEAVE
]

export type AdvancedEventNames = [`${typeof EVENT_PRODUCT_NAVIGATION}:${string}`]

export type EventName = (typeof allEvents)[number] | AdvancedEventNames[number]

export type EventMapping = Record<EventName, CustomEvent>

export const callbackDefaults = {
  onResize: [],
  onLoad: [],
  onTileExpand: [],
  onTileClose: [],
  onTileRendered: [],
  onTilesUpdated: [],
  onCrossSellersRendered: [],
  onWidgetInitComplete: [],
  onTileBgImgRenderComplete: [],
  onTileBgImageError: [],
  onProductActionClick: [],
  onProductHideIconClick: [],
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
  onMouseLeave: [],
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
export type Callbacks = Record<keyof typeof callbackDefaults, EventCallback[]>

/**
 * Registers event listeners for the widget.
 * @param settings
 */
export function loadListeners(sdk: ISdk, settings: EnforcedWidgetSettings) {
  const {
    onLoad,
    onTileExpand,
    onTileClose,
    onCrossSellersRendered,
    onTilesUpdated,
    onWidgetInitComplete,
    onTileBgImgRenderComplete,
    onTileBgImageError,
    onResize,
    onLoadMore,
    onProductActionClick,
    onProductHideIconClick,
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
    onShareMenuClosed,
    onMouseLeave
  } = settings.callbacks

  onLoad?.forEach(event => registerGenericEventListener(sdk, EVENT_LOAD, event))
  onTileExpand?.forEach(event => registerGenericEventListener(sdk, EVENT_TILE_EXPAND_RENDERED, event))
  onTileClose?.forEach(event => registerGenericEventListener(sdk, EVENT_EXPANDED_TILE_CLOSE, event))
  onCrossSellersRendered?.forEach(event => registerGenericEventListener(sdk, EVENT_CROSS_SELLERS_LOADED, event))
  onWidgetInitComplete?.forEach(event => registerGenericEventListener(sdk, EVENT_WIDGET_INIT_COMPLETE, event))
  onTileBgImgRenderComplete?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_TILE_BG_IMG_RENDER_COMPLETE, event)
  )
  onTileBgImageError?.forEach(event => registerGenericEventListener(sdk, EVENT_TILE_BG_IMG_ERROR, event))
  // @ts-expect-error Event is not compatible with resize fn
  onResize?.forEach(event => window.addEventListener("resize", event))
  onTilesUpdated?.forEach(event => registerGenericEventListener(sdk, EVENT_TILES_UPDATED, event))
  onLoadMore?.forEach(event => registerGenericEventListener(sdk, EVENT_LOAD_MORE, event))
  onProductActionClick?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_ACTION_CLICK, event))
  onProductHideIconClick?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_HIDE_ICON_CLICK, event))
  onExpandedTileImageLoad?.forEach(event => registerGenericEventListener(sdk, EVENT_EXPANDED_TILE_IMAGE_LOAD, event))
  onExpandedTileOpen?.forEach(event => registerGenericEventListener(sdk, EVENT_EXPANDED_TILE_OPEN, event))
  onExpandedTileClose?.forEach(event => registerGenericEventListener(sdk, EVENT_EXPANDED_TILE_CLOSE, event))
  onBeforeExpandedTileImageResize?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_BEFORE_EXPANDED_TILE_IMAGE_RESIZE, event)
  )
  onBeforeExpandedTileClose?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_BEFORE_EXPANDED_TILE_CLOSE, event)
  )
  onBeforeExpandedTileOpen?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_BEFORE_EVENT_EXPANDED_TILE_OPEN, event)
  )
  onShopspotFlyoutExpand?.forEach(event => registerGenericEventListener(sdk, EVENT_SHOPSPOT_FLYOUT_EXPAND, event))
  onShopspotToggle?.forEach(event => registerGenericEventListener(sdk, EVENT_SHOPSPOT_TOGGLE, event))
  onShopspotOpen?.forEach(event => registerGenericEventListener(sdk, EVENT_SHOPSPOT_OPEN, event))
  onShopspotActionClick?.forEach(event => registerGenericEventListener(sdk, EVENT_SHOPSPOT_ACTION_CLICK, event))
  onUserClick?.forEach(event => registerGenericEventListener(sdk, EVENT_USER_CLICK, event))
  // TODO - Clean this with not required for GA
  onShareClick?.forEach(event => registerGenericEventListener(sdk, EVENT_SHARE_CLICK, event))
  onImpression?.forEach(event => registerGenericEventListener(sdk, EVENT_IMPRESSION, event))
  onLike?.forEach(event => registerGenericEventListener(sdk, EVENT_LIKE, event))
  onDislike?.forEach(event => registerGenericEventListener(sdk, EVENT_DISLIKE, event))
  onHover?.forEach(event => registerGenericEventListener(sdk, EVENT_HOVER, event))
  onProductClick?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_CLICK, event))
  onProductPinClick?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_PINCLICK, event))
  onProductUserClick?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_EVENT_USER_CLICK, event))
  onShopspotFlyout?.forEach(event => registerGenericEventListener(sdk, EVENT_SHOPSPOT_FLYOUT, event))
  onTileMetadataLoaded?.forEach(event => registerGenericEventListener(sdk, EVENT_TILE_METADATA_LOADED, event))
  onTileDataSet?.forEach(event => registerGenericEventListener(sdk, EVENT_TILE_DATA_SET, event))
  onHtmlRendered?.forEach(event => registerGenericEventListener(sdk, EVENT_HTML_RENDERED, event))
  onJsRendered?.forEach(event => registerGenericEventListener(sdk, EVENT_JS_RENDERED, event))
  onGlobalsLoaded?.forEach(event => registerGenericEventListener(sdk, EVENT_GLOBALS_LOADED, event))
  onProductPageLoaded?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCT_PAGE_LOADED, event))
  onProductsUpdated?.forEach(event => registerGenericEventListener(sdk, EVENT_PRODUCTS_UPDATED, event))
  onAddToCartFailed?.forEach(event => registerGenericEventListener(sdk, EVENT_ADD_TO_CART_FAILED, event))
  onEmailTileLoad?.forEach(event => registerGenericEventListener(sdk, EMAIL_TILE_LOAD, event))
  onEmailTileClick?.forEach(event => registerGenericEventListener(sdk, EMAIL_TILE_CLICK, event))
  onLikeClick?.forEach(event => registerGenericEventListener(sdk, EVENT_LIKE_CLICK, event))
  onDislikeClick?.forEach(event => registerGenericEventListener(sdk, EVENT_DISLIKE_CLICK, event))
  onTileExpandProductRecsRendered?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_TILE_EXPAND_PROD_RECS_RENDERED, event)
  )
  onTileExpandCrossSellersRendered?.forEach(event =>
    registerGenericEventListener(sdk, EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, event)
  )
  onShareMenuOpened?.forEach(event => registerGenericEventListener(sdk, EVENT_SHARE_MENU_OPENED, event))
  onShareMenuClosed?.forEach(event => registerGenericEventListener(sdk, EVENT_SHARE_MENU_CLOSED, event))
  onMouseLeave?.forEach(event => registerGenericEventListener(sdk, EVENT_MOUSE_LEAVE, event))
}

export function registerTileExpandListener(sdk: ISdk, fn: (sdk: ISdk, tileId: string) => void = () => {}) {
  sdk.addEventListener(EVENT_TILE_EXPAND, (event: CustomEvent) => {
    const tileId = event.detail.data.tileId as string
    fn(sdk, tileId)
  })
}

export function registerDefaultClickEvents(sdk: ISdk) {
  const tiles = sdk.querySelectorAll(".ugc-tile")

  if (!tiles) {
    throw new Error("Failed to find tiles UI element")
  }

  tiles.forEach((tile: HTMLElement) => {
    const tileDataId = tile.getAttribute("data-id")

    if (!tileDataId) {
      throw new Error("Failed to find tile data ID")
    }

    const url = sdk.getTileById(tileDataId)?.original_url

    if (!url) {
      console.warn("Failed to find tile URL", tile)
      return
    }

    tile.onclick = e => {
      handleTileClick(sdk, e, url)
    }
  })
}

export function registerCrossSellersLoadListener(
  sdk: ISdk,
  fn: (tileId: string, target: HTMLElement) => void = () => {}
) {
  sdk.addEventListener(EVENT_TILE_EXPAND_CROSS_SELLERS_RENDERED, (event: Event) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.data as string
    const target = customEvent.detail.target as HTMLElement
    fn(tileId, target)
  })
}

export function registerGenericEventListener(sdk: ISdk, eventName: EventName, fn: EventCallback) {
  sdk.addEventListener(eventName, fn)
}

export function registerShareMenuOpenedListener(sdk: ISdk, fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener(EVENT_SHARE_MENU_OPENED, (event: Event) => {
    const customEvent = event as CustomEvent
    const sourceId = customEvent.detail.sourceId as string
    fn(sourceId)
  })
}

export function registerShareMenuClosedListener(sdk: ISdk, fn: (tileId: string) => void = () => {}) {
  sdk.addEventListener(EVENT_SHARE_MENU_CLOSED, (event: Event) => {
    const customEvent = event as CustomEvent
    const sourceId = customEvent.detail.sourceId as string
    fn(sourceId)
  })
}

export function registerProductsUpdatedListener(
  sdk: ISdk,
  fn: (sdk: ISdk, tileId: string, target: HTMLElement) => void = () => {}
) {
  sdk.addEventListener(EVENT_PRODUCTS_UPDATED, (event: CustomEvent) => {
    const customEvent = event as CustomEvent
    const tileId = customEvent.detail.tileId as string
    const target = customEvent.detail.target as HTMLElement
    fn(sdk, tileId, target)
  })
}
