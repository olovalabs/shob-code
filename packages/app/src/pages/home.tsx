import { createMemo, For, Match, Switch } from "solid-js"
import { Button } from "@opencode-ai/ui/button"
import { Logo } from "@opencode-ai/ui/logo"
import { useLayout } from "@/context/layout"
import { useNavigate } from "@solidjs/router"
import { base64Encode } from "@opencode-ai/util/encode"
import { Icon } from "@opencode-ai/ui/icon"
import { usePlatform } from "@/context/platform"
import { DateTime } from "luxon"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { DialogSelectDirectory } from "@/components/dialog-select-directory"
import { DialogSelectServer } from "@/components/dialog-select-server"
import { useServer } from "@/context/server"
import { useGlobalSync } from "@/context/global-sync"
import { useLanguage } from "@/context/language"
import { Card, CardDescription, CardTitle } from "@opencode-ai/ui/card"
import { ShineBorder } from "@opencode-ai/ui/shine-border"
import { TextShimmer } from "@opencode-ai/ui/text-shimmer"
import { Spinner } from "@opencode-ai/ui/spinner"
import "./home.css"

export default function Home() {
  const sync = useGlobalSync()
  const layout = useLayout()
  const platform = usePlatform()
  const dialog = useDialog()
  const navigate = useNavigate()
  const server = useServer()
  const language = useLanguage()
  const homedir = createMemo(() => sync.data.path.home)
  const recent = createMemo(() => {
    return sync.data.project
      .slice()
      .sort((a, b) => (b.time.updated ?? b.time.created) - (a.time.updated ?? a.time.created))
      .slice(0, 12)
  })

  const serverDotClass = createMemo(() => {
    const status = server.healthy()
    if (status === true) return "bg-icon-success-base"
    if (status === false) return "bg-icon-critical-base"
    return "bg-border-weak-base"
  })

  function open(dir: string) {
    layout.projects.open(dir)
    server.projects.touch(dir)
    navigate(`/${base64Encode(dir)}`)
  }

  async function choose() {
    const resolve = (res: string | string[] | null) => {
      if (Array.isArray(res)) res.forEach(open)
      else if (res) open(res)
    }

    if (platform.openDirectoryPickerDialog && server.isLocal()) {
      const res = await platform.openDirectoryPickerDialog?.({
        title: language.t("command.project.open"),
        multiple: true,
      })
      resolve(res)
    } else {
      dialog.show(
        () => <DialogSelectDirectory multiple={true} onSelect={resolve} />,
        () => resolve(null),
      )
    }
  }

  return (
    <div class="home-container">
      <div class="home-bg" />
      <div class="home-blob home-blob-1" />
      <div class="home-blob home-blob-2" />

      {/* Header */}
      <header class="flex items-center justify-between px-6 py-4 fade-up-text">
        <Logo class="h-5 w-auto opacity-60" />
        <Button
          variant="ghost"
          size="small"
          class="flex items-center gap-2 px-3 py-1.5 home-glass rounded-full border-none shadow-none"
          onClick={() => dialog.show(() => <DialogSelectServer />)}
        >
          <div class={`size-1.5 rounded-full ${serverDotClass()}`} />
          <span class="text-11-medium text-text-weak">{server.name}</span>
        </Button>
      </header>

      <main class="flex-1 px-6 py-8 flex flex-col items-center overflow-y-auto no-scrollbar">
        {/* Compact Hero Section */}
        <section class="max-w-3xl w-full text-center mb-10 fade-up-text">
          <TextShimmer
            text="OpenCode"
            as="h1"
            class="text-48-bold md:text-56-bold mb-2 home-hero-text tracking-tight"
          />
          <p class="text-14-regular text-text-weak mb-6 max-w-lg mx-auto">
            {language.t("home.empty.description")}
          </p>
          <div class="flex items-center justify-center gap-4">
            <Button
              size="normal"
              icon="folder-add-left"
              class="px-6 py-2.5 rounded-lg"
              onClick={choose}
            >
              {language.t("command.project.open")}
            </Button>
          </div>
        </section>

        {/* Dense Content Grid */}
        <Switch>
          <Match when={sync.data.project.length > 0}>
            <div class="w-full max-w-5xl fade-up-text" style={{ "animation-delay": "0.1s" }}>
              <div class="flex items-center justify-between mb-5 px-1">
                <h2 class="text-16-medium text-text-strong">{language.t("home.recentProjects")}</h2>
                <Button variant="ghost" size="small" class="text-12-medium text-text-weak" onClick={choose}>
                  {language.t("common.viewAll") ?? "View All"}
                </Button>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
                <For each={recent()}>
                  {(project) => (
                    <div class="relative group cursor-pointer" onClick={() => open(project.worktree)}>
                      <ShineBorder
                        animate={true}
                        borderWidth={1}
                        shineColor="var(--icon-active)"
                        class="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity rounded-lg"
                      />
                      <Card class="home-glass p-4 h-full rounded-lg flex flex-col justify-between border-none">
                        <div>
                          <CardTitle class="mb-1 truncate text-14-medium">
                            {project.worktree.split(/[/\\]/).pop()}
                          </CardTitle>
                          <CardDescription class="text-11-mono text-text-minimal truncate">
                            {project.worktree.replace(homedir(), "~")}
                          </CardDescription>
                        </div>
                        <div class="mt-3 flex items-center justify-between">
                          <span class="text-11-regular text-text-minimal">
                            {DateTime.fromMillis(project.time.updated ?? project.time.created).toRelative()}
                          </span>
                          <Icon name="arrow-right" class="size-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-icon-active" />
                        </div>
                      </Card>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Match>

          <Match when={!sync.ready}>
            <div class="mt-12 flex flex-col items-center gap-3 fade-up-text">
              <Spinner class="size-6 text-icon-active" />
              <div class="text-12-regular text-text-minimal">{language.t("common.loading")}</div>
            </div>
          </Match>

          <Match when={true}>
            <div class="mt-12 opacity-30 fade-up-text">
              <Icon name="folder" size="normal" class="mx-auto mb-3" />
              <p class="text-12-medium text-text-weak text-center">
                {language.t("home.empty.title")}
              </p>
            </div>
          </Match>
        </Switch>
      </main>

      <footer class="px-6 py-4 text-center text-11-regular text-text-minimal fade-up-text opacity-40">
        © {new Date().getFullYear()} OpenCode AI
      </footer>
    </div>
  )
}
