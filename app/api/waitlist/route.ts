import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { waitlistSchema } from '@/features/marketing/types/waitlist'

const FROM_EMAIL = 'GiveMeMoney <hello@contact.givememoney.fun>'

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

function getWelcomeEmailHtml(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAFBFA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="text-align: center; padding-bottom: 32px;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #1A1D1A;">GiveMeMoney</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #FFFFFF; border-radius: 12px; padding: 40px; border: 1px solid #E5E7E5;">
        <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #1A1D1A;">You're on the list!</h2>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #5C665C;">
          Thanks for joining the GiveMeMoney waitlist. We're building the easiest way for streamers to receive crypto donations.
        </p>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #5C665C;">
          We'll notify you as soon as we launch. In the meantime, stay tuned for updates!
        </p>
        <div style="text-align: center; padding: 24px 0 8px 0;">
          <span style="display: inline-block; padding: 12px 24px; background-color: #00A896; color: #FFFFFF; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none;">
            You're In
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding-top: 32px;">
        <p style="margin: 0; font-size: 14px; color: #8A938A;">
          &copy; ${new Date().getFullYear()} GiveMeMoney. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
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

    // Send confirmation email (don't block response if this fails)
    try {
      await resend.emails.send(
        {
          from: FROM_EMAIL,
          to: [email],
          subject: "You're on the GiveMeMoney waitlist!",
          html: getWelcomeEmailHtml(),
        },
        {
          idempotencyKey: `waitlist-welcome/${email}`,
        }
      )
    } catch (emailError) {
      // Log but don't fail the request - contact was already added successfully
      console.error('Failed to send welcome email:', emailError)
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
