import tilesAsHTML from "../tests/fixtures/tiles.html"
import tiles from "../tests/fixtures/tiles"
import { getNextNavigatedTile } from "./widget.features"

describe("Test Tile Features to ensure that expanded tiles function as expected", () => {
  it("should get next or previous tile based on direction", () => {
    const currentTile = tiles[0]
    const direction = "next"
    const nextTile = tiles[1]

    const result = getNextNavigatedTile(currentTile, tilesAsHTML, direction)

    expect(result).toEqual(nextTile.id)
  })
})
