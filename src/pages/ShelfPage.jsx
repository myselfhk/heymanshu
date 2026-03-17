import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import InnerHeader from '../components/InnerHeader'
import AsidePanel from '../components/AsidePanel'
import Footer from '../components/Footer'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS = [
  {
    num: '01',
    name: 'Design Audit Playbook',
    tagline: 'For founders who need to know what\'s broken before hiring anyone.',
    description: 'A structured 40-question framework for evaluating your product\'s UX, design system, and user flows. Built from 5 years of auditing real products across fintech, automotive, and e-commerce.',
    included: [
      '40 diagnostic questions across 5 categories',
      'Severity scoring framework',
      'Prioritisation matrix (effort vs. impact)',
      'Annotated example audit',
      'PDF + interactive checklist',
    ],
    forWho: 'Founders pre-hiring. Product managers inheriting a messy product. Designers starting a new engagement.',
    price: 'Rs. 999',
    meta: 'PDF + Checklist · Instant download',
    cta: 'Get Playbook',
    faq: [
      { q: 'Do I need a design background to use this?', a: 'No. The questions are written for anyone who can look at a product and ask whether something feels right.' },
      { q: 'What format is the deliverable?', a: 'A structured PDF with embedded interactive checklist. Works in Acrobat and most PDF readers.' },
      { q: 'Can I use this for client work?', a: 'Yes, single-use commercial license included. For agency use (multiple clients), contact me.' },
    ],
    cardBg: 'linear-gradient(135deg, #0D1B2A 0%, #0A2A3A 100%)',
    accentColor: '#0A6B6B',
  },
  {
    num: '02',
    name: 'Fintech UI Kit',
    tagline: 'Built from 5 years inside Paytm, Creditas & Woo. Real patterns, not templates.',
    description: 'A comprehensive Figma component library covering the most common fintech UI patterns: payment flows, transaction history, onboarding, KYC, account management, and more.',
    included: [
      '200+ production-ready components',
      'Complete design token system',
      'Mobile and desktop variants',
      'Dark and light modes',
      'Figma source file with free updates',
    ],
    forWho: 'Product designers working in fintech. Founders building financial products. Design teams looking for a solid starting point.',
    price: 'Rs. 2,999',
    meta: 'Figma file · Free updates',
    cta: 'Get Kit',
    faq: [
      { q: 'Which version of Figma is required?', a: 'Figma 2024+ (uses variables for tokens). Works with free and paid Figma plans.' },
      { q: 'Are the components accessible?', a: 'WCAG 2.1 AA compliant colour contrast throughout. Keyboard navigation patterns included.' },
      { q: 'Does this cover crypto / web3?', a: 'Primarily traditional fintech (payments, lending, savings). Some patterns apply to crypto but it\'s not the focus.' },
    ],
    cardBg: 'linear-gradient(135deg, #1A1205 0%, #241808 100%)',
    accentColor: '#B8973C',
  },
]

/* Accordion item */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'16px 0', background:'none', border:'none', cursor:'pointer',
          textAlign:'left', gap:16,
        }}
      >
        <span style={{fontFamily:"var(--font-base)",fontSize:15,fontWeight:400,color:'rgba(0,0,0,0.65)'}}>{q}</span>
        <span style={{color:'rgba(0,0,0,0.35)',fontSize:18,flexShrink:0,transform:open?'rotate(45deg)':'rotate(0)',transition:'transform 0.3s'}}>+</span>
      </button>
      <div style={{
        overflow:'hidden', maxHeight: open ? 200 : 0,
        transition:'max-height 0.4s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <p style={{fontFamily:"var(--font-base)",fontSize:14,fontWeight:300,color:'rgba(0,0,0,0.5)',lineHeight:1.7,paddingBottom:16}}>{a}</p>
      </div>
    </div>
  )
}

export default function ShelfPage() {
  const [panelOpen, setPanelOpen] = useState(false)
  const lenisRef = useRef(null)
  const pageRef = useRef(null)

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
      document.querySelectorAll('.shelf-page__product').forEach((product, i) => {
        gsap.fromTo(product,
          { opacity:0, y:40 },
          {
            opacity:1, y:0, duration:0.9, ease:'cubic-bezier(0.22,1,0.36,1)',
            scrollTrigger: { trigger:product, start:'top 75%', toggleActions:'play none none none' }
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
    <div ref={pageRef} style={{ background:'#F7F4EF', minHeight:'100vh', fontFamily:"var(--font-base)", overflowX:'hidden' }}>
      {/* Darker header for shelf (light bg) */}
      <div style={{ background:'#F7F4EF' }}>
        <InnerHeader onNotifyClick={() => setPanelOpen(true)} />
      </div>
      <AsidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* ── HEADER ── */}
      <div style={{ padding:'160px 80px 64px', borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
        <div style={{fontFamily:"var(--font-base)",fontSize:11,fontWeight:600,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)',marginBottom:16}}>The Shelf</div>
        <h1 style={{fontFamily:"var(--font-base)",fontSize:'clamp(48px,6vw,80px)',fontWeight:300,lineHeight:0.95,letterSpacing:'-0.03em',color:'#0E0E0E',marginBottom:20}}>
          Things I made<br /><em>that you can use.</em>
        </h1>
        <p style={{fontFamily:"var(--font-base)",fontSize:16,fontWeight:300,color:'rgba(0,0,0,0.45)',maxWidth:'48ch',lineHeight:1.7}}>
          Tools distilled from practice. Not templates — frameworks built from real problems.
        </p>
      </div>

      {/* ── PRODUCTS ── */}
      {PRODUCTS.map((product, i) => (
        <div
          key={i}
          className="shelf-page__product"
          style={{
            padding:'80px 80px', borderBottom:'1px solid rgba(0,0,0,0.06)',
            display:'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 360px' : '360px 1fr',
            gap:80, alignItems:'start', opacity:0,
          }}
        >
          {/* Product card — always rendered, order changes */}
          {i % 2 !== 0 && (
            <div style={{
              background: product.cardBg, borderRadius:12,
              padding:'48px 40px', minHeight:320, position:'relative', overflow:'hidden',
            }}>
              <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,backgroundSize:180,mixBlendMode:'overlay',pointerEvents:'none'}} />
              <div style={{position:'relative',zIndex:1}}>
                <span style={{fontFamily:"var(--font-base)",fontSize:80,fontWeight:300,color:'rgba(255,255,255,0.06)',lineHeight:1,display:'block',marginBottom:16}}>{product.num}</span>
                <h3 style={{fontFamily:"var(--font-base)",fontSize:32,fontWeight:300,color:'white',lineHeight:1.1,marginBottom:8}}>{product.name}</h3>
                <p style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:product.accentColor}}>{product.meta}</p>
                <div style={{marginTop:32,fontFamily:"var(--font-base)",fontSize:40,fontWeight:300,color:'white'}}>{product.price}</div>
              </div>
            </div>
          )}

          {/* Product text */}
          <div>
            <span style={{fontFamily:"var(--font-base)",fontSize:10,fontWeight:600,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(0,0,0,0.3)'}}>{product.num}</span>
            <h2 style={{fontFamily:"var(--font-base)",fontSize:'clamp(28px,3vw,44px)',fontWeight:300,lineHeight:1.1,color:'#0E0E0E',margin:'12px 0 16px',letterSpacing:'-0.02em'}}>{product.name}</h2>
            <p style={{fontFamily:"var(--font-base)",fontSize:16,fontWeight:300,color:'rgba(0,0,0,0.55)',lineHeight:1.7,marginBottom:32,maxWidth:'52ch'}}>{product.description}</p>

            {/* What's included */}
            <div style={{marginBottom:28}}>
              <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(0,0,0,0.35)',marginBottom:12}}>What's included</div>
              <ul style={{listStyle:'none',padding:0,display:'flex',flexDirection:'column',gap:8}}>
                {product.included.map((item, j) => (
                  <li key={j} style={{fontFamily:"var(--font-base)",fontSize:14,color:'rgba(0,0,0,0.6)',display:'flex',gap:10,alignItems:'flex-start'}}>
                    <span style={{color:'#B8973C',fontSize:12,marginTop:2,flexShrink:0}}>◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Who it's for */}
            <div style={{marginBottom:32}}>
              <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(0,0,0,0.35)',marginBottom:8}}>Who it's for</div>
              <p style={{fontFamily:"var(--font-base)",fontSize:14,color:'rgba(0,0,0,0.55)',lineHeight:1.65}}>{product.forWho}</p>
            </div>

            {/* FAQ */}
            <div style={{marginBottom:36}}>
              <div style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:'rgba(0,0,0,0.35)',marginBottom:8}}>FAQ</div>
              {product.faq.map((item, j) => <FaqItem key={j} {...item} />)}
            </div>

            {/* CTA */}
            <div style={{display:'flex',alignItems:'center',gap:20}}>
              <a href="#" className="btn btn--primary-light">
                <span className="btn__text">{product.cta}</span>
                <span className="btn__arrow">→</span>
              </a>
              <span style={{fontFamily:"var(--font-base)",fontSize:15,fontWeight:500,color:'#0E0E0E'}}>{product.price}</span>
            </div>
          </div>

          {/* Product card — right side */}
          {i % 2 === 0 && (
            <div style={{
              background: product.cardBg, borderRadius:12,
              padding:'48px 40px', minHeight:320, position:'relative', overflow:'hidden',
            }}>
              <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,backgroundSize:180,mixBlendMode:'overlay',pointerEvents:'none'}} />
              <div style={{position:'relative',zIndex:1}}>
                <span style={{fontFamily:"var(--font-base)",fontSize:80,fontWeight:300,color:'rgba(255,255,255,0.06)',lineHeight:1,display:'block',marginBottom:16}}>{product.num}</span>
                <h3 style={{fontFamily:"var(--font-base)",fontSize:32,fontWeight:300,color:'white',lineHeight:1.1,marginBottom:8}}>{product.name}</h3>
                <p style={{fontFamily:"var(--font-base)",fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',color:product.accentColor}}>{product.meta}</p>
                <div style={{marginTop:32,fontFamily:"var(--font-base)",fontSize:40,fontWeight:300,color:'white'}}>{product.price}</div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{padding:'64px 80px 32px'}}>
        <p style={{fontFamily:"var(--font-base)",fontSize:15,color:'rgba(0,0,0,0.3)'}}>More tools in the making.</p>
      </div>

      <Footer />
    </div>
  )
}
