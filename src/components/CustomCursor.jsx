import { useEffect, useRef } from 'react'

/* ──────────────────────────────────────────────────────────────────
   CUSTOM CURSOR
   Two-layer: dot (8px, snappy) + ring (36px, slow lerp)
   Colours adapt to [data-nav-theme] sections.
   Expands to 80px on .btn hover with "View" label.
   Disabled on touch devices.
──────────────────────────────────────────────────────────────────── */

function lerp(a, b, t) { return a + (b - a) * t }

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    // Disable on touch / coarse-pointer devices
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window
    ) return

    const dot   = dotRef.current
    const ring  = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return

    // Live cursor position
    let mx = -200, my = -200
    // Lerped ring position
    let rx = -200, ry = -200

    // State flags
    let isBtn   = false
    let isLink  = false
    let isText  = false
    let isDark  = false  // true = cursor is over a dark section (use white)
    let rafId

    /* ── Detect cursor colour from closest [data-nav-theme] section ── */
    function updateColorFromSection(x, y) {
      const el = document.elementFromPoint(x, y)
      if (!el) return
      const section = el.closest('[data-nav-theme]')
      if (section) {
        isDark = section.dataset.navTheme === 'light'  // light theme = dark bg = white cursor
      }
    }

    /* ── Mouse move ── */
    function onMouseMove(e) {
      mx = e.clientX
      my = e.clientY
      updateColorFromSection(mx, my)
    }

    /* ── Hover detection ── */
    function onMouseOver(e) {
      const t = e.target
      isBtn  = !!(t.closest('.btn') || t.closest('[data-cursor="cta"]'))
      isLink = !isBtn && !!(t.closest('a') || t.closest('button'))
      isText = !!(t.closest('p') || t.closest('h1') || t.closest('h2') || t.closest('h3'))
    }

    /* ── Update label text from data-cursor-label ── */
    function getLabelText(el) {
      const btn = el?.closest('[data-cursor-label]')
      return btn ? btn.dataset.cursorLabel : 'View'
    }

    /* ── rAF loop ── */
    function tick() {
      // Lerp ring towards mouse
      rx = lerp(rx, mx, 0.09)
      ry = lerp(ry, my, 0.09)

      // Snap dot to cursor
      dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`

      // Colour
      const color = isDark ? '#ffffff' : '#1B1B1F'
      dot.style.background  = color
      ring.style.borderColor = color
      if (label) label.style.color = color

      // Ring size / state
      if (isBtn) {
        ring.style.width  = '80px'
        ring.style.height = '80px'
        ring.style.opacity = '1'
        if (label) label.style.opacity = '1'
      } else {
        ring.style.width  = '36px'
        ring.style.height = '36px'
        ring.style.opacity = isLink ? '0.6' : '0.35'
        if (label) label.style.opacity = '0'
      }

      // Dot scale on links
      dot.style.width  = isLink || isBtn ? '4px' : '8px'
      dot.style.height = isLink || isBtn ? '4px' : '8px'

      rafId = requestAnimationFrame(tick)
    }

    /* ── Cursor leaves / enters window ── */
    function onMouseLeave() {
      dot.style.opacity  = '0'
      ring.style.opacity = '0'
    }
    function onMouseEnter() {
      dot.style.opacity  = '1'
      ring.style.opacity = '0.35'
    }

    window.addEventListener('mousemove',  onMouseMove,  { passive: true })
    window.addEventListener('mouseover',  onMouseOver,  { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseover',  onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="cursor__dot"
        aria-hidden="true"
      />
      {/* Ring — lerped slow */}
      <div
        ref={ringRef}
        className="cursor__ring"
        aria-hidden="true"
      >
        <span ref={labelRef} className="cursor__label">View</span>
      </div>
    </>
  )
}
