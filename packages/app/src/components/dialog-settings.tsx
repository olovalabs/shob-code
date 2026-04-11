import { Component, createSignal, lazy, Suspense } from "solid-js"
import { Dialog } from "@opencode-ai/ui/dialog"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/icon"
import { useLanguage } from "@/context/language"
import { usePlatform } from "@/context/platform"
import { useDialog } from "@opencode-ai/ui/context/dialog"

type Tab = "general" | "shortcuts" | "providers" | "models"

const tabs: { id: Tab; icon: "sliders" | "keyboard" | "providers" | "models"; label: string }[] = [
  { id: "general", icon: "sliders", label: "settings.tab.general" },
  { id: "shortcuts", icon: "keyboard", label: "settings.tab.shortcuts" },
  { id: "providers", icon: "providers", label: "settings.providers.title" },
  { id: "models", icon: "models", label: "settings.models.title" },
]

// Lazy load tab content for better initial render performance
const SettingsGeneral = lazy(() => import("./settings-general").then((m) => ({ default: m.SettingsGeneral })))
const SettingsKeybinds = lazy(() => import("./settings-keybinds").then((m) => ({ default: m.SettingsKeybinds })))
const SettingsProviders = lazy(() => import("./settings-providers").then((m) => ({ default: m.SettingsProviders })))
const SettingsModels = lazy(() => import("./settings-models").then((m) => ({ default: m.SettingsModels })))

const LoadingFallback = () => (
  <div class="flex items-center justify-center h-full">
    <div class="animate-pulse text-text-weak">Loading...</div>
  </div>
)

export const DialogSettings: Component = () => {
  const language = useLanguage()
  const platform = usePlatform()
  const dialog = useDialog()
  const [active, setActive] = createSignal<Tab>("general")

  return (
    <Dialog size="x-large">
      <div class="flex h-[min(calc(100vh-80px),720px)] w-[min(calc(100vw-80px),960px)] overflow-hidden rounded-xl border border-border-weak-base bg-surface-base shadow-2xl">
        <nav class="flex w-[200px] flex-col border-r border-border-weak-base bg-surface-inset-base">
          <div class="flex items-center justify-between px-4 py-4 border-b border-border-weak-base">
            <span class="text-15-semibold text-text-strong">Settings</span>
          </div>

          <div class="flex flex-col gap-1 p-3">
            {tabs.map((tab) => (
              <button
                type="button"
                onClick={() => setActive(tab.id)}
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-13-medium"
                classList={{
                  "bg-surface-base text-text-strong shadow-sm border border-border-weak-base": active() === tab.id,
                  "text-text-weak hover:bg-surface-raised-base-hover hover:text-text-strong": active() !== tab.id,
                }}
              >
                <Icon name={tab.icon} size="small" class="size-4 shrink-0" />
                <span>{language.t(tab.label)}</span>
              </button>
            ))}
          </div>

          <div class="mt-auto border-t border-border-weak-base px-4 py-3">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-0.5 text-11-regular text-text-weak">
                <span>{language.t("app.name.desktop")}</span>
                <span>v{platform.version}</span>
              </div>
              <Icon name="circle-check" class="size-5 text-icon-weak" />
            </div>
          </div>
        </nav>

        <div class="flex flex-1 flex-col bg-surface-stronger-non-alpha">
          <header class="flex items-center justify-between border-b border-border-weak-base px-6 py-4 bg-surface-base">
            <h1 class="text-18-semibold text-text-strong">
              {language.t(tabs.find((t) => t.id === active())!.label)}
            </h1>
            <button
              type="button"
              class="p-1.5 rounded-lg text-text-weak hover:text-text-strong hover:bg-surface-raised-base-hover transition-colors"
              aria-label="Close"
              onClick={() => dialog.close()}
            >
              <Icon name="close" class="size-5" />
            </button>
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
    </Dialog>
  )
}