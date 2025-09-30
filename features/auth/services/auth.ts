import { SecureStorage } from '@/lib/secure-storage'
import { ApiValidator } from '@/lib/validators'
import { ApiError } from '@/lib/api-schemas'
import { apiClient, TypeSafeApiClient } from '@/lib/api-client'
import { User } from '@/lib/backend-types'
import { log } from '@/lib/logger'

export type { User }

export class AuthService {
  private static apiClient = apiClient
  private static refreshInProgress = false

  static saveAuth(token: string, user: User) {
    try {
      // Validate JWT token format
      if (!TypeSafeApiClient.isValidJWTFormat(token)) {
        log.auth.error('Invalid JWT format provided to saveAuth')
        throw new ApiError(400, 'Invalid JWT token format')
      }

      // Validate JWT token expiry
      if (TypeSafeApiClient.isJWTExpired(token)) {
        log.auth.error('Expired JWT token provided to saveAuth')
        throw new ApiError(401, 'JWT token is expired')
      }

      // Validate user data
      const validatedUser = ApiValidator.validateUser(user)

      // Only store data after successful validation
      SecureStorage.setToken(token)
      SecureStorage.setUserData(validatedUser)

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth-updated', {
          detail: {
            user: validatedUser,
            isAuthenticated: true,
            userId: validatedUser.id
          }
        }))
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      log.auth.error('Invalid user data provided to saveAuth', error)
      throw new ApiError(500, 'Invalid user data format', error)
    }
  }

  static getToken(): string | null {
    const token = SecureStorage.getToken()

    if (token && !TypeSafeApiClient.isValidJWTFormat(token)) {
      log.security.event('Invalid JWT format in storage, clearing auth')
      this.clearAuth()
      return null
    }

    if (token && TypeSafeApiClient.isJWTExpired(token)) {
      log.auth.error('JWT token is expired, clearing auth')
      this.clearAuth()
      return null
    }

    return token
  }

  static getUser(): User | null {
    const userData = SecureStorage.getUserData<User>()
    if (userData) {
      try {
        return ApiValidator.validateUser(userData)
      } catch (error) {
        log.security.event('Stored user data is invalid, clearing auth', error)
        this.clearAuth()
        return null
      }
    }
    return null
  }

  static clearAuth() {
    SecureStorage.clearAll()

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-updated', {
        detail: {
          user: null,
          isAuthenticated: false,
          userId: null
        }
      }))
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user)
  }

  static loginWithTwitch() {
    const loginUrl = this.apiClient.getTwitchLoginUrl()
    window.location.href = loginUrl
  }

  static loginWithKick() {
    const loginUrl = this.apiClient.getKickLoginUrl()
    window.location.href = loginUrl
  }

  static async logout() {
    const token = this.getToken()

    this.clearAuth()

    if (token) {
      try {
        await this.apiClient.logout(token)
        log.auth.success('Backend logout successful')
      } catch (error) {
        log.warn('Backend logout failed (not critical)', error)
      }
    }

    window.location.href = '/'
  }

  static async fetchUserData(): Promise<User | null> {
    const token = this.getToken()
    if (!token) {
      console.warn('No token available for fetchUserData')
      return null
    }

    if (this.refreshInProgress) {
      console.log('⏳ Refresh already in progress, skipping...')
      return null
    }

    this.refreshInProgress = true

    try {
      // Extract provider from JWT token to determine which user endpoint to use
      const claims = TypeSafeApiClient.extractJWTClaims(token)
      const provider = claims?.provider

      let user: User
      if (provider === 'kick') {
        user = await this.apiClient.getKickUser(token)
      } else {
        // Default to Twitch for backward compatibility
        user = await this.apiClient.getTwitchUser(token)
      }

      this.saveAuth(token, user)

      console.log(`✅ ${provider || 'Twitch'} user data fetched and validated successfully`)
      return user
    } catch (error) {
      console.error('❌ Error fetching user data:', error)

      if (error instanceof ApiError && error.status === 401) {
        console.warn('🔒 Token is invalid, clearing auth')
        this.clearAuth()
      }

      return null
    } finally {
      this.refreshInProgress = false
    }
  }

  static extractTokenFromUrl(): string | null {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      if (token && !TypeSafeApiClient.isValidJWTFormat(token)) {
        console.error('Invalid JWT format in URL token')
        return null
      }

      return token
    }
    return null
  }

  static async processDashboardRedirect(): Promise<User | null> {
    const token = this.extractTokenFromUrl()
    if (!token) {
      console.warn('No token found in URL for dashboard redirect')
      return null
    }

    console.log('🔄 Processing dashboard redirect with token')

    try {
      // Extract provider from JWT token to determine which user endpoint to use
      const claims = TypeSafeApiClient.extractJWTClaims(token)
      const provider = claims?.provider

      let user: User
      if (provider === 'kick') {
        user = await this.apiClient.getKickUser(token)
      } else {
        // Default to Twitch for backward compatibility
        user = await this.apiClient.getTwitchUser(token)
      }

      this.saveAuth(token, user)

      window.history.replaceState({}, document.title, window.location.pathname)

      console.log(`✅ ${provider || 'Twitch'} dashboard redirect processed successfully`)

      // Force event after small delay to ensure all components receive it
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('auth-updated', {
          detail: {
            user,
            isAuthenticated: true,
            userId: user.id
          }
        }))
      }, 100)

      return user
    } catch (error) {
      console.error('❌ Error processing dashboard redirect:', error)

      window.history.replaceState({}, document.title, window.location.pathname)

      return null
    }
  }

  static async isBackendReachable(): Promise<boolean> {
    try {
      return await this.apiClient.isBackendReachable()
    } catch {
      return false
    }
  }

  static async registerWithEmail(name: string, email: string, password: string, confirmPassword: string): Promise<User> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 409) {
          throw new ApiError(409, 'Email already registered')
        }
        if (response.status === 400 && errorData.fields) {
          const fieldErrors = Object.values(errorData.fields).join(', ')
          throw new ApiError(400, fieldErrors)
        }
        throw new ApiError(response.status, errorData.message || 'Registration failed')
      }

      const data = await response.json()
      const user = ApiValidator.validateUser(data.user)

      // Save auth data from successful registration
      this.saveAuth(data.access_token, user)

      log.auth.success('Email registration successful')
      return user
    } catch (error) {
      log.auth.error('Email registration failed', error)
      throw error instanceof ApiError ? error : new ApiError(500, 'Registration failed')
    }
  }

  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 401) {
          throw new ApiError(401, 'Invalid email or password')
        }
        throw new ApiError(response.status, errorData.message || 'Login failed')
      }

      const data = await response.json()
      const user = ApiValidator.validateUser(data.user)

      // Save auth data from successful login
      this.saveAuth(data.access_token, user)

      log.auth.success('Email login successful')
      return user
    } catch (error) {
      log.auth.error('Email login failed', error)
      throw error instanceof ApiError ? error : new ApiError(500, 'Login failed')
    }
  }

  static async refreshTokenIfNeeded(): Promise<boolean> {
    const token = this.getToken()
    if (!token) {
      log.debug('No token available for refresh')
      return false
    }

    // Check if token is expiring soon (within 30 minutes)
    if (!this.isTokenExpiringSoon()) {
      log.debug('Token not expiring soon, no refresh needed')
      return false
    }

    if (this.refreshInProgress) {
      log.debug('Token refresh already in progress')
      return false
    }

    this.refreshInProgress = true

    try {
      // Note: Refresh tokens are HttpOnly and handled server-side
      // This client-side method will trigger a server-side refresh
      log.debug('Attempting token refresh via server-side endpoint')

      // Make a request to our refresh endpoint which will handle the HttpOnly refresh token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include HttpOnly cookies
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Refresh failed: ${response.status}`)
      }

      const data = await response.json()
      const tokenPair = ApiValidator.validateTokenPair(data)

      // Get current user data to maintain session
      const currentUser = this.getUser()
      if (!currentUser) {
        log.auth.error('No user data available during token refresh')
        this.clearAuth()
        return false
      }

      // Save new token with existing user data
      this.saveAuth(tokenPair.access_token, currentUser)

      log.auth.success('Token refresh successful')
      return true

    } catch (error) {
      log.auth.error('Token refresh failed', error)

      // If refresh fails, clear auth and force re-login
      this.clearAuth()
      return false
    } finally {
      this.refreshInProgress = false
    }
  }

  static getTokenExpiration(): Date | null {
    const token = this.getToken()
    if (!token) return null

    const claims = TypeSafeApiClient.extractJWTClaims(token)
    if (!claims?.exp) return null

    return new Date(claims.exp * 1000)
  }

  // Check if token will expire soon (within 30 minutes)
  static isTokenExpiringSoon(): boolean {
    const expiration = this.getTokenExpiration()
    if (!expiration) return true

    const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000)
    return expiration <= thirtyMinutesFromNow
  }

  static getDebugInfo(): object {
    if (process.env.NODE_ENV !== 'development') {
      return { error: 'Debug info only available in development' }
    }

    const token = this.getToken()
    const user = this.getUser()
    const claims = token ? TypeSafeApiClient.extractJWTClaims(token) : null

    return {
      hasToken: !!token,
      hasUser: !!user,
      tokenExpiration: this.getTokenExpiration(),
      isExpiringSoon: this.isTokenExpiringSoon(),
      claims,
      user
    }
  }
}