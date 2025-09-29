import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { serialize } from 'cookie'

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleProxyRequest(request, resolvedParams.path, 'GET')
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleProxyRequest(request, resolvedParams.path, 'POST')
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleProxyRequest(request, resolvedParams.path, 'PUT')
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleProxyRequest(request, resolvedParams.path, 'DELETE')
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params
  return handleProxyRequest(request, resolvedParams.path, 'PATCH')
}

async function handleProxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // CSRF/origin check for state-changing operations
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      if (!origin || !host || new URL(origin).host !== host) {
        return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
      }
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:9090'
    const path = '/' + pathSegments.join('/')
    const url = new URL(path, backendUrl)

    // Forward query parameters
    const searchParams = request.nextUrl.searchParams
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    // Get cookies from the request
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')
    const refreshToken = cookieStore.get('refresh_token')
    const sessionId = cookieStore.get('session_id')

    // Build cookie header for backend request
    const cookieHeaders: string[] = []
    if (authToken) {
      cookieHeaders.push(serialize('auth_token', authToken.value))
    }
    if (refreshToken) {
      cookieHeaders.push(serialize('refresh_token', refreshToken.value))
    }
    if (sessionId) {
      cookieHeaders.push(serialize('session_id', sessionId.value))
    }

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }

    // Add cookie header if we have cookies
    if (cookieHeaders.length > 0) {
      headers['Cookie'] = cookieHeaders.join('; ')
    }

    // Forward specific headers from the original request
    const headersToForward = [
      'content-type',
      'authorization',
      'user-agent',
      'accept-language',
      'accept-encoding'
    ]

    headersToForward.forEach(headerName => {
      const value = request.headers.get(headerName)
      if (value) {
        headers[headerName] = value
      }
    })

    // Prepare request body
    let body: string | undefined
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        try {
          const jsonBody = await request.json()
          body = JSON.stringify(jsonBody)
          headers['Content-Type'] = 'application/json'
        } catch {
          // If JSON parsing fails, fall back to text
          body = await request.text()
        }
      } else {
        body = await request.text()
      }
    }

    // Make request to backend
    const backendResponse = await fetch(url.toString(), {
      method,
      headers,
      body,
    })

    // Forward response from backend
    const responseData = await backendResponse.text()

    // Create response with same status and headers
    const response = new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    })

    // Forward relevant response headers
    const headersToForwardBack = [
      'content-type',
      'cache-control',
      'etag',
      'last-modified',
      'location'
    ]

    headersToForwardBack.forEach(headerName => {
      const value = backendResponse.headers.get(headerName)
      if (value) {
        response.headers.set(headerName, value)
      }
    })

    // Handle Set-Cookie headers from backend (update our cookies)
    const setCookieHeaders = backendResponse.headers.get('set-cookie')
    if (setCookieHeaders) {
      // Parse and set cookies from backend response
      // This is a simplified implementation - you might need more sophisticated cookie parsing
      const cookies = setCookieHeaders.split(',').map(c => c.trim())
      cookies.forEach(cookie => {
        const [nameValue] = cookie.split(';')
        const [name, value] = nameValue.split('=')
        if (name && value) {
          response.cookies.set(name.trim(), value.trim(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          })
        }
      })
    }

    return response

  } catch (error) {
    console.error('Proxy request failed:', error)
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    )
  }
}