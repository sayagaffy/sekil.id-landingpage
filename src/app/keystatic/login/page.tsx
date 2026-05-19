'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/keystatic'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/keystatic-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (!res.ok) {
        setError(data.error ?? 'Login gagal')
        return
      }

      router.push(next)
      router.refresh()
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 border-b-2 border-ink pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash-700">
            Sekil.id CMS
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">Masuk ke Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
              placeholder="nama@organisasi.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border-2 border-red-500 bg-red-500/10 px-3 py-2">
              <p className="font-mono text-[11px] text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-ink bg-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper shadow-[4px_4px_0px_0px_#2966ff] transition-all hover:shadow-none disabled:opacity-50"
          >
            {loading ? 'Memproses…' : 'Masuk →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function KeystaticLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
