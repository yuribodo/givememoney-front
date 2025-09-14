'use client'

import { motion } from "motion/react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { ArrowRight } from "lucide-react"
import { BackgroundBeams } from "../../components/ui/background-beams"
import TrueFocus from "../../components/TrueFocus"
import { CryptoIcons } from "./CryptoIcons"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      <BackgroundBeams />
      <CryptoIcons />
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-mint-50 via-pearl to-cyber-mint-100 opacity-30"></div>

      <div className="relative max-w-4xl mx-auto text-center z-10">


        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="font-display font-bold text-electric-slate-950 leading-tight tracking-tight text-center">
            <div className="mb-4 flex items-center justify-center gap-4 flex-wrap">
              <span
                className="font-display font-bold text-electric-slate-950"
                style={{
                  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                  lineHeight: 'clamp(1.1, 1.2, 1.05)'
                }}
              >
                Revolutionize your
              </span>
              <div className="inline-block">
                <TrueFocus
                  sentence="lives"
                  manualMode={true}
                  blurAmount={0}
                  borderColor="#10b981"
                  glowColor="rgba(16, 185, 129, 0.8)"
                  animationDuration={0.3}
                  pauseBetweenAnimations={0}
                  fontSize="clamp(2.5rem, 8vw, 4.5rem)"
                  fontWeight="font-bold"
                  className="font-display text-electric-slate-950"
                  cornerSize={24}
                  cornerOffset={15}
                />
              </div>
            </div>
            <div
              className="font-display font-bold text-electric-slate-950"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                lineHeight: 'clamp(1.1, 1.2, 1.05)'
              }}
            >
              with crypto donations
            </div>
          </div>
        </motion.div>

        <motion.p 
          className="font-body text-electric-slate-700 mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: '1.6'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The first Brazilian platform that connects content creators with their audience through instant cryptocurrency donations during their live streams.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button
            animate={{
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-cyber-mint-600 hover:bg-cyber-mint-700 text-white px-12 py-6 text-xl font-semibold rounded-full cursor-pointer transition-colors duration-300 min-w-[300px] group flex items-center justify-center"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

        </motion.div>


      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pearl to-transparent"></div>
    </section>
  )
}