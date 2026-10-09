import { useEffect, useRef, useState } from "react"
import { fetchTable } from "@/lib/supabase"

type PhotoRow = { url?: string }
let photoRequest: Promise<string[]> | null = null

function getPhotos() {
  if (!photoRequest) {
    photoRequest = fetchTable<PhotoRow>("photos")
      .then((rows) => [...new Set(rows.flatMap((row) => {
        try {
          const url = new URL(row.url?.trim() ?? "")
          return /\/storage\/v1\/object\/public\/photos\//.test(url.pathname) &&
            /\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname) ? [url.href] : []
        } catch {
          return []
        }
      }))])
      .catch((error) => {
        photoRequest = null
        throw error
      })
  }
  return photoRequest
}

export default function PhotoSlideshow({ active, portrait }: { active: boolean; portrait: string }) {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [photos, setPhotos] = useState<string[]>([])
  const [shown, setShown] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const enabled = active && desktop

  useEffect(() => {
    const screen = window.matchMedia("(min-width: 1024px)")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateScreen = () => setDesktop(screen.matches)
    const updateMotion = () => setReducedMotion(motion.matches)
    screen.addEventListener("change", updateScreen)
    motion.addEventListener("change", updateMotion)
    return () => {
      screen.removeEventListener("change", updateScreen)
      motion.removeEventListener("change", updateMotion)
    }
  }, [])

  useEffect(() => {
    if (!enabled || photos.length) return
    let cancelled = false
    getPhotos().then((urls) => {
      if (!cancelled) setPhotos(urls)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [enabled, photos.length])

  useEffect(() => {
    pausedRef.current = false
    setPaused(false)
    if (!enabled) {
      setShown(null)
      setPrevious(null)
      return
    }
    if (!photos.length) return
    let cancelled = false
    let pending = false
    let index = -1
    let current: string | null = null
    const failed = new Set<string>()
    const advance = () => {
      if (cancelled || pending || document.hidden || pausedRef.current) return
      let next = (index + 1) % photos.length
      while (failed.has(photos[next])) {
        next = (next + 1) % photos.length
        if (next === (index + 1) % photos.length) return
      }
      index = next
      if (photos[next] === current) return
      pending = true
      const image = new Image()
      image.onload = () => {
        if (cancelled) return
        pending = false
        setPrevious(current)
        current = photos[next]
        setShown(current)
      }
      image.onerror = () => {
        if (cancelled) return
        pending = false
        failed.add(photos[next])
        if (failed.size < photos.length) advance()
      }
      image.src = photos[next]
    }
    advance()
    const timer = !reducedMotion && photos.length > 1 ? window.setInterval(advance, 3000) : undefined
    const resume = () => { if (!current) advance() }
    document.addEventListener("visibilitychange", resume)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener("visibilitychange", resume)
    }
  }, [enabled, photos, reducedMotion])

  const showPhoto = enabled && shown
  return (
    <div className="absolute inset-0">
      <img src={portrait} alt={showPhoto ? "" : "Portrait of Rutuja Rochkari"}
        aria-hidden={Boolean(showPhoto)}
        className="absolute inset-0 h-full w-full border-0 object-cover object-[center_35%]" />
      {showPhoto && (
        <>
          {previous && <img src={previous} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <img key={shown} src={shown} alt="" className="photo-fade-in absolute inset-0 h-full w-full object-cover" />
          {photos.length > 1 && !reducedMotion && (
            <button type="button" onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Play photo slideshow" : "Pause photo slideshow"}
              title={paused ? "Play slideshow" : "Pause slideshow"}
              className="absolute bottom-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
                {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zm6 0h4v14h-4z" />}
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  )
}
