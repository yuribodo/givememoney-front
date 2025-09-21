import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Get refresh token from HttpOnly cookie instead of request body
    const cookieStore = await cookies()
    const refreshTokenCookie = cookieStore.get('refresh_token')

    if (!refreshTokenCookie) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 401 })
    }

    const refresh_token = refreshTokenCookie.value

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:9090'

    try {
      const refreshResponse = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cookie': `refresh_token=${refresh_token}`,
        },
        body: JSON.stringify({ refresh_token }),
      })

        if (!refreshResponse.ok) {
          const response = NextResponse.json({ error: 'Refresh token invalid' }, { status: 401 })

          response.cookies.set('auth_token', '', { maxAge: 0, path: '/' })
          response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
          response.cookies.set('session_id', '', { maxAge: 0, path: '/' })

          return response
        }

        const data = await refreshResponse.json()
        const response = NextResponse.json({
          success: true,
          access_token: data.access_token,
          refresh_token: data.refresh_token ?? null,
        })
        response.cookies.set('auth_token', data.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: typeof data.access_expires_in === 'number'
            ? data.access_expires_in
            : (typeof data.expires_in === 'number' ? data.expires_in : 60 * 60),
        })
        if (data.refresh_token) {
          response.cookies.set('refresh_token', data.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
          })
        }
        if (data.user?.id) {
          response.cookies.set('session_id', data.user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24,
          })
        }
        return response
      } catch (fetchError) {
        console.error('Backend refresh failed:', fetchError)
        return NextResponse.json({ error: 'Backend unavailable' }, { status: 503 })
      }
  } catch (error) {
    console.error('Token refresh failed:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
}

// Check if refresh is needed
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')
    const refreshToken = cookieStore.get('refresh_token')

    if (!authToken) {
      return NextResponse.json({
        needsRefresh: true,
        hasRefreshToken: !!refreshToken
      })
    }

    // Here you would decode the JWT and check expiration
    // For now, assume token is valid if it exists
    return NextResponse.json({
      needsRefresh: false,
      hasRefreshToken: !!refreshToken
    })
  } catch (error) {
    console.error('Refresh check failed:', error)
    return NextResponse.json({ needsRefresh: true, hasRefreshToken: false })
  }
}