'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertSettingsService } from '../services/alert-settings'
import { AlertConfig } from '../types'

export const alertSettingsKeys = {
  all: ['alertSettings'] as const,
  mine: () => [...alertSettingsKeys.all, 'mine'] as const,
}

export function useAlertSettings() {
  return useQuery({
    queryKey: alertSettingsKeys.mine(),
    queryFn: () => AlertSettingsService.getAlertSettings(),
    staleTime: 5 * 60 * 1000,
  })
}

export function useSaveAlertSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: AlertConfig) => AlertSettingsService.saveAlertSettings(config),
    onSuccess: (savedConfig) => {
      queryClient.setQueryData(alertSettingsKeys.mine(), savedConfig)
      queryClient.invalidateQueries({ queryKey: alertSettingsKeys.all })
    },
  })
}
