'use client'

import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/mock-data'
import { DashboardCard } from './DashboardCard'

interface WeeklyStatsData {
  total: number
  percentageChange: number
  totalDonations: number
  previousWeek: number
}

interface WeeklyStatsCardProps {
  data: WeeklyStatsData
}

export function WeeklyStatsCard({ data }: WeeklyStatsCardProps) {
  const { total, percentageChange, totalDonations, previousWeek } = data

  const isPositiveChange = percentageChange >= 0
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown

  return (
    <DashboardCard title="Esta Semana" icon={BarChart3} contentClassName="p-6 space-y-4">
        {/* Main total */}
        <div className="text-center">
          <div className="text-3xl font-bold money-display text-electric-slate-900">
            {formatCurrency(total)}
          </div>
        </div>

        {/* Percentage change */}
        <div className="flex items-center justify-center gap-2">
          <TrendIcon
            size={16}
            className={isPositiveChange ? 'text-success-emerald' : 'text-error-rose'}
          />
          <span
            className={`text-sm font-semibold ${
              isPositiveChange ? 'text-success-emerald' : 'text-error-rose'
            }`}
          >
            {formatPercentage(percentageChange)} vs anterior
          </span>
        </div>

        {/* Additional stats */}
        <div className="pt-3 border-t border-electric-slate-200 space-y-2">
          <div className="flex justify-between items-center">
            <span className="metric-label">Total doações</span>
            <span className="text-sm font-medium text-electric-slate-700">
              {totalDonations}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="metric-label">Semana anterior</span>
            <span className="text-sm font-medium text-electric-slate-700 money-display">
              {formatCurrency(previousWeek)}
            </span>
          </div>
        </div>

        {/* Visual indicator bar */}
        <div className="mt-4">
          <div className="h-2 bg-electric-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPositiveChange
                  ? 'bg-gradient-to-r from-success-emerald to-cyber-mint-500'
                  : 'bg-gradient-to-r from-error-rose to-warm-coral'
              }`}
              style={{
                width: `${Math.min(Math.abs(percentageChange) * 2, 100)}%`
              }}
            />
          </div>
        </div>
    </DashboardCard>
  )
}