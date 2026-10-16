import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Resolve legacy pathname links into the existing hash-based portfolio routes.
const legacyRoutes: Record<string, string> = {
  consumption: "growth/what-im-up-to",
  cursor: "growth/case-studies/cursor",
  wispr: "growth/case-studies/wispr-flow",
  writing: "growth/notes",
  revolut: "growth/case-studies/revolut",
  heyclicky: "growth/case-studies/heyclicky",
}
const legacyPath = window.location.pathname.replace(/^\/|\/$/g, '')
const legacyRoute = legacyRoutes[legacyPath]
if (legacyRoute) {
  window.history.replaceState(null, '', `/${window.location.search}${window.location.hash || `#${legacyRoute}`}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
