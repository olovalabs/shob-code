import type { JSX } from "solid-js"
import { Show, createEffect, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { createSortable } from "@thisbeyond/solid-dnd"
import { Icon } from "@opencode-ai/ui/icon"
import { DropdownMenu } from "@opencode-ai/ui/dropdown-menu"
import { isDefaultTitle as isDefaultTerminalTitle } from "@/context/terminal-title"
import { useTerminal, type LocalPTY } from "@/context/terminal"
import { useLanguage } from "@/context/language"
import { focusTerminalById } from "@/pages/session/helpers"

export function SortableTerminalTab(props: { terminal: LocalPTY; onClose?: () => void }): JSX.Element {
  const terminal = useTerminal()
  const language = useLanguage()
  const sortable = createSortable(props.terminal.id)
  const [store, setStore] = createStore({
    editing: false,
    title: props.terminal.title,
    menuOpen: false,
    menuPosition: { x: 0, y: 0 },
    blurEnabled: false,
    hover: false,
  })
  let input: HTMLInputElement | undefined
  let blurFrame: number | undefined
  let editRequested = false

  const isActive = () => terminal.active() === props.terminal.id

  const isDefaultTitle = () => {
    const number = props.terminal.titleNumber
    if (!Number.isFinite(number) || number <= 0) return false
    return isDefaultTerminalTitle(props.terminal.title, number)
  }

  const label = () => {
    language.locale()
    if (props.terminal.title && !isDefaultTitle()) return props.terminal.title

    const number = props.terminal.titleNumber
    if (Number.isFinite(number) && number > 0) return language.t("terminal.title.numbered", { number })
    if (props.terminal.title) return props.terminal.title
    return language.t("terminal.title")
  }

  const close = (e?: Event) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    const count = terminal.all().length
    terminal.close(props.terminal.id)
    if (count === 1) {
      props.onClose?.()
    }
  }

  const focus = () => {
    if (store.editing) return
    terminal.open(props.terminal.id)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    focusTerminalById(props.terminal.id)
  }

  const edit = (e?: Event) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }

    setStore("blurEnabled", false)
    setStore("title", props.terminal.title)
    setStore("editing", true)
  }

  const save = () => {
    if (!store.blurEnabled) return

    const value = store.title.trim()
    if (value && value !== props.terminal.title) {
      terminal.update({ id: props.terminal.id, title: value })
    }
    setStore("editing", false)
  }

  const keydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      save()
      return
    }
    if (e.key === "Escape") {
      e.preventDefault()
      setStore("editing", false)
    }
  }

  const menu = (e: MouseEvent) => {
    e.preventDefault()
    setStore("menuPosition", { x: e.clientX, y: e.clientY })
    setStore("menuOpen", true)
  }

  createEffect(() => {
    if (!store.editing) return
    if (!input) return
    input.focus()
    input.select()
    if (blurFrame !== undefined) cancelAnimationFrame(blurFrame)
    blurFrame = requestAnimationFrame(() => {
      blurFrame = undefined
      setStore("blurEnabled", true)
    })
  })

  onCleanup(() => {
    if (blurFrame === undefined) return
    cancelAnimationFrame(blurFrame)
  })

  return (
    <div
      use:sortable
      class="group h-9"
      classList={{
        "opacity-25": sortable.isActiveDraggable,
      }}
      onMouseEnter={() => setStore("hover", true)}
      onMouseLeave={() => setStore("hover", false)}
    >
      <button
        type="button"
        onClick={focus}
        onMouseDown={(e) => e.preventDefault()}
        onContextMenu={menu}
        class="h-full px-3 flex items-center gap-2 min-w-[140px] max-w-[240px] transition-all duration-150 outline-none border-r border-border-weaker-base"
        classList={{
          "bg-surface-base text-text-base": isActive(),
          "bg-background-base/30 text-text-weak hover:bg-background-base/50": !isActive(),
        }}
      >
        {/* Terminal icon */}
        <div
          class="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
          classList={{
            "bg-green-500/20": isActive(),
            "bg-purple-500/20": !isActive(),
          }}
        >
          <Icon 
            name="terminal" 
            class="w-3 h-3"
            classList={{
              "text-green-500": isActive(),
              "text-purple-500": !isActive(),
            }}
          />
        </div>

        <Show when={!store.editing}>
          <span
            onDblClick={edit}
            class="flex-1 truncate text-left text-13-regular select-none"
          >
            {label()}
          </span>
        </Show>

        <Show when={store.editing}>
          <input
            ref={input}
            type="text"
            value={store.title}
            onInput={(e) => setStore("title", e.currentTarget.value)}
            onBlur={save}
            onKeyDown={keydown}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            class="flex-1 bg-transparent border-none outline-none text-13-regular min-w-0"
          />
        </Show>

        <Show when={store.hover || isActive()}>
          <button
            type="button"
            onClick={close}
            class="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-background-stronger transition-colors"
          >
            <Icon name="close" class="w-3 h-3" />
          </button>
        </Show>
      </button>

      <DropdownMenu open={store.menuOpen} onOpenChange={(open) => setStore("menuOpen", open)}>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            class="fixed"
            style={{
              left: `${store.menuPosition.x}px`,
              top: `${store.menuPosition.y}px`,
            }}
            onCloseAutoFocus={(e) => {
              if (!editRequested) return
              e.preventDefault()
              editRequested = false
              requestAnimationFrame(() => edit())
            }}
          >
            <DropdownMenu.Item onSelect={() => (editRequested = true)}>
              <Icon name="edit" class="w-4 h-4 mr-2" />
              {language.t("common.rename")}
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={close}>
              <Icon name="close" class="w-4 h-4 mr-2" />
              {language.t("common.close")}
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </div>
  )
}
