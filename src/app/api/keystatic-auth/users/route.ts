import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getSession, type AdminRole } from '@/lib/auth/session'

const VALID_ROLES: AdminRole[] = ['SUPERADMIN', 'EDITOR', 'REVIEWER']

// GET /api/keystatic-auth/users — list all users (SUPERADMIN only)
export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      organisation: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ users })
}

// POST /api/keystatic-auth/users — create user (SUPERADMIN only)
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json()) as {
    email?: unknown
    name?: unknown
    password?: unknown
    role?: unknown
    organisation?: unknown
  }

  if (
    typeof body.email !== 'string' ||
    typeof body.name !== 'string' ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json({ error: 'email, name, password required' }, { status: 400 })
  }

  const role: AdminRole =
    typeof body.role === 'string' && VALID_ROLES.includes(body.role as AdminRole)
      ? (body.role as AdminRole)
      : 'EDITOR'

  if (body.password.length < 8) {
    return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 })
  }

  const existing = await prisma.adminUser.findUnique({
    where: { email: body.email.toLowerCase().trim() },
  })
  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
  }

  const hash = await bcrypt.hash(body.password, 12)
  const user = await prisma.adminUser.create({
    data: {
      email: body.email.toLowerCase().trim(),
      name: body.name.trim(),
      password: hash,
      role,
      organisation: typeof body.organisation === 'string' ? body.organisation.trim() : null,
    },
    select: { id: true, email: true, name: true, role: true, organisation: true, createdAt: true },
  })

  return NextResponse.json({ user }, { status: 201 })
}

// PATCH /api/keystatic-auth/users — toggle isActive (SUPERADMIN only)
export async function PATCH(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'SUPERADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = (await request.json()) as { id?: unknown; isActive?: unknown }
  if (typeof body.id !== 'string' || typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'id and isActive required' }, { status: 400 })
  }

  // Prevent superadmin from deactivating their own account
  if (body.id === session.userId && !body.isActive) {
    return NextResponse.json({ error: 'Tidak bisa menonaktifkan akun sendiri' }, { status: 400 })
  }

  const user = await prisma.adminUser.update({
    where: { id: body.id },
    data: { isActive: body.isActive },
    select: { id: true, email: true, name: true, isActive: true },
  })

  return NextResponse.json({ user })
}
