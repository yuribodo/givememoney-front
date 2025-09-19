import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '../../../../lib/validations/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validatedData = loginSchema.parse(body)

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validatedData.email,
        password: validatedData.password,
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Dados inválidos' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}