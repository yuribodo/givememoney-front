'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QRSettingsService } from '../services/qr-settings'
import { QRCodeConfig } from '../types'

export const qrSettingsKeys = {
  all: ['qrSettings'] as const,
  mine: () => [...qrSettingsKeys.all, 'mine'] as const,
}

export function useQRSettings() {
  return useQuery({
    queryKey: qrSettingsKeys.mine(),
    queryFn: () => QRSettingsService.getQRSettings(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSaveQRSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: QRCodeConfig) => QRSettingsService.saveQRSettings(config),
    onSuccess: (savedConfig) => {
      queryClient.setQueryData(qrSettingsKeys.mine(), savedConfig)
      queryClient.invalidateQueries({ queryKey: qrSettingsKeys.all })
    },
  })
}
