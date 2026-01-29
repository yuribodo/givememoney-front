'use client'

import { motion } from "motion/react"
import { TwitchLogo } from "@phosphor-icons/react"

const steps = [
  {
    number: '01',
    title: 'Connect',
    highlight: 'your wallet',
    description: 'MetaMask or Phantom. One click. No signup required.',
  },
  {
    number: '02',
    title: 'Copy',
    highlight: 'overlay URL',
    description: 'Paste into OBS as browser source. Done.',
  },
  {
    number: '03',
    title: 'Receive',
    highlight: 'crypto',
    description: 'BTC, ETH, SOL direct to your wallet. Zero fees.',
  }
]

export function ValuePropsSection() {
  return (
    <section
      id="how-it-works"
      className="relative"
      style={{
        backgroundColor: '#FAFBFA',
        paddingTop: 'clamp(80px, 10vw, 120px)',
        paddingBottom: 'clamp(80px, 10vw, 120px)'
      }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-cyber-mint-500 text-sm font-mono tracking-wider uppercase mb-3 block">
            How It Works
          </span>
          <h2
            className="font-display font-bold text-gray-900 max-w-lg"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em'
            }}
          >
            Three steps to your first donation
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-0 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border-t border-gray-200 py-8 md:py-10"
            >
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-10">
                {/* Number */}
                <span
                  className="text-gray-200 font-mono font-bold shrink-0 group-hover:text-cyber-mint-300 transition-colors duration-300"
                  style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
                >
                  {step.number}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h3
                    className="font-display font-semibold text-gray-900 mb-1"
                    style={{
                      fontSize: 'clamp(20px, 2.5vw, 28px)',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {step.title}{' '}
                    <span className="text-gray-400 font-normal">{step.highlight}</span>
                  </h3>
                  <p className="text-gray-500 text-base max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bottom border */}
          <div className="border-t border-gray-200" />
        </div>

        {/* Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="text-gray-400 text-sm">
            Works everywhere you stream
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <TwitchLogo size={20} weight="fill" className="text-[#9146FF]" />
              <span className="text-sm font-medium">Twitch</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 rounded bg-[#53FC18] flex items-center justify-center">
                <span className="font-bold text-black text-[10px]">K</span>
              </div>
              <span className="text-sm font-medium">Kick</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 rounded bg-[#FF0000] flex items-center justify-center">
                <span className="text-white text-[10px]">▶</span>
              </div>
              <span className="text-sm font-medium">YouTube</span>
            </div>

            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center">
                <span className="font-bold text-white text-[10px]">O</span>
              </div>
              <span className="text-sm font-medium">OBS</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
