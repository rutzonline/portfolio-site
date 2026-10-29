import { toolLogos } from "@/toolLogos"
import { navigate, useDetailRoute, usePathname } from "@/navigation"
import Carousel from "@/Carousel"
import experienceUploads from "@/experienceUploads.json"
import { getCaseVisual } from "@/caseVisuals"
import NameLettering from "@/NameLettering"
import PhotoGallery from "@/PhotoGallery"
import UpToExtras from "@/UpToExtras"
import ConsumptionLog from "@/consumption/ConsumptionLog"
import { growthNotes } from "@/growthNotes"
import { brandNotes } from "@/brandNotes"
import { routePanelWheel } from "@/panelScroll"
import AboutPage, { splitAboutIntro } from "@/AboutPage"
import { Rows, ImageSlot } from "@/ContentComponents"
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
import { statePlateCase } from "@/statePlateCase"
import liq1 from "@/imports/liquide/sample-01.webp"
import liq2 from "@/imports/liquide/sample-02.webp"
import liq3 from "@/imports/liquide/sample-03.webp"
import liq4 from "@/imports/liquide/sample-04.webp"
import liq5 from "@/imports/liquide/sample-05.webp"
import liq6 from "@/imports/liquide/sample-06.webp"
import liq7 from "@/imports/liquide/sample-07.webp"
import liq8 from "@/imports/liquide/sample-08.webp"
import liq9 from "@/imports/liquide/sample-09.webp"
import liq10 from "@/imports/liquide/sample-10.webp"
import stateplateLogo from "@/imports/state-plate-logo.webp"
import freelanceLogo from "@/imports/freelance-logo.webp"
import Moodboard from "@/Moodboard"
import PhotoSlideshow from "@/PhotoSlideshow"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import growthPortrait from "@/imports/growth-portrait.webp"
import contentPortrait from "@/imports/brand-portrait.webp"

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
const PINK = "#ffa9c8"
const LIME = "#DDF080"
const BLUE = "#9EC5F4"
const SAPPHIRE = "#0F3A8A"
const DESKTOP_NAVY = "#0B2D6E"

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
      "i get people to use products. i.e., run experiments across the funnel to optimize user acquisition, activation, and retention.",
    portrait: growthPortrait,
    tints: {} as Partial<Record<PageKey, string>>,
  },
  brand: {
    intro:
      "i write product and lifecycle content. from the first ad someone sees to the email that brings them back.",
    portrait: contentPortrait,
    tints: {
      work: PINK,
      projects: LIME,
      upto: BLUE,
    } as Partial<Record<PageKey, string>>,
  },
}

const notesByMode = { growth: growthNotes, brand: brandNotes }

const skillSets: Record<Mode, {
  tags: string[]
  line: string
  sections: [string, string][]
}> = {
  growth: {
    tags: [
      "Meta Ads Manager",
      "Ahrefs",
      "replit",
      "Shopify",
      "Google Analytics",
      "Supabase",
      "Cursor",
      "posthog",
      "Webflow",
      "clay",
    ],
    line: "Funnels, experiments and lifecycle.",
    sections: [
      ["Lifecycle", "Onboarding, activation loops, and retention programmes."],
      ["Analytics", "Funnel analysis, cohorts, and experiment readouts."],
      ["Strategy", "Positioning, growth models, and experiment roadmaps."],
    ],
  },
  brand: {
    tags: [
      "Figma",
      "Mention",
      "Mailchimp",
      "Canva",
      "Claude",
      "ElevenLabs",
      "Buffer",
      "Notion",
    ],
    line: "Voice, story and personality.",
    sections: [
      ["Narrative", "Brand voice, manifestos, and launch storytelling."],
      ["Content", "Essays, newsletters, and social adaptations."],
      ["Product comms", "Release notes, messaging, and positioning docs."],
    ],
  },
}

const skillDomains: Record<string, string> = {
  ahrefs: "ahrefs.com",
  replit: "replit.com",
  mention: "mention.com",
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
  "Google Analytics": "analytics.google.com",
  Figma: "figma.com",
  Notion: "notion.so",
  Webflow: "webflow.com",
  Canva: "canva.com",
}

const stintDomains = ["", "thestateplate.com", "hopstack.io", "liquide.life"]

function NoteBody({ body }: { body: string }) {
  const inline = (text: string) => text.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={index}>{part.slice(1, -1)}</em> : part,
  )
  return <>{body.split(/\n\n+/).map((block, index) => {
    const lines = block.split("\n")
    return lines.every((line) => line.startsWith("- ")) ? (
      <ul key={index} className="list-disc space-y-2 pl-6 text-base leading-relaxed text-[#1A1A1A]/85">
        {lines.map((line, item) => <li key={item}>{inline(line.slice(2))}</li>)}
      </ul>
    ) : <p key={index} className="whitespace-pre-line text-base leading-relaxed text-[#1A1A1A]/85">{inline(block)}</p>
  })}</>
}

