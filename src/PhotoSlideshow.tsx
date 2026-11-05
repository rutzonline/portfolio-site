import { cameraPhoto } from "@/CameraOpening"
import { mediaSrc } from "@/media"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { fetchTable } from "@/lib/supabase"

type PhotoRow = { url?: string }
let photoRequest: Promise<string[]> | null = null
const lastStartKey = "portfolio:last-slideshow-start"
// Curated night / dark-interior photos, rather than dimmed daytime scenes.
const darkPhotos = [
  "https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/unnamed.jpg",
  "https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/IMG_8801.jpg",
  "https://mzelpafnpdcchykekdux.supabase.co/storage/v1/object/public/photos/original%202024-11-02%20181046.651.jpg",
]

export function getPhotos() {
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

export default function PhotoSlideshow({ active, portrait, portraitAlt, coverDuration, onReturnHome, onHintVisibilityChange }: {
  active: boolean; portrait: string; portraitAlt: string; coverDuration: number; onReturnHome?: () => void; onHintVisibilityChange?: (visible: boolean) => void
}) {
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [photos, setPhotos] = useState<string[]>([])
  const [shown, setShown] = useState<string | null>(null)
  const [shownPortrait, setShownPortrait] = useState(portrait)
  const [coverCycle, setCoverCycle] = useState(portrait)
  const coverAlts = useRef(new Map([[portrait, portraitAlt]]))
  // Each cover gets its own deadline; the photo cadence remains 7 seconds.
  const coverDeadlines = useRef(new Map([[portrait, Date.now() + coverDuration]]))
  const visited = useRef(new Set([portrait]))
  const [previous, setPrevious] = useState<string | null>(null)
  const enabled = desktop
  const startIfNeeded = useRef<() => void>(() => {})
  const returnToHome = useRef<() => void>(() => {})
  const pageActive = useRef(active)
  pageActive.current = active
  const cueStage = useRef<"pending" | "hint" | "camera" | "done">("pending")
  const [hintPhoto] = useState(() => {
    let last: string | null = null
    try { last = localStorage.getItem(lastStartKey) } catch {}
    const choices = darkPhotos.filter(photo => photo !== last)
    return choices[Math.floor(Math.random() * choices.length)]
  })
  const [isHintPhoto, setIsHintPhoto] = useState(false)

  useEffect(() => {
    // These local snapshots are decoded while the cover is still showing,
    // so returning home can reveal the queued hint immediately.
    for (const src of [...darkPhotos, cameraPhoto]) {
      const image = new Image()
      image.src = mediaSrc(src)
      image.decode().catch(() => {})
    }
  }, [])

  // Only a view's first visit shows its cover. Apply this before painting so
  // returning to a visited view cannot flash its portrait for a frame.
  useLayoutEffect(() => {
    if (!visited.current.has(portrait)) {
      visited.current.add(portrait)
      coverAlts.current.set(portrait, portraitAlt)
      coverDeadlines.current.set(portrait, Date.now() + coverDuration)
      setCoverCycle(portrait)
    } else {
      setShownPortrait(coverCycle)
    }
  }, [portrait])

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
    startIfNeeded.current = () => {}
    if (!enabled) {
      setShown(null)
      setPrevious(null)
      return
    }
    if (!photos.length) return
    let cancelled = false
    let pending = false
    let request = 0
    let timer: number | undefined
    let remaining: string[] = []
    let current: string | null = null
    let firstCycle = true
    const failed = new Set<string>()
    const autoPlay = !reducedMotion
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(advance, 7000)
    }
    const load = (next: string, kind: "hint" | "camera" | "random") => {
      window.clearTimeout(timer)
      const id = ++request
      pending = true
      const image = new Image()
      image.onload = async () => {
        try { await image.decode() } catch {}
        if (cancelled || id !== request) return
        pending = false
        setPrevious(current)
        current = next
        const hintVisible = kind === "hint" && !pageActive.current
        if (hintVisible) {
          cueStage.current = "hint"
          try { localStorage.setItem(lastStartKey, next) } catch {}
        } else if (kind === "camera") cueStage.current = "done"
        setIsHintPhoto(hintVisible)
        setShownPortrait(coverCycle)
        setShown(next)
        if (autoPlay) schedule()
      }
      image.onerror = () => {
        if (cancelled || id !== request) return
        pending = false
        failed.add(next)
        if (kind === "camera") cueStage.current = "done"
        advance()
      }
      image.src = mediaSrc(next)
    }
    const showCue = () => {
      const next = [hintPhoto, ...darkPhotos].find(photo => !failed.has(photo))
      if (next) load(next, "hint")
      else {
        // Never substitute a bright photo behind the white hint.
        cueStage.current = "camera"
        advance()
      }
    }
    const advance = () => {
      if (cancelled || pending) return
      window.clearTimeout(timer)
      if (document.hidden) { schedule(); return }
      if (!pageActive.current && cueStage.current === "pending") {
        showCue()
        return
      }
      if (cueStage.current === "hint" || cueStage.current === "camera") {
        cueStage.current = "camera"
        load(cameraPhoto, "camera")
        return
      }
      if (!remaining.length) {
        remaining = photos.filter(photo => !failed.has(photo) &&
          (!firstCycle || (photo !== cameraPhoto && !darkPhotos.includes(photo))))
        firstCycle = false
        if (!remaining.length) remaining = photos.filter(photo => !failed.has(photo))
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
        }
        const last = remaining.length - 1
        if (last > 0 && remaining[last] === current) {
          ;[remaining[0], remaining[last]] = [remaining[last], remaining[0]]
        }
      }
      const next = remaining.pop()
      if (next && next !== current) load(next, "random")
    }
    startIfNeeded.current = () => { if (!current) advance() }
    returnToHome.current = () => {
      if (cueStage.current === "pending") showCue()
    }
    const firstPhotoAt = coverDeadlines.current.get(coverCycle) ?? Date.now()
    timer = window.setTimeout(advance, Math.max(0, firstPhotoAt - Date.now()))
    const resume = () => { if (!current && Date.now() >= firstPhotoAt) advance() }
    document.addEventListener("visibilitychange", resume)
    return () => {
      cancelled = true
      startIfNeeded.current = () => {}
      returnToHome.current = () => {}
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", resume)
    }
  }, [enabled, photos, reducedMotion, coverCycle, hintPhoto])

  // Inner pages can keep playing photos, but cannot consume the homepage hint.
  const wasActive = useRef(active)
  const homeReturnPending = useRef(false)
  useEffect(() => {
    if (wasActive.current && !active) homeReturnPending.current = true
    wasActive.current = active
    if (active) startIfNeeded.current()
    else if (homeReturnPending.current && photos.length && enabled) {
      homeReturnPending.current = false
      returnToHome.current()
    }
  }, [active, photos.length, enabled])

  const showPhoto = enabled && shown && visited.current.has(portrait) && shownPortrait === coverCycle
  useEffect(() => {
    onHintVisibilityChange?.(Boolean(showPhoto && isHintPhoto && !active))
  }, [showPhoto, isHintPhoto, active, onHintVisibilityChange])

  return (
    <div className="absolute inset-0">
      <img key={coverCycle} src={coverCycle} alt={showPhoto ? "" : coverAlts.current.get(coverCycle)}
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
          {previous && <img key={previous} src={mediaSrc(previous)} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <img key={shown} src={mediaSrc(shown)} alt="" className="photo-fade-in absolute inset-0 h-full w-full object-cover" />
        </>
      )}
      {onReturnHome && <button type="button" aria-label="Return to homepage"
        onClick={onReturnHome}
        onContextMenu={(event) => { if (!showPhoto) event.preventDefault() }}
        className="absolute inset-0 cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white" />}

    </div>
  )
}
