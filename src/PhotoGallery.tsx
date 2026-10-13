import { useEffect, useRef, useState } from "react"
import { getPhotos } from "@/PhotoSlideshow"

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} aria-label={label}
    className="gallery-close flex size-11 shrink-0 items-center justify-center">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  </button>
}

function LoadingPhoto({ src, alt, full = false }: { src: string; alt: string; full?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return <div className={`relative overflow-hidden rounded-lg ${full ? "h-[75svh]" : "aspect-square"} ${loaded ? "" : "photo-skeleton"}`}>
    <img src={src} alt={alt} loading={full ? "eager" : "lazy"} draggable={false}
      onLoad={() => setLoaded(true)} onError={() => setFailed(true)}
      className={`h-full w-full transition-opacity duration-300 ${full ? "object-contain" : "object-cover"} ${loaded ? "opacity-100" : "opacity-0"}`} />
    {failed && <span className="absolute inset-0 flex items-center justify-center px-2 text-sm text-black/50">photo unavailable</span>}
  </div>
}

function PhotoViewer({ photos, initial, onClose }: { photos: string[]; initial: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(initial)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const step = (direction: number) => setCurrent((index) => (index + direction + photos.length) % photos.length)
  useEffect(() => {
    const element = dialog.current
    const opener = document.activeElement
    element?.showModal()
    return () => { element?.close(); if (opener instanceof HTMLElement) opener.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialog} aria-label="Selected photo" onCancel={(event) => { event.preventDefault(); event.stopPropagation(); onClose() }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1) }
      if (event.key === "ArrowRight") { event.preventDefault(); step(1) }
    }}
    className="m-auto w-[calc(100%-16px)] max-w-4xl overflow-hidden rounded-xl bg-[#FAF9F6] p-2 text-[#1A1A1A] backdrop:bg-black/80">
    <div className="flex justify-end"><CloseButton onClick={onClose} label="Close selected photo" /></div>
    <div style={{ touchAction: "pan-y" }}
      onTouchStart={(event) => { const t = event.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }}
      onTouchCancel={() => { touch.current = null }}
      onTouchEnd={(event) => {
        const start = touch.current
        touch.current = null
        if (!start) return
        const t = event.changedTouches[0]
        const dx = t.clientX - start.x, dy = t.clientY - start.y
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1)
      }}>
      <LoadingPhoto key={photos[current]} src={photos[current]} alt={`Photo ${current + 1} from Rutuja’s collection`} full />
    </div>
  </dialog>
}

export default function PhotoGallery({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const element = dialog.current
    const opener = document.activeElement
    element?.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      element?.close()
      document.body.style.overflow = previous
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true })
    }
  }, [])
  useEffect(() => {
    let cancelled = false
    setLoading(true); setError(false)
    getPhotos().then((urls) => { if (!cancelled) { setPhotos(urls); setLoading(false) } })
      .catch(() => { if (!cancelled) { setLoading(false); setError(true) } })
    return () => { cancelled = true }
  }, [attempt])
  return <dialog ref={dialog} aria-labelledby="photo-gallery-title" onCancel={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    className="m-auto h-[calc(100svh-32px)] w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-4 text-[#1A1A1A] backdrop:bg-black/65">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 id="photo-gallery-title" className="slice-of-life">slice of life</h2>
      <CloseButton onClick={onClose} label="Close photo gallery" />
    </div>
    {error && <div role="status" className="py-8"><p>couldn’t load the photos.</p><button type="button" onClick={() => setAttempt((n) => n + 1)} className="back-btn mt-3">try again</button></div>}
    {!loading && !error && !photos.length && <p>no photos to show yet.</p>}
    <div aria-busy={loading} className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {loading ? Array.from({ length: 18 }, (_, index) => <div key={index} aria-hidden="true" className="photo-skeleton aspect-square rounded-lg" />)
        : photos.map((src, index) => <button key={src} type="button" aria-label={`View photo ${index + 1}`} aria-haspopup="dialog"
          onClick={() => setSelected(index)} className="rounded-lg">
          <LoadingPhoto src={src} alt="" />
        </button>)}
    </div>
    {selected !== null && <PhotoViewer photos={photos} initial={selected} onClose={() => setSelected(null)} />}
  </dialog>
}
