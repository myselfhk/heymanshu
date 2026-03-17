import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────────────
   Experience — heymanshu
   Background: #f5f5f5 (light) · Text: dark
   ID: #jobs — kept for Background.jsx scroll trigger
─────────────────────────────────────────────────────────────────── */

const TOOLS = [
  'Figma',
  'GSAP · Framer Motion',
  'Design Systems',
  'User Research',
  'Interaction Design',
  'Prototyping',
  'Motion Design',
  'Usability Testing',
]

const EXPERIENCE = [
  {
    company:  'Paytm',
    role:     'Lead Designer, Design Systems',
    period:   '2023 – 2024',
    note:     'Built a unified design language for 8 product teams. Reduced component variants by 70%.',
  },
  {
    company:  'Honda India',
    role:     'UX Design Lead',
    period:   '2023',
    note:     'Redesigned the post-purchase customer portal — 2.8M owners across 3 platforms.',
  },
  {
    company:  'Woo Finance',
    role:     'Product Designer',
    period:   '2022',
    note:     'Built trust UI for a digital payments platform operating in Nigeria.',
  },
  {
    company:  'HDFC Bank Digital',
    role:     'UI/UX Designer',
    period:   '2021 – 2022',
    note:     'Worked on mobile banking flows used by 45M+ customers daily.',
  },
]

export default function Jobs() {
  const sectionRef  = useRef(null)
  const titleRef    = useRef(null)
  const toolsRef    = useRef(null)
  const expRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Title */
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start:   'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      /* Tool tags — stagger */
      const tags = toolsRef.current?.querySelectorAll('.exp-tag')
      tags?.forEach((tag, i) => {
        gsap.fromTo(tag,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1, scale: 1, duration: 0.45, delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: toolsRef.current,
              start:   'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

      /* Experience rows */
      const rows = expRef.current?.querySelectorAll('.exp-row')
      rows?.forEach((row, i) => {
        gsap.fromTo(row,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.55, delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: expRef.current,
              start:   'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="jobs"
      ref={sectionRef}
      className="exp-section"
    >
      {/* Diagonal entry wedge */}
      <div className="exp-section__wedge" aria-hidden="true" />

      <div className="container" style={{ flexWrap: 'wrap', paddingTop: 160, paddingBottom: 160 }}>

        {/* Full-width heading */}
        <div style={{ width: '100%', marginBottom: 72 }}>
          <p className="exp-section__eyebrow">Experience</p>
          <h2 ref={titleRef} className="exp-section__heading" style={{ opacity: 0 }}>
            Where the<br />work happened
          </h2>
        </div>

        {/* Left: toolkit */}
        <div className="two-col-left" ref={toolsRef}>
          <h3 className="exp-section__col-label">Toolkit</h3>
          <div className="exp-tags">
            {TOOLS.map((tool, i) => (
              <span key={i} className="exp-tag" style={{ opacity: 0 }}>
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Right: timeline */}
        <div className="two-col-right" ref={expRef}>
          <h3 className="exp-section__col-label">Timeline</h3>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="exp-row" style={{ opacity: 0 }}>
              <div className="exp-row__left">
                <p className="exp-row__company">{exp.company}</p>
                <p className="exp-row__role">{exp.role}</p>
              </div>
              <div className="exp-row__right">
                <p className="exp-row__period">{exp.period}</p>
                <p className="exp-row__note">{exp.note}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
