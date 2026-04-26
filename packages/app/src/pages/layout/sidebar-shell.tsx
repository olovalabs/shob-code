import { For, Show, createEffect, createMemo, createSignal, type Accessor, type JSX } from "solid-js"
import {
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  closestCenter,
  type DragEvent,
} from "@thisbeyond/solid-dnd"
import { ConstrainDragXAxis } from "@/utils/solid-dnd"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/icon"
import { Button } from "@opencode-ai/ui/button"
import { Tooltip, TooltipKeybind } from "@opencode-ai/ui/tooltip"
import { useCommand } from "@/context/command"
import { useLocation, useNavigate, useParams } from "@solidjs/router"
import { type LocalProject } from "@/context/layout"

export const SidebarContent = (props: {
  mobile?: boolean
  opened: Accessor<boolean>
  aimMove: (event: MouseEvent) => void
  projects: Accessor<LocalProject[]>
  renderProject: (project: LocalProject) => JSX.Element
  handleDragStart: (event: unknown) => void
  handleDragEnd: () => void
  handleDragOver: (event: DragEvent) => void
  openProjectLabel: JSX.Element
  openProjectKeybind: Accessor<string | undefined>
  onOpenProject: () => void
  renderProjectOverlay: () => JSX.Element
  settingsLabel: Accessor<string>
  settingsKeybind: Accessor<string | undefined>
  onOpenSettings: () => void
}): JSX.Element => {
  const placement = () => (props.mobile ? "bottom" : "right")
  const command = useCommand()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const mode = createMemo(() => (location.pathname.endsWith("/skills") ? "plugins" : "explorer"))
  const [tab, setTab] = createSignal<"explorer" | "search" | "plugins">(mode())

  createEffect(() => {
    setTab(mode())
  })

  const skillsHref = () =>
    params.dir ? (params.id ? `/${params.dir}/session/${params.id}/skills` : `/${params.dir}/session/skills`) : ""

  return (
    <div class="flex h-full w-full min-w-0 overflow-hidden bg-background-base">
      <div class="w-12 shrink-0 border-r border-border-weaker-base bg-background-stronger flex flex-col items-center py-2 gap-2">
        <button
          type="button"
          aria-label="Explorer"
          class="relative size-9 rounded-md flex items-center justify-center text-text-base hover:text-text-strong hover:bg-surface-raised-base-hover transition-colors"
          classList={{
            "text-text-strong bg-surface-raised-base-active": tab() === "explorer",
          }}
          onClick={() => setTab("explorer")}
        >
          <span
            class="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-text-strong transition-opacity"
            classList={{ "opacity-100": tab() === "explorer", "opacity-0": tab() !== "explorer" }}
          />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 4C6 2.89543 6.89543 2 8 2H11.5858C11.9836 2 12.3651 2.15804 12.6464 2.43934L16.5607 6.35355C16.842 6.63486 17 7.01639 17 7.41421V14C17 15.1046 16.1046 16 15 16H8C6.89543 16 6 15.1046 6 14V4ZM8 3C7.44772 3 7 3.44772 7 4V14C7 14.5523 7.44772 15 8 15H15C15.5523 15 16 14.5523 16 14V8H12.5C11.6716 8 11 7.32843 11 6.5V3H8ZM12 3.20711V6.5C12 6.77614 12.2239 7 12.5 7H15.7929L12 3.20711Z"
              fill="currentColor"
            />
            <path
              d="M4 5C4 4.44772 4.44772 4 5 4V14C5 15.6569 6.34315 17 8 17L15 17C15 17.5523 14.5523 18 14 18H7.93939C5.76373 18 4 16.2363 4 14.0606V5Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Search"
          class="relative size-9 rounded-md flex items-center justify-center text-text-base hover:text-text-strong hover:bg-surface-raised-base-hover transition-colors"
          classList={{
            "text-text-strong bg-surface-raised-base-active": tab() === "search",
          }}
          onClick={() => setTab("search")}
        >
          <span
            class="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-text-strong transition-opacity"
            classList={{ "opacity-100": tab() === "search", "opacity-0": tab() !== "search" }}
          />
          <Icon name="magnifying-glass" size="small" />
        </button>
        <button
          type="button"
          aria-label="Plugins"
          class="relative size-9 rounded-md flex items-center justify-center text-text-base hover:text-text-strong hover:bg-surface-raised-base-hover transition-colors"
          classList={{
            "text-text-strong bg-surface-raised-base-active": tab() === "plugins",
          }}
          onClick={() => {
            setTab("plugins")
            const href = skillsHref()
            if (href) navigate(href)
          }}
        >
          <span
            class="absolute -left-2 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-text-strong transition-opacity"
            classList={{ "opacity-100": tab() === "plugins", "opacity-0": tab() !== "plugins" }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="text-current"
          >
            <path
              d="M23.56.436c-.58-.58-1.54-.58-2.12 0L15.436 6.44c-.58.58-.58 1.54 0 2.12l6.004 6.005c.58.58 1.54.58 2.12 0l6.005-6.004c.58-.58.58-1.54 0-2.12L23.56.436zm-.706.708l6.003 6.003c.202.202.202.505 0 .707l-6.003 6.004c-.202.202-.505.202-.707 0l-6.004-6.004c-.202-.202-.202-.505 0-.707l6.004-6.003c.202-.202.505-.202.707 0zM16.5 18c-.822 0-1.5.678-1.5 1.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5zM1.5 3C.678 3 0 3.678 0 4.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5zm0 14c-.822 0-1.5.678-1.5 1.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div class="mt-auto pt-2">
          <TooltipKeybind placement={placement()} title={props.settingsLabel()} keybind={props.settingsKeybind() || ""}>
            <IconButton
              icon="settings-gear"
              variant="ghost"
              size="large"
              onClick={props.onOpenSettings}
              aria-label={props.settingsLabel()}
              class="rounded-md size-9 text-text-base hover:text-text-strong hover:bg-surface-raised-base-hover"
            />
          </TooltipKeybind>
        </div>
      </div>
      <div
        data-component="sidebar-rail"
        class="flex-1 flex flex-col overflow-hidden w-full h-full"
        onMouseMove={props.aimMove}
      >
        <div class="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar">
          <For each={[tab()]}>
            {(value) => (
              <>
                <div class="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 mb-1 border-b border-border-weaker-base bg-background-base/95 backdrop-blur-sm">
                  <span class="text-18-medium text-text-strong">
                    {value === "explorer" ? "Explorer" : value === "search" ? "Search" : "Plugins"}
                  </span>
                  <div class="flex items-center gap-3 text-text-weaker">
                    <Button
                      variant="ghost"
                      class="size-6 rounded-md hover:text-text-base hover:bg-surface-raised-base-hover p-0 flex items-center justify-center cursor-pointer transition-colors"
                      onClick={() => {
                        if (value === "explorer") props.onOpenProject()
                        if (value === "search") command.show()
                        if (value === "plugins") {
                          const href = skillsHref()
                          if (href) navigate(href)
                        }
                      }}
                    >
                      <Show when={value === "explorer"}>
                        <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="m 3 1 c -1.644531 0 -3 1.355469 -3 3 v 8 c 0 1.644531 1.355469 3 3 3 h 3 c 0.550781 0 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 h -3 c -0.5625 0 -1 -0.4375 -1 -1 v -7 h 11 c 0.5625 0 1 0.4375 1 1 v 1 c 0 0.550781 0.449219 1 1 1 s 1 -0.449219 1 -1 v -1 c 0 -1.644531 -1.355469 -3 -3 -3 h -3.585938 l -1.707031 -1.707031 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 2 h 3.585938 l 1 1 h -5.585938 c 0 -0.5625 0.4375 -1 1 -1 z m 8 5 v 3 h -3 v 2 h 3 v 3 h 2 v -3 h 3 v -2 h -3 v -3 z m 0 0"
                            fill="currentColor"
                          />
                        </svg>
                      </Show>
                      <Show when={value === "search"}>
                        <Icon name="magnifying-glass" size="small" />
                      </Show>
                      <Show when={value === "plugins"}>
                        <Icon name="brain" size="small" />
                      </Show>
                    </Button>
                  </div>
                </div>

                <Show when={value === "explorer"}>
                  <DragDropProvider
                    onDragStart={props.handleDragStart}
                    onDragEnd={props.handleDragEnd}
                    onDragOver={props.handleDragOver}
                    collisionDetector={closestCenter}
                  >
                    <DragDropSensors />
                    <ConstrainDragXAxis />
                    <div class="flex flex-col gap-1">
                      <SortableProvider ids={props.projects().map((p) => p.worktree)}>
                        <For each={props.projects()}>{(project) => props.renderProject(project)}</For>
                      </SortableProvider>
                    </div>
                    <DragOverlay>{props.renderProjectOverlay()}</DragOverlay>
                  </DragDropProvider>
                </Show>

                <Show when={value === "search"}>
                  <div class="px-3 py-2">
                    <button
                      type="button"
                      class="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong transition-colors"
                      onClick={() => command.show()}
                    >
                      <Icon name="magnifying-glass" size="small" />
                      <span class="text-13-regular">Open command/search</span>
                    </button>
                  </div>
                </Show>

                <Show when={value === "plugins"}>
                  <div class="px-3 py-2">
                    <button
                      type="button"
                      class="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong transition-colors"
                      onClick={() => {
                        const href = skillsHref()
                        if (href) navigate(href)
                      }}
                    >
                      <Icon name="brain" size="small" />
                      <span class="text-13-regular">Open plugins/skills</span>
                    </button>
                  </div>
                </Show>
              </>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}
