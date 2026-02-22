'use client'

import { useMemo } from 'react'
import { useTransactions } from './useTransactions'
import { Transaction } from '@/lib/backend-types'

export interface DailyData {
  day: string
  value: number
  messages: number
}

export interface TopDonor {
  username: string
  amount: number
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

export interface DashboardMetrics {
  // Today's stats
  todayTotal: number
  lastHourTotal: number
  totalDonations: number

  // Weekly stats
  weeklyTotal: number
  weeklyPercentageChange: number
  previousWeekTotal: number

  // Daily breakdown for chart
  dailyData: DailyData[]

  // Top donors
  topDonors: TopDonor[]

  // Recent donations for feed
  recentDonations: RecentDonation[]

  // Loading and error states
  isLoading: boolean
  error: Error | null
}

// Helper to get currency from wallet provider (simplified)
function getCurrencyFromAddress(address: string): string {
  // Ethereum addresses start with 0x and are 42 characters
  if (address.startsWith('0x') && address.length === 42) {
    return 'ETH'
  }
  // Solana addresses are base58 encoded and typically 32-44 characters
  if (address.length >= 32 && address.length <= 44 && !address.startsWith('0x')) {
    return 'SOL'
  }
  return 'CRYPTO'
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

    // Today's total
    const todayTotal = transactions
      .filter(
        (t) => t.status !== 'failed' && t.createdAt >= todayStart
      )
      .reduce((sum, t) => sum + t.amount, 0)

    // Last hour total
    const lastHourTotal = transactions
      .filter(
        (t) => t.status !== 'failed' && t.createdAt >= oneHourAgo
      )
      .reduce((sum, t) => sum + t.amount, 0)

    // Total donations count
    const totalDonations = transactions.filter((t) => t.status !== 'failed').length

    // This week's total
    const weeklyTotal = transactions
      .filter(
        (t) => t.status !== 'failed' && t.createdAt >= weekStart
      )
      .reduce((sum, t) => sum + t.amount, 0)

    // Previous week's total
    const previousWeekTotal = transactions
      .filter(
        (t) =>
          t.status !== 'failed' &&
          t.createdAt >= previousWeekStart &&
          t.createdAt < weekStart
      )
      .reduce((sum, t) => sum + t.amount, 0)

    // Calculate percentage change
    const weeklyPercentageChange =
      previousWeekTotal > 0
        ? Math.round(((weeklyTotal - previousWeekTotal) / previousWeekTotal) * 100)
        : weeklyTotal > 0
        ? 100
        : 0

    // Daily data for chart (last 7 days)
    const dailyData = calculateDailyData(transactions, weekStart)

    // Top donors (by total amount)
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
        currency: getCurrencyFromAddress(t.addressFrom),
        message: t.message || undefined,
        timestamp: t.createdAt,
        status: t.status,
      }))

    return {
      todayTotal,
      lastHourTotal,
      totalDonations,
      weeklyTotal,
      weeklyPercentageChange,
      previousWeekTotal,
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

  // Aggregate transactions by day
  transactions
    .filter((t) => t.status !== 'failed' && t.createdAt >= weekStart)
    .forEach((t) => {
      const dayName = dayNames[t.createdAt.getDay()]
      const existing = dailyMap.get(dayName) || { value: 0, messages: 0 }
      dailyMap.set(dayName, {
        value: existing.value + t.amount,
        messages: existing.messages + 1,
      })
    })

  // Convert to array in correct order (Mon-Sun)
  const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return orderedDays.map((day) => {
    const data = dailyMap.get(day) || { value: 0, messages: 0 }
    return {
      day,
      value: Math.round(data.value * 100) / 100,
      messages: data.messages,
    }
  })
}

function calculateTopDonors(transactions: Transaction[]): TopDonor[] {
  const donorTotals = new Map<string, number>()

  // Sum up donations by address
  transactions
    .filter((t) => t.status !== 'failed')
    .forEach((t) => {
      const current = donorTotals.get(t.addressFrom) || 0
      donorTotals.set(t.addressFrom, current + t.amount)
    })

  // Sort by total and take top 5
  return Array.from(donorTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([address, amount], index) => ({
      username: `@${truncateAddress(address)}`,
      amount: Math.round(amount * 100) / 100,
      rank: index + 1,
    }))
}

function getEmptyMetrics(): Omit<DashboardMetrics, 'isLoading' | 'error'> {
  return {
    todayTotal: 0,
    lastHourTotal: 0,
    totalDonations: 0,
    weeklyTotal: 0,
    weeklyPercentageChange: 0,
    previousWeekTotal: 0,
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
