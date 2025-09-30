'use client'

import { motion } from "motion/react"
import Image from "next/image"

interface CryptoIconProps {
  src: string
  alt: string
  size: number
  initialX: string
  initialY: string
  duration: number
  delay: number
  opacity: number
}

const FloatingIcon = ({ src, alt, size, initialX, initialY, duration, delay, opacity }: CryptoIconProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: initialX,
        top: initialY,
        zIndex: 1
      }}
      initial={{
        opacity: 0,
        y: 0
      }}
      animate={{
        opacity: opacity,
        y: [-15, 15, -15]
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: {
          duration: duration,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay
        }
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="drop-shadow-sm"
      />
    </motion.div>
  )
}

// Optimized icon configuration - reduced from 10 to 6 icons
const CRYPTO_ICONS = [
  {
    src: "/icons/bitcoin.png",
    alt: "Bitcoin",
    size: 48,
    initialX: "8%",
    initialY: "25%",
    duration: 4,
    delay: 0.2,
    opacity: 0.6
  },
  {
    src: "/icons/ethereum.png",
    alt: "Ethereum",
    size: 40,
    initialX: "12%",
    initialY: "60%",
    duration: 4.5,
    delay: 0.6,
    opacity: 0.5
  },
  {
    src: "/icons/binance.png",
    alt: "Binance",
    size: 36,
    initialX: "88%",
    initialY: "20%",
    duration: 3.8,
    delay: 0.5,
    opacity: 0.4
  },
  {
    src: "/icons/solana.png",
    alt: "Solana",
    size: 42,
    initialX: "90%",
    initialY: "70%",
    duration: 4.2,
    delay: 0.8,
    opacity: 0.45
  },
  {
    src: "/icons/bitcoin.png",
    alt: "Bitcoin",
    size: 32,
    initialX: "85%",
    initialY: "45%",
    duration: 4.8,
    delay: 1.2,
    opacity: 0.35
  },
  {
    src: "/icons/ethereum.png",
    alt: "Ethereum",
    size: 28,
    initialX: "15%",
    initialY: "85%",
    duration: 5,
    delay: 1.5,
    opacity: 0.3
  }
]

export function CryptoIcons() {

  return (
    <div className="absolute inset-0 overflow-hidden">
      {CRYPTO_ICONS.map((icon, index) => (
        <FloatingIcon
          key={`${icon.alt}-${index}`}
          src={icon.src}
          alt={icon.alt}
          size={icon.size}
          initialX={icon.initialX}
          initialY={icon.initialY}
          duration={icon.duration}
          delay={icon.delay}
          opacity={icon.opacity}
        />
      ))}
    </div>
  )
}