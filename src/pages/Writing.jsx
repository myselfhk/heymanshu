import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ARTICLES } from '../data/articles'
import InnerHeader from '../components/InnerHeader'
import AsidePanel from '../components/AsidePanel'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function Writing() {
  const [panelOpen, setPanelOpen] = useState(false)
  const lenisRef = useRef(null)
  const pageRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.writing__page-heading',
        { opacity:0, y:32 },
        { opacity:1, y:0, duration:1, ease:'cubic-bezier(0.22,1,0.36,1)', delay:0.3 }
      )
      document.querySelectorAll('.writing__article-row').forEach((row, i) => {
        gsap.fromTo(row,
          { opacity:0, y:24 },
          {
            opacity:1, y:0, duration:0.7, ease:'power2.out', delay: i * 0.1,
            scrollTrigger: { trigger:row, start:'top 85%', toggleActions:'play none none none' }
          }
        )
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (panelOpen) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [panelOpen])

  return (
    <div ref={pageRef} style={{ background:'#F7F4EF', minHeight:'100vh', color:'#0E0E0E', fontFamily:"var(--font-base)", overflowX:'hidden' }}>
      <InnerHeader onNotifyClick={() => setPanelOpen(true)} />
      <AsidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* ── HEADER ── */}
      <div style={{ padding:'160px 80px 64px' }}>
        <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)',marginBottom:20}}>Writing</div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
          <h1 className="writing__page-heading" style={{opacity:0}}>
            All essays.
          </h1>
          <p style={{fontFamily:"var(--font-base)",fontSize:14,color:'rgba(0,0,0,0.35)'}}>
            {ARTICLES.length} essays
          </p>
        </div>
      </div>

      {/* ── ARTICLE LIST ── */}
      <div style={{padding:'0 80px'}}>
        {ARTICLES.map((article, i) => (
          <ArticleRow key={article.slug} article={article} navigate={navigate} />
        ))}

        {/* Ghost row — placeholder for future articles */}
        <div style={{
          padding:'32px 0', border:'1px dashed rgba(0,0,0,0.08)',
          borderLeft:'none', borderRight:'none', marginTop:0,
          display:'flex', alignItems:'center', gap:24,
          opacity:0.4,
        }}>
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.16em',color:'rgba(0,0,0,0.25)',textTransform:'uppercase'}}>More coming</span>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{padding:'80px 80px 64px'}}>
        <p style={{fontFamily:"var(--font-base)",fontSize:15,color:'rgba(0,0,0,0.25)'}}>
          Writing when something needs to be said clearly.
        </p>
      </div>

      <Footer />
    </div>
  )
}

function ArticleRow({ article, navigate }) {
  const [hover, setHover] = useState(false)

  return (
    <div
      className="writing__article-row"
      onClick={() => navigate(`/writing/${article.slug}`)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:'grid', gridTemplateColumns:'60px 1fr auto',
        gap:'0 48px', padding:'36px 0',
        borderBottom:'1px solid rgba(0,0,0,0.07)',
        cursor:'pointer', opacity:0,
        transition:'background 0.3s',
      }}
    >
      {/* Num */}
      <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.16em',color:'rgba(0,0,0,0.2)',textTransform:'uppercase',paddingTop:4}}>{article.num}</div>

      {/* Content */}
      <div>
        <div style={{marginBottom:8,display:'flex',gap:16,alignItems:'center'}}>
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'#B8973C'}}>{article.tag}</span>
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',color:'rgba(0,0,0,0.25)'}}>{article.readTime} read</span>
        </div>
        <h3 style={{
          fontFamily:"var(--font-base)",
          fontSize:'clamp(20px,2.2vw,30px)',fontWeight:300,lineHeight:1.15,
          color: hover ? 'rgba(0,0,0,0.6)' : '#0E0E0E',
          letterSpacing:'-0.01em', marginBottom:12,
          transition:'color 0.3s',
        }}>{article.title}</h3>
        <p style={{fontFamily:"var(--font-base)",fontSize:15,fontWeight:300,color:'rgba(0,0,0,0.45)',lineHeight:1.6,maxWidth:'60ch'}}>{article.excerpt}</p>
      </div>

      {/* CTA */}
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        fontFamily:"var(--font-base)", fontSize:11,
        letterSpacing:'0.14em', textTransform:'uppercase',
        color: hover ? '#0E0E0E' : 'rgba(0,0,0,0.3)',
        transition:'color 0.3s', whiteSpace:'nowrap', alignSelf:'center',
      }}>
        <span>{article.date}</span>
        <span style={{fontSize:14, transform: hover ? 'translateX(4px)' : 'translateX(0)', transition:'transform 0.3s'}}>→</span>
      </div>
    </div>
  )
}