function NotesPage({ mode }: { mode: Mode }) {
  const noteList = notesByMode[mode]
  const [sel, setSel] = useDetailRoute(noteList.map((note) => note.title), `/${mode}/notes`)
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
        <h2 className="case-title leading-[1.15] tracking-[-0.02em]">
          {n.title}
        </h2>
        <NoteBody body={n.body} />
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
              <span className="hidden lg:block"><Chev right /></span>
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
              <span className="w-8 shrink-0 text-[#1A1A1A]/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-tight transition-colors group-hover:text-[color:var(--hl-link)]">
                  {n.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-2xl leading-none text-[color:var(--hl-link)] max-lg:hidden opacity-0 transition-opacity group-hover:opacity-100"
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

function Greeting({ visitorName, onChange, desktop = false }: { visitorName: string; onChange: (name: string) => void; desktop?: boolean }) {
  const nameInput = useRef<HTMLInputElement>(null)
  const resetName = () => {
    onChange("first name")
    requestAnimationFrame(() => {
      nameInput.current?.focus({ preventScroll: true })
      nameInput.current?.setSelectionRange(10, 10)
    })
  }
  return (
<div className="mobile-greeting">hello <span className="greeting-token">{"{{\u00a0"}<span className="greeting-name-wrap" onPointerDown={(event) => {
  if (event.target === nameInput.current) return
  event.preventDefault()
  event.stopPropagation()
  const input = nameInput.current
  input?.focus({ preventScroll: true })
  input?.setSelectionRange(input.value.length, input.value.length)
}}>
                <span className="greeting-name-measure" aria-hidden="true">{visitorName || "\u200b"}</span>
                <input ref={nameInput} aria-label="Your first name" maxLength={11}
                  autoComplete="off" autoCapitalize="words" spellCheck={false} autoFocus={desktop}
                  value={visitorName} className="greeting-name"
                  onFocus={(event) => {
                    event.currentTarget.setSelectionRange(visitorName.length, visitorName.length)
                  }}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (!visitorName.trim()) resetName()
                  }}
                  onDoubleClick={(event) => { event.preventDefault(); event.stopPropagation(); resetName() }}
                  onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); resetName() } }}
                  onBlur={() => { if (!visitorName.trim()) onChange("first name") }}
                  onSelect={(event) => {
                    const input = event.currentTarget
                    if (!desktop && (input.selectionStart !== input.value.length || input.selectionEnd !== input.value.length))
                      input.setSelectionRange(input.value.length, input.value.length)
                  }}
                  onChange={(event) => {
                    const name = event.target.value.slice(0, 11)
                    onChange(name)
                  }}
                /><span className="greeting-cursor" aria-hidden="true" />
              </span>{"\u00a0}}"}</span></div>
  )
}

const typedIntros = new Set<string>()

function Typewriter({ text }: { text: string }) {
  const [animate] = useState(() => !typedIntros.has(text))
  const [count, setCount] = useState(() => !animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 0)
  useEffect(() => {
    typedIntros.add(text)
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length)
      return
    }
    setCount(0)
    let interval: number | undefined
    const delay = window.setTimeout(() => {
      let next = 0
      interval = window.setInterval(() => {
        next += 1
        setCount(next)
        if (next >= text.length) window.clearInterval(interval)
      }, 48)
    }, 150)
    return () => { window.clearTimeout(delay); window.clearInterval(interval) }
  }, [text, animate])
  return <span className="inline-grid">
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" className="invisible col-start-1 row-start-1">{text}</span>
    <span aria-hidden="true" data-typewriter className="col-start-1 row-start-1">{text.slice(0, count)}</span>
  </span>
}

function CardHeading({
  children,
  detail,
  detailClassName,
}: {
  children: ReactNode
  detail?: ReactNode
  detailClassName?: string
}) {
  return (
    <header className="card-heading flex shrink-0 items-baseline justify-between gap-3">
      <h2 className="card-title font-heading text-[22px] leading-none tracking-[-0.02em]">
        {children}
        <svg className="pencil-underline" viewBox="0 0 200 8" preserveAspectRatio="none" aria-hidden="true" focusable="false" fill="none">
          <path pathLength="1" d="M1 4.6 C24 3.1 41 5.2 64 4.1 S105 3.4 129 4.2 S171 3.1 199 3.7" />
          <path pathLength="1" d="M2 5.6 C29 4.9 44 5.9 68 5 S110 4.5 133 5.1 S176 4.4 198 4.8" />
        </svg>
      </h2>
      {detail && (
        <span className={`text-right text-base ${detailClassName ?? "text-[#1A1A1A]/65"}`}>{detail}</span>
      )}
    </header>
  )
}

