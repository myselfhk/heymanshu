import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────────────
   WORD SPLIT HELPER — wraps each word in a .word span for GSAP stagger
─────────────────────────────────────────────────────────────────── */
function W({ children }) {
  return children.split(' ').map((word, i, arr) => (
    <span key={i} className="word">
      {word}{i < arr.length - 1 ? ' ' : ''}
    </span>
  ))
}

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
─────────────────────────────────────────────────────────────────── */
export default function Narrative() {
  const sectionRef = useRef(null)

  /* Smart card positioning: flip above if not enough space below */
  const handlePhraseEnter = useCallback((e) => {
    const phrase = e.currentTarget
    const card = phrase.querySelector('.phrase-card')
    if (!card) return

    const rect   = phrase.getBoundingClientRect()
    const cardH  = 320
    const cardW  = 320

    // Vertical
    const spaceBelow = window.innerHeight - rect.bottom
    if (spaceBelow < cardH + 20) {
      card.style.top    = 'auto'
      card.style.bottom = 'calc(100% + 12px)'
    } else {
      card.style.top    = 'calc(100% + 12px)'
      card.style.bottom = 'auto'
    }

    // Horizontal: prevent right-side overflow
    if (rect.left + cardW > window.innerWidth - 16) {
      card.style.left  = 'auto'
      card.style.right = '0'
    } else {
      card.style.left  = '0'
      card.style.right = 'auto'
    }
  }, [])

  /* GSAP scroll-driven entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Words slide up and fade in, staggered
      gsap.from(sectionRef.current.querySelectorAll('.narrative__text .word'), {
        opacity: 0,
        y: 24,
        stagger: 0.025,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })

      // Stat row fades in after
      gsap.from(sectionRef.current.querySelector('.narrative__stats'), {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current.querySelector('.narrative__stats'),
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="narrative" ref={sectionRef} id="narrative" data-nav-theme="dark">
      <p className="narrative__label">What I Do</p>

      <p className="narrative__text">
        {/* Plain intro words */}
        <W>I've spent 5 years</W>{' '}

        {/* ── Phrase 1 ─────────────────────────────── */}
        <span className="phrase phrase--1" onMouseEnter={handlePhraseEnter}>
          <W>stripping back broken products</W>
          <span className="phrase-card">
            {/* Visual band */}
            <span
              className="phrase-card__visual"
              style={{ background: 'linear-gradient(135deg, rgba(10,107,107,0.9), rgba(10,107,107,0.4))' }}
            >
              <span className="phrase-card__ghost" style={{ fontSize: '120px' }}>34</span>
              <span className="phrase-card__stat">
                <span className="phrase-card__stat-main">34 → 1</span>
                <span className="phrase-card__stat-sub">button variants consolidated</span>
              </span>
            </span>
            {/* Text body */}
            <span className="phrase-card__body">
              <span className="phrase-card__project">Paytm · Design System</span>
              <span className="phrase-card__desc">
                One button existed in 34 variations across the app. Nobody decided this. It just happened.
              </span>
              <a href="#" className="phrase-card__link btn btn--ghost btn--ghost-dark">
                <span className="btn__text">Case Study</span>
                <span className="btn__arrow">→</span>
              </a>
            </span>
          </span>
        </span>

        <span className="word">, </span>

        {/* ── Phrase 2 ─────────────────────────────── */}
        <span className="phrase phrase--2" onMouseEnter={handlePhraseEnter}>
          <W>building the shared language teams were missing</W>
          <span className="phrase-card">
            <span
              className="phrase-card__visual"
              style={{ background: 'linear-gradient(135deg, rgba(184,151,60,0.85), rgba(184,151,60,0.35))' }}
            >
              <span className="phrase-card__ghost" style={{ fontSize: '100px' }}>4mo</span>
              <span className="phrase-card__stat">
                <span className="phrase-card__stat-main">4 months</span>
                <span className="phrase-card__stat-sub">to build the system. 3 weeks to get buy-in.</span>
              </span>
            </span>
            <span className="phrase-card__body">
              <span className="phrase-card__project">Honda · Customer Portal</span>
              <span className="phrase-card__desc">
                Redesigned the post-purchase relationship between Honda owners and their cars.
              </span>
              <a href="#" className="phrase-card__link btn btn--ghost btn--ghost-dark">
                <span className="btn__text">Case Study</span>
                <span className="btn__arrow">→</span>
              </a>
            </span>
          </span>
        </span>

        <span className="word">, and </span>

        {/* ── Phrase 3 ─────────────────────────────── */}
        <span className="phrase phrase--3" onMouseEnter={handlePhraseEnter}>
          <W>designing the trust that makes people hit confirm</W>
          <span className="phrase-card">
            <span
              className="phrase-card__visual"
              style={{ background: 'linear-gradient(135deg, #0A6B6B, #0D4040)' }}
            >
              <span className="phrase-card__ghost" style={{ fontSize: '100px' }}>₦</span>
              <span className="phrase-card__stat">
                <span className="phrase-card__stat-main" style={{ fontSize: '26px', lineHeight: 1.25 }}>
                  Trust is the<br />actual product.
                </span>
              </span>
            </span>
            <span className="phrase-card__body">
              <span className="phrase-card__project">Woo · Nigerian Payments</span>
              <span className="phrase-card__desc">
                Built the UI layer for a payments platform where trust is the actual product.
              </span>
              <a href="#" className="phrase-card__link btn btn--ghost btn--ghost-dark">
                <span className="btn__text">Case Study</span>
                <span className="btn__arrow">→</span>
              </a>
            </span>
          </span>
        </span>

        <span className="word">.</span>
      </p>

      {/* Stat row */}
      <div className="narrative__stats">
        <span>5 companies</span>
        <span className="dot" />
        <span>4 industries</span>
        <span className="dot" />
        <span>100M+ users touched</span>
        <span className="dot" />
        <span>Jaipur, India</span>
      </div>
    </section>
  )
}
