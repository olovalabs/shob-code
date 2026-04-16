import { createEffect, createMemo, createSignal, onCleanup, Show } from "solid-js"
import { Spinner } from "@opencode-ai/ui/spinner"
import { useSync } from "@/context/sync"

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
];

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
  const [randomJoke, setRandomJoke] = createSignal(jokes[Math.floor(Math.random() * jokes.length)])

  const currentActivity = createMemo(() => {
    const parts = activeParts()
    
    const tool = parts.filter(p => p.type === "tool" && p.state.type !== "completed").at(-1)
    if (tool && tool.type === "tool") {
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

  const [elapsed, setElapsed] = createSignal(0)
  
  createEffect(() => {
    if (!isBusy()) {
      setElapsed(0)
      return
    }

    const msg = lastAssistantMessage()
    const start = msg?.time.created ?? Date.now()
    
    const update = () => {
      setElapsed(Math.max(0, Date.now() - start))
    }
    
    update()
    const timer = setInterval(update, 100)
    
    const keywordTimer = setInterval(() => {
      setRandomKeyword(keywords[Math.floor(Math.random() * keywords.length)])
    }, 4000)

    const jokeTimer = setInterval(() => {
      setRandomJoke(jokes[Math.floor(Math.random() * jokes.length)])
    }, 12000)

    onCleanup(() => {
      clearInterval(timer)
      clearInterval(keywordTimer)
      clearInterval(jokeTimer)
    })
  })

  const format = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const rs = s % 60
    return `${m}:${rs.toString().padStart(2, "0")}`
  }

  return (
    <Show when={isBusy()}>
      <div 
        class="flex items-center gap-2.5 px-2 py-1 transition-opacity duration-500 pointer-events-none whitespace-nowrap overflow-hidden max-w-[calc(100vw-48px)]"
        style={{ opacity: isBusy() ? 1 : 0 }}
      >
        <div class="flex items-center gap-2 shrink-0">
          <Spinner class="size-3 text-icon-info-base" />
          <span class="text-11-bold italic font-mono text-icon-info-base tabular-nums">
            {format(elapsed())}
          </span>
          <span class="text-11-bold italic text-icon-info-base uppercase tracking-wider animate-pulse">
            {currentActivity()}
          </span>
        </div>
        
        <Show when={elapsed() > 8000}>
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-icon-info-base/40 text-11-bold shrink-0">—</span>
            <span class="text-11-bold italic text-icon-info-base truncate animate-in fade-in slide-in-from-left-4 duration-1000">
              "{randomJoke()}"
            </span>
          </div>
        </Show>
      </div>
    </Show>
  )
}