function Section({ title, children, divider = true }: { title: string; children: ReactNode; divider?: boolean }) {
  return (
    <section className={divider ? "border-t border-[#1A1A1A]/15 pt-4" : undefined}>
      <h3 className="mb-2 text-base font-semibold">{title}</h3>
      <div className="leading-snug text-[#1A1A1A]/75">{children}</div>
    </section>
  )
}

const experienceSamples: Record<string, { src: string; caption: string; wide?: boolean }[]> = {
  hopstack: [
    { src: "/work-samples/hopstack-after.webp", caption: "LinkedIn rebrand · after" },
    { src: "/work-samples/hopstack-ecommerce.webp", caption: "LinkedIn content · e-commerce tools" },
    { src: "/work-samples/hopstack-newsletter.webp", caption: "Proposed newsletter format", wide: true },
  ],
  "freelance marketer": [
    { src: "/work-samples/freelance-food.webp", caption: "Freelance hospitality creative 1" },
    { src: "/work-samples/freelance-04.webp", caption: "Freelance hospitality creative 2" },
    { src: "/work-samples/freelance-05.webp", caption: "Freelance hospitality creative 3" },
    { src: "/work-samples/freelance-cocktails.webp", caption: "Freelance hospitality creative 4" },
    { src: "/work-samples/freelance-monday.webp", caption: "Freelance hospitality creative 5" },
    { src: "/work-samples/freelance-08.webp", caption: "Freelance hospitality creative 6" },
    { src: "/work-samples/freelance-09.webp", caption: "Freelance hospitality creative 7" },
    { src: "/work-samples/freelance-10.webp", caption: "Freelance hospitality creative 8" },
    { src: "/work-samples/freelance-11.webp", caption: "Freelance hospitality creative 9" },
    { src: "/work-samples/freelance-12.webp", caption: "Freelance hospitality creative 10" },
    { src: "/work-samples/freelance-13.webp", caption: "Freelance hospitality creative 11" },
    { src: "/work-samples/freelance-14.webp", caption: "Freelance hospitality creative 12" },
    { src: "/work-samples/freelance-15.webp", caption: "Freelance hospitality creative 13" },
    { src: "/work-samples/freelance-16.webp", caption: "Freelance hospitality creative 14" },
    { src: "/work-samples/freelance-jazz.webp", caption: "Freelance hospitality creative 15" },
    { src: "/work-samples/freelance-18.webp", caption: "Freelance hospitality creative 16" },
    { src: "/work-samples/freelance-19.webp", caption: "Freelance hospitality creative 17" },
    { src: "/work-samples/freelance-signature.webp", caption: "Freelance hospitality creative 18" },
    { src: "/work-samples/freelance-21.webp", caption: "Freelance hospitality creative 19" },
    { src: "/work-samples/freelance-22.webp", caption: "Freelance hospitality creative 20" },
    { src: "/work-samples/freelance-tuesday.webp", caption: "Freelance hospitality creative 21" },
  ],
}

const liquideCaptions = [
  "LiMo campaign · investment research",
  "LiMo campaign · monsoon creative",
  "LiMo campaign · market volatility",
  "LiMo campaign · investing today",
  "Social content · brand identity",
  "Social content · finance education",
  "Social content · audience storytelling",
  "Social content · revised visual identity",
  "Social content · product and investing",
  "Instagram rebrand · before",
  "Instagram rebrand · after",
]

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
  "/image.png",
  liq10,
]

const liquideDid = [
  "Built the Instagram strategy and content calendar",
  "Defined content formats (posts, carousels, reels, explainers)",
  "Wrote scripts and copy that explained finance concepts in plain language",
  "Managed designers, content writers, and creators end to end",
  "Initiated and co-led the rebranding strategy",
  "Wrote the copy and edited the app-launch video",
  "Identified and contacted LinkedIn creators for the LiMo chatbot launch",
  "Secured creator collaborations on minimal spend and created campaign guidelines",
  "Designed OOH-style visuals to support creator posts and managed the campaign end to end",
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
    jobs[i][0] === "liquide" ? [...liquideDid, ...st.points] : st.points
  return `## 01. overview\n\n${st.summary}\n\n${st.body.join("\n")}\n\n## 02. what i worked on\n\n${did.map((p) => `- ${p}`).join("\n")}\n`
}

