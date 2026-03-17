import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import InnerHeader from '../components/InnerHeader'
import AsidePanel from '../components/AsidePanel'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

export default function About() {
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
      gsap.fromTo('.about__hero-headline',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'cubic-bezier(0.22,1,0.36,1)', delay: 0.3 }
      )
      gsap.fromTo('.about__hero-sub',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 }
      )
      gsap.fromTo('.about__photo',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1, ease: 'cubic-bezier(0.22,1,0.36,1)', delay: 0.5 }
      )

      document.querySelectorAll('.about__body-section').forEach(section => {
        gsap.fromTo(section,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' }
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

      {/* ── HERO ── */}
      <section
        data-nav-theme="dark"
        style={{
        minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr auto',
        alignItems:'end', padding:'160px 80px 80px', position:'relative', overflow:'hidden',
        background:'#F7F4EF',
      }}>
        {/* Noise */}
        <div style={{position:'absolute',inset:0,opacity:0.03,backgroundImage:NOISE_SVG,backgroundSize:180,mixBlendMode:'multiply',pointerEvents:'none'}} />

        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)',marginBottom:32}}>About</div>
          <h1 className="about__hero-headline" style={{opacity:0}}>
            From Jaipur,<br />
            <em style={{fontFamily:"var(--font-base)",}}>with a sketchbook.</em>
          </h1>
          <p className="about__hero-sub" style={{
            opacity:0, marginTop:32,
            fontFamily:"var(--font-base)", fontSize:'clamp(15px,1.4vw,18px)',
            fontWeight:300, color:'rgba(0,0,0,0.5)', lineHeight:1.7,
            maxWidth:'48ch',
          }}>
            5+ years. 3 countries. 100M+ users.<br />
            One consistent habit: noticing when things feel off.
          </p>
        </div>

        {/* Photo placeholder */}
        <div className="about__photo" style={{
          opacity:0, width:280, height:350,
          background:'rgba(0,0,0,0.04)',
          border:'1px solid rgba(14,107,107,0.2)', borderRadius:4,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          gap:8, flexShrink:0, position:'relative', zIndex:1,
        }}>
          <span style={{fontFamily:"var(--font-base)",fontSize:72,fontWeight:300,color:'rgba(0,0,0,0.1)',lineHeight:1}}>HK</span>
          <span style={{fontFamily:"var(--font-base)",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.2)'}}>Photo coming</span>
        </div>
      </section>

      {/* ── BODY ── */}
      <div style={{padding:'0 80px', maxWidth:900}}>

        {/* Origin story */}
        <div className="about__body-section" style={{padding:'80px 0', borderTop:'1px solid rgba(0,0,0,0.07)'}}>
          <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#B8973C',marginBottom:32}}>Origin</div>
          <div className="cs__pull-quote" style={{marginBottom:40}}>
            <p className="cs__pull-quote-text">"A confusing payment flow isn't a UX problem. It's someone's salary not arriving on time."</p>
          </div>
          <p style={{fontFamily:"var(--font-base)",fontSize:17,fontWeight:300,lineHeight:1.75,color:'rgba(0,0,0,0.6)',marginBottom:24,maxWidth:'62ch'}}>
            That sentence changed how I work. Once you understand that design decisions have weight — that they land somewhere real — you stop treating them like aesthetic choices.
          </p>
          <p style={{fontFamily:"var(--font-base)",fontSize:17,fontWeight:300,lineHeight:1.75,color:'rgba(0,0,0,0.6)',maxWidth:'62ch'}}>
            I've spent 5 years at companies like Paytm, Honda, Wipro, Creditas, and Woo learning this in practice. Each company different. Same underlying problem: products that worked technically but left people feeling uncertain.
          </p>
        </div>

        {/* What I do */}
        <div className="about__body-section" style={{padding:'80px 0', borderTop:'1px solid rgba(0,0,0,0.07)'}}>
          <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#B8973C',marginBottom:32}}>What I Do</div>
          <ul style={{listStyle:'none',padding:0,display:'flex',flexDirection:'column',gap:0}}>
            {[
              'Solo design partner for product teams',
              'Full process: research → systems → delivery',
              'Available for contract engagements and design partnerships',
            ].map((item, i) => (
              <li key={i} style={{fontFamily:"var(--font-base)",fontSize:'clamp(22px,2.5vw,34px)',fontWeight:300,lineHeight:1.3,color:'#0E0E0E',padding:'20px 0',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',gap:16}}>
                <span style={{color:'#B8973C',fontSize:12,fontFamily:"var(--font-base)"}}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Miniature */}
        <div className="about__body-section" style={{padding:'80px 0', borderTop:'1px solid rgba(0,0,0,0.07)'}}>
          <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'#B8973C',marginBottom:32}}>Miniature</div>
          <p style={{fontFamily:"var(--font-base)",fontSize:17,fontWeight:300,lineHeight:1.75,color:'rgba(0,0,0,0.6)',marginBottom:24,maxWidth:'62ch'}}>
            When I'm not doing client work, I run Miniature — a small studio focused on GenAI and Fintech products. It's where I work on things that don't have a brief yet.
          </p>
          <a
            href="https://theminiature.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{fontFamily:"var(--font-base)",fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:'#0A6B6B',display:'inline-flex',alignItems:'center',gap:8}}
          >
            theminiature.co ↗
          </a>
        </div>

        {/* CTA */}
        <div className="about__body-section" style={{padding:'80px 0 120px', borderTop:'1px solid rgba(0,0,0,0.07)'}}>
          <p style={{fontFamily:"var(--font-base)",fontSize:'clamp(28px,3.5vw,48px)',fontWeight:300,lineHeight:1.15,color:'#0E0E0E',marginBottom:40,maxWidth:'20ch',letterSpacing:'-0.02em'}}>
            If something isn't working,<br />let's figure out why.
          </p>
          <button
            onClick={() => setPanelOpen(true)}
            className="btn btn--primary-dark"
            style={{fontSize:15}}
          >
            <span className="btn__text">Let's Talk</span>
            <span className="btn__arrow">→</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
