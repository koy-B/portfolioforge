import { NextRequest, NextResponse } from 'next/server'

const AUTH_COOKIE_NAME = 'portfolioforge_session'
const AUTH_SECRET = process.env.AUTH_SECRET ?? 'portfolioforge-development-secret'

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return base64UrlEncode(signature)
}

async function verifyToken(token?: string | null) {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  if ((await sign(payload)) !== signature) return null

  try {
    const decoded = JSON.parse(base64UrlDecode(payload)) as {
      exp?: number
      role?: string
    }
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const session = await verifyToken(token)
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/builder') || isAdminRoute

  // Guest path redirect
  const isGuestRoute = pathname === '/login' || pathname === '/register'
  if (isGuestRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdminRoute && session.role !== 'ADMIN') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder',
    '/admin/:path*',
    '/api/admin/:path*',
    '/login',
    '/register',
  ],
}
