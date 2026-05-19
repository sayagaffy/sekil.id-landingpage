'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'
import { CookieConsent } from '@/components/legal/CookieConsent'

interface SiteChromeProps {
  children: React.ReactNode;
  /** Pre-rendered server component passed in from layout.tsx */
  header?: React.ReactNode;
}

/**
 * Conditionally renders the site Header, Footer, and CookieConsent.
 * Hidden on /cms/* (Sanity Studio) so the admin area gets a clean shell.
 *
 * The `header` prop is a pre-rendered React Server Component (HeaderServer)
 * passed down from layout.tsx — this is the Next.js pattern for using RSCs
 * inside a Client Component without breaking server boundaries.
 */
export function SiteChrome({ children, header }: SiteChromeProps) {
  const pathname = usePathname()
  const isCms = pathname?.startsWith('/cms')

  return (
    <>
      {!isCms && header}
      {children}
      {!isCms && <Footer />}
      {!isCms && <CookieConsent />}
    </>
  )
}
