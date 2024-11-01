import { Tile } from "../../core/tile";

export interface ProductTag {
  id: string
  ext_product_id: string
}

export interface ITileEventData {
  tileData: Tile
  widgetId: string
  filterId?: string
  shareNetwork?: string
  locationId?: string
  locationName?: string
  nostoUgcLocationId?: string
  nostoUgcLocationName?: string
  productTag?: ProductTag
  [key: string]: unknown
}
