import { ISdk, Tile } from "../../../types"

export type ExpandedTileProps = {
  sdk: ISdk
  tile: Tile
}

export type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
}
