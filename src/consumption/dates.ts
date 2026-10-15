// Consumption dates are civil dates, never timestamps. UTC is used only as a
// timezone-independent arithmetic/formatting coordinate system.
export function dateValue(key: string): Date {
  const [year, month, day] = key.split("-").map(Number)
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(12, 0, 0, 0)
  return date
}
export function dateKey(date: Date): string {
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`
}
export function todayKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}
export function validDate(key: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && dateKey(dateValue(key)) === key
}
export function addDays(key: string, days: number): string {
  const date = dateValue(key); date.setUTCDate(date.getUTCDate() + days); return dateKey(date)
}
export function monthStart(key: string): string { return `${key.slice(0, 7)}-01` }
export function addMonths(key: string, months: number): string {
  const date = dateValue(monthStart(key)); date.setUTCMonth(date.getUTCMonth() + months); return dateKey(date)
}
export function weekStart(key: string): string { return addDays(key, -dateValue(key).getUTCDay()) }
export function monthDays(key: string): (string | null)[] {
  const start = monthStart(key), first = weekStart(start)
  return Array.from({ length: 42 }, (_, i) => { const day = addDays(first, i); return day.slice(0, 7) === key.slice(0, 7) ? day : null })
}
export function labelDate(key: string, options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" }): string {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(dateValue(key))
}
