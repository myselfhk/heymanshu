import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

/* Black overlay wipe transition on every internal navigation.
   scaleY(0→1) over 0.4s then scaleY(1→0) after route change. */
export default function PageTransition() {
  const overlayRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    // On every route change: wipe in from top, then wipe out
    const tl = gsap.timeline()
    tl.set(overlay, { transformOrigin: 'top', scaleY: 1, pointerEvents: 'all' })
    tl.to(overlay, {
      scaleY: 0,
      duration: 0.4,
      ease: 'cubic-bezier(0.77, 0, 0.18, 1)',
      transformOrigin: 'top',
    })
    tl.set(overlay, { pointerEvents: 'none' })

    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div
      ref={overlayRef}
      className="page-transition-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0E0E0E',
        transformOrigin: 'top',
        scaleY: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: 'scaleY(1)', // starts fully covering on first render
      }}
    />
  )
}
