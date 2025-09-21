/**
 * React Query hooks for authentication-related API calls
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AuthService, User } from '../lib/auth'
import { queryKeys, mutationKeys, invalidateQueries } from '../lib/query-client'
import { log } from '../lib/logger'

// Query hook for current user data
export function useUserQuery() {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: async (): Promise<User | null> => {
      // Check if user is authenticated first
      if (!AuthService.isAuthenticated()) {
        return null
      }

      try {
        return await AuthService.fetchUserData()
      } catch (error) {
        log.auth.error('Failed to fetch user data', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: AuthService.isAuthenticated(), // Only run if authenticated
    retry: (failureCount, error) => {
      // Don't retry if auth failed (401)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status
        if (status === 401) return false
      }
      return failureCount < 2
    },
  })
}

// Query hook for backend health check
export function useBackendHealthQuery() {
  return useQuery({
    queryKey: queryKeys.auth.health,
    queryFn: async (): Promise<boolean> => {
      return await AuthService.isBackendReachable()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for health checks
    refetchInterval: 30 * 1000, // Refetch every 30 seconds if in background
    refetchIntervalInBackground: true,
  })
}

// Query hook for token expiration status
export function useTokenExpirationQuery() {
  return useQuery({
    queryKey: queryKeys.auth.tokenExpiration,
    queryFn: (): {
      expiration: Date | null
      isExpiringSoon: boolean
      isAuthenticated: boolean
    } => {
      return {
        expiration: AuthService.getTokenExpiration(),
        isExpiringSoon: AuthService.isTokenExpiringSoon(),
        isAuthenticated: AuthService.isAuthenticated(),
      }
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Check every minute
    enabled: AuthService.isAuthenticated(),
  })
}

// Mutation hook for logout
export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.auth.logout,
    mutationFn: async (): Promise<void> => {
      await AuthService.logout()
    },
    onSuccess: () => {
      log.auth.success('User logged out successfully')
      // Clear all cached data after logout
      queryClient.clear()
    },
    onError: (error) => {
      log.auth.error('Logout failed', error)
    },
  })
}

// Mutation hook for token refresh
export function useTokenRefreshMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: mutationKeys.auth.refresh,
    mutationFn: async (): Promise<boolean> => {
      return await AuthService.refreshTokenIfNeeded()
    },
    onSuccess: (refreshed) => {
      if (refreshed) {
        log.auth.success('Token refreshed successfully')
        // Invalidate user data to refetch with new token
        invalidateQueries.auth()
      }
    },
    onError: (error) => {
      log.auth.error('Token refresh failed', error)
      // Clear cache if refresh failed
      queryClient.clear()
    },
  })
}

// Hook to automatically refresh token when needed
export function useAutoTokenRefresh() {
  const tokenRefreshMutation = useTokenRefreshMutation()
  const { data: tokenStatus } = useTokenExpirationQuery()

  // Automatically trigger refresh when token is expiring soon
  if (tokenStatus?.isExpiringSoon && tokenStatus.isAuthenticated) {
    if (!tokenRefreshMutation.isPending) {
      log.debug('Token expiring soon, triggering automatic refresh')
      tokenRefreshMutation.mutate()
    }
  }

  return {
    isRefreshing: tokenRefreshMutation.isPending,
    refreshError: tokenRefreshMutation.error,
    triggerRefresh: tokenRefreshMutation.mutate,
  }
}

// Combined hook for complete auth state with caching
export function useAuthState() {
  const userQuery = useUserQuery()
  const healthQuery = useBackendHealthQuery()
  const tokenQuery = useTokenExpirationQuery()
  const autoRefresh = useAutoTokenRefresh()

  return {
    // User data
    user: userQuery.data,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,

    // Authentication status
    isAuthenticated: tokenQuery.data?.isAuthenticated ?? false,
    tokenExpiration: tokenQuery.data?.expiration,
    isTokenExpiringSoon: tokenQuery.data?.isExpiringSoon ?? false,

    // Backend connectivity
    isBackendHealthy: healthQuery.data ?? false,
    isHealthLoading: healthQuery.isLoading,

    // Token refresh
    isRefreshing: autoRefresh.isRefreshing,
    refreshError: autoRefresh.refreshError,

    // Actions
    refetchUser: userQuery.refetch,
    refetchHealth: healthQuery.refetch,
    triggerRefresh: autoRefresh.triggerRefresh,
  }
}