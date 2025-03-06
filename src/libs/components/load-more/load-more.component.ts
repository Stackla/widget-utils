import { ISdk } from "src/types"
import { LoadMoreTemplate as template } from "./load-more.template"

declare const sdk: ISdk

export default class LoadMoreComponent extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    if (sdk.getStyleConfig().load_more_type === "button") {
      this.appendChild(template())
    }
  }

  disconnectedCallback() {
    this.replaceChildren()
  }
}

try {
  customElements.define("load-more", LoadMoreComponent)
  // eslint-disable-next-line
} catch (err) {
  // Allow load-more to be redefined without an error
}
