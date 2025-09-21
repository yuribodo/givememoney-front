interface CookieOptions {
  maxAge?: number
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  path?: string
}

export class SecureStorage {
  private static readonly TOKEN_NAME = 'auth_token'
  private static readonly USER_DATA_NAME = 'user_data'

  static setToken(token: string, options?: CookieOptions): void {
    const defaultOptions: CookieOptions = {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    }

    const finalOptions = { ...defaultOptions, ...options }

    if (typeof window !== 'undefined') {
      const cookieString = [
        `${this.TOKEN_NAME}=${token}`,
        `Max-Age=${finalOptions.maxAge}`,
        `Path=${finalOptions.path}`,
        `SameSite=${finalOptions.sameSite}`,
        finalOptions.secure ? 'Secure' : ''
      ].filter(Boolean).join('; ')

      document.cookie = cookieString
      sessionStorage.setItem(this.TOKEN_NAME, token)
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null

    const sessionToken = sessionStorage.getItem(this.TOKEN_NAME)
    if (sessionToken) return sessionToken

    const cookieMatch = document.cookie.match(new RegExp(`(^| )${this.TOKEN_NAME}=([^;]+)`))
    return cookieMatch ? cookieMatch[2] : null
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return

    sessionStorage.removeItem(this.TOKEN_NAME)

    document.cookie = `${this.TOKEN_NAME}=; Max-Age=0; Path=/; SameSite=strict`
    document.cookie = `${this.TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=strict`
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