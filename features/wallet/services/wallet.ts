import { ApiError } from '@/lib/api-schemas'
import { ApiValidator } from '@/lib/validators'
import { BackendWallet, WalletRequest } from '@/lib/backend-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'

export class WalletService {
  /**
   * Create a new wallet for the authenticated user
   * POST /api/auth/wallet
   */
  static async createWallet(request: WalletRequest): Promise<BackendWallet> {
    const response = await fetch(`${BACKEND_URL}/api/auth/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateBackendWallet(data.wallet || data)
  }

  /**
   * Get wallet by ID
   * GET /api/auth/wallet/:id
   */
  static async getWalletById(walletId: string): Promise<BackendWallet> {
    const response = await fetch(`${BACKEND_URL}/api/auth/wallet/${walletId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateBackendWallet(data.wallet || data)
  }

  /**
   * Get all wallets for a streamer
   * GET /api/auth/wallet/streamer/:streamer_id
   */
  static async getWalletsByStreamer(streamerId: string): Promise<BackendWallet[]> {
    const response = await fetch(`${BACKEND_URL}/api/auth/wallet/streamer/${streamerId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    const wallets = data.wallets || data || []
    return wallets.map((wallet: unknown) => ApiValidator.validateBackendWallet(wallet))
  }

  /**
   * Update a wallet
   * PUT /api/auth/wallet/:id
   */
  static async updateWallet(walletId: string, request: Partial<WalletRequest>): Promise<BackendWallet> {
    const response = await fetch(`${BACKEND_URL}/api/auth/wallet/${walletId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateBackendWallet(data.wallet || data)
  }

  /**
   * Delete a wallet
   * DELETE /api/auth/wallet/:id
   */
  static async deleteWallet(walletId: string): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/auth/wallet/${walletId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }
  }
}
