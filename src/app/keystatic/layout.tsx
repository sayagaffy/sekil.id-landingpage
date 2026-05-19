import '@/styles/keystatic-brand.css'

/**
 * Layout for all /keystatic routes.
 * Imports the brand CSS override that remaps @keystar/ui color tokens
 * (--kui-color-scale-*) to the Sekil.id navy + electric blue + peach palette.
 * Uses html.kui-scheme--* selectors (specificity 0,1,1) to beat the
 * library's injected .kui-scheme--* rules (specificity 0,1,0).
 */
export default function KeystaticAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
