import { useEffect, useRef, useState, type ReactNode } from "react"
import Matter, { type Body } from "matter-js"

const charms = [1, 2, 3, 4, 5].map((id) => `/charms/${id}.png`)
const size = 80
const half = size / 2
const radius = 30

type Charm = { body: Body; element: HTMLImageElement }

// Adapted from MacOS-portfolio's contact-charms-playground, with local assets
// and a physics loop that only runs while charms are on screen.
export default function CharmPicker({ photos }: { photos: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const drop = useRef<((src: string) => void) | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    let dispose = () => {}
    setReady(false)
    setFailed(false)
    try {
      if (!stage.current || !layer.current) return
      const { Engine, Bodies, Body, Composite } = Matter
      const engine = Engine.create({ gravity: { x: 0, y: 2.2 }, enableSleeping: true })
      const block = stage.current
      const container = layer.current
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const entries: Charm[] = []
      let walls: Body[] = []
      let pending: string[] = []
      let rolling = false
      let rollStarted = 0
      let frame = 0
      let lastTime = 0
      let idleTimer = 0
      const remove = (entry: Charm) => { Composite.remove(engine.world, entry.body); entry.element.remove() }
      const makeWalls = () => {
        Composite.remove(engine.world, walls)
        const w = block.clientWidth, h = block.clientHeight
        const options = { isStatic: true, friction: 1, restitution: 0.05 }
        walls = [Bodies.rectangle(w / 2, h + 25 - (half - radius), w * 3, 50, options), Bodies.rectangle(-25, h / 2, 50, h * 3, options)]
        if (!rolling) walls.push(Bodies.rectangle(w + 25, h / 2, 50, h * 3, options))
        Composite.add(engine.world, walls)
      }
      const draw = ({ body, element }: Charm) => {
        element.style.transform = `translate(${body.position.x - size / 2}px, ${body.position.y - size / 2}px) rotate(${body.angle}rad)`
      }
      const scheduleRoll = () => {
        window.clearTimeout(idleTimer)
        idleTimer = window.setTimeout(() => {
          if (reducedMotion) { entries.splice(0).forEach(remove); return }
          rolling = true
          rollStarted = performance.now()
          makeWalls()
          entries.forEach(({ body }) => {
            Matter.Sleeping.set(body, false)
            Body.setVelocity(body, { x: 10 + Math.random() * 4, y: 0 })
            Body.setAngularVelocity(body, 0.3 + Math.random() * 0.4)
          })
        }, 2500)
      }
      const tick = (time: number) => {
        frame = 0
        Engine.update(engine, Math.min(lastTime ? time - lastTime : 1000 / 60, 1000 / 60))
        lastTime = time
        for (let i = entries.length - 1; i >= 0; i--) {
          const entry = entries[i]
          if (rolling) Body.applyForce(entry.body, entry.body.position, { x: 0.006, y: 0 })
          draw(entry)
          if (entry.body.position.x > block.clientWidth + size || entry.body.position.y > block.clientHeight + size || (rolling && time - rollStarted > 6000)) {
            remove(entry)
            entries.splice(i, 1)
          }
        }
        if (rolling && entries.length === 0) {
          rolling = false
          makeWalls()
          const queued = pending
          pending = []
          queued.forEach(spawn)
          if (queued.length) scheduleRoll()
        }
        if (entries.length && !frame) frame = requestAnimationFrame(tick)
        if (!entries.length) lastTime = 0
      }
      const spawn = (src: string) => {
        if (entries.length >= 40) remove(entries.shift()!)
        const x = reducedMotion ? half + (entries.length * size) % Math.max(size, block.clientWidth - size) : half + Math.random() * Math.max(0, block.clientWidth - size)
        const body = Bodies.circle(x, reducedMotion ? block.clientHeight - half : -half, radius, {
          restitution: 0.18, friction: 0.65, frictionAir: 0.009, density: 0.003,
          angle: reducedMotion ? 0 : Math.random() * Math.PI * 2,
        })
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 1.5 + Math.random() * 2 })
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2)
        const element = document.createElement("img")
        element.src = src
        element.alt = ""
        element.draggable = false
        element.className = "dropped-charm"
        container.appendChild(element)
        Composite.add(engine.world, body)
        const entry = { body, element }
        entries.push(entry)
        draw(entry)
        if (!reducedMotion && !frame) frame = requestAnimationFrame(tick)
      }
      makeWalls()
      const observer = new ResizeObserver(() => {
        makeWalls()
        entries.forEach((entry) => {
          Body.setPosition(entry.body, { x: Math.min(block.clientWidth - half, Math.max(half, entry.body.position.x)), y: Math.min(block.clientHeight - half, entry.body.position.y) })
          draw(entry)
        })
      })
      observer.observe(block)
      drop.current = (src) => {
        if (rolling) { if (pending.length < 40) pending.push(src) }
        else { spawn(src); scheduleRoll() }
      }
      setReady(true)
      dispose = () => {
        drop.current = null
        observer.disconnect()
        window.clearTimeout(idleTimer)
        cancelAnimationFrame(frame)
        entries.forEach(remove)
        Composite.clear(engine.world, false)
        Engine.clear(engine)
      }
    } catch { setFailed(true) }
    return () => dispose()
  }, [attempt])

  return <div className="charm-picker">
    <p className="charm-intro text-base text-[#1A1A1A]/65"><span className="lg:hidden">collect some charms before you go</span><span className="hidden lg:inline">collect some charms to put my tokenmaxxing to use</span></p>
    <div className="charm-controls">
        {charms.map((src, index) => <button key={src} type="button" disabled={!ready} aria-label={`Drop charm ${index + 1}`}
          onClick={() => { drop.current?.(src); setCount((n) => n + 1) }}
          className="charm-choice flex shrink-0 items-center justify-center rounded-xl border border-[#E5E1DA] bg-[#FAF9F6]/90 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7d2e4b] disabled:opacity-40">
          <img src={src} alt="" width="64" height="64" draggable={false} className="h-full w-full object-contain" />
        </button>)}
      {photos}
    </div>
    <div ref={stage} className="charm-stage">
      <div ref={layer} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />
    </div>
    <span className="sr-only" role="status">{count ? `${count} charms picked` : "Choose a charm to drop it"}</span>
    {failed && <button type="button" onClick={() => setAttempt((n) => n + 1)} className="text-sm underline">couldn’t load charms. try again</button>}
  </div>
}
