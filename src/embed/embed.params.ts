import { sanitizeHtmlBasic } from "../libs"

export const generateDataHTMLStringByParams = (params: Record<string, string | boolean | number>): string => {
  const data = Object.entries(params)
    .map(([key, value]) => ` data-${key}="${value}"`)
    .join("")

  return sanitizeHtmlBasic(data)
}
