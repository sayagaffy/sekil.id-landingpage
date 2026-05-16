import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block /keystatic and /api/keystatic in production when GitHub OAuth is not configured.
  // In development (local mode) the admin is accessible without auth — intentional.
  // In production, Keystatic's GitHub OAuth handles authentication once configured.
  const isKeystatic =
    pathname.startsWith('/keystatic') || pathname.startsWith('/api/keystatic')

  if (isKeystatic) {
    const isDev = process.env.NODE_ENV === 'development'
    const hasGitHubOAuth = Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID)

    if (!isDev && !hasGitHubOAuth) {
      return new NextResponse(null, { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/keystatic/:path*', '/api/keystatic/:path*'],
}
