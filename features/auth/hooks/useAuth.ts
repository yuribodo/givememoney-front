'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SecureAuthService } from '../services/secure-auth'
import { AuthService } from '../services/auth'
import { User } from '@/lib/backend-types'

interface AuthInitResult {
  user: User | null
  error: string | null
}

let authInitPromise: Promise<AuthInitResult> | null = null
let lastAuthSnapshot: (AuthInitResult & { timestamp: number }) | null = null
const AUTH_INIT_THROTTLE_MS = 1500

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
  loginWithEmail: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
  clearError: () => void
  checkSession: () => Promise<boolean>
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tokenExpiration, setTokenExpiration] = useState<Date | null>(null)
  const [isTokenExpiringSoon, setIsTokenExpiringSoon] = useState(false)
  const router = useRouter()

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const updateTokenInfo = useCallback(() => {
    setTokenExpiration(null)
    setIsTokenExpiringSoon(false)
  }, [])

  const initAuth = useCallback(async () => {
    try {
      const now = Date.now()
      if (
        !authInitPromise &&
        lastAuthSnapshot &&
        now - lastAuthSnapshot.timestamp < AUTH_INIT_THROTTLE_MS
      ) {
        setUser(lastAuthSnapshot.user)
        setError(lastAuthSnapshot.error)
        setIsLoading(false)
        updateTokenInfo()
        return
      }

      setIsLoading(true)
      setError(null)

      if (!authInitPromise) {
        authInitPromise = (async () => {
          const storedUser = SecureAuthService.getUser()
          if (storedUser) {
            try {
              const sessionStatus = await SecureAuthService.checkSession()
              if (!sessionStatus.authenticated) {
                console.log('Session expired, clearing auth')
                SecureAuthService.clearClientData()
                return { user: null, error: null }
              }
              return { user: sessionStatus.user ?? storedUser, error: null }
            } catch (sessionError) {
              console.warn('Failed to check session status:', sessionError)
              return { user: storedUser, error: 'Connection issue. Some features may not work properly.' }
            }

          }

          try {
            const sessionStatus = await SecureAuthService.checkSession()
            if (sessionStatus.authenticated) {
              const sessionUser = sessionStatus.user || SecureAuthService.getUser()
              return { user: sessionUser ?? null, error: null }
            }
          } catch (error) {
            console.warn('Failed to check session:', error)
          }

          return { user: null, error: null }
        })()
      }

      const result = await authInitPromise
      authInitPromise = null
      lastAuthSnapshot = { ...result, timestamp: Date.now() }

      setUser(result.user)
      setError(result.error)
      setIsLoading(false)
      updateTokenInfo()
    } catch (error) {
      console.error('Auth initialization error:', error)
      authInitPromise = null
      setError(error instanceof Error ? error.message : 'Authentication initialization failed')
      setIsLoading(false)
      updateTokenInfo()
    }
  }, [updateTokenInfo])

  useEffect(() => {
    initAuth()
  }, [initAuth])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        console.log('Storage change detected, reinitializing auth...')
        initAuth()
      }
    }

    const handleFocus = () => {
      console.log('Window focus detected, checking auth state...')
      initAuth()
    }

    const handleAuthUpdate = () => {
      console.log('Auth update event received, reinitializing...')
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

  const logout = async () => {
    try {
      setError(null)
      setIsLoading(true)

      await SecureAuthService.logout()

      setUser(null)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
      setIsLoading(false)

      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')

      setUser(null)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
      setIsLoading(false)
      SecureAuthService.clearClientData()
    } finally {
      router.replace('/login')
    }
  }

  const refreshUser = async (): Promise<User | null> => {
    try {
      setError(null)

      // Refresh authentication state
      const refreshedUser = await SecureAuthService.refreshAuthState()

      if (refreshedUser) {
        setUser(refreshedUser)
        console.log('User refresh successful')
      }

      return refreshedUser
    } catch (error) {
      console.error('Refresh user error:', error)
      setUser(null)
      setTokenExpiration(null)
      setIsTokenExpiringSoon(false)
      SecureAuthService.clearClientData()
      setError('Session expired. Please log in again.')

      return null
    }
  }

  const checkSession = async (): Promise<boolean> => {
    try {
      const sessionStatus = await SecureAuthService.checkSession()
      return sessionStatus.authenticated
    } catch {
      return false
    }
  }

  useEffect(() => {
    if (user && isTokenExpiringSoon) {
      console.log('Token expiring soon - auto-refresh available')
    }
  }, [user, isTokenExpiringSoon])

  const login = useCallback(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'
    const baseUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl
    window.location.href = `${baseUrl}/api/auth/twitch/login`
  }, [])

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError(null)
      setIsLoading(true)

      const user = await AuthService.loginWithEmail(email, password)
      setUser(user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<void> => {
    try {
      setError(null)
      setIsLoading(true)

      const user = await AuthService.registerWithEmail(name, email, password, confirmPassword)
      setUser(user)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    tokenExpiration,
    isTokenExpiringSoon,
    login,
    loginWithEmail,
    register,
    logout,
    refreshUser,
    clearError,
    checkSession,
  }
}
