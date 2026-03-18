import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useAllArticles } from '../hooks/useAllArticles'
import InnerHeader from '../components/InnerHeader'
import AsidePanel from '../components/AsidePanel'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

export default function Article() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const lenisRef = useRef(null)
  const pageRef = useRef(null)

  const { data: allArticles, loading } = useAllArticles()
  const article = allArticles?.find(a => a.slug === slug) ?? null
  const otherArticles = allArticles?.filter(a => a.slug !== slug).slice(0, 2) ?? []

  useEffect(() => {
    if (!loading && !article) { navigate('/writing'); return }
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [slug])

  useEffect(() => {
    if (!article) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.article__hero-headline',
        { opacity:0, y:40 },
        { opacity:1, y:0, duration:1.1, ease:'cubic-bezier(0.22,1,0.36,1)', delay:0.3 }
      )
      gsap.fromTo('.article__hero-meta',
        { opacity:0, y:20 },
        { opacity:1, y:0, duration:0.7, ease:'power2.out', delay:0.6 }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [slug, article])

  useEffect(() => {
    if (panelOpen) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [panelOpen])

  if (loading) return null
  if (!article) return null

  return (
    <div ref={pageRef} style={{ background:'#EDE8E3', minHeight:'100vh', color:'#1B1B1F', fontFamily:"var(--font-base)", overflowX:'hidden' }}>
      <InnerHeader onNotifyClick={() => setPanelOpen(true)} />
      <AsidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* ── HERO ── */}
      <section
        data-nav-theme="dark"
        style={{
        padding:'160px 80px 80px', position:'relative', overflow:'hidden',
        background:'#EDE8E3', borderBottom:'1px solid rgba(0,0,0,0.07)',
      }}>
        <div style={{position:'absolute',inset:0,opacity:0.03,backgroundImage:NOISE_SVG,backgroundSize:180,mixBlendMode:'multiply',pointerEvents:'none'}} />

        <div className="article__hero-meta" style={{opacity:0,display:'flex',gap:24,alignItems:'center',marginBottom:40,position:'relative',zIndex:1}}>
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C2A661'}}>{article.tag}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'rgba(0,0,0,0.15)'}} />
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,0,0,0.4)'}}>{article.date}</span>
          <span style={{width:4,height:4,borderRadius:'50%',background:'rgba(0,0,0,0.15)'}} />
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,0,0,0.4)'}}>{article.readTime} read</span>
        </div>

        <h1 className="article__hero-headline" style={{opacity:0,position:'relative',zIndex:1}}>
          {article.title}
        </h1>
      </section>

      {/* ── BODY ── */}
      <div className="article__body">
        {article.sections.map((section, si) => (
          <div key={si}>
            {section.heading && (
              <h2 className="article__heading">{section.heading}</h2>
            )}
            {section.paragraphs.map((para, pi) => (
              <p key={pi} className="article__para">{para}</p>
            ))}
            {section.pullQuote && (
              <div className="article__pull-quote">
                "{section.pullQuote}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── MORE WRITING ── */}
      {otherArticles.length > 0 && (
        <div style={{
          borderTop:'1px solid rgba(0,0,0,0.07)',
          padding:'80px 80px 120px',
          maxWidth:'calc(680px + 160px)',
          margin:'0 auto',
        }}>
          <div style={{fontFamily:"var(--font-base)",fontSize:11,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)',marginBottom:40}}>More Writing</div>
          {otherArticles.map((a) => (
            <div
              key={a.slug}
              onClick={() => navigate(`/writing/${a.slug}`)}
              style={{
                display:'flex',justifyContent:'space-between',alignItems:'center',
                padding:'24px 0', borderBottom:'1px solid rgba(0,0,0,0.07)',
                cursor:'pointer', gap:32,
              }}
            >
              <div>
                <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'#C2A661',display:'block',marginBottom:8}}>{a.tag}</span>
                <h4 style={{fontFamily:"var(--font-base)",fontSize:22,fontWeight:300,color:'#1B1B1F',lineHeight:1.2,letterSpacing:'-0.01em'}}>{a.title}</h4>
              </div>
              <span style={{color:'rgba(0,0,0,0.25)',fontSize:18,flexShrink:0}}>→</span>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  )
}
