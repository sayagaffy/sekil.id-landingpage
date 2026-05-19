import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signSession, setSessionCookie } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as {
      email: unknown
      password: unknown
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!user || !user.isActive) {
      // Constant-time response to prevent user enumeration
      await bcrypt.compare(password, '$2b$12$invalidhashpaddingtostoptimingatk')
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })

    const { name, value, options } = setSessionCookie(token)
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    })
    response.cookies.set(name, value, options)
    return response
  } catch (err) {
    console.error('[keystatic-auth/login]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
