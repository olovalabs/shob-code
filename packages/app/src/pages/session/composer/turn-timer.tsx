import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js"
import { Spinner } from "@opencode-ai/ui/spinner"
import { useSync } from "@/context/sync"

export const tips = [
  "Good code is like a good joke: it needs no explanation.",
  "Readability counts more than cleverness.",
  "The best debugging tool is a clear mind.",
  "Small functions are easier to test and understand.",
  "Comments should explain why, not what.",
  "Keep functions focused on one thing.",
  "Names matter more than you think.",
  "Simplicity is the ultimate sophistication.",
  "Write code for humans, not machines.",
  "Test your code, not your patience.",
  "Clean code always looks like it was written by someone who cares.",
  "Premature optimization is the root of all evil.",
  "Make it work, make it right, make it fast.",
  "Your future self will thank you for clear code.",
  "Consistency is key to maintainable code.",
  "Delete code, don't comment it out.",
  "If it's not tested, it's broken.",
  "Code that is hard to read is hard to maintain.",
  "The best documentation is the code itself.",
  "Refactor early, refactor often.",
]

export const quotes = [
  "First, solve the problem. Then, write the code. — John Johnson",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
  "Programs must be written for people to read, and only incidentally for machines to execute. — Harold Abelson",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "The only way to go fast is to go well. — Robert C. Martin",
  "Make it work, make it right, make it fast. — Kent Beck",
  "Code is like humor. When you have to explain it, it's bad. — Cory House",
  "Experience is the name everyone gives to their mistakes. — Oscar Wilde",
  "The best error message is the one that never shows up. — Thomas Fuchs",
  "Debugging is twice as hard as writing the code in the first place. — Brian Kernighan",
]

export const facts = [
  "The first computer bug was an actual bug found in a Harvard Mark II in 1947.",
  "The first computer programmer was Ada Lovelace in the 1840s.",
  "JavaScript was created in just 10 days in 1995.",
  "The first domain name registered was symbolics.com in 1985.",
  "The first computer mouse was made of wood.",
  "Python was named after Monty Python, not the snake.",
  "The first emoji was created in 1999 in Japan.",
  "The first computer virus was created in 1971.",
  "The first website is still online at info.cern.ch.",
  "The term 'bug' in computing predates computers by decades.",
]

export const jokes = [
  "Debugging is like being the detective in a crime movie where you're also the murderer.",
  "A program isn't done when it works. It's done when it stops working in predictable ways.",
  "Git is a time machine, except instead of fixing the past, you just create more branches and pray the merge doesn't rewrite reality.",
  "Inheritance is like inheriting a house: the foundation is great until you realize you also got the leaky roof and 1980s wiring.",
  "To understand recursion, you must first understand recursion. Skip the base case, and the stack will teach you.",
  "Programmers estimate timelines assuming the universe will cooperate. The universe rarely does.",
  "Documentation is like love: easy to claim, hard to prove, and only useful if someone actually reads it.",
  "Legacy code isn't old code. It's code without tests. And it's usually the reason you're working weekends.",
  "Refactoring is like cleaning your room while still living in it: necessary, messy, and you always find something you thought was lost.",
  "An API is like a restaurant menu: looks perfect until you order the daily special and get temporarily unavailable.",
  "C programmers don't have memory leaks. They just borrow RAM and forget to return it. The OS is a very patient landlord.",
  "Daily standups are just synchronized procrastination until the real work happens after the meeting ends.",
  "Null isn't a bug. It's a billion-dollar philosophical statement about uncertainty in a deterministic machine.",
  "Code review comments are just polite ways of saying I would've written this differently, followed by a lesson in shared ownership.",
  "Deploying to production is like launching a rocket: 90% of the work happens before ignition, and the last 10% decides if you're celebrated or fired.",
  "Stack Overflow isn't a knowledge base. It's a collective hallucination where strangers confidently debug your code for free.",
  "Technical debt is like credit card debt: the interest compounds silently until one day you realize you're paying for features you built three years ago.",
  "The best code is the code you never write. The second best is code simple enough that a junior dev can fix it at 3 AM.",
  "Errors aren't failures. They're just the compiler's way of saying I'm trying to protect you from yourself.",
  "Open source is like a potluck dinner: everyone brings something, someone always brings too much, and somehow it still feeds the world.",
]

