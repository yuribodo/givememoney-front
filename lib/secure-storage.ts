interface CookieOptions {
  maxAge?: number
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
  domain?: string
  httpOnly?: boolean
}

export class SecureStorage {
  private static readonly TOKEN_NAME = 'auth_token'
  private static readonly REFRESH_TOKEN_NAME = 'refresh_token'
  private static readonly USER_DATA_NAME = 'user_data'

  static setToken(token: string, options?: CookieOptions): void {
    const defaultOptions: CookieOptions = {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      httpOnly: true // Enable HttpOnly by default for security
    }

    const finalOptions = { ...defaultOptions, ...options }

    if (typeof window !== 'undefined') {
      const encodedToken = encodeURIComponent(token)
      const cookieString = [
        `${this.TOKEN_NAME}=${encodedToken}`,
        `Max-Age=${finalOptions.maxAge}`,
        `Path=${finalOptions.path}`,
        `SameSite=${finalOptions.sameSite}`,
        finalOptions.domain ? `Domain=${finalOptions.domain}` : '',
        finalOptions.secure ? 'Secure' : '',
        finalOptions.httpOnly ? 'HttpOnly' : ''
      ].filter(Boolean).join('; ')

      document.cookie = cookieString

      // Store in sessionStorage only if not HttpOnly (for client-side access)
      if (!finalOptions.httpOnly) {
        sessionStorage.setItem(this.TOKEN_NAME, token)
      }
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null

    // First try sessionStorage (for non-HttpOnly tokens)
    const sessionToken = sessionStorage.getItem(this.TOKEN_NAME)
    if (sessionToken) return sessionToken

    // Try to read from accessible cookies (non-HttpOnly only)
    const cookieMatch = document.cookie.match(new RegExp(`(^| )${this.TOKEN_NAME}=([^;]+)`))
    return cookieMatch ? decodeURIComponent(cookieMatch[2]) : null
  }

  // Server-side method to extract token from request headers
  static getTokenFromRequest(cookieHeader?: string): string | null {
    if (!cookieHeader) return null

    const cookieMatch = cookieHeader.match(new RegExp(`(?:^|; )${this.TOKEN_NAME}=([^;]+)`))
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null
  }

  static setRefreshToken(refreshToken: string, options?: CookieOptions): void {
    const defaultOptions: CookieOptions = {
      maxAge: 30 * 24 * 60 * 60, // 30 days - longer than access token
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Stricter for refresh tokens
      path: '/',
      httpOnly: true // Always HttpOnly for refresh tokens
    }

    const finalOptions = { ...defaultOptions, ...options }

    if (typeof window !== 'undefined') {
      const encodedToken = encodeURIComponent(refreshToken)
      const cookieString = [
        `${this.REFRESH_TOKEN_NAME}=${encodedToken}`,
        `Max-Age=${finalOptions.maxAge}`,
        `Path=${finalOptions.path}`,
        `SameSite=${finalOptions.sameSite}`,
        finalOptions.domain ? `Domain=${finalOptions.domain}` : '',
        finalOptions.secure ? 'Secure' : '',
        'HttpOnly' // Always HttpOnly for refresh tokens
      ].filter(Boolean).join('; ')

      document.cookie = cookieString
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null

    // Refresh tokens are HttpOnly, so can't be read client-side
    // This method is mainly for server-side usage
    return null
  }

  static getRefreshTokenFromRequest(cookieHeader?: string): string | null {
    if (!cookieHeader) return null

    const cookieMatch = cookieHeader.match(new RegExp(`(?:^|; )${this.REFRESH_TOKEN_NAME}=([^;]+)`))
    return cookieMatch ? decodeURIComponent(cookieMatch[1]) : null
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return

    sessionStorage.removeItem(this.TOKEN_NAME)

    // Clear both HttpOnly and regular cookies
    document.cookie = `${this.TOKEN_NAME}=; Max-Age=0; Path=/; SameSite=lax; HttpOnly`
    document.cookie = `${this.TOKEN_NAME}=; Max-Age=0; Path=/; SameSite=lax`
    document.cookie = `${this.TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=lax; HttpOnly`
    document.cookie = `${this.TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=lax`
  }

  static setUserData(userData: object): void {
    if (typeof window === 'undefined') return

    sessionStorage.setItem(this.USER_DATA_NAME, JSON.stringify(userData))
  }

  static getUserData<T = unknown>(): T | null {
    if (typeof window === 'undefined') return null

    try {
      const data = sessionStorage.getItem(this.USER_DATA_NAME)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      this.removeUserData()
      return null
    }
  }

  static removeUserData(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(this.USER_DATA_NAME)
  }

  static clearAll(): void {
    this.removeToken()
    this.removeUserData()
  }
}