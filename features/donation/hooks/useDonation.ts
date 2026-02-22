'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { DonationService, TransactionSubmit } from '../services/donation'

export const donationKeys = {
  all: ['donation'] as const,
  wallet: (walletId: string) => [...donationKeys.all, 'wallet', walletId] as const,
}

export function usePublicWallet(walletId: string | undefined) {
  return useQuery({
    queryKey: donationKeys.wallet(walletId!),
    queryFn: () => DonationService.getPublicWallet(walletId!),
    enabled: !!walletId,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useSubmitDonation() {
  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: TransactionSubmit }) =>
      DonationService.submitTransaction(walletId, data),
  })
}
