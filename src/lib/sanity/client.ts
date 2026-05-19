import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID env var')

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true,
  // Stega config for visual editing overlays
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ?? '/cms',
  },
})
