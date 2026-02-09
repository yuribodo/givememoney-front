'use client'

import { use } from 'react'
import { usePublicWallet } from '@/features/donation/hooks/useDonation'
import { DonationForm } from '@/features/donation/components/DonationForm'

interface DonatePageProps {
  params: Promise<{ walletId: string }>
}

export default function DonatePage({ params }: DonatePageProps) {
  const { walletId } = use(params)
  const { data: wallet, isLoading, error } = usePublicWallet(walletId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading wallet information...</p>
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Wallet Not Found</h1>
          <p className="text-muted-foreground">
            This donation link may be invalid or the wallet no longer exists.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Donate via {wallet.wallet_provider === 'metamask' ? 'Ethereum' : 'Solana'}</h1>
          <p className="text-sm text-muted-foreground">
            Sending to wallet: <span className="font-mono text-xs">{wallet.wallet_address.slice(0, 6)}...{wallet.wallet_address.slice(-4)}</span>
          </p>
        </div>
        <DonationForm wallet={wallet} />
      </div>
    </div>
  )
}
