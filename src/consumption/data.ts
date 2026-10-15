import { readPublicRows } from "../lib/supabase"
import { validDate } from "./dates"

export const categories = ["video", "article", "newsletter", "post", "podcast"] as const
export type Category = typeof categories[number]
export type Entry = { id: string; consumed_on: string; title: string; url: string | null; category: Category; platform: string | null; sort_order: number; published: true }
type Row = Record<string, unknown>

export function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null
  const text = value.trim()
  try {
    const url = new URL(/^[\w.-]+\.[a-z]{2,}(?:[/?#]|$)/i.test(text) ? `https://${text}` : text)
    return ["https:", "http:"].includes(url.protocol) ? url.href : null
  } catch { return null }
}

export function normalizeRows(rows: Row[]): Entry[] {
  return rows.flatMap((row) => {
    if (row.published !== true) return []
    if (typeof row.id !== "string" || typeof row.title !== "string" || !row.title.trim() || typeof row.consumed_on !== "string" || !validDate(row.consumed_on) || !categories.includes(row.category as Category)) {
      throw new Error("A published entry has invalid required fields")
    }
    return [{ id: row.id, consumed_on: row.consumed_on, title: row.title.trim(), url: safeUrl(row.url), category: row.category as Category,
      platform: typeof row.platform === "string" && row.platform.trim() ? row.platform.trim() : null,
      sort_order: typeof row.sort_order === "number" ? row.sort_order : 0, published: true as const }]
  }).sort((a, b) => b.consumed_on.localeCompare(a.consumed_on) || a.sort_order - b.sort_order || a.id.localeCompare(b.id))
}

export async function loadEntries(signal: AbortSignal): Promise<Entry[]> {
  const rows: Row[] = []
  let legacy = false
  let offset = 0
  while (true) {
    const query = new URLSearchParams({
      select: `id,consumed_on,title,url,category,platform,published${legacy ? "" : ",sort_order"}`,
      published: "is.true", order: `consumed_on.desc,${legacy ? "" : "sort_order.asc,"}id.asc`, limit: "200", offset: String(offset),
    })
    let page
    try { page = await readPublicRows<Row>("consumption_logs", query, signal) }
    catch (error) {
      // Existing dashboard-created table predates the ordering migration.
      // Preserve its entries until the additive migration is applied.
      if (!legacy && offset === 0 && (error as { code?: string }).code === "42703") { legacy = true; continue }
      throw error
    }
    rows.push(...page.rows)
    offset += page.rows.length
    if (!page.rows.length || (page.total !== null ? offset >= page.total : page.rows.length < 200)) break
  }
  return normalizeRows([...new Map(rows.map((row) => [row.id, row])).values()])
}
