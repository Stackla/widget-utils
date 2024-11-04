import { config } from "dotenv"
import { resolve } from "path"

const __dirname = resolve()

config({
  path: resolve(__dirname, ".env.test")
})
