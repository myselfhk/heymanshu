import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Each layer slides up on scroll to reveal a new background color
const layers = [
  { color: '#034C53', trigger: null },            // 0: teal  - hero (always visible, base)
  { color: '#1B1B1F', trigger: '#manifesto' },    // 1: dark  - work section
  { color: '#0C1E20', trigger: '#philosophy' },   // 2: dark teal - philosophy quote
  { color: '#EDE8E3', trigger: '#shelf' },        // 3: off-white - Shop
  { color: '#1B1B1F', trigger: '#Narratives' },   // 4: dark  - Narratives pitch deck
  { color: '#1B1B1F', trigger: '#news' },         // 5: dark  - news/writing
]

export default function Background() {
  const layerRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      layers.forEach((layer, i) => {
        if (!layer.trigger || !layerRefs.current[i]) return
        gsap.fromTo(layerRefs.current[i],
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: layer.trigger,
              start: 'top bottom',
              end: 'top 40%',
              scrub: true,
            },
          }
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    >
      {layers.map((layer, i) => (
        <div
          key={i}
          ref={el => layerRefs.current[i] = el}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: layer.color,
          }}
        />
      ))}
    </div>
  )
}
