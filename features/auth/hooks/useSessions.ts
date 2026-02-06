'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SessionsService } from '../services/sessions'
import { Session } from '@/lib/backend-types'

// Query keys for session-related queries
export const sessionKeys = {
  all: ['sessions'] as const,
  active: () => [...sessionKeys.all, 'active'] as const,
}

/**
 * Hook to fetch all active sessions for the current user
 */
export function useActiveSessions() {
  return useQuery({
    queryKey: sessionKeys.active(),
    queryFn: () => SessionsService.getActiveSessions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to revoke a specific session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => SessionsService.revokeSession(sessionId),
    onSuccess: (_, sessionId) => {
      // Update cache to remove the revoked session
      queryClient.setQueryData<Session[]>(sessionKeys.active(), (old) =>
        old?.filter((s) => s.id !== sessionId)
      )
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

/**
 * Hook to revoke all other sessions
 */
export function useRevokeAllOtherSessions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => SessionsService.revokeAllOtherSessions(),
    onSuccess: () => {
      // Update cache to keep only the current session
      queryClient.setQueryData<Session[]>(sessionKeys.active(), (old) =>
        old?.filter((s) => s.isCurrent)
      )
      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}
