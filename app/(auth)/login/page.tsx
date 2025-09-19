'use client'

import { motion } from "motion/react"
import { LoginForm } from '../../components/LoginForm'
import Link from 'next/link'
import { Card, CardContent } from '../../../components/ui/card'

export default function LoginPage() {
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