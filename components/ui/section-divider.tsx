'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'motion/react'

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'slant'
  flip?: boolean
  fromColor?: string
  toColor?: string
  accentLine?: boolean
  parallax?: boolean
  className?: string
}

// SVG paths for different wave variations
const wavePaths = {
  wave: "M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z",
  curve: "M0,80 Q360,0 720,50 T1440,80 L1440,100 L0,100 Z",
  slant: "M0,100 L1440,40 L1440,100 L0,100 Z"
}

// Accent line paths (stroke only, no fill)
const accentPaths = {
  wave: "M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50",
  curve: "M0,80 Q360,0 720,50 T1440,80",
  slant: "M0,100 L1440,40"
}

// Path lengths for animation (approximate)
const pathLengths = {
  wave: 1600,
  curve: 1500,
  slant: 1450
}

export function SectionDivider({
  variant = 'wave',
  flip = false,
  fromColor = '#FAFBFA',
  toColor = '#FAFBFA',
  accentLine = false,
  parallax = true,
  className = ''
}: SectionDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-50px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Subtle parallax movement
  const y = useTransform(scrollYProgress, [0, 1], parallax ? [-10, 10] : [0, 0])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: 'clamp(60px, 8vw, 100px)',
        marginTop: flip ? 0 : '-1px',
        marginBottom: flip ? '-1px' : 0
      }}
    >
      {/* Background gradient transition */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`
        }}
      />

      {/* SVG Wave shape */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{
            transform: flip ? 'scaleY(-1)' : undefined
          }}
        >
          {/* Main wave shape */}
          <path
            d={wavePaths[variant]}
            fill={toColor}
          />

          {/* Animated accent line along the wave edge */}
          {accentLine && (
            <>
              {/* Glow effect behind the line */}
              <motion.path
                d={accentPaths[variant]}
                fill="none"
                stroke="rgba(0, 168, 150, 0.3)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{ filter: 'blur(4px)' }}
              />
              {/* Main accent line */}
              <motion.path
                d={accentPaths[variant]}
                fill="none"
                stroke="#00A896"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              />
              {/* Animated highlight that travels along the line */}
              <motion.path
                d={accentPaths[variant]}
                fill="none"
                stroke="url(#traveling-highlight)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: [0, 1, 0] } : {}}
                transition={{ duration: 2, ease: "easeInOut", delay: 1.3, repeat: Infinity, repeatDelay: 3 }}
              />
              <defs>
                <linearGradient id="traveling-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="40%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(0, 168, 150, 0.8)" />
                  <stop offset="60%" stopColor="transparent" />
                  <stop offset="100%" stopColor="transparent" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    from="-1"
                    to="1"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
            </>
          )}
        </svg>
      </motion.div>
    </div>
  )
}
