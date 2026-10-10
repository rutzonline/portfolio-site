import { useState, type CSSProperties, type ReactNode } from "react"
import { useMoodboard } from "@/useMoodboard"

const ph = (label: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="#F0EEEA"/><text x="400" y="255" font-family="Inter,sans-serif" font-size="26" fill="#8A8A8A" text-anchor="middle">${label.replace(/&/g, "&amp;")}</text></svg>`,
  )

const Img = ({
  src,
  alt,
  className = "",
}: {
  src?: string
  alt: string
  className?: string
}) => (
  <img
    src={src || ph(alt)}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={`w-full ${className.includes("object-contain") ? "object-contain" : "object-cover"} ${className}`}
  />
)

const Link = ({
  href,
  children,
  className = "",
}: {
  href?: string
  children: ReactNode
  className?: string
}) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  )

const card = "overflow-hidden rounded-xl border border-[#E5E1DA] bg-white"
const siteCard = card.replace("border-[#E5E1DA]", "border-[#B8B3AA]")

const dotColors = ["#FF9FC0", "#DDF080", "#E88D6D", "#9EC5F4", "#0F3A8A"]

function Loading() {
  return (
    <div
      role="status"
      aria-label="loading"
      className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2"
    >
      {dotColors.map((c, i) => (
        <span
          key={c}
          className="wave-dot size-2.5 rounded-full"
          style={{ background: c, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  )
}

function State({ status, count }: { status: string; count: number }) {
  if (status === "loading") return <Loading />
  if (status === "error")
    return (
      <p className="text-[#1A1A1A]/50">
        couldn&rsquo;t load this section right now.
      </p>
    )
  return count === 0 ? (
    <p className="text-[#1A1A1A]/50">nothing here yet.</p>
  ) : null
}

function Intro({ children }: { children: ReactNode }) {
  return <p className="mb-5 text-[#1A1A1A]/70">{children}</p>
}

function Sites() {
  const { rows, status } = useMoodboard("sites")
  return (
    <>
      <Intro>cool websites on the internet</Intro>
      <State status={status} count={rows.length} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <li key={r.name}>
            <Link href={r.url} className={`${siteCard} block`}>
              <Img src={r.image_url} alt={r.name} className="aspect-[16/9]" />
              <p className="px-3 py-2 text-sm font-medium">{r.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

function Brands() {
  const { rows, status } = useMoodboard("brands")
  return (
    <>
      <Intro>why i probably won&rsquo;t skip them on my feed</Intro>
      <State status={status} count={rows.length} />
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((brand) => (
          <li key={brand.name}>
            <article className={`${card} h-full p-4 text-sm leading-snug`}>
              <header className="flex items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-[#E5E1DA] bg-[#F0EEEA]">
                  <Img src={brand.logo_url} alt="" className="aspect-square" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">{brand.name}</h3>
                  <span className="mt-1 inline-block rounded-md bg-[#DDF080] px-2 py-0.5 text-xs font-semibold text-[#1A1A1A]">{brand.group}</span>
                </div>
              </header>
              <p className="mt-3 whitespace-pre-line text-[#1A1A1A]/60">{brand.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </>
  )
}

function Campaigns() {
  const { rows, status } = useMoodboard("campaigns")
  const [index, setIndex] = useState(0)
  const campaign = rows[index]
  const arrow = "flex size-9 items-center justify-center rounded-full border border-[#B8B3AA] transition-colors hover:border-[#1A1A1A] disabled:cursor-default disabled:opacity-30"
  return (
    <section className="flex flex-col lg:min-h-full">
      <Intro>my content marketing hall of fame</Intro>
      <State status={status} count={rows.length} />
      {campaign && <div className="flex flex-1 items-center py-6 lg:py-8">
        <div className="mx-auto grid w-full max-w-[64rem] items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0" tabIndex={0} aria-label="Campaign navigation"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); setIndex(Math.max(0, index - 1)) }
              if (event.key === "ArrowRight") { event.preventDefault(); setIndex(Math.min(rows.length - 1, index + 1)) }
            }}>
            <div className="aspect-[16/9] overflow-hidden rounded-[24px] border border-[#D6D1C9] bg-[#F0EEEA] shadow-sm">
              <Img src={campaign.image_url} alt={campaign.brand} className="h-full object-cover" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button type="button" aria-label="Previous campaign" disabled={index === 0} onClick={() => setIndex(index - 1)} className={arrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m13 7-5 5 5 5M8 12h10" /></svg>
              </button>
              <p className="text-sm tabular-nums text-[#1A1A1A]/55">{index + 1} / {rows.length}</p>
              <button type="button" aria-label="Next campaign" disabled={index === rows.length - 1} onClick={() => setIndex(index + 1)} className={arrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m11 7 5 5-5 5M6 12h10" /></svg>
              </button>
            </div>
          </div>
          <article className="min-w-0 lg:pb-12" aria-live="polite" aria-atomic="true">
            <p className="mb-1 text-sm text-[#1A1A1A]/55">{campaign.kicker}</p>
            <h3 className="mb-3 text-lg font-semibold">{campaign.brand}</h3>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-[#1A1A1A]/75">{campaign.description}</p>
          </article>
        </div>
      </div>}
    </section>
  )
}

function Newsletters() {
  const { rows, status } = useMoodboard("newsletters")
  return (
    <>
      <Intro>happily subscribed to</Intro>
      <State status={status} count={rows.length} />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <li key={r.title}>
            <Link
              href={r.url}
              className={`${card} block h-full p-4 text-sm leading-snug`}
            >
              <p className="text-base font-semibold">{r.title}</p>
              <p
                className="mt-1 inline-block rounded-md bg-[#E88D6D] px-2 py-0.5 text-xs font-semibold text-[#1A1A1A]"
              >
                {r.category}
              </p>
              <p className="mt-2 text-[#1A1A1A]/60">{r.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const sections: {
  id: string
  label: string
  color: string
  view: () => ReactNode
}[] = [
  {
    id: "sites",
    label: "internet prime 11",
    color: "#FF9FC0",
    view: Sites,
  },
  {
    id: "brands",
    label: "brands getting it right",
    color: "#DDF080",
    view: Brands,
  },
  {
    id: "campaigns",
    label: "campaigns & content",
    color: "#9EC5F4",
    view: Campaigns,
  },
  {
    id: "newsletters",
    label: "newsletters & blogs",
    color: "#E88D6D",
    view: Newsletters,
  },
]

export default function Moodboard() {
  const [cur, setCur] = useState(sections[0].id)
  const [progress, setProgress] = useState(0)
  const color = sections.find((s) => s.id === cur)!.color
  const View = sections.find((s) => s.id === cur)!.view
  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <p className="mb-8 max-w-xl leading-snug text-[#1A1A1A]/75">
        a running list of the campaigns, brands, products, and corners of the
        internet that have shaped my marketing instincts.
      </p>
      <div className="flex min-w-0 flex-col gap-6 text-[15px] lg:min-h-0 lg:flex-1">
        <nav aria-label="moodboard sections" className="panel-menu shrink-0 border-b border-[#D6D1C9]">
          <div role="tablist" aria-label="Moodboard categories" className="flex gap-6 overflow-x-auto sm:gap-8">
            {sections.map((section, index) => (
              <button
                key={section.id}
                id={`moodboard-tab-${section.id}`}
                type="button"
                role="tab"
                aria-selected={cur === section.id}
                aria-controls={`moodboard-panel-${section.id}`}
                tabIndex={cur === section.id ? 0 : -1}
                onClick={() => { setCur(section.id); setProgress(0) }}
                onKeyDown={(event) => {
                  let next = index
                  if (event.key === "ArrowRight") next = (index + 1) % sections.length
                  else if (event.key === "ArrowLeft") next = (index - 1 + sections.length) % sections.length
                  else if (event.key === "Home") next = 0
                  else if (event.key === "End") next = sections.length - 1
                  else return
                  event.preventDefault()
                  setCur(sections[next].id)
                  setProgress(0)
                  document.getElementById(`moodboard-tab-${sections[next].id}`)?.focus()
                }}
                style={{ borderColor: cur === section.id ? section.color : "transparent" }}
                className={`shrink-0 whitespace-nowrap border-b-2 pb-3 pt-1 text-left transition-colors hover:text-[#1A1A1A] ${cur === section.id ? "font-medium text-[#1A1A1A]" : "text-[#1A1A1A]/65"}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>
        <div className="relative min-w-0 max-lg:min-h-[50svh] lg:min-h-0 lg:flex-1">
          <div
            key={cur}
            data-panel-content
            role="tabpanel"
            id={`moodboard-panel-${cur}`}
            aria-labelledby={`moodboard-tab-${cur}`}
            tabIndex={0}
            onScroll={(e) => {
              const t = e.currentTarget
              setProgress(
                t.scrollHeight > t.clientHeight
                  ? (t.scrollTop + t.clientHeight) / t.scrollHeight
                  : 0,
              )
            }}
            className="w-full lg:h-full lg:overflow-y-auto lg:pr-4 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
          >
            <View />
          </div>
          <span
            aria-hidden="true"
            style={{ height: `${progress * 100}%`, background: color }}
            className="pointer-events-none absolute right-0 top-0 hidden w-[2px] transition-[height] duration-150 lg:block"
          />
        </div>
      </div>
    </div>
  )
}
