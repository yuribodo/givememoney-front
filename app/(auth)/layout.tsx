'use client'

import { motion } from "motion/react"
import { ArrowLeft } from "@phosphor-icons/react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#FAFBFA' }}>
      {/* SVG Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="auth-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(0, 168, 150, 0.12)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>

      {/* Fade gradients top/bottom */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#FAFBFA] to-transparent pointer-events-none z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFBFA] to-transparent pointer-events-none z-[1]" />

      {/* Subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0, 168, 150, 0.03), transparent)'
        }}
      />

      {/* Back button - positioned at top left of page */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 group"
        >
          <ArrowLeft size={24} weight="duotone" className="text-electric-slate-700 group-hover:text-electric-slate-900 transition-colors" />
        </Link>
      </motion.div>

      <motion.div
        className="w-full max-w-md p-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
