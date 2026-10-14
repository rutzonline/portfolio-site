import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type Track = { src: string; song: string; artist: string }
type Card = Track & { id: number; x: number; y: number; flipped: boolean; expires: number }
type Status = "loading" | "ready" | "not_configured" | "unavailable" | "empty"

// Adapted from rutzonline/MacOS-portfolio's desktop/photo-trail.tsx.
export default function MusicTrail({ suspended = false }: { suspended?: boolean }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [status, setStatus] = useState<Status>("loading")
  const [attempt, setAttempt] = useState(0)
  const [active, setActive] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const button = useRef<HTMLButtonElement>(null)
  const order = useRef<Track[]>([])
  const nextId = useRef(0)
  const wantsStart = useRef(false)
  const lastPoint = useRef({ x: -1000, y: -1000 })
  const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)

  useEffect(() => {
    const controller = new AbortController()
    setStatus("loading")
    fetch("/api/lastfm/recent-tracks", { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json()
        if (controller.signal.aborted) return
        if (!response.ok) { setStatus(data.status === "not_configured" ? "not_configured" : "unavailable"); return }
        const received: Track[] = Array.isArray(data.tracks) ? data.tracks.filter((t: Track) => t.src?.startsWith("https://") && t.song && t.artist) : []
        setTracks(received)
        setStatus(received.length ? "ready" : "empty")
        order.current = []
        if (received.length && wantsStart.current) setActive(true)
      })
      .catch(() => { if (!controller.signal.aborted) setStatus("unavailable") })
    return () => controller.abort()
  }, [attempt])

  const spawn = (x: number, y: number) => {
    if (!tracks.length) return
    if (!order.current.length) {
      order.current = [...tracks]
      for (let i = order.current.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[order.current[i], order.current[j]] = [order.current[j], order.current[i]]
      }
    }
    const track = order.current.pop()!
    const size = window.innerWidth < 640 ? 150 : 190
    const card = { ...track, id: nextId.current++, x: Math.max(12, Math.min(window.innerWidth - size - 12, x - size / 2)), y: Math.max(12, Math.min(window.innerHeight - size - 72, y - size / 2)), flipped: false, expires: Date.now() + 1600 }
    setCards((previous) => [...previous.filter((c) => c.flipped).slice(-5), ...previous.filter((c) => !c.flipped).slice(-5), card])
  }
  const spawnRef = useRef(spawn)
  spawnRef.current = spawn
  const stop = () => { setActive(false); setCards([]); wantsStart.current = false }

  useEffect(() => {
    if (suspended) { setActive(false); setCards([]); wantsStart.current = false }
  }, [suspended])

  useEffect(() => {
    if (!active || suspended) return
    lastPoint.current = { x: -1000, y: -1000 }
    spawnRef.current(window.innerWidth / 2, window.innerHeight / 2)
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reducedMotion) return
      if (Math.hypot(event.clientX - lastPoint.current.x, event.clientY - lastPoint.current.y) < 100) return
      lastPoint.current = { x: event.clientX, y: event.clientY }
      spawnRef.current(event.clientX, event.clientY)
    }
    const end = () => { setActive(false); setCards([]); wantsStart.current = false }
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { end(); button.current?.focus({ preventScroll: true }) } }
    const timer = window.setInterval(() => setCards((current) => current.filter((card) => card.flipped || card.expires + 300 > Date.now())), 100)
    window.addEventListener("pointermove", move)
    window.addEventListener("dblclick", end)
    window.addEventListener("keydown", key)
    return () => { clearInterval(timer); window.removeEventListener("pointermove", move); window.removeEventListener("dblclick", end); window.removeEventListener("keydown", key) }
  }, [active, suspended, reducedMotion])

  return <div className="listen-to-me flex flex-col items-center">
    <button ref={button} type="button" aria-label={active ? "Stop music trail" : "Start music trail"} aria-pressed={active} disabled={status === "loading"}
      onClick={() => { if (active) stop(); else if (status === "ready") setActive(true); else { wantsStart.current = true; setAttempt((n) => n + 1) } }}
      className="upto-icon-button group flex flex-col items-center gap-3 rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d2e4b]">
      <span className="music-stack" aria-hidden="true">
        {[2, 1, 0].map((i) => <span key={i} className={`music-stack-sleeve sleeve-${i}`}>
          {tracks.length ? <img src={(tracks[i] ?? tracks[0]).src} alt="" draggable={false} /> : <span className="music-note">♪</span>}
        </span>)}
      </span>
      <span className="text-sm">{active ? "trailing…" : "listentome"}</span>
    </button>
    {!active && <p role="status" className="mt-2 max-w-48 text-center text-xs text-[#1A1A1A]/55">
      {status === "loading" ? "finding recent listens…" : status === "not_configured" ? "recent listens, coming soon" : status === "unavailable" ? "couldn’t load recent listens. tap to retry." : status === "empty" ? "no recent album covers yet" : "a trail of recent listens"}
    </p>}
    {active && !suspended && createPortal(<>
      <div className="music-trail-controls" role="region" aria-label="Music trail controls">
        <p className="text-xs">move to trail · click a cover to flip · double-click to stop</p>
        <div className="flex justify-center gap-4">
          <button type="button" onClick={() => spawn(window.innerWidth / 2, window.innerHeight / 2)} className="underline underline-offset-4">next cover</button>
          <button type="button" onClick={stop} className="underline underline-offset-4">stop</button>
        </div>
      </div>
      {cards.map((card) => <button key={card.id} type="button" aria-label={`${card.flipped ? "Hide" : "Show"} song: ${card.song} by ${card.artist}`} aria-pressed={card.flipped}
        onClick={() => setCards((current) => current.map((c) => c.id === card.id ? { ...c, flipped: !c.flipped, expires: Date.now() + 1600 } : c))}
        className={`music-trail-card ${card.flipped ? "is-flipped" : ""}`}
        style={{ left: card.x, top: card.y, zIndex: 60 + cards.indexOf(card), opacity: card.flipped || card.expires > Date.now() ? 1 : 0 }}>
        <span className="music-trail-card-inner">
          <span className="music-trail-front"><img src={card.src} alt="" draggable={false} /></span>
          <span className="music-trail-back"><span aria-hidden="true" className="text-2xl">♪</span><span className="font-body-serif text-lg leading-snug">{card.song}</span><span className="text-xs uppercase tracking-wider opacity-65">{card.artist}</span></span>
        </span>
      </button>)}
    </>, document.body)}
  </div>
}
