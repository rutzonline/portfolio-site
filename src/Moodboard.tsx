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
    className={`w-full object-cover ${className}`}
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

const catColors = ["#E8741C", "#E8567F", "#9AAE1E", "#2F6FD0", "#C9A227"]
const catColor = (c: string) =>
  catColors[
    [...c].reduce((a, ch) => a + ch.charCodeAt(0), 0) % catColors.length
  ]

const card = "overflow-hidden rounded-xl border border-[#E5E1DA] bg-white"
const grid4 = "grid gap-3 sm:grid-cols-2 xl:grid-cols-4"

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
  return <p className="mb-5 text-[#1A1A1A]/60">{children}</p>
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
            <Link href={r.url} className={`${card} block`}>
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
  const groups = [...new Set(rows.map((r) => r.group))]
  const [sel, setSel] = useState<Record<string, string>>({})
  return (
    <>
      <Intro>
        click to see why i probably won&rsquo;t skip them on my feed
      </Intro>
      <State status={status} count={rows.length} />
      <div className="flex flex-col gap-8">
        {groups.map((g) => {
          const items = rows.filter((r) => r.group === g)
          const cur = items.find((r) => r.name === sel[g])
          return (
            <section key={g}>
              <h3 className="mb-4 flex items-center gap-3 font-heading text-lg tracking-[-0.02em]">
                {g}
                <span className="h-px flex-1 bg-[#E5E1DA]" />
              </h3>
              <ul className="flex gap-2 lg:flex-wrap lg:gap-3">
                {items.map((b) => (
                  <li
                    key={b.name}
                    className="min-w-0 flex-1 basis-0 lg:w-28 lg:flex-none"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSel({
                          ...sel,
                          [g]: cur?.name === b.name ? "" : b.name,
                        })
                      }
                      className="flex w-full flex-col items-center gap-2"
                    >
                      <span
                        className={`block aspect-square w-full overflow-hidden rounded-xl border-2 ${
                          cur?.name === b.name
                            ? "border-[#1A1A1A]"
                            : "border-transparent"
                        }`}
                        style={{ background: "#F0EEEA" }}
                      >
                        {b.logo_url ? (
                          <img
                            src={b.logo_url}
                            alt={b.name}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-cover"
                          />
                        ) : null}
                      </span>
                      <span className="max-w-full break-words text-center text-[10px] font-medium lg:text-xs">
                        {b.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              {cur && (
                <p className="mt-4 max-w-3xl leading-snug text-[#1A1A1A]/70">
                  {cur.description}
                </p>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}

function Campaigns() {
  const { rows, status } = useMoodboard("campaigns")
  return (
    <>
      <Intro>my content marketing hall of fame</Intro>
      <State status={status} count={rows.length} />
      <ul className={grid4}>
        {rows.map((r) => (
          <li key={r.brand + r.kicker}>
            <Link href={r.url} className={`${card} block h-full`}>
              <Img src={r.image_url} alt={r.brand} className="aspect-[4/3]" />
              <div className="px-3 py-2 leading-snug">
                <p className="text-sm text-[#1A1A1A]/55">{r.kicker}</p>
                <p className="font-semibold">{r.brand}</p>
                <p className="text-xs text-[#1A1A1A]/60">{r.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
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
                style={{ color: catColor(r.category) }}
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
  group: string
  color: string
  view: () => ReactNode
}[] = [
  {
    id: "sites",
    label: "internet prime 11",
    group: "library",
    color: "#FF9FC0",
    view: Sites,
  },
  {
    id: "brands",
    label: "brands getting it right",
    group: "library",
    color: "#DDF080",
    view: Brands,
  },
  {
    id: "campaigns",
    label: "campaigns & content",
    group: "library",
    color: "#9EC5F4",
    view: Campaigns,
  },
  {
    id: "newsletters",
    label: "newsletters & blogs",
    group: "library",
    color: "#E88D6D",
    view: Newsletters,
  },
]

export default function Moodboard() {
  const [cur, setCur] = useState(sections[0].id)
  const [progress, setProgress] = useState(0)
  const color = sections.find((s) => s.id === cur)!.color
  const View = sections.find((s) => s.id === cur)!.view
  const groups = [...new Set(sections.map((s) => s.group))]
  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1">
      <p className="mb-8 max-w-xl leading-snug text-[#1A1A1A]/75">
        a running list of the campaigns, brands, products, and corners of the
        internet that have shaped my marketing instincts.
      </p>
      <div className="grid gap-8 text-[15px] lg:min-h-0 lg:flex-1 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav
          aria-label="moodboard sections"
          className="panel-menu lg:sticky lg:top-6 lg:self-start"
        >
          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:flex-col lg:gap-5">
            {groups.map((g) => (
              <div
                key={g}
                className="flex flex-wrap gap-x-5 gap-y-3 lg:flex-col lg:gap-3"
              >
                <p className="hidden text-sm text-[#1A1A1A]/50 lg:block">{g}</p>
                {sections
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-current={cur === s.id}
                      onClick={() => {
                        setCur(s.id)
                        setProgress(0)
                      }}
                      style={{ "--c": s.color } as CSSProperties}
                      className={`w-fit bg-[linear-gradient(var(--c),var(--c))] bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat pb-[5px] text-left transition-[background-size] duration-300 ease-out hover:bg-[length:100%_2px] ${
                        cur === s.id ? "bg-[length:100%_2px]" : ""
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </nav>
        <div className="relative max-lg:min-h-[50svh] lg:min-h-0">
          <div
            key={cur}
            onScroll={(e) => {
              const t = e.currentTarget
              setProgress(
                t.scrollHeight > t.clientHeight
                  ? (t.scrollTop + t.clientHeight) / t.scrollHeight
                  : 0,
              )
            }}
            className="max-w-5xl lg:h-full lg:overflow-y-auto lg:pr-4 lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
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
