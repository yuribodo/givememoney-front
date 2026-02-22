import { NextRequest, NextResponse } from 'next/server'

const CLUSTER_URLS: Record<string, string> = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com',
}

export async function POST(request: NextRequest) {
  const cluster = request.nextUrl.searchParams.get('cluster') || 'mainnet-beta'
  const rpcUrl = CLUSTER_URLS[cluster] ?? CLUSTER_URLS['mainnet-beta']

  const body = await request.text()

  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
