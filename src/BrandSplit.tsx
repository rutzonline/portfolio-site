import { useRef } from "react"
import type { Brand } from "@/useMoodboard"

export default function BrandSplit({ brands, index, onChange }: {
  brands: Brand[]; index: number; onChange: (index: number) => void
}) {
  const logos = useRef<Array<HTMLButtonElement | null>>([])
  const selected = brands[index]
  if (!selected) return null
  const go = (next: number, focus = false) => {
    const target = (next + brands.length) % brands.length
    onChange(target)
    if (focus) logos.current[target]?.focus()
  }
  const arrow =
    "flex size-9 items-center justify-center rounded-full border border-[#B8B3AA] text-base transition-colors hover:border-[#1A1A1A] disabled:cursor-default disabled:opacity-30 disabled:hover:border-[#B8B3AA]"
  return (
    <section
      aria-label="brands"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1, true) }
        if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1, true) }
        if (event.key === "Home") { event.preventDefault(); go(0, true) }
        if (event.key === "End") { event.preventDefault(); go(brands.length - 1, true) }
      }}
      className="grid gap-8 pb-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
    >
      <ul aria-label="Choose a brand" className="grid grid-cols-6 content-start gap-x-3 gap-y-4">
        {brands.map((brand, i) => (
          <li key={brand.name}>
            <button
              ref={(element) => { logos.current[i] = element }}
              type="button"
              aria-label={`Show ${brand.name}`}
              aria-pressed={index === i}
              tabIndex={index === i ? 0 : -1}
              onClick={() => onChange(i)}
              className="group flex w-full flex-col items-center gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A1A1A]"
            >
              <span
                className={`block aspect-square w-full overflow-hidden rounded-xl border-2 bg-[#F0EEEA] transition-colors ${
                  index === i ? "border-[#1A1A1A]" : "border-transparent group-hover:border-[#B8B3AA]"
                }`}
              >
                {brand.logo_url && (
                  <img src={brand.logo_url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                )}
              </span>
              <span
                className={`w-full break-words text-center text-xs leading-tight ${
                  index === i ? "font-medium text-[#1A1A1A]" : "text-[#1A1A1A]/70"
                }`}
              >
                {brand.name}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="min-w-0 lg:sticky lg:top-0 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="shrink-0 text-sm tabular-nums text-[#1A1A1A]/70" aria-live="polite" aria-atomic="true">
            <span className="sr-only">{selected.name}, brand </span>{index + 1} / {brands.length}
          </p>
          <p className="text-center text-sm leading-snug text-[#1A1A1A]/70">why i probably won&rsquo;t skip them on my feed</p>
          <div className="flex shrink-0 gap-2">
            <button type="button" aria-label="Previous brand" disabled={brands.length < 2} onClick={() => go(index - 1)} className={arrow}>←</button>
            <button type="button" aria-label="Next brand" disabled={brands.length < 2} onClick={() => go(index + 1)} className={arrow}>→</button>
          </div>
        </div>
        <article className="overflow-hidden rounded-[24px] border border-[#D6D1C9] bg-white shadow-sm">
          <header className="flex items-center gap-4 bg-[#F0EEEA] px-6 py-4">
            <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-[#E5E1DA] bg-white">
              {selected.logo_url && <img src={selected.logo_url} alt="" className="size-full object-cover" />}
            </div>
            <h3 className="min-w-0 text-xl font-semibold leading-tight">{selected.name}</h3>
          </header>
          <p className="whitespace-pre-line px-6 py-5 text-[15px] leading-relaxed text-[#1A1A1A]/80">
            {selected.description}
          </p>
        </article>
      </div>
    </section>
  )
}
