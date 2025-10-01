export interface DashboardData {
  liveStatus: {
    isLive: boolean
    todayTotal: number
    lastHour: number
    totalDonations: number
    goal: number
    goalProgress: number
  }
  weeklyStats: {
    total: number
    percentageChange: number
    totalDonations: number
    previousWeek: number
    dailyData: Array<{
      day: string
      value: number
    }>
  }
  topDonors: Array<{
    username: string
    amount: number
    rank: number
  }>
  recentDonations: Array<{
    id: number
    username: string
    amount: number
    currency: string
    message?: string
    timestamp: Date
    status: 'confirmed' | 'pending'
  }>
}

export const mockDashboardData: DashboardData = {
  liveStatus: {
    isLive: true,
    todayTotal: 247.50,
    lastHour: 12.50,
    totalDonations: 18,
    goal: 300,
    goalProgress: 82
  },
  weeklyStats: {
    total: 1247.30,
    percentageChange: 23,
    totalDonations: 67,
    previousWeek: 1013.90,
    dailyData: [
      { day: 'Seg', value: 145.50 },
      { day: 'Ter', value: 198.20 },
      { day: 'Qua', value: 167.80 },
      { day: 'Qui', value: 223.40 },
      { day: 'Sex', value: 189.60 },
      { day: 'Sáb', value: 175.30 },
      { day: 'Dom', value: 147.50 }
    ]
  },
  topDonors: [
    { username: "@crypto_fan", amount: 50.00, rank: 1 },
    { username: "@supporter", amount: 25.00, rank: 2 },
    { username: "@viewer123", amount: 20.00, rank: 3 },
    { username: "@fan_number1", amount: 15.00, rank: 4 },
    { username: "@anonymous", amount: 12.50, rank: 5 }
  ],
  recentDonations: [
    {
      id: 1,
      username: "@crypto_whale",
      amount: 25.00,
      currency: "SOL",
      message: "Amazing stream!",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      status: "confirmed"
    },
    {
      id: 2,
      username: "@supporter123",
      amount: 10.00,
      currency: "ETH",
      message: "Keep it up!",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      status: "confirmed"
    },
    {
      id: 3,
      username: "@fan_number1",
      amount: 5.00,
      currency: "ETH",
      message: "",
      timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      status: "pending"
    },
    {
      id: 4,
      username: "@crypto_lover",
      amount: 15.00,
      currency: "BTC",
      message: "Love your content! 🚀",
      timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      status: "confirmed"
    },
    {
      id: 5,
      username: "@stream_fan",
      amount: 8.50,
      currency: "SOL",
      message: "Thanks for the entertainment",
      timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
      status: "confirmed"
    }
  ]
}

// Utility functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount).replace('US$', '$')
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value}%`
}

export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Agora mesmo'
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h atrás`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d atrás`
}