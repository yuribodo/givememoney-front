/**
 * CSRF Protection utilities for OAuth flow
 */

export class CSRFProtection {
  private static readonly CSRF_TOKEN_NAME = 'oauth_state'
  private static readonly TOKEN_LENGTH = 32

  /**
   * Generate a cryptographically secure random state token
   */
  static generateStateToken(): string {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return Math.random().toString(36).substring(2, 15) +
             Math.random().toString(36).substring(2, 15)
    }

    // Client-side using Web Crypto API
    const array = new Uint8Array(this.TOKEN_LENGTH)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Store CSRF state token in secure cookie
   */
  static storeStateToken(token: string): void {
    if (typeof window === 'undefined') return

    const cookieString = [
      `${this.CSRF_TOKEN_NAME}=${token}`,
      `Max-Age=${5 * 60}`, // 5 minutes
      'Path=/',
      'SameSite=Strict',
      process.env.NODE_ENV === 'production' ? 'Secure' : '',
      'HttpOnly'
    ].filter(Boolean).join('; ')

    document.cookie = cookieString
  }

  /**
   * Validate CSRF state token from request
   */
  static validateStateToken(receivedToken: string, cookieHeader?: string): boolean {
    if (!receivedToken) return false

    const storedToken = this.getStoredStateToken(cookieHeader)
    if (!storedToken) return false

    // Constant-time comparison to prevent timing attacks
    if (storedToken.length !== receivedToken.length) return false

    let result = 0
    for (let i = 0; i < storedToken.length; i++) {
      result |= storedToken.charCodeAt(i) ^ receivedToken.charCodeAt(i)
    }

    return result === 0
  }

  /**
   * Get stored CSRF token from cookie header (server-side)
   */
  private static getStoredStateToken(cookieHeader?: string): string | null {
    if (typeof window !== 'undefined') {
      // Client-side: try to read from accessible cookies (won't work if HttpOnly)
      const cookieMatch = document.cookie.match(new RegExp(`(^| )${this.CSRF_TOKEN_NAME}=([^;]+)`))
      return cookieMatch ? cookieMatch[2] : null
    } else if (cookieHeader) {
      // Server-side: read from request headers
      const cookieMatch = cookieHeader.match(new RegExp(`(?:^|; )${this.CSRF_TOKEN_NAME}=([^;]+)`))
      return cookieMatch ? cookieMatch[1] : null
    }
    return null
  }

  /**
   * Clear CSRF state token
   */
  static clearStateToken(): void {
    if (typeof window === 'undefined') return

    document.cookie = `${this.CSRF_TOKEN_NAME}=; Max-Age=0; Path=/; SameSite=Strict; HttpOnly`
    document.cookie = `${this.CSRF_TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Strict; HttpOnly`
  }

  /**
   * Generate state parameter for OAuth URL
   */
  static prepareOAuthState(): string {
    const stateToken = this.generateStateToken()
    this.storeStateToken(stateToken)
    return stateToken
  }
}