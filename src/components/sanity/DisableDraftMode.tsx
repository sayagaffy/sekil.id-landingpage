'use client'

import { useIsPresentationTool } from 'next-sanity/hooks'
import Link from 'next/link'

/**
 * Floating "Exit Preview" button shown when draft mode is active.
 * Hidden when accessed from within the Presentation Tool (Studio)
 * since exiting there has its own mechanism.
 */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  // Don't render when inside the Studio Presentation panel
  if (isPresentationTool) return null

  return (
    <Link
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 border-2 border-ink bg-peach-400 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink shadow-[3px_3px_0_0_#0a1230] transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
    >
      <span aria-hidden="true">👁</span>
      Exit Preview
    </Link>
  )
}
