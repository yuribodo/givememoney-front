import { User } from './backend-types'

interface SessionResponse {
  authenticated: boolean
  sessionId?: string
  hasToken?: boolean
  user?: User
}

interface SessionData {
  access_token: string
  refresh_token?: string
  user: User
}

export class SecureAuthService {
  private static refreshInProgress = false

  /**
   * Create secure session using HttpOnly cookies (server-side only)
   */
  static async createSession(sessionData: SessionData): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
        credentials: 'include', // Include cookies
      })

      if (!response.ok) {
        throw new Error('Failed to create session')
      }

      const data = await response.json()

      // Store only non-sensitive user data in sessionStorage for client state
      if (data.user) {
        sessionStorage.setItem('user_data', JSON.stringify(data.user))
        sessionStorage.setItem('session_id', data.user.id)
      }

      return data.user
    } catch (error) {
      console.error('Session creation failed:', error)
      return null
    }
  }

  /**
   * Check session status (reads HttpOnly cookies server-side)
   */
  static async checkSession(): Promise<SessionResponse> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include', // Include cookies
      })

      if (!response.ok) {
        return { authenticated: false }
      }

      return await response.json()
    } catch (error) {
      console.error('Session check failed:', error)
      return { authenticated: false }
    }
  }

  /**
   * Get user data from sessionStorage (non-sensitive data only)
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null

    try {
      const userData = sessionStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      this.clearClientData()
      return null
    }
  }

  /**
   * Get session ID from client storage (non-sensitive identifier)
   */
  static getSessionId(): string | null {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem('session_id')
  }

  /**
   * Clear session (logout)
   */
  static async logout(): Promise<boolean> {
    try {
      // Clear server-side session
      const response = await fetch('/api/auth/session', {
        method: 'DELETE',
        credentials: 'include',
      })

      // Clear client-side data regardless of server response
      this.clearClientData()

      return response.ok
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear client data even if server request fails
      this.clearClientData()
      return false
    }
  }

  /**
   * Clear all client-side data
   */
  static clearClientData(): void {
    if (typeof window === 'undefined') return

    sessionStorage.removeItem('user_data')
    sessionStorage.removeItem('session_id')

    // Dispatch auth update event
    window.dispatchEvent(new CustomEvent('auth-updated', {
      detail: {
        user: null,
        isAuthenticated: false,
        userId: null
      }
    }))
  }

  /**
   * Check if user appears to be authenticated (client-side check)
   * Note: This only checks for client-side session markers, not actual token validity
   */
  static isAuthenticated(): boolean {
    return !!this.getUser() && !!this.getSessionId()
  }

  /**
   * Refresh authentication state from server
   */
  static async refreshAuthState(): Promise<User | null> {
    if (this.refreshInProgress) {
      return this.getUser()
    }

    this.refreshInProgress = true

    try {
      const sessionStatus = await this.checkSession()

      if (!sessionStatus.authenticated) {
        this.clearClientData()
        return null
      }

      // If session is valid but we don't have user data locally,
      // we need to fetch it from the backend
      const user = this.getUser()
      if (!user && sessionStatus.sessionId) {
        // Here you would fetch user data from your backend API
        // For now, keep existing user data if session is valid
        console.warn('Session valid but no user data - implement user data fetch')
      }

      return user
    } catch (error) {
      console.error('Auth state refresh failed:', error)
      return this.getUser() // Return cached user if available
    } finally {
      this.refreshInProgress = false
    }
  }

  /**
   * Check if token refresh is needed
   */
  static async isTokenRefreshNeeded(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        return true
      }

      const data = await response.json()
      return data.needsRefresh
    } catch {
      return true // Assume refresh needed if we can't check
    }
  }

  /**
   * Automatic token refresh using HttpOnly refresh token
   */
  static async refreshTokens(): Promise<boolean> {
    if (this.refreshInProgress) {
      return false
    }

    this.refreshInProgress = true

    try {
      // Server will read refresh_token from HttpOnly cookies
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        // Refresh failed, clear client data
        this.clearClientData()
        return false
      }

      // Refresh successful - tokens are automatically set as HttpOnly cookies
      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    } finally {
      this.refreshInProgress = false
    }
  }

  /**
   * Automatic refresh interceptor - call this periodically or before API calls
   */
  static async ensureValidToken(): Promise<boolean> {
    try {
      const needsRefresh = await this.isTokenRefreshNeeded()

      if (needsRefresh) {
        console.log('Token refresh needed, refreshing...')
        const refreshSuccess = await this.refreshTokens()

        if (!refreshSuccess) {
          console.log('Token refresh failed, user needs to re-authenticate')
          return false
        }

        console.log('Token refresh successful')
      }

      return true
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    }
  }
}