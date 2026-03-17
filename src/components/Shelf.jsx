import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────
   MagneticCard — perspective wrapper + RAF tilt loop
   Each instance runs its own rAF; cleaned up on unmount.
───────────────────────────────────────────────────────── */
function MagneticCard({ wrapperClass, cardClass, children }) {
  const wrapperRef = useRef(null)
  const cardRef    = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const card    = cardRef.current
    if (!wrapper || !card) return

    let tX = 0, tY = 0, tS = 1   // target values
    let cX = 0, cY = 0, cS = 1   // current (lerped) values
    let rafId

    const onEnter = () => { tS = 1.02 }

    const onMove = (e) => {
      const r  = wrapper.getBoundingClientRect()
      const rX = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)
      const rY = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2)
      tX = -rY * 12           // rotateX — mouse up = tilt back
      tY =  rX * 12           // rotateY
      tS = 1.02
      card.style.setProperty('--sh-x', `${rX * -20}px`)
      card.style.setProperty('--sh-y', `${rY *  20}px`)
    }

    const onLeave = () => {
      tX = 0; tY = 0; tS = 1
      card.style.setProperty('--sh-x', '0px')
      card.style.setProperty('--sh-y', '4px')
    }

    const tick = () => {
      cX += (tX - cX) * 0.08
      cY += (tY - cY) * 0.08
      cS += (tS - cS) * 0.08
      card.style.transform =
        `rotateX(${cX}deg) rotateY(${cY}deg) scale3d(${cS},${cS},${cS})`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    wrapper.addEventListener('mouseenter', onEnter)
    wrapper.addEventListener('mousemove',  onMove)
    wrapper.addEventListener('mouseleave', onLeave)

    return () => {
      wrapper.removeEventListener('mouseenter', onEnter)
      wrapper.removeEventListener('mousemove',  onMove)
      wrapper.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={wrapperRef} className={`shelf__visual-wrapper ${wrapperClass}`}>
      <div ref={cardRef} className={`shelf__visual-card ${cardClass}`}>
        {children}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Card overlays — pure SVG, no external assets
───────────────────────────────────────────────────────── */

/** Fine 32-px grid lines for the Playbook card */
function GridOverlay() {
  return (
    <svg
      className="shelf__card-grid"
      aria-hidden="true"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="grid-pb"
          x="0" y="0"
          width="32" height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 32 0 L 0 0 0 32"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pb)" />
    </svg>
  )
}

/** Component wireframe rectangles for the Kit card */
const KIT_RECTS = [
  [16,40,80,20], [108,40,80,20], [200,40,80,20],
  [16,76,80,48], [108,76,80,48], [200,76,80,48],
  [16,140,168,12],[200,140,80,12],
  [16,168,80,32], [108,168,80,32], [200,168,80,32],
  [16,216,168,20],[200,216,80,20],
  [16,252,80,60], [108,252,80,60], [200,252,80,60],
  [16,328,264,20],
]

function WireframeOverlay() {
  return (
    <svg
      className="shelf__card-grid"
      aria-hidden="true"
      width="100%"
      height="100%"
      viewBox="0 0 296 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {KIT_RECTS.map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x} y={y} width={w} height={h}
          rx="4"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.75"
        />
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────
   Shelf — main component
───────────────────────────────────────────────────────── */
export default function Shelf() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Product row scroll entrance ────────
         Three staggered animations per row:
         1. Visual card — rotates in like a dropped document
         2. Product name lines — clip upward reveal
         3. Desc / meta / CTA — fade-up stagger
      ──────────────────────────────────────── */
      sectionRef.current
        .querySelectorAll('.shelf__product-row')
        .forEach((row) => {
          const visual  = row.querySelector('.shelf__visual-wrapper')
          const lines   = row.querySelectorAll('.shelf__product-name .line-inner')
          const details = row.querySelectorAll(
            '.shelf__product-desc, .shelf__product-meta, .shelf__cta-btn',
          )
          const st = {
            trigger:       row,
            start:         'top 70%',
            toggleActions: 'play none none reverse',
          }

          if (visual) {
            gsap.fromTo(visual,
              { opacity: 0, y: 70, rotation: 2.5 },
              { opacity: 1, y: 0, rotation: 0, duration: 1.1,
                ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
                scrollTrigger: st },
            )
          }

          if (lines.length) {
            gsap.fromTo(lines,
              { y: '105%' },
              { y: '0%', duration: 0.75, stagger: 0.08,
                ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
                scrollTrigger: st },
            )
          }

          if (details.length) {
            gsap.fromTo(details,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.2,
                ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
                scrollTrigger: st },
            )
          }
        })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="shelf" data-nav-theme="dark" ref={sectionRef} className="shelf">

      {/* ── Entry diagonal — same rotate(-3deg) pattern as Team / Jobs ── */}
      <div className="shelf__entry-diagonal" aria-hidden="true" />

      {/* ── Product 01: Design Audit Playbook ───────── */}
      <div className="shelf__product-row shelf__product-row--01">

        {/* LEFT — section label + opener copy folded in, then product content */}
        <div className="shelf__product-content">
          <p className="shelf__label">The Shelf</p>
          <p className="shelf__opener-copy">Things I made that you can use.</p>

          <span className="shelf__product-num" aria-hidden="true">01</span>
          <h3 className="shelf__product-name">
            <span className="line-wrapper">
              <span className="line-inner">DESIGN AUDIT</span>
            </span>
            <span className="line-wrapper">
              <span className="line-inner">
                PLAY<span className="accent">BOOK</span>
              </span>
            </span>
          </h3>
          <p className="shelf__product-desc">
            For founders who need to know what's broken before hiring anyone.
          </p>
          <p className="shelf__product-meta">
            Rs. 999 · PDF + Checklist · Instant download
          </p>
          <a href="#" className="shelf__cta-btn btn btn--primary-light">
            <span className="btn__text">Get Playbook</span>
            <span className="btn__arrow">→</span>
          </a>
        </div>

        {/* RIGHT — magnetic tilt card */}
        <MagneticCard
          wrapperClass="shelf__visual-wrapper--playbook"
          cardClass="shelf__visual-card--playbook"
        >
          <GridOverlay />
          <span className="shelf__card-ghost" aria-hidden="true">40</span>
          <div className="shelf__card-label">
            <p className="shelf__card-label-title">Design Audit Playbook</p>
            <p className="shelf__card-label-line shelf__card-label-line--italic">40 Questions</p>
            <p className="shelf__card-label-line shelf__card-label-line--italic">5 Categories</p>
            <p className="shelf__card-label-price">Rs. 999</p>
          </div>
          <div className="shelf__card-border" aria-hidden="true" />
        </MagneticCard>
      </div>

      {/* ── Product 02: Fintech UI Kit ───────────────── */}
      {/* Columns flipped: visual LEFT, text RIGHT */}
      <div className="shelf__product-row shelf__product-row--02">

        {/* LEFT — magnetic tilt card */}
        <MagneticCard
          wrapperClass="shelf__visual-wrapper--kit"
          cardClass="shelf__visual-card--kit"
        >
          <WireframeOverlay />
          <span className="shelf__card-ghost shelf__card-ghost--kit" aria-hidden="true">200</span>
          <div className="shelf__card-label">
            <p className="shelf__card-label-title">Fintech UI Kit</p>
            <p className="shelf__card-label-line shelf__card-label-line--italic">200+ Components</p>
            <p className="shelf__card-label-line shelf__card-label-line--italic">Figma-ready</p>
            <p className="shelf__card-label-price">Rs. 2,999</p>
          </div>
          <div className="shelf__card-border" aria-hidden="true" />
        </MagneticCard>

        {/* RIGHT — text */}
        <div className="shelf__product-content">
          <span className="shelf__product-num" aria-hidden="true">02</span>
          <h3 className="shelf__product-name">
            <span className="line-wrapper">
              <span className="line-inner">FINTECH</span>
            </span>
            <span className="line-wrapper">
              <span className="line-inner">
                UI <span className="accent accent--gold">KIT</span>
              </span>
            </span>
          </h3>
          <p className="shelf__product-desc">
            Built from 5 years inside Paytm, Creditas &amp; Woo.
            Real patterns, not templates.
          </p>
          <p className="shelf__product-meta">
            Rs. 2,999 · Figma file · Free updates
          </p>
          <a href="#" className="shelf__cta-btn btn btn--primary-light">
            <span className="btn__text">Get Kit</span>
            <span className="btn__arrow">→</span>
          </a>
        </div>
      </div>

      {/* ── Footer row ───────────────────────────────── */}
      <div className="shelf__footer-row">
        <p className="shelf__footer-copy">More tools in the making.</p>
        <a href="/shelf" className="shelf__footer-link btn btn--ghost btn--ghost-light">
          <span className="btn__text">All Products</span>
          <span className="btn__arrow">→</span>
        </a>
      </div>

    </section>
  )
}
