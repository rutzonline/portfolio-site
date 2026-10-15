import { useEffect, useRef, useState, type CSSProperties } from "react"
import { getPhotos } from "@/PhotoSlideshow"
import photoThumbnails from "@/photoThumbnails.json"

const thumbnails: Record<string, string> = photoThumbnails
const initialPhotos = Object.keys(thumbnails)

// Show the swipe discovery motion once per page load.
let swipeHintSeen = false

function CloseButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} aria-label={label}
    className="gallery-close flex size-11 shrink-0 items-center justify-center">
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  </button>
}

function LoadingPhoto({ src, alt, full = false, eager = false, preview }: { src: string; alt: string; full?: boolean; eager?: boolean; preview?: string }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return <div className={`relative overflow-hidden rounded-lg ${full ? "aspect-[4/5] w-full" : "aspect-square"} ${loaded || (full && preview) ? "" : "photo-skeleton"}`}>
    {full && preview && <img src={preview} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />}
    <img src={src} alt={alt} loading={full || eager ? "eager" : "lazy"} decoding="async" draggable={false}
      onLoad={async (event) => {
        const image = event.currentTarget
        try { await image.decode() } catch { /* Loaded images can still render if decode is unavailable. */ }
        if (image.isConnected) setLoaded(true)
      }} onError={() => setFailed(true)}
      className={`relative h-full w-full transition-opacity duration-300 motion-reduce:transition-none object-cover ${loaded ? "opacity-100" : "opacity-0"}`} />
    {failed && <span className="absolute inset-0 flex items-center justify-center px-2 text-sm text-black/50">photo unavailable</span>}
  </div>
}

function PhotoViewer({ photos, initial, hint, onClose }: { photos: string[]; initial: number; hint: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [mobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches)
  const [current, setCurrent] = useState(initial)
  const [showSwipeHint, setShowSwipeHint] = useState(hint)
  useEffect(() => {
    if (!hint) return
    const timer = window.setTimeout(() => setShowSwipeHint(false), 2400)
    return () => window.clearTimeout(timer)
  }, [hint])
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
    className={mobile ? "mobile-selected-photo text-[#1A1A1A] backdrop:bg-black/80" : "photo-viewer m-auto overflow-hidden rounded-xl bg-[#FAF9F6] p-2 text-[#1A1A1A] backdrop:bg-black/80"}>
    <div className={mobile ? "selected-photo-close flex justify-end" : "flex justify-end"}><CloseButton onClick={onClose} label="Close selected photo" /></div>
    <div className={mobile ? "selected-photo-frame" : ""}>
    <div className="relative" style={{ touchAction: "pan-y" }}
      onTouchStart={(event) => { const t = event.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }}
      onTouchCancel={() => { touch.current = null }}
      onTouchEnd={(event) => {
        const start = touch.current
        touch.current = null
        if (!start) return
        const t = event.changedTouches[0]
        const dx = t.clientX - start.x, dy = t.clientY - start.y
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { setShowSwipeHint(false); step(dx < 0 ? 1 : -1) }
      }}>
      <div className={showSwipeHint ? "photo-swipe-discovery" : ""}>
        <LoadingPhoto key={photos[current]} src={photos[current]} alt={`Photo ${current + 1} from Rutuja’s collection`} preview={thumbnails[photos[current]]} full />
      </div>
    </div>
    </div>
  </dialog>
}

type GalleryOrigin = { x: number; y: number; width: number; height: number }

export default function PhotoGallery({ onClose, origin, immersive = false }: { onClose: () => void; origin?: GalleryOrigin | null; immersive?: boolean }) {
  const [mobile] = useState(() => window.matchMedia("(max-width: 1023px)").matches)
  const fullPage = mobile || immersive
  const extraTurn = immersive && !mobile
  const [opening, setOpening] = useState(() => fullPage && Boolean(origin) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  useEffect(() => {
    if (!opening) return
    const timer = window.setTimeout(() => setOpening(false), extraTurn ? 2300 : 1700)
    return () => window.clearTimeout(timer)
  }, [opening, extraTurn])
  const panelLeft = extraTurn ? window.innerWidth * 0.2 : 0
  const panelWidth = window.innerWidth - panelLeft
  const flightStyle = origin ? {
    "--folder-x": `${origin.x + origin.width / 2 - panelLeft - panelWidth / 2}px`,
    "--folder-y": `${origin.y + origin.height / 2 - window.innerHeight / 2}px`,
    "--folder-scale": origin.width / 240,
    "--photo-scale-x": (extraTurn ? window.innerHeight : window.innerWidth) / 62,
    "--photo-scale-y": (extraTurn ? panelWidth : window.innerHeight) / 76,
  } as CSSProperties : undefined
  const dialog = useRef<HTMLDialogElement>(null)
  const [photos, setPhotos] = useState<string[]>(initialPhotos)
  const [selected, setSelected] = useState<number | null>(null)
  const [hintOnOpen, setHintOnOpen] = useState(false)
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
    setError(false)
    getPhotos().then((urls) => { if (!cancelled) { setPhotos(urls) } })
      .catch(() => { if (!cancelled) { setError(true) } })
    return () => { cancelled = true }
  }, [attempt])
  return <dialog ref={dialog} aria-label="Photo gallery" onCancel={onClose}
    onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    className={fullPage ? `mobile-photo-dialog ${extraTurn ? "photo-landscape-opening desktop-panel-gallery" : ""} ${opening ? "photo-page-opening" : "photo-page-ready"} text-[#1A1A1A] backdrop:bg-black/65` : "m-auto h-[calc(100svh-32px)] w-[calc(100%-24px)] max-w-3xl overflow-y-auto rounded-xl border border-[#E5E1DA] bg-[#FAF9F6] p-4 text-[#1A1A1A] backdrop:bg-black/65"}>
    {fullPage && <header className={`photo-page-nav ${opening ? "photo-page-nav-opening" : ""}`}>
      <button type="button" className="back-btn" onClick={onClose}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
        {immersive ? "back to what i’m up to" : "back to home"}
      </button>
    </header>}
    {opening && <div className="gallery-opening" style={flightStyle} aria-hidden="true">
      <div className="folder-flight">
        <img src="/photo-folder.png" alt="" />

      </div>
      <div className="middle-photo-flight"><div className="middle-photo-front" /><div className="middle-photo-back" /></div>
    </div>}
    <div className={fullPage ? `photo-gallery-window ${opening ? "gallery-window-opening" : ""}` : ""} inert={opening} aria-hidden={opening || undefined}>
    {!fullPage && <div className="mb-3 flex justify-end">
      <CloseButton onClick={onClose} label="Close photo gallery" />
    </div>}
    {error && <div role="status" className="py-8"><p>couldn’t refresh the photos. showing the saved collection.</p><button type="button" onClick={() => setAttempt((n) => n + 1)} className="back-btn mt-3">try again</button></div>}
    {!error && !photos.length && <p>no photos to show yet.</p>}
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {photos.map((src, index) => <button key={src} type="button" aria-label={`View photo ${index + 1}`} aria-haspopup="dialog"
          onClick={() => { setHintOnOpen(!swipeHintSeen); swipeHintSeen = true; setSelected(index) }} className="rounded-lg">
          <LoadingPhoto src={thumbnails[src] ?? src} alt="" eager={index < 12} />
        </button>)}
    </div>
    </div>
    {selected !== null && <PhotoViewer photos={photos} initial={selected} hint={hintOnOpen} onClose={() => setSelected(null)} />}
  </dialog>
}
