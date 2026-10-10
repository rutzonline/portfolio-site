import { type ReactNode } from "react"

export default function TapDeck({ label, index, count, onChange, children, loop = false, wide = false }: {
  label: string; index: number; count: number; onChange: (index: number) => void; children: ReactNode; loop?: boolean; wide?: boolean
}) {
  if (!count) return null
  const go = (next: number) => onChange(loop ? (next + count) % count : Math.max(0, Math.min(count - 1, next)))
  return (
    <section aria-label={label} aria-roledescription="carousel" tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1) }
        if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1) }
      }} className={`mx-auto w-full ${wide ? "max-w-[56rem]" : "max-w-[44rem]"}`}>
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        <button type="button" aria-label={`Previous ${label}`} disabled={count < 2 || (!loop && index === 0)} onClick={() => go(index - 1)} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">←</button>
        <div className="min-w-0 flex-1" aria-live="polite" aria-atomic="true">{children}</div>
        <button type="button" aria-label={`Next ${label}`} disabled={count < 2 || (!loop && index === count - 1)} onClick={() => go(index + 1)} className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#B8B3AA] text-lg disabled:cursor-default disabled:opacity-30">→</button>
      </div>
      <p className="mt-3 text-center text-sm tabular-nums text-[#1A1A1A]/55">{index + 1} / {count}</p>
    </section>
  )
}
