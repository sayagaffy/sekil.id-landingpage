import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'keystatic_session'
const LOGIN_PATH = '/keystatic/login'

function getSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect the admin page routes — NOT /api/keystatic/* (those are
  // Keystatic's internal API, guarded by Keystatic's own GitHub OAuth).
  // Including the API routes caused the middleware to redirect fetch()
  // calls to the login page (HTML), which Keystatic tried to JSON.parse
  // and crashed with "unexpected character at line 1 column 1".
  const isKeystatic = pathname.startsWith('/keystatic')

  if (!isKeystatic) return NextResponse.next()

  // Always allow: login page + all custom auth API endpoints
  if (
    pathname === LOGIN_PATH ||
    pathname.startsWith('/api/keystatic-auth/')
  ) {
    return NextResponse.next()
  }

  // If ADMIN_JWT_SECRET is not configured → block in production, allow in dev
  const secret = getSecret()
  if (!secret) {
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse(null, { status: 404 })
    }
    return NextResponse.next()
  }

  // Verify JWT session cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token) {
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      // expired / tampered — fall through to redirect
    }
  }

  // Not authenticated → redirect to login with ?next= return URL
  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Only match page routes — API routes use Keystatic's own auth mechanism
  matcher: ['/keystatic/:path*'],
}
