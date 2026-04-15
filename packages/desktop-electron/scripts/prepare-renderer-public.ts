#!/usr/bin/env bun
import { cp, rm } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const require = createRequire(import.meta.url)
const p2 = require("png2icons") as {
  createICO: (input: Buffer, alg: number, colors: number, png: boolean, win: boolean) => Buffer | null
  BICUBIC: number
}

const here = dirname(fileURLToPath(import.meta.url))
const appPublic = join(here, "../../app/public")
const dest = join(here, "../public-brand")
const logo = join(here, "../../logo.png")
const clear = { r: 0, g: 0, b: 0, alpha: 0 }

const pngs: [string, number][] = [
  ["favicon-96x96-v3.png", 96],
  ["favicon-96x96.png", 96],
  ["apple-touch-icon-v3.png", 180],
  ["apple-touch-icon.png", 180],
  ["web-app-manifest-192x192.png", 192],
  ["web-app-manifest-512x512.png", 512],
]

async function writeSvg(from: string, to: string) {
  const buf = await sharp(from).resize(256, 256, { fit: "contain", background: clear }).png().toBuffer()
  const b64 = buf.toString("base64")
  await Bun.write(
    to,
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><image width="256" height="256" href="data:image/png;base64,${b64}"/></svg>\n`,
  )
}

export async function prepareRendererPublic() {
  await rm(dest, { recursive: true, force: true })
  if (!(await Bun.file(logo).exists())) {
    console.warn(`Brand logo missing at ${logo}, Electron renderer will use app public unchanged`)
    await cp(appPublic, dest, { recursive: true })
    return
  }
  await cp(appPublic, dest, { recursive: true })
  for (const [name, px] of pngs) {
    await sharp(logo).resize(px, px, { fit: "contain", background: clear }).png().toFile(join(dest, name))
  }
  const master = await sharp(logo).resize(1024, 1024, { fit: "contain", background: clear }).png().toBuffer()
  const ico = p2.createICO(master, p2.BICUBIC, 0, false, true)
  if (ico) {
    await Bun.write(join(dest, "favicon.ico"), ico)
    await Bun.write(join(dest, "favicon-v3.ico"), ico)
  }
  await writeSvg(logo, join(dest, "favicon.svg"))
  await writeSvg(logo, join(dest, "favicon-v3.svg"))
}

if (import.meta.main) await prepareRendererPublic()
