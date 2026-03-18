import { useState, useEffect } from 'react'
import { createClient } from '../lib/prismic'
import { transformShelfProduct } from '../lib/transforms'

// Local fallback matching the existing hardcoded PRODUCTS in ShelfPage.jsx
const LOCAL_FALLBACK = [
  {
    uid: 'design-audit-playbook', num: '01',
    name: 'Design Audit Playbook',
    tagline: "For founders who need to know what's broken before hiring anyone.",
    description: "A structured 40-question framework for evaluating your product's UX, design system, and user flows. Built from 5 years of auditing real products across fintech, automotive, and e-commerce.",
    included: [
      '40 diagnostic questions across 5 categories',
      'Severity scoring framework',
      'Prioritisation matrix (effort vs. impact)',
      'Annotated example audit',
      'PDF + interactive checklist',
    ],
    forWho: 'Founders pre-hiring. Product managers inheriting a messy product. Designers starting a new engagement.',
    price: 'Rs. 999', meta: 'PDF + Checklist · Instant download', cta: 'Get Playbook',
    faq: [
      { q: 'Do I need a design background to use this?', a: 'No. The questions are written for anyone who can look at a product and ask whether something feels right.' },
      { q: 'What format is the deliverable?', a: 'A structured PDF with embedded interactive checklist. Works in Acrobat and most PDF readers.' },
      { q: 'Can I use this for client work?', a: 'Yes, single-use commercial license included. For agency use (multiple clients), contact me.' },
    ],
    cardBg: 'linear-gradient(135deg, #0D1B2A 0%, #0A2A3A 100%)',
    accentColor: '#056B73',
  },
  {
    uid: 'fintech-ui-kit', num: '02',
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
    price: 'Rs. 2,999', meta: 'Figma file · Free updates', cta: 'Get Kit',
    faq: [
      { q: 'Which version of Figma is required?', a: 'Figma 2024+ (uses variables for tokens). Works with free and paid Figma plans.' },
      { q: 'Are the components accessible?', a: 'WCAG 2.1 AA compliant colour contrast throughout. Keyboard navigation patterns included.' },
      { q: 'Does this cover crypto / web3?', a: "Primarily traditional fintech (payments, lending, savings). Some patterns apply to crypto but it's not the focus." },
    ],
    cardBg: 'linear-gradient(135deg, #1A1205 0%, #241808 100%)',
    accentColor: '#C2A661',
  },
]

export function useShelfProducts() {
  const [data, setData] = useState(LOCAL_FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    client.getAllByType('shelf_product', { orderings: [{ field: 'my.shelf_product.num', direction: 'asc' }] })
      .then(docs => {
        const transformed = docs.map(transformShelfProduct)
        setData(transformed.length ? transformed : LOCAL_FALLBACK)
        setLoading(false)
      })
      .catch(() => {
        setData(LOCAL_FALLBACK)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
