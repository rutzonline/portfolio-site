import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { categories, loadEntries, type Entry } from "./data"
import { addMonths, labelDate, monthDays, todayKey } from "./dates"
import "./consumption.css"

const firstMonth = "2026-08-01"
const calendarDate = (date: string) => date < firstMonth ? firstMonth : date

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const titleCase = (text: string) => text[0].toUpperCase() + text.slice(1)

function CategoryFill({ entries }: { entries: Entry[] }) {
  const present = new Set(entries.map((entry) => entry.category))
  return <span className="consumption-category-fill" aria-hidden="true">{categories.filter((category) => present.has(category)).map((category) => <i key={category} className={`consumption-category-segment category-${category}`} />)}</span>
}

function Day({ date, entries, today, onSelect, compact = false }: { date: string; entries: Entry[]; today: string; onSelect: (date: string) => void; compact?: boolean }) {
  const button = useRef<HTMLButtonElement>(null)
  const tooltip = useRef<HTMLDivElement>(null)
  const tooltipId = useId()
  const [showTitles, setShowTitles] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closeTitles = useCallback(() => { clearTimeout(leaveTimer.current); setShowTitles(false) }, [])
  const openTitles = () => {
    clearTimeout(leaveTimer.current)
    window.dispatchEvent(new CustomEvent("consumption-tooltip-open", { detail: tooltipId }))
    setShowTitles(true)
  }
  const leaveTitles = () => { leaveTimer.current = setTimeout(closeTitles, 100) }
  useEffect(() => () => clearTimeout(leaveTimer.current), [])
  useLayoutEffect(() => {
    if (!showTitles || !button.current || !tooltip.current) return
    const anchor = button.current.getBoundingClientRect()
    const box = tooltip.current.getBoundingClientRect()
    setPosition({
      left: Math.max(12, Math.min(anchor.left + (anchor.width - box.width) / 2, window.innerWidth - box.width - 12)),
      top: anchor.bottom + box.height + 8 <= window.innerHeight ? anchor.bottom + 8 : Math.max(12, anchor.top - box.height - 8),
    })
  }, [showTitles])
  useEffect(() => {
    if (!showTitles) return
    const onOtherTooltip = (event: Event) => { if ((event as CustomEvent<string>).detail !== tooltipId) closeTitles() }
    window.addEventListener("consumption-tooltip-open", onOtherTooltip)
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeTitles() }
    const onScroll = (event: Event) => { if (!(event.target instanceof Node) || !tooltip.current?.contains(event.target)) closeTitles() }
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", closeTitles)
    return () => {
      window.removeEventListener("consumption-tooltip-open", onOtherTooltip)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", closeTitles)
    }
  }, [showTitles, closeTitles, tooltipId])
  const label = `${labelDate(date)}${entries.length ? `, ${entries.length} ${entries.length === 1 ? "entry" : "entries"}: ${[...new Set(entries.map((e) => titleCase(e.category)))].join(", ")}` : ", no entries"}`
  const content = <>{entries.length > 0 && <CategoryFill entries={entries} />}<span className="consumption-day-number">{Number(date.slice(8))}</span></>
  const className = `consumption-day ${compact ? "compact" : ""} ${date === today ? "is-today" : ""}`
  return entries.length ? <><button ref={button} type="button" className={className}
    aria-label={`${label}. ${entries.map((entry) => entry.title).join("; ")}`} aria-describedby={showTitles ? tooltipId : undefined}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") openTitles() }} onPointerLeave={leaveTitles}
    onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) openTitles() }} onBlur={closeTitles}
    aria-current={date === today ? "date" : undefined} onClick={() => { closeTitles(); onSelect(date) }}>{content}</button>
    {showTitles && createPortal(<div ref={tooltip} id={tooltipId} role="tooltip" className="consumption-date-tooltip" style={position}
      onPointerEnter={openTitles} onPointerLeave={leaveTitles}>
      {entries.map((entry) => <p key={entry.id}>{entry.title}</p>)}
    </div>, document.body)}</>
    : <div className={className} aria-label={label} aria-current={date === today ? "date" : undefined}>{content}</div>
}

function Month({ date, grouped, today, onSelect, compact = false }: { date: string; grouped: Map<string, Entry[]>; today: string; onSelect: (date: string) => void; compact?: boolean }) {
  return <section className={compact ? "consumption-mini-month" : ""} aria-label={labelDate(date, { month: "long", year: "numeric" })}>
    {compact && <h3>{labelDate(date, { month: "long" })}</h3>}
    <div className="consumption-weekdays" aria-hidden="true">{dayNames.map((day) => <span key={day}>{compact ? day[0] : day}</span>)}</div>
    <div className="consumption-month-grid">
      {monthDays(date).map((day, index) => day ? <Day key={day} date={day} entries={grouped.get(day) ?? []} today={today} onSelect={onSelect} compact={compact} /> : <div key={`blank-${index}`} aria-hidden="true" />)}
    </div>
  </section>
}

