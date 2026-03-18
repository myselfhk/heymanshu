import { useState, useEffect } from 'react'
import { createClient } from '../lib/prismic'
import { transformCaseStudy } from '../lib/transforms'
import { CASE_STUDIES } from '../data/caseStudies'

// Local fallback: convert the CASE_STUDIES object to an array with manifesto fields
const LOCAL_FALLBACK = [
  {
    ...CASE_STUDIES.woo,
    manifestoOrder: 1, manifestoId: '01',
    manifestoTitle: 'Woo. Nigerian Payments Platform',
    manifestoTagline: 'Built the UI layer for a payments platform operating in a market where users had real reasons not to trust digital money.',
    manifestoTags: ['Fintech', 'UX Design', 'Trust Systems'],
    manifestoColor: '#3D5A80', manifestoHasLink: true, href: '/work/woo',
  },
  {
    ...CASE_STUDIES.honda,
    manifestoOrder: 2, manifestoId: '02',
    manifestoTitle: 'Honda. Customer Portal',
    manifestoTagline: 'Redesigned the post-purchase relationship between Honda owners and their cars across a complex multi-screen portal.',
    manifestoTags: ['Automotive', 'Interaction Design', 'Portal'],
    manifestoColor: '#2E6B5E', manifestoHasLink: true, href: '/work/honda',
  },
  {
    ...CASE_STUDIES.paytm,
    manifestoOrder: 3, manifestoId: '03',
    manifestoTitle: 'Paytm. Design System',
    manifestoTagline: 'One button existed in 34 variations across the app. Built the shared language that stopped that from happening again.',
    manifestoTags: ['Fintech', 'Design Systems', 'Scale'],
    manifestoColor: '#5A3F72', manifestoHasLink: true, href: '/work/paytm',
  },
  // Focus Flow placeholder — no case study link
  {
    slug: 'focus-flow', company: 'Self-initiated', year: '2024', discipline: 'SaaS',
    heroGradient: 'linear-gradient(160deg, #1A1205 0%, #241808 100%)',
    headline: ['Focus Flow', 'Deep Work Tool'], headlineItalicWord: 'Deep Work Tool',
    stats: [], chapters: [], metrics: [], learned: '', impact: [], nextProject: null,
    manifestoOrder: 4, manifestoId: '04',
    manifestoTitle: 'Focus Flow. Deep Work Tool',
    manifestoTagline: 'A deep-focus tool that adapts to individual work rhythms without interrupting the tools teams already live inside.',
    manifestoTags: ['SaaS', 'UX Research', 'Mobile'],
    manifestoColor: '#7C5E32', manifestoHasLink: false, href: null,
  },
]

export function useAllCaseStudies() {
  const [data, setData] = useState(LOCAL_FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    client.getAllByType('case_study', { orderings: [{ field: 'my.case_study.manifesto_order', direction: 'asc' }] })
      .then(docs => {
        const transformed = docs.map(transformCaseStudy)
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
