import { getNextNavigatedTile } from "./widget.features"

const tiles = [
  {
    id: "1",
    youtube_id: "youtube_id_1",
    tiktok_id: "tiktok_id_1"
  },
  {
    id: "2",
    youtube_id: "youtube_id_2",
    tiktok_id: "tiktok_id_2"
  },
  {
    id: "3",
    youtube_id: "youtube_id_3",
    tiktok_id: "tiktok_id_3"
  }
]

const rawTileHTML = [
  `<div class="ugc-tile swiper-slide" data-id="1" data-yt-id="youtube_id_1" data-tiktok-id="tiktok_id_1"></div>`,
  `<div class="ugc-tile swiper-slide" data-id="2" data-yt-id="youtube_id_2" data-tiktok-id="tiktok_id_2"></div>`
]

const tilesAsHTML = rawTileHTML.map(tile => {
  const div = document.createElement("div")
  div.innerHTML = tile
  return div.firstChild as HTMLElement
})

describe("Test Tile Features to ensure that expanded tiles function as expected", () => {
  it("should get next or previous tile based on direction", () => {
    const currentTile = tiles[0]
    const direction = "next"
    const nextTile = tiles[1]

    // @ts-expect-error Partial tile data
    const result = getNextNavigatedTile(currentTile, tilesAsHTML, direction)

    expect(result).toEqual(nextTile.id)
  })
})
