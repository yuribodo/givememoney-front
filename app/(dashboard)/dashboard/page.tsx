'use client'

import { FloatingNavbar } from '@/components/layout/FloatingNavbar'
import { MetricsCards, WeeklyStatsCard, TopDonorsCard, RecentDonationsFeed } from '@/features/dashboard'
import { mockDashboardData } from '@/lib/mock-data'

export default function DashboardPage() {
  // Map existing mock data to new MetricsData interface
  const metricsData = {
    balance: mockDashboardData.liveStatus.todayTotal,
    messagesReceived: mockDashboardData.liveStatus.totalDonations,
    valueReceived: mockDashboardData.liveStatus.lastHour
  }

  return (
    <div className="min-h-screen bg-pearl with-floating-navbar">
      <FloatingNavbar isLive={mockDashboardData.liveStatus.isLive} />

      <main className="dashboard-grid">
        {/* Primary Metrics Section (40% visual space) */}
        <div className="card-large">
          <MetricsCards data={metricsData} />
        </div>

        {/* Secondary Metrics Section (30% visual space) */}
        <div className="card-small">
          <WeeklyStatsCard data={mockDashboardData.weeklyStats} />
        </div>

        <div className="card-medium">
          <TopDonorsCard donors={mockDashboardData.topDonors} />
        </div>

        {/* Contextual Data Section (30% visual space) */}
        <div className="card-large">
          <RecentDonationsFeed donations={mockDashboardData.recentDonations} />
        </div>
      </main>
    </div>
  )
}