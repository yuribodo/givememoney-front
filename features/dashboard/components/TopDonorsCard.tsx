'use client'

import { Users, Trophy, Medal, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users size={20} className="text-cyber-mint-500" />
          TOP DOADORES
        </CardTitle>
      </CardHeader>

      <CardContent>
        {donors.length === 0 ? (
          <div className="text-center py-8">
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
              <TableHeader className="bg-transparent">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <tbody aria-hidden="true" className="table-row h-2"></tbody>
              <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                {donors.slice(0, 5).map((donor) => (
                  <TableRow
                    key={donor.rank}
                    className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50"
                  >
                    <TableCell className="py-2.5 w-12">
                      {getRankIcon(donor.rank)}
                    </TableCell>
                    <TableCell className="py-2.5 font-medium">
                      {donor.username}
                    </TableCell>
                    <TableCell className="py-2.5 text-right font-semibold money-display">
                      {formatCurrency(donor.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {donors.length > 5 && (
              <div className="pt-4 border-t border-border mt-2">
                <button className="w-full text-sm text-cyber-mint-600 hover:text-cyber-mint-700 font-medium">
                  Ver todos os doadores →
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}