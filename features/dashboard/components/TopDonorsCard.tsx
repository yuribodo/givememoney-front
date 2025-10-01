'use client'

import { Users, Trophy, Medal, Award } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/mock-data'
import { DashboardCard } from './DashboardCard'

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
        return <Trophy size={16} className="text-yellow-500" />
      case 2:
        return <Medal size={16} className="text-gray-400" />
      case 3:
        return <Award size={16} className="text-orange-500" />
      default:
        return (
          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">{rank}</span>
          </div>
        )
    }
  }

  return (
    <DashboardCard title="Top Doadores" icon={Users}>
      {donors.length === 0 ? (
        <div className="text-center py-12 px-6">
          <Users size={32} className="text-muted-foreground mx-auto mb-2" />
          <div className="text-sm text-muted-foreground">
            Nenhuma doação ainda
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Seus top doadores aparecerão aqui
          </div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-16 text-center text-xs font-semibold text-muted-foreground">#</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="text-right text-xs font-semibold text-muted-foreground pr-6">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.slice(0, 5).map((donor) => (
                <TableRow
                  key={donor.rank}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="py-3 w-16 text-center">
                    <div className="flex items-center justify-center">
                      {getRankIcon(donor.rank)}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-medium text-foreground">
                    {donor.username}
                  </TableCell>
                  <TableCell className="py-3 text-right font-semibold money-display text-foreground pr-6">
                    {formatCurrency(donor.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {donors.length > 5 && (
            <div className="p-4 bg-muted/20 border-t border-border/50">
              <button className="w-full text-sm text-cyber-mint-600 hover:text-cyber-mint-700 font-medium transition-colors">
                Ver todos os doadores →
              </button>
            </div>
          )}
        </>
      )}
    </DashboardCard>
  )
}