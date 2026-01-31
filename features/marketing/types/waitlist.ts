import { z } from 'zod'

// Schema for waitlist email validation
export const waitlistSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// TypeScript types derived from schema
export type WaitlistFormData = z.infer<typeof waitlistSchema>

export type WaitlistResponse = {
  success: boolean
  message: string
}
