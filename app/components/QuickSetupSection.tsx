'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "./CryptoIcons"
import { speedSlideVariants, timerCountVariants, pulseGlowVariants, immediateViewportSettings } from "../../lib/animations"

export function QuickSetupSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <CryptoIcons />

      {/* Enhanced background with speed lines effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-mint-50 via-pearl to-cyber-mint-100 opacity-40"></div>
      <div className="absolute inset-0 overflow-hidden">
        {/* Speed lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyber-mint-300 to-transparent opacity-30"
            style={{
              width: `${200 + i * 50}px`,
              top: `${20 + i * 15}%`,
              left: `-${100 + i * 20}px`,
              transform: `rotate(${-15 + i * 2}deg)`
            }}
            animate={{
              x: ['0%', '150%'],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto z-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={immediateViewportSettings}
        >
          <motion.div
            variants={speedSlideVariants}
            className="mb-8"
          >
            <span className="text-8xl lg:text-10xl font-display font-black text-electric-slate-950 leading-none tracking-tight">
              Live in{' '}
            </span>
            <motion.span
              className="text-8xl lg:text-10xl font-display font-black text-cyber-mint-600 leading-none tracking-tight inline-block"
              variants={timerCountVariants}
              whileInView={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px rgba(0, 171, 150, 0)",
                  "0 0 20px rgba(0, 171, 150, 0.5)",
                  "0 0 0px rgba(0, 171, 150, 0)"
                ]
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                },
                textShadow: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            >
              60 seconds
            </motion.span>
          </motion.div>

          <motion.p
            className="text-2xl text-electric-slate-700 font-medium"
            variants={pulseGlowVariants}
          >
            From setup to first donation
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}