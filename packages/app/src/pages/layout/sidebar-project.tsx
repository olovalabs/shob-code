import { createEffect, createMemo, For, Show, type Accessor, type JSX } from "solid-js"
import { createStore } from "solid-js/store"
import { base64Encode } from "@opencode-ai/util/encode"
import { useNavigate, useParams } from "@solidjs/router"
import { ContextMenu } from "@opencode-ai/ui/context-menu"
import { Collapsible } from "@opencode-ai/ui/collapsible"
import { DropdownMenu } from "@opencode-ai/ui/dropdown-menu"
import { Icon } from "@opencode-ai/ui/icon"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Button } from "@opencode-ai/ui/button"
import { createSortable } from "@thisbeyond/solid-dnd"
import { useLayout, type LocalProject } from "@/context/layout"
import { useNotification } from "@/context/notification"
import { useLanguage } from "@/context/language"
import { useGlobalSync } from "@/context/global-sync"
import { ProjectIcon, SessionItem, NewSessionItem, type SessionItemProps } from "./sidebar-items"
import { displayName, sortedRootSessions, workspaceKey } from "./helpers"

export type ProjectSidebarContext = {
  currentDir: Accessor<string>
  currentProject: Accessor<LocalProject | undefined>
  sidebarOpened: Accessor<boolean>
  sidebarHovering: Accessor<boolean>
  hoverProject: Accessor<string | undefined>
  onProjectMouseEnter: (worktree: string, event: MouseEvent) => void
  onProjectMouseLeave: (worktree: string) => void
  onProjectFocus: (worktree: string) => void
  onHoverOpenChanged: (worktree: string, hovered: boolean) => void
  navigateToProject: (directory: string) => void
  openSidebar: () => void
  closeProject: (directory: string) => void
  showEditProjectDialog: (project: LocalProject) => void
  toggleProjectWorkspaces: (project: LocalProject) => void
  workspacesEnabled: (project: LocalProject) => boolean
  workspaceIds: (project: LocalProject) => string[]
  workspaceLabel: (directory: string, branch?: string, projectId?: string) => string
  clearHoverProjectSoon: () => void
  sessionProps: Omit<SessionItemProps, "session" | "list" | "slug" | "mobile" | "dense">
}

export const ProjectDragOverlay = (props: {
  projects: Accessor<LocalProject[]>
  activeProject: Accessor<string | undefined>
}): JSX.Element => {
  const project = createMemo(() => props.projects().find((p) => p.worktree === props.activeProject()))
  return (
    <Show when={project()}>
      {(p) => (
        <div class="bg-background-base rounded-xl p-1">
          <ProjectIcon project={p()} />
        </div>
      )}
    </Show>
  )
}

const ProjectTile = (props: {
  project: LocalProject
  mobile?: boolean
  sidebarHovering: Accessor<boolean>
  selected: Accessor<boolean>
  active: Accessor<boolean>
  overlay: Accessor<boolean>
  suppressHover: Accessor<boolean>
  dirs: Accessor<string[]>
  onProjectMouseEnter: (worktree: string, event: MouseEvent) => void
  onProjectMouseLeave: (worktree: string) => void
  onProjectFocus: (worktree: string) => void
  navigateToProject: (directory: string) => void
  showEditProjectDialog: (project: LocalProject) => void
  toggleProjectWorkspaces: (project: LocalProject) => void
  workspacesEnabled: (project: LocalProject) => boolean
  closeProject: (directory: string) => void
  setMenu: (value: boolean) => void
  setOpen: (value: boolean) => void
  setSuppressHover: (value: boolean) => void
  language: ReturnType<typeof useLanguage>
}): JSX.Element => {
  const notification = useNotification()
  const layout = useLayout()
  const unseenCount = createMemo(() =>
    props.dirs().reduce((total, directory) => total + notification.project.unseenCount(directory), 0),
  )

  const clear = () =>
    props
      .dirs()
      .filter((directory) => notification.project.unseenCount(directory) > 0)
      .forEach((directory) => notification.project.markViewed(directory))

  return (
    <ContextMenu
      modal={!props.sidebarHovering()}
      onOpenChange={(value) => {
        props.setMenu(value)
        props.setSuppressHover(value)
        if (value) props.setOpen(false)
      }}
    >
      <ContextMenu.Trigger
        as="button"
        type="button"
        aria-label={displayName(props.project)}
        data-action="project-switch"
        data-project={base64Encode(props.project.worktree)}
        classList={{
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left": true,
          "bg-[#2a2d3d] text-text-strong": props.selected(),
          "text-text-base hover:bg-[#2a2d3d]": !props.selected(),
        }}
        onPointerDown={(event) => {
          if (event.button === 0 && !event.ctrlKey) {
            props.setOpen(false)
            props.setSuppressHover(true)
            return
          }
          if (!props.overlay()) return
          if (event.button !== 2 && !(event.button === 0 && event.ctrlKey)) return
          props.setOpen(false)
          props.setSuppressHover(true)
          event.preventDefault()
        }}
        onMouseEnter={(event: MouseEvent) => {
          if (!props.overlay()) return
          if (props.suppressHover()) return
          props.onProjectMouseEnter(props.project.worktree, event)
        }}
        onMouseLeave={() => {
          if (props.suppressHover()) props.setSuppressHover(false)
          if (!props.overlay()) return
          props.onProjectMouseLeave(props.project.worktree)
        }}
        onFocus={() => {
          if (!props.overlay()) return
          if (props.suppressHover()) return
          props.onProjectFocus(props.project.worktree)
        }}
        onClick={() => {
          props.setOpen(false)
          if (props.selected()) {
            layout.sidebar.toggle()
            return
          }
          props.navigateToProject(props.project.worktree)
        }}
        onBlur={() => props.setOpen(false)}
      >
        <div class="shrink-0 size-6">
          <ProjectIcon project={props.project} notify class="size-6" />
        </div>
        <span class="text-14-regular flex-1 truncate">{displayName(props.project)}</span>
        <Show when={unseenCount() > 0}>
          <span class="shrink-0 text-12-medium text-[#22c55e]">+{unseenCount()}</span>
        </Show>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={() => props.showEditProjectDialog(props.project)}>
            <ContextMenu.ItemLabel>{props.language.t("common.edit")}</ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Item
            data-action="project-workspaces-toggle"
            data-project={base64Encode(props.project.worktree)}
            disabled={props.project.vcs !== "git" && !props.workspacesEnabled(props.project)}
            onSelect={() => props.toggleProjectWorkspaces(props.project)}
          >
            <ContextMenu.ItemLabel>
              {props.workspacesEnabled(props.project)
                ? props.language.t("sidebar.workspaces.disable")
                : props.language.t("sidebar.workspaces.enable")}
            </ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Item
            data-action="project-clear-notifications"
            data-project={base64Encode(props.project.worktree)}
            disabled={unseenCount() === 0}
            onSelect={clear}
          >
            <ContextMenu.ItemLabel>{props.language.t("sidebar.project.clearNotifications")}</ContextMenu.ItemLabel>
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item
            data-action="project-close-menu"
            data-project={base64Encode(props.project.worktree)}
            onSelect={() => props.closeProject(props.project.worktree)}
          >
            <ContextMenu.ItemLabel>{props.language.t("common.close")}</ContextMenu.ItemLabel>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu>
  )
}

export const SortableProject = (props: {
  project: LocalProject
  mobile?: boolean
  ctx: ProjectSidebarContext
  sortNow: Accessor<number>
}): JSX.Element => {
  const navigate = useNavigate()
  const params = useParams()
  const globalSync = useGlobalSync()
  const language = useLanguage()
  const sortable = createSortable(props.project.worktree)
  const selected = createMemo(() => props.ctx.currentProject()?.worktree === props.project.worktree)
  const dirs = createMemo(() => props.ctx.workspaceIds(props.project))
  const [state, setState] = createStore({
    menu: false,
    suppressHover: false,
    open: true,
  })

  const [workspaceStore, setWorkspaceStore] = globalSync.child(props.project.worktree, { bootstrap: false })
  const sessions = createMemo(() => sortedRootSessions(workspaceStore, props.sortNow()))
  const slug = createMemo(() => base64Encode(props.project.worktree))
  const active = createMemo(() => workspaceKey(props.ctx.currentDir()) === workspaceKey(props.project.worktree))
  const count = createMemo(() => sessions()?.length ?? 0)
  const booted = createMemo((prev) => prev || workspaceStore.status === "complete", false)
  const hasMore = createMemo(() => workspaceStore.sessionTotal > count())
  const loading = createMemo(() => state.open && !booted() && count() === 0)

  createEffect(() => {
    if (!state.open) return
    globalSync.child(props.project.worktree, { bootstrap: true })
  })

  const loadMore = async () => {
    setWorkspaceStore("limit", (limit) => (limit ?? 0) + 5)
    await globalSync.project.loadSessions(props.project.worktree)
  }

  return (
    // @ts-ignore
    <div use:sortable classList={{ "opacity-30": sortable.isActiveDraggable }}>
      <Collapsible variant="ghost" open={state.open} class="shrink-0" onOpenChange={(open) => setState("open", open)}>
        <div class="group/project relative">
          <div
            class="group flex items-center justify-between mx-2 px-2 py-2 rounded-lg cursor-pointer transition-[background-color,color,box-shadow] duration-150"
            classList={{
              "bg-surface-raised-base text-text-strong": selected(),
              "text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong": !selected(),
            }}
            onClick={() => setState("open", !state.open)}
          >
            <div class="flex items-center gap-2.5 flex-1 min-w-0">
              <Icon name="folder" size="small" class="text-text-weaker" />
              <span class="font-medium text-13-regular truncate">{displayName(props.project)}</span>
            </div>

            <div classList={{
              "flex items-center gap-0.5 text-text-weaker transition-opacity": true,
              "opacity-100": selected() || state.open || state.menu,
              "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100": !selected() && !state.open && !state.menu,
            }}>
              <button
                type="button"
                aria-label={state.open ? "Collapse project" : "Expand project"}
                class="size-6 rounded-md flex items-center justify-center hover:text-text-strong hover:bg-surface-hover transition-colors"
                onClick={(event: MouseEvent) => {
                  event.stopPropagation()
                  setState("open", !state.open)
                }}
              >
                <Icon
                  name="chevron-right"
                  size="small"
                  class="transition-transform duration-150"
                  classList={{ "rotate-90": state.open }}
                />
              </button>
              <DropdownMenu>
                <DropdownMenu.Trigger as={IconButton} icon="dot-grid" variant="ghost" size="small" class="size-6 hover:text-text-strong rounded-md hover:bg-surface-hover cursor-pointer" />
                <DropdownMenu.Portal>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item onSelect={() => props.ctx.showEditProjectDialog(props.project)}>
                      <DropdownMenu.ItemLabel>{language.t("common.edit")}</DropdownMenu.ItemLabel>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      disabled={props.project.vcs !== "git" && !props.ctx.workspacesEnabled(props.project)}
                      onSelect={() => props.ctx.toggleProjectWorkspaces(props.project)}
                    >
                      <DropdownMenu.ItemLabel>
                        {props.ctx.workspacesEnabled(props.project)
                          ? language.t("sidebar.workspaces.disable")
                          : language.t("sidebar.workspaces.enable")}
                      </DropdownMenu.ItemLabel>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item onSelect={() => props.ctx.closeProject(props.project.worktree)}>
                      <DropdownMenu.ItemLabel>{language.t("common.close")}</DropdownMenu.ItemLabel>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu>
              <Button
                variant="ghost"
                class="size-6 hover:text-text-strong rounded-md hover:bg-surface-hover p-0 flex items-center justify-center cursor-pointer"
                onClick={(event: MouseEvent) => {
                  event.stopPropagation()
                  navigate(`/${slug()}/session`)
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.4745 5.40801L18.5917 7.52524M17.8358 3.54289L12.1086 9.27005C11.8131 9.56562 11.6116 9.94206 11.5296 10.3519L11 13L13.6481 12.4704C14.0579 12.3884 14.4344 12.1869 14.7299 11.8914L20.4571 6.16423C21.181 5.44037 21.181 4.26676 20.4571 3.5429C19.7332 2.81904 18.5596 2.81903 17.8358 3.54289Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19 15V18C19 19.1046 18.1046 20 17 20H6C4.89543 20 4 19.1046 4 18V7C4 5.89543 4.89543 5 6 5H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <Collapsible.Content>
          <div class="flex flex-col mt-0.5 gap-0.5">
            <Show when={loading()}>
              <div class="px-3 py-2 text-14-regular text-text-weaker">Loading...</div>
            </Show>
            <For each={sessions()}>
              {(session) => (
                <SessionItem
                  session={session}
                  list={sessions()}
                  navList={props.ctx.sessionProps.navList}
                  slug={slug()}
                  mobile={props.mobile}
                  dense
                  showChild
                  sidebarExpanded={props.ctx.sessionProps.sidebarExpanded}
                  clearHoverProjectSoon={props.ctx.sessionProps.clearHoverProjectSoon}
                  prefetchSession={props.ctx.sessionProps.prefetchSession}
                  archiveSession={props.ctx.sessionProps.archiveSession}
                />
              )}
            </For>
            <Show when={hasMore()}>
              <button
                class="flex items-center justify-between mx-2 pl-[38px] pr-3 py-1.5 cursor-pointer text-text-base hover:bg-surface-raised-base-hover hover:text-text-strong rounded-lg transition-colors group text-left"
                onClick={() => loadMore()}
              >
                <span class="font-medium text-13-regular">{language.t("common.loadMore")}</span>
                <Icon name="chevron-down" size="small" class="text-text-weaker group-hover:text-text-base transition-colors" />
              </button>
            </Show>
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  )
}
