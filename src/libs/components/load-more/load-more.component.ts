import { LoadMoreTemplate as template } from "./load-more.template"

export default class LoadMoreComponent extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this?.appendChild(template())
  }

  disconnectedCallback() {
    this?.replaceChildren()
  }
}

try {
  customElements.define("load-more", LoadMoreComponent)
  // eslint-disable-next-line
} catch (err) {
  // Allow load-more to be redefined without an error
}
