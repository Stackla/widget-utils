import { Product } from ".."
import { IStaticComponent } from "./static.component"

export interface IAddToCartComponent extends IStaticComponent {
  getProduct: () => Product
}
