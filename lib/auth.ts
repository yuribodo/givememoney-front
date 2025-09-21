import { SecureStorage } from './secure-storage'
import { ApiValidator } from './validators'
import { ApiError } from './api-schemas'
import { apiClient, TypeSafeApiClient } from './api-client'
import { User } from './backend-types'

export type { User }

export class AuthService {
  private static apiClient = apiClient
  private static refreshInProgress = false

  static saveAuth(token: string, user: User) {
    try {
      // Validate JWT token format
      if (!TypeSafeApiClient.isValidJWTFormat(token)) {
        console.error('Invalid JWT format provided to saveAuth')
        throw new ApiError(400, 'Invalid JWT token format')
      }

      // Validate JWT token expiry
      if (TypeSafeApiClient.isJWTExpired(token)) {
        console.error('Expired JWT token provided to saveAuth')
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
      console.error('Invalid user data provided to saveAuth:', error)
      throw new ApiError(500, 'Invalid user data format', error)
    }
  }

  static getToken(): string | null {
    const token = SecureStorage.getToken()

    if (token && !TypeSafeApiClient.isValidJWTFormat(token)) {
      console.warn('Invalid JWT format in storage, clearing auth')
      this.clearAuth()
      return null
    }

    if (token && TypeSafeApiClient.isJWTExpired(token)) {
      console.warn('JWT token is expired, clearing auth')
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
        console.error('Stored user data is invalid:', error)
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

  static async logout() {
    const token = this.getToken()

    this.clearAuth()

    if (token) {
      try {
        await this.apiClient.logout(token)
        console.log('✅ Backend logout successful')
      } catch (error) {
        console.warn('⚠️ Backend logout failed (not critical):', error)
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
      const user = await this.apiClient.getTwitchUser(token)

      this.saveAuth(token, user)

      console.log('✅ User data fetched and validated successfully')
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
      const user = await this.apiClient.getTwitchUser(token)

      this.saveAuth(token, user)

      window.history.replaceState({}, document.title, window.location.pathname)

      console.log('✅ Dashboard redirect processed successfully')

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

  // TODO: implement refresh token logic when backend supports it
  static async refreshTokenIfNeeded(): Promise<boolean> {
    return false
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