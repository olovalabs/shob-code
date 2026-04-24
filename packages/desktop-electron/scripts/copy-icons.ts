import path from "node:path"
import { fileURLToPath } from "node:url"

import { $ } from "bun"

import { applyBrandLogo, defaultLogoPath } from "./apply-brand-logo"
import { resolveChannel } from "./utils"

const arg = process.argv[2]
const channel = arg === "dev" || arg === "beta" || arg === "prod" ? arg : resolveChannel()

const src = `./icons/${channel}`
const dest = "resources/icons"

await $`rm -rf ${dest}`
await $`cp -R ${src} ${dest}`
const here = path.dirname(fileURLToPath(import.meta.url))
await applyBrandLogo(path.resolve(here, "..", dest), defaultLogoPath())
console.log(`Copied ${channel} icons from ${src} to ${dest} and applied packages/logo.png`)
