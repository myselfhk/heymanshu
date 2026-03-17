import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ─────────────────────────────────────────────────────────────────
   Writing — heymanshu
   Background: #161616 (dark) · Text: white / muted
   ID: #news — kept for Background.jsx scroll trigger
─────────────────────────────────────────────────────────────────── */

const ARTICLES = [
  {
    num:     '01',
    tag:     'Product Design',
    title:   'Why most startup UX fails before the first wireframe',
    excerpt: 'The problem isn\'t bad design. It\'s that design started too late in the conversation.',
    readTime: '4 min',
    href:    '#',
  },
  {
    num:     '02',
    tag:     'Design Systems',
    title:   'A design system isn\'t a Figma file. It\'s a shared language.',
    excerpt: 'One button existed in 34 variations across the app. Here\'s how that happens — and how you stop it.',
    readTime: '6 min',
    href:    '#',
  },
  {
    num:     '03',
    tag:     'Fintech',
    title:   'Building trust in digital payments: lessons from Woo',
    excerpt: 'Users in Nigeria had real reasons not to trust digital money. Design had to earn that trust, not assume it.',
    readTime: '5 min',
    href:    '#',
  },
]

export default function News() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* Title entrance */
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

      /* Article cards — stagger in */
      const cards = sectionRef.current?.querySelectorAll('.writing-card')
      cards?.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start:   'top 85%',
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
      id="news"
      ref={sectionRef}
      className="writing-section"
    >
      <div className="container" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Section header row */}
        <div className="writing-section__header">
          <div>
            <p className="writing-section__eyebrow">Writing</p>
            <h2 ref={titleRef} className="writing-section__heading" style={{ opacity: 0 }}>
              Thinking<br />out loud
            </h2>
          </div>
          <a href="/writing" className="writing-section__all-link btn btn--ghost btn--ghost-dark">
            <span className="btn__text">All Writing</span>
            <span className="btn__arrow">→</span>
          </a>
        </div>

        {/* Article cards */}
        <div className="writing-cards-grid">
          {ARTICLES.map((article, i) => (
            <a
              key={i}
              href={article.href}
              className="writing-card"
              style={{ opacity: 0 }}
            >
              <div className="writing-card__top">
                <span className="writing-card__num">{article.num}</span>
                <span className="writing-card__tag">{article.tag}</span>
                <span className="writing-card__read-time">{article.readTime} read</span>
              </div>
              <h3 className="writing-card__title">{article.title}</h3>
              <p className="writing-card__excerpt">{article.excerpt}</p>
              <div className="writing-card__cta">
                <span>Read</span>
                <span className="writing-card__arrow">→</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
