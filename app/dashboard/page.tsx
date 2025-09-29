'use client'

import { FloatingNavbar } from '../components/FloatingNavbar'
import { LiveStatusCard } from '../components/LiveStatusCard'
import { WeeklyStatsCard } from '../components/WeeklyStatsCard'
import { TopDonorsCard } from '../components/TopDonorsCard'
import { RecentDonationsFeed } from '../components/RecentDonationsFeed'
import { mockDashboardData } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-pearl with-floating-navbar">
      <FloatingNavbar isLive={mockDashboardData.liveStatus.isLive} />

      <main className="dashboard-grid">
        {/* Primary Metrics Section (40% visual space) */}
        <div className="card-large">
          <LiveStatusCard data={mockDashboardData.liveStatus} />
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