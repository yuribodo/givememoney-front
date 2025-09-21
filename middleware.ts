import { NextRequest, NextResponse } from 'next/server'

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard']

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register']

// API routes that should be excluded from auth checks
const API_ROUTES = ['/api']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // For protected routes, check for authentication token
  const token = getTokenFromRequest(request)

  if (!token) {
    // No token found, redirect to login with return URL
    console.log(`[Middleware] No token found for protected route: ${pathname}`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)

    return NextResponse.redirect(loginUrl)
  }

  console.log(`[Middleware] Token found for protected route: ${pathname}`)

  // If we have a token, we still proceed (validation happens client-side)
  // The client-side auth hook will handle invalid tokens
  return NextResponse.next()
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get from URL params first (for OAuth redirects)
  const url = new URL(request.url)
  const tokenFromUrl = url.searchParams.get('token')
  if (tokenFromUrl) {
    return tokenFromUrl
  }

  // Try to get token from cookie
  const tokenFromCookie = request.cookies.get('auth_token')?.value
  if (tokenFromCookie) {
    return tokenFromCookie
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Since we're using sessionStorage on the client-side,
  // and middleware runs on the server, we can't access sessionStorage here.
  // For protected routes, we'll rely on client-side auth checks in the components.
  return null
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}