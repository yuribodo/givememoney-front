'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "./CryptoIcons"
import { fadeInUpVariants, fadeInVariants, viewportSettings } from "../../lib/animations"

export function HowItWorksSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <CryptoIcons />
      <div className="absolute inset-0 bg-gradient-to-br from-success-emerald-50 via-pearl to-success-emerald-100 opacity-40"></div>

      <div className="relative max-w-5xl mx-auto z-10 text-center">

        <motion.div
          className="mb-40"
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <motion.h2
            className="text-8xl lg:text-10xl font-display font-black text-electric-slate-950 mb-8 leading-none tracking-tight"
            variants={fadeInUpVariants}
          >
            Live in{' '}
            <span className="text-cyber-mint-600">
              60 seconds
            </span>
          </motion.h2>
          <motion.p
            className="text-2xl text-electric-slate-700 font-medium"
            variants={fadeInVariants}
          >
            From setup to first donation
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <motion.h2
            className="text-8xl lg:text-10xl font-display font-black text-electric-slate-950 mb-8 leading-none tracking-tight"
            variants={fadeInUpVariants}
          >
            Works on{' '}
            <span className="bg-gradient-to-r from-warm-coral-500 to-warm-coral-700 bg-clip-text text-transparent">
              every platform
            </span>
          </motion.h2>
          <motion.p
            className="text-2xl text-electric-slate-700 font-medium"
            variants={fadeInVariants}
          >
            Twitch, YouTube, TikTok, anywhere
          </motion.p>
        </motion.div>

      </div>
    </section>
  )
}