import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
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

const platformColors: Record<string, string> = {
  linkedin: "#9EC5F4", x: "#DDF080", instagram: "#FF9FC0", youtube: "#E88D6D",
}
const categoryColors = ["#FF9FC0", "#DDF080", "#E88D6D", "#9EC5F4"]
const categoryColor = (category: string) => categoryColors[
  [...category].reduce((total, letter) => total + letter.charCodeAt(0), 0) % categoryColors.length
]
const card = "overflow-hidden rounded-xl border border-[#E5E1DA] bg-white"
const siteCard = card.replace("border-[#E5E1DA]", "border-[#B8B3AA]")

const dotColors = ["#FF9FC0", "#DDF080", "#E88D6D", "#9EC5F4"]

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
      <Intro>and why i probably won&rsquo;t skip them on my feed</Intro>
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
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    {(brand.platforms ?? []).map((platform) => (
                      <span key={platform} className="text-sm font-semibold" style={{ color: platformColors[platform] ?? categoryColor(platform) }}>{platform}</span>
                    ))}
                  </div>
                </div>
              </header>
              <p className="mt-4 whitespace-pre-line text-base leading-snug text-[#1A1A1A]/60">{brand.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </>
  )
}

function CampaignImage({ src, brand, active }: { src?: string; brand: string; active: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return <>
    <img src={src || ph(brand)} alt={active ? brand : ""} aria-hidden={!active}
      loading="eager" decoding="async" fetchPriority={active ? "high" : "low"}
      onLoad={(event) => {
        const image = event.currentTarget
        image.decode().catch(() => {}).then(() => setLoaded(true))
      }}
      onError={() => setFailed(true)}
      className={`absolute inset-0 h-full w-full object-cover ${active && loaded && !failed ? "opacity-100" : "opacity-0"}`} />
    {active && !loaded && !failed && <Loading />}
    {active && failed && <p role="status" className="absolute inset-0 flex items-center justify-center p-4 text-sm text-[#1A1A1A]/65">couldn’t load this image.</p>}
  </>
}

function Campaigns() {
  const { rows: sourceRows, status } = useMoodboard("campaigns")
  const rows = useMemo(() => {
    const middle = sourceRows.filter((row) => row.brand.trim().toLowerCase() === "ottilie")
    const others = sourceRows.filter((row) => row.brand.trim().toLowerCase() !== "ottilie")
    others.splice(Math.floor(sourceRows.length / 2), 0, ...middle)
    return others
  }, [sourceRows])
  const [index, setIndex] = useState(0)
  const campaign = rows[index]
  const step = (direction: number) => setIndex((current) => rows.length ? (current + direction + rows.length) % rows.length : 0)
  const chevronControl = "flex size-11 items-center justify-center rounded transition-opacity hover:opacity-70 disabled:cursor-default disabled:opacity-30"
  return (
    <section className="flex flex-col lg:min-h-full">
      <Intro>my content marketing hall of fame</Intro>
      <State status={status} count={rows.length} />
      {campaign && <div className="flex flex-1 items-center py-6 lg:py-8">
        <div className="grid w-full max-w-[64rem] items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
          <div className="min-w-0" tabIndex={0} aria-label="Campaign navigation"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") { event.preventDefault(); step(-1) }
              if (event.key === "ArrowRight") { event.preventDefault(); step(1) }
            }}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] border border-[#D6D1C9] bg-[#F0EEEA] shadow-sm">
              {rows.map((row, imageIndex) => <CampaignImage key={`${row.brand}:${row.image_url}`} src={row.image_url} brand={row.brand} active={imageIndex === index} />)}
            </div>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button type="button" aria-label="Previous campaign" disabled={rows.length < 2} onClick={() => step(-1)} className={chevronControl}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
              </button>
              <p className="text-sm tabular-nums text-[#1A1A1A]/60">{index + 1} / {rows.length}</p>
              <button type="button" aria-label="Next campaign" disabled={rows.length < 2} onClick={() => step(1)} className={chevronControl}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
              </button>
            </div>
          </div>
          <article className="min-w-0 lg:pb-12" aria-live="polite" aria-atomic="true">
            <p className="mb-1 text-sm text-[#1A1A1A]/60">{campaign.kicker}</p>
            <h3 className="mb-3 text-lg font-semibold">{campaign.brand}</h3>
            <p className="whitespace-pre-line text-base leading-relaxed text-[#1A1A1A]/75">{campaign.description}</p>
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
                className="mt-1 text-sm font-semibold"
                style={{ color: categoryColor(r.category) }}
              >
                {r.category}
              </p>
              <p className="mt-2 whitespace-pre-line text-base leading-snug text-[#1A1A1A]/60">{r.description}</p>
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
  const tabsRef = useRef<HTMLDivElement>(null)
  const [moreTabsRight, setMoreTabsRight] = useState(false)
  useEffect(() => {
    const tabs = tabsRef.current
    if (!tabs) return
    const update = () => setMoreTabsRight(tabs.scrollWidth - tabs.clientWidth - tabs.scrollLeft > 1)
    update()
    tabs.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(tabs)
    for (const tab of tabs.children) observer.observe(tab)
    return () => { tabs.removeEventListener("scroll", update); observer.disconnect() }
  }, [])
  const [cur, setCur] = useState(sections[0].id)
  const [progress, setProgress] = useState(0)
  const color = sections.find((s) => s.id === cur)!.color
  const View = sections.find((s) => s.id === cur)!.view
  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <p className="mb-8 w-full leading-snug text-[#1A1A1A]/75">
        a running list of the campaigns, brands, products, and corners of the
        internet that have shaped my marketing instincts.
      </p>
      <div className="flex min-w-0 flex-col gap-6 text-base lg:min-h-0 lg:flex-1">
        <nav aria-label="moodboard sections" className="panel-menu relative shrink-0 border-b border-[#D6D1C9]">
          <div ref={tabsRef} role="tablist" aria-label="Moodboard categories" className="flex gap-6 overflow-x-auto sm:gap-8">
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
                className={`max-lg:min-h-11 shrink-0 whitespace-nowrap border-b-2 pb-3 pt-1 text-left transition-colors hover:text-[#1A1A1A] ${cur === section.id ? "font-medium text-[#1A1A1A]" : "text-[#1A1A1A]/65"}`}
              >
                {section.label}
              </button>
            ))}
          </div>
          {moreTabsRight && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-[#FAF9F6] lg:hidden" />}
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
            className="w-full lg:h-full lg:overflow-y-auto lg:pr-4"
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
