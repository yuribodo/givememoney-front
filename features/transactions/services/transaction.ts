import { ApiError } from '@/lib/api-schemas'
import { ApiValidator } from '@/lib/validators'
import {
  Transaction,
  TransactionCreateRequest,
  transformBackendTransactionToFrontend,
} from '@/lib/backend-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'

export class TransactionService {
  /**
   * Get all transactions for a streamer
   * GET /api/auth/transaction/streamer/:streamer_id
   */
  static async getTransactionsByStreamer(streamerId: string): Promise<Transaction[]> {
    const response = await fetch(`${BACKEND_URL}/api/auth/transaction/streamer/${streamerId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateAndTransformTransactions(data)
  }

  /**
   * Get all transactions for a wallet
   * GET /api/auth/transaction/wallet/:wallet_id
   */
  static async getTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    const response = await fetch(`${BACKEND_URL}/api/auth/transaction/wallet/${walletId}`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateAndTransformTransactions(data)
  }

  /**
   * Create a new donation (public endpoint - no auth required)
   * POST /api/transaction/wallet/:wallet_id
   */
  static async createDonation(
    walletId: string,
    request: TransactionCreateRequest
  ): Promise<Transaction> {
    const response = await fetch(`${BACKEND_URL}/api/transaction/wallet/${walletId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    const validated = ApiValidator.validateBackendTransaction(data.transaction || data)
    return transformBackendTransactionToFrontend(validated)
  }
}
