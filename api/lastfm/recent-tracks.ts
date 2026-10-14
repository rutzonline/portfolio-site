import { recentTracks } from "../../server/lastfm"

export function GET() {
  return recentTracks(process.env)
}
