import '@/styles/keystatic-brand.css'
import { LogoutButton } from '@/components/cms/LogoutButton'

/**
 * Layout for all /keystatic routes.
 * - Imports brand CSS (remaps @keystar/ui tokens to Sekil.id palette)
 * - Renders a fixed LogoutButton over the Keystatic admin shell
 *   (the Keystatic SPA has no built-in logout for custom auth setups)
 */
export default function KeystaticAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <LogoutButton />
    </>
  )
}