function EntryRow({ entry }: { entry: Entry }) {
  return <li className="consumption-entry">
    <span className={`consumption-badge category-${entry.category}`}>{titleCase(entry.category)}</span>
    <div className="consumption-entry-title">{entry.url ? <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.title}<svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" className="consumption-external" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 12 12 4M4 4h8v8" /></svg><span className="sr-only"> (opens in a new tab)</span></a> : <span>{entry.title}<small> — link unavailable</small></span>}</div>
  </li>
}

export default function ConsumptionLog() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [today, setToday] = useState(todayKey)
  const [date, setDate] = useState(() => calendarDate(todayKey()))
  const [entries, setEntries] = useState<Entry[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const groups = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const refreshToday = () => setToday(todayKey())
    const timer = window.setInterval(refreshToday, 60000)
    window.addEventListener("focus", refreshToday)
    return () => { clearInterval(timer); window.removeEventListener("focus", refreshToday) }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort("timeout"), 20000)
    setStatus("loading")
    loadEntries(controller.signal).then((data) => { if (!controller.signal.aborted) { setEntries(data); setStatus("ready") } })
      .catch(() => { if (!controller.signal.aborted || controller.signal.reason === "timeout") setStatus("error") })
      .finally(() => clearTimeout(timeout))
    return () => { clearTimeout(timeout); controller.abort() }
  }, [attempt])

  const grouped = useMemo(() => {
    const map = new Map<string, Entry[]>()
    for (const entry of entries) { const group = map.get(entry.consumed_on) ?? []; group.push(entry); map.set(entry.consumed_on, group) }
    return map
  }, [entries])
  const dates = [...grouped.keys()]
  const selectDate = (day: string) => { setDate(calendarDate(day)); setSelected(day); setView("list") }
  useEffect(() => {
    if (view !== "list" || !selected) return
    const group = groups.current.get(selected)
    const scroller = group?.closest<HTMLElement>(window.matchMedia("(max-width: 1023px)").matches ? ".page-article" : ".growth-upto")
    if (!group || !scroller) return
    group.focus({ preventScroll: true })
    // Scroll only the log panel: scrollIntoView also moves the outer shell and document.
    const navHeight = scroller.querySelector<HTMLElement>(":scope > .mobile-page-nav")?.offsetHeight ?? 0
    const top = scroller.scrollTop + group.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientTop - navHeight - 24
    scroller.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }, [view, selected])

  const periodLabel = labelDate(date, { month: "long", year: "numeric" })
  const move = (direction: number) => setDate((current) => calendarDate(addMonths(current, direction)))

  return <section className="consumption-page consumption-embedded" aria-labelledby="consumption-title">
    <div className="consumption-content">
      <header className="consumption-header"><h2 id="consumption-title">consumption log</h2><p>using this space to keep track of things I've read, watched, and listened to.</p></header>
      <div className="consumption-toolbar">
        <div className="consumption-segment" role="group" aria-label="Log view">{(["calendar", "list"] as const).map((option) => <button type="button" key={option} aria-pressed={view === option} onClick={() => { setSelected(null); setView(option) }}>{titleCase(option)}</button>)}</div>
        {view === "calendar" && <>
          <h3 className="consumption-month-label" aria-live="polite">{periodLabel}</h3>
          <div className="consumption-month-controls">
            <button type="button" className="consumption-action" aria-label="Previous month" disabled={date.slice(0, 7) <= "2026-08"} onClick={() => move(-1)}>‹</button>
            <button type="button" className="consumption-action" onClick={() => { const now = todayKey(); setToday(now); setDate(calendarDate(now)) }}>Today</button>
            <button type="button" className="consumption-action" aria-label="Next month" disabled={Number(date.slice(0, 4)) >= 9999} onClick={() => move(1)}>›</button>
          </div>
        </>}
      </div>
      {status === "loading" && <p className="consumption-state" role="status">Loading the consumption log…</p>}
      {status === "error" && <div className="consumption-state" role="alert"><p>Couldn’t load the consumption log. Please try again.</p><button type="button" className="consumption-action" onClick={() => setAttempt((n) => n + 1)}>Try again</button></div>}
      {status === "ready" && <>
        {view === "calendar" ? <Month date={date} grouped={grouped} today={today} onSelect={selectDate} /> : <div className="consumption-list">
          {!dates.length && <p className="consumption-state">No published entries yet.</p>}
          {dates.map((day) => <section key={day} ref={(node) => { if (node) groups.current.set(day, node); else groups.current.delete(day) }} tabIndex={-1} aria-labelledby={`date-${day}`} className={`consumption-date-group ${selected === day ? "is-selected" : ""}`}>
            <h2 id={`date-${day}`}><time dateTime={day}>{labelDate(day)}</time></h2>
            <ul>{grouped.get(day)!.map((entry) => <EntryRow key={entry.id} entry={entry} />)}</ul>
          </section>)}
        </div>}
      </>}
    </div>
  </section>
}
