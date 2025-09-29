import { Circle, TrendUp, Gift } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/mock-data'

interface LiveStatusData {
  isLive: boolean
  todayTotal: number
  lastHour: number
  totalDonations: number
  goal: number
  goalProgress: number
}

interface LiveStatusCardProps {
  data: LiveStatusData
}

export function LiveStatusCard({ data }: LiveStatusCardProps) {
  const { isLive, todayTotal, lastHour, totalDonations, goal, goalProgress } = data

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Circle
            size={12}
            weight="fill"
            className={isLive ? 'text-error-rose animate-pulse' : 'text-electric-slate-400'}
          />
          <span className={isLive ? 'status-live' : 'text-electric-slate-600'}>
            {isLive ? 'LIVE AGORA' : 'OFFLINE'}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main metrics row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Today's total */}
          <div className="text-center">
            <div className="metric-primary money-display text-cyber-mint-600">
              {formatCurrency(todayTotal)}
            </div>
            <div className="metric-label mt-1">Hoje</div>
          </div>

          {/* Last hour */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-semibold text-success-emerald">
              <TrendUp size={20} weight="duotone" />
              <span className="money-display">+{formatCurrency(lastHour)}</span>
            </div>
            <div className="metric-label mt-1">Última hora</div>
          </div>

          {/* Total donations */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-semibold text-electric-slate-700">
              <Gift size={20} weight="duotone" />
              <span>{totalDonations}</span>
            </div>
            <div className="metric-label mt-1">Doações</div>
          </div>
        </div>

        {/* Goal progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="metric-label">Next Goal: {formatCurrency(goal)}</span>
            <span className="text-sm font-medium text-electric-slate-700">
              {goalProgress}%
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          <div className="text-sm text-electric-slate-600">
            {formatCurrency(goal - todayTotal)} restantes para a meta
          </div>
        </div>
      </CardContent>
    </Card>
  )
}