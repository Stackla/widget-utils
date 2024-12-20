import { TagExtended, Tile } from "../core/tile"
import { IBaseService } from "./base.service"

export interface ITilesService extends IBaseService {
  page: number
  visibleTilesCount: number
  tiles: Record<string, Tile>
  trashedTiles: Record<string, boolean>
  selectedProductId?: string
  hideBrokenTiles: boolean
  preloadImages: boolean

  loadTilesUntilVisibleTilesCount(): Promise<void>
  getTotalTilesCount(): number
  enableAutoAddNewTiles(): void
  disableAutoAddNewTiles(): void
  setVisibleTilesCount(visibleTilesCount: number): void
  postRender(): Promise<void>
  loadMore(limit?: number): Promise<void>
  hasMorePages(): boolean
  hasMoreTiles(): boolean
  getLoadedTilesCount(): number
  getVisibleTilesInDomCount(): number
  searchTiles(query: string): Promise<Tile[]>
  fetchAllTiles(): Promise<Tile[]>
  fetchTile(tileId: string): Promise<Tile>
  fetchTiles(page?: number, limit?: number): Promise<void>
  getPage(): number
  setTile(tile: Tile): void
  getTile(tileId?: string): Tile | undefined
  getProductById(productId: string): TagExtended
  getSelectedProduct(): TagExtended
  setSelectedProductId(productId: string): void
  addProducts(products: TagExtended[]): void
  getShopspotsFromTile(tileId?: string): Promise<TagExtended[]>
}
