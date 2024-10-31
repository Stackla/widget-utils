import type { ISdk } from "@stackla/public-types"

declare const sdk: ISdk

export function loadExpandSettingComponents() {
  const { show_shopspots, show_products, show_add_to_cart } = sdk.getExpandedTileConfig()

  if (show_shopspots) {
    sdk.addLoadedComponents(["shopspots"])
  }

  sdk.addLoadedComponents(["expanded-tile", "cross-sellers"])

  if (show_products) {
    sdk.addLoadedComponents(["products"])
  }
  if (show_add_to_cart) {
    sdk.addLoadedComponents(["add-to-cart"])
  }
}
