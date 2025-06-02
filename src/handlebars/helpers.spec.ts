import Handlebars from "handlebars"
import { loadHelpers } from "."
import fs from "fs"
import path from "path"

function getHelpers() {
  const files = fs.readdirSync(path.join(__dirname, "helpers"))
  return files
    .filter(it => it.endsWith(".helper.ts"))
    .map(file => file.substring(0, file.indexOf(".")))
    .map(file => {
      const words = file.split("-")
      const wordsCamelCase = words.map((word, index) => {
        word = word.toLowerCase()
        if (index === 0) {
          return word
        }

        return word.slice(0, 1).toUpperCase() + word.slice(1)
      })

      return wordsCamelCase.join("")
    })
}

describe("loadJoinHelper", () => {
  beforeAll(() => {
    loadHelpers(Handlebars, "unknown")
  })

  it("all helpers should be loaded", () => {
    const helperNames = getHelpers()
    const loadedHelpers = Handlebars.helpers

    const activeHelpers = Object.keys(loadedHelpers)
      .filter(key => helperNames.includes(key))
      .filter(matchedKey => loadedHelpers[matchedKey]).length

    expect(activeHelpers).toBe(helperNames.length)
  })
})
