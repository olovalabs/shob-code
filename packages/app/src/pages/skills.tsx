import { createResource, createSignal, For, Show } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { useSDK } from "@/context/sdk"
import { useLanguage } from "@/context/language"
import { usePrompt } from "@/context/prompt"
import { Button } from "@opencode-ai/ui/button"
import { Icon } from "@opencode-ai/ui/icon"
import { TextField } from "@opencode-ai/ui/text-field"

export default function SkillsPage() {
  const sdk = useSDK()
  const navigate = useNavigate()
  const params = useParams()
  const language = useLanguage()
  const prompt = usePrompt()
  const [query, setQuery] = createSignal("")

  const [skills] = createResource(async () => {
    const result = await sdk.client.app.skills()
    return result.data ?? []
  })

  const filtered = () => {
    const list = skills() ?? []
    const q = query().toLowerCase()
    if (!q) return list
    return list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.description?.toLowerCase().includes(q)
    )
  }

  const handleSkillClick = (skillName: string) => {
    const text = `/${skillName} `
    prompt.set([{ type: "text", content: text, start: 0, end: text.length }], text.length)
    
    if (params.id) {
      navigate(`/${params.dir}/session/${params.id}`)
    } else {
      navigate(`/${params.dir}/session`)
    }
  }

  return (
    <div class="flex flex-col h-full bg-background-base">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-border-base bg-surface-raised">
        <Button
          variant="ghost"
          icon="arrow-left"
          class="w-9 h-9 p-0 rounded-lg"
          onClick={() => navigate(-1)}
          aria-label={language.t("common.goBack")}
        />
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Icon name="brain" size="small" class="text-white" />
          </div>
          <h1 class="text-16-semibold text-text-strong">Skills</h1>
        </div>
      </div>
      
      <div class="flex flex-col gap-4 p-5 overflow-y-auto flex-1">
        <TextField
          autofocus
          placeholder="Search skills..."
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
          class="h-10"
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                class="group relative flex flex-col gap-3 p-4 rounded-xl border border-border-base bg-surface-raised hover:bg-surface-raised-hover hover:border-border-strong transition-all duration-200 cursor-pointer text-left"
                onClick={() => handleSkillClick(skill.name)}
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:from-purple-500/20 group-hover:to-blue-500/20 group-hover:border-purple-500/30 transition-all">
                    <Icon name="brain" size="small" class="text-purple-500" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-14-semibold text-text-strong truncate">{skill.name}</div>
                  </div>
                </div>
                <Show when={skill.description}>
                  <div class="text-13-regular text-text-weak line-clamp-2 leading-relaxed">
                    {skill.description}
                  </div>
                </Show>
                <div class="flex items-center gap-2 mt-1">
                  <div class="text-12-regular text-text-weak">Click to use</div>
                  <Icon name="arrow-right" size="small" class="text-icon-weak group-hover:text-icon-base group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
