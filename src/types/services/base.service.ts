import { IPlacement } from "../core/placement"
import { IEventService } from "./event.service"
export declare abstract class IBaseService {
  protected placement: IPlacement
  setState(key: string, value: unknown): void
  getState(key: string): unknown
  getPlacement(): IPlacement
  getEvents(): IEventService
}
