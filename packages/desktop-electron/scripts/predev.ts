import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.OPENCODE_CHANNEL ?? "dev"}`
await $`bun ./scripts/prepare-renderer-public.ts`

await $`cd ../opencode && bun script/build-node.ts`
