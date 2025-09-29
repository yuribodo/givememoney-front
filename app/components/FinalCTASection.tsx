'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "./CryptoIcons"
import { ctaVariants, buttonVariants, viewportSettings } from "../../lib/animations"

export function FinalCTASection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 overflow-hidden">
      <CryptoIcons />
      <div className="absolute inset-0 bg-gradient-to-br from-warm-coral-50 via-pearl to-warm-coral-100 opacity-40"></div>

      <div className="relative max-w-5xl mx-auto text-center z-10 w-full">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportSettings}
        >
          <motion.h2
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-10xl font-display font-black text-electric-slate-950 mb-8 sm:mb-12 leading-none tracking-tight px-4 sm:px-0"
            variants={ctaVariants}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <span>Earn{' '}</span>
              <span className="bg-gradient-to-r from-cyber-mint-500 to-cyber-mint-700 bg-clip-text text-transparent block sm:inline">
                crypto donations
              </span>
            </div>
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-electric-slate-700 font-medium mb-12 sm:mb-16 px-4 sm:px-0"
            variants={ctaVariants}
          >
            Bitcoin, Ethereum, Solana & more
          </motion.p>

          <motion.div variants={buttonVariants} className="px-4 sm:px-0">
            <motion.button
              className="bg-electric-slate-950 text-white px-8 py-4 sm:px-12 md:px-16 sm:py-5 md:py-6 rounded-full text-lg sm:text-xl md:text-2xl font-semibold transition-all duration-300 shadow-2xl w-full max-w-sm sm:max-w-none sm:w-auto"
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