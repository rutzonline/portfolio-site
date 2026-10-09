import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react"
import { wisprCase } from "@/wisprCase"
import { cursorCase, revolutCase, heyclickyCase } from "@/portfolioCases"
import { statePlateCase } from "@/TSPCase"
import liq1 from "@/imports/liquide/l1.jpg"
import liq2 from "@/imports/liquide/l2.jpg"
import liq3 from "@/imports/liquide/l3.jpg"
import liq4 from "@/imports/liquide/l4.jpg"
import liq5 from "@/imports/liquide/l5.png"
import liq6 from "@/imports/liquide/l6.png"
import liq7 from "@/imports/liquide/l7.png"
import liq8 from "@/imports/liquide/l8.png"
import liq9 from "@/imports/liquide/l9.png"
import liq10 from "@/imports/liquide/l10.png"
import stateplateLogo from "@/imports/Report_Card.png"
import freelanceLogo from "@/imports/freelance___1_.png"
import Moodboard from "@/Moodboard"
import { aboutContent } from "@/aboutContent"
import PhotoSlideshow from "@/PhotoSlideshow"
import { Analytics } from "@vercel/analytics/react"
import ImagePreview from "@/ImagePreview"
import growthPortrait from "@/imports/figma_growth_new.png"
import contentPortrait from "@/imports/Untitled_design__20_.png"

type Mode = "growth" | "brand"
type PageKey = "about" | "work" | "notes" | "projects" | "moodboard" | "upto"

const PAGE_KEYS: PageKey[] = [
  "about",
  "work",
  "notes",
  "projects",
  "moodboard",
  "upto",
]

const CREAM = "#FAF9F6"
const PINK = "#FF9FC0"
const LIME = "#DDF080"
const BLUE = "#9EC5F4"
const SAPPHIRE = "#0F3A8A"

const timeline = [
  ["freelance marketer", "apr 2025 – present"],
  ["the state plate", "jan 2024 – mar 2025"],
  ["hopstack", "jun 2023 – sep 2023"],
  ["liquide", "mar 2022 – jul 2022"],
]

const jobs = [
  ["freelance marketer", "content, copy, strategy"],
  ["the state plate", "business growth & marketing associate"],
  ["hopstack", "marketing generalist intern"],
  ["liquide", "social media intern"],
]

const moodText =
  "a running list of the campaigns, brands, products, and corners of the internet that have shaped my marketing instincts."

const modeCopy = {
  growth: {
    intro:
      "i try things to get people to use a product, check what worked, and do more of that.",
    project: "wispr flow",
    projectDescription:
      "A lifecycle reset for a climate-tech platform: onboarding, activation loops, and a sharper path from interest to habit.",
    portrait: growthPortrait,
    tints: {} as Partial<Record<PageKey, string>>,
  },
  brand: {
    intro:
      "i write product and lifecycle content, from the first ad someone sees to the email that brings them back.",
    project: "Cardboard",
    projectDescription:
      "Feature storytelling for an AI video tool: product essays, social adaptations, and UX-driven copy.",
    portrait: contentPortrait,
    tints: {
      work: PINK,
      projects: LIME,
      upto: BLUE,
    } as Partial<Record<PageKey, string>>,
  },
}

const noteList = [
  {
    title: "the tale of three is now an ai tell?",
    blurb:
      "why every list of three suddenly reads like a language model wrote it.",
    body: [
      "Somewhere in the last two years, the rule of three flipped from a rhetorical flourish into a tell. Fast, clean and scalable. Bold, brave and brilliant. Once you see it, you cannot unsee it.",
      "The pattern is not wrong. It is just cheap. A list of three lets a writer skip the harder question of which one idea actually matters.",
      "My fix is boring: pick one, then earn the second with a specific detail. If a third item survives, it should surprise you.",
    ],
  },
  {
    title: "simple things to live by",
    blurb: "a short, slightly opinionated list of rules i keep coming back to.",
    body: [
      "Write it down the same day. Ask the obvious question first. Leave the room a little better than you found it.",
      "None of these are original. They are just the ones that survived contact with real deadlines, real teams and real mistakes.",
      "I revisit the list every few months and cut whatever I have stopped following.",
    ],
  },
  {
    title: "the friend recommendation algorithm",
    blurb: "how word of mouth quietly beats most performance channels.",
    body: [
      "The best marketing channel I have ever used is a friend saying, you should try this. It converts, it retains and it cannot be bought.",
      "Treating it like an algorithm helps: who is the trusted node, what is the trigger moment, and what makes the recommendation easy to pass on?",
      "Most growth loops are just this, with better instrumentation.",
    ],
  },
]
const notes = noteList.map((n) => n.title)

const skillSets: Record<Mode, {
  tags: string[]
  line: string
  sections: [string, string][]
}> = {
  growth: {
    tags: [
      "Shopify",
      "Clay",
      "PostHog",
      "Mailchimp",
      "Google Analytics",
      "Supabase",
      "Cursor",
    ],
    line: "Funnels, experiments and lifecycle. Measure first, then ship.",
    sections: [
      ["Lifecycle", "Onboarding, activation loops, and retention programmes."],
      ["Analytics", "Funnel analysis, cohorts, and experiment readouts."],
      ["Strategy", "Positioning, growth models, and experiment roadmaps."],
    ],
  },
  brand: {
    tags: [
      "Figma",
      "Notion",
      "Meta Ads Manager",
      "Canva",
      "Claude",
      "ElevenLabs",
      "Buffer",
    ],
    line: "Voice, story and taste. The tools change; clear thinking doesn’t.",
    sections: [
      ["Narrative", "Brand voice, manifestos, and launch storytelling."],
      ["Content", "Essays, newsletters, and social adaptations."],
      ["Product comms", "Release notes, messaging, and positioning docs."],
    ],
  },
}

const skillDomains: Record<string, string> = {
  shopify: "shopify.com",
  clay: "clay.com",
  posthog: "posthog.com",
  mailchimp: "mailchimp.com",
  supabase: "supabase.com",
  cursor: "cursor.com",
  "meta ads manager": "facebook.com",
  claude: "claude.ai",
  elevenlabs: "elevenlabs.io",
  buffer: "buffer.com",
  SQL: "postgresql.org",
  Amplitude: "amplitude.com",
  Mixpanel: "mixpanel.com",
  "Customer.io": "customer.io",
  "Google Analytics": "analytics.google.com",
  Looker: "looker.com",
  Figma: "figma.com",
  Notion: "notion.so",
  Webflow: "webflow.com",
  Canva: "canva.com",
  Substack: "substack.com",
  "Are.na": "are.na",
}

