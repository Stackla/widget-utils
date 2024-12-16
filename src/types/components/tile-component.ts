import { IStaticComponent } from "./static.component"

export interface ITileContentComponent extends IStaticComponent {
  mode: string
  context: string
  trimDescription: boolean
  sourceId: string
  renderConfig: {
    renderUserInfo: boolean
    renderAvatarImage: boolean
    renderUserTitle: boolean
    renderDescription: boolean
    renderCaption: boolean
    renderTimephrase: boolean
    renderShareMenu: boolean
  }
  connectedCallback(): Promise<void>
  disconnectedCallback(): void
  render(): Promise<void>
  initTrimHandler(captionElement: HTMLDivElement): void
  registerResizeObserver(captionElement: HTMLDivElement, callback: (ele: HTMLDivElement) => void): void
  supportsLineClamp(): boolean
  trimeMessage(captionElement: HTMLDivElement): void
  calculateClampLines(captionElement: HTMLDivElement): void
  getLineHeight(captionElement: HTMLDivElement): number
}
