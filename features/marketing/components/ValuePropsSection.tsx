'use client'

import { motion } from "motion/react"
import { AnimatedCounter } from "./ui/AnimatedCounter"
import { Wallet, MonitorPlay, CurrencyCircleDollar, ArrowRight, TwitchLogo } from "@phosphor-icons/react"
import Image from "next/image"

const metrics = [
  {
    value: 2400,
    prefix: '',
    suffix: '+',
    label: 'ACTIVE STREAMERS'
  },
  {
    value: 180,
    prefix: '$',
    suffix: 'K',
    label: 'PROCESSED MONTHLY'
  },
  {
    value: 0,
    prefix: '',
    suffix: '%',
    label: 'PLATFORM FEES'
  }
]

const steps = [
  {
    icon: Wallet,
    label: 'Connect Wallet',
    description: 'MetaMask or Phantom'
  },
  {
    icon: MonitorPlay,
    label: 'Add to OBS',
    description: 'Copy & paste overlay'
  },
  {
    icon: CurrencyCircleDollar,
    label: 'Receive Crypto',
    description: 'BTC, ETH, SOL & more'
  }
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

export function ValuePropsSection() {
  return (
    <section
      className="relative"
      style={{
        backgroundColor: 'var(--bg-primary)',
        paddingTop: 'clamp(64px, 8vw, 96px)',
        paddingBottom: 'clamp(64px, 8vw, 96px)'
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6">

        {/* How It Works - Visual Flow */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            custom={0}
            className="font-display font-bold text-center"
            style={{
              fontSize: 'clamp(28px, 3vw + 8px, 40px)',
              color: 'var(--text-primary)',
              marginBottom: '48px'
            }}
          >
            How It Works
          </motion.h2>

          {/* Steps Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                variants={fadeInUp}
                custom={0.1 + index * 0.15}
                className="relative flex flex-col items-center"
              >
                {/* Step Card */}
                <div
                  className="w-full p-6 rounded-2xl text-center"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Icon */}
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                    style={{ backgroundColor: 'var(--accent-subtle)' }}
                  >
                    <step.icon
                      size={28}
                      weight="duotone"
                      style={{ color: 'var(--accent-primary)' }}
                    />
                  </div>

                  {/* Label */}
                  <h3
                    className="font-semibold"
                    style={{
                      fontSize: '18px',
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}
                  >
                    {step.label}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight
                      size={24}
                      weight="bold"
                      style={{ color: 'var(--border-default)' }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20"
          style={{
            height: '1px',
            backgroundColor: 'var(--border-subtle)',
            transformOrigin: 'center'
          }}
        />

        {/* Metrics Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 text-center mb-20"
          style={{ gap: 'clamp(48px, 6vw, 80px)' }}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              custom={index * 0.15}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeInUp}
            >
              {/* Number */}
              <div
                className="font-mono font-bold"
                style={{
                  fontSize: 'clamp(48px, 6vw + 16px, 72px)',
                  lineHeight: 1.1,
                  color: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {metric.value === 0 ? (
                  <span>{metric.prefix}0{metric.suffix}</span>
                ) : (
                  <AnimatedCounter
                    target={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                    duration={1.5}
                  />
                )}
              </div>

              {/* Label */}
              <div
                className="font-semibold uppercase"
                style={{
                  fontSize: 'clamp(12px, 1vw + 8px, 14px)',
                  lineHeight: 1.4,
                  letterSpacing: '0.08em',
                  color: 'var(--text-tertiary)',
                  marginTop: '12px'
                }}
              >
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Supported Platforms */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <motion.p
            variants={fadeInUp}
            custom={0}
            className="text-center font-medium mb-6"
            style={{
              fontSize: '14px',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.02em'
            }}
          >
            Works with your favorite platforms
          </motion.p>

          <motion.div
            variants={fadeInUp}
            custom={0.1}
            className="flex flex-wrap justify-center items-center gap-8"
          >
            {/* Twitch */}
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <TwitchLogo size={24} weight="fill" style={{ color: '#9146FF' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                Twitch
              </span>
            </div>

            {/* Kick */}
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div className="w-6 h-6 rounded bg-[#53FC18] flex items-center justify-center">
                <span className="font-bold text-black text-xs">K</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                Kick
              </span>
            </div>

            {/* OBS */}
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div className="w-6 h-6 rounded-full bg-[#302E31] flex items-center justify-center">
                <span className="font-bold text-white text-xs">O</span>
              </div>
              <span className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
                OBS
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-16"
          style={{
            height: '1px',
            backgroundColor: 'var(--border-subtle)'
          }}
        />

        {/* Testimonial */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
          custom={0.2}
          className="text-center"
        >
          {/* Quote */}
          <blockquote
            className="font-body"
            style={{
              fontSize: 'clamp(18px, 1.5vw + 8px, 24px)',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '580px',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontStyle: 'normal'
            }}
          >
            &ldquo;The only platform where I keep 100% of my crypto donations. Setup took 2 minutes.&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {/* Avatar placeholder */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-subtle)' }}
            >
              <span className="font-semibold text-sm" style={{ color: 'var(--accent-primary)' }}>
                SC
              </span>
            </div>
            <div className="text-left">
              <p
                className="font-semibold"
                style={{
                  fontSize: '14px',
                  color: 'var(--text-primary)'
                }}
              >
                Sarah Chen
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-tertiary)'
                }}
              >
                Twitch Partner
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
