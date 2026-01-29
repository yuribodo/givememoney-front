'use client'

import { motion } from "motion/react"
import { Check, ArrowRight, Lightning, ShieldCheck, CurrencyCircleDollar } from "@phosphor-icons/react"
import Link from "next/link"
import Image from "next/image"

const trustSignals = [
  { text: 'No credit card required', icon: ShieldCheck },
  { text: 'Live in 60 seconds', icon: Lightning },
  { text: '0% platform fees', icon: CurrencyCircleDollar }
]

const cryptoLogos = [
  { src: '/icons/bitcoin.png', alt: 'Bitcoin' },
  { src: '/icons/ethereum.png', alt: 'Ethereum' },
  { src: '/icons/solana.png', alt: 'Solana' },
  { src: '/icons/binance.png', alt: 'Binance' }
]

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: easeOutExpo
    }
  })
}

export function FinalCTASection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#FAFBFA',
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(80px, 10vw, 120px)'
      }}
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating coins animation */}
        <motion.div
          className="absolute -left-8 top-1/4"
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/icons/bitcoin.png"
            alt=""
            width={80}
            height={80}
            className="opacity-10"
          />
        </motion.div>
        <motion.div
          className="absolute -right-4 top-1/3"
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Image
            src="/icons/ethereum.png"
            alt=""
            width={60}
            height={60}
            className="opacity-10"
          />
        </motion.div>
        <motion.div
          className="absolute left-1/4 -bottom-4"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Image
            src="/icons/solana.png"
            alt=""
            width={50}
            height={50}
            className="opacity-10"
          />
        </motion.div>
      </div>

      <div className="relative max-w-[800px] mx-auto px-6 text-center">

        {/* Crypto logos row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          custom={0}
          className="flex justify-center items-center gap-4 mb-8"
        >
          {cryptoLogos.map((logo, index) => (
            <motion.div
              key={logo.alt}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={24}
                height={24}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          custom={0.1}
          className="font-display font-extrabold"
          style={{
            fontSize: 'clamp(36px, 4vw + 16px, 64px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#1A1D1A'
          }}
        >
          Ready to start?
        </motion.h2>

        {/* Social Proof */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          custom={0.2}
          className="font-body"
          style={{
            fontSize: 'clamp(16px, 1.5vw + 8px, 20px)',
            lineHeight: 1.6,
            color: '#5C665C',
            marginTop: '16px'
          }}
        >
          Join 2,400+ streamers already earning with crypto donations
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          custom={0.3}
          style={{ marginTop: '40px' }}
        >
          <Link href="/login">
            <motion.button
              className="group inline-flex items-center gap-3 font-semibold text-white rounded-full cursor-pointer"
              style={{
                padding: '20px 40px',
                fontSize: '18px',
                backgroundColor: '#00A896'
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: '#009485',
                transition: { duration: 0.2 }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
            >
              Create Free Account
              <ArrowRight
                size={20}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8"
          style={{ marginTop: '48px' }}
        >
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.text}
              variants={fadeInUp}
              custom={0.4 + index * 0.1}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: '#fff',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}
            >
              <signal.icon
                size={18}
                weight="duotone"
                style={{ color: '#00A896' }}
              />
              <span
                className="font-medium"
                style={{
                  fontSize: '14px',
                  color: '#5C665C'
                }}
              >
                {signal.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
