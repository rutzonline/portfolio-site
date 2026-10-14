type LastFmTrack = { name?: string; artist?: { "#text"?: string }; image?: { size?: string; "#text"?: string }[] }

export async function recentTracks(env: { LASTFM_API_KEY?: string; LASTFM_USERNAME?: string }): Promise<Response> {
  const headers = { "Cache-Control": "no-store" }
  if (!env.LASTFM_API_KEY) return Response.json({ tracks: [], status: "not_configured" }, { status: 503, headers })
  const url = new URL("https://ws.audioscrobbler.com/2.0/")
  url.search = new URLSearchParams({ method: "user.getrecenttracks", user: env.LASTFM_USERNAME || "rutzonline", api_key: env.LASTFM_API_KEY, format: "json", limit: "20" }).toString()
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error("Upstream request failed")
    const data = await response.json()
    if (data.error || !Array.isArray(data.recenttracks?.track)) throw new Error("Invalid upstream response")
    const seen = new Set<string>()
    const tracks = (data.recenttracks.track as LastFmTrack[]).flatMap((track) => {
      const src = track.image?.find((image) => image.size === "extralarge")?.["#text"] || track.image?.find((image) => image.size === "large")?.["#text"]
      if (!src || !src.startsWith("https://") || seen.has(src) || !track.name || !track.artist?.["#text"]) return []
      seen.add(src)
      return [{ src, song: track.name, artist: track.artist["#text"] }]
    })
    return Response.json({ tracks, status: "ready" }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300" } })
  } catch {
    // Do not log the upstream URL: it contains the API key.
    console.error("Last.fm recent-tracks request failed")
    return Response.json({ tracks: [], status: "unavailable" }, { status: 502, headers })
  }
}
