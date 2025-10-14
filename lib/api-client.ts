import {
  TwitchTokenResponse,
  TokenPair,
  HealthResponse,
  User,
  ApiEndpoints
} from './backend-types'
import { ApiValidator } from './validators'
import { ApiError } from './api-schemas'
import { CSRFProtection } from './csrf'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'

const API_ENDPOINTS: ApiEndpoints = {
  auth: {
    twitch: {
      login: "/api/auth/twitch/login",
      callback: "/api/auth/twitch/callback",
      token: "/api/auth/twitch/token",
      user: "/api/auth/twitch/user"
    },
    kick: {
      login: "/api/auth/kick/login",
      callback: "/api/auth/kick/callback",
      user: "/api/auth/kick/user"
    },
    refresh: "/api/auth/refresh",
    logout: "/api/auth/logout"
  },
  health: "/health"
}

export class TypeSafeApiClient {
  private readonly baseUrl: string

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl
  }

  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token: string,
    validator: (data: unknown) => T
  ): Promise<T> {
    try {
      // Detect if body is FormData or if multipart content-type is already set
      const isFormData = options.body instanceof FormData
      const existingHeaders = options.headers || {}
      const hasMultipartContentType = Object.keys(existingHeaders).some(
        key => key.toLowerCase() === 'content-type' &&
        String(existingHeaders[key as keyof typeof existingHeaders]).toLowerCase().includes('multipart')
      )

      // Build headers object
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${token}`
      }

      // Only add Content-Type if not FormData and not already multipart
      if (!isFormData && !hasMultipartContentType) {
        headers['Content-Type'] = 'application/json'
      }

      // Merge with provided headers (case-insensitive)
      Object.entries(existingHeaders).forEach(([key, value]) => {
        headers[key] = String(value)
      })

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include'
      })

      return this.handleResponse(response, validator)
    } catch (error) {
      console.error(`❌ Network error for ${endpoint}:`, error)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Unable to connect to server. Please check your internet connection and try again.', error)
      }

      throw error
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    validator: (data: unknown) => T
  ): Promise<T> {
    try {
      // Detect if body is FormData or if multipart content-type is already set
      const isFormData = options.body instanceof FormData
      const existingHeaders = options.headers || {}
      const hasMultipartContentType = Object.keys(existingHeaders).some(
        key => key.toLowerCase() === 'content-type' &&
        String(existingHeaders[key as keyof typeof existingHeaders]).toLowerCase().includes('multipart')
      )

      // Build headers object
      const headers: Record<string, string> = {}

      // Only add Content-Type if not FormData and not already multipart
      if (!isFormData && !hasMultipartContentType) {
        headers['Content-Type'] = 'application/json'
      }

      // Merge with provided headers (case-insensitive)
      Object.entries(existingHeaders).forEach(([key, value]) => {
        headers[key] = String(value)
      })

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      })

      return this.handleResponse(response, validator)
    } catch (error) {
      console.error(`❌ Network error for ${endpoint}:`, error)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Unable to connect to server. Please check your internet connection and try again.', error)
      }

      throw error
    }
  }

  private async handleResponse<T>(
    response: Response,
    validator: (data: unknown) => T
  ): Promise<T> {
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw ApiError.fromResponse(response, data)
    }

    if (data && typeof data === 'object' && 'error' in data) {
      console.warn('Backend returned error in success response:', data)
      throw ApiError.fromResponse(response, data)
    }

    try {
      return validator(data)
    } catch (error) {
      console.error('Response validation failed:', {
        endpoint: response.url,
        status: response.status,
        data,
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      throw new ApiError(
        response.status,
        `Invalid response format from server: ${error instanceof Error ? error.message : 'Unknown validation error'}`,
        error
      )
    }
  }

  getTwitchLoginUrl(): string {
    const stateToken = CSRFProtection.prepareOAuthState()
    const loginUrl = new URL(`${this.baseUrl}${API_ENDPOINTS.auth.twitch.login}`)
    loginUrl.searchParams.set('state', stateToken)
    return loginUrl.toString()
  }

  async getTwitchUser(token: string): Promise<User> {
    const backendUser = await this.makeAuthenticatedRequest(
      API_ENDPOINTS.auth.twitch.user,
      { method: 'GET' },
      token,
      (data) => ApiValidator.validateBackendUserInfoResponse(data)
    )

    return ApiValidator.validateAndTransformUserInfo(backendUser)
  }

  async exchangeTwitchCode(code: string): Promise<TwitchTokenResponse> {
    const formData = new FormData()
    formData.append('code', code)

    return this.makeRequest(
      API_ENDPOINTS.auth.twitch.token,
      {
        method: 'POST',
        body: formData,
        headers: {}
      },
      (data) => ApiValidator.validateTwitchTokenResponse(data)
    )
  }

  getKickLoginUrl(): string {
    const stateToken = CSRFProtection.prepareOAuthState()
    const loginUrl = new URL(`${this.baseUrl}${API_ENDPOINTS.auth.kick.login}`)
    loginUrl.searchParams.set('state', stateToken)
    return loginUrl.toString()
  }

  async getKickUser(token: string): Promise<User> {
    const backendUser = await this.makeAuthenticatedRequest(
      API_ENDPOINTS.auth.kick.user,
      { method: 'GET' },
      token,
      (data) => ApiValidator.validateBackendUserInfoResponse(data)
    )

    return ApiValidator.validateAndTransformUserInfo(backendUser)
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    return this.makeRequest(
      API_ENDPOINTS.auth.refresh,
      {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken })
      },
      (data) => ApiValidator.validateTokenPair(data)
    )
  }

  async logout(token: string): Promise<void> {
    await this.makeAuthenticatedRequest(
      API_ENDPOINTS.auth.logout,
      { method: 'POST' },
      token,
      (data) => data
    )
  }

  async healthCheck(): Promise<HealthResponse> {
    return this.makeRequest(
      API_ENDPOINTS.health,
      { method: 'GET' },
      (data) => ApiValidator.validateHealthResponse(data)
    )
  }

  async isBackendReachable(): Promise<boolean> {
    try {
      await this.healthCheck()
      return true
    } catch {
      return false
    }
  }

  static isValidJWTFormat(token: string): boolean {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return false

      const payload = JSON.parse(atob(parts[1]))
      return payload && typeof payload === 'object'
    } catch {
      return false
    }
  }

  // Client-side only, not verified - use for display purposes only
  static extractJWTClaims(token: string): Partial<import('./backend-types').JWTClaims> | null {
    try {
      if (!this.isValidJWTFormat(token)) return null

      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload as Partial<import('./backend-types').JWTClaims>
    } catch {
      return null
    }
  }

  static isJWTExpired(token: string): boolean {
    const claims = this.extractJWTClaims(token)
    if (!claims?.exp) return true

    const now = Math.floor(Date.now() / 1000)
    return now >= claims.exp
  }
}

export const apiClient = new TypeSafeApiClient()
export { API_ENDPOINTS }
