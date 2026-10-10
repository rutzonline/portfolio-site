import { useEffect, useRef, useState } from "react"
import type { Brand } from "@/useMoodboard"

export default function BrandLogoStrip({ brands, index, onChange }: {
  brands: Brand[]; index: number; onChange: (index: number) => void
}) {
  const listRef = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })
  const update = () => {
    const list = listRef.current
    if (list) setEdges({ start: list.scrollLeft <= 1, end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 1 })
  }
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new ResizeObserver(update)
    observer.observe(list)
    update()
    return () => observer.disconnect()
  }, [brands.length])
  useEffect(() => {
    const list = listRef.current
    const item = list?.children[index] as HTMLElement | undefined
    if (!list || !item) return
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    const left = item.offsetLeft
    const right = left + item.offsetWidth
    if (left < list.scrollLeft) list.scrollTo({ left, behavior })
    else if (right > list.scrollLeft + list.clientWidth) list.scrollTo({ left: right - list.clientWidth, behavior })
  }, [index])
  const scroll = (direction: number) => {
    const list = listRef.current
    list?.scrollBy({ left: direction * list.clientWidth * 0.75, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }
  return (
    <nav aria-label="Choose a brand" className="mx-auto mt-6 flex w-full max-w-[44rem] items-center gap-2 sm:gap-4">
      <button type="button" aria-label="Scroll brand logos left" disabled={edges.start} onClick={() => scroll(-1)} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">←</button>
      <ul ref={listRef} onScroll={update} className="relative flex min-w-0 flex-1 gap-3 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {brands.map((brand, i) => (
          <li key={brand.name} className="w-16 shrink-0 sm:w-20">
            <button type="button" aria-label={`Show ${brand.name}`} aria-pressed={index === i} onClick={() => onChange(i)} className="flex w-full flex-col items-center gap-2">
              <span className={`block aspect-square w-full overflow-hidden rounded-xl border-2 bg-[#F0EEEA] ${index === i ? "border-[#1A1A1A]" : "border-transparent"}`}>
                {brand.logo_url && <img src={brand.logo_url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />}
              </span>
              <span className="w-full break-words text-center text-[11px] leading-tight">{brand.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" aria-label="Scroll brand logos right" disabled={edges.end} onClick={() => scroll(1)} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">→</button>
    </nav>
  )
}
