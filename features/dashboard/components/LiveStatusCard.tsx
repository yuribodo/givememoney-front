'use client'

import { Badge } from '@/components/ui/badge-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
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
      value: balance,
      delta: 12.5,
      lastMonth: balance * 0.888,
      positive: true,
      format: formatCurrency,
      lastFormat: formatCurrency,
    },
    {
      title: 'Mensagens Recebidas',
      value: messagesReceived,
      delta: 8.3,
      lastMonth: Math.round(messagesReceived * 0.924),
      positive: true,
      format: (v: number) => v.toString(),
      lastFormat: (v: number) => v.toString(),
    },
    {
      title: 'Valor Recebido',
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
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="border-0">
            <CardTitle className="text-muted-foreground text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-medium text-foreground tracking-tight">
                {stat.format ? stat.format(stat.value) : formatNumber(stat.value)}
              </span>
              <Badge variant={stat.positive ? 'success' : 'destructive'} appearance="light">
                {stat.delta > 0 ? <ArrowUp /> : <ArrowDown />}
                {stat.delta}%
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-2 border-t pt-2.5">
              Vs last month:{' '}
              <span className="font-medium text-foreground">
                {stat.lastFormat
                  ? stat.lastFormat(stat.lastMonth)
                  : formatNumber(stat.lastMonth)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
