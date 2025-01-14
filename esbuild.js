const path = require("path")
const { globSync } = require("glob")
const { build } = require("esbuild")
const { STAGING_LEGACY_WIDGET_URL, PRODUCTION_LEGACY_WIDGET_URL, STAGING_DATA_URL, STAGING_UI_URL, PRODUCTION_DATA_URL, PRODUCTION_UI_URL } = require("./src/constants")

const defaultConfig = {
  entryPoints: [path.resolve(__dirname, "src/index.ts"), ...globSync("src/libs/**/index.ts")],
  bundle: process.env.NODE_ENV === "development",
  format: "esm",
  jsx: "automatic",
  outdir: "dist/esm",
  sourcemap: false,
  treeShaking: true,
  define: {
    STAGING_LEGACY_WIDGET_URL: JSON.stringify(STAGING_LEGACY_WIDGET_URL),
    PRODUCTION_LEGACY_WIDGET_URL: JSON.stringify(PRODUCTION_LEGACY_WIDGET_URL),
    STAGING_DATA_URL: JSON.stringify(STAGING_DATA_URL),
    STAGING_UI_URL: JSON.stringify(STAGING_UI_URL),
    PRODUCTION_DATA_URL: JSON.stringify(PRODUCTION_DATA_URL),
    PRODUCTION_UI_URL: JSON.stringify(PRODUCTION_UI_URL)
  }
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