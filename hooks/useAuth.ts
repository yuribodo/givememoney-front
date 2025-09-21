'use client'

import { useState, useEffect, useCallback } from 'react'
import { AuthService, User } from '../lib/auth'
import { ApiError } from '../lib/api-schemas'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  tokenExpiration: Date | null
  isTokenExpiringSoon: boolean
}

interface AuthActions {
  login: () => void
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
  clearError: () => void
  checkBackendHealth: () => Promise<boolean>
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null)
  const [isTokenExpiringSoon, setIsTokenExpiringSoon] = useState(false)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const updateTokenInfo = useCallback(() => {
    const expiration = AuthService.getTokenExpiration()
    const expiringSoon = AuthService.isTokenExpiringSoon()
    setTokenExpiration(expiration)
    setIsTokenExpiringSoon(expiringSoon)
  }, [])

  const initAuth = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const storedUser = AuthService.getUser()
      if (storedUser) {
        setUser(storedUser)
        updateTokenInfo()
        setIsLoading(false)

        // Only refresh if token is expiring soon, avoid unnecessary requests
        if (AuthService.isTokenExpiringSoon()) {
          console.log('⚠️ Token expiring soon, refreshing user data...')

          try {
            const refreshedUser = await AuthService.fetchUserData()
            if (refreshedUser) {
              setUser(refreshedUser)
              updateTokenInfo()
              console.log('✅ User data refreshed successfully')
            }
          } catch (refreshError) {
            console.warn('⚠️ Failed to refresh user data:', refreshError)

            if (refreshError instanceof ApiError) {
              if (refreshError.status === 401) {
                console.log('🔒 Token invalid, clearing auth')
                setUser(null)
                updateTokenInfo()
                AuthService.clearAuth()
              } else if (refreshError.status === 0) {
                console.log('🔌 Network error during refresh, keeping user logged in')
                setError('Network connection issue. Some features may not work properly.')
              } else {
                setError(`Warning: ${refreshError.message}`)
              }
            }
          }
        }
      } else {
        setIsLoading(false)
        setTokenExpiration(null)
        setIsTokenExpiringSoon(false)
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error)
      setError(error instanceof Error ? error.message : 'Authentication initialization failed')
      setIsLoading(false)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
    }
  }, [updateTokenInfo])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        console.log('🔄 Storage change detected, reinitializing auth...')
        initAuth()
      }
    }

    const handleFocus = () => {
      console.log('🔄 Window focus detected, checking auth state...')
      initAuth()
    }

    const handleAuthUpdate = () => {
      console.log('🔄 Auth update event received, reinitializing...')
      initAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('auth-updated', handleAuthUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('auth-updated', handleAuthUpdate)
    }
  }, [initAuth])

  const login = () => {
    AuthService.loginWithTwitch()
  }

  const logout = async () => {
    try {
      setError(null)
      setIsLoading(true)

      await AuthService.logout()

      setUser(null)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
      setIsLoading(false)

      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')

      setUser(null)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
      setIsLoading(false)
      AuthService.clearAuth()
    }
  }

  const refreshUser = async (): Promise<User | null> => {
    try {
      setError(null)
      const refreshedUser = await AuthService.fetchUserData()

      if (refreshedUser) {
        setUser(refreshedUser)
        updateTokenInfo()
        console.log('✅ User refresh successful')
      }

      return refreshedUser
    } catch (error) {
      console.error('❌ Refresh user error:', error)

      if (error instanceof ApiError) {
        if (error.status === 401) {
          console.log('🔒 Auth error during refresh, clearing session')
          setUser(null)
          setTokenExpiration(null)
          setIsTokenExpiringSoon(false)
          AuthService.clearAuth()
          setError('Session expired. Please log in again.')
        } else if (error.status === 0) {
          console.log('🔌 Network error during manual refresh')
          setError('Network connection issue. Please check your internet connection.')
        } else {
          setError(error.message || 'Failed to refresh user data')
        }
      } else {
        setError(error instanceof Error ? error.message : 'Failed to refresh user data')
      }

      return null
    }
  }

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      return await AuthService.isBackendReachable()
    } catch {
      return false
    }
  }

  // TODO: implement automatic token refresh
  useEffect(() => {
    if (user && isTokenExpiringSoon) {
      console.log('⚠️ Token expiring soon - consider implementing auto-refresh')
    }
  }, [user, isTokenExpiringSoon])

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    tokenExpiration,
    isTokenExpiringSoon,
    login: AuthService.loginWithTwitch,
    logout,
    refreshUser,
    clearError,
    checkBackendHealth,
  }
}