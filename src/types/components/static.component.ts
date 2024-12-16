import { IPlacement, ISdk } from "../core"
import { IEventService, ITilesService, IWidgetService } from "../services"
import { RenderHTML } from "../types"

export interface IStaticComponent {
  renderHTML: RenderHTML
  visible: boolean
  componentName: string
  widgetComponentSelector: string

  getTileId(): string
  getEvents(): IEventService
  waitForGlobals(): Promise<void>
  setRenderHTML(renderHTML: RenderHTML): void
  setVisible(draw: boolean): this
  getCSSWithGlobalUrls(): string[]
  render<T>(component?: T): Promise<void>
  getSdk(): ISdk
  connectedCallback(): Promise<void>
  getWidgetService(): IWidgetService
  getPlacement(): IPlacement
  getTilesService(): ITilesService
}
