import { readdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import sharp from "sharp"

const require = createRequire(import.meta.url)
const p2 = require("png2icons") as {
  createICNS: (input: Buffer, alg: number, colors: number) => Buffer | null
  createICO: (input: Buffer, alg: number, colors: number, png: boolean, win: boolean) => Buffer | null
  BICUBIC: number
}

const clear = { r: 0, g: 0, b: 0, alpha: 0 }

async function* eachPng(dir: string): AsyncGenerator<string> {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name)
    if (ent.isDirectory()) yield* eachPng(full)
    if (ent.isFile() && ent.name.endsWith(".png")) yield full
  }
}

export function defaultLogoPath() {
  const here = dirname(fileURLToPath(import.meta.url))
  return join(here, "../../logo.png")
}

export async function applyBrandLogo(icons: string, logo: string) {
  if (!(await Bun.file(logo).exists())) {
    console.warn(`Brand logo missing at ${logo}, skipping icon regeneration`)
    return
  }
  const alg = p2.BICUBIC
  for await (const png of eachPng(icons)) {
    const meta = await sharp(png).metadata()
    const w = meta.width
    const h = meta.height
    if (!w || !h) continue
    await sharp(logo).resize(w, h, { fit: "contain", background: clear }).png().toFile(png)
  }
  const master = await sharp(logo).resize(1024, 1024, { fit: "contain", background: clear }).png().toBuffer()
  const icns = p2.createICNS(master, alg, 0)
  if (icns) await Bun.write(join(icons, "icon.icns"), icns)
  const ico = p2.createICO(master, alg, 0, false, true)
  if (ico) await Bun.write(join(icons, "icon.ico"), ico)
}
