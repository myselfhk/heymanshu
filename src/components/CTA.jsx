import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function CTA() {
  const sectionRef  = useRef(null)
  const headlineRef = useRef(null)

  /* ── Scroll-velocity skew ──────────────────────────────── */
  useEffect(() => {
    let lastScrollY  = window.scrollY
    let currentSkew  = 0
    let targetSkew   = 0
    let rafId

    const onScroll = () => {
      const velocity = window.scrollY - lastScrollY
      lastScrollY    = window.scrollY
      targetSkew     = Math.max(-2, Math.min(2, -velocity * 0.05))
    }

    const tick = () => {
      currentSkew += (targetSkew - currentSkew) * 0.1
      targetSkew  *= 0.9
      if (headlineRef.current) {
        headlineRef.current.style.transform = `skewY(${currentSkew}deg)`
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  /* ── Click-to-copy email ───────────────────────────────── */
  const handleEmailClick = useCallback(async () => {
    const emailEl = document.querySelector('.footer-cta__email')
    if (!emailEl) return
    const original = emailEl.textContent
    try {
      await navigator.clipboard.writeText('himanshu@heymanshu.com')
      emailEl.classList.add('is-copied')
      emailEl.textContent = 'Copied to clipboard.'
      setTimeout(() => {
        emailEl.classList.remove('is-copied')
        emailEl.textContent = original
      }, 2200)
    } catch {
      window.location.href = 'mailto:himanshu@heymanshu.com'
    }
  }, [])

  /* ── GSAP scroll entrance ──────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = {
        trigger:       '.footer-cta',
        start:         'top 80%',
        toggleActions: 'play none none reverse',
      }

      gsap.fromTo('.footer-cta__headline',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', scrollTrigger: st },
      )

      gsap.fromTo(
        ['.footer-cta__status', '.footer-cta__email-wrapper', '.footer-cta__bottom'],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.7, stagger: 0.12, delay: 0.2,
          ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
          scrollTrigger: st,
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="footer-cta" data-nav-theme="light" ref={sectionRef}>

      {/* Availability status */}
      <div className="footer-cta__status">
        <div className="footer-cta__status-dot" />
        <span className="footer-cta__status-label">Available · Q2 2025</span>
      </div>

      {/* Headline + email block */}
      <div className="footer-cta__headline-block">
        <h2 className="footer-cta__headline" ref={headlineRef}>
          <span className="footer-cta__headline-line">Got a product</span>
          <br />
          <span className="footer-cta__headline-line">
            worth <em>building?</em>
          </span>
        </h2>

        <div className="footer-cta__email-wrapper">
          <span className="footer-cta__email-label">or email directly</span>
          <span
            className="footer-cta__email"
            role="button"
            tabIndex={0}
            aria-label="Copy email address"
            onClick={handleEmailClick}
            onKeyDown={(e) => e.key === 'Enter' && handleEmailClick()}
          >
            himanshu@heymanshu.com
          </span>
        </div>
      </div>

      {/* Bottom row: subline + teal CTA */}
      <div className="footer-cta__bottom">
        <p className="footer-cta__subline">
          I take on a small number of design<br />
          partnerships each quarter. If the<br />
          problem's interesting enough, let's talk.
        </p>
        <a href="/contact" className="footer-cta__cta btn btn--primary-dark btn--large">
          <span className="btn__text">Let's Talk</span>
          <span className="btn__arrow">→</span>
        </a>
      </div>

    </section>
  )
}
