import { IPlacement } from "../core/placement"
import { IWidgetService } from "../services"

export interface IUgcComponent extends HTMLElement {
  placement?: IPlacement
  getShadowRoot(): ShadowRoot
  getPlacement(): IPlacement
  getWidgetService(): IWidgetService
}
