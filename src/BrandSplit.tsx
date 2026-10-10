import TapDeck from "@/TapDeck"
import BrandLogoStrip from "@/BrandLogoStrip"
import type { Brand } from "@/useMoodboard"

export default function BrandSplit({ brands, index, onChange }: {
  brands: Brand[]; index: number; onChange: (index: number) => void
}) {
  const selected = brands[index]
  if (!selected) return null
  return (
    <section aria-label="brands" className="pb-4">
      <BrandLogoStrip brands={brands} index={index} onChange={onChange} fullWidth />
      <div className="mt-5">
        <TapDeck label="brand" index={index} count={brands.length} onChange={onChange} loop wide>
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
        </TapDeck>
      </div>
    </section>
  )
}
