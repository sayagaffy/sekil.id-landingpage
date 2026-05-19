'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Floating logout button injected into the Keystatic admin layout.
 * Fixed to the bottom-left corner so it aligns with the sidebar footer.
 * Calls /api/keystatic-auth/logout then redirects to /keystatic/login.
 */
export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/keystatic-auth/logout', { method: 'POST' })
    } finally {
      router.push('/keystatic/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      aria-label="Logout dari CMS"
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        background: '#f6f6f1',
        color: '#0a1230',
        border: '2px solid #0a1230',
        borderRadius: 0,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        boxShadow: '3px 3px 0 0 #0a1230',
        transition: 'box-shadow 120ms, transform 120ms',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        if (!loading) {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'translate(3px, 3px)'
        }
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '3px 3px 0 0 #0a1230'
        ;(e.currentTarget as HTMLButtonElement).style.transform = 'none'
      }}
    >
      {/* Power-off icon (inline SVG, no external dep) */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
      {loading ? 'Keluar…' : 'Keluar'}
    </button>
  )
}
