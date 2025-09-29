/**
 * React Query configuration for request caching and deduplication
 */

import { QueryClient } from '@tanstack/react-query'

// Create a singleton QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes (data considered fresh)
      staleTime: 5 * 60 * 1000,

      // Cache time: 30 minutes (how long data stays in cache)
      gcTime: 30 * 60 * 1000,

      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Background refetch on window focus
      refetchOnWindowFocus: true,

      // Background refetch on network reconnect
      refetchOnReconnect: true,

      // Don't refetch on mount if data is fresh
      refetchOnMount: false,

      // Network mode configuration
      networkMode: 'online',
    },

    mutations: {
      // Retry mutations once for network errors
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message).toLowerCase()
          if (message.includes('network') || message.includes('fetch')) {
            return failureCount < 1
          }
        }
        return false
      },
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth-related queries
  auth: {
    user: ['auth', 'user'] as const,
    health: ['auth', 'health'] as const,
    tokenExpiration: ['auth', 'tokenExpiration'] as const,
  },

  // User-related queries
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
    preferences: (userId: string) => ['user', 'preferences', userId] as const,
  },

  // API health checks
  api: {
    health: ['api', 'health'] as const,
  },
} as const

// Mutation keys for consistent mutation management
export const mutationKeys = {
  auth: {
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
    refresh: ['auth', 'refresh'] as const,
  },
  user: {
    updateProfile: ['user', 'updateProfile'] as const,
    updatePreferences: ['user', 'updatePreferences'] as const,
  },
} as const

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate all auth-related queries
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.user }),

  // Invalidate user data
  user: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) })
    queryClient.invalidateQueries({ queryKey: queryKeys.user.preferences(userId) })
  },

  // Invalidate everything (use sparingly)
  all: () => queryClient.invalidateQueries(),
}

// Prefetch helpers for common queries
export const prefetchQueries = {
  userHealth: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.api.health,
      queryFn: async () => {
        const response = await fetch('/api/health')
        if (!response.ok) throw new Error('Health check failed')
        return response.json()
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    })
  },
}

// Error boundary helpers
export const isQueryError = (error: unknown): error is Error => {
  return error instanceof Error
}

export const getQueryErrorMessage = (error: unknown): string => {
  if (isQueryError(error)) {
    return error.message
  }
  return 'An unexpected error occurred'
}