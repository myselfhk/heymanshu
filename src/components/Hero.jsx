import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitText from './SplitText'
import { useSettings } from '../hooks/useSettings'

const DEFAULT_GALLERY_ITEMS = [
  { src: '/images/gallery-1.jpg', bg: '#1E2A3D' },
  { src: '/images/gallery-2.jpg', bg: '#2E1E3D' },
  { src: '/images/gallery-3.jpg', bg: '#1E3D2C' },
  { src: '/images/gallery-4.jpg', bg: '#3D2A1E' },
  { src: '/images/gallery-5.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-6.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-7.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-8.jpg', bg: '#3D3A1E' },
]

/* Gallery auto-advance speed: cards per second */
const SPEED_CPS = 1 / 3.5

/* ─────────────────────────────────────────────────────────────────
   HELPERS
─────────────────────────────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t }

/*
 * 4:5 portrait coverflow lookup tables.
 * Card width ≈ 20.8vw (= 26vw height × 4/5).
 * CF_X is kept tighter than landscape so adjacent portrait cards
 * fan out without creating too much empty space between them.
 */
const CF_X  = [0,  21,  38,  53,  65]    // vw   — horizontal spread
const CF_RY = [0,  42,  58,  68,  75]    // deg  — Y-rotation (inward)
const CF_Z  = [0, -45,  -85, -120, -150] // px   — push back in Z
const CF_SC = [1, 0.93, 0.83, 0.72, 0.61]  // scale

/* Mobile: push adjacent cards off-screen, fade during transition */
const CF_X_MOBILE  = [0, 105, 125, 140, 150]  // vw — adjacent cards well off-screen
const CF_RY_MOBILE = [0,   0,   0,   0,   0]  // no Y-rotation on mobile
const CF_Z_MOBILE  = [0,   0,   0,   0,   0]  // no Z depth on mobile
const CF_SC_MOBILE = [1, 0.9, 0.8, 0.7, 0.6]

function coverflowStyle(offset) {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const xT  = isMobile ? CF_X_MOBILE  : CF_X
  const ryT = isMobile ? CF_RY_MOBILE : CF_RY
  const zT  = isMobile ? CF_Z_MOBILE  : CF_Z
  const scT = isMobile ? CF_SC_MOBILE : CF_SC

  const abs     = Math.abs(offset)
  const sign    = offset > 0 ? 1 : offset < 0 ? -1 : 0
  const clamped = Math.min(abs, 4)
  const lo      = Math.floor(clamped)
  const hi      = Math.min(lo + 1, 4)
  const t       = clamped - lo

  const x  =  lerp(xT[lo],  xT[hi],  t) * sign
  const ry = -lerp(ryT[lo], ryT[hi], t) * sign
  const z  =  lerp(zT[lo],  zT[hi],  t)
  const sc =  lerp(scT[lo], scT[hi], t)

  // On mobile: fade adjacent cards from abs=0.4 so only 1 card is visible at a time
  const op = isMobile
    ? (abs >= 1.0 ? 0 : abs >= 0.4 ? lerp(1, 0, (abs - 0.4) / 0.6) : 1)
    : (abs >= 3.0 ? 0 : abs >= 2.5 ? lerp(1, 0, (abs - 2.5) * 2) : 1)
  const zi = Math.max(0, Math.round(10 - abs * 2))

  return { x, ry, z, sc, op, zi }
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
─────────────────────────────────────────────────────────────────── */
export default function Hero({ scrollTo, loading, lockScroll, unlockScroll, onNotifyClick }) {
  const sectionRef      = useRef(null)
  const titleRef        = useRef(null)
  const subtitleRef     = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)
  const modalRef        = useRef(null)
  const modalContentRef = useRef(null)

  const { data: settings } = useSettings()
  const galleryItems = settings?.galleryItems?.length ? settings.galleryItems : DEFAULT_GALLERY_ITEMS
  const galleryItemsRef = useRef(galleryItems)
  // Keep ref in sync so animation ticker always has fresh items without re-creating the ticker
  useEffect(() => { galleryItemsRef.current = galleryItems }, [galleryItems])

  /* ── Gallery animation refs ──────────────────────────────────── */
  const progressRef   = useRef(0)
  const cardDomRefs   = useRef([])
  const dotRefs       = useRef([])
  const isDraggingRef = useRef(false)
  const dragRef       = useRef({ startX: 0, startProgress: 0 })

  /* ── applyProgress — direct DOM updates, no React re-renders ─── */
  const applyProgress = useCallback((p) => {
    const n        = galleryItemsRef.current.length || 1
    const norm     = ((p % n) + n) % n
    const activeDot = Math.round(norm) % n

    cardDomRefs.current.forEach((el, i) => {
      if (!el) return
      let off = i - norm
      if (off >  n / 2) off -= n
      if (off < -n / 2) off += n

      const { x, ry, z, sc, op, zi } = coverflowStyle(off)
      el.style.transform = `translateX(${x}vw) rotateY(${ry}deg) translateZ(${z}px) scale(${sc})`
      el.style.opacity   = op.toFixed(3)
      el.style.zIndex    = zi
      el.classList.toggle('coverflow-card--active', Math.abs(off) < 0.5)
    })

    dotRefs.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity = i === activeDot ? '1' : '0.35'
      el.style.width   = i === activeDot ? '20px' : '6px'
    })
  }, [])

  /* ── Hero entrance animation ─────────────────────────────────── */
  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll('.target')
      if (chars) {
        gsap.fromTo(chars,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.02, duration: 0.6, ease: 'power2.out', delay: 0.2 }
        )
      }
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.7 }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [loading])

  /* ── Initial card positions (before first paint) ─────────────── */
  useLayoutEffect(() => {
    applyProgress(0)
  }, [applyProgress])

  /* ── GSAP ticker — continuous smooth panoramic motion ──────────── */
  useEffect(() => {
    const tick = (_time, deltaTime) => {
      if (!isDraggingRef.current) {
        progressRef.current += (deltaTime / 1000) * SPEED_CPS
      }
      applyProgress(progressRef.current)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [applyProgress])

  /* ── Drag / swipe handlers ──────────────────────────────────── */
  const onPointerDown = useCallback((e) => {
    isDraggingRef.current = true
    dragRef.current = { startX: e.clientX, startProgress: progressRef.current }
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragRef.current.startX
    progressRef.current = dragRef.current.startProgress - dx / 260
  }, [])

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false
  }, [])

  /* ── Modal open / close ─────────────────────────────────────── */
  const openModal = useCallback(() => {
    // Stop Lenis + block scroll before React re-renders
    lockScroll?.()
    document.documentElement.style.overflow = 'hidden'
    setModalOpen(true)
  }, [lockScroll])

  /* Run entrance animation once modal DOM is mounted */
  useEffect(() => {
    if (!modalOpen || !modalRef.current) return
    const header = document.querySelector('.header')
    if (header) { header.style.opacity = '0'; header.style.pointerEvents = 'none' }

    gsap.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power2.out' }
    )
    gsap.fromTo(modalContentRef.current,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: 0.1 }
    )

    // Safety cleanup: ensure scroll is restored if component unmounts while open
    return () => {
      unlockScroll?.()
      document.documentElement.style.overflow = ''
    }
  }, [modalOpen, unlockScroll])

  const closeModal = () => {
    if (!modalRef.current) return
    gsap.to(modalRef.current, {
      opacity: 0, duration: 0.28, ease: 'power2.in',
      onComplete: () => {
        setModalOpen(false)
        unlockScroll?.()
        document.documentElement.style.overflow = ''
        const header = document.querySelector('.header')
        if (header) { header.style.opacity = ''; header.style.pointerEvents = '' }
      },
    })
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <section
      id="hero"
      data-nav-theme="light"
      ref={sectionRef}
      style={{
        height: '100dvh', minHeight: 600,
        display: 'flex', flexDirection: 'column',
        position: 'relative', zIndex: 2, overflow: 'visible',
      }}
    >
      {/* Background image */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/images/hero-bg.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center center', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.28) 100%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Centered hero content ──────────────────────────────── */}
      <div className="hero-content-row" style={{ position: 'relative', zIndex: 1 }}>
        <h1
          ref={titleRef}
          className="hero-title"
          style={{
            fontSize: 58, fontWeight: 500, lineHeight: '62px',
            color: '#fff', letterSpacing: '-0.5px',
            textAlign: 'center',
          }}
        >
          <SplitText text="Designer. Thinker." />
          <br />
          <SplitText text="Builder. " />
          <span style={{  }}><em><SplitText text="Human." /></em></span>
        </h1>

        {/* Tagline + CTA — animate together */}
        <div
          ref={subtitleRef}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 20, opacity: 0,
          }}
        >
          <p className="hero-tagline">
            I'm Himanshu, a designer who helps founders craft beautiful things. 
          </p>
          <a
            href="#manifesto"
            className="btn btn--primary-dark"
            onClick={(e) => { e.preventDefault(); scrollTo('#manifesto') }}
          >
            <span className="btn__text">See Work</span>
            <span className="btn__arrow">→</span>
          </a>
         
        </div>
      </div>

      {/* ── PANORAMIC GALLERY — 4:5 portrait cards ─────────────── */}
      <div
        className="hero-gallery"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {galleryItems.map((item, i) => (
          <div
            key={i}
            ref={el => { cardDomRefs.current[i] = el }}
            className="coverflow-card"
            style={{
              backgroundColor: item.bg,
              backgroundImage: item.src ? `url(${item.src})` : undefined,
            }}
          />
        ))}
      </div>

      {/* ── Dot pagination ────────────────────────────────────── */}
      <div className="gallery-dots">
        {galleryItems.map((_, i) => (
          <div
            key={i}
            ref={el => { dotRefs.current[i] = el }}
            className="gallery-dot"
          />
        ))}
      </div>

      {/* ── KNOW MORE MODAL ──────────────────────────────────── */}
      {modalOpen && (
        <div ref={modalRef} className="hero-modal" style={{ opacity: 0 }}>
          <button className="hero-modal-close" onClick={closeModal}>
            <span>Close</span>
            <span className="hero-modal-close-x">✕</span>
          </button>

          <div ref={modalContentRef} className="hero-modal-inner">
            {/* Left: 4:5 portrait image placeholder */}
            <div className="hero-modal-image">
              <div className="hero-modal-image-inner" />
            </div>

            {/* Right: bio + social handles */}
            <div className="hero-modal-text">
              <p className="hero-modal-para">
                With over 4.5 years of hands-on experience across Fintech,
                Automobile, and IT industries, I've partnered with startups
                and enterprises to translate complex problems into intuitive,
                impactful digital experiences. My work spans end-to-end
                product design — from discovery and research to polished,
                pixel-perfect interfaces that people actually enjoy using.
              </p>
              <p className="hero-modal-para">
                I specialise in Interaction Design, UX Design, and Research,
                working fluently across Figma, Sketch, Adobe Creative Suite,
                and Principle. I believe great design is invisible — it should
                feel effortless to the user and thoughtfully crafted behind
                the scenes. If you're building something meaningful, I'd love
                to be part of the story.
              </p>

              <div className="hero-modal-socials">
                <a href="https://linkedin.com/in/himanshukhemani" target="_blank" rel="noopener noreferrer" className="hero-modal-social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.behance.net/himanshukhemani" target="_blank" rel="noopener noreferrer" className="hero-modal-social-link" aria-label="Behance">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.836 1.9 1.97 1.9.874 0 1.454-.43 1.683-1.104L23.726 17zm-7.726-3h4.501c-.136-1.2-.894-1.85-2.195-1.85-1.21 0-2.058.68-2.306 1.85zM7.7 11.5c1.8 0 2.5.68 2.5 1.75S9.5 15 7.7 15H4V11.5h3.7zm-.4-5.5h3.1c1.6 0 2.4.6 2.4 1.7 0 1-.7 1.7-1.9 1.8H7.3V6zM4 4.5V20h7.2c2.4 0 4.3-1.4 4.3-4 0-1.4-.7-2.6-2.1-3.1 1.1-.5 1.7-1.5 1.7-2.9 0-2.4-1.9-3.5-4.5-3.5H4z"/>
                  </svg>
                </a>
                <a href="https://dribbble.com/himanshukhemani" target="_blank" rel="noopener noreferrer" className="hero-modal-social-link" aria-label="Dribbble">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.01-.816zm-11.62-2.073c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 12.3 2.986 12.264 2.6 12.26l-.024 1.44c0 2.3.87 4.407 2.31 6zm-1.76-7.87c.395.013 3.912.052 8.165-1.058-1.47-2.61-3.055-4.81-3.3-5.138-2.43 1.268-4.168 3.55-4.864 6.196zM9.772 3.94c.257.35 1.86 2.547 3.314 5.22 3.154-1.18 4.49-2.984 4.65-3.216-1.54-1.37-3.55-2.2-5.752-2.2-.753 0-1.483.1-2.212.196zM18.697 7.5c-.188.265-1.678 2.19-4.974 3.545.21.43.41.87.59 1.32.07.19.14.38.2.57 3.38-.43 6.75.26 7.1.33-.1-2.02-.8-3.87-1.916-5.765z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
