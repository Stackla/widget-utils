// widget-service.interface.ts

import { WidgetResponse } from "../widgets"
import { ISdk, ITransformedWidgetRequest } from "../core"
import { ITilesService } from "./tiles.service"
import { IBaseService } from "./base.service"

export interface IWidgetService extends IBaseService {
  state: Record<string, unknown>
  tiles: ITilesService | undefined
  setSdk(sdk: ISdk): void
  getSdk(): ISdk
  getWidgetBySelector(selector?: string): IWidgetService
  init(): Promise<IWidgetService>
  executeOnLoad(callback: () => void): Promise<void>
  getTilesService(): ITilesService
  fetchWidgetFromApi(widgetRequest: ITransformedWidgetRequest): Promise<WidgetResponse>
  fetchDraftFromApi(widgetRequest: ITransformedWidgetRequest): Promise<WidgetResponse>
}
