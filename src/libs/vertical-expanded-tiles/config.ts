import { MyWidgetSettings } from "src/types"
import { VerticalExpandedTiles } from "./base.template"
import ProductsTemplate from "./products.template"
import { InlineProductsTemplate } from "./inline-products.template"
import { TileContentTemplate } from "./tile-content.template"

export const loadVerticalExpandedTilesConfig = (config: MyWidgetSettings = {}) => {
  config.templates = {
    ...config.templates
  }
  config.templates["expanded-tiles"] = VerticalExpandedTiles
  config.templates["ugc-product"] = ProductsTemplate
  config.templates["inline-products"] = InlineProductsTemplate
  config.templates["tile-content"] = TileContentTemplate
  config.config = {
    ...config.config,
    expandedTile: {
      ...config.config?.expandedTile,
      swiper_options: {
        ...config.config?.expandedTile?.swiper_options,
        direction: "vertical"
      }
    }
  }

  return config
}
