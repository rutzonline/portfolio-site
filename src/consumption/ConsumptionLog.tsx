import { useEffect, useMemo, useRef, useState } from "react"
import { categories, loadEntries, type Entry } from "./data"
import { addMonths, labelDate, monthDays, todayKey } from "./dates"
import "./consumption.css"

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const titleCase = (text: string) => text[0].toUpperCase() + text.slice(1)

function Dots({ entries }: { entries: Entry[] }) {
  const present = new Set(entries.map((entry) => entry.category))
  return <span className="consumption-dots" aria-hidden="true">{categories.filter((category) => present.has(category)).map((category) => <i key={category} className={`consumption-dot category-${category}`} />)}</span>
}

function Day({ date, entries, today, onSelect, compact = false }: { date: string; entries: Entry[]; today: string; onSelect: (date: string) => void; compact?: boolean }) {
  const label = `${labelDate(date)}${entries.length ? `, ${entries.length} ${entries.length === 1 ? "entry" : "entries"}: ${[...new Set(entries.map((e) => titleCase(e.category)))].join(", ")}` : ", no entries"}`
  const content = <><span>{Number(date.slice(8))}</span><Dots entries={entries} /></>
  const className = `consumption-day ${compact ? "compact" : ""} ${date === today ? "is-today" : ""}`
  return entries.length ? <button type="button" className={className} aria-label={label} aria-current={date === today ? "date" : undefined} onClick={() => onSelect(date)}>{content}</button>
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
  const [date, setDate] = useState(todayKey)
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
  const selectDate = (day: string) => { setDate(day); setSelected(day); setView("list") }
  useEffect(() => {
    if (view !== "list" || !selected) return
    const group = groups.current.get(selected)
    group?.focus({ preventScroll: true })
    group?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })
  }, [view, selected])

  const periodLabel = labelDate(date, { month: "long", year: "numeric" })
  const move = (direction: number) => setDate((current) => addMonths(current, direction))

  return <section className="consumption-page consumption-embedded" aria-labelledby="consumption-title">
    <div className="consumption-content">
      <header className="consumption-header"><h2 id="consumption-title">consumption log</h2><p>using this space to keep track of things I've read, watched, and listened to.</p></header>
      <div className="consumption-toolbar">
        <div className="consumption-segment" role="group" aria-label="Log view">{(["calendar", "list"] as const).map((option) => <button type="button" key={option} aria-pressed={view === option} onClick={() => { setSelected(null); setView(option) }}>{titleCase(option)}</button>)}</div>
        {view === "calendar" && <>
          <h3 className="consumption-month-label" aria-live="polite">{periodLabel}</h3>
          <div className="consumption-month-controls">
            <button type="button" className="consumption-action" aria-label="Previous month" disabled={Number(date.slice(0, 4)) <= 1} onClick={() => move(-1)}>‹</button>
            <button type="button" className="consumption-action" onClick={() => { const now = todayKey(); setToday(now); setDate(now) }}>Today</button>
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
