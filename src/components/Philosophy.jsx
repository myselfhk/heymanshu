import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SENTENCE = "Design is not what something looks like. It's what decision it protects you from making."
const WORDS = SENTENCE.split(' ')

export default function Philosophy() {
  const sectionRef = useRef(null)
  const quoteRef   = useRef(null)
  const attrRef    = useRef(null)

  useEffect(() => {
    const words = quoteRef.current?.querySelectorAll('.word')
    if (!words?.length) return

    const mm = gsap.matchMedia()

    /* ── DESKTOP: pin + scrub illumination ─────────────────── */
    mm.add('(min-width: 768px)', () => {
      const totalWords = words.length

      // Start all words dim and attribution invisible
      gsap.set(words,           { color: 'rgba(255,255,255,0.12)' })
      gsap.set(attrRef.current, { opacity: 0, y: 12 })

      // Build timeline — positions are in seconds; auto-duration ≈ 1s
      // which maps 1:1 to scroll progress when scrub is active
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:      sectionRef.current,
          start:        'top top',
          end:          '+=150%',
          pin:          true,
          pinSpacing:   true,
          anticipatePin: 1,
          scrub:        1,
        },
      })

      // Illuminate each word across 0 → 85% of scroll progress
      words.forEach((word, i) => {
        const startPos = (i / totalWords) * 0.85
        tl.to(
          word,
          {
            color:    'rgba(255,255,255,1)',
            ease:     'power1.inOut',
            duration: 0.12,           // relative width inside timeline
          },
          startPos,
        )
      })

      // Attribution snaps in at 95% scroll progress
      tl.to(
        attrRef.current,
        {
          opacity:  1,
          y:        0,
          ease:     'power2.out',
          duration: 0.04,
        },
        0.95,
      )

      // Return cleanup — mm.revert() handles ScrollTrigger + tweens
      return () => {}
    })

    /* ── MOBILE: static, no pin or scrub ───────────────────── */
    mm.add('(max-width: 767px)', () => {
      // All words fully white immediately
      gsap.set(words, { color: 'rgba(255,255,255,1)' })
      gsap.set(attrRef.current, { opacity: 0, y: 12 })

      // Attribution fades in as it enters the viewport
      gsap.fromTo(
        attrRef.current,
        { opacity: 0, y: 12 },
        {
          opacity:  1,
          y:        0,
          duration: 0.6,
          ease:     'power2.out',
          scrollTrigger: {
            trigger:     attrRef.current,
            start:       'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )

      return () => {}
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="philosophy" ref={sectionRef} className="philosophy">
      {/* Ambient teal glow — static, not animated */}
      <div className="philosophy__glow" aria-hidden="true" />

      <div className="philosophy__content">
        {/* The sentence — words individually targeted by GSAP */}
        <p className="philosophy__quote" ref={quoteRef}>
          {WORDS.map((word, i) => (
            <span key={i} className="word">
              {word}{i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>

        {/* Attribution — enters at 95% scroll progress (desktop) */}
        <p className="philosophy__attribution" ref={attrRef}>
          — Himanshu Khemani, <span className="philosophy__attribution-brand">heymanshu</span>
        </p>
      </div>
    </section>
  )
}
