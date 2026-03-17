import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────── */
const STEPS = [
  {
    title: 'Discovery',
    desc: "One call. I understand the business, the round, and what you've already tried.",
  },
  {
    title: 'Story Architecture',
    desc: 'Before a single slide exists, we map the narrative arc and slide sequence.',
  },
  {
    title: 'Full Deck Design',
    desc: 'Every slide designed to carry the argument forward. Figma, export-ready.',
  },
  {
    title: 'Revision + Handoff',
    desc: "2 rounds. Source file. Yours to own and update.",
  },
]

const MARQUEE_ITEMS = [
  'Deck reviewed with investors',
  'Starting at Rs. 20,000',
  'Discovery call free',
  'Figma source file included',
  '5 Narratives delivered',
  '2 revision rounds',
  'Pre-seed to Series A',
  'Story architecture first',
]

/* ─────────────────────────────────────────────────────────
   Slide inner content — pure CSS compositions, no images
───────────────────────────────────────────────────────── */
function Slide1() {
  return (
    <>
      <div className="narratives__slide-1-content">
        <p className="narratives__slide-1-company">ACME CO.</p>
        <div className="narratives__slide-1-rule" aria-hidden="true" />
        <p className="narratives__slide-1-round">Pre-Seed · 2025</p>
      </div>
      <span className="narratives__slide-1-mark" aria-hidden="true">hm</span>
    </>
  )
}

function Slide2() {
  return (
    <>
      <span className="narratives__slide-2-ghost" aria-hidden="true">02</span>
      <div className="narratives__slide-2-bar narratives__slide-2-bar--1" />
      <div className="narratives__slide-2-bar narratives__slide-2-bar--2" />
      <div className="narratives__slide-2-rect" />
    </>
  )
}

function Slide3() {
  return (
    <div className="narratives__slide-3-dots" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="narratives__slide-3-dot" />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Narratives — main component
───────────────────────────────────────────────────────── */
export default function Narratives() {
  const sectionRef = useRef(null)
  const deckRef    = useRef(null)

  /* ── Deck: RAF lerp tilt + spread on hover ────────────── */
  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return

    let tX = 0, tY = 0
    let cX = 0, cY = 0
    let rafId

    const onMove = (e) => {
      const r  = deck.getBoundingClientRect()
      const rX = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)
      const rY = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2)
      tX = -rY * 8
      tY =  rX * 8
    }

    const onEnter = () => { deck.classList.add('is-spread') }

    const onLeave = () => {
      tX = 0
      tY = 0
      deck.classList.remove('is-spread')
    }

    const tick = () => {
      cX += (tX - cX) * 0.07
      cY += (tY - cY) * 0.07
      deck.style.transform =
        `perspective(1000px) rotateX(${cX}deg) rotateY(${cY}deg)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    deck.addEventListener('mousemove',  onMove)
    deck.addEventListener('mouseenter', onEnter)
    deck.addEventListener('mouseleave', onLeave)

    return () => {
      deck.removeEventListener('mousemove',  onMove)
      deck.removeEventListener('mouseenter', onEnter)
      deck.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [])

  /* ── GSAP scroll entrance animations ─────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const stMain = {
        trigger:       '.narratives__main',
        start:         'top 72%',
        toggleActions: 'play none none reverse',
      }

      /* Headline — line-by-line clip reveal */
      gsap.fromTo(
        '.narratives__headline .line-inner',
        { y: '105%' },
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.1,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          scrollTrigger: stMain,
        },
      )

      /* Eyebrow — fades up first */
      gsap.fromTo(
        '.narratives__eyebrow',
        { opacity: 0, y: 12 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
          scrollTrigger: stMain,
        },
      )

      /* Subline — fades up after headline finishes */
      gsap.fromTo(
        '.narratives__subline',
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          delay: 0.45,
          ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
          scrollTrigger: stMain,
        },
      )

      /* Body + CTA — staggered after subline */
      gsap.fromTo(
        ['.narratives__body', '.narratives__cta-btn'],
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.6,
          ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
          scrollTrigger: stMain,
        },
      )

      /* Deck — enters from right with slight rotation */
      gsap.fromTo(
        '.narratives__deck-wrapper',
        { opacity: 0, x: 60, rotation: -3 },
        {
          opacity: 1, x: 0, rotation: 0,
          duration: 1.0,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          scrollTrigger: stMain,
        },
      )

      /* Process steps — staggered fade-up */
      gsap.fromTo(
        '.narratives__step',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'cubic-bezier(0.32, 0.94, 0.6, 1)',
          scrollTrigger: {
            trigger:       '.narratives__process',
            start:         'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* ── Render ────────────────────────────────────────────── */
  return (
    <section id="narratives" data-nav-theme="light" ref={sectionRef} className="narratives">

      {/* Entry diagonal — off-white bleeds into dark, same rotate(-3deg) pattern */}
      <div className="narratives__entry-diagonal" aria-hidden="true" />

      {/* ────────────────────────────────────────────────────
          LAYER 1 — Main split panel
      ──────────────────────────────────────────────────── */}
      <div className="narratives__main">

        {/* Left: pitch */}
        <div className="narratives__left">
          <p className="narratives__eyebrow">Narratives · Pitch Deck Design</p>

          <h2 className="narratives__headline">
            <span className="line-wrapper">
              <span className="line-inner">Raising money?</span>
            </span>
            <span className="line-wrapper">
              <span className="line-inner">Your deck should make</span>
            </span>
            <span className="line-wrapper">
              <span className="line-inner">investors feel <em>the future.</em></span>
            </span>
          </h2>

          <p className="narratives__subline">Most decks just describe it.</p>

          <p className="narratives__body">
            I build the visual argument for founders who are raising.<br />
            Starting at Rs. 20,000. Discovery call is free.
          </p>

          <a href="/narratives" className="narratives__cta narratives__cta-btn btn btn--gold">
            <span className="btn__text">Let's Talk</span>
            <span className="btn__arrow">→</span>
          </a>
        </div>

        {/* Right: deck preview */}
        <div className="narratives__right">
          <div ref={deckRef} className="narratives__deck-wrapper">
            {/* Rendered back-to-front — slide 3 is behind */}
            <div className="narratives__slide narratives__slide--3"><Slide3 /></div>
            <div className="narratives__slide narratives__slide--2"><Slide2 /></div>
            <div className="narratives__slide narratives__slide--1"><Slide1 /></div>
          </div>
          <p className="narratives__deck-hint">hover to explore</p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────
          LAYER 2 — Marquee strip
      ──────────────────────────────────────────────────── */}
      <div className="narratives__marquee-track" aria-hidden="true">
        <div className="narratives__marquee-inner">
          {/* 3× repetition for seamless -33.33% loop */}
          {[0, 1, 2].flatMap((rep) =>
            MARQUEE_ITEMS.map((item, i) => (
              <span key={`${rep}-${i}`} className="narratives__marquee-item">
                {item}
                <span className="narratives__marquee-separator"> ◆ </span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────
          LAYER 3 — Process strip
      ──────────────────────────────────────────────────── */}
      <div className="narratives__process">
        {STEPS.map((step, i) => (
          <div key={i} className="narratives__step">
            <p className="narratives__step-num">0{i + 1}</p>
            <p className="narratives__step-title">{step.title}</p>
            <p className="narratives__step-desc">{step.desc}</p>
          </div>
        ))}
      </div>

    </section>
  )
}
