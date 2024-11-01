import { ITileEventData } from "./tile-event"

export interface WidgetData {
  widgetId: string
}

export interface IWidgetEvent extends CustomEvent {
  detail: {
    data: ITileEventData
  }
}
