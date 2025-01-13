export const generateDataHTMLStringByParams = (params: Record<string, string | boolean | number>): string => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return `${acc} data-${key}="${value}"`
    }

    return acc
  }, "")
}
