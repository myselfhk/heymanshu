import { useState, useEffect } from 'react'
import { createClient } from '../lib/prismic'
import { transformArticle } from '../lib/transforms'
import { ARTICLES } from '../data/articles'

export function useAllArticles() {
  const [data, setData] = useState(ARTICLES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const client = createClient()
    client.getAllByType('article', { orderings: [{ field: 'my.article.num', direction: 'asc' }] })
      .then(docs => {
        const transformed = docs.map(transformArticle)
        setData(transformed.length ? transformed : ARTICLES)
        setLoading(false)
      })
      .catch(() => {
        setData(ARTICLES)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
