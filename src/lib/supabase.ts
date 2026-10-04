const url = "https://mzelpafnpdcchykekdux.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16ZWxwYWZucGRjY2h5a2VrZHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTYzNjQsImV4cCI6MjA5Mjk3MjM2NH0.Uw0X67zW8j4fn-b6-TQehlGEa0o5HwZa5q52VbmBF6M";

export const supabaseReady = Boolean(url && key)

export async function fetchTable<T>(table: string): Promise<T[]> {
  if (!url || !key) throw new Error("supabase env vars missing")
  const res = await fetch(`${url}/rest/v1/${table}?select=*&order=created_at.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!res.ok) throw new Error(`${table}: ${res.status}`)
  return res.json()
}
