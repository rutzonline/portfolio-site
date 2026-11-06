import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import MobileRefinements from './MobileRefinements'
import './index.css'
import './mobile-polish.css'
import './mobile-refinements.css'
import { normalizeLegacyURL } from './navigation'

normalizeLegacyURL(true)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <MobileRefinements />
  </React.StrictMode>,
)
