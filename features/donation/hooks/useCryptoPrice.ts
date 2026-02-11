import { useQuery } from '@tanstack/react-query'

interface CryptoPrices {
  ethereum: { usd: number }
  solana: { usd: number }
}

async function fetchCryptoPrices(): Promise<CryptoPrices> {
  const response = await fetch('/api/crypto-prices')
  if (!response.ok) {
    throw new Error('Failed to fetch crypto prices')
  }
  return response.json()
}

export function useCryptoPrice() {
  return useQuery({
    queryKey: ['crypto-prices'],
    queryFn: fetchCryptoPrices,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    retry: 2,
  })
}
