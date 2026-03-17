import { useState, useEffect, useRef, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import Header from './components/Header'
import Background from './components/Background'
import Hero from './components/Hero'
import AsidePanel from './components/AsidePanel'
import Narrative from './components/Narrative'
import Manifesto from './components/Manifesto'
import Philosophy from './components/Philosophy'
import Shelf from './components/Shelf'
import Narratives from './components/Narratives'
import News from './components/News'
import CTA from './components/CTA'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [loading, setLoading] = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  useEffect(() => {
    if (panelOpen) {
      lenisRef.current?.stop()
    } else {
      lenisRef.current?.start()
    }
  }, [panelOpen])

  const handleLoaded = useCallback(() => {
    setLoading(false)
  }, [])

  const scrollTo = useCallback((target) => {
    lenisRef.current?.scrollTo(target, { duration: 1.5 })
  }, [])

  /* Passed to Hero so it can pause/resume Lenis when the modal is open */
  const lockScroll   = useCallback(() => { lenisRef.current?.stop()  }, [])
  const unlockScroll = useCallback(() => { lenisRef.current?.start() }, [])

  return (
    <>
      <Loader loading={loading} onComplete={handleLoaded} />
      <Background />
      <div className="p-cover" style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 600, pointerEvents: 'none',
        opacity: 0,
      }} />
      <Header
        onNotifyClick={() => setPanelOpen(true)}
        scrollTo={scrollTo}
      />
      <AsidePanel open={panelOpen} onClose={() => setPanelOpen(false)} />
      <main>
        <Hero scrollTo={scrollTo} loading={loading} lockScroll={lockScroll} unlockScroll={unlockScroll} onNotifyClick={() => setPanelOpen(true)} />
        <Narrative />
        <Manifesto />
        <Philosophy />
        <Shelf />
        <Narratives />
        <News />
      </main>
      <CTA />
      <Footer onNotifyClick={() => setPanelOpen(true)} scrollTo={scrollTo} />
    </>
  )
}

export default App
