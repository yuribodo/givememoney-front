import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get('refresh_token')

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token available' }, { status: 401 })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:9090'

    try {
      const refreshResponse = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `refresh_token=${refreshToken.value}`,
        },
      })

        if (!refreshResponse.ok) {
          const response = NextResponse.json({ error: 'Refresh token invalid' }, { status: 401 })

          response.cookies.set('auth_token', '', { maxAge: 0, path: '/' })
          response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' })
          response.cookies.set('session_id', '', { maxAge: 0, path: '/' })

          return response
        }

        await refreshResponse.json()
        const response = NextResponse.json({ success: true })

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