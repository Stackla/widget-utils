// clipboard copy polyfill

export function useClipboard() {
  if (navigator.clipboard) {
    return (inputElement: HTMLInputElement) => {
      return navigator.clipboard.writeText(inputElement.value)
    }
  }

  // compatibility with older browsers
  return (inputElement: HTMLInputElement) =>
    new Promise<void>(resolve => {
      inputElement.select()
      document.execCommand("copy")
      resolve()
    })
}
