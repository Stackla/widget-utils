export interface IFontFace {
  fontFamily: string
  src: { url: string; format: string }[]
  fontWeight: string | number
  fontStyle: string
  fontDisplay?: string
}

export function injectFontFaces(root: HTMLElement | ShadowRoot, fontFaces?: IFontFace[]): void {
  if (!fontFaces || fontFaces.length === 0) {
    return
  }

  const generateFontFaceCSS = (fontFace: IFontFace): string => {
    const src = fontFace.src.map(s => `url("${s.url}") format("${s.format}")`).join(", ")
    const fontDisplay = fontFace.fontDisplay ? `font-display: ${fontFace.fontDisplay};` : ""
    return `
      @font-face {
        font-family: ${fontFace.fontFamily};
        src: ${src};
        font-weight: ${fontFace.fontWeight};
        font-style: ${fontFace.fontStyle};
        ${fontDisplay}
      }
    `
  }

  const style = document.createElement("style")
  const fontFacesCSS = fontFaces.map(generateFontFaceCSS).join("\n")

  style.innerHTML = fontFacesCSS
  root.appendChild(style)
}
