const path = require("path")
const { globSync } = require("glob")
const { build } = require("esbuild")

const defaultConfig = {
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
  bundle: process.env.NODE_ENV === "development",
  format: "esm",
  jsx: "automatic",
  outdir: "dist/esm",
  sourcemap: false,
  treeShaking: true
}

// Build ESM
build(defaultConfig).catch(() => process.exit(1))

// Build CJS
build({
  ...defaultConfig,
  format: "cjs",
  outdir: "dist/cjs",
  treeShaking: process.env.NODE_ENV === "development"
}).catch(() => process.exit(1))

// Build bundled package
build({
  ...defaultConfig,
  bundle: true,
  outdir: "dist/esm/bundle",
  minify: true
}).catch(() => process.exit(1))