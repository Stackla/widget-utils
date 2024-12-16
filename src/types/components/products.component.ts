import { TagExtended } from "../"
import { IStaticComponent } from "./static.component"

export interface IProductsComponent extends IStaticComponent {
  registerEvents(): void
  clearListeners(): void
  refreshEvents(): void
  disconnectedCallback(): void
  connectedCallback(): Promise<void>
  loadNostoExternalScript(): Promise<void>
  initiateNosto(products: TagExtended[]): Promise<TagExtended[]>
  loadProductRecommendation(): Promise<void>
  render(): Promise<void>
}
