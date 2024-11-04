import { IBaseService } from "./base.service"
import { EventMapping, EventName } from "../../events/constants"

export interface IEventService extends IBaseService {
  listenOrFindEvent<T extends EventName>(eventType: T, callback: (event: EventMapping[T]) => void): void
  removeListeners(listenersForRemoval: EventName[], scope?: string): void
  addUgcEventListener<T extends EventName>(
    eventType: T,
    callback: (event: EventMapping[T]) => void,
    scope?: string
  ): void
  getUniqueSelector(): string
  dispatchUgcEvent(event: CustomEvent, scope?: string): void
  getEmittedEvents(): EventName[]
}
