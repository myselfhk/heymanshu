import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Each layer slides up on scroll to reveal a new background color
const layers = [
  { color: '#034C53', trigger: null },            // 0: teal  - hero (always visible, base)
  { color: '#161616', trigger: '#manifesto' },    // 1: dark  - work section
  { color: '#0A1F1F', trigger: '#philosophy' },   // 2: dark teal - philosophy quote
  { color: '#F7F4EF', trigger: '#shelf' },        // 3: off-white - the shelf
  { color: '#0E0E0E', trigger: '#narratives' },   // 4: dark  - narratives pitch deck
  { color: '#161616', trigger: '#news' },         // 5: dark  - news/writing
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
