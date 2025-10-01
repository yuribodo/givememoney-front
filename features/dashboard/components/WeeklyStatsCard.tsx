'use client'

import { BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/mock-data'
import { DashboardCard } from './DashboardCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DailyData {
  day: string
  value: number
}

interface WeeklyStatsData {
  dailyData: DailyData[]
  total: number
}

interface WeeklyStatsCardProps {
  data: WeeklyStatsData
}

export function WeeklyStatsCard({ data }: WeeklyStatsCardProps) {
  const { dailyData, total } = data

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.day}</p>
          <p className="text-sm font-semibold text-foreground money-display">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <DashboardCard title="Esta Semana" icon={BarChart3} contentClassName="p-0">
      <div className="p-6 pb-4">
        <div className="text-center mb-6">
          <div className="text-sm text-muted-foreground mb-1">Total da Semana</div>
          <div className="text-3xl font-bold money-display text-foreground">
            {formatCurrency(total)}
          </div>
        </div>

        <div className="h-[200px] w-full">
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
                width={50}
                tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e6ed' }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#00a896"
                strokeWidth={3}
                dot={{ fill: '#00a896', r: 3 }}
                activeDot={{ r: 5, fill: '#00a896' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  )
}