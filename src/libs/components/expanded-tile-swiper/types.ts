import { Tile } from "../../../types"

export type ExpandedTileProps = {
  tile: Tile
}

export type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
}

export type ContentWrapperProps = {
  id: string
  parent?: string
}
