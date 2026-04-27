import { $ } from "bun"

const src = "../logo.png"
const ch = ["dev", "beta", "prod"] as const

for (const x of ch) {
  const out = `src-tauri/icons/${x}`
  await $`bun tauri icon ${src} -o ${out}`
}

console.log(`Synced desktop icons from ${src} for ${ch.join(", ")}`)
