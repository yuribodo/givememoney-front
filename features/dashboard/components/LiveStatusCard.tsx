'use client'

import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, MessageSquare, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/format'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/ui/animated-counter'

interface MetricsData {
  balance: number
  messagesReceived: number
  valueReceived: number
}

interface MetricsCardsProps {
  data: MetricsData
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const { balance, messagesReceived, valueReceived } = data

  const stats = [
    {
      title: 'Balance',
      icon: Wallet,
      value: balance,
      delta: 12.5,
      lastMonth: balance * 0.888,
      positive: true,
      format: formatCurrency,
      lastFormat: formatCurrency,
    },
    {
      title: 'Messages Received',
      icon: MessageSquare,
      value: messagesReceived,
      delta: 8.3,
      lastMonth: Math.round(messagesReceived * 0.924),
      positive: true,
      format: (v: number) => v.toString(),
      lastFormat: (v: number) => v.toString(),
    },
    {
      title: 'Value Received',
      icon: TrendingUp,
      value: valueReceived,
      delta: 15.7,
      lastMonth: valueReceived * 0.864,
      positive: true,
      format: formatCurrency,
      lastFormat: formatCurrency,
    },
  ];

  function formatNumber(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return n.toLocaleString();
    return n.toString();
  }

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
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={index} variants={cardVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-gray-200">
                <CardTitle className="flex items-center justify-center gap-2 text-base">
                  <Icon size={20} className="text-foreground" />
                  <span className="text-foreground font-semibold">{stat.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 p-6">
                <div className="flex items-center justify-start gap-2.5">
                  {stat.title === 'Messages Received' ? (
                    <AnimatedCounter
                      value={stat.value}
                      className="text-3xl font-bold text-foreground tracking-tight"
                    />
                  ) : (
                    <AnimatedCounter
                      value={stat.value}
                      className="text-3xl font-bold text-foreground tracking-tight money-display"
                      formatter={(v) => formatCurrency(v)}
                    />
                  )}
                  <motion.div variants={badgeVariants}>
                    <Badge variant={stat.positive ? 'success' : 'destructive'} appearance="light">
                      {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                      {stat.delta}%
                    </Badge>
                  </motion.div>
                </div>
                <div className="text-xs text-muted-foreground mt-2 border-t border-border pt-2.5">
                  Vs last month:{' '}
                  <span className="font-medium text-foreground">
                    {stat.lastFormat
                      ? stat.lastFormat(stat.lastMonth)
                      : formatNumber(stat.lastMonth)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  )
}
