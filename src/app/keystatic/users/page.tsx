'use client'

import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'SUPERADMIN' | 'EDITOR' | 'REVIEWER'
  organisation: string | null
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

const ROLE_LABELS = { SUPERADMIN: 'Super Admin', EDITOR: 'Editor', REVIEWER: 'Reviewer' }
const ROLE_COLORS = {
  SUPERADMIN: 'bg-ink text-paper',
  EDITOR: 'bg-blue-500 text-white',
  REVIEWER: 'bg-peach-300 text-ink',
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // New user form
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR' as AdminUser['role'],
    organisation: '',
  })
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/keystatic-auth/users')
      if (res.status === 403) {
        router.push('/keystatic')
        return
      }
      const data = (await res.json()) as { users?: AdminUser[]; error?: string }
      if (data.users) setUsers(data.users)
      else setError(data.error ?? 'Gagal memuat users')
    } catch {
      setError('Terjadi kesalahan jaringan')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/keystatic-auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { user?: AdminUser; error?: string }
      if (!res.ok) {
        setFormError(data.error ?? 'Gagal membuat user')
      } else {
        setFormSuccess(`User ${data.user?.email} berhasil dibuat`)
        setForm({ name: '', email: '', password: '', role: 'EDITOR', organisation: '' })
        await fetchUsers()
      }
    } catch {
      setFormError('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  async function toggleActive(user: AdminUser) {
    await fetch('/api/keystatic-auth/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
    })
    void fetchUsers()
  }

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-ink pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
              Sekil.id CMS
            </p>
            <h1 className="font-display text-2xl font-bold text-ink">User Management</h1>
          </div>
          <a
            href="/keystatic"
            className="border-2 border-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            ← Kembali ke CMS
          </a>
        </div>

        {error && (
          <div className="mb-6 border-2 border-red-500 bg-red-500/10 px-4 py-3">
            <p className="font-mono text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* User list */}
        <section className="mb-10">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Daftar Admin ({users.length})
          </h2>
          {loading ? (
            <p className="font-mono text-sm text-ash-700">Memuat…</p>
          ) : (
            <div className="border-2 border-ink">
              {users.map((u, i) => (
                <div
                  key={u.id}
                  className={`flex flex-wrap items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-ash-300' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{u.name}</p>
                    <p className="font-mono text-[11px] text-ash-700">{u.email}</p>
                    {u.organisation && (
                      <p className="font-mono text-[10px] text-ash-500">{u.organisation}</p>
                    )}
                  </div>
                  <span
                    className={`border-2 border-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${ROLE_COLORS[u.role]}`}
                  >
                    {ROLE_LABELS[u.role]}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${u.isActive ? 'text-green-600' : 'text-ash-500'}`}
                  >
                    {u.isActive ? '● Aktif' : '○ Nonaktif'}
                  </span>
                  <button
                    onClick={() => toggleActive(u)}
                    className="border border-ash-300 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ash-700 hover:border-ink hover:text-ink"
                  >
                    {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Add user form */}
        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ash-700">
            Tambah User Baru
          </h2>
          <form
            onSubmit={handleCreate}
            className="border-2 border-ink p-6 shadow-[4px_4px_0px_0px_#0a1230]"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                  Nama Lengkap *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
                  placeholder="Dr. Budi Santoso"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
                  placeholder="budi@unjani.ac.id"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                  Password * (min. 8 karakter)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                  Organisasi
                </label>
                <input
                  value={form.organisation}
                  onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))}
                  className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
                  placeholder="UNJANI / B One Corp"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-ash-700">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value as AdminUser['role'] }))
                  }
                  className="w-full border-2 border-ink bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:border-blue-500"
                >
                  <option value="EDITOR">Editor — akses penuh CMS</option>
                  <option value="REVIEWER">Reviewer — review & approve konten</option>
                  <option value="SUPERADMIN">Super Admin — tambah/kelola user</option>
                </select>
              </div>
            </div>

            {formError && (
              <div className="mt-4 border-2 border-red-500 bg-red-500/10 px-3 py-2">
                <p className="font-mono text-[11px] text-red-600">{formError}</p>
              </div>
            )}
            {formSuccess && (
              <div className="mt-4 border-2 border-green-500 bg-green-500/10 px-3 py-2">
                <p className="font-mono text-[11px] text-green-600">{formSuccess}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 border-2 border-ink bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper shadow-[4px_4px_0px_0px_#2966ff] transition-all hover:shadow-none disabled:opacity-50"
            >
              {submitting ? 'Menyimpan…' : 'Buat User →'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
