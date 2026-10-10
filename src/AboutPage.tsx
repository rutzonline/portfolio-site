import { useEffect, useRef, useState } from "react"
import { aboutContent } from "@/aboutContent"
import ImagePreview from "@/ImagePreview"
import { Rows, ImageSlot } from "@/contentComponents"

type Mode = "growth" | "brand"

function AboutExtras({ mode }: { mode: Mode }) {
  const c = aboutContent[mode]
  const [expanded, setExpanded] = useState<{ src: string; alt: string } | null>(null)
  useEffect(() => setExpanded(null), [mode])
  return (
    <div className="flex min-w-0 flex-col gap-16 lg:gap-20">
      <section id="about-languages">
        <h3 className="mb-3 font-heading text-xl tracking-[-0.02em]">
          languages
        </h3>
        <Rows items={c.languages} />
      </section>
      <section id="about-interests">
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
              <span className="text-sm leading-relaxed text-[#1A1A1A]/75">{t}</span>
            </li>
          ))}
        </ul>
      </section>
      <section id="about-faq">
        <h3 className="mb-3 font-heading text-xl tracking-[-0.02em]">frequently asked questions</h3>
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

export function splitAboutIntro(intro: string, mode: Mode) {
  const start = intro.indexOf(mode === "growth" ? "i.e.," : "from the first ad")
  return {
    main: start < 0 ? intro : intro.slice(0, start).trimEnd(),
    explanation: start < 0 ? null : intro.slice(start),
  }
}

const ABOUT_SECTIONS = [
  ["about-introduction", "introduction"],
  ["about-languages", "languages"],
  ["about-interests", "interests"],
  ["about-faq", "frequently asked questions"],
] as const

export default function AboutPage({ mode }: { mode: Mode }) {
  const intro = aboutContent[mode].intro
  const contentRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>("about-introduction")

  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    content.scrollTo({ top: 0, behavior: "instant" })
    const update = () => {
      const top = content.getBoundingClientRect().top
      let current: string = "about-introduction"
      for (const [id] of ABOUT_SECTIONS) {
        const section = content.querySelector<HTMLElement>(`#${id}`)
        if (section && section.getBoundingClientRect().top <= top + 80) current = id
      }
      if (content.scrollTop > 0 && content.scrollTop + content.clientHeight >= content.scrollHeight - 2) {
        current = "about-faq"
      }
      setActive(current)
    }
    update()
    content.addEventListener("scroll", update, { passive: true })
    return () => content.removeEventListener("scroll", update)
  }, [mode])

  return (
    <div className="about-layout -mr-6 grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden lg:-mr-10 lg:grid-rows-1">
      <nav aria-label="About contents" className="panel-menu about-menu mr-6 min-w-0 lg:mr-0">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 lg:flex lg:flex-col lg:gap-2">
          {ABOUT_SECTIONS.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} aria-current={active === id ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  const content = contentRef.current
                  const section = content?.querySelector<HTMLElement>(`#${id}`)
                  if (!content || !section) return
                  content.scrollTo({
                    top: content.scrollTop + section.getBoundingClientRect().top - content.getBoundingClientRect().top,
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                  })
                }}
                className={`transition-colors hover:text-[color:var(--hl-link)] ${active === id ? "font-medium text-[color:var(--hl-link)]" : "text-[#1A1A1A]/70"}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div ref={contentRef} data-about-content data-panel-content role="region" aria-label="About content" tabIndex={0}
        className="min-h-0 min-w-0 overflow-y-auto overscroll-contain">
        <div className="about-reading-column max-w-[48rem] mr-6 flex flex-col gap-16 pb-16 pr-3 lg:mr-10 lg:gap-20">
          <section id="about-introduction" className="flex flex-col gap-8 lg:gap-10">
            <div className="flex min-w-0 flex-col gap-4">
              <p className="about-greeting leading-[1.4] tracking-[-0.01em] text-[#1A1A1A]">
                {intro}
              </p>
              <p className="max-w-[65ch] whitespace-pre-line text-base leading-relaxed text-[#1A1A1A]/75">
                {aboutContent[mode].bio}
              </p>
            </div>
            <figure className="flex flex-col gap-2">
              <video controls playsInline preload="metadata" aria-label="Video introduction, about two minutes"
                poster="/video-introduction-poster.png"
              src="https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/video%20introduction.mp4"
              className="block h-auto w-full rounded-md border border-[color:var(--grid-line)]" />
              <figcaption className="text-sm text-[#1A1A1A]/70">2 min, best with sound</figcaption>
            </figure>
          </section>
          <AboutExtras mode={mode} />
        </div>
      </div>
    </div>
  )
}
