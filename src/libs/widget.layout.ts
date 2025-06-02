import type { ISdk } from "../"

export function addCSSVariablesToPlacement(sdk: ISdk, cssVariables: string) {
  const shadowRoot = sdk.getShadowRoot()
  const style = document.createElement("style")
  style.innerHTML = `
      :host {
          ${cssVariables}
      }`
  shadowRoot.appendChild(style)
}
