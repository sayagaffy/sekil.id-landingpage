'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { CookieConsent } from '@/components/legal/CookieConsent'

/**
 * Conditionally renders the site Header, Footer, and CookieConsent.
 * Hidden on /keystatic/* routes so the CMS admin area gets a clean shell.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isCms = pathname?.startsWith('/keystatic')

  return (
    <>
      {!isCms && <Header />}
      {children}
      {!isCms && <Footer />}
      {!isCms && <CookieConsent />}
    </>
  )
}
