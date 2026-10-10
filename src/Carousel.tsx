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
    <section aria-label={label} aria-roledescription="carousel" className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-[#1A1A1A]/55">swipe to browse</p>
        <div className="flex items-center gap-3">
          <span aria-live="polite" aria-atomic="true" className="text-sm tabular-nums text-[#1A1A1A]/65">{index + 1} / {slides.length}</span>
          <button type="button" aria-label={`Previous ${label} slide`} disabled={index === 0} onClick={() => go(index - 1)} className="flex size-10 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">←</button>
          <button type="button" aria-label={`Next ${label} slide`} disabled={index === slides.length - 1} onClick={() => go(index + 1)} className="flex size-10 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">→</button>
        </div>
      </div>
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
        className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:thin]">
        {slides.map((slide, i) => (
          <li key={i} aria-label={`${i + 1} of ${slides.length}`} aria-roledescription="slide" className="min-w-0 basis-full shrink-0 snap-start snap-always">{slide}</li>
        ))}
      </ul>
    </section>
  )
}
