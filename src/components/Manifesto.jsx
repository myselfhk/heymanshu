import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const caseStudies = [
  {
    id: '01',
    title: 'Woo. Nigerian Payments Platform',
    company: 'Woo',
    year: "'22",
    tagline: 'Built the UI layer for a payments platform operating in a market where users had real reasons not to trust digital money.',
    tags: ['Fintech', 'UX Design', 'Trust Systems'],
    color: '#3D5A80',
    href: '#',
  },
  {
    id: '02',
    title: 'Honda. Customer Portal',
    company: 'Honda',
    year: "'23",
    tagline: 'Redesigned the post-purchase relationship between Honda owners and their cars across a complex multi-screen portal.',
    tags: ['Automotive', 'Interaction Design', 'Portal'],
    color: '#2E6B5E',
    href: '#',
  },
  {
    id: '03',
    title: 'Paytm. Design System',
    company: 'Paytm',
    year: "'23",
    tagline: 'One button existed in 34 variations across the app. Built the shared language that stopped that from happening again.',
    tags: ['Fintech', 'Design Systems', 'Scale'],
    color: '#5A3F72',
    href: '#',
  },
  {
    id: '04',
    title: 'Focus Flow. Deep Work Tool',
    company: 'Self-initiated',
    year: "'24",
    tagline: 'A deep-focus tool that adapts to individual work rhythms without interrupting the tools teams already live inside.',
    tags: ['SaaS', 'UX Research', 'Mobile'],
    color: '#7C5E32',
    href: '#',
  },
]

export default function Manifesto() {
  const sectionRef    = useRef(null)
  const panelRefs     = useRef([])
  const counterRef    = useRef(null)
  const studyInfoRef  = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  /* Animate left-column swap whenever active study changes */
  const activatePanel = useCallback((i) => {
    setActiveIndex(i)
    if (counterRef.current) {
      gsap.fromTo(counterRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
      )
    }
    if (studyInfoRef.current) {
      gsap.fromTo(studyInfoRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' },
      )
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      panelRefs.current.filter(Boolean).forEach((panel, i) => {
        const visual = panel.querySelector('.work-panel__visual')
        const body   = panel.querySelector('.work-panel__body')

        /* Set initial hidden state */
        gsap.set(visual, { opacity: 0, y: 56 })
        gsap.set(body,   { opacity: 0, y: 32 })

        /* Entrance: slide up + fade in */
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 82%',
          onEnter: () => {
            gsap.to(visual, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
            gsap.to(body,   { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', delay: 0.12 })
          },
          onLeaveBack: () => {
            gsap.to(visual, { opacity: 0, y: 56, duration: 0.4, ease: 'power2.in' })
            gsap.to(body,   { opacity: 0, y: 32, duration: 0.3, ease: 'power2.in' })
          },
        })

        /* Active-index tracking: fires when panel centre crosses mid-viewport */
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end:   'bottom 55%',
          onEnter:     () => activatePanel(i),
          onEnterBack: () => activatePanel(i),
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [activatePanel])

  const cs = caseStudies[activeIndex]

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="work-section"
    >
      {/* ── Angled wedge: off-white bleeds into dark ── */}
      <div className="work-section__wedge" aria-hidden="true" />

      <div className="work-inner">

        {/* ────────── LEFT: sticky panel ────────── */}
        <div className="work-left">
          <div className="work-left__sticky">

            <p className="work-left__label">Selected Work</p>

            <h2 className="work-left__heading">
              So far,<br />So good
            </h2>

            {/* Counter + progress bar */}
            <div className="work-left__meta">
              <div className="work-left__counter" ref={counterRef}>
                <span className="work-counter__current">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="work-counter__sep">/</span>
                <span className="work-counter__total">
                  {String(caseStudies.length).padStart(2, '0')}
                </span>
              </div>

              <div className="work-left__progress" role="tablist" aria-label="Case studies">
                {caseStudies.map((_, i) => (
                  <div
                    key={i}
                    role="tab"
                    aria-selected={i === activeIndex}
                    className={`work-progress-dot${i === activeIndex ? ' is-active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Active study mini-info */}
            <div className="work-left__study" ref={studyInfoRef}>
              <p className="work-left__study-company">{cs.company}</p>
              <p className="work-left__study-year">{cs.year}</p>
            </div>

            {/* All Work ghost link */}
            <a href="/work" className="btn btn--ghost btn--ghost-dark" style={{ marginTop: 32 }}>
              <span className="btn__text">All Work</span>
              <span className="btn__arrow">→</span>
            </a>

          </div>
        </div>

        {/* ────────── RIGHT: scrolling panels ────────── */}
        <div className="work-right">
          {caseStudies.map((study, i) => (
            <article
              key={i}
              className="work-panel"
              ref={el => { panelRefs.current[i] = el }}
            >
              {/* 5 : 4 visual area */}
              <div className="work-panel__visual">
                <div
                  className="work-panel__img"
                  style={{
                    background: `linear-gradient(148deg, ${study.color} 0%, ${study.color}BB 55%, ${study.color}55 100%)`,
                  }}
                />
                <span className="work-panel__index">{study.id}</span>
              </div>

              {/* Text body */}
              <div className="work-panel__body">
                <div className="work-panel__tags">
                  {study.tags.map(tag => (
                    <span key={tag} className="work-panel__tag">{tag}</span>
                  ))}
                </div>

                <h3 className="work-panel__title">{study.title}</h3>
                <p className="work-panel__tagline">{study.tagline}</p>

                <a href={study.href} className="work-panel__link btn btn--ghost btn--ghost-dark">
                  <span className="btn__text">Case Study</span>
                  <span className="btn__arrow">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
