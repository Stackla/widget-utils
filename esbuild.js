const path = require("path")
const { globSync } = require("glob")
const fs = require("fs-extra")
const { sassPlugin } = require("esbuild-sass-plugin")
const { build } = require("esbuild")

const defaultConfig = {
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
  bundle: true,
  format: "esm",
  jsx: "automatic",
  outdir: "dist/esm",
  plugins: [
    sassPlugin({
      type: "css-text",
      minify: true
    })
  ],
  external: ["react/jsx-runtime"]
}

// Build ESM
build(defaultConfig).catch(() => process.exit(1))

// Build CJS
build({
  ...defaultConfig,
  format: "cjs",
  outdir: "dist/cjs"
}).catch(() => process.exit(1))
