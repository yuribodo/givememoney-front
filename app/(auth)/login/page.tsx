'use client'

import { motion } from "motion/react"
import { LoginForm } from '@/features/auth'
import Link from 'next/link'
import { Card, CardContent } from '../../../components/ui/card'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null

  const errorMessages: Record<string, string> = {
    'invalid_token': 'Authentication failed. The token is invalid or expired. Please try logging in again.',
    'auth_failed': 'Authentication failed. Please check your credentials and try again.',
    'token_generation_failed': 'There was an error generating your authentication token. Please try again.',
    'missing_code': 'OAuth authorization code is missing. Please try the login process again.',
    'server_error': 'Server error occurred. Please try again later.',
    'provider_not_found': 'Authentication provider not found. Please try a different login method.',
    'invalid_state': 'Security validation failed. Please try logging in again.',
    'user_fetch_failed': 'Failed to retrieve user information. Please try again.',
    'user_creation_failed': 'Failed to create user account. Please try again.',
    'session_creation_failed': 'Failed to create session. Please try again.',
  }

  const message = errorMessages[error] || 'An unexpected error occurred. Please try again.'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <h3 className="text-sm font-medium text-red-800">Login Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </motion.div>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardContent className="p-6">
          <ErrorMessage error={error} />

          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl font-bold font-display text-electric-slate-900 mb-2">
              Welcome back
            </h1>
            <p className="text-electric-slate-600 font-body">
              Sign in to your account to continue
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <LoginForm />
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-sm text-electric-slate-600 font-body">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-cyber-mint-600 hover:text-cyber-mint-700 font-medium transition-colors duration-200"
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
