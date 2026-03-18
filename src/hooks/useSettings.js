import { useState, useEffect } from 'react'
import { createClient } from '../lib/prismic'
import { transformSettings } from '../lib/transforms'

const DEFAULT_GALLERY_ITEMS = [
  { src: '/images/gallery-1.jpg', bg: '#1E2A3D' },
  { src: '/images/gallery-2.jpg', bg: '#2E1E3D' },
  { src: '/images/gallery-3.jpg', bg: '#1E3D2C' },
  { src: '/images/gallery-4.jpg', bg: '#3D2A1E' },
  { src: '/images/gallery-5.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-6.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-7.jpg', bg: '#3D3A1E' },
  { src: '/images/gallery-8.jpg', bg: '#3D3A1E' },
]

const DEFAULT_SETTINGS = {
  philosophyQuote: "Design is not what something looks like. It's what decision it protects you from making.",
  galleryItems: DEFAULT_GALLERY_ITEMS,
  about: {
    headline: 'From Jaipur, with a sketchbook.',
    subtitle: '5+ years. 3 countries. 100M+ users.\nOne consistent habit: noticing when things feel off.',
    originQuote: 'A confusing payment flow isn\'t a UX problem. It\'s someone\'s salary not arriving on time.',
    originParagraphs: [
      'That sentence changed how I work. Once you understand that design decisions have weight — that they land somewhere real — you stop treating them like aesthetic choices.',
      "I've spent 5 years at companies like Paytm, Honda, Wipro, Creditas, and Woo learning this in practice. Each company different. Same underlying problem: products that worked technically but left people feeling uncertain.",
    ],
    whatIDo: [
      'Solo design partner for product teams',
      'Full process: research → systems → delivery',
      'Available for contract engagements and design partnerships',
    ],
    miniatureText: "When I'm not doing client work, I run Miniature — a small studio focused on GenAI and Fintech products. It's where I work on things that don't have a brief yet.",
    miniatureUrl: 'https://theminiature.co',
  },
}

export function useSettings() {
  const [data, setData] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    client.getSingle('settings')
      .then(doc => {
        const transformed = transformSettings(doc)
        // Ensure gallery items fall back to local images if Prismic has none
        if (!transformed.galleryItems.length) {
          transformed.galleryItems = DEFAULT_GALLERY_ITEMS
        }
        setData(transformed)
        setLoading(false)
      })
      .catch(() => {
        setData(DEFAULT_SETTINGS)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
