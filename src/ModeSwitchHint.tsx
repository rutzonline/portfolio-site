import { useLayoutEffect, useState } from "react"

export function ModeSwitchHint({ visible }: { visible: boolean }) {
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
    window.addEventListener("scroll", update, true)
    return () => { observer.disconnect(); window.removeEventListener("resize", update); window.removeEventListener("scroll", update, true) }
  }, [visible])
  if (!visible || !position) return null
  return <div className="slideshow-mode-hint" aria-hidden="true" style={{ left: position.left, top: position.top }}>
    <svg width="230" height="80" viewBox="0 0 230 80" fill="none">
      <path d={`M90 49 Q${position.tip} 55 ${position.tip} 0 m-5 7 5-7 5 7`} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span>switch modes here</span>
  </div>
}
