import { useEffect, useLayoutEffect, useState } from "react"

const sessionKey = "portfolio:intro-seen"
type Phase = "playing" | "revealing" | "reduced" | "done" | "skipped"

export function useHomeIntro(home: boolean) {
  const [initial] = useState<Phase>(() => {
    if (!home) return "done"
    try { if (sessionStorage.getItem(sessionKey)) return "done" } catch {}
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "playing"
  })
  const [phase, setPhase] = useState(initial)
  const [hint, setHint] = useState(initial === "playing")

  useEffect(() => {
    if (initial === "done") return
    try { sessionStorage.setItem(sessionKey, "1") } catch {}
    let cancelled = false
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))
    const skip = () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
      setPhase("skipped")
      setHint(false)
    }
    const events = ["pointerdown", "click", "keydown", "wheel", "touchstart", "scroll"] as const
    events.forEach(event => window.addEventListener(event, skip, { capture: true, passive: true }))
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    motion.addEventListener("change", skip)

    if (initial === "reduced") {
      later(() => setPhase("done"), 180)
    } else {
      // Decode the rendered grid images and fonts, but never hold the intro
      // longer than 1.5 seconds for a missing or slow asset.
      const assets = Promise.allSettled([
        document.fonts.ready,
        ...Array.from(document.querySelectorAll<HTMLImageElement>(".portfolio-card img"), image => image.decode()),
      ])
      const timeout = new Promise<void>(resolve => later(resolve, 1500))
      const shuffle = new Promise<void>(resolve => later(resolve, 1500))
      Promise.all([Promise.race([assets, timeout]), shuffle]).then(() => {
        if (cancelled) return
        setPhase("revealing")
        later(() => setPhase("done"), 810)
        later(() => setHint(false), 1810)
      })
    }
    return () => {
      cancelled = true
      timers.forEach(window.clearTimeout)
      events.forEach(event => window.removeEventListener(event, skip, true))
      motion.removeEventListener("change", skip)
    }
  }, [initial])

  return { phase: home ? phase : "skipped", hint: home && hint }
}

export function MarketerTitle({ mode, shuffle }: { mode: "brand" | "growth"; shuffle: boolean }) {
  const words = ["product", "growth", "brand", "product", mode]
  return <p className="marketer-title">
    <span className="sr-only">{mode} marketer</span>
    <span aria-hidden="true" className="marketer-word">
      {shuffle ? <span className="marketer-roll">{words.map((word, index) => <span key={index}>{word}</span>)}</span> : mode}
    </span>
    <span aria-hidden="true">marketer</span>
  </p>
}

export function IntroModeHint({ visible }: { visible: boolean }) {
  const [position, setPosition] = useState<{ left: number; top: number; tip: number } | null>(null)
  useLayoutEffect(() => {
    if (!visible) return
    const update = () => {
      const toggle = document.querySelector(".mode-switch")
      if (!toggle) return
      const rect = toggle.getBoundingClientRect()
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - 230))
      setPosition({ left, top: rect.bottom + 8, tip: rect.left + rect.width / 2 - left })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.documentElement)
    window.addEventListener("resize", update)
    return () => { observer.disconnect(); window.removeEventListener("resize", update) }
  }, [visible])
  if (!visible || !position) return null
  return <div className="intro-mode-hint" aria-hidden="true" style={{ left: position.left, top: position.top }}>
    <svg width="230" height="80" viewBox="0 0 230 80" fill="none">
      <path d={`M90 49 Q${position.tip} 55 ${position.tip} 0 m-5 7 5-7 5 7`} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>switch modes here</span>
  </div>
}
