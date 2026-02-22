'use client'

import { BarChart3 } from 'lucide-react'
import { DashboardCard } from './DashboardCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { CurrencyTotals } from '@/features/transactions'

interface DailyData {
  day: string
  value: number    // message count (currency-agnostic)
  messages: number
}

interface WeeklyStatsData {
  totals: CurrencyTotals
  dailyData: DailyData[]
}

interface WeeklyStatsCardProps {
  data: WeeklyStatsData
}

function WeeklyTotalsDisplay({ totals }: { totals: CurrencyTotals }) {
  const entries = Object.entries(totals).filter(([, v]) => (v ?? 0) > 0)
  if (entries.length === 0) {
    return <span className="text-3xl font-bold text-foreground">—</span>
  }
  return (
    <div className="space-y-0.5">
      {entries.map(([currency, amount]) => (
        <div key={currency} className="flex items-baseline justify-center gap-1.5">
          <span className="text-3xl font-bold text-foreground">
            {(amount ?? 0).toFixed(4)}
          </span>
          <span className="text-base font-semibold text-muted-foreground">{currency}</span>
        </div>
      ))}
    </div>
  )
}

export function WeeklyStatsCard({ data }: WeeklyStatsCardProps) {
  const { dailyData, totals } = data

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: DailyData }> }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
          <p className="text-xs font-semibold text-muted-foreground mb-2">{d.day}</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Donations:</span>
            <span className="text-sm font-semibold text-foreground">{d.messages}</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      <DashboardCard title="This Week" icon={BarChart3} contentClassName="p-0 flex flex-col flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 flex flex-col flex-1"
        >
          <div className="text-center mb-6">
            <div className="text-sm text-muted-foreground mb-1">Weekly Total</div>
            <WeeklyTotalsDisplay totals={totals} />
          </div>

          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ed" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#6b7899"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7899"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  allowDecimals={false}
                  tickFormatter={(v) => String(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e6ed' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#00a896"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  activeDot={{ r: 5, fill: '#00a896' }}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </DashboardCard>
    </div>
  )
}

function CustomDot(props: { cx?: number; cy?: number; index?: number }) {
  const { cx, cy, index = 0 } = props

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={3}
      fill="#00a896"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 1 + index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 10,
      }}
    />
  )
}
