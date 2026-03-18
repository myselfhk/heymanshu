import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useAllCaseStudies } from '../hooks/useAllCaseStudies'
import InnerHeader from '../components/InnerHeader'
import AsidePanel from '../components/AsidePanel'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

/* ─── Noise texture overlay ─── */
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`

/* ─── Visual Panels — CSS-only design compositions ─── */
function PaytmPanelA() {
  const colors = ['#0A4444','#0A5555','#0A5F5F','#056B73','#0A4A4A','#0A5858']
  const radii = [2, 4, 6, 8, 12, 16]
  return (
    <div className="cs__visual-panel cs__visual--paytm-a">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gridTemplateRows:'repeat(4,1fr)', gap:4, padding:32, width:'100%', height:'100%' }}>
        {Array.from({length:24}).map((_,i) => (
          <div key={i} style={{
            background: colors[i % colors.length],
            borderRadius: radii[i % radii.length],
            opacity: 0.4 + (i % 5) * 0.12,
          }} />
        ))}
      </div>
      <div style={{position:'absolute',bottom:24,left:32,fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',color:'rgba(255,255,255,0.25)',textTransform:'uppercase'}}>34 button variants</div>
    </div>
  )
}
function PaytmPanelB() {
  return (
    <div className="cs__visual-panel cs__visual--paytm-b">
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
        <div style={{border:'1px solid #056B73',borderRadius:40,padding:'14px 48px',fontFamily:"var(--font-base)",fontSize:12,letterSpacing:'0.16em',textTransform:'uppercase',color:'#056B73'}}>PAY NOW</div>
        <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',color:'rgba(255,255,255,0.2)',textTransform:'uppercase'}}>1 button variant</span>
      </div>
    </div>
  )
}
function HondaPanelA() {
  const nodes = [
    {label:'Booked',done:true},{label:'Arrived',done:true},{label:'Inspection',done:true},
    {label:'With Technician',done:false,active:true},{label:'Ready 3:30 PM',done:false},
  ]
  return (
    <div className="cs__visual-panel cs__visual--honda-a">
      <div style={{display:'flex',alignItems:'center',gap:0,padding:'0 40px',width:'100%'}}>
        {nodes.map((node,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',flex:1}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,position:'relative'}}>
              <div style={{
                width:12,height:12,borderRadius:'50%',
                background: node.active ? '#056B73' : node.done ? 'rgba(255,255,255,0.35)' : 'transparent',
                border: node.active ? '2px solid #056B73' : node.done ? '2px solid rgba(255,255,255,0.35)' : '2px solid rgba(255,255,255,0.15)',
                flexShrink:0,
              }} />
              <span style={{fontFamily:"var(--font-base)",fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color: node.active ? '#C2A661' : 'rgba(255,255,255,0.3)',whiteSpace:'nowrap',textAlign:'center'}}>{node.label}</span>
            </div>
            {i < nodes.length - 1 && <div style={{flex:1,height:1,background:'rgba(255,255,255,0.1)',margin:'0 4px',marginBottom:20}} />}
          </div>
        ))}
      </div>
    </div>
  )
}
function HondaPanelB() {
  return (
    <div className="cs__visual-panel cs__visual--honda-b">
      <div style={{background:'#0A2020',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'28px 32px',minWidth:260}}>
        <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C2A661',marginBottom:16}}>Service Complete</div>
        {[['Oil Change','Rs. 800'],['Air Filter','Rs. 450'],['Labour','Rs. 600']].map(([item,price],i) => (
          <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontFamily:"var(--font-base)",fontSize:13,color:'rgba(255,255,255,0.55)'}}>
            <span>{item}</span><span>{price}</span>
          </div>
        ))}
        <div style={{display:'flex',justifyContent:'space-between',paddingTop:16,marginTop:4}}>
          <span style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)'}}>Total</span>
          <span style={{fontFamily:"var(--font-base)",fontSize:28,fontWeight:300,color:'white'}}>Rs. 1,850</span>
        </div>
        <div style={{marginTop:20,border:'1px solid #056B73',borderRadius:40,padding:'10px 24px',display:'flex',justifyContent:'center',fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'#056B73',cursor:'pointer'}}>Share on WhatsApp</div>
      </div>
    </div>
  )
}
function WooPanelA() {
  return (
    <div className="cs__visual-panel cs__visual--woo-a">
      <div style={{border:'2px solid rgba(255,255,255,0.12)',borderRadius:24,padding:'28px 24px',width:220,background:'rgba(0,0,0,0.3)'}}>
        <div style={{fontFamily:"var(--font-base)",fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase',color:'#C2A661',marginBottom:16,textAlign:'center'}}>Transaction Confirmed</div>
        <div style={{fontFamily:"var(--font-base)",fontSize:36,fontWeight:300,color:'white',textAlign:'center',marginBottom:8}}>₦ 12,500</div>
        <div style={{fontFamily:"var(--font-base)",fontSize:12,color:'rgba(255,255,255,0.4)',textAlign:'center',marginBottom:4}}>To: Amaka Okonkwo</div>
        <div style={{fontFamily:"var(--font-base)",fontSize:11,color:'rgba(255,255,255,0.25)',textAlign:'center',marginBottom:20}}>REF: WOO-2311-4892</div>
        <div style={{border:'1px solid #C2A661',borderRadius:40,padding:'10px 20px',fontFamily:"var(--font-base)",fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'#C2A661',textAlign:'center'}}>Share Receipt</div>
      </div>
    </div>
  )
}
function WooPanelB() {
  const txns = [
    {init:'AO',name:'Amaka Okonkwo',amount:'₦12,500',time:'Yesterday, 2:14 PM',color:'#056B73'},
    {init:'JT',name:'James Taiwo',amount:'₦5,000',time:'Mon, 11:30 AM',color:'#C2A661'},
    {init:'CN',name:'Chidi Nwosu',amount:'₦8,200',time:'Mon, 9:05 AM',color:'#4A6B4A'},
    {init:'FB',name:'Funke Balogun',amount:'₦3,500',time:'Sun, 6:48 PM',color:'#6B4A4A'},
    {init:'OK',name:'Olu Kanyii',amount:'₦15,000',time:'Sat, 3:22 PM',color:'#4A4A6B'},
  ]
  return (
    <div className="cs__visual-panel cs__visual--woo-b">
      <div style={{width:'100%',padding:'0 24px'}}>
        {txns.map((t,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <div style={{width:32,height:32,borderRadius:'50%',background:t.color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"var(--font-base)",fontSize:10,color:'white',flexShrink:0}}>{t.init}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--font-base)",fontSize:13,color:'rgba(255,255,255,0.65)'}}>{t.name}</div>
              <div style={{fontFamily:"var(--font-base)",fontSize:11,color:'rgba(255,255,255,0.25)'}}>{t.time}</div>
            </div>
            <div style={{fontFamily:"var(--font-base)",fontSize:18,fontWeight:300,color:'white'}}>{t.amount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const VISUAL_PANELS = {
  'paytm-a': PaytmPanelA,
  'paytm-b': PaytmPanelB,
  'honda-a': HondaPanelA,
  'honda-b': HondaPanelB,
  'woo-a':   WooPanelA,
  'woo-b':   WooPanelB,
}

/* ─── Metric counter ─── */
function MetricItem({ metric }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        // If display is a custom string, just animate opacity
        if (metric.display) {
          gsap.fromTo(el, {opacity:0,y:20},{opacity:1,y:0,duration:0.8,ease:'power2.out'})
        }
      }
    })
    return () => st.kill()
  }, [])
  return (
    <div className="cs__metric" ref={ref}>
      <span className="cs__metric-value">{metric.display}</span>
      <span className="cs__metric-label">{metric.label}</span>
    </div>
  )
}

/* ─── Next project card ─── */
function NextProjectCard({ project }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card || !project) return
    let tX = 0, tY = 0, cX = 0, cY = 0, rafId
    const onMove = (e) => {
      const r = card.getBoundingClientRect()
      tX = ((e.clientY-(r.top+r.height/2))/(r.height/2)) * -8
      tY = ((e.clientX-(r.left+r.width/2))/(r.width/2)) * 8
    }
    const onLeave = () => { tX = 0; tY = 0 }
    const tick = () => {
      cX += (tX-cX)*0.08; cY += (tY-cY)*0.08
      card.style.transform = `perspective(1000px) rotateX(${cX}deg) rotateY(${cY}deg)`
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove',onMove); card.removeEventListener('mouseleave',onLeave); cancelAnimationFrame(rafId) }
  }, [project])

  if (!project) return null

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/work/${slug}`)}
      style={{
        background: project.heroGradient,
        borderRadius: 8,
        padding: '48px 40px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Noise overlay */}
      <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:NOISE_SVG,backgroundSize:180,mixBlendMode:'overlay',pointerEvents:'none'}} />
      <div style={{position:'relative',zIndex:1}}>
        <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:16}}>
          {project.company} · {project.discipline}
        </div>
        <div style={{fontFamily:"var(--font-base)",fontSize:'clamp(28px,3vw,44px)',fontWeight:300,lineHeight:1.05,color:'white',letterSpacing:'-0.02em'}}>
          {project.headline.map((line, i) => (
            <div key={i}>{i === project.headline.length - 1
              ? line.replace(project.headlineItalicWord, '').trim() + ' '
              : line
            }{i === project.headline.length - 1 && <em>{project.headlineItalicWord}</em>}</div>
          ))}
        </div>
      </div>
      <div style={{position:'relative',zIndex:1,display:'flex',gap:24}}>
        {project.stats.map((s,i) => (
          <div key={i}>
            <div style={{fontFamily:"var(--font-base)",fontSize:9,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(255,255,255,0.25)',marginBottom:4}}>{s.label}</div>
            <div style={{fontFamily:"var(--font-base)",fontSize:20,fontWeight:300,color:'white'}}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main CaseStudy page ─── */
export default function CaseStudy() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)
  const lenisRef = useRef(null)
  const pageRef = useRef(null)

  const { data: allStudies, loading } = useAllCaseStudies()
  const studyMap = allStudies ? Object.fromEntries(allStudies.map(s => [s.slug, s])) : {}
  const project = studyMap[slug]
  const nextProject = project?.nextProject ? studyMap[project.nextProject] : null

  useEffect(() => {
    if (!loading && !project) { navigate('/'); return }

    // Init Lenis smooth scroll
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
    if (!project || !pageRef.current) return

    const ctx = gsap.context(() => {
      // Chapter content fade+rise
      document.querySelectorAll('.cs__chapter').forEach(chapter => {
        const content = chapter.querySelector('.cs__chapter-content')
        if (!content) return
        gsap.fromTo(content,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger: chapter, start: 'top 72%', toggleActions: 'play none none none' }
          }
        )
      })

      // Pull quotes scale
      document.querySelectorAll('.cs__pull-quote').forEach(quote => {
        gsap.fromTo(quote,
          { opacity: 0, scale: 0.97 },
          {
            opacity: 1, scale: 1, duration: 0.7, ease: 'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger: quote, start: 'top 80%', toggleActions: 'play none none none' }
          }
        )
      })

      // Visual panels
      document.querySelectorAll('.cs__visual-panel').forEach(panel => {
        gsap.fromTo(panel,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger: panel, start: 'top 75%', toggleActions: 'play none none none' }
          }
        )
      })

      // Metrics panel
      document.querySelectorAll('.cs__metric').forEach(metric => {
        gsap.fromTo(metric,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: metric, start: 'top 75%', toggleActions: 'play none none none' }
          }
        )
      })

      // What I Learned
      const learned = document.querySelector('.cs__learned')
      if (learned) {
        gsap.fromTo(learned.querySelector('.cs__learned-text'),
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger: learned, start: 'top 72%', toggleActions: 'play none none none' }
          }
        )
      }

      // Next section
      const nextSection = document.querySelector('.cs__next')
      if (nextSection) {
        gsap.fromTo(nextSection,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: nextSection, start: 'top 80%', toggleActions: 'play none none none' }
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [slug, project])

  useEffect(() => {
    if (panelOpen) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [panelOpen])

  if (loading) return null
  if (!project) return null

  return (
    <div ref={pageRef} className="is-case-study" style={{ background:'#EDE8E3', minHeight:'100vh', color:'#1B1B1F', fontFamily:"var(--font-base)", overflowX:'hidden' }}>
      <InnerHeader onNotifyClick={() => setPanelOpen(true)} />
      <AsidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* ── HERO ── */}
      <section
        className="cs__hero"
        data-nav-theme="light"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          position: 'relative',
          overflow: 'hidden',
          padding: '0 80px 80px',
          background: project.heroGradient,
        }}
      >
        {/* Noise overlay */}
        <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:NOISE_SVG,backgroundSize:180,mixBlendMode:'overlay',pointerEvents:'none',zIndex:1}} />

        {/* Top: meta */}
        <div className="cs__hero-meta" style={{paddingTop:160,position:'relative',zIndex:2}}>
          <span className="cs__company">{project.company}</span>
          <span className="cs__separator">·</span>
          <span className="cs__year">{project.year}</span>
          <span className="cs__separator">·</span>
          <span className="cs__discipline">{project.discipline}</span>
        </div>

        {/* Headline */}
        <div style={{position:'relative',zIndex:2}}>
          <h1 className="cs__hero-headline">
            {project.headline.map((line, i) => (
              <div key={i}>
                {i === project.headline.length - 1
                  ? <>{line.replace(project.headlineItalicWord, '').trimEnd()} <em>{project.headlineItalicWord}</em></>
                  : line
                }
              </div>
            ))}
          </h1>

          {/* Bottom row */}
          <div className="cs__hero-bottom">
            {project.stats.map((stat, i) => (
              <div key={i} className="cs__hero-stat">
                <div className="cs__hero-stat-label">{stat.label}</div>
                <div className="cs__hero-stat-value">{stat.value}</div>
              </div>
            ))}
            <div className="cs__scroll-cue">
              <span>Scroll</span>
              <span style={{fontSize:14}}>↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NARRATIVE BODY ── */}
      <div className="cs__body">
        {project.chapters.map((chapter, ci) => {
          const VisualPanel = chapter.visualPanel ? VISUAL_PANELS[chapter.visualPanel] : null
          return (
            <div key={ci} className="cs__chapter">
              <div className="cs__chapter-number">{chapter.number}</div>
              <div className="cs__chapter-content">
                <div className="cs__chapter-label">{chapter.label}</div>
                <h2 className="cs__chapter-heading">{chapter.heading}</h2>
                {chapter.paragraphs.map((p, pi) => (
                  <p key={pi} className="cs__para">{p}</p>
                ))}
                {chapter.pullQuote && (
                  <div className="cs__pull-quote">
                    <p className="cs__pull-quote-text">"{chapter.pullQuote}"</p>
                  </div>
                )}
                {VisualPanel && <VisualPanel />}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── METRICS PANEL ── */}
      <div className="cs__metrics-panel">
        {project.metrics.map((metric, i) => (
          <MetricItem key={i} metric={metric} />
        ))}
      </div>

      {/* ── WHAT I LEARNED ── */}
      <div className="cs__learned">
        <div className="cs__learned-label">What I Learned</div>
        <p className="cs__learned-text">"{project.learned}"</p>
      </div>

      {/* ── IMPACT LIST ── */}
      <div className="cs__body" style={{paddingTop:80,paddingBottom:0}}>
        <div style={{paddingLeft:'calc(80px + 80px)',paddingBottom:80}}>
          <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)',marginBottom:24}}>Impact</div>
          <ul style={{listStyle:'none',padding:0}}>
            {project.impact.map((item, i) => (
              <li key={i} style={{fontFamily:"var(--font-base)",fontSize:17,fontWeight:300,color:'rgba(0,0,0,0.6)',padding:'12px 0',borderBottom:'1px solid rgba(0,0,0,0.07)',display:'flex',alignItems:'center',gap:16}}>
                <span style={{color:'#C2A661',fontSize:12}}>◆</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── NEXT PROJECT ── */}
      {nextProject && (
        <div className="cs__next">
          <div>
            <div className="cs__next-label">Next Project →</div>
            <a
              href={`/work/${nextProject.slug}`}
              className="cs__next-title"
              onClick={(e) => { e.preventDefault(); navigate(`/work/${nextProject.slug}`) }}
            >
              {nextProject.headline.map((line, i) => (
                <span key={i} style={{display:'block'}}>
                  {i === nextProject.headline.length - 1
                    ? <>{line.replace(nextProject.headlineItalicWord,'').trimEnd()} <em>{nextProject.headlineItalicWord}</em></>
                    : line
                  }
                </span>
              ))}
            </a>
            <div style={{marginTop:16,fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)'}}>
              {nextProject.company} · {nextProject.discipline}
            </div>
          </div>
          <div style={{cursor:'pointer'}} onClick={() => navigate(`/work/${nextProject.slug}`)}>
            <NextProjectCard project={nextProject} />
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
