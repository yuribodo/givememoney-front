'use client'

import { motion } from "motion/react"
import { CryptoIcons } from "./CryptoIcons"
import { KickIcon } from "./KickIcon"
import {
  expandFromCenterVariants,
  cascadeVariants,
  platformsContainerVariants,
  platformItemVariants,
  immediateViewportSettings
} from "../../lib/animations"

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
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <CryptoIcons />

      {/* Enhanced background with connection lines */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-coral-50 via-pearl to-warm-coral-100 opacity-40"></div>
      <div className="absolute inset-0 overflow-hidden">
        {/* Connection network */}
        {[
          { left: 10, top: 20 },
          { left: 22, top: 45 },
          { left: 34, top: 15 },
          { left: 46, top: 35 },
          { left: 58, top: 25 },
          { left: 70, top: 40 },
          { left: 82, top: 30 },
          { left: 94, top: 50 }
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-24 bg-gradient-to-b from-transparent via-warm-coral-200 to-transparent"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              transformOrigin: 'center'
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scaleY: [0.5, 1, 0.5],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Connecting dots */}
        {[
          { left: 5, top: 15 },
          { left: 13, top: 55 },
          { left: 21, top: 25 },
          { left: 29, top: 45 },
          { left: 37, top: 35 },
          { left: 45, top: 15 },
          { left: 53, top: 55 },
          { left: 61, top: 25 },
          { left: 69, top: 45 },
          { left: 77, top: 35 },
          { left: 85, top: 20 },
          { left: 93, top: 50 }
        ].map((pos, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 rounded-full bg-warm-coral-300"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
            animate={{
              scale: [0.5, 1.2, 0.5],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut'
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
            variants={expandFromCenterVariants}
            className="mb-8"
          >
            <span className="text-8xl lg:text-10xl font-display font-black text-electric-slate-950 leading-none tracking-tight">
              Works on{' '}
            </span>
            <span
              className="text-8xl lg:text-10xl font-display font-black leading-none tracking-tight inline-block"
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
          </motion.div>

          <motion.div
            variants={platformsContainerVariants}
            className="flex flex-wrap justify-center items-center gap-4 mt-12"
          >
            {platforms.map((platform, i) => (
              <motion.div
                key={platform.name}
                variants={platformItemVariants}
                className={`flex items-center ${platform.color} ${platform.bgColor} px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 font-semibold text-sm`}
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
            className="text-2xl text-electric-slate-700 font-medium mt-8"
            variants={cascadeVariants}
          >
            Stream anywhere, receive donations everywhere
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}