import { useNavigate, useParams } from "@solidjs/router"
import { createMemo, createResource, For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { Button } from "@opencode-ai/ui/button"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { Dialog } from "@opencode-ai/ui/dialog"
import { Icon } from "@opencode-ai/ui/icon"
import { TextField } from "@opencode-ai/ui/text-field"
import { useLanguage } from "@/context/language"
import { usePrompt } from "@/context/prompt"
import { useSDK } from "@/context/sdk"
import { useSync } from "@/context/sync"

type SkillItem = {
  name: string
  description?: string
  content?: string
}

function SkillModal(props: { skill: SkillItem; onUse: () => void; onUninstall: () => void }) {
  const dialog = useDialog()

  return (
    <Dialog
      title={
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Icon name="brain" size="small" class="text-white" />
          </div>
          <div>
            <div class="text-16-semibold text-text-strong">{props.skill.name}</div>
            <Show when={props.skill.description}>
              <div class="text-13-regular text-text-weak">{props.skill.description}</div>
            </Show>
          </div>
        </div>
      }
      size="x-large"
      class="[&_[data-slot=dialog-body]]:p-0"
    >
      <div class="flex flex-col">
        <Show when={props.skill.content?.trim()}>
          <div class="rounded-xl border border-border-base bg-surface-raised p-4 max-h-[30vh] overflow-auto mb-4">
            <div class="flex items-center gap-2 mb-3 pb-3 border-b border-border-base">
              <Icon name="code" size="small" class="text-icon-weak" />
              <div class="text-13-semibold text-text-weak">Skill Content</div>
            </div>
            <pre class="text-12-regular text-text-base whitespace-pre-wrap break-words font-mono">
              {props.skill.content}
            </pre>
          </div>
        </Show>

        <div class="flex items-center justify-end p-4">
          <div class="inline-flex">
            <Button
              variant="secondary"
              size="normal"
              class="rounded-r-none border-r-0 bg-background-base hover:bg-surface-raised-hover text-red-400 hover:text-red-300"
              onClick={() => {
                dialog.close()
                props.onUninstall()
              }}
            >
              <Icon name="trash" size="normal" class="mr-2" />
              Uninstall
            </Button>
            <Button
              variant="secondary"
              size="normal"
              class="rounded-l-none bg-background-base hover:bg-surface-raised-hover text-text-strong"
              onClick={() => {
                dialog.close()
                props.onUse()
              }}
            >
              <Icon name="brain" size="normal" class="mr-2" />
              Add to Chat
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export function SkillsView() {
  const sdk = useSDK()
  const sync = useSync()
  const dialog = useDialog()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const params = useParams()
  const language = useLanguage()
  const [state, setState] = createStore({ query: "" })

  const [skills] = createResource(async () => {
    const result = await sdk.client.app.skills()
    return result.data ?? []
  })

  const list = createMemo<SkillItem[]>(() => {
    const map = new Map<string, SkillItem>()

    for (const item of skills() ?? []) {
      map.set(item.name, {
        name: item.name,
        description: item.description,
        content: item.content,
      })
    }

    for (const item of sync.data.command) {
      if (item.source !== "skill") continue
      if (map.has(item.name)) continue
      map.set(item.name, {
        name: item.name,
        description: item.description,
      })
    }

    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  })

  const filtered = () => {
    const items = list()
    const q = state.query.toLowerCase()
    if (!q) return items
    return items.filter((s) => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
  }

  const back = () => {
    navigate(params.id ? `/${params.dir}/session/${params.id}` : `/${params.dir}/session`, { replace: true })
  }

  const pick = (name: string) => {
    const text = `/${name} `
    prompt.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
    back()
  }

  const create = () => {
    const text = "/create-skills "
    prompt.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
    back()
  }

  const uninstall = (name: string) => {
    const text = `/remove-skill ${name} `
    prompt.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
    back()
  }

  const open = (skill: SkillItem) => {
    dialog.show(() => <SkillModal skill={skill} onUse={() => pick(skill.name)} onUninstall={() => uninstall(skill.name)} />)
  }

  return (
    <div class="flex-1 min-h-0 overflow-y-auto bg-background-base">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-border-base bg-surface-raised">
        <Button
          variant="ghost"
          icon="arrow-left"
          class="w-9 h-9 p-0 rounded-lg"
          onClick={back}
          aria-label={language.t("common.goBack")}
        />
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Icon name="brain" size="small" class="text-white" />
          </div>
          <h1 class="text-16-semibold text-text-strong">Skills</h1>
        </div>
        <div class="ml-auto">
          <Button variant="primary" size="small" onClick={create}>
            <Icon name="plus" size="small" class="mr-2" />
            Create skill
          </Button>
        </div>
      </div>

      <div class="flex flex-col gap-4 p-5">
        <TextField
          autofocus
          placeholder="Search skills..."
          value={state.query}
          onInput={(e) => setState("query", e.currentTarget.value)}
          class="h-10"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <Show when={filtered().length === 0}>
            <div class="col-span-full text-text-weak text-center py-12">
              <Icon name="magnifying-glass" size="large" class="text-icon-weak mb-3" />
              <div class="text-14-regular">
                {skills.loading ? "Loading skills..." : "No skills found"}
              </div>
            </div>
          </Show>
          <For each={filtered()}>
            {(skill) => (
              <button
                type="button"
                class="group w-full flex items-start gap-3 p-4 rounded-xl border border-border-base bg-surface-raised hover:bg-surface-raised-hover hover:border-border-strong transition-all duration-200 cursor-pointer text-left"
                onClick={() => open(skill)}
              >
                <div class="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-blue-500/20 group-hover:border-purple-500/30 transition-all">
                  <Icon name="brain" size="small" class="text-purple-500" />
                </div>

                <div class="min-w-0 flex-1">
                  <div class="text-14-semibold text-text-strong truncate mb-1">{skill.name}</div>
                  <Show when={skill.description}>
                    <div class="text-13-regular text-text-weak line-clamp-2">{skill.description}</div>
                  </Show>
                </div>

                <Icon
                  name="chevron-right"
                  size="small"
                  class="shrink-0 text-icon-weak group-hover:text-icon-base group-hover:translate-x-0.5 transition-all mt-0.5"
                />
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