const stintDomains = ["", "thestateplate.com", "hopstack.io", "liquide.life"]

function NotesPage() {
  const [sel, setSel] = useState<number | null>(null)
  useBack(
    sel !== null
      ? () => {
          setSel(null)
          return true
        }
      : null,
    "notes",
  )
  if (sel !== null) {
    const n = noteList[sel]
    return (
      <div data-essay className="flex max-w-2xl flex-col gap-5">
        <button
          type="button"
          onClick={() => setSel(null)}
          className="back-btn self-start max-lg:hidden"
        >
          <Chev />
          all notes
        </button>
        <h2 className="font-body-serif text-[clamp(28px,3.4vw,46px)] leading-[1.05] tracking-[-0.025em]">
          {n.title}
        </h2>
        <p className="text-[#1A1A1A]/60">{n.blurb}</p>
        {n.body.map((p) => (
          <p key={p} className="text-lg leading-relaxed text-[#1A1A1A]/85">
            {p}
          </p>
        ))}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#1A1A1A]/15 pt-6">
          <button
            type="button"
            onClick={() => setSel(null)}
            className="back-btn"
          >
            <Chev />
            all notes
          </button>
          {sel < noteList.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.closest("article")?.scrollTo(0, 0)
                window.scrollTo(0, 0)
                setSel(sel + 1)
              }}
              className="back-btn text-left"
            >
              next: {noteList[sel + 1].title}
              <Chev right />
            </button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="-mx-6 mt-4 lg:-mx-10 lg:mt-6">
      <ul className="border-y border-[#1A1A1A]/15">
        {noteList.map((n, i) => (
          <li
            key={n.title}
            className="border-b border-[#1A1A1A]/15 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => setSel(i)}
              className="group flex w-full items-center gap-4 px-6 py-5 text-left lg:px-10"
            >
              <span className="w-8 shrink-0 text-[#1A1A1A]/45">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-tight transition-colors group-hover:text-[color:var(--hl-link)]">
                  {n.title}
                </span>
                <span className="mt-0.5 block text-[#1A1A1A]/60">
                  {n.blurb}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-2xl leading-none text-[color:var(--hl-link)] opacity-0 transition-opacity group-hover:opacity-100"
              >
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const titles: Record<PageKey, string> = {
  about: "About",
  work: "Skills & stack",
  notes: "Notes",
  projects: "Experience",
  moodboard: "Moodboard",
  upto: "What I’m up to",
}

function Chev({ right = false }: { right?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`size-4 shrink-0 ${right ? "" : "rotate-180"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

let backHandler: (() => boolean) | null = null
let backLabel = ""

function useBack(fn: (() => boolean) | null, label = "") {
  backHandler = fn
  const active = fn !== null
  useEffect(
    () => () => {
      backHandler = null
    },
    [],
  )
  useEffect(() => {
    const next = active ? label : ""
    if (backLabel !== next) {
      backLabel = next
      window.dispatchEvent(new Event("backchange"))
    }
    return () => {
      if (backLabel !== "") {
        backLabel = ""
        window.dispatchEvent(new Event("backchange"))
      }
    }
  }, [active, label])
}

function Card({
  children,
  className = "",
  ariaLabel,
  padded = true,
  bg = CREAM,
  onOpen,
  onClick,
  homeKey,
}: {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLElement>) => void
  className?: string
  ariaLabel: string
  padded?: boolean
  bg?: string
  onOpen?: (e: MouseEvent<HTMLButtonElement>) => void
  homeKey?: PageKey
}) {
  const cls = `portfolio-card flex min-w-0 flex-col overflow-hidden lg:min-h-0 ${
    padded ? "p-6 lg:p-5 xl:p-6" : ""
  } ${className}`
  if (onOpen) {
    return (
      <button
        type="button"
        aria-label={`Open ${ariaLabel}`}
        data-home-card={homeKey}
        onClick={onOpen}
        style={{ background: bg }}
        className={`${cls} card-link w-full cursor-pointer text-left`}
      >
        {children}
      </button>
    )
  }
  return (
    <article
      aria-label={ariaLabel}
      style={{ background: bg }}
      className={cls}
      onClick={onClick}
    >
      {children}
    </article>
  )
}

function CardHeading({
  children,
  detail,
}: {
  children: ReactNode
  detail?: string
}) {
  return (
    <header className="flex shrink-0 items-baseline justify-between gap-3">
      <h2 className="card-title font-heading text-[22px] leading-none tracking-[-0.02em]">
        {children}
      </h2>
      {detail && (
        <span className="text-right text-base text-[#1A1A1A]/55">{detail}</span>
      )}
    </header>
  )
}

function Rows({ items }: { items: [string, string][] }) {
  return (
    <dl className="divide-y divide-[#1A1A1A]/15">
      {items.map(([k, v]) => (
        <div
          key={k}
          className="flex justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <dt className="text-[#1A1A1A]/60">{k}</dt>
          <dd className="text-right">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#1A1A1A]/15 pt-4">
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      <div className="leading-snug text-[#1A1A1A]/75">{children}</div>
    </section>
  )
}

const liquideImages = [
  liq1,
  liq2,
  liq3,
  liq4,
  liq5,
  liq6,
  liq7,
  liq8,
  liq9,
  liq10,
]

const liquideDid = [
  "Built the Instagram strategy and content calendar",
  "Defined content formats (posts, carousels, reels, explainers)",
  "Wrote scripts and copy that explained finance concepts in plain language",
  "Managed designers, content writers, and creators end to end",
]

const stints = [
  {
    summary:
      "Running content, copy and growth strategy for early-stage founders and small teams.",
    body: [
      "Independent since 2025: I work with founders on positioning, content systems and community experiments.",
      "Also spending time learning:",
      "- Advanced PMM frameworks: positioning, GTM, pricing and adoption loops",
      "- Deeper paid media analytics & experimentation",
      "- Marketing automation & lifecycle strategy at scale",
      "- Using AI for faster ideation, testing, and execution",
    ],
    points: [
      "Campaign planning and launches",
      "Partnerships and collaborations",
      "Industries: F&B | D2C | apparel | real estate",
    ],
    links: [
      ["book a call", "https://cal.com/rutujarochkari"],
      ["get in touch", "mailto:rutujarochkari7@gmail.com"],
    ],
  },
  {
    summary: "Business growth and marketing across a food-tech brand.",
    body: [
      "Owned growth experiments and brand marketing, from campaign planning to weekly reporting on what actually moved orders.",
      "Worked closely with the founders on partnerships, content calendars and launch storytelling.",
    ],
    points: [
      "Campaign planning and launches",
      "Partnerships and collaborations",
      "Weekly growth reporting",
    ],
    links: [
      ["the state plate", "https://example.com"],
      ["featured campaign", "https://example.com"],
    ],
  },
  {
    summary: "Marketing generalist intern at a warehouse-tech startup.",
    body: [
      "A summer spent across content, SEO and SaaS 101: writing social media posts, managing the website CMS and supporting SEO efforts.",
      "First real taste of B2B marketing and the discipline of tying content to pipeline.",
    ],
    points: [
      "Product explainers and landing pages",
      "SEO and blog refresh",
      "Webinar and event support",
    ],
    links: [
      ["hopstack", "https://hopstack.io"],
      ["sample article", "https://www.hopstack.io/blog/top-ecommerce-tools"],
    ],
  },
  {
    summary: "Social media intern at an investing platform.",
    body: [
      "Wrote and scheduled daily social content, translating market jargon into plain language for first-time investors.",
      "Learned the basics of community tone, calendars and engagement analytics.",
    ],
    points: [
      "Daily social content",
      "Plain-language explainers",
      "Engagement analytics",
    ],
    links: [
      ["liquide", "https://liquide.life"],
      ["sample posts", "https://instagram.com/liquide.life"],
    ],
  },
]

const stintLogo = (company: string) =>
  company === "the state plate"
    ? stateplateLogo
    : company === "freelance marketer"
      ? freelanceLogo
      : undefined

const stintMd = (i: number) => {
  const st = stints[i]
  const did =
    timeline[i][0] === "liquide" ? [...liquideDid, ...st.points] : st.points
  return `## 01. overview\n\n${st.summary}\n\n${st.body.join("\n")}\n\n## 02. what i worked on\n\n${did.map((p) => `- ${p}`).join("\n")}\n`
}

function Experience({ mode }: { mode: Mode }) {
  const [sel, setSel] = useState(0)
  const palette = [PINK, LIME, "#E88D6D", BLUE]
  const colorFor = (i: number) => (mode === "growth" ? SAPPHIRE : palette[i])
  const fg = mode === "growth" ? "#fff" : "#1A1A1A"
  const cur = stints[sel]
  const bodyRef = useRef<HTMLDivElement>(null)
  return (
    <div className="-mx-6 lg:-mx-10">
      <ul className="border-y border-[#1A1A1A]/15">
        {timeline.map(([company, dates], i) => {
          const active = sel === i
          return (
            <li
              key={company}
              className="border-b border-[#1A1A1A]/15 last:border-b-0"
            >
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSel(i)
                  if (!window.matchMedia("(min-width: 1024px)").matches)
                    requestAnimationFrame(() =>
                      bodyRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      }),
                    )
                }}
                style={
                  active ? { background: colorFor(i), color: fg } : undefined
                }
                className="flex w-full items-center justify-between gap-4 px-6 py-3 text-left transition-colors duration-200 hover:bg-[#1A1A1A]/[0.03] lg:px-10"
              >
                <Logo
                  domain={stintDomains[i]}
                  src={stintLogo(company)}
                  name={company}
                  size="size-10"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{company}</span>
                  <span
                    className={`block ${
                      active ? "opacity-80" : "text-[#1A1A1A]/60"
                    }`}
                  >
                    {jobs[i][1]}
                  </span>
                </span>
                <span
                  className={`shrink-0 ${
                    active ? "opacity-80" : "text-[#1A1A1A]/60"
                  }`}
                >
                  {dates}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <div key={sel} ref={bodyRef} className="scroll-mt-14 px-6 py-8 lg:px-10">
        <CaseStudy
          md={
            timeline[sel][0] === "the state plate"
              ? statePlateCase
              : stintMd(sel)
          }
          header={
            <CaseHeader
              name={timeline[sel][0]}
              sub={jobs[sel][1]}
              domain={stintDomains[sel]}
              src={stintLogo(timeline[sel][0])}
            />
          }
          meta={{
            kicker: "experience · case study",
            facts: [
              ["timeline", timeline[sel][1]],
              ["role", jobs[sel][1]],
            ],
          }}
          footer={
            timeline[sel][0] === "the state plate" ? undefined : (
              <>
                {timeline[sel][0] === "liquide" && (
                  <div className="grid grid-cols-2 gap-3">
                    {liquideImages.map((src, k) => (
                      <ImageSlot
                        key={k}
                        src={src}
                        alt={`liquide ${k + 1}`}
                        className={
                          k === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"
                        }
                      />
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  {stints[sel].links.map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="contact-link min-h-10 font-medium"
                    >
                      {label} <span className="text-lg leading-none">↗</span>
                    </a>
                  ))}
                </div>
              </>
            )
          }
        />
      </div>
    </div>
  )
}

const uptoRows: Record<Mode, [string, string][]> = {
  growth: [
    ["Based", "Pune, India"],
    ["Reading", "tiny experiments"],
    ["Writing", "better prompts"],
  ],
  brand: [
    ["Based", "Pune, India"],
    ["Reading", "tiny experiments"],
    ["Writing", "dear diary entries (& cover letters)"],
  ],
}

function AboutExtras({ mode }: { mode: Mode }) {
  const c = aboutContent[mode]
  const [expanded, setExpanded] = useState<{ src: string; alt: string } | null>(null)
  useEffect(() => setExpanded(null), [mode])
  return (
    <div className="flex max-w-4xl flex-col gap-10">
      <p className="w-full text-lg leading-snug text-[#1A1A1A]/80">{c.bio}</p>
      <section>
        <h3 className="mb-3 font-heading text-xl tracking-[-0.02em]">
          languages
        </h3>
        <Rows items={c.languages} />
      </section>
      <section>
        <h3 className="mb-3 font-heading text-xl tracking-[-0.02em]">
          interests
        </h3>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {c.interests.map((t, i) => (
            <li key={t} className="flex min-w-0 flex-col gap-2">
              <button type="button" aria-label={`Expand image: ${t}`} aria-haspopup="dialog"
                onClick={() => {
                  const src = c.interestImages?.[i]
                  if (src) setExpanded({ src, alt: t })
                }}
                className="block w-full cursor-zoom-in rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                <ImageSlot alt={t} src={c.interestImages?.[i]} className="aspect-[4/3]" />
              </button>
              <span className="leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3 className="mb-3 font-heading text-xl tracking-[-0.02em]">faq</h3>
        <div className="divide-y divide-[#1A1A1A]/15 border-y border-[#1A1A1A]/15">
          {c.faqs.map(([q, a]) => (
            <details key={q} className="group py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span
                  aria-hidden="true"
                  className="text-xl leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2 max-w-2xl leading-snug text-[#1A1A1A]/70">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
      {expanded && <ImagePreview src={expanded.src} alt={expanded.alt} onClose={() => setExpanded(null)} />}
    </div>
  )
}

function PageBody({ page, mode }: { page: PageKey; mode: Mode }) {
  const brand = modeCopy[mode]
  switch (page) {
    case "about":
      return (
        <>
          <p className="max-w-3xl font-body-serif text-[clamp(26px,3.2vw,44px)] leading-[1.1] tracking-[-0.025em]">
            {brand.intro}
          </p>
          <video
            controls
            playsInline
            preload="metadata"
            src="https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/video%20introduction.mp4"
            className="aspect-video w-full max-w-4xl rounded-md border border-[#E5E1DA] bg-[#1A1A1A]"
          />
          <AboutExtras mode={mode} />
        </>
      )
    case "work":
      return (
        <>
          <div className="flex flex-wrap gap-2">
            {skillSets[mode].tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-2 rounded-full border border-[#1A1A1A]/20 py-1.5 pl-2 pr-4"
              >
                <Logo
                  domain={skillDomains[t] ?? skillDomains[t.toLowerCase()]}
                  name={t}
                  size="size-6"
                />
                {t}
              </span>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {skillSets[mode].sections.map(([t, d]) => (
              <Section key={t} title={t}>
                {d}
              </Section>
            ))}
          </div>
        </>
      )
    case "notes":
      return <NotesPage />
    case "projects":
      return <Experience mode={mode} />
    case "moodboard":
      return mode === "growth" ? <CasesPage mode={mode} /> : <Moodboard />
    case "upto":
      return (
        <div className="max-w-xl">
          <Rows
            items={[...uptoRows[mode], ["Availability", "Open to work"]]}
          />
        </div>
      )
  }
}

const moodTitles = ["websites", "brands", "campaigns", "newsletters"]

function MoodTitles() {
  return (
    <ul className="my-4 flex flex-col items-start gap-1 lg:my-auto">
      {moodTitles.map((t, i) => (
        <li
          key={t}
          className="mood-item"
          style={
            { "--i": i, "--r": moodTitles.length - 1 - i } as CSSProperties
          }
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

const caseContent: Record<string, string> = {
  cursor: cursorCase,
  revolut: revolutCase,
  "wispr flow": wisprCase,
  heyclicky: heyclickyCase,
}

const cases = [
  ["cursor", "product growth & creator campaigns", "cursor.com"],
  ["revolut", "india growth plan", "revolut.com"],
  ["wispr flow", "early product growth & adoption", "wisprflow.ai"],
  ["heyclicky", "ads & creator partnerships", "heyclicky.com"],
]

function Logo({
  domain,
  src,
  name,
  size = "size-9",
}: {
  domain?: string
  src?: string
  name: string
  size?: string
}) {
  const [n, setN] = useState(0)
  const [square, setSquare] = useState(true)
  const srcs = src
    ? [src]
    : domain
      ? [
          `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          `https://icons.duckduckgo.com/ip3/${domain}.ico`,
          `https://${domain}/favicon.ico`,
        ]
      : []
  return n >= srcs.length ? (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-md border border-[#E5E1DA] text-sm font-semibold`}
    >
      {name[0]}
    </span>
  ) : (
    <img
      key={n}
      src={srcs[n]}
      alt=""
      decoding="async"
      onError={() => setN(n + 1)}
      onLoad={(e) =>
        setSquare(
          Math.abs(
            e.currentTarget.naturalWidth - e.currentTarget.naturalHeight,
          ) < 2,
        )
      }
      className={`${size} shrink-0 ${
        square
          ? "rounded-md border border-[#E5E1DA] bg-white object-cover"
          : "object-contain"
      }`}
    />
  )
}

function CaseList() {
  return (
    <ul className="divide-y divide-[#1A1A1A]/15">
      {cases.map(([name, sub]) => (
        <li
          key={name}
          className="group py-1.5 leading-snug first:pt-0 last:pb-0"
        >
          <span className="block text-[16px] font-medium transition-colors group-hover:text-[color:var(--accent-text)]">
            {name}
          </span>
          <span className="block text-[14px] text-[#1A1A1A]/60">{sub}</span>
        </li>
      ))}
    </ul>
  )
}

function Inline({ text }: { text: string }) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|https?:\/\/[^\s]+)/g,
  )
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a
            key={i}
            href={p}
            target="_blank"
            rel="noreferrer"
            className="break-all underline underline-offset-2 hover:text-[color:var(--hl-link)]"
          >
            {p}
          </a>
        ) : p.startsWith("**") ? (
          <strong key={i} className="font-semibold">
            {p.slice(2, -2)}
          </strong>
        ) : p.startsWith("`") ? (
          <code key={i} className="rounded bg-[#1A1A1A]/[0.06] px-1">
            {p.slice(1, -1)}
          </code>
        ) : p.startsWith("*") && p.length > 2 ? (
          <em key={i}>{p.slice(1, -1)}</em>
        ) : (
          p
        ),
      )}
    </>
  )
}

const placeholderImg =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#F0EEEA"/><text x="800" y="450" font-family="Inter,sans-serif" font-size="32" fill="#8A8A8A" text-anchor="middle">image placeholder</text></svg>',
  )

function ImageSlot({
  alt,
  src = placeholderImg,
  className = "",
}: {
  alt: string
  src?: string
  className?: string
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`w-full rounded-md border border-[#E5E1DA] bg-[#F0EEEA] object-cover ${className}`}
    />
  )
}

function CaseHeader({
  name,
  sub,
  domain,
  src,
}: {
  name: string
  sub: string
  domain?: string
  src?: string
}) {
  return (
    <div className="flex items-center gap-4">
      <Logo domain={domain} src={src} name={name} size="size-12" />
      <div>
        <h2 className="font-heading text-[clamp(26px,3vw,40px)] leading-none tracking-[-0.03em]">
          {name}
        </h2>
        <p className="mt-1 text-[#1A1A1A]/60">{sub}</p>
      </div>
    </div>
  )
}

type CaseMeta = { kicker: string; facts: [string, string][] }

function CaseStudy({
  md,
  meta,
  header,
  footer,
  independentScroll = false,
  backControl,
}: {
  md: string
  meta?: CaseMeta
  header?: ReactNode
  footer?: ReactNode
  independentScroll?: boolean
  backControl?: ReactNode
}) {
  const [active, setActive] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const toc: [string, string][] = []
  let imgDue: string | null = null
  const lines = md.split("\n")
  const out: ReactNode[] = []
  const sources: string[] = []
  let inSources = false
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (!l.trim() || l.trim() === "---") {
      i++
    } else if (l.startsWith("# ")) {
      out.push(
        <h2
          key={i}
          className="font-body-serif text-[clamp(22px,2.2vw,30px)] leading-tight tracking-[-0.02em]"
        >
          {l.slice(2)}
        </h2>,
      )
      i++
    } else if (l.startsWith("### ")) {
      out.push(
        <h4 key={i} className="mt-4 font-semibold text-[1.15em]">
          {l.slice(4)}
        </h4>,
      )
      i++
    } else if (l.startsWith("## ")) {
      const t = l.slice(3)
      inSources = t.toLowerCase() === "sources"
      if (!inSources) {
        const m = t.match(/^(\d+)\.\s*(.*)$/)
        const id = `sec-${toc.length}`
        toc.push([id, m ? m[2] : t])
        imgDue = m ? m[2] : t
        out.push(
          <h3
            key={i}
            id={id}
            className="mt-10 flex scroll-mt-6 items-baseline gap-3 border-t border-[#1A1A1A]/15 pt-6 font-heading text-[clamp(22px,2.2vw,30px)] tracking-[-0.02em] first:mt-0 first:border-t-0 first:pt-0"
          >
            {m && <span className="text-[#1A1A1A]/45">{m[1]}</span>}
            {m ? m[2] : t}
          </h3>,
        )
      }
      i++
    } else if (inSources) {
      if (l.startsWith("- ")) sources.push(l.slice(2))
      i++
    } else if (l.startsWith("|")) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!/^\|[-| ]+\|$/.test(lines[i]))
          rows.push(
            lines[i]
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim()),
          )
        i++
      }
      out.push(
        <div key={i} className="lg:overflow-x-auto">
          <table className="w-full border-collapse text-left max-lg:text-sm lg:min-w-[520px]">
            <thead>
              <tr>
                {rows[0].map((h) => (
                  <th
                    key={h}
                    className="border-b border-[#1A1A1A]/30 py-2 pr-4 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((r, ri) => (
                <tr key={ri} className="align-top">
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className="border-b border-[#1A1A1A]/15 py-2 pr-4 text-[#1A1A1A]/80"
                    >
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
    } else if (/^(- |\d+\. )/.test(l)) {
      const ordered = /^\d+\./.test(l)
      const items: string[] = []
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) {
        items.push(lines[i].replace(/^(- |\d+\. )/, ""))
        i++
      }
      const Tag = ordered ? "ol" : "ul"
      out.push(
        <Tag
          key={i}
          className={`flex flex-col gap-1.5 pl-5 text-[#1A1A1A]/80 ${
            ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((it, k) => (
            <li key={k} className="leading-snug">
              <Inline text={it} />
            </li>
          ))}
        </Tag>,
      )
    } else {
      const em = /^\*[^*]+\*$/.test(l.trim())
      out.push(
        <p
          key={i}
          className={`leading-snug ${
            em ? "text-[#1A1A1A]/55" : "text-[#1A1A1A]/85"
          }`}
        >
          <Inline text={l} />
        </p>,
      )
      if (imgDue) {
        out.push(
          <figure key={`img-${i}`} className="my-2">
            <ImageSlot alt={imgDue} className="aspect-[16/9]" />
            <figcaption className="mt-1.5 text-sm text-[#1A1A1A]/50">
              {imgDue}
            </figcaption>
          </figure>,
        )
        imgDue = null
      }
      i++
    }
  }
  const tocKey = toc.length
  useEffect(() => {
    setActive(0)
    const content = contentRef.current
    if (independentScroll) content?.scrollTo({ top: 0 })
    const els = Array.from({ length: tocKey }, (_, k) =>
      content?.querySelector<HTMLElement>(`#sec-${k}`),
    ).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const visible = new Set<number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const k = Number(e.target.id.slice(4))
          if (e.isIntersecting) visible.add(k)
          else visible.delete(k)
        }
        if (visible.size) setActive(Math.min(...visible))
      },
      { root: independentScroll ? content : null, rootMargin: "0px 0px -65% 0px" },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [tocKey, md, independentScroll])
  return (
    <div className={`grid gap-10 lg:grid-cols-[190px_minmax(0,1fr)] ${independentScroll ? "min-h-0 flex-1 overflow-hidden" : ""}`}>
      {toc.length > 1 && (
        <nav
          aria-label="contents"
          className={`hidden self-start lg:block ${independentScroll ? "max-h-full overflow-y-auto overscroll-contain pt-6" : "lg:sticky lg:top-6"}`}
        >
          {backControl && <div className="mb-6">{backControl}</div>}
          <ul className="flex flex-col gap-2 text-[15px] leading-tight">
            {toc.map(([id, label], k) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    const content = contentRef.current
                    const section = content?.querySelector<HTMLElement>(`#${id}`)
                    if (!section) return
                    if (independentScroll && content) {
                      content.scrollTo({
                        top: content.scrollTop + section.getBoundingClientRect().top - content.getBoundingClientRect().top - 24,
                        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                      })
                    } else {
                      section.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  }}
                  className={`transition-colors hover:text-[color:var(--hl-link)] ${
                    active === k
                      ? "font-medium text-[#1A1A1A]"
                      : "text-[#1A1A1A]/50"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div
        ref={contentRef}
        role={independentScroll ? "region" : undefined}
        aria-label={independentScroll ? "Case study content" : undefined}
        tabIndex={independentScroll ? 0 : undefined}
        className={`min-w-0 ${independentScroll ? "min-h-0 overflow-y-auto overscroll-contain" : ""}`}
      >
        <div className={`flex max-w-[44rem] flex-col gap-4 ${independentScroll ? "mr-6 pb-6 pr-3 pt-6 lg:mr-10 lg:pt-[88px]" : ""}`}>
          {header}
          {meta && (
            <div className="mb-4 flex flex-col gap-6">
              <p className="text-[#1A1A1A]/55">{meta.kicker}</p>
              <dl className="flex flex-wrap gap-x-12 gap-y-4">
                {meta.facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[#1A1A1A]/55">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {out}
          {footer}
          {sources.length > 0 && (
            <footer className="mt-10 border-t border-[#1A1A1A]/15 pt-4 text-sm text-[#1A1A1A]/55">
              <p className="mb-1 font-semibold">sources</p>
              <ul className="flex flex-col gap-0.5">
                {sources.map((x) => (
                  <li key={x}>
                    <Inline text={x} />
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

function CasesPage({ mode }: { mode: Mode }) {
  const [open, setOpen] = useState<number | null>(null)
  useBack(
    open !== null
      ? () => {
          setOpen(null)
          return true
        }
      : null,
    "case studies",
  )
  if (open !== null) {
    const [name, sub, domain] = cases[open]
    return (
      <div data-essay className="-mr-6 -mt-6 flex min-h-0 flex-1 flex-col overflow-hidden lg:-mr-10">
        {caseContent[name] ? (
          <CaseStudy
            independentScroll
            backControl={
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="back-btn"
              >
                <Chev />
                all case studies
              </button>
            }
            md={caseContent[name]}
            header={<CaseHeader name={name} sub={sub} domain={domain} />}
            meta={{
              kicker: "independent conceptual proposal",
              facts: [["focus", sub]],
            }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <CaseHeader name={name} sub={sub} domain={domain} />
            <p className="text-lg text-[#1A1A1A]/60">
              this case study is coming soon.
            </p>
          </div>
        )}
      </div>
    )
  }
  return (
    <div className="-mx-6 mt-4 min-h-0 overflow-y-auto overscroll-contain lg:-mx-10 lg:mt-6">
      <ul className="border-y border-[#1A1A1A]/15">
        {cases.map(([name, sub, domain], i) => (
          <li
            key={name}
            className="border-b border-[#1A1A1A]/15 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group flex w-full items-center gap-4 px-6 py-5 text-left lg:px-10"
            >
              <Logo domain={domain} name={name} size="size-10" />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-tight transition-colors group-hover:text-[color:var(--hl-link)]">
                  {name}
                </span>
                <span className="mt-0.5 block text-[#1A1A1A]/60">{sub}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-2xl leading-none text-[color:var(--hl-link)] opacity-0 transition-opacity group-hover:opacity-100"
              >
                ↗
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const pageTitle = (k: PageKey, m: Mode) =>
  k === "moodboard" && m === "growth" ? "Case studies" : titles[k]

const SLUGS: Record<PageKey, string> = {
  about: "about",
  projects: "experience",
  work: "skills-and-stack",
  notes: "notes",
  moodboard: "moodboard",
  upto: "what-im-up-to",
}

const slugOf = (k: PageKey, m: Mode) =>
  k === "moodboard" && m === "growth" ? "case-studies" : SLUGS[k]

function readHash(): { mode: Mode | null; page: PageKey | null } {
  const [m, slug] = window.location.hash.replace("#", "").split("/")
  const mode = m === "growth" || m === "brand" ? m : null
  const page = PAGE_KEYS.find((k) => mode && slugOf(k, mode) === slug) ?? null
  return { mode, page }
}

export default function App() {
  const [mode, setMode] = useState<Mode>(() => readHash().mode ?? "growth")
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState<PageKey | null>(() => readHash().page)
  const mobileHomePosition = useRef<{ page: PageKey; y: number } | null>(null)
  const previousPageRef = useRef(page)
  const casePage = page === "moodboard" && mode === "growth"
  const content = modeCopy[mode]
  const accent = mode === "growth" ? SAPPHIRE : "#E88D6D"
  const tint = (k: PageKey) => content.tints[k] ?? CREAM

  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      if (h.mode) setMode(h.mode)
      setPage(h.page)
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  const open = (k: PageKey) => {
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      mobileHomePosition.current = { page: k, y: window.scrollY }
    }
    window.location.hash = `${mode}/${slugOf(k, mode)}`
  }
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    const previous = history.scrollRestoration
    const update = () => {
      history.scrollRestoration = desktop.matches ? previous : "manual"
    }
    update()
    desktop.addEventListener("change", update)
    return () => {
      desktop.removeEventListener("change", update)
      history.scrollRestoration = previous
    }
  }, [])
  const [, bump] = useState(0)
  useEffect(() => {
    const f = () => bump((n) => n + 1)
    window.addEventListener("backchange", f)
    return () => window.removeEventListener("backchange", f)
  }, [])
  const mobileBack = () => {
    if (backHandler?.()) return
    close()
  }
  const close = () => {
    history.pushState(null, "", `${window.location.pathname}#${mode}`)
    setPage(null)
  }

  const originRef = useRef<DOMRect | null>(null)
  const homeBtn = useRef<HTMLButtonElement>(null)
  const openProps = (k: PageKey) => ({
    homeKey: k,
    onOpen: (e: MouseEvent<HTMLButtonElement>) => {
      originRef.current = e.currentTarget.getBoundingClientRect()
      open(k)
    },
    bg: tint(k),
  })

  useLayoutEffect(() => {
    const previousPage = previousPageRef.current
    previousPageRef.current = page
    const from = originRef.current
    originRef.current = null
    const btn = homeBtn.current
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      if (page) {
        window.scrollTo({ top: 0, behavior: "instant" })
      } else if (previousPage) {
        const card = document.querySelector<HTMLButtonElement>(`[data-home-card="${previousPage}"]`)
        const saved = mobileHomePosition.current
        if (saved?.page === previousPage) {
          window.scrollTo({ top: saved.y, behavior: "instant" })
        } else {
          card?.scrollIntoView({ block: "start", behavior: "instant" })
        }
        card?.focus({ preventScroll: true })
      }
      return
    }
    if (!page || !from || !btn) return
    const color = tint(page)
    if (color === CREAM) return
    const to = btn.getBoundingClientRect()
    const ghost = document.createElement("div")
    Object.assign(ghost.style, {
      position: "fixed",
      zIndex: "30",
      pointerEvents: "none",
      background: color,
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
    })
    document.body.appendChild(ghost)
    const anim = ghost.animate(
      [
        {
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
        },
        {
          left: `${to.left}px`,
          top: `${to.top}px`,
          width: `${to.width}px`,
          height: `${to.height}px`,
        },
      ],
      {
        duration: 650,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        fill: "forwards",
      },
    )
    btn.style.visibility = "hidden"
    const done = () => {
      btn.style.visibility = ""
      ghost.remove()
    }
    anim.onfinish = done
    anim.oncancel = done
    return () => anim.cancel()
  }, [page])

  // Hash navigation needs explicit paths so each portfolio page gets its own view.
  const analyticsPath = `/${mode}${page ? `/${slugOf(page, mode)}` : ""}`

  return (
    <main
      className={`relative bg-[#FAF9F6] text-base text-[#1A1A1A] max-lg:overflow-x-clip lg:h-svh lg:overflow-hidden ${casePage ? "h-svh overflow-hidden" : "lg:min-h-[640px]"}`}
      style={
        {
          "--accent": accent,
          "--wave": mode === "growth" ? SAPPHIRE : BLUE,
          "--grid-line": mode === "growth" ? "#CFCBC4" : "#E5E1DA",
          "--line": mode === "growth" ? SAPPHIRE : PINK,
          "--accent-text": mode === "growth" ? accent : "#1A1A1A",
          "--toggle-bg": CREAM,
          "--toggle-active": mode === "growth" ? accent : PINK,
          "--toggle-active-text": mode === "growth" ? "#fff" : "#1A1A1A",
          "--hl-link": mode === "growth" ? SAPPHIRE : "#2F6FD0",
          "--hl": mode === "growth" ? SAPPHIRE : BLUE,
          "--hl-text": mode === "growth" ? "#fff" : "#1A1A1A",
        } as CSSProperties
      }
    >
      {page && (
        <span
          key={page}
          aria-hidden="true"
          className="open-line pointer-events-none absolute inset-y-0 left-[20%] z-10 hidden -translate-x-1/2 lg:block"
          style={{ width: mode === "growth" ? 2 : 3 }}
        />
      )}
      <section
        aria-label="Portfolio"
        className={`${
          mode === "growth" && !page ? "fade-others " : ""
        }${casePage ? "h-full min-h-0 " : ""}grid grid-cols-1 lg:h-full lg:grid-cols-[20%_repeat(3,minmax(0,1fr))] lg:grid-rows-2`}
      >
        <Card
          ariaLabel="Portrait and portfolio focus"
          padded={false}
          className={`portrait-card relative order-1 min-h-[420px] lg:order-none ${
            page ? "cursor-pointer max-lg:hidden" : ""
          }`}
          onClick={
            page
              ? (e) => {
                  if ((e.target as HTMLElement).closest("button, a")) return
                  if (backHandler?.()) return
                  close()
                }
              : undefined
          }
        >
          <PhotoSlideshow active={page !== null} portrait={content.portrait} />
          <div className="absolute left-5 top-5">
            <div
              className="toggle-group relative grid grid-cols-2 rounded-[6px] border border-[#E5E1DA] p-1"
              role="group"
              aria-label="Choose portfolio focus"
            >
              <span
                aria-hidden="true"
                className="toggle-thumb absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-[3px]"
                style={{
                  transform: mode === "brand" ? "translateX(100%)" : "none",
                }}
              />
              {(["growth", "brand"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={mode === option}
                  onClick={() => {
                    setMode(option)
                    history.replaceState(
                      null,
                      "",
                      `#${option}${page ? `/${slugOf(page, option)}` : ""}`,
                    )
                  }}
                  className={`mode-button relative min-h-8 cursor-pointer rounded-[3px] px-3 text-base font-medium capitalize ${
                    mode === option ? "active" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {page ? (
          <article
            aria-label={pageTitle(page, mode)}
            className={`portfolio-card page-article flex ${casePage ? "h-full min-h-0 overflow-hidden" : "min-h-[60svh] lg:overflow-y-auto"} max-lg:break-words min-w-0 flex-col gap-6 p-6 ${
              page === "moodboard" && mode === "brand"
                ? "lg:overflow-hidden"
                : ""
            } lg:col-span-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:p-10`}
          >
            <div className="sticky top-0 z-30 -mx-6 -mt-6 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--grid-line)] bg-[#FAF9F6] px-4 lg:hidden">
              <button
                type="button"
                onClick={mobileBack}
                className="back-btn min-w-0 truncate"
              >
                <Chev />
                {backLabel || "homepage"}
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close and return to homepage"
                className="flex size-10 shrink-0 items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <header className="-mx-6 flex shrink-0 items-baseline justify-between gap-4 px-6 lg:-mx-10 lg:px-10">
              <div>
                <h1 className="font-heading text-[clamp(30px,3.4vw,48px)] leading-none tracking-[-0.03em]">
                  <button
                    type="button"
                    onClick={close}
                    title="Back to homepage"
                    className="text-left"
                  >
                    {pageTitle(page, mode)}
                  </button>
                </h1>
                {page === "work" && (
                  <p className="mt-3 text-[#1A1A1A]/60">
                    {skillSets[mode].line}
                  </p>
                )}
                {page === "notes" && (
                  <p className="mt-3 text-[#1A1A1A]/60">
                    essays on marketing, writing and the small systems behind
                    good work.
                  </p>
                )}
                {page === "moodboard" && mode === "growth" && (
                  <p className="mt-3 text-[#1A1A1A]/60">
                    growth plans, campaigns and experiments, written up end to
                    end.
                  </p>
                )}
              </div>
              <button
                ref={homeBtn}
                type="button"
                onClick={close}
                style={
                  tint(page) !== CREAM
                    ? { background: tint(page) }
                    : mode === "growth"
                      ? { background: SAPPHIRE, color: "#fff" }
                      : { background: PINK }
                }
                className="min-h-10 shrink-0 px-4 font-medium transition-opacity hover:opacity-80 max-lg:hidden"
              >
                Homepage
              </button>
            </header>
            <PageBody page={page} mode={mode} />
          </article>
        ) : (
          <>
            <Card
              ariaLabel="About"
              className="order-2 lg:order-none"
              {...openProps("about")}
            >
              <CardHeading detail="Rutuja Rochkari">About</CardHeading>
              <div className="mt-6 lg:mt-auto">
                <p className="about-intro font-heading text-[24px] leading-[1.14] tracking-[-0.02em] xl:text-[26px]">
                  {content.intro}
                </p>
                <p className="mt-3 leading-snug text-[#1A1A1A]/65">
                  {mode === "growth"
                    ? "email, paid, creators, and offline."
                    : "copy, content, social, and brand comms."}
                </p>
              </div>
            </Card>

            <Card
              ariaLabel="Experience"
              className="order-3 lg:order-none"
              {...openProps("projects")}
            >
              <CardHeading detail="selected work">Experience</CardHeading>
              <div className="mt-6 lg:mt-auto">
                <ul className="divide-y divide-[#1A1A1A]/15">
                  {jobs.map(([company, title], i) => (
                    <li
                      key={company}
                      className="py-1.5 leading-snug first:pt-0 last:pb-0"
                    >
                      <span className="min-w-0">
                        <span
                          className={`block ${
                            i === 0
                              ? "accent-text font-semibold"
                              : "font-medium"
                          }`}
                        >
                          {company}
                        </span>
                        <span className="block text-[#1A1A1A]/60">{title}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card
              ariaLabel="Notes"
              className="order-6 lg:order-none"
              {...openProps("notes")}
            >
              <CardHeading detail="Writing">Notes</CardHeading>
              <ul className="mt-6 divide-y divide-[#1A1A1A]/15 lg:mt-auto">
                {notes.map((t) => (
                  <li
                    key={t}
                    className="py-2.5 leading-snug first:pt-0 last:pb-0"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}

        <Card
          ariaLabel="Contact"
          className={`order-8 lg:order-none ${page ? "max-lg:hidden" : ""}`}
        >
          <CardHeading detail="Open to work">Contact</CardHeading>
          <div className="mt-6 lg:mt-auto">
            <div className="flex flex-col items-start gap-1">
              <a className="contact-link" href="/resume.pdf" download>
                Resume
              </a>
              <button
                type="button"
                className="contact-link"
                onClick={() => {
                  navigator.clipboard?.writeText("rutujarochkari7@gmail.com")
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 1800)
                }}
              >
                {copied ? "Copied!" : "Email"}
              </button>
              {[
                ["LinkedIn", "https://www.linkedin.com/in/rutuja-rochkari"],
                ["X (Twitter)", "https://x.com/rutzpective"],
                mode === "brand"
                  ? ["Are.na", "https://www.are.na/rutzine"]
                  : ["Cursor", "https://cursor.com/@rutuja"],
                mode === "brand"
                  ? ["macOS site", "https://rutujarochkari.vercel.app/"]
                  : ["GitHub", "https://github.com/rutzonline"],
                ["Cal.com", "https://cal.com/rutujarochkari"],
              ].map(([label, href]) => (
                <a
                  key={`${label}-${href}`}
                  className="contact-link"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </Card>

        {!page && (
          <>
            <Card
              ariaLabel="Skills & stack"
              className={`${
                mode === "brand" ? "order-5" : "order-4"
              } lg:order-none`}
              {...openProps("work")}
            >
              <CardHeading detail="Toolkit">Skills &amp; stack</CardHeading>
              <div className="mt-6 lg:mt-auto">
                <div className="flex flex-wrap gap-2">
                  {skillSets[mode].tags.map((tool) => (
                    <span
                      key={tool}
                      className={`rounded-full border px-3 py-1.5 text-base ${
                        mode === "brand"
                          ? "border-[#8A8A8A]"
                          : "border-[#B3ADA1]"
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
                <p className="mt-4 leading-snug text-[#1A1A1A]/60">
                  {skillSets[mode].line}
                </p>
              </div>
            </Card>

            {mode === "growth" ? (
              <Card
                ariaLabel="Case studies"
                className="order-5 lg:order-none"
                {...openProps("moodboard")}
              >
                <CardHeading detail="conceptual">Case studies</CardHeading>
                <div className="mt-6 lg:mt-auto">
                  <CaseList />
                </div>
              </Card>
            ) : (
              <Card
                ariaLabel="Moodboard"
                className="order-4 lg:order-none"
                {...openProps("moodboard")}
              >
                <CardHeading detail="bookmarks">Moodboard</CardHeading>
                <MoodTitles />
                <p className="mb-1 leading-snug text-[#1A1A1A]/75">
                  {moodText}
                </p>
              </Card>
            )}

            <Card
              ariaLabel="What I'm up to"
              className="order-7 lg:order-none"
              {...openProps("upto")}
            >
              <CardHeading detail="Now">What I&rsquo;m up to</CardHeading>
              <div className="mt-6 lg:mt-auto">
                <Rows items={uptoRows[mode]} />
              </div>
            </Card>
          </>
        )}
      </section>
      <Analytics route={analyticsPath} path={analyticsPath} />
    </main>
  )
}