function Experience({ mode }: { mode: Mode }) {
  const [sel, setSel] = useDetailRoute(jobs.map(([company]) => company), `/${mode}/experience`)
  useBack(sel !== null ? () => { setSel(null); return true } : null, "experience")
  if (sel === null) return (
    <div className="-mx-6 mt-4 min-h-0 overflow-y-auto overscroll-contain lg:-mx-10 lg:mt-6">
      <ul className="border-y border-[#1A1A1A]/15">
        {jobs.map(([company], i) => (
          <li key={company} className="border-b border-[#1A1A1A]/15 last:border-b-0">
            <button type="button" onClick={() => setSel(i)} className="group flex w-full items-center gap-4 px-6 py-5 text-left lg:px-10">
              <Logo domain={stintDomains[i]} src={stintLogo(company)} name={company} size="size-10" />
              <span className="min-w-0 flex-1">
                <span className="block text-[17px] font-semibold leading-tight group-hover:text-[color:var(--hl-link)]">{company}</span>
                <span className="mt-0.5 block text-[#1A1A1A]/60">{jobs[i][1]}</span>
              </span>
              <span className="hidden lg:block"><Chev right /></span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
  const company = jobs[sel][0]
  const freelance = company === "freelance marketer"
  const uploads = experienceUploads[company as keyof typeof experienceUploads] ?? []
  return (
    <div data-essay className="-mr-6 -mt-6 flex min-h-0 flex-1 flex-col overflow-hidden lg:-mr-10">
      <CaseStudy
        independentScroll
        isExperience
        backControl={<button type="button" onClick={() => setSel(null)} className="back-btn"><Chev />all experience</button>}
        md={company === "the state plate" ? statePlateCase : stintMd(sel)}
        header={<CaseHeader name={company} sub={jobs[sel][1]} domain={stintDomains[sel]} src={stintLogo(company)} />}
        footer={(
          <section className="mt-10" aria-label="Selected work">
            <h3 className="mb-4 text-lg font-semibold">selected work</h3>
            <div className="space-y-12">
              {uploads.map((sample) => (
                <section key={sample.title} aria-label={sample.title} className="space-y-4">
                  {sample.images.length > 1 ? (
                    <Carousel label={sample.title} slides={sample.images.map((src, i) => (
                      <ImageSlot expandable key={src} src={src} alt={`${sample.title} — slide ${i + 1}`} fit="contain" />
                    ))} />
                  ) : (
                    <ImageSlot expandable src={sample.images[0]} alt={sample.title} fit="contain" />
                  )}
                </section>
              ))}
              {experienceSamples[company] && (
                <section aria-label="Selected work samples" className="space-y-4">
                  <div className={`grid grid-cols-2 gap-3 sm:gap-5 ${freelance ? "sm:grid-cols-3" : ""}`}>
                    {experienceSamples[company].map((sample) => (
                      <figure key={sample.src} className={sample.wide ? "col-span-2" : undefined}>
                        <ImageSlot expandable src={sample.src} alt={sample.caption} fit="contain" />
                      </figure>
                    ))}
                  </div>
                </section>
              )}
              {freelance && (
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold">content & social media pitch deck</h3>
                  <Carousel label="Content and social media pitch deck" slides={Array.from({ length: 15 }, (_, i) => (
                    <ImageSlot expandable key={i} src={`/work-samples/content-sm-deck/${i + 1}.png`} alt={`Content and social media pitch deck — slide ${i + 1}`} fit="contain" />
                  ))} />
                </section>
              )}
              {company === "liquide" && (
                <section aria-label="Liquide work samples" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-5">
                    {liquideImages.slice(0, 9).map((src, k) => (
                      <figure key={src}>
                        <ImageSlot expandable src={src} alt={liquideCaptions[k]} fit="contain" />
                      </figure>
                    ))}
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      aria-label="Liquide app launch video — copywriting and editing"
                      poster="/media/liquide-video-poster.webp"
                      className="w-full rounded-sm bg-black"
                    >
                      <source src="/work-samples/liquide/app-launch.mp4" type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-5" aria-label="Instagram rebrand comparison">
                    {liquideImages.slice(9).map((src, k) => <figure key={src}>
                      <ImageSlot expandable src={src} alt={liquideCaptions[k + 9]} fit="contain" />
                      <figcaption className="mt-2 text-sm text-[#1A1A1A]/60">{k === 0 ? "Before →" : "After →"}</figcaption>
                    </figure>)}
                  </div>
                </section>
              )}
            </div>
          </section>
        )}
      />
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
    ["Writing", "letterboxd reviews"],
  ],
}

function PageBody({ page, mode, onOpenPhotos, photosOpen }: { page: PageKey; mode: Mode; onOpenPhotos: (element: HTMLButtonElement) => void; photosOpen: boolean }) {
  switch (page) {
    case "about":
      return <AboutPage mode={mode} />
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
                  src={toolLogos[t.toLowerCase()]}
                  domain={skillDomains[t] ?? skillDomains[t.toLowerCase()]}
                  name={t}
                  size="size-6"
                />
                {t}
              </span>
            ))}
          </div>
          <div className="flex max-w-3xl flex-col gap-8 pt-10">
            {skillSets[mode].sections.map(([t, d]) => (
              <Section key={t} title={t} divider={false}>
                {d}
              </Section>
            ))}
          </div>
        </>
      )
    case "notes":
      return <NotesPage key={mode} mode={mode} />
    case "projects":
      return <Experience mode={mode} />
    case "moodboard":
      return mode === "growth" ? <CasesPage mode={mode} /> : <Moodboard />
    case "upto":
      return (
        <div className={`upto-page w-full pt-2 ${mode === "growth" ? "growth-upto" : ""}`}>
          <Rows
            items={uptoRows[mode]}
          />
          {mode === "brand" ? <UpToExtras onOpenPhotos={onOpenPhotos} photosOpen={photosOpen} /> : <ConsumptionLog />}
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
    <ul className="case-list divide-y divide-[#1A1A1A]/15">
      {cases.map(([name, sub]) => (
        <li
          key={name}
          className="group py-1.5 leading-snug first:pt-0 last:pb-0"
        >
          <span className="block text-[16px] font-medium transition-colors group-hover:text-[color:var(--accent-text)]">
            {name}
          </span>
          <span className="case-subtitle block text-[14px] text-[#1A1A1A]/60">{sub}</span>
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
        <h2 className="case-title leading-[1.15] tracking-[-0.02em]">
          {name}
        </h2>
        <p className="mt-1 text-[#1A1A1A]/60">{sub}</p>
      </div>
    </div>
  )
}

function CaseStudy({
  md,
  visualKey,
  header,
  footer,
  independentScroll = false,
  isExperience = false,
  backControl,
}: {
  md: string
  visualKey?: string
  header?: ReactNode
  footer?: ReactNode
  independentScroll?: boolean
  isExperience?: boolean
  backControl?: ReactNode
}) {
  const [active, setActive] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const toc: [string, string][] = []
  const usedVisuals = new Set<string>()
  let imgDue: string | null = null
  const lines = md.split("\n")
  const out: ReactNode[] = []
  const sources: string[] = []
  let inSources = false
  const hasSummary = !isExperience && /^tl;dr\s*$/im.test(md)
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    if (!l.trim() || l.trim() === "---") {
      i++
    } else if (l.startsWith("# ")) {
      out.push(
        <h2
          key={i}
          className="font-body-light text-[clamp(22px,2.2vw,30px)] leading-tight tracking-[-0.02em]"
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
            className={`${hasSummary && toc.length === 1 ? "mt-0" : "mt-10"} flex scroll-mt-6 items-baseline gap-3 border-t border-[#1A1A1A]/15 pt-6 font-heading text-[clamp(22px,2.2vw,30px)] tracking-[-0.02em] first:mt-0 first:border-t-0 first:pt-0`}
          >
            {m && <span className="text-[#1A1A1A]/60">{m[1]}</span>}
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
        <div key={i} className="overflow-x-auto">
          <table className="w-full border-collapse text-left max-lg:text-sm min-w-[520px]">
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
          className={`leading-snug ${hasSummary && /^tl;dr$/i.test(l.trim()) ? "mt-10" : ""} ${
            em ? "text-[#1A1A1A]/60" : "text-[#1A1A1A]/85"
          }`}
        >
          <Inline text={l} />
        </p>,
      )
      const visual = imgDue ? getCaseVisual(md, imgDue, visualKey) : null
      if (imgDue && visual && !usedVisuals.has(visual.src)) {
        usedVisuals.add(visual.src)
        out.push(
          <figure key={`img-${i}`} className="my-2">
            <ImageSlot expandable src={visual.src} alt={visual.alt} fit="contain" />
            {!isExperience && <figcaption className="mt-1.5 text-sm text-[#1A1A1A]/60">
              {visual.source ? <a href={visual.source} target="_blank" rel="noreferrer" className="contact-link">{visual.caption} ↗</a> : visual.caption}
            </figcaption>}
          </figure>,
        )
      }
      if (visual) imgDue = null
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
          className={`panel-menu hidden self-start lg:block ${independentScroll ? "max-h-full overflow-y-auto overscroll-contain pt-6" : "lg:sticky lg:top-6"}`}
        >
          {backControl && <div className="mb-6">{backControl}</div>}
          <ul className="flex flex-col gap-2">
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
                      : "text-[#1A1A1A]/60"
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
        data-panel-content={independentScroll ? "" : undefined}
        role={independentScroll ? "region" : undefined}
        aria-label={independentScroll ? "Case study content" : undefined}
        tabIndex={independentScroll ? 0 : undefined}
        className={`min-w-0 ${independentScroll ? "min-h-0 overflow-y-auto overscroll-contain" : ""}`}
      >
        <div className={`flex max-w-[44rem] flex-col gap-4 ${independentScroll ? "mr-6 pb-6 pr-3 pt-6 lg:mr-10 lg:pt-[88px]" : ""}`}>
          {header}
          {out}
          {footer}
          {sources.length > 0 && (
            <footer className="mt-10 border-t border-[#1A1A1A]/15 pt-4 text-sm text-[#1A1A1A]/60">
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
  const [open, setOpen] = useDetailRoute(cases.map(([name]) => name), `/${mode}/case-studies`)
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
            visualKey={name === "wispr flow" ? "wispr" : name}
            header={<CaseHeader name={name} sub={sub} domain={domain} />}
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
                <span className="mt-0.5 line-clamp-2 text-[#1A1A1A]/60">{sub}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-2xl leading-none text-[color:var(--hl-link)] max-lg:hidden opacity-0 transition-opacity group-hover:opacity-100"
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

function readRoute(path: string): { mode: Mode | null; page: PageKey | null } {
  const [m, slug] = path.slice(1).split("/")
  const mode = m === "growth" || m === "brand" ? m : null
  const page = PAGE_KEYS.find((k) => mode && slugOf(k, mode) === slug) ?? null
  return { mode, page }
}

export default function App() {
  const pathname = usePathname()
  const route = readRoute(pathname)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches)
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)")
    const update = () => setIsMobile(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  useEffect(() => {
    // Have both covers decoded before the first focus toggle.
    for (const src of [growthPortrait, contentPortrait]) {
      const image = new Image()
      image.src = src
      image.decode().catch(() => {})
    }
  }, [])
  const mode = route.mode ?? "growth"
  const [visitorName, setVisitorName] = useState("first name")
  const galleryOpen = pathname.endsWith("/photos") && (isMobile || pathname === "/brand/what-im-up-to/photos")
  const [galleryOrigin, setGalleryOrigin] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const page = route.page
  const hasDetail = Boolean(pathname.split("/")[3]) && (page === "notes" || page === "projects" || (page === "moodboard" && mode === "growth"))
  const mobileHomePosition = useRef<{ page: PageKey; y: number } | null>(null)
  const previousPageRef = useRef(page)
  const casePage = page === "moodboard" && mode === "growth"
  const independentPage = casePage || page === "projects" || page === "about" || page === "upto"
  const content = modeCopy[mode]
  const aboutIntro = splitAboutIntro(content.intro, mode)
  const accent = mode === "growth" ? (isMobile ? SAPPHIRE : DESKTOP_NAVY) : "#E88D6D"
  const tint = (k: PageKey) => isMobile && mode === "brand"
    ? ({ projects: BLUE, work: LIME, upto: PINK } as Partial<Record<PageKey, string>>)[k] ?? CREAM
    : content.tints[k] ?? CREAM

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".page-article")
    if (!article) return
    const onWheel = (event: WheelEvent) => routePanelWheel(event, article)
    article.addEventListener("wheel", onWheel, { passive: false })
    return () => article.removeEventListener("wheel", onWheel)
  }, [page, mode])

  const open = (k: PageKey) => {
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      mobileHomePosition.current = { page: k, y: window.scrollY }
    }
    navigate(`/${mode}/${slugOf(k, mode)}`)
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
    navigate(`/${mode}`)
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

  const homeScrollCleanup = useRef<(() => void) | null>(null)
  useEffect(() => () => homeScrollCleanup.current?.(), [page])
  const scrollHomeToTop = () => {
    homeScrollCleanup.current?.()
    const start = window.scrollY
    if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: 0, behavior: "instant" })
      return
    }
    let frame = 0
    let started: number | null = null
    const finish = () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointerdown", finish)
      window.removeEventListener("touchstart", finish)
      window.removeEventListener("wheel", finish)
      homeScrollCleanup.current = null
    }
    const tick = (time: number) => {
      started ??= time
      const progress = Math.min(1, (time - started) / 450)
      window.scrollTo({ top: start * Math.pow(1 - progress, 3), behavior: "instant" })
      if (progress < 1) frame = requestAnimationFrame(tick)
      else finish()
    }
    homeScrollCleanup.current = finish
    window.addEventListener("pointerdown", finish, { passive: true })
    window.addEventListener("touchstart", finish, { passive: true })
    window.addEventListener("wheel", finish, { passive: true })
    frame = requestAnimationFrame(tick)
  }
  const focusControls = (
    <div className="focus-controls px-6 pt-6 lg:absolute lg:left-5 lg:top-5 lg:p-0">
      {isMobile && !page && <button type="button" className="mobile-scroll-top" onClick={scrollHomeToTop} aria-label="Back to top" />}
      <button type="button" role="switch" aria-checked={mode === "brand"} aria-label="Brand mode" aria-describedby="mode-switch-tooltip"
        className="mode-switch" onClick={() => {
          const nextMode = mode === "growth" ? "brand" : "growth"
          navigate(`/${nextMode}${page ? `/${slugOf(page, nextMode)}` : ""}`, true)
          if (isMobile && !page) scrollHomeToTop()
        }}>
        <span className="mode-toggle" aria-hidden="true">
          <span className="toggle-thumb" style={{ transform: mode === "brand" ? "translateX(100%)" : "none" }}>
            {isMobile ? <img src={`/${mode}.png`} alt="" width="32" height="32" /> :
              (["growth", "brand"] as const).map(iconMode => (
                <img key={iconMode} src={`/${iconMode}.png`} alt="" width="32" height="32"
                  loading="eager" decoding="sync" className="desktop-mode-icon"
                  style={{ opacity: mode === iconMode ? 1 : 0 }} />
              ))}
          </span>
        </span>
        <span id="mode-switch-tooltip" role="tooltip" className="mode-switch-label">
          switch to {mode === "growth" ? "brand" : "growth"} mode
        </span>
      </button>
    </div>
  )

  // Track the active mode and page.
  const analyticsPath = `/${mode}${page ? `/${slugOf(page, mode)}` : ""}`

  return (
    <main
      data-mode={mode}
      className={`relative bg-[#FAF9F6] text-base text-[#1A1A1A] max-lg:overflow-x-clip lg:h-svh lg:overflow-hidden ${independentPage ? "h-svh overflow-hidden" : "lg:min-h-[640px]"}`}
      style={
        {
          "--accent": accent,
          "--wave": mode === "growth" ? SAPPHIRE : BLUE,
          "--grid-line": mode === "growth" ? "#CFCBC4" : "#E5E1DA",
          "--line": mode === "growth" ? accent : "#7d2e4b",
          "--accent-text": mode === "growth" ? accent : "#1A1A1A",
          "--toggle-bg": CREAM,
          "--toggle-active": mode === "growth" ? accent : PINK,
          "--toggle-active-text": mode === "growth" ? "#fff" : "#1A1A1A",
          "--hl-link": mode === "growth" ? accent : "#2F6FD0",
          "--hl": mode === "growth" ? accent : BLUE,
          "--hl-text": mode === "growth" ? "#fff" : "#1A1A1A",
        } as CSSProperties
      }
    >
      {galleryOpen && <PhotoGallery origin={galleryOrigin} immersive={page === "upto" && mode === "brand"} onClose={() => navigate(page === "upto" ? `/${mode}/what-im-up-to` : `/${mode}`, true)} />}
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
        }${independentPage ? "h-full min-h-0 " : ""}grid grid-cols-1 lg:h-full lg:grid-cols-[20%_repeat(3,minmax(0,1fr))] lg:grid-rows-2`}
      >
        {isMobile && !page && focusControls}
        <Card
          ariaLabel="Portfolio focus"
          padded={false}
          className={`portrait-card relative order-1 lg:order-none ${
            page ? "cursor-pointer max-lg:hidden" : ""
          }`}
          onClick={
            page
              ? (e) => {
                  if ((e.target as HTMLElement).closest("button, a")) return
                  close()
                }
              : undefined
          }
        >
          {!isMobile && <PhotoSlideshow active={page !== null} portrait={content.portrait}
            onReturnHome={page ? close : undefined} />}
          {!isMobile && focusControls}
          <div className={`mobile-identity px-6 pb-7 pt-7 lg:hidden ${mode === "brand" ? "mobile-brand-identity" : ""}`}>
            <div className="mobile-greeting-row mb-1 flex items-center justify-between gap-3">
              <Greeting visitorName={visitorName} onChange={setVisitorName} />
              <button type="button" onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                setGalleryOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
                navigate(`/${mode}/photos`)
              }}
                aria-label="Open photo gallery" aria-haspopup="dialog" className="photo-folder-button shrink-0">
                <img src="/media/photo-folder.webp" alt="" className={`h-full w-full object-contain ${galleryOpen ? "opacity-0" : ""}`} />
              </button>
            </div>
            <h1 className="mobile-name" style={mode === "brand" ? { color: "#7d2e4b" } : undefined}><span className="sr-only">i’m rutuja</span><NameLettering /></h1>

          </div>
        </Card>

        {page ? (
          <article
            aria-label={pageTitle(page, mode)}
            data-page={page}
            className={`portfolio-card page-article flex ${independentPage ? "h-full min-h-0 overflow-hidden" : "min-h-[60svh] lg:overflow-y-auto"} max-lg:break-words min-w-0 flex-col gap-6 p-6 ${
              page === "moodboard" && mode === "brand"
                ? "lg:overflow-hidden"
                : ""
            } lg:col-span-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-0 lg:p-10`}
          >
            <div className="mobile-page-nav sticky top-0 z-30 -mx-6 -mt-6 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--grid-line)] bg-[#FAF9F6] px-6 py-2 lg:hidden">
              <button
                type="button"
                onClick={mobileBack}
                className="back-btn min-h-11 min-w-0 truncate"
              >
                <Chev />
                {hasDetail || backLabel ? "Back" : "homepage"}
              </button>
              {(hasDetail || backLabel) && <button
                type="button"
                onClick={close}
                aria-label="Return to homepage"
                className="min-h-11 shrink-0 rounded-md border border-[var(--grid-line)] px-3 text-sm font-medium"
              >
                home
              </button>}
            </div>
            <header className={`-mx-6 flex shrink-0 items-baseline justify-between gap-4 px-6 lg:-mx-10 lg:px-10 ${page === "about" ? "about-page-header" : ""}`}>
              <div>
                <h1 className="page-title leading-[1.15] tracking-[-0.02em]">
                  {isMobile ? pageTitle(page, mode) : <button
                    type="button"
                    onClick={close}
                    title="Back to homepage"
                    className="text-left"
                  >
                    {pageTitle(page, mode)}
                  </button>}
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
                      ? { background: accent, color: "#fff" }
                      : { background: PINK }
                }
                className="min-h-10 shrink-0 px-4 font-medium transition-opacity hover:opacity-80 max-lg:hidden"
              >
                Homepage
              </button>
            </header>
            <PageBody page={page} mode={mode} photosOpen={galleryOpen} onOpenPhotos={(element) => {
              const rect = (element.querySelector("img") ?? element).getBoundingClientRect()
              setGalleryOrigin({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
              navigate("/brand/what-im-up-to/photos")
            }} />
          </article>
        ) : (
          <>
            <Card
              ariaLabel="About"
              className={`mobile-about-card desktop-about-card relative order-2 lg:order-none ${isMobile ? "" : "card-link"}`}
              bg={tint("about")}
            >
              {!isMobile && <>
                <button type="button" aria-label="Open About" data-home-card="about"
                  className="absolute inset-0 z-[1] cursor-pointer" onClick={() => open("about")} />
                <span className="desktop-mode-label">{mode}</span>
                <div className="desktop-about-identity">
                  <Greeting key={mode} visitorName={visitorName} onChange={setVisitorName} desktop />
                  <h2 className="mobile-name" style={mode === "brand" ? { color: "#7d2e4b" } : undefined}><span className="sr-only">i’m rutuja</span><NameLettering /></h2>
                </div>
              </>}
              <div className={`mobile-about-copy ${mode === "brand" ? "mobile-brand-copy" : ""}`}>
                {mode === "growth" ? <>
                  <p className="mobile-growth-lead mb-5 text-base font-normal leading-snug text-[#1A1A1A]/65">
                    {aboutIntro.explanation?.replace(/^i\.e\., run/, "i run")}
                  </p>
                  <p className="about-intro"><Typewriter key={mode} text={`i.e., ${aboutIntro.main}`} /></p>
                </> : <p className="about-intro font-semibold text-[20px] leading-[1.14] tracking-[-0.02em] xl:text-[22px]">
                  <Typewriter key={mode} text={aboutIntro.main} />
                  {aboutIntro.explanation && <span className="about-explanation mt-2 block text-[20px] font-semibold opacity-50 xl:text-[22px]">{aboutIntro.explanation}</span>}
                </p>}
                <p className="mobile-specialties mt-3 leading-snug text-[#1A1A1A]/65">
                    {mode === "growth"
                      ? "email, paid, creators, and offline"
                      : "copy, content, social, and brand comms"}
                </p>
              </div>
            </Card>

            <Card
              ariaLabel="Experience"
              className="experience-card order-3 lg:order-none"
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
                {notesByMode[mode].map(({ title: t }) => (
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
          className={`contact-card order-8 lg:order-none ${page ? "max-lg:hidden" : ""}`}
        >
          <CardHeading detail={"Open to work"}>Contact</CardHeading>
          <div className="mt-6 lg:mt-auto">
            <div className="flex flex-col items-start gap-1">
              <a className="contact-link" href="https://drive.google.com/file/d/1ncwgmvXZ8XSxs49LZgxki_QWY0UI6uRy/view?usp=sharing" target="_blank" rel="noopener noreferrer">
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
                  ? ["Are.na", "https://www.are.na/rutz-r"]
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
              className={`skills-card ${
                mode === "brand" ? "order-5" : "order-4"
              } lg:order-none`}
              {...openProps("work")}
            >
              <CardHeading detail="Toolkit">Skills &amp; stack</CardHeading>
              <div className="mt-6 lg:mt-auto">
                <div className="skills-tags relative -left-0.5 -top-1 flex flex-wrap gap-2">
                  {skillSets[mode].tags.map((tool) => (
                    <span
                      key={tool}
                      className={`rounded-full border px-3 py-1.5 text-base ${
                        mode === "brand"
                          ? "border-[#8A8A8A] lg:border-[#7d2e4b]/45"
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
              className="upto-card order-7 lg:order-none"
              {...openProps("upto")}
            >
              <CardHeading detail="Now">What I&rsquo;m up to</CardHeading>
              <div className="mt-8 w-full lg:mt-auto lg:pt-8">
                <Rows items={uptoRows[mode]} />
              </div>
            </Card>
          </>
        )}
      </section>
      <Analytics route={analyticsPath} path={analyticsPath} />
      <SpeedInsights
        route={analyticsPath}
        configString={import.meta.env.VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG}
      />
    </main>
  )
}
