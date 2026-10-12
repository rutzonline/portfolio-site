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

export default function PhotoSlideshow({ active, portrait, onReturnHome }: {
  active: boolean; portrait: string; onReturnHome?: () => void
}) {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [photos, setPhotos] = useState<string[]>([])
  const [shown, setShown] = useState<string | null>(null)
  const [shownPortrait, setShownPortrait] = useState(portrait)
  const [previous, setPrevious] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const enabled = desktop
  const startIfNeeded = useRef<() => void>(() => {})

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
    setShown(null)
    setPrevious(null)
    startIfNeeded.current = () => {}
    if (!enabled) {
      return
    }
    if (!photos.length) return
    let cancelled = false
    let pending = false
    let timer: number | undefined
    let remaining: string[] = []
    let current: string | null = null
    const failed = new Set<string>()
    const autoPlay = !reducedMotion && photos.length > 1
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(advance, 15000)
    }
    const advance = () => {
      if (cancelled || pending) return
      window.clearTimeout(timer)
      if (document.hidden || pausedRef.current) {
        schedule()
        return
      }
      if (!remaining.length) {
        remaining = photos.filter((photo) => !failed.has(photo))
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
        }
        // Avoid repeating the last photo at the start of a new shuffled cycle.
        const last = remaining.length - 1
        if (last > 0 && remaining[last] === current) {
          ;[remaining[0], remaining[last]] = [remaining[last], remaining[0]]
        }
      }
      const next = remaining.pop()
      if (!next || next === current) return
      pending = true
      const image = new Image()
      image.onload = async () => {
        // Decode before swapping layers so a cached or large image never
        // leaves a blank frame during the crossfade.
        try { await image.decode() } catch {}
        if (cancelled) return
        pending = false
        setPrevious(current)
        current = next
        setShownPortrait(portrait)
        setShown(current)
        if (autoPlay) schedule()
      }
      image.onerror = () => {
        if (cancelled) return
        pending = false
        failed.add(next)
        if (failed.size < photos.length) advance()
      }
      image.src = next
    }
    startIfNeeded.current = () => { if (!current) advance() }
    // Give the initial cover, and each newly selected view's cover, a full
    // dwell before starting photos. Returning home does not restart this effect.
    const firstPhotoAt = Date.now() + 15000
    schedule()
    const resume = () => { if (!current && Date.now() >= firstPhotoAt) advance() }
    document.addEventListener("visibilitychange", resume)
    return () => {
      cancelled = true
      startIfNeeded.current = () => {}
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", resume)
    }
  }, [enabled, photos, reducedMotion, portrait])

  // Opening a page starts photos immediately. Page navigation never resets
  // the running slideshow; a view toggle still gets its own cover dwell.
  useEffect(() => {
    if (active) startIfNeeded.current()
  }, [active, photos.length, enabled])

  const showPhoto = enabled && shown && shownPortrait === portrait
  return (
    <div className="absolute inset-0">
      <img src={portrait} alt={showPhoto ? "" : "Portrait of Rutuja Rochkari"}
        aria-hidden={Boolean(showPhoto)}
        draggable={false}
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        style={{ WebkitTouchCallout: "none" }}
        className="pointer-events-none absolute inset-0 h-full w-full select-none border-0 object-cover object-[center_35%]" />
      {!showPhoto && <div aria-hidden="true" className="absolute inset-0 select-none"
        onContextMenu={(event) => event.preventDefault()}
        onDragStart={(event) => event.preventDefault()}
        style={{ WebkitTouchCallout: "none" }} />}
      {showPhoto && (
        <>
          {previous && <img key={previous} src={previous} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <img key={shown} src={shown} alt="" className="photo-fade-in absolute inset-0 h-full w-full object-cover" />
        </>
      )}
      {onReturnHome && <button type="button" aria-label="Return to homepage"
        onClick={onReturnHome}
        onContextMenu={(event) => { if (!showPhoto) event.preventDefault() }}
        className="absolute inset-0 cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white" />}
      {showPhoto && photos.length > 1 && !reducedMotion && (
            <button type="button" onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Play photo slideshow" : "Pause photo slideshow"}
              title={paused ? "Play slideshow" : "Pause slideshow"}
              className="absolute bottom-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
                {paused ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zm6 0h4v14h-4z" />}
              </svg>
            </button>
          )}
    </div>
  )
}
