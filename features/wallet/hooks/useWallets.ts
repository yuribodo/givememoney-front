'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { WalletService } from '../services/wallet'
import { BackendWallet, WalletRequest } from '@/lib/backend-types'

// Query keys for wallet-related queries
export const walletKeys = {
  all: ['wallets'] as const,
  byStreamer: (streamerId: string) => [...walletKeys.all, 'streamer', streamerId] as const,
  byId: (walletId: string) => [...walletKeys.all, 'detail', walletId] as const,
}

/**
 * Hook to fetch all wallets for a streamer
 */
export function useWallets(streamerId: string | undefined) {
  return useQuery({
    queryKey: walletKeys.byStreamer(streamerId!),
    queryFn: () => WalletService.getWalletsByStreamer(streamerId!),
    enabled: !!streamerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single wallet by ID
 */
export function useWallet(walletId: string | undefined) {
  return useQuery({
    queryKey: walletKeys.byId(walletId!),
    queryFn: () => WalletService.getWalletById(walletId!),
    enabled: !!walletId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to create a new wallet
 */
export function useCreateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: WalletRequest) => WalletService.createWallet(request),
    onSuccess: (newWallet) => {
      // Invalidate all wallet queries to refetch
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}

/**
 * Hook to update an existing wallet
 */
export function useUpdateWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ walletId, request }: { walletId: string; request: Partial<WalletRequest> }) =>
      WalletService.updateWallet(walletId, request),
    onSuccess: (updatedWallet) => {
      // Update cache for this specific wallet
      queryClient.setQueryData(walletKeys.byId(updatedWallet.id), updatedWallet)
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}

/**
 * Hook to delete a wallet
 */
export function useDeleteWallet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (walletId: string) => WalletService.deleteWallet(walletId),
    onSuccess: (_, walletId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: walletKeys.byId(walletId) })
      // Invalidate list queries to refetch
      queryClient.invalidateQueries({ queryKey: walletKeys.all })
    },
  })
}
