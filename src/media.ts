import cachedMedia from "@/media-map.json"

const sources: Record<string, string> = cachedMedia

// URL-keyed snapshots keep new Supabase uploads working without a rebuild.
export function mediaSrc(src: string): string {
  return sources[src] ?? src
}
