import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Sekil.id CMS',
  description: 'Sekil.id Content Management System',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

/**
 * Minimal layout for the Studio — no site Header/Footer/fonts injected.
 * SiteChrome already excludes /cms/* via pathname check.
 */
export default function CmsLayout({ children }: { children: React.ReactNode }) {
  return children
}
