import { ISdk, Tile } from "../../../types"

export type ExpandedTileProps = {
  tile: Tile
  sdk: ISdk
}

export type ShopspotProps = {
  shopspotEnabled: boolean
  parent?: string
  tileId: string
  sdk: ISdk
}

export type ContentWrapperProps = {
  id: string
  parent?: string
  sdk: ISdk
}