export const keywords = [
  'Accomplishing', 'Actioning', 'Actualizing', 'Architecting', 'Baking', 'Beaming', 'Beboppin', 'Befuddling',
  'Billowing', 'Blanching', 'Blovating', 'Boogieing', 'Boondoggling', 'Booping', 'Bootstrapping', 'Brewing',
  'Bunning', 'Burrowing', 'Calculating', 'Canoodling', 'Caramelizing', 'Cascading', 'Catapulting', 'Cerebrating',
  'Channeling', 'Channelling', 'Choreographing', 'Churning', 'Clauding', 'Coalescing', 'Cogitating', 'Combobulating',
  'Composing', 'Computing', 'Concocting', 'Considering', 'Contemplating', 'Cooking', 'Crafting', 'Creating',
  'Crunching', 'Crystallizing', 'Cultivating', 'Deciphering', 'Deliberating', 'Determining', 'Dilly-dallying',
  'Discombobulating', 'Doing', 'Doodling', 'Drizzling', 'Ebbing', 'Effecting', 'Elucidating', 'Embellishing',
  'Enchanting', 'Envisioning', 'Evaporating', 'Fermenting', 'Fiddle-faddling', 'Finagling', 'Flambéing',
  'Flibbertigibbeting', 'Flowing', 'Flummoxing', 'Fluttering', 'Forging', 'Forming', 'Frolicking', 'Frosting',
  'Gallivanting', 'Galloping', 'Garnishing', 'Generating', 'Gesticulating', 'Germinating', 'Gitifying', 'Grooving',
  'Gusting', 'Harmonizing', 'Hashing', 'Hatching', 'Herding', 'Honking', 'Hullaballooing', 'Hyperspacing',
  'Ideating', 'Imagining', 'Improvising', 'Incubating', 'Inferring', 'Infusing', 'Ionizing', 'Jitterbugging',
  'Julienning', 'Kneading', 'Leavening', 'Levitating', 'Lollygagging', 'Manifesting', 'Marinating', 'Meandering',
  'Metamorphosing', 'Misting', 'Moonwalking', 'Moseying', 'Mulling', 'Mustering', 'Musing', 'Nebulizing',
  'Nesting', 'Newspapering', 'Noodling', 'Nucleating', 'Orbiting', 'Orchestrating', 'Osmosing', 'Perambulating',
  'Percolating', 'Perusing', 'Philosophising', 'Photosynthesizing', 'Pollinating', 'Pondering', 'Pontificating',
  'Pouncing', 'Precipitating', 'Prestidigitating', 'Processing', 'Proofing', 'Propagating', 'Puttering', 'Puzzling',
  'Quantumizing', 'Razzle-dazzling', 'Razzmatazzing', 'Recombobulating', 'Reticulating', 'Roosting', 'Ruminating',
  'Sautéing', 'Scampering', 'Schlepping', 'Scurrying', 'Seasoning', 'Shenaniganing', 'Shimmying', 'Simmering',
  'Skedaddling', 'Sketching', 'Slithering', 'Smooshing', 'Sock-hopping', 'Spelunking', 'Spinning', 'Sprouting',
  'Stewing', 'Sublimating', 'Swirling', 'Swooping', 'Symbioting', 'Synthesizing', 'Tempering', 'Thinking',
  'Thundering', 'Tinkering', 'Tomfoolering', 'Topsy-turvy', 'Transfiguring', 'Transmuting', 'Twisting', 'Undulating',
  'Unfurling', 'Unravelling', 'Vibing', 'Waddling', 'Wandering', 'Warping', 'Whatchamacalliting', 'Whirlpooling',
  'Whirring', 'Whisking', 'Wibbling', 'Working', 'Wrangling', 'Zesting', 'Zigzagging',
];

export function Dots() {
  return (
    <span class="inline-flex items-center gap-1 ml-1.5 h-3">
      <span
        class="size-1 rounded-full bg-icon-info-base/60"
        style={{
          animation: "var(--animate-pulse-scale)",
          "animation-delay": "0s",
        }}
      />
      <span
        class="size-1 rounded-full bg-icon-info-base/60"
        style={{
          animation: "var(--animate-pulse-scale)",
          "animation-delay": "0.2s",
        }}
      />
      <span
        class="size-1 rounded-full bg-icon-info-base/60"
        style={{
          animation: "var(--animate-pulse-scale)",
          "animation-delay": "0.4s",
        }}
      />
    </span>
  )
}

