'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { EnvelopeSimple, ArrowRight, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { waitlistSchema, type WaitlistFormData, type WaitlistResponse } from '../types/waitlist'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function WaitlistForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [responseMessage, setResponseMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  })

  const onSubmit = async (data: WaitlistFormData) => {
    setStatus('submitting')
    setResponseMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result: WaitlistResponse = await response.json()

      if (result.success) {
        setStatus('success')
        setResponseMessage(result.message)
        reset()
      } else {
        setStatus('error')
        setResponseMessage(result.message)
      }
    } catch {
      setStatus('error')
      setResponseMessage('Something went wrong. Please try again.')
    }
  }

  // Success state
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyber-mint-500/10 border border-cyber-mint-500/20"
      >
        <CheckCircle size={18} weight="fill" className="text-cyber-mint-500 flex-shrink-0" />
        <p className="text-sm font-medium text-gray-900">{responseMessage}</p>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="relative flex items-center">
          {/* Email input */}
          <div className="relative flex-1">
            <EnvelopeSimple
              size={20}
              weight="duotone"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              disabled={status === 'submitting'}
              className="w-full h-14 pl-12 pr-4 text-base text-gray-900 placeholder-gray-400 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-cyber-mint-500 focus:ring-2 focus:ring-cyber-mint-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={status === 'submitting'}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 h-10 px-5 text-sm font-semibold text-white bg-cyber-mint-500 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: status === 'submitting' ? 1 : 1.02, backgroundColor: '#009485' }}
            whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {status === 'submitting' ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <>
                <span className="hidden sm:inline">Join Waitlist</span>
                <span className="sm:hidden">Join</span>
                <ArrowRight size={16} weight="bold" />
              </>
            )}
          </motion.button>
        </div>

        {/* Error messages */}
        <AnimatePresence mode="wait">
          {(errors.email || status === 'error') && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="flex items-center gap-2 mt-3 text-sm text-red-600"
            >
              <WarningCircle size={16} weight="fill" className="flex-shrink-0" />
              <span>{errors.email?.message || responseMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
