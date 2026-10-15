import { useEffect, useMemo, useRef, useState } from "react"
import { categories, loadEntries, type Entry, type Category } from "./data"
import { addDays, addMonths, labelDate, monthDays, todayKey, weekStart } from "./dates"
import "./consumption.css"

type Period = "month" | "week" | "year"
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
    <div className="consumption-entry-title">{entry.url ? <a href={entry.url} target="_blank" rel="noopener noreferrer">{entry.title}<svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" className="consumption-external" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 12 12 4M4 4h8v8" /></svg><span className="sr-only"> (opens in a new tab)</span></a> : <span>{entry.title}<small> — link unavailable</small></span>}</div>
    <div className="consumption-entry-meta"><span className={`consumption-badge category-${entry.category}`}><i className="consumption-dot" aria-hidden="true" />{titleCase(entry.category)}</span>{entry.platform && <span>{entry.platform}</span>}</div>
  </li>
}

export default function ConsumptionLog() {
  const [view, setView] = useState<"calendar" | "list">("calendar")
  const [period, setPeriod] = useState<Period>("month")
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

  const firstWeekDay = weekStart(date)
  const periodLabel = period === "year" ? date.slice(0, 4) : period === "month" ? labelDate(date, { month: "long", year: "numeric" }) : `${labelDate(firstWeekDay, { month: "short", day: "numeric", year: "numeric" })} – ${labelDate(addDays(firstWeekDay, 6), { month: "short", day: "numeric", year: "numeric" })}`
  const move = (direction: number) => setDate((current) => period === "week" ? addDays(current, direction * 7) : addMonths(current, direction * (period === "year" ? 12 : 1)))
  const visibleEntries = period === "year" ? entries.filter((entry) => entry.consumed_on.startsWith(date.slice(0, 4))) : period === "month" ? entries.filter((entry) => entry.consumed_on.startsWith(date.slice(0, 7))) : entries.filter((entry) => entry.consumed_on >= firstWeekDay && entry.consumed_on <= addDays(firstWeekDay, 6))

  return <section className="consumption-page consumption-embedded" aria-labelledby="consumption-title">
    <div className="consumption-content">
      <header className="consumption-header"><h2 id="consumption-title">consumption log</h2><p>using this space to keep track of things I've read, watched, and listened to.</p></header>
      <div className="consumption-toolbar">
        <div className="consumption-segment" role="group" aria-label="Log view">{(["calendar", "list"] as const).map((option) => <button type="button" key={option} aria-pressed={view === option} onClick={() => { setSelected(null); setView(option) }}>{titleCase(option)}</button>)}</div>
        {view === "calendar" && <div className="consumption-segment" role="group" aria-label="Calendar period">{(["month", "week", "year"] as const).map((option) => <button type="button" key={option} aria-pressed={period === option} onClick={() => setPeriod(option)}>{titleCase(option)}</button>)}</div>}
      </div>
      <ul className="consumption-legend" aria-label="Category color legend">{categories.map((category: Category) => <li key={category}><i className={`consumption-dot category-${category}`} aria-hidden="true" />{titleCase(category)}</li>)}</ul>
      {status === "loading" && <p className="consumption-state" role="status">Loading the consumption log…</p>}
      {status === "error" && <div className="consumption-state" role="alert"><p>Couldn’t load the consumption log. Please try again.</p><button type="button" className="consumption-action" onClick={() => setAttempt((n) => n + 1)}>Try again</button></div>}
      {status === "ready" && <>
        {view === "calendar" ? <>
          <div className="consumption-period-nav">
            <h2 aria-live="polite">{periodLabel}</h2>
            <div><button type="button" className="consumption-action" aria-label={`Previous ${period}`} disabled={Number(date.slice(0, 4)) <= 1} onClick={() => move(-1)}>‹</button><button type="button" className="consumption-action" onClick={() => { const now = todayKey(); setToday(now); setDate(now) }}>Today</button><button type="button" className="consumption-action" aria-label={`Next ${period}`} disabled={Number(date.slice(0, 4)) >= 9999} onClick={() => move(1)}>›</button></div>
          </div>
          {period === "month" && <Month date={date} grouped={grouped} today={today} onSelect={selectDate} />}
          {period === "year" && <div className="consumption-year">{Array.from({ length: 12 }, (_, month) => <Month key={month} date={`${date.slice(0, 4)}-${String(month + 1).padStart(2, "0")}-01`} grouped={grouped} today={today} onSelect={selectDate} compact />)}</div>}
          {period === "week" && <div className="consumption-week">{Array.from({ length: 7 }, (_, i) => { const day = addDays(firstWeekDay, i), dayEntries = grouped.get(day) ?? []; return <section key={day} className="consumption-week-day"><h3>{dayNames[i]}</h3><Day date={day} entries={dayEntries} today={today} onSelect={selectDate} /><p>{dayEntries.length ? `${dayEntries.length} ${dayEntries.length === 1 ? "entry" : "entries"}` : "No entries"}</p></section> })}</div>}
          {!visibleEntries.length && <p className="consumption-empty" role="status">{entries.length ? `No entries this ${period}. Browse another ${period} or open List to see all entries.` : "No published entries yet."}</p>}
        </> : <div className="consumption-list">
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
