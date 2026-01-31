import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { waitlistSchema } from '@/features/marketing/types/waitlist'

// Lazy initialization to avoid build-time errors when env vars are missing
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export async function POST(request: NextRequest) {
  // Verify origin for CSRF protection
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  if (origin && host) {
    const originHost = new URL(origin).host
    if (originHost !== host) {
      return NextResponse.json(
        { success: false, message: 'Invalid request origin' },
        { status: 403 }
      )
    }
  }

  try {
    const body = await request.json()

    // Validate email with Zod
    const result = waitlistSchema.safeParse(body)
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || 'Invalid email'
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      )
    }

    const { email } = result.data
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const resend = getResendClient()

    // Check if API key and audience ID are configured
    if (!resend || !audienceId) {
      console.error('Resend API key or Audience ID not configured')
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    // Add contact to Resend audience
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    })

    // Handle duplicate email (Resend returns error for existing contacts)
    if (error) {
      // Check if it's a duplicate error
      if (error.message?.toLowerCase().includes('already exists') ||
          error.message?.toLowerCase().includes('duplicate')) {
        return NextResponse.json({
          success: true,
          message: "You're already on the list! We'll notify you when we launch.",
        })
      }

      console.error('Resend API error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to join waitlist. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "You're on the list! We'll notify you when we launch.",
    })
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
