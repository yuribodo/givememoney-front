import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { User } from '../../../../lib/backend-types'

interface SessionData {
  access_token: string
  refresh_token: string
  user: User
}

// Set secure HttpOnly cookies (server-side only)
export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token, user }: SessionData = await request.json()

    if (!access_token || !user) {
      return NextResponse.json({ error: 'Missing required session data' }, { status: 400 })
    }

    const response = NextResponse.json({ success: true, user })

    // Set access token as HttpOnly cookie (shorter expiry)
    response.cookies.set('auth_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Set refresh token as HttpOnly cookie (longer expiry)
    if (refresh_token) {
      response.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }

    // Set non-sensitive session identifier for client state
    response.cookies.set('session_id', user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

// Get session data (read HttpOnly cookies server-side)
export async function GET() {
  try {
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')
    const sessionId = cookieStore.get('session_id')

    if (!authToken || !sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:9090'

    try {
      const backendResponse = await fetch(`${backendUrl}/api/auth/session`, {
        method: 'GET',
        headers: {
          'Cookie': `auth_token=${authToken.value}; session_id=${sessionId.value}`,
        },
      })

      if (backendResponse.ok) {
        const backendData = await backendResponse.json()
        return NextResponse.json({
          authenticated: true,
          sessionId: sessionId.value,
          hasToken: true,
          user: backendData.user
        })
      } else {
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }
    } catch (backendError) {
      console.error('Backend session check failed:', backendError)
      return NextResponse.json({
        authenticated: true,
        sessionId: sessionId.value,
        hasToken: true,
        backendError: 'Backend unreachable'
      })
    }
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

// Clear session (logout)
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear all auth cookies
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })

    response.cookies.set('session_id', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json({ error: 'Failed to clear session' }, { status: 500 })
  }
}