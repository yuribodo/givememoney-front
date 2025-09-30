'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "@/components/ui/CryptoIcons"
import { KickIcon } from "@/components/ui/KickIcon"
import {
  expandFromCenterVariants,
  cascadeVariants,
  platformsContainerVariants,
  platformItemVariants,
  immediateViewportSettings
} from "@/lib/animations"

const platforms = [
  {
    name: "Twitch",
    color: "text-white",
    bgColor: "bg-purple-600",
    icon: (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.089 0L.525 4.175v16.694h5.736V24h3.132l3.127-3.132h4.695l6.26-6.258V0H2.089zm2.086 2.085H21.39v11.479l-3.652 3.652H12l-3.127 3.132v-3.132H4.175V2.085z"/>
        <path d="M18.301 5.217v6.26h-2.086v-6.26h2.086zm-5.217 0v6.26H11v-6.26h2.084z"/>
      </svg>
    )
  },
  {
    name: "Kick",
    color: "text-[#53fc18]",
    bgColor: "bg-black",
    icon: <KickIcon className="w-5 h-5 mr-2" />
  },
  {
    name: "YouTube",
    color: "text-white",
    bgColor: "bg-red-600",
    icon: (
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    )
  }
]

export function PlatformSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 overflow-hidden">
      <CryptoIcons />

      <div className="absolute inset-0 bg-gradient-to-br from-cyber-mint-50 via-pearl to-cyber-mint-100 opacity-40"></div>

      <div className="relative max-w-5xl mx-auto z-10 text-center w-full">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={immediateViewportSettings}
        >
          <motion.div
            variants={expandFromCenterVariants}
            className="mb-6 sm:mb-8 px-4 sm:px-0"
          >
            <div className="text-center">
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-10xl font-display font-black text-electric-slate-950 leading-none tracking-tight">
                Works on{' '}
              </span>
              <span
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-10xl font-display font-black leading-none tracking-tight inline-block"
                style={{
                  background: 'linear-gradient(45deg, #f43f5e, #ec4899, #d946ef, #f43f5e)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                  style={{
                    background: 'inherit',
                    backgroundSize: 'inherit',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  every platform
                </motion.span>
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={platformsContainerVariants}
            className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mt-8 sm:mt-12 px-4 sm:px-0"
          >
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                variants={platformItemVariants}
                className={`flex items-center ${platform.color} ${platform.bgColor} px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 font-semibold text-xs sm:text-sm`}
                whileHover={{
                  scale: 1.05,
                  rotate: [-1, 1, -1, 0],
                  transition: { duration: 0.4, type: "spring", bounce: 0.4 }
                }}
                whileTap={{
                  scale: 0.95
                }}
              >
                {platform.icon}
                {platform.name}
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-electric-slate-700 font-medium mt-6 sm:mt-8 px-4 sm:px-0"
            variants={cascadeVariants}
          >
            Stream anywhere, receive donations everywhere
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}