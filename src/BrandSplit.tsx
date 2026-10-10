import BrandLogoStrip from "@/BrandLogoStrip"
import type { Brand } from "@/useMoodboard"

export default function BrandSplit({ brands, index, onChange }: {
  brands: Brand[]; index: number; onChange: (index: number) => void
}) {
  const selected = brands[index]
  if (!selected) return null
  const go = (next: number) => onChange((next + brands.length) % brands.length)
  const arrow = "flex size-9 items-center justify-center rounded-full border border-[#B8B3AA] text-base transition-colors hover:border-[#1A1A1A] disabled:opacity-30"
  return (
    <section aria-label="brands" className="pb-4">
      <BrandLogoStrip brands={brands} index={index} onChange={onChange} fullWidth />
      <div className="mx-auto mt-5 w-full max-w-[56rem]" tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1) }
          if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1) }
        }}>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm tabular-nums text-[#1A1A1A]/70" aria-live="polite" aria-atomic="true">
            <span className="sr-only">{selected.name}, brand </span>{index + 1} / {brands.length}
          </p>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous brand" disabled={brands.length < 2} onClick={() => go(index - 1)} className={arrow}>←</button>
            <button type="button" aria-label="Next brand" disabled={brands.length < 2} onClick={() => go(index + 1)} className={arrow}>→</button>
          </div>
        </div>
        <article className="overflow-hidden rounded-[24px] border border-[#D6D1C9] bg-white shadow-sm">
          <header className="flex items-center gap-4 bg-[#F0EEEA] px-5 py-3 sm:px-6">
            <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-[#E5E1DA] bg-white">
              {selected.logo_url && <img src={selected.logo_url} alt="" className="size-full object-cover" />}
            </div>
            <h3 className="min-w-0 text-lg font-semibold leading-tight">{selected.name}</h3>
          </header>
          <p className="whitespace-pre-line px-5 py-4 text-[15px] leading-relaxed text-[#1A1A1A]/80 sm:px-6">
            {selected.description}
          </p>
        </article>
      </div>
    </section>
  )
}
