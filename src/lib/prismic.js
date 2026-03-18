import * as prismic from '@prismicio/client'

const repositoryName = import.meta.env.VITE_PRISMIC_REPOSITORY_NAME || 'heymanshu'

export function createClient() {
  const client = prismic.createClient(repositoryName, {
    accessToken: import.meta.env.VITE_PRISMIC_ACCESS_TOKEN,
  })
  return client
}
