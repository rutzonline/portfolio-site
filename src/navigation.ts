import { useSyncExternalStore } from "react"

export const slugify = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
const eventName = "portfolio:navigate"
const getPath = () => window.location.pathname.replace(/\/$/, "") || "/"
const subscribe = (listener: () => void) => {
  const onLegacyHash = () => { normalizeLegacyURL(); listener() }
  window.addEventListener("hashchange", onLegacyHash)
  window.addEventListener("popstate", listener)
  window.addEventListener(eventName, listener)
  return () => {
    window.removeEventListener("hashchange", onLegacyHash)
    window.removeEventListener("popstate", listener)
    window.removeEventListener(eventName, listener)
  }
}
export const usePathname = () => useSyncExternalStore(subscribe, getPath, () => "/")

export function navigate(path: string, replace = false) {
  if (path === window.location.pathname && !window.location.hash) return
  window.history[replace ? "replaceState" : "pushState"]({ portfolioFrom: getPath() }, "", path)
  window.dispatchEvent(new Event(eventName))
}

export function useDetailRoute(labels: string[], base: string): [number | null, (index: number | null) => void] {
  const path = usePathname()
  const slug = path.startsWith(`${base}/`) ? path.slice(base.length + 1) : ""
  const index = labels.findIndex((label) => slugify(label) === slug)
  return [index < 0 ? null : index, (next) => {
    if (next !== null) navigate(`${base}/${slugify(labels[next])}`)
    else if (window.history.state?.portfolioFrom === base) window.history.back()
    else navigate(base, true)
  }]
}

// Keep old shared links working while new navigation uses clean paths.
export function normalizeLegacyURL() {
  const shortcuts: Record<string, string> = {
    consumption: "growth/what-im-up-to", cursor: "growth/case-studies/cursor",
    wispr: "growth/case-studies/wispr-flow", writing: "growth/notes",
    revolut: "growth/case-studies/revolut", heyclicky: "growth/case-studies/heyclicky",
  }
  const hashRoute = window.location.hash.slice(1)
  const legacyPath = window.location.pathname.replace(/^\/|\/$/g, "")
  const route = /^(growth|brand)(\/|$)/.test(hashRoute) ? hashRoute : shortcuts[legacyPath]
  if (route) window.history.replaceState(null, "", `/${route}${window.location.search}`)
  else if (window.location.pathname.length > 1 && window.location.pathname.endsWith("/")) {
    window.history.replaceState(window.history.state, "", `${getPath()}${window.location.search}${window.location.hash}`)
  }
}
