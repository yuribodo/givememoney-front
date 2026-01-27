'use client'

import { useRef, useEffect } from "react"
import { motion, useInView } from "motion/react"
import { ArrowRight, Play, Wallet, TwitchLogo } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"

// Crypto icons for the cards
const cryptoIcons = [
  { src: '/icons/bitcoin.png', alt: 'Bitcoin', name: 'BTC' },
  { src: '/icons/ethereum.png', alt: 'Ethereum', name: 'ETH' },
  { src: '/icons/solana.png', alt: 'Solana', name: 'SOL' },
  { src: '/icons/binance.png', alt: 'BNB Chain', name: 'BNB' },
]

// Grid Pattern Component
function GridPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hero-grid"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke="rgba(0, 168, 150, 0.08)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
    </svg>
  )
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "0px" })

  useEffect(() => {
    if (!isInView || !sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

      tl.fromTo('.hero-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.1
      )

      tl.fromTo('.hero-subheadline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.8
      )

      tl.fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        1.0
      )

      tl.fromTo('.hero-crypto-card',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08 },
        1.2
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center px-6 overflow-hidden min-h-[100vh]"
      style={{
        backgroundColor: '#FAFBFA',
        paddingTop: 'clamp(100px, 10vw, 140px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)'
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid pattern */}
        <GridPattern />

        {/* Gradient fade from top */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: 'linear-gradient(to bottom, #FAFBFA, transparent)'
          }}
        />

        {/* Gradient fade from bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: 'linear-gradient(to top, #FAFBFA, transparent)'
          }}
        />

        {/* Accent glow - very subtle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0, 168, 150, 0.03) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="relative max-w-[800px] mx-auto text-center z-10 w-full">

        {/* Badge */}
        <motion.div
          className="hero-badge inline-flex items-center gap-3 px-1.5 pr-4 py-1.5 rounded-full mb-10 opacity-0"
          style={{
            background: '#fff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full"
            style={{ background: 'linear-gradient(135deg, #9146FF 0%, #772CE8 100%)' }}
          >
            <TwitchLogo size={16} weight="fill" className="text-white" />
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ backgroundColor: '#22C55E', opacity: 0.75 }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: '#22C55E' }}
              />
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Live on Twitch & Kick
            </span>
          </div>
        </motion.div>

        {/* Headline with text reveal animation */}
        <h1
          className="font-display font-extrabold mb-6"
          style={{
            fontSize: 'clamp(48px, 10vw, 84px)',
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
          }}
        >
          <motion.span
            className="block text-gray-900"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Crypto donations
          </motion.span>
          <motion.span
            className="block text-cyber-mint-500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {"made instant.".split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 30, rotateX: 90 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.5 + i * 0.04
                }}
                style={{ transformOrigin: 'bottom' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Subheadline */}
        <p
          className="hero-subheadline font-body opacity-0 text-gray-500 mx-auto mb-12"
          style={{
            fontSize: 'clamp(17px, 2vw, 20px)',
            lineHeight: 1.6,
            maxWidth: '480px',
          }}
        >
          Connect your wallet. Add to OBS. Start receiving donations globally in seconds.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/login" className="hero-cta opacity-0 w-full sm:w-auto">
            <motion.button
              className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 text-base font-bold text-white rounded-xl bg-cyber-mint-500 cursor-pointer"
              whileHover={{ scale: 1.02, backgroundColor: '#009485' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Wallet size={20} weight="duotone" />
              <span>Start Earning Now</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </Link>

          <Link href="#how-it-works" className="hero-cta opacity-0 w-full sm:w-auto">
            <motion.button
              className="group flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-4 text-base font-semibold text-gray-900 bg-white rounded-xl border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.02, borderColor: 'rgba(0, 168, 150, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-cyber-mint-500">
                <Play size={12} weight="fill" className="text-white ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </motion.button>
          </Link>
        </div>

        {/* Crypto Icons */}
        <div className="flex flex-wrap justify-center gap-3">
          {cryptoIcons.map((crypto) => (
            <motion.div
              key={crypto.name}
              className="hero-crypto-card flex items-center gap-3 px-4 py-2.5 opacity-0 bg-white rounded-xl border border-gray-100"
              whileHover={{ scale: 1.05, borderColor: 'rgba(0, 168, 150, 0.3)' }}
              transition={{ duration: 0.2 }}
              title={crypto.alt}
            >
              <Image
                src={crypto.src}
                alt={crypto.alt}
                width={24}
                height={24}
              />
              <span className="font-semibold text-sm text-gray-900">
                {crypto.name}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
