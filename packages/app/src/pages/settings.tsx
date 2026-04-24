import { Component, For, createSignal, lazy, Suspense } from "solid-js"
import { useNavigate, useParams } from "@solidjs/router"
import { useLanguage } from "@/context/language"
import { Button } from "@opencode-ai/ui/button"
import { Icon } from "@opencode-ai/ui/icon"

type Tab = "general" | "shortcuts" | "providers" | "models"

const tabs: { id: Tab; label: string }[] = [
  { id: "general", label: "settings.tab.general" },
  { id: "shortcuts", label: "settings.tab.shortcuts" },
  { id: "providers", label: "settings.providers.title" },
  { id: "models", label: "settings.models.title" },
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

export default function SettingsPage() {
  const navigate = useNavigate()
  const params = useParams()
  const language = useLanguage()
  const [active, setActive] = createSignal<Tab>("general")

  const hasDirectory = () => !!params.dir

  return (
    <div class="flex flex-col h-full w-full bg-background-base">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-border-base bg-surface-raised">
        <Button
          variant="ghost"
          icon="arrow-left"
          class="w-9 h-9 p-0 rounded-lg"
          onClick={() => hasDirectory() ? navigate(`/${params.dir}`) : navigate("/")}
          aria-label={language.t("common.goBack")}
        />
        <For each={tabs}>
          {(tab) => (
            <button
              type="button"
              onClick={() => setActive(tab.id)}
              class="px-4 py-2 rounded-lg text-13-medium transition-all duration-200"
              classList={{
                "bg-surface-base text-text-strong border border-border-base shadow-sm": active() === tab.id,
                "text-text-weak hover:bg-surface-raised-hover hover:text-text-strong": active() !== tab.id,
              }}
            >
              {language.t(tab.label)}
            </button>
          )}
        </For>
      </div>

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
  )
}
