import { useEffect, useState } from "react"
import { fetchTable } from "@/lib/supabase"

export type Site = { name: string; image_url?: string; url?: string }
export type Brand = { name: string; group: string; logo_url?: string; description: string; url?: string }
export type Campaign = { kicker: string; brand: string; description: string; image_url?: string; url?: string }
export type Newsletter = { title: string; category: string; description: string; url?: string }

const href = (u?: string | null) => (u ? (/^https?:\/\//.test(u) ? u : `https://${u}`) : undefined)

// Column mapping: Supabase table -> UI shape. Rename columns here if the schema changes.
const sources = {
  sites: {
    table: "cool_websites",
    map: (r: any): Site => ({ name: r.name, image_url: r.image_url || undefined, url: href(r.url) }),
  },
  brands: {
    table: "brands",
    map: (r: any): Brand => ({ name: r.name, group: r.subsection || r.category || "more", logo_url: r.image_url || undefined, description: r.description ?? "", url: href(r.url) }),
  },
  campaigns: {
    table: "campaigns",
    map: (r: any): Campaign => ({ kicker: (r.title ?? "").trim(), brand: r.brand_name, description: r.description ?? "", image_url: r.image_url || undefined, url: href(r.url) }),
  },
  newsletters: {
    table: "newsletters",
    map: (r: any): Newsletter => ({ title: r.name, category: r.category ?? "", description: r.description ?? "", url: href(r.url) }),
  },
}

type Sources = typeof sources
type Key = keyof Sources

export function useMoodboard<K extends Key>(key: K) {
  type Row = ReturnType<Sources[K]["map"]>
  const [rows, setRows] = useState<Row[]>([])
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  useEffect(() => {
    let off = false
    setStatus("loading")
    fetchTable<unknown>(sources[key].table)
      .then((r) => {
        if (off) return
        setRows(r.map((x) => sources[key].map(x) as Row))
        setStatus("ready")
      })
      .catch(() => !off && setStatus("error"))
    return () => {
      off = true
    }
  }, [key])
  return { rows, status }
}
