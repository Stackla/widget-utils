import type { ISdk } from "../"

declare const sdk: ISdk

export function loadExpandSettingComponents() {
  const { show_shopspots, show_products, show_add_to_cart, show_carousel_grouping } = sdk.getExpandedTileConfig()

  if (show_shopspots) {
    sdk.addLoadedComponents(["shopspots"])
  }

  if (show_carousel_grouping) {
    sdk.addLoadedComponents(["carousel-grouping"])
  }

  if (show_products) {
    sdk.addLoadedComponents(["products", "inline-products"])
  }
  if (show_add_to_cart) {
    sdk.addLoadedComponents(["add-to-cart"])
  }
}
