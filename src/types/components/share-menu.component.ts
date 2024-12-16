import { Tile } from "../core"

export interface IShareMenuComponent {
  theme: string
  connectedCallback(): Promise<void>
  render(): Promise<void>
  tile: Tile
  shouldRender: boolean
  registerListener(): void
}
