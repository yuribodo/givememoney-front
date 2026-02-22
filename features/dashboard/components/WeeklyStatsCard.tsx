'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { DashboardCard } from './DashboardCard'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'

interface DailyData {
  day: string
  value: number
  messages: number
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
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setPathLength(1), 100)
    return () => clearTimeout(timer)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 min-w-[160px]">
          <p className="text-xs font-semibold text-muted-foreground mb-2">{data.day}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Value:</span>
              <span className="text-sm font-semibold text-foreground money-display">
                {formatCurrency(data.value)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Messages:</span>
              <span className="text-sm font-semibold text-foreground">
                {data.messages}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const AnimatedLine = (props: any) => {
    const { points } = props
    if (!points || points.length === 0) return null

    const pathString = points.reduce((acc: string, point: any, i: number) => {
      if (i === 0) return `M ${point.x},${point.y}`
      return `${acc} L ${point.x},${point.y}`
    }, '')

    return (
      <motion.path
        d={pathString}
        fill="none"
        stroke="#00a896"
        strokeWidth={3}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeInOut' },
          opacity: { duration: 0.3 },
        }}
      />
    )
  }

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 1 + i * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    }),
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
            <AnimatedCounter
              value={total}
              className="text-3xl font-bold money-display text-foreground"
              formatter={(v) => formatCurrency(v)}
            />
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
                  width={50}
                  tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
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

function CustomDot(props: any) {
  const { cx, cy, index } = props

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