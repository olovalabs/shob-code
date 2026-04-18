import { createSignal, For, Show, createMemo, lazy, Suspense } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { useLanguage } from "@/context/language"
import { Button } from "@opencode-ai/ui/button"
import { Icon } from "@opencode-ai/ui/icon"
import { TextField } from "@opencode-ai/ui/text-field"

type Tab = "general" | "shortcuts" | "providers" | "models"

const tabs: { id: Tab; icon: "sliders" | "keyboard" | "providers" | "models"; label: string }[] = [
  { id: "general", icon: "sliders", label: "settings.tab.general" },
  { id: "shortcuts", icon: "keyboard", label: "settings.tab.shortcuts" },
  { id: "providers", icon: "providers", label: "settings.providers.title" },
  { id: "models", icon: "models", label: "settings.models.title" },
]

const SettingsGeneral = lazy(() => import("@/components/settings-general").then((m) => ({ default: m.SettingsGeneral })))
const SettingsKeybinds = lazy(() => import("@/components/settings-keybinds").then((m) => ({ default: m.SettingsKeybinds })))
const SettingsProviders = lazy(() => import("@/components/settings-providers").then((m) => ({ default: m.SettingsProviders })))
const SettingsModels = lazy(() => import("@/components/settings-models").then((m) => ({ default: m.SettingsModels })))

const LoadingFallback = () => (
  <div class="flex items-center justify-center h-full">
    <div class="animate-pulse text-text-weak">Loading...</div>
  </div>
)

export function SettingsView() {
  const navigate = useNavigate()
  const params = useParams()
  const language = useLanguage()
  const [active, setActive] = createSignal<Tab>("general")
  const [query, setQuery] = createSignal("")

  const filteredTabs = createMemo(() => {
    const q = query().toLowerCase()
    if (!q) return tabs
    return tabs.filter(
      (t) => language.t(t.label).toLowerCase().includes(q)
    )
  })

  const back = () => {
    navigate(params.id ? `/${params.dir}/session/${params.id}` : `/${params.dir}/session`, { replace: true })
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
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Icon name="sliders" size="small" class="text-white" />
          </div>
          <h1 class="text-16-semibold text-text-strong">Settings</h1>
        </div>
      </div>

      <div class="flex flex-1 overflow-hidden">
        <nav class="flex w-[240px] flex-shrink-0 flex-col border-r border-border-base bg-surface-inset">
          <div class="flex items-center justify-between px-4 py-4 border-b border-border-base">
            <span class="text-15-semibold text-text-strong">Settings</span>
          </div>

          <div class="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
            <TextField
              placeholder="Search..."
              value={query()}
              onInput={(e) => setQuery(e.currentTarget.value)}
              class="h-9 mb-3"
            />
            <For each={filteredTabs()}>
              {(tab) => (
                <button
                  type="button"
                  onClick={() => setActive(tab.id)}
                  class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-13-medium transition-colors"
                  classList={{
                    "bg-surface-base text-text-strong shadow-sm border border-border-base": active() === tab.id,
                    "text-text-weak hover:bg-surface-raised-hover hover:text-text-strong": active() !== tab.id,
                  }}
                >
                  <Icon name={tab.icon} size="small" class="size-4 shrink-0" />
                  <span>{language.t(tab.label)}</span>
                </button>
              )}
            </For>
          </div>
        </nav>

        <div class="flex flex-1 flex-col bg-surface-stronger-non-alpha overflow-hidden min-w-0">
          <header class="flex items-center justify-between border-b border-border-base px-6 py-4 bg-surface-base">
            <h1 class="text-18-semibold text-text-strong">
              {language.t(tabs.find((t) => t.id === active())!.label)}
            </h1>
          </header>
          <div class="flex-1 overflow-hidden">
            <Suspense fallback={<LoadingFallback />}>
              {(() => {
                switch (active()) {
                  case "general":
                    return <SettingsGeneral />
                  case "shortcuts":
                    return <SettingsKeybinds />
                  case "providers":
                    return <SettingsProviders />
                  case "models":
                    return <SettingsModels />
                }
              })()}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
