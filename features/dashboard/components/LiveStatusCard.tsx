'use client'

import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, Wallet, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { CurrencyTotals } from '@/features/transactions'

interface MetricsData {
  balanceTotals: CurrencyTotals
  messagesReceived: number
  valueReceivedTotals: CurrencyTotals
}

interface MetricsCardsProps {
  data: MetricsData
}

function CurrencyBreakdown({ totals }: { totals: CurrencyTotals }) {
  const entries = Object.entries(totals).filter(([, v]) => (v ?? 0) > 0)
  if (entries.length === 0) {
    return <span className="text-3xl font-bold text-foreground tracking-tight">—</span>
  }
  return (
    <div className="space-y-0.5">
      {entries.map(([currency, amount]) => (
        <div key={currency} className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-foreground tracking-tight">
            {(amount ?? 0).toFixed(4)}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">{currency}</span>
        </div>
      ))}
    </div>
  )
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const { balanceTotals, messagesReceived, valueReceivedTotals } = data

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Balance (today's totals per currency) */}
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center justify-center gap-2 text-base">
              <Wallet size={20} className="text-foreground" />
              <span className="text-foreground font-semibold">Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 p-6">
            <div className="flex items-start justify-start gap-2.5">
              <CurrencyBreakdown totals={balanceTotals} />
              <motion.div variants={badgeVariants}>
                <Badge variant="success" appearance="light">
                  <ArrowUp />
                  Today
                </Badge>
              </motion.div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 border-t border-border pt-2.5">
              Donations received today
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messages Received (count — currency-agnostic) */}
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center justify-center gap-2 text-base">
              <MessageSquare size={20} className="text-foreground" />
              <span className="text-foreground font-semibold">Messages Received</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 p-6">
            <div className="flex items-center justify-start gap-2.5">
              <AnimatedCounter
                value={messagesReceived}
                className="text-3xl font-bold text-foreground tracking-tight"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-2 border-t border-border pt-2.5">
              Total donations received
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Value Received (last hour, per currency) */}
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center justify-center gap-2 text-base">
              <TrendingUp size={20} className="text-foreground" />
              <span className="text-foreground font-semibold">Value Received</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 p-6">
            <div className="flex items-start justify-start gap-2.5">
              <CurrencyBreakdown totals={valueReceivedTotals} />
              <motion.div variants={badgeVariants}>
                <Badge variant="success" appearance="light">
                  <ArrowUp />
                  1h
                </Badge>
              </motion.div>
            </div>
            <div className="text-xs text-muted-foreground mt-2 border-t border-border pt-2.5">
              Donations in the last hour
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
