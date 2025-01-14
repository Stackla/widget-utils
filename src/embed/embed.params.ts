export const generateDataHTMLStringByParams = (params: Record<string, string | boolean | number>): string => {
  return Object.entries(params)
    .map(([key, value]) => ` data-${key}="${value}"`)
    .join("")
}
