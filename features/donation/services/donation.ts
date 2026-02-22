import { Currency, WalletProvider } from '@/lib/backend-types'

export interface PublicWallet {
  id: string
  wallet_provider: WalletProvider
  wallet_address: string
  streamer_id: string
  streamer_name?: string
}

export interface TransactionSubmit {
  amount: number
  message?: string
  tx_hash: string
  address_from: string
  currency: Currency
}

export class DonationService {
  static async getPublicWallet(walletId: string): Promise<PublicWallet> {
    const response = await fetch(`/api/proxy/api/wallet/${encodeURIComponent(walletId)}/public`, {
      method: 'GET',
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Wallet not found')
      }
      throw new Error('Failed to fetch wallet information')
    }

    return response.json()
  }

  static async submitTransaction(walletId: string, data: TransactionSubmit): Promise<unknown> {
    const response = await fetch(`/api/proxy/api/transaction/wallet/${encodeURIComponent(walletId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to submit transaction')
    }

    return response.json()
  }
}
