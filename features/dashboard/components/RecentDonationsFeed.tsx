'use client'

import { useEffect, useState, useRef } from 'react'
import { DollarSign, Circle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, getTimeAgo } from '@/lib/mock-data'
import { DashboardCard } from './DashboardCard'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Image from 'next/image'

interface RecentDonation {
  id: number
  username: string
  amount: number
  currency: string
  message?: string
  timestamp: Date
  status: 'confirmed' | 'pending'
}

interface RecentDonationsFeedProps {
  donations: RecentDonation[]
  isLive?: boolean
}

export function RecentDonationsFeed({ donations, isLive = false }: RecentDonationsFeedProps) {
  const [displayDonations, setDisplayDonations] = useState(donations)
  const [newDonationId, setNewDonationId] = useState<number | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update timestamps for time ago display
      setDisplayDonations(prev => [...prev])
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Highlight new donations
  useEffect(() => {
    if (newDonationId) {
      const timer = setTimeout(() => setNewDonationId(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [newDonationId])

  const getCurrencyIcon = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC':
        return '/icons/bitcoin.png'
      case 'ETH':
        return '/icons/ethereum.png'
      case 'SOL':
        return '/icons/solana.png'
      case 'BNB':
        return '/icons/binance.png'
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success-emerald'
      case 'pending':
        return 'text-warning-amber'
      default:
        return 'text-electric-slate-400'
    }
  }

  const donationVariants = {
    hidden: { opacity: 0, y: 20, x: -15, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      x: -30,
      scale: 0.9,
      transition: {
        duration: 0.3,
      },
    },
  }

  const newDonationVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: {
      scale: [0.9, 1.05, 1],
      opacity: 1,
      transition: {
        duration: 0.5,
        times: [0, 0.6, 1],
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <div ref={containerRef}>
      <DashboardCard title="Recent Donations" icon={DollarSign} contentClassName="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
        {/* Donations list */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayDonations.slice(0, 10).map((donation, index) => (
              <motion.div
                key={donation.id}
                variants={newDonationId === donation.id ? newDonationVariants : donationVariants}
                initial="hidden"
                animate={isInView && (newDonationId === donation.id ? 'animate' : 'show')}
                exit="exit"
                transition={{
                  delay: 0.1 * index,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                layout
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  newDonationId === donation.id
                    ? 'bg-cyber-mint-25 border-cyber-mint-200'
                    : 'bg-white border-electric-slate-200 hover:border-electric-slate-300'
                }`}
              >
                {/* Status indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                >
                  <Circle
                    size={8}
                    fill="currentColor"
                    className={`mt-2 ${getStatusColor(donation.status)}`}
                  />
                </motion.div>

                {/* Donation content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-electric-slate-900">
                        {donation.username}
                      </span>
                      <span className="text-sm text-electric-slate-600">donated</span>
                    </div>
                    <div className="text-xs text-electric-slate-500">
                      {getTimeAgo(donation.timestamp)}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 mt-1">
                    {getCurrencyIcon(donation.currency) && (
                      <Image
                        src={getCurrencyIcon(donation.currency)!}
                        alt={donation.currency}
                        width={20}
                        height={20}
                        className="flex-shrink-0"
                      />
                    )}
                    <span className="text-lg font-semibold text-cyber-mint-600 money-display">
                      {formatCurrency(donation.amount)}
                    </span>
                    <span className="text-sm text-electric-slate-500 uppercase">
                      {donation.currency}
                    </span>
                  </div>

                  {/* Message */}
                  {donation.message && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={isInView ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="mt-2 p-2 bg-electric-slate-50 rounded text-sm text-electric-slate-700 italic overflow-hidden"
                    >
                      &ldquo;{donation.message}&rdquo;
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {displayDonations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <DollarSign
              size={48}
              className="text-muted-foreground mx-auto mb-4"
            />
            <div className="text-muted-foreground mb-2">No donations yet</div>
            <div className="text-sm text-muted-foreground">
              Donations will appear here in real-time
            </div>
          </motion.div>
        )}

        {/* View all button */}
        {displayDonations.length > 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-4 border-t border-border"
          >
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-cyber-mint-600 hover:text-cyber-mint-700"
            >
              View all {displayDonations.length} donations
              <ArrowRight size={16} />
            </Button>
          </motion.div>
        )}

        {/* Auto-refresh indicator */}
        {displayDonations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className=" flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <Circle
              size={6}
              fill="currentColor"
              className={isLive ? 'text-success-emerald animate-pulse' : 'text-electric-slate-400'}
            />
            {isLive ? 'Updating in real-time' : 'Reconnecting...'}
          </motion.div>
        )}
        </motion.div>
      </DashboardCard>
    </div>
  )
}