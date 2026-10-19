import { useRef, useState, type ReactNode } from "react"

export default function Carousel({ label, slides }: { label: string; slides: ReactNode[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const go = (next: number) => {
    const track = trackRef.current
    if (!track) return
    const target = Math.max(0, Math.min(slides.length - 1, next))
    track.scrollTo({ left: target * (track.clientWidth + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }
  if (!slides.length) return null
  return (
    <section aria-label={label} aria-roledescription="carousel" className="relative min-w-0">
      <ul ref={trackRef} tabIndex={0} aria-label={`${label} slides`}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1) }
          if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1) }
        }}
        onScroll={(event) => {
          const track = event.currentTarget
          setIndex(Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / (track.clientWidth + 16)))))
        }}
        className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((slide, i) => (
          <li key={i} aria-label={`${i + 1} of ${slides.length}`} aria-roledescription="slide" className="min-w-0 basis-full shrink-0 snap-start snap-always">{slide}</li>
        ))}
      </ul>
      {slides.length > 1 && <>
        <button type="button" aria-label={`Previous ${label} slide`} disabled={index === 0} onClick={() => go(index - 1)} className="absolute left-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white/95 text-xl text-[#1A1A1A] shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-40 sm:left-3">←</button>
        <button type="button" aria-label={`Next ${label} slide`} disabled={index === slides.length - 1} onClick={() => go(index + 1)} className="absolute right-2 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-white/95 text-xl text-[#1A1A1A] shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-40 sm:right-3">→</button>
        <span aria-live="polite" aria-atomic="true" className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-sm tabular-nums text-[#1A1A1A] shadow-sm">{index + 1} / {slides.length}</span>
      </>}
    </section>
  )
}
