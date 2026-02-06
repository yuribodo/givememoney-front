'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '../services/transaction'
import { Transaction, TransactionCreateRequest } from '@/lib/backend-types'

// Query keys for transaction-related queries
export const transactionKeys = {
  all: ['transactions'] as const,
  byStreamer: (streamerId: string) => [...transactionKeys.all, 'streamer', streamerId] as const,
  byWallet: (walletId: string) => [...transactionKeys.all, 'wallet', walletId] as const,
}

/**
 * Hook to fetch all transactions for a streamer
 * Includes polling for real-time updates
 */
export function useTransactions(streamerId: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.byStreamer(streamerId!),
    queryFn: () => TransactionService.getTransactionsByStreamer(streamerId!),
    enabled: !!streamerId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  })
}

/**
 * Hook to fetch all transactions for a specific wallet
 */
export function useWalletTransactions(walletId: string | undefined) {
  return useQuery({
    queryKey: transactionKeys.byWallet(walletId!),
    queryFn: () => TransactionService.getTransactionsByWallet(walletId!),
    enabled: !!walletId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 60 seconds
  })
}

/**
 * Hook to create a new donation
 */
export function useCreateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      walletId,
      request,
    }: {
      walletId: string
      request: TransactionCreateRequest
    }) => TransactionService.createDonation(walletId, request),
    onSuccess: (newTransaction) => {
      // Invalidate all transaction queries to refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
  })
}

/**
 * Hook to invalidate transaction queries (useful for WebSocket updates)
 */
export function useInvalidateTransactions() {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
    invalidateByStreamer: (streamerId: string) =>
      queryClient.invalidateQueries({ queryKey: transactionKeys.byStreamer(streamerId) }),
    invalidateByWallet: (walletId: string) =>
      queryClient.invalidateQueries({ queryKey: transactionKeys.byWallet(walletId) }),
  }
}
