import { resolve } from "path"
import { globSync } from "glob"
import { removeSync } from "fs-extra/esm"
import { sassPlugin } from "esbuild-sass-plugin"
import { build } from "esbuild"
removeSync("./dist")

build({
  entryPoints: [resolve(import.meta.dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
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
