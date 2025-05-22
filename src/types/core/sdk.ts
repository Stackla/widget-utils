import { EventMapping, EventName } from "../../events"
import { Sdk } from "../types"
import { ClaimConfig, ExpandedTileOptions, InlineTileOptions, Style, WidgetOptions, WidgetResponse } from "../widgets"
import { Content, Hotspot, Product, Tile } from "./tile"

type HTMLResult = string | HTMLElement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Template = (sdk: Sdk, component: any) => HTMLResult

export interface ISdk {
  querySelector: <T extends Element = HTMLElement>(selector: string) => T | null | undefined
  querySelectorAll: <T extends Element = HTMLElement>(selector: string) => NodeListOf<T> | undefined
  getEmittedEvents(): EventName[]
  getRegisteredEvents(): EventName[]
  addEventListener<T extends EventName>(
    event: T,
    callback: (event: EventMapping[T]) => void,
    htmlSelector?: NodeListOf<Element> | Element
  ): void
  triggerEvent<T extends EventName>(event: T, data?: object): void
  getWidgetContainer(): WidgetResponse
  getWidgetOptions(): WidgetOptions & {
    plugins?: Record<string, { config: Record<string, never> }>
  }
  addLoadedComponents(components: string[]): void
  getLoadedComponents(): string[]
  isComponentLoaded(component: string): boolean
  addWidgetCustomStyles(content: string): void
  addSharedCssCustomStyles(key: string, content: string, componentNames: string[]): void
  addCSSImportUrl(url: string): Promise<void>
  addCSSToComponent(css: string, componentName: string): void
  addTemplateToComponent(template: Template, componentName: string): void
  setState<T>(key: string, value: T): void
  setTile(tile: Tile): void
  getState<T>(key: string): T
  getNodeId(): string | undefined
  loadTemplate(templateType: string): Promise<void>
  getExpandedTileConfig(): ExpandedTileOptions
  getInlineTileConfig(): InlineTileOptions
  getClaimTileConfig(): ClaimConfig | undefined
  getStyleConfig(): Style
  waitForTile(tileId: string, counter?: number): Promise<Tile | undefined>
  updateWidgetStyle(mutatedStyle: Partial<Style>): void
  updateInlineTileOptions(mutatedInlineTileOptions: Partial<InlineTileOptions>): void
  updateExpandedTileOptions(mutatedExpandedTileOptions: Partial<ExpandedTileOptions>): void
  setHideBrokenTiles(hideBrokenTiles: boolean): void
  setPreloadImages(preloadImages: boolean): void
  setMediaType(mediaType: "video" | "image"): void
  getWidgetId(): string
  getTiles(): Tile[]
  getTile(): Tile | undefined
  enableAutoAddNewTiles(): void
  getShadowRoot(): ShadowRoot
  getTileById(tileId: string): Tile | undefined
  getElement: () => HTMLElement | undefined
  setVisibleTilesCount(visibleTilesCount: number): void
  loadTilesUntilVisibleTilesCount(): Promise<void>
  hasMoreTiles(): boolean
  getSelectedProduct(): Product | undefined
  searchTiles(query: string, clearExistingTiles: boolean): void
  openExpandedTiles(tileId: string): void
  closeExpandedTiles(): void
  getShopspotsFromTile(tileId: string): Promise<Hotspot[]>
  getFirstProductInTile(tile: Tile): Product | undefined
  isPaginationEnabled(): boolean
  isScrollWidget(): boolean
  getProductTagsFromTile(tile: Tile): Product[]
  getContentTagsFromTile(tile: Tile): Content[]
  loadMore(): Promise<void>
  getProductTagById(productId: string): Product | undefined
  getCustomTemplate(component: string): Template | undefined
  getTagGroup(): string | undefined
}
