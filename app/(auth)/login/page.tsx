'use client'

import { motion } from "motion/react"
import { LoginForm } from '../../components/LoginForm'
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
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Subtle glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-mint-500/20 to-electric-gold-500/20 rounded-2xl blur opacity-30" />

      <Card className="bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl relative overflow-hidden">
        {/* Glass morphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-mint-50/10 to-transparent rounded-xl" />

        <CardContent className="relative z-10 p-8">
        <ErrorMessage error={error} />

        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Logo/Brand element */}
          <motion.div
            className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-700 rounded-2xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </motion.div>

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
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LoginForm />
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
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