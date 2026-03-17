import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function AsidePanel({ open, onClose }) {
  const panelRef   = useRef(null)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  /* ── Set initial off-screen position via GSAP (not inline CSS transform) ── */
  useLayoutEffect(() => {
    gsap.set(panelRef.current, { xPercent: 100 })
    gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' })
  }, [])

  useEffect(() => {
    if (open) {
      // Slide panel in from right
      gsap.to(panelRef.current, {
        xPercent: 0,
        duration: 0.75,
        ease: 'power3.inOut',
      })
      // Fade overlay in
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.4,
      })
      // Animate inner content up
      gsap.fromTo(contentRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: 0.25 }
      )
    } else {
      gsap.to(panelRef.current, {
        xPercent: 100,
        duration: 0.65,
        ease: 'power3.inOut',
      })
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.35,
      })
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus(null), 4000)
    } else {
      setStatus('error')
      setTimeout(() => setStatus(null), 3000)
    }
  }

  return (
    <>
      {/* Dark scrim — clicking closes the panel */}
      <div
        ref={overlayRef}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 800,
          cursor: 'pointer',
        }}
      />

      {/* Panel — glassmorphism, same backdrop as Know More modal */}
      <aside
        ref={panelRef}
        className="aside-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          /* Glassmorphism — mirrors the Know More modal aesthetic */
          background: 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 900,
          /* GSAP controls the translate — see useLayoutEffect above */
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Close × */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          style={{
            position: 'absolute',
            top: 28,
            right: 28,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Content */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {/* Heading */}
          <h2 style={{
            fontSize: 40,
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#fff',
            letterSpacing: '-0.8px',
            marginBottom: 10,
          }}>
            Let's work<br />
            <span style={{  }}>together.</span>
          </h2>

          <p style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.50)',
            marginBottom: 32,
          }}>
            Drop your email and I'll reach out — usually within a day.
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                border: '1.5px solid rgba(255,255,255,0.18)',
                borderRadius: 50,
                padding: '17px 68px 17px 22px',
                color: '#fff',
                fontSize: 14,
                background: 'rgba(255,255,255,0.05)',
                width: '100%',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.45)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.18)' }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: 6,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'var(--color-coral)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              <svg width="16" height="13" viewBox="0 0 17 14" fill="none">
                <path d="M1 7L15.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9.5 1L15.5 7L9.5 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          {/* Status messages */}
          {status === 'success' && (
            <div style={{
              background: 'rgba(126, 211, 119, 0.15)',
              border: '1px solid rgba(126, 211, 119, 0.35)',
              borderRadius: 12,
              padding: '13px 18px',
              color: '#7ed377',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 16,
            }}>
              ✓ &nbsp;Got it! I'll be in touch soon.
            </div>
          )}
          {status === 'error' && (
            <div style={{
              background: 'rgba(237, 68, 57, 0.12)',
              border: '1px solid rgba(237, 68, 57, 0.30)',
              borderRadius: 12,
              padding: '13px 18px',
              color: '#ed4439',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 16,
            }}>
              Please enter a valid email address.
            </div>
          )}

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '8px 0 24px',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.05em' }}>
              or
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.10)' }} />
          </div>

          {/* Direct email */}
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', marginBottom: 8 }}>
              Prefer email directly?
            </p>
            <a
              href="mailto:hello@heymanshu.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 15,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.22)',
                paddingBottom: 2,
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
              }}
            >
              <svg width="14" height="12" viewBox="0 0 20 16" fill="none">
                <rect x="1" y="1" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 4l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              hello@heymanshu.com
            </a>
          </div>

          {/* Footer note */}
          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.25)',
            lineHeight: 1.6,
            marginTop: 'auto',
            paddingTop: 32,
          }}>
            Your information stays private. No spam, ever.
          </p>
        </div>
      </aside>
    </>
  )
}
