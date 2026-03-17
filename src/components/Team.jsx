import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────────────
   About Me — heymanshu
   Background: #f5f5f5 (light) · Text: dark
   ID: #team — kept for Background.jsx scroll trigger
─────────────────────────────────────────────────────────────────── */

const FACETS = [
  {
    label: 'Background',
    content: '4.5+ years designing digital products across Fintech, Automotive, and SaaS. Started at HDFC, led design at early-stage startups, worked across 3 continents worth of users. Now freelancing and building things for myself.',
  },
  {
    label: 'Expertise',
    content: 'Interaction Design · UX Research · Product Strategy · Design Systems · Motion & Micro-interactions · Prototyping · Figma (advanced) · User Testing & Validation.',
  },
  {
    label: 'Approach',
    content: 'Design is a decision-making tool. Before I open Figma, I want to understand the problem, the constraint, and the person using it. I work best when I\'m embedded in the product conversation — not handed a brief at the end.',
  },
  {
    label: 'Currently',
    content: 'Based in Jaipur, India. Open to consulting engagements and the right full-time opportunity. Building tools for The Shelf. Thinking about trust, clarity, and what makes a product feel inevitable.',
  },
]

export default function Team() {
  const sectionRef   = useRef(null)
  const headingRef   = useRef(null)
  const leftColRef   = useRef(null)
  const rightColRef  = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Heading entrance */
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start:   'top 82%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      /* Left column — stagger facet labels */
      const labels = leftColRef.current?.querySelectorAll('.about-facet')
      labels?.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: leftColRef.current,
              start:   'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      /* Right column content block */
      gsap.fromTo(rightColRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
          delay: 0.25,
          scrollTrigger: {
            trigger: rightColRef.current,
            start:   'top 82%',
            toggleActions: 'play none none reverse',
          },
        },
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  /* Animate content change on facet switch */
  const handleFacetClick = (i) => {
    if (i === active) return
    setActive(i)
    if (rightColRef.current) {
      gsap.fromTo(rightColRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      )
    }
  }

  return (
    <section
      id="team"
      ref={sectionRef}
      className="about-section"
    >
      {/* Diagonal entry wedge — continues the site's rotate(-3deg) language */}
      <div className="about-section__wedge" aria-hidden="true" />

      <div className="container" style={{ flexWrap: 'wrap', paddingTop: 160, paddingBottom: 160 }}>

        {/* Full-width heading row */}
        <div style={{ width: '100%', marginBottom: 72 }}>
          <p className="about-section__eyebrow">About</p>
          <h2
            ref={headingRef}
            className="about-section__heading"
          >
            Designer. Thinker.<br />
            <em>Human.</em>
          </h2>
        </div>

        {/* Two-column: facet list left, content right */}
        <div className="two-col-left" ref={leftColRef}>
          <ul className="about-facet-list">
            {FACETS.map((facet, i) => (
              <li
                key={i}
                className={`about-facet${active === i ? ' is-active' : ''}`}
                onClick={() => handleFacetClick(i)}
                style={{ opacity: 0 }}
              >
                <span className="about-facet__num">0{i + 1}</span>
                <span className="about-facet__label">{facet.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="two-col-right" ref={rightColRef} style={{ opacity: 0 }}>
          <p className="about-section__tag">
            {FACETS[active].label}
          </p>
          <p
            key={active}
            className="about-section__content"
          >
            {FACETS[active].content}
          </p>

          {/* Subtle visual element — monogram */}
          <div className="about-section__monogram" aria-hidden="true">hm</div>
        </div>

      </div>
    </section>
  )
}
