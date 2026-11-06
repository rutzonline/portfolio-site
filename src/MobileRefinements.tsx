import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { navigate, usePathname } from './navigation'

export default function MobileRefinements() {
  const pathname = usePathname()
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1023px)').matches)
  const [nav, setNav] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setNav(mobile ? document.querySelector<HTMLElement>('.mobile-page-nav') : null)
  }, [pathname, mobile])

  useEffect(() => {
    // One discovery animation on a fresh mobile homepage load.
    const initialPath = window.location.pathname
    if (!window.matchMedia('(max-width: 1023px)').matches ||
        !/^\/(brand|growth)\/?$/.test(initialPath) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const otherPath = initialPath.includes('growth') ? '/brand' : '/growth'
    let returnTimer: number | undefined
    let cancelled = false
    const startTimer = window.setTimeout(() => {
      if (cancelled || window.location.pathname !== initialPath ||
          !window.matchMedia('(max-width: 1023px)').matches) return
      navigate(otherPath, true)
      returnTimer = window.setTimeout(() => {
        if (!cancelled && window.location.pathname === otherPath &&
            window.matchMedia('(max-width: 1023px)').matches) navigate(initialPath, true)
      }, 1000)
    }, 1000)
    const cancel = () => {
      cancelled = true
      window.clearTimeout(startTimer)
      window.clearTimeout(returnTimer)
    }
    // Never override a visitor who starts interacting or chooses another page.
    window.addEventListener('pointerdown', cancel, { passive: true })
    window.addEventListener('keydown', cancel)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('popstate', cancel)
    return () => {
      cancel()
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', cancel)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('popstate', cancel)
    }
  }, [])

  if (!mobile || !nav || !/^\/growth\/case-studies\/[^/]+\/?$/.test(pathname)) return null
  return createPortal(
    <button type="button" className="back-btn mobile-case-return"
      onClick={() => navigate('/growth/case-studies', true)}>
      <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 5-7 7 7 7" />
      </svg>
      all case studies
    </button>, nav,
  )
}
