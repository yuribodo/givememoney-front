'use client'

import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, MessageSquare, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data'

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
      title: 'Saldo',
      icon: Wallet,
      value: balance,
      delta: 12.5,
      lastMonth: balance * 0.888,
      positive: true,
      format: formatCurrency,
      lastFormat: formatCurrency,
    },
    {
      title: 'Mensagens Recebidas',
      icon: MessageSquare,
      value: messagesReceived,
      delta: 8.3,
      lastMonth: Math.round(messagesReceived * 0.924),
      positive: true,
      format: (v: number) => v.toString(),
      lastFormat: (v: number) => v.toString(),
    },
    {
      title: 'Valor Recebido',
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center justify-center gap-2 text-base">
                <Icon size={20} className="text-foreground" />
                <span className="text-foreground font-semibold">{stat.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 p-6">
              <div className="flex items-center justify-start gap-2.5">
                <span className="text-3xl font-bold text-foreground tracking-tight money-display">
                  {stat.format ? stat.format(stat.value) : formatNumber(stat.value)}
                </span>
                <Badge variant={stat.positive ? 'success' : 'destructive'} appearance="light">
                  {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                  {stat.delta}%
                </Badge>
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
        );
      })}
    </div>
  )
}
