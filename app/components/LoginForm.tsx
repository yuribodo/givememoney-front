'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../../lib/validations/auth'
import { signIn } from 'next-auth/react'
import { motion } from 'motion/react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        setError('Login successful! Dashboard integration coming soon.')
      }
    } catch (err) {
      setError('Internal error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async () => {
    setIsLoading(true)
    setError('OAuth integration coming soon!')
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <motion.div
          className="bg-error-rose/10 border border-error-rose/20 text-error-rose px-4 py-3 rounded-xl text-sm font-body backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.div>
      )}

      <Input
        {...register('email')}
        type="email"
        id="email"
        variant="auth"
        label="Email"
        placeholder="your@email.com"
        error={errors.email?.message}
      />

      <Input
        {...register('password')}
        type="password"
        id="password"
        variant="auth"
        label="Password"
        placeholder="••••••••"
        showPasswordToggle
        error={errors.password?.message}
      />

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          variant="auth"
          size="auth"
          className="w-full cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </motion.div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-electric-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white/80 text-electric-slate-500 font-body backdrop-blur-sm rounded-full">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            onClick={() => handleOAuthSignIn()}
            disabled={isLoading}
            variant="oauth"
            className="w-full cursor-pointer"
          >
          <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
          </svg>
            <span className="ml-2">Twitch</span>
          </Button>
        </motion.div>
      </div>
    </form>
  )
}