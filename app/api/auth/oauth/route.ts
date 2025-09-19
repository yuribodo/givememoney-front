import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, name, provider, providerId } = body

    if (!email || !name || !provider || !providerId) {
      return NextResponse.json(
        { message: 'Dados obrigatórios ausentes' },
        { status: 400 }
      )
    }

    // Validate BACKEND_URL environment variable
    if (!process.env.BACKEND_URL) {
      console.error('Missing required environment variable: BACKEND_URL')
      return NextResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutMs = parseInt(process.env.BACKEND_FETCH_TIMEOUT_MS || '10000', 10)

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeoutMs)

    let response
    try {
      response = await fetch(`${process.env.BACKEND_URL}/api/auth/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          provider,
          providerId,
        }),
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('OAuth request timeout')
        return NextResponse.json(
          { message: 'Timeout na requisição' },
          { status: 504 }
        )
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Erro ao processar login OAuth' },
        { status: response.status }
      )
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}