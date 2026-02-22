'use client'

import Link from 'next/link'
import { MetricsCards, WeeklyStatsCard, TopDonorsCard, RecentDonationsFeed } from '@/features/dashboard'
import { useAuth } from '@/features/auth'
import { useDashboardMetrics } from '@/features/transactions'
import { useWebSocket } from '@/features/websocket'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const {
    todayTotals,
    lastHourTotals,
    totalDonations,
    weeklyTotals,
    dailyData,
    topDonors,
    recentDonations,
    isLoading: isMetricsLoading,
    error: metricsError
  } = useDashboardMetrics(user?.id)

  const { isConnected } = useWebSocket(user?.id)

  // Map metrics to component props
  const metricsData = {
    balanceTotals: todayTotals,
    messagesReceived: totalDonations,
    valueReceivedTotals: lastHourTotals,
  }

  const weeklyStatsData = {
    totals: weeklyTotals,
    dailyData: dailyData,
  }

  // Transform recent donations to match the component interface
  const formattedDonations = recentDonations.map((donation, index) => ({
    id: index + 1,
    username: donation.username,
    amount: donation.amount,
    currency: donation.currency,
    message: donation.message,
    timestamp: donation.timestamp,
    status: donation.status
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-cyber-mint-600" />
          <p className="text-electric-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (metricsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-error-rose font-medium">Failed to load dashboard data</p>
        <p className="text-electric-slate-600 text-sm">{metricsError.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-cyber-mint-600 text-white rounded-lg hover:bg-cyber-mint-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <>
      {!isAuthLoading && user && user.wallet === null && (
        <div className="mx-4 mt-4 border border-cyber-mint-200 bg-cyber-mint-50 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
          <span className="text-sm text-electric-slate-700">
            <span className="font-semibold">⚡ Complete seu perfil</span> — Conecte sua carteira para começar a receber doações.
          </span>
          <Link
            href="/layout/qrcode"
            className="text-sm font-medium text-cyber-mint-600 hover:text-cyber-mint-700 shrink-0 transition-colors"
          >
            Conectar agora →
          </Link>
        </div>
      )}
      <motion.main
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
      {/* Primary Metrics Section (40% visual space) */}
      <motion.div className="card-large" variants={itemVariants}>
        {isMetricsLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-cyber-mint-600" />
          </div>
        ) : (
          <MetricsCards data={metricsData} />
        )}
      </motion.div>

      {/* Secondary Metrics Section (30% visual space) */}
      <motion.div className="card-small h-full" variants={itemVariants}>
        {isMetricsLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-cyber-mint-600" />
          </div>
        ) : (
          <WeeklyStatsCard data={weeklyStatsData} />
        )}
      </motion.div>

      <motion.div className="card-medium h-full" variants={itemVariants}>
        {isMetricsLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-cyber-mint-600" />
          </div>
        ) : (
          <TopDonorsCard donors={topDonors} />
        )}
      </motion.div>

      {/* Contextual Data Section (30% visual space) */}
      <motion.div className="card-large" variants={itemVariants}>
        {isMetricsLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-cyber-mint-600" />
          </div>
        ) : (
          <RecentDonationsFeed
            donations={formattedDonations}
            isLive={isConnected}
          />
        )}
      </motion.div>
    </motion.main>
    </>
  )
}
