const path = require("path")
const { globSync } = require("glob")
const fs = require("fs-extra")
const { sassPlugin } = require("esbuild-sass-plugin")
const { build } = require("esbuild")
fs.removeSync("./dist")

build({
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
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
