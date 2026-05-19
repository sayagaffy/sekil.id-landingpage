import { defineLive } from 'next-sanity'
import { client } from './client'

/**
 * sanityFetch – Use in Server Components for fetching content.
 *   Automatically uses draft perspective when draft mode is active.
 *   Auto-revalidates when content changes via Sanity's Live Content API.
 *
 * SanityLive – React component to add to root layout.
 *   Enables real-time updates in draft/preview mode.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})
