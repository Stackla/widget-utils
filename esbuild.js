const path = require("path")
const { globSync } = require("glob")
const fs = require("fs-extra")
const { sassPlugin } = require("esbuild-sass-plugin")
const { build } = require("esbuild")
fs.removeSync("./dist")

build({
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/components/**/index.ts")],
  bundle: true,
  format: "esm",
  jsx: "automatic",
  //outfile: path.resolve(__dirname, "dist/index.js"),
  outdir: "dist",
  plugins: [
    sassPlugin({
      type: "css-text",
      minify: true
    })
  ]
}).catch(() => process.exit(1))

const sourceDir = "./src"
const destDir = "./dist"

async function copyScssFiles() {
  try {
    await fs.copy(sourceDir, destDir, {
      filter: src => {
        const isScss = src.endsWith(".scss")
        const isDirectory = fs.statSync(src).isDirectory()
        return isScss || isDirectory
      }
    })
    console.log("Copied .scss files and folders to dist!")
  } catch (err) {
    console.error(err)
  }
}

copyScssFiles()
