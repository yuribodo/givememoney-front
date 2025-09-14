'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "./CryptoIcons"
import { ctaVariants, buttonVariants, viewportSettings } from "../../lib/animations"

export function FinalCTASection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <CryptoIcons />
      <div className="absolute inset-0 bg-gradient-to-br from-warm-coral-50 via-pearl to-warm-coral-100 opacity-40"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <motion.h2
            className="text-8xl lg:text-10xl font-display font-black text-electric-slate-950 mb-12 leading-none tracking-tight"
            variants={ctaVariants}
          >
            Earn{' '}
            <span className="bg-gradient-to-r from-cyber-mint-500 to-cyber-mint-700 bg-clip-text text-transparent">
              crypto donations
            </span>
          </motion.h2>

          <motion.p
            className="text-2xl text-electric-slate-700 font-medium mb-16"
            variants={ctaVariants}
          >
            Bitcoin, Ethereum, Solana & more
          </motion.p>

          <motion.div variants={buttonVariants}>
            <motion.button
              className="bg-electric-slate-950 text-white px-16 py-6 rounded-full text-2xl font-semibold transition-all duration-300 shadow-2xl"
              whileHover={{
                scale: 1.05,
                backgroundColor: "#334155",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Start Now
            </motion.button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}