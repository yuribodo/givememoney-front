'use client'

import { motion } from "motion/react"
import { RegisterForm } from '@/features/auth'
import Link from 'next/link'
import { Card, CardContent } from '../../../components/ui/card'

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="bg-white border border-gray-200 rounded-xl">
        <CardContent className="p-6">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl font-bold font-display text-electric-slate-900 mb-3">
              Create account
            </h1>
            <p className="text-lg text-electric-slate-600 font-body max-w-md mx-auto">
              Join GiveMeMoney and revolutionize your financial journey with crypto donations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <RegisterForm />
          </motion.div>

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-sm text-electric-slate-600 font-body">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-cyber-mint-600 hover:text-cyber-mint-700 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
