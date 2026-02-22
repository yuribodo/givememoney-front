'use client'

import { useMemo } from 'react'
import { useTransactions } from './useTransactions'
import { Transaction } from '@/lib/backend-types'

export interface DailyData {
  day: string
  value: number    // message count (currency-agnostic)
  messages: number
}

export interface TopDonor {
  username: string
  amounts: CurrencyTotals
  rank: number
}

export interface RecentDonation {
  id: string
  username: string
  amount: number
  currency: string
  message?: string
  timestamp: Date
  status: 'confirmed' | 'pending'
}

export type CurrencyTotals = Partial<Record<string, number>>

export interface DashboardMetrics {
  // Today's stats
  todayTotals: CurrencyTotals
  lastHourTotals: CurrencyTotals
  totalDonations: number

  // Weekly stats
  weeklyTotals: CurrencyTotals
  weeklyPercentageChange: number   // based on donation count
  previousWeekTotals: CurrencyTotals

  // Daily breakdown for chart (value = message count)
  dailyData: DailyData[]

  // Top donors
  topDonors: TopDonor[]

  // Recent donations for feed
  recentDonations: RecentDonation[]

  // Loading and error states
  isLoading: boolean
  error: Error | null
}

// Helper to truncate address for display
function truncateAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Type guard to filter out failed transactions
function isDisplayableTransaction(t: Transaction): t is Transaction & { status: 'confirmed' | 'pending' } {
  return t.status === 'confirmed' || t.status === 'pending'
}

// Sum amounts grouped by currency
function sumByCurrency(txs: Transaction[]): CurrencyTotals {
  return txs.reduce<CurrencyTotals>((acc, t) => {
    acc[t.currency] = (acc[t.currency] ?? 0) + t.amount
    return acc
  }, {})
}

/**
 * Hook that calculates dashboard metrics from transaction data
 */
export function useDashboardMetrics(streamerId: string | undefined): DashboardMetrics {
  const { data: transactions, isLoading, error } = useTransactions(streamerId)

  const metrics = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return getEmptyMetrics()
    }

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const weekStart = new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000)
    const previousWeekStart = new Date(weekStart.getTime() - 7 * 24 * 60 * 60 * 1000)

    const nonFailed = transactions.filter((t) => t.status !== 'failed')

    // Today's totals per currency
    const todayTotals = sumByCurrency(nonFailed.filter((t) => t.createdAt >= todayStart))

    // Last hour totals per currency
    const lastHourTotals = sumByCurrency(nonFailed.filter((t) => t.createdAt >= oneHourAgo))

    // Total donations count
    const totalDonations = nonFailed.length

    // This week's totals per currency
    const thisWeekTxs = nonFailed.filter((t) => t.createdAt >= weekStart)
    const weeklyTotals = sumByCurrency(thisWeekTxs)

    // Previous week's totals per currency
    const prevWeekTxs = nonFailed.filter(
      (t) => t.createdAt >= previousWeekStart && t.createdAt < weekStart
    )
    const previousWeekTotals = sumByCurrency(prevWeekTxs)

    // Percentage change based on donation count (currency-agnostic)
    const currentWeekCount = thisWeekTxs.length
    const previousWeekCount = prevWeekTxs.length
    const weeklyPercentageChange =
      previousWeekCount > 0
        ? Math.round(((currentWeekCount - previousWeekCount) / previousWeekCount) * 100)
        : currentWeekCount > 0
        ? 100
        : 0

    // Daily data for chart (last 7 days) — value = message count
    const dailyData = calculateDailyData(transactions, weekStart)

    // Top donors (per currency amounts)
    const topDonors = calculateTopDonors(transactions)

    // Recent donations (last 10, excluding failed)
    const recentDonations = [...transactions]
      .filter(isDisplayableTransaction)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
      .map((t) => ({
        id: t.id,
        username: `@${truncateAddress(t.addressFrom)}`,
        amount: t.amount,
        currency: t.currency,
        message: t.message || undefined,
        timestamp: t.createdAt,
        status: t.status,
      }))

    return {
      todayTotals,
      lastHourTotals,
      totalDonations,
      weeklyTotals,
      weeklyPercentageChange,
      previousWeekTotals,
      dailyData,
      topDonors,
      recentDonations,
      isLoading: false,
      error: null,
    }
  }, [transactions])

  return {
    ...metrics,
    isLoading,
    error: error as Error | null,
  }
}

function calculateDailyData(transactions: Transaction[], weekStart: Date): DailyData[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyMap = new Map<string, { value: number; messages: number }>()

  // Initialize all 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000)
    const dayName = dayNames[date.getDay()]
    dailyMap.set(dayName, { value: 0, messages: 0 })
  }

  // Aggregate transactions by day — value = message count (currency-agnostic)
  transactions
    .filter((t) => t.status !== 'failed' && t.createdAt >= weekStart)
    .forEach((t) => {
      const dayName = dayNames[t.createdAt.getDay()]
      const existing = dailyMap.get(dayName) || { value: 0, messages: 0 }
      dailyMap.set(dayName, {
        value: existing.messages + 1,
        messages: existing.messages + 1,
      })
    })

  // Convert to array in correct order (Mon-Sun)
  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return orderedDays.map((day) => {
    const data = dailyMap.get(day) || { value: 0, messages: 0 }
    return {
      day,
      value: data.value,
      messages: data.messages,
    }
  })
}

function calculateTopDonors(transactions: Transaction[]): TopDonor[] {
  const donorMap = new Map<string, CurrencyTotals>()

  // Sum donations per address, per currency
  transactions
    .filter((t) => t.status !== 'failed')
    .forEach((t) => {
      const curr = donorMap.get(t.addressFrom) ?? {}
      curr[t.currency] = (curr[t.currency] ?? 0) + t.amount
      donorMap.set(t.addressFrom, curr)
    })

  // Rank by cross-currency total (best proxy for overall contribution)
  return Array.from(donorMap.entries())
    .sort((a, b) => {
      const sumA = Object.values(a[1]).reduce((s: number, v) => s + (v ?? 0), 0)
      const sumB = Object.values(b[1]).reduce((s: number, v) => s + (v ?? 0), 0)
      return sumB - sumA
    })
    .slice(0, 5)
    .map(([address, amounts], index) => ({
      username: `@${truncateAddress(address)}`,
      amounts: Object.fromEntries(
        Object.entries(amounts).map(([c, a]) => [c, Math.round((a ?? 0) * 1e6) / 1e6])
      ) as CurrencyTotals,
      rank: index + 1,
    }))
}

function getEmptyMetrics(): Omit<DashboardMetrics, 'isLoading' | 'error'> {
  return {
    todayTotals: {},
    lastHourTotals: {},
    totalDonations: 0,
    weeklyTotals: {},
    weeklyPercentageChange: 0,
    previousWeekTotals: {},
    dailyData: [
      { day: 'Mon', value: 0, messages: 0 },
      { day: 'Tue', value: 0, messages: 0 },
      { day: 'Wed', value: 0, messages: 0 },
      { day: 'Thu', value: 0, messages: 0 },
      { day: 'Fri', value: 0, messages: 0 },
      { day: 'Sat', value: 0, messages: 0 },
      { day: 'Sun', value: 0, messages: 0 },
    ],
    topDonors: [],
    recentDonations: [],
  }
}
