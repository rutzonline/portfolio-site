import { useEffect, useState } from "react"
import { fetchTable } from "@/lib/supabase"

export type Site = { name: string; image_url?: string; url?: string }
export type Brand = { name: string; group: string; platforms?: string[]; logo_url?: string; description: string; url?: string }
export type Campaign = { kicker: string; brand: string; description: string; image_url?: string; url?: string }
export type Newsletter = { title: string; category: string; description: string; url?: string }

// Copy corrections for the public moodboard, keyed to exact source wording.
const copyCorrections: Record<string, string> = {
  "intership": "internship",
  "corpprate enery": "corporate energy",
  "art.clay": "art. clay",
  "employee led content": "employee-led content",
  "marketing depts wildest dreams": "marketing department's wildest dreams",
  "what [urpose does my life have] i if": "what purpose does my life have if",
  "massive fanbase": "a massive fanbase",
  "short-form accessibility has made": "short-form accessibility have made",
  "macro-economic": "macroeconomic",
  "instgram": "instagram",
  "about the products was just": "about the products were just",
  "the team's super casual, candid outlook on 'build in public' loop and witty jabs at competition approach has made its presence known for good.": "the team's super casual, candid approach to building in public and witty jabs at competitors have made its presence known.",
  "i organize": "i organise",
  "extensive organization": "extensive organisation",
  "cult favorite": "cult favourite",
  "skits satirizing": "skits satirising",
  "Lenny's Newsletters": "Lenny's Newsletter",
}

const proofread = (text: string) =>
  Object.entries(copyCorrections)
    .reduce((copy, [original, corrected]) => copy.split(original).join(corrected), text)
    .trim()

const href = (u?: string | null) => {
  const clean = u?.trim()
  return clean ? (/^https?:\/\//.test(clean) ? clean : `https://${clean}`) : undefined
}

// Column mapping: Supabase table -> UI shape. Rename columns here if the schema changes.
const sources = {
  sites: {
    table: "cool_websites",
    map: (r: any): Site => ({ name: proofread(r.name), image_url: r.image_url || undefined, url: href(r.url) }),
  },
  brands: {
    table: "brands",
    map: (r: any): Brand => ({ name: proofread(r.name), group: r.subsection || r.category || "more", platforms: Array.isArray(r.platforms) ? r.platforms : typeof r.platforms === "string" ? r.platforms.split(/[,;|]/).map((platform: string) => platform.trim()) : [], logo_url: r.image_url || undefined, description: proofread(r.description ?? ""), url: href(r.url) }),
  },
  campaigns: {
    table: "campaigns",
    map: (r: any): Campaign => ({ kicker: (r.title ?? "").trim(), brand: proofread(r.brand_name), description: proofread(r.description ?? ""), image_url: r.image_url || undefined, url: href(r.url) }),
  },
  newsletters: {
    table: "newsletters",
    map: (r: any): Newsletter => ({ title: proofread(r.name), category: r.category ?? "", description: proofread(r.description ?? ""), url: href(r.url) }),
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
