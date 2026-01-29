'use client'

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import { TwitchLogo, Wallet, Link as LinkIcon, CurrencyBtc, Check, Lightning } from "@phosphor-icons/react"
import Image from "next/image"

const AUTO_ROTATE_INTERVAL = 5000 // 5 seconds per step

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Link MetaMask or Phantom with one click. No signup, no email, no passwords.',
    icon: Wallet,
  },
  {
    number: '02',
    title: 'Add Overlay',
    description: 'Copy your unique URL and paste into OBS. Donations appear on stream instantly.',
    icon: LinkIcon,
  },
  {
    number: '03',
    title: 'Receive Crypto',
    description: 'Funds go directly to your wallet. Zero platform fees, instant settlement.',
    icon: CurrencyBtc,
  }
]

// Timeline-style step indicator
function StepTimeline({
  activeStep,
  onStepClick,
  progress
}: {
  activeStep: number
  onStepClick: (index: number) => void
  progress: number
}) {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = activeStep === index
        const isPast = index < activeStep

        return (
          <div key={step.number} className="relative">
            {/* Connecting line - positioned behind everything */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-[calc(100%-0px)] -translate-x-1/2">
                {/* Background line */}
                <div className="absolute inset-0 bg-gray-200" />
                {/* Progress fill */}
                <motion.div
                  className="absolute top-0 left-0 w-full bg-cyber-mint-500 origin-top"
                  animate={{
                    scaleY: isPast ? 1 : isActive ? progress / 100 : 0
                  }}
                  transition={{ duration: 0.1, ease: "linear" }}
                  style={{ height: '100%' }}
                />
              </div>
            )}

            <motion.div
              className="relative cursor-pointer"
              onClick={() => onStepClick(index)}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex gap-5">
                {/* Circle indicator */}
                <motion.div
                  className="relative w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0"
                  animate={{
                    backgroundColor: isActive || isPast ? '#00A896' : '#F5F7F5',
                    borderColor: isActive || isPast ? '#00A896' : '#E5E7EB',
                    borderWidth: isActive || isPast ? 0 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ borderStyle: 'solid' }}
                >
                  {isPast ? (
                    <Check size={18} weight="bold" className="text-white" />
                  ) : (
                    <Icon
                      size={18}
                      weight={isActive ? "fill" : "regular"}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <motion.div
                    className="py-3 px-4 -ml-1 rounded-xl"
                    animate={{
                      backgroundColor: isActive ? 'white' : 'transparent',
                      borderColor: isActive ? '#E5E7EB' : 'transparent'
                    }}
                    whileHover={{
                      backgroundColor: 'white',
                      borderColor: '#E5E7EB'
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ border: '1px solid transparent' }}
                  >
                    {/* Step number */}
                    <span
                      className="text-[11px] font-mono font-medium tracking-wide uppercase mb-1 block"
                      style={{ color: isActive || isPast ? '#00A896' : '#9CA3AF' }}
                    >
                      Step {step.number}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-lg font-semibold mb-1.5"
                      style={{
                        color: isActive ? '#1A1D1A' : isPast ? '#5C665C' : '#8A938A',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {step.title}
                    </h3>

                    {/* Description - always visible but faded when not active */}
                    <p
                      className="text-sm leading-relaxed transition-opacity duration-200"
                      style={{
                        color: '#6B7280',
                        opacity: isActive ? 1 : 0.6
                      }}
                    >
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

// Step 1: Wallet Connection Panel (same style as TransactionLedger)
function WalletConnectionMockup() {
  const [selectedWallet, setSelectedWallet] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setSelectedWallet(null)
    setIsConnected(false)

    const timer1 = setTimeout(() => setSelectedWallet(0), 800)
    const timer2 = setTimeout(() => setIsConnected(true), 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const wallets = [
    { name: 'MetaMask', icon: '/icons/ethereum.png', status: 'Installed', address: '0x7A3d...42B9' },
    { name: 'Phantom', icon: '/icons/solana.png', status: 'Installed', address: '7Xp9...4mKz' },
    { name: 'WalletConnect', icon: '/icons/binance.png', status: 'Available', address: null },
  ]

  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Connect Wallet</span>
          <span className="text-xs text-gray-400">Step 1 of 1</span>
        </div>

        {/* Wallet rows */}
        <div className="p-3 space-y-2">
          {wallets.map((wallet, i) => {
            const isSelected = selectedWallet === i
            const showConnected = isSelected && isConnected

            return (
              <motion.div
                key={wallet.name}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: i % 2 === 0 ? '#FAFBFA' : 'white',
                  border: isSelected ? '1px solid rgba(0, 168, 150, 0.3)' : '1px solid transparent'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.15, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      <Image src={wallet.icon} alt="" width={24} height={24} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{wallet.name}</div>
                      {showConnected ? (
                        <motion.div
                          className="font-mono text-[10px] text-gray-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {wallet.address}
                        </motion.div>
                      ) : (
                        <div className="text-[10px] text-gray-400">{wallet.status}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    {showConnected ? (
                      <motion.div
                        className="flex items-center gap-1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-medium text-green-600">Connected</span>
                      </motion.div>
                    ) : isSelected ? (
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-cyber-mint-500 border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <div className="text-[10px] text-gray-400 px-2 py-1 rounded bg-gray-100">
                        Connect
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">Secure connection via Web3</span>
            <motion.div
              className="text-xs font-medium"
              style={{ color: isConnected ? '#00A896' : '#9CA3AF' }}
              animate={{ opacity: isConnected ? 1 : 0.5 }}
            >
              {isConnected ? '✓ Ready to receive' : 'Select a wallet'}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Step 2: Overlay Setup Panel (same style as TransactionLedger)
function OBSIntegrationMockup() {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [activeSource, setActiveSource] = useState(false)

  useEffect(() => {
    setCopiedUrl(false)
    setActiveSource(false)

    const timer1 = setTimeout(() => setCopiedUrl(true), 1000)
    const timer2 = setTimeout(() => setActiveSource(true), 2000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const setupSteps = [
    { label: 'Overlay URL', value: 'givememoney.app/overlay/x7k2m', status: 'ready' },
    { label: 'Resolution', value: '1920 × 1080', status: 'ready' },
    { label: 'Position', value: 'Bottom Left', status: 'ready' },
  ]

  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Overlay Settings</span>
          <span className="text-xs text-gray-400">OBS / Streamlabs</span>
        </div>

        {/* URL Copy Section */}
        <div className="p-3">
          <motion.div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: '#FAFBFA',
              border: copiedUrl ? '1px solid rgba(0, 168, 150, 0.3)' : '1px solid transparent'
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Browser Source URL</span>
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: copiedUrl ? 1 : 0 }}
              >
                <Check size={10} weight="bold" style={{ color: '#22C55E' }} />
                <span className="text-[10px] text-green-600">Copied</span>
              </motion.div>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs text-gray-700 bg-white px-2 py-1.5 rounded border border-gray-200 truncate">
                https://givememoney.app/overlay/x7k2m
              </code>
              <motion.button
                className="px-2 py-1.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: copiedUrl ? 'rgba(0, 168, 150, 0.1)' : '#F3F4F6',
                  color: copiedUrl ? '#00A896' : '#6B7280'
                }}
                animate={{ scale: copiedUrl ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.2 }}
              >
                {copiedUrl ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Settings rows */}
        <div className="px-3 pb-3 space-y-2">
          {setupSteps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ backgroundColor: i % 2 === 0 ? 'white' : '#FAFBFA' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
            >
              <span className="text-xs text-gray-500">{step.label}</span>
              <span className="text-xs font-medium text-gray-800">{step.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Footer - Live Preview indicator */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeSource ? '#22C55E' : '#9CA3AF' }}
                animate={{ scale: activeSource ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5, repeat: activeSource ? Infinity : 0, repeatDelay: 1 }}
              />
              <span className="text-[10px] text-gray-400">
                {activeSource ? 'Overlay active on stream' : 'Waiting for connection...'}
              </span>
            </div>
            <motion.div
              className="text-xs font-medium"
              style={{ color: '#00A896' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeSource ? 1 : 0 }}
            >
              ✓ Live
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Step 3: Transaction Ledger Mockup
function TransactionLedgerMockup() {
  const [visibleRows, setVisibleRows] = useState(0)

  useEffect(() => {
    setVisibleRows(0)
    const timers = [
      setTimeout(() => setVisibleRows(1), 400),
      setTimeout(() => setVisibleRows(2), 700),
      setTimeout(() => setVisibleRows(3), 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const transactions = [
    { time: 'Just now', name: 'CryptoWhale92', amount: '+0.15 ETH', usd: '≈ $285.00', address: '0x8F2a...91C4', icon: '/icons/ethereum.png', isNew: true },
    { time: '2m ago', name: 'Anonymous', amount: '+50 USDC', usd: '≈ $50.00', address: '0x3D7b...E2F8', icon: '/icons/binance.png', isNew: false },
    { time: '5m ago', name: 'SolanaMaxi', amount: '+2.5 SOL', usd: '≈ $375.00', address: '7Xp9...4mKz', icon: '/icons/solana.png', isNew: false },
  ]

  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Recent Donations</span>
          <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">View All →</span>
        </div>

        {/* Transaction rows */}
        <div className="p-3 space-y-2">
          {transactions.map((tx, i) => (
            <motion.div
              key={i}
              className="p-3 rounded-lg"
              style={{
                backgroundColor: i % 2 === 0 ? '#FAFBFA' : 'white',
                opacity: visibleRows > i ? 1 : 0,
                border: tx.isNew ? '1px solid rgba(0, 168, 150, 0.15)' : '1px solid transparent'
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: visibleRows > i ? 1 : 0,
                y: visibleRows > i ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {tx.isNew && <Lightning size={10} weight="fill" style={{ color: '#00A896' }} />}
                  <span className="text-[10px] text-gray-400">{tx.time}</span>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: visibleRows > i ? 1 : 0 }}
                  transition={{ delay: 0.2, duration: 0.2 }}
                >
                  <Check size={12} weight="bold" style={{ color: '#22C55E' }} />
                </motion.div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
                    <Image src={tx.icon} alt="" width={24} height={24} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-800">{tx.name}</div>
                    <div className="font-mono text-[10px] text-gray-400">{tx.address}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-semibold text-gray-900">{tx.amount}</div>
                  <div className="text-[10px] text-gray-400">{tx.usd}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer totals */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="text-[10px] text-gray-400 mb-2">Total Earned</div>
          <div className="flex gap-2 mb-3">
            {[
              { amount: '0.15 ETH', icon: '/icons/ethereum.png' },
              { amount: '50 USDC', icon: '/icons/binance.png' },
              { amount: '2.5 SOL', icon: '/icons/solana.png' },
            ].map((total, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <div className="w-3 h-3 rounded-full overflow-hidden">
                  <Image src={total.icon} alt="" width={12} height={12} />
                </div>
                <span className="font-mono text-[10px] text-gray-700">{total.amount}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="text-xs font-medium"
            style={{ color: '#00A896' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Platform Fee: $0.00
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main Visual Preview Component
function VisualPreview({ activeStep }: { activeStep: number }) {
  return (
    <motion.div
      className="relative aspect-square max-w-md w-full rounded-2xl overflow-hidden flex items-center justify-center p-6"
      style={{
        backgroundColor: 'rgba(0, 168, 150, 0.03)',
        border: '1px solid rgba(0, 168, 150, 0.1)'
      }}
    >
      {/* Subtle grid background */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="preview-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 168, 150, 0.15)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#preview-grid)" />
      </svg>

      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <motion.div
            key="wallet"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WalletConnectionMockup />
          </motion.div>
        )}

        {activeStep === 1 && (
          <motion.div
            key="obs"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OBSIntegrationMockup />
          </motion.div>
        )}

        {activeStep === 2 && (
          <motion.div
            key="ledger"
            className="relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TransactionLedgerMockup />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ValuePropsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [40, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  // Auto-rotation logic
  useEffect(() => {
    if (isPaused) return

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (AUTO_ROTATE_INTERVAL / 50)) // Update every 50ms
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [isPaused, activeStep])

  // Advance to next step when progress completes
  useEffect(() => {
    if (progress >= 100 && !isPaused) {
      setActiveStep(prev => (prev + 1) % steps.length)
      setProgress(0)
    }
  }, [progress, isPaused])

  // Handle manual step click
  const handleStepClick = useCallback((index: number) => {
    setActiveStep(index)
    setProgress(0)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative"
      style={{
        backgroundColor: '#FAFBFA',
        paddingTop: 'clamp(60px, 8vw, 100px)',
        paddingBottom: 'clamp(60px, 8vw, 100px)'
      }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-cyber-mint-500 text-sm font-mono tracking-wider uppercase mb-3 block">
            How It Works
          </span>
          <h2
            className="font-display font-bold text-gray-900 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em'
            }}
          >
            Three steps to start earning
          </h2>
        </motion.div>

        {/* Content grid */}
        <div
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >

          {/* Steps Timeline */}
          <div>
            <StepTimeline
              activeStep={activeStep}
              onStepClick={handleStepClick}
              progress={progress}
            />
          </div>

          {/* Visual preview */}
          <div className="hidden lg:flex justify-center sticky top-24">
            <VisualPreview activeStep={activeStep} />
          </div>
        </div>

        {/* Platforms footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 md:mt-16 pt-8 border-t border-gray-200"
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
