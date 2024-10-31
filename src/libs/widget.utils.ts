import { ISdk } from "@stackla/public-types"

declare const sdk: ISdk

export function waitForElement(selector: string, timeout: number = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const interval = 100
    const endTime = Date.now() + timeout

    const intervalId = setInterval(() => {
      const element = sdk.querySelector(selector)
      if (element) {
        clearInterval(intervalId)
        resolve(element)
      } else if (Date.now() > endTime) {
        clearInterval(intervalId)
        reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`))
      }
    }, interval)
  })
}
