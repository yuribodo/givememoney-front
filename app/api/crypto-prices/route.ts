import { NextResponse } from 'next/server'

interface CryptoPrices {
  ethereum: { usd: number }
  solana: { usd: number }
}

let cachedPrices: CryptoPrices | null = null
let cacheTimestamp = 0
const CACHE_TTL = 60_000 // 60 seconds

export async function GET() {
  const now = Date.now()

  if (cachedPrices && now - cacheTimestamp < CACHE_TTL) {
    return NextResponse.json(cachedPrices)
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana&vs_currencies=usd',
      { next: { revalidate: 60 } }
    )

    if (!response.ok) {
      if (cachedPrices) {
        return NextResponse.json(cachedPrices)
      }
      return NextResponse.json(
        { error: 'Failed to fetch crypto prices' },
        { status: 502 }
      )
    }

    const data: CryptoPrices = await response.json()
    cachedPrices = data
    cacheTimestamp = now

    return NextResponse.json(data)
  } catch {
    if (cachedPrices) {
      return NextResponse.json(cachedPrices)
    }
    return NextResponse.json(
      { error: 'Failed to fetch crypto prices' },
      { status: 502 }
    )
  }
}
