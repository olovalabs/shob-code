import { For, type Accessor, type JSX } from "solid-js"
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
import { useLanguage } from "@/context/language"
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
  const language = useLanguage()
  const navigate = useNavigate()
  const params = useParams()

  return (
    <div class="flex h-full w-full min-w-0 overflow-hidden bg-background-base">
      <div
        data-component="sidebar-rail"
        class="flex-1 flex flex-col overflow-hidden w-full h-full"
        onMouseMove={props.aimMove}
      >
        <div class="flex-1 min-h-0 w-full overflow-y-auto no-scrollbar">
          {/* Search & Plugins */}
          <div class="flex flex-col gap-0.5 px-2 py-2">
            <button
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong transition-colors text-left"
              onClick={() => command.show()}
            >
              <Icon name="magnifying-glass" size="small" class="text-text-weaker" />
              <span class="text-13-regular">Search</span>
            </button>
            <button
              class="flex items-center gap-3 px-2 py-1.5 rounded-lg text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong transition-colors text-left"
              onClick={() =>
                navigate(
                  params.dir
                    ? params.id
                      ? `/${params.dir}/session/${params.id}/skills`
                      : `/${params.dir}/session/skills`
                    : ""
                )
              }
            >
              <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-text-weaker">
                <path d="M23.56.436c-.58-.58-1.54-.58-2.12 0L15.436 6.44c-.58.58-.58 1.54 0 2.12l6.004 6.005c.58.58 1.54.58 2.12 0l6.005-6.004c.58-.58.58-1.54 0-2.12L23.56.436zm-.706.708l6.003 6.003c.202.202.202.505 0 .707l-6.003 6.004c-.202.202-.505.202-.707 0l-6.004-6.004c-.202-.202-.202-.505 0-.707l6.004-6.003c.202-.202.505-.202.707 0zM16.5 18c-.822 0-1.5.678-1.5 1.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5zM1.5 3C.678 3 0 3.678 0 4.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5zm0 14c-.822 0-1.5.678-1.5 1.5v9c0 .822.678 1.5 1.5 1.5h9c.822 0 1.5-.678 1.5-1.5v-9c0-.822-.678-1.5-1.5-1.5h-9zm0 1h9c.286 0 .5.214.5.5v9c0 .286-.214.5-.5.5h-9c-.286 0-.5-.214-.5-.5v-9c0-.286.214-.5.5-.5z" fill="currentColor"/>
              </svg>
              <span class="text-13-regular">Plugins</span>
            </button>
          </div>

          {/* Projects Header */}
          <div class="flex items-center justify-between px-4 py-2 mb-1">
            <span class="text-12-medium text-text-weaker">Projects</span>
            <div class="flex items-center gap-3 text-text-weaker">
              <Button
                variant="ghost"
                class="size-4 hover:text-text-base p-0 flex items-center justify-center cursor-pointer"
                onClick={props.onOpenProject}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m 3 1 c -1.644531 0 -3 1.355469 -3 3 v 8 c 0 1.644531 1.355469 3 3 3 h 3 c 0.550781 0 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 h -3 c -0.5625 0 -1 -0.4375 -1 -1 v -7 h 11 c 0.5625 0 1 0.4375 1 1 v 1 c 0 0.550781 0.449219 1 1 1 s 1 -0.449219 1 -1 v -1 c 0 -1.644531 -1.355469 -3 -3 -3 h -3.585938 l -1.707031 -1.707031 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 2 h 3.585938 l 1 1 h -5.585938 c 0 -0.5625 0.4375 -1 1 -1 z m 8 5 v 3 h -3 v 2 h 3 v 3 h 2 v -3 h 3 v -2 h -3 v -3 z m 0 0" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>
                </svg>
              </Button>
            </div>
          </div>

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
        </div>

        <div class="shrink-0 w-full px-3 py-3 border-t border-border-weaker-base">
          <TooltipKeybind placement={placement()} title={props.settingsLabel()} keybind={props.settingsKeybind() || ""}>
            <IconButton
              icon="settings-gear"
              variant="ghost"
              size="large"
              onClick={props.onOpenSettings}
              aria-label={props.settingsLabel()}
              class="text-text-weaker hover:text-text-base"
            />
          </TooltipKeybind>
        </div>
      </div>
    </div>
  )
}
