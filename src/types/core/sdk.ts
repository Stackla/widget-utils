import { IWidgetService } from "../services/widget.service"
import { IPlacement } from "./placement"
import { ITilesService } from "../services/tiles.service"
import { IEventService } from "../services/event.service"
import { EventMapping, EventName } from "../../events"
import { ClaimConfig, ExpandedTileOptions, InlineTileOptions, Style, WidgetOptions, WidgetResponse } from "../widgets"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Template<C> = (sdk: ISdk, component?: C) => string | HTMLElement

export interface ISdk {
  widget: IWidgetService
  placement: IPlacement
  events: IEventService
  tiles: ITilesService

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
  setState(key: string, value: unknown): void
  getState(key: string): unknown
  getNodeId(): string
  loadTemplate(templateType: string): Promise<void>
  getExpandedTileConfig(): ExpandedTileOptions
  getInlineTileConfig(): InlineTileOptions
  getClaimTileConfig(): ClaimConfig
  getStyleConfig(): Style
}
