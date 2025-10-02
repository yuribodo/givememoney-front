'use client'

import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { MetricsCards, WeeklyStatsCard, TopDonorsCard, RecentDonationsFeed } from '@/features/dashboard'
import { mockDashboardData } from '@/lib/mock-data'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  // Map existing mock data to new MetricsData interface
  const metricsData = {
    balance: mockDashboardData.liveStatus.todayTotal,
    messagesReceived: mockDashboardData.liveStatus.totalDonations,
    valueReceived: mockDashboardData.liveStatus.lastHour
  }

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

  return (
    <div className="min-h-screen bg-pearl with-floating-navbar">
      <FloatingNavbar isLive={mockDashboardData.liveStatus.isLive} />

      <motion.main
        className="dashboard-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Primary Metrics Section (40% visual space) */}
        <motion.div className="card-large" variants={itemVariants}>
          <MetricsCards data={metricsData} />
        </motion.div>

        {/* Secondary Metrics Section (30% visual space) */}
        <motion.div className="card-small h-full" variants={itemVariants}>
          <WeeklyStatsCard data={mockDashboardData.weeklyStats} />
        </motion.div>

        <motion.div className="card-medium h-full" variants={itemVariants}>
          <TopDonorsCard donors={mockDashboardData.topDonors} />
        </motion.div>

        {/* Contextual Data Section (30% visual space) */}
        <motion.div className="card-large" variants={itemVariants}>
          <RecentDonationsFeed donations={mockDashboardData.recentDonations} />
        </motion.div>
      </motion.main>
    </div>
  )
}