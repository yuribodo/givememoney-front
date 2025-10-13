'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  icon?: LucideIcon
  iconClassName?: string
  children: React.ReactNode
  className?: string
  contentClassName?: string
  headerClassName?: string
}

export function DashboardCard({
  title,
  icon: Icon,
  iconClassName,
  children,
  className,
  contentClassName,
  headerClassName,
}: DashboardCardProps) {
  return (
    <Card className={cn('h-full overflow-hidden', className)}>
      <CardHeader className={cn('bg-gray-50 border-b border-gray-200', headerClassName)}>
        <CardTitle className="flex items-center justify-center gap-2 text-base">
          {Icon && <Icon size={20} className={cn('text-foreground', iconClassName)} />}
          <span className="text-foreground font-semibold">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn('p-0', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
