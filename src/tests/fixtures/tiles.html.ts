import tiles from "./tiles"

function createHTMLElement(tagName: string, attributes: { [key: string]: string }) {
  const element = window.document.createElement(tagName)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  return element
}

export default tiles.map((tile, index) => {
  if (index === 0) {
    return createHTMLElement("div", {
      class: "ugc-tile glide__slide--active",
      "data-id": `${tile.id}`,
      "data-media": "image"
    })
  }
  return createHTMLElement("div", { class: "ugc-tile", "data-id": `${tile.id}`, "data-media": "image" })
})
