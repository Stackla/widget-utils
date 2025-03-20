import { EventMapping, EventName } from "../../events"
import { ClaimConfig, ExpandedTileOptions, InlineTileOptions, Style, WidgetOptions, WidgetResponse } from "../widgets"
import { Hotspot, Product, Tile } from "./tile"

export type Template<C> = (sdk: ISdk, component?: C) => string | HTMLElement

export interface ISdk {
  querySelector<T extends Element = HTMLElement>(selector: string): T
  querySelectorAll<T extends Element = HTMLElement>(selector: string): NodeListOf<T>
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
  addTemplateToComponent<C>(template: Template<C>, componentName: string): void
  setState<T>(key: string, value: T): void
  getState<T>(key: string): T
  getNodeId(): string
  loadTemplate(templateType: string): Promise<void>
  getExpandedTileConfig(): ExpandedTileOptions
  getInlineTileConfig(): InlineTileOptions
  getClaimTileConfig(): ClaimConfig
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
  getElement: () => HTMLElement
  setVisibleTilesCount(visibleTilesCount: number): void
  loadTilesUntilVisibleTilesCount(): Promise<void>
  hasMoreTiles(): boolean
  getSelectedProduct(): Product | undefined
  searchTiles(query: string, clearExistingTiles: boolean): void
  openExpandedTiles(tileId: string): void
  closeExpandedTiles(): void
  getShopspotsFromTile(tileId: string): Hotspot[]
}
