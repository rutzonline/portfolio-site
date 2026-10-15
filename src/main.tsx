import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Preserve old bookmarks while keeping the log inside the Growth page.
if (window.location.pathname.replace(/\/$/, '') === '/consumption') {
  window.history.replaceState(null, '', '/#growth/what-im-up-to')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
