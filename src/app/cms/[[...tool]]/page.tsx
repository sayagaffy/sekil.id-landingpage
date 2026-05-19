'use client'
/**
 * Embedded Sanity Studio at /cms/[[...tool]]
 *
 * Must be a client component — the Studio uses browser APIs
 * (createContext, styled-components) that cannot run on the server.
 *
 * Sanity handles its own auth; users must be project members.
 */
import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

// Load Studio client-side only — avoids SSR/static-gen issues
// with styled-components and React.createContext
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => ({ default: mod.NextStudio })),
  { ssr: false, loading: () => <div style={{ display: 'none' }} /> },
)

export default function StudioPage() {
  return <NextStudio config={config} />
}