export function TurnTimer(props: { sessionID?: string }) {
  const sync = useSync()
  const status = createMemo(() => {
    if (!props.sessionID) return { type: "idle" }
    return sync.data.session_status[props.sessionID] ?? { type: "idle" }
  })

  const isBusy = createMemo(() => status().type === "busy")

  const lastAssistantMessage = createMemo(() => {
    if (!props.sessionID) return
    const msgs = sync.data.message[props.sessionID] ?? []
    return msgs.filter(m => m.role === "assistant" && typeof m.time.completed !== "number").at(-1)
  })

  const activeParts = createMemo(() => {
    const msg = lastAssistantMessage()
    if (!msg) return []
    return sync.data.part[msg.id] ?? []
  })

  const [randomKeyword, setRandomKeyword] = createSignal(keywords[Math.floor(Math.random() * keywords.length)])
  const [randomMessage, setRandomMessage] = createSignal("")
  const [messageType, setMessageType] = createSignal<"tip" | "quote" | "fact" | "joke">("tip")
  const [showMessage, setShowMessage] = createSignal(false)

  const currentTool = createMemo(() => {
    const parts = activeParts()
    const tool = parts.filter(p => p.type === "tool" && p.state.status !== "completed").at(-1)
    if (tool && tool.type === "tool") return tool
    return undefined
  })

  const toolNameDisplay = createMemo(() => {
    const tool = currentTool()
    if (!tool) return undefined

    const name = tool.tool.toLowerCase()
    const metadata = tool.metadata || {}

    if (name.includes("search") || name.includes("grep")) {
      const query = metadata.query as string | undefined || metadata.pattern as string | undefined
      return query ? `Searching: ${query.slice(0, 30)}...` : "Searching"
    }
    if (name.includes("find") || name.includes("ls") || name.includes("glob")) {
      const pattern = metadata.pattern as string | undefined || metadata.path as string | undefined
      return pattern ? `Finding: ${pattern.slice(0, 30)}...` : "Finding files"
    }
    if (name.includes("read")) {
      const path = metadata.path as string | undefined || metadata.file_path as string | undefined
      return path ? `Reading: ${path.slice(0, 40)}...` : "Reading file"
    }
    if (name.includes("write") || name.includes("replace") || name.includes("edit") || name.includes("patch")) {
      const path = metadata.path as string | undefined || metadata.file_path as string | undefined
      return path ? `Writing: ${path.slice(0, 40)}...` : "Writing file"
    }
    if (name.includes("shell") || name.includes("run") || name.includes("cmd") || name.includes("exec")) {
      const command = metadata.command as string | undefined || metadata.cmd as string | undefined
      return command ? `Running: ${command.slice(0, 30)}...` : "Running command"
    }

    return undefined
  })

  const currentActivity = createMemo(() => {
    const parts = activeParts()

    const tool = currentTool()
    if (tool) {
      const name = tool.tool.toLowerCase()
      if (name.includes("search") || name.includes("grep") || name.includes("find") || name.includes("ls") || name.includes("glob")) return "Searching"
      if (name.includes("read")) return "Reading"
      if (name.includes("write") || name.includes("replace") || name.includes("edit") || name.includes("patch")) return "Writing"
      if (name.includes("shell") || name.includes("run") || name.includes("cmd") || name.includes("exec")) return "Executing"
      return "Using tools"
    }

    if (parts.some(p => p.type === "reasoning")) return "Reasoning"
    if (parts.some(p => p.type === "text")) return "Responding"

    return randomKeyword()
  })

  const selectMessage = () => {
    const types = ["tip", "quote", "fact", "joke"] as const
    const type = types[Math.floor(Math.random() * types.length)]
    setMessageType(type)

    switch (type) {
      case "tip":
        setRandomMessage(tips[Math.floor(Math.random() * tips.length)])
        break
      case "quote":
        setRandomMessage(quotes[Math.floor(Math.random() * quotes.length)])
        break
      case "fact":
        setRandomMessage(facts[Math.floor(Math.random() * facts.length)])
        break
      case "joke":
        setRandomMessage(jokes[Math.floor(Math.random() * jokes.length)])
        break
    }
  }

  createEffect(() => {
    if (!isBusy()) {
      setShowMessage(false)
      return
    }

    const keywordTimer = setInterval(() => {
      if (!toolNameDisplay()) {
        setRandomKeyword(keywords[Math.floor(Math.random() * keywords.length)])
      }
    }, 4000)

    const messageTimer = setInterval(() => {
      selectMessage()
    }, 12000)

    const messageDelay = setTimeout(() => {
      selectMessage()
      setShowMessage(true)
    }, 8000)

    onCleanup(() => {
      clearInterval(keywordTimer)
      clearInterval(messageTimer)
      clearTimeout(messageDelay)
    })
  })

  return (
    <Show when={isBusy()}>
      <div
        class="flex items-center gap-2.5 px-2.5 py-1.5 pointer-events-none whitespace-nowrap overflow-hidden max-w-[calc(100vw-48px)] bg-background-base/80 backdrop-blur-sm rounded-lg border border-border-weak-base"
      >
        <div class="flex items-center gap-2 shrink-0">
          <Spinner class="size-3.5 text-icon-info-base" />
          <span class="text-10-semibold uppercase tracking-widest text-text-strong flex items-center">
            <For each={currentActivity().split("")}>
              {(char, i) => (
                <span
                  class="animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both"
                  style={{ "animation-delay": `${i() * 30}ms` }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              )}
            </For>
            <Dots />
          </span>
        </div>

        <Show when={toolNameDisplay()}>
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-text-weak/50 text-10-semibold shrink-0">—</span>
            <span class="text-10-semibold text-text-base truncate animate-in fade-in slide-in-from-left-4 duration-1000">
              {toolNameDisplay()}
            </span>
          </div>
        </Show>

        <Show when={!toolNameDisplay() && showMessage()}>
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-text-weak/50 text-10-semibold shrink-0">—</span>
            <span class="text-10-semibold text-text-base truncate animate-in fade-in slide-in-from-left-4 duration-1000">
              {messageType() === "tip" && "💡 "}
              {messageType() === "quote" && "💭 "}
              {messageType() === "fact" && "📚 "}
              {messageType() === "joke" && "😄 "}
              {randomMessage()}
            </span>
          </div>
        </Show>
      </div>
    </Show>
  )
}
