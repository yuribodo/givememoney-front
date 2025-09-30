'use client'

import { useEffect, useState } from 'react'
import { CurrencyDollar, Circle, ArrowRight } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, getTimeAgo } from '@/lib/mock-data'

interface RecentDonation {
  id: number
  username: string
  amount: number
  currency: string
  message?: string
  timestamp: Date
  status: 'confirmed' | 'pending'
}

interface RecentDonationsFeedProps {
  donations: RecentDonation[]
}

export function RecentDonationsFeed({ donations }: RecentDonationsFeedProps) {
  const [displayDonations, setDisplayDonations] = useState(donations)
  const [newDonationId, setNewDonationId] = useState<number | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update timestamps for time ago display
      setDisplayDonations(prev => [...prev])
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Highlight new donations
  useEffect(() => {
    if (newDonationId) {
      const timer = setTimeout(() => setNewDonationId(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [newDonationId])

  const getCurrencyEmoji = (currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC':
        return '₿'
      case 'ETH':
        return 'Ξ'
      case 'SOL':
        return '◎'
      default:
        return '$'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success-emerald'
      case 'pending':
        return 'text-warning-amber'
      default:
        return 'text-electric-slate-400'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <CurrencyDollar size={20} weight="duotone" className="text-cyber-mint-500" />
          DOAÇÕES RECENTES
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Donations list */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {displayDonations.map((donation) => (
            <div
              key={donation.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                newDonationId === donation.id
                  ? 'bg-cyber-mint-25 border-cyber-mint-200 animate-scale-in'
                  : 'bg-white border-electric-slate-200 hover:border-electric-slate-300'
              }`}
            >
              {/* Status indicator */}
              <Circle
                size={8}
                weight="fill"
                className={`mt-2 ${getStatusColor(donation.status)}`}
              />

              {/* Donation content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-electric-slate-900">
                      {donation.username}
                    </span>
                    <span className="text-sm text-electric-slate-600">doou</span>
                  </div>
                  <div className="text-xs text-electric-slate-500">
                    {getTimeAgo(donation.timestamp)}
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-semibold text-cyber-mint-600 money-display">
                    {getCurrencyEmoji(donation.currency)} {formatCurrency(donation.amount)}
                  </span>
                  <span className="text-sm text-electric-slate-500 uppercase">
                    {donation.currency}
                  </span>
                </div>

                {/* Message */}
                {donation.message && (
                  <div className="mt-2 p-2 bg-electric-slate-50 rounded text-sm text-electric-slate-700 italic">
                    &ldquo;{donation.message}&rdquo;
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {displayDonations.length === 0 && (
          <div className="text-center py-12">
            <CurrencyDollar
              size={48}
              weight="duotone"
              className="text-electric-slate-300 mx-auto mb-4"
            />
            <div className="text-electric-slate-600 mb-2">Nenhuma doação ainda</div>
            <div className="text-sm text-electric-slate-500">
              As doações aparecerão aqui em tempo real
            </div>
          </div>
        )}

        {/* View all button */}
        {displayDonations.length > 0 && (
          <div className="pt-4 border-t border-electric-slate-200">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-cyber-mint-600 hover:text-cyber-mint-700"
            >
              Ver todas as doações
              <ArrowRight size={16} weight="duotone" />
            </Button>
          </div>
        )}

        {/* Auto-refresh indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-electric-slate-500">
          <Circle size={6} weight="fill" className="text-success-emerald animate-pulse" />
          Atualizando em tempo real
        </div>
      </CardContent>
    </Card>
  )
}