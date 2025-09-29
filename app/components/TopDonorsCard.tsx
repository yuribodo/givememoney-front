import { Users, Crown, Medal, Trophy } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/mock-data'

interface TopDonor {
  username: string
  amount: number
  rank: number
}

interface TopDonorsCardProps {
  donors: TopDonor[]
}

export function TopDonorsCard({ donors }: TopDonorsCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={16} weight="duotone" className="text-electric-gold" />
      case 2:
        return <Medal size={16} weight="duotone" className="text-electric-slate-400" />
      case 3:
        return <Trophy size={16} weight="duotone" className="text-warm-coral" />
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-electric-slate-200 flex items-center justify-center">
            <span className="text-xs font-medium text-electric-slate-600">{rank}</span>
          </div>
        )
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-electric-gold/10 text-electric-gold border-electric-gold/20'
      case 2:
        return 'bg-electric-slate-100 text-electric-slate-600 border-electric-slate-200'
      case 3:
        return 'bg-warm-coral/10 text-warm-coral border-warm-coral/20'
      default:
        return 'bg-electric-slate-50 text-electric-slate-600 border-electric-slate-200'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users size={20} weight="duotone" className="text-cyber-mint-500" />
          TOP DOADORES
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {donors.slice(0, 5).map((donor) => (
          <div
            key={donor.rank}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors hover:bg-electric-slate-25 ${getRankBadgeColor(
              donor.rank
            )}`}
          >
            <div className="flex items-center gap-3">
              {getRankIcon(donor.rank)}
              <div>
                <div className="text-sm font-medium text-electric-slate-900">
                  {donor.username}
                </div>
                {donor.rank <= 3 && (
                  <div className="text-xs text-electric-slate-600">
                    #{donor.rank} Top Donor
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold money-display text-electric-slate-900">
                {formatCurrency(donor.amount)}
              </div>
            </div>
          </div>
        ))}

        {/* Show more button */}
        {donors.length > 5 && (
          <div className="pt-2 border-t border-electric-slate-200">
            <button className="w-full text-sm text-cyber-mint-600 hover:text-cyber-mint-700 font-medium">
              Ver todos os doadores →
            </button>
          </div>
        )}

        {/* Empty state */}
        {donors.length === 0 && (
          <div className="text-center py-8">
            <Users size={32} weight="duotone" className="text-electric-slate-300 mx-auto mb-2" />
            <div className="text-sm text-electric-slate-600">
              Nenhuma doação ainda
            </div>
            <div className="text-xs text-electric-slate-500 mt-1">
              Seus top doadores aparecerão aqui
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}