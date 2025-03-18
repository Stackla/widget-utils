import { Product, TagExtended, Tile, Hotspot } from "../core/tile"
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
  searchTiles(query: string, clearExistingTiles: boolean): Promise<Tile[] | undefined>
  fetchAllTiles(): Promise<Tile[]>
  fetchTile(tileId: string): Promise<Tile>
  fetchTiles(page?: number, limit?: number): Promise<Tile[] | undefined>
  setMediaType(mediaType: string): void
  getPage(): number
  setTile(tile: Tile): void
  getTile(tileId?: string): Tile | undefined
  getProductById(productId: string): Product | undefined
  getSelectedProduct(): Product | undefined
  setSelectedProductId(productId: string): void
  addProducts(products: Product[]): void
  getShopspotsFromTile(tileId?: string): Promise<Hotspot[]>
  waitForTile(tileId: string, counter?: number): Promise<Tile | undefined>
  getFirstProductInTile(tile: Tile): Product | undefined
  getProductTagsFromTile(tile: Tile): Product[]
  getTagsExtendedFromTile(tile: Tile): TagExtended[]
  getIndexOfProductInTile?(tile: Tile, productId: string): number
  getPreviousProductInTile?(tile: Tile): Product | undefined
  getNextProductInTile?(tile: Tile): Product | undefined
}
