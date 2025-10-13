import { SecureAuthService } from '@/features/auth/services/secure-auth'

interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  status: number
}

export class SecureApiClient {
  /**
   * Make authenticated API request through proxy with automatic token refresh
   */
  static async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Ensure we have a valid token before making the request
    const hasValidToken = await SecureAuthService.ensureValidToken()

    if (!hasValidToken) {
      return {
        status: 401,
        error: 'Authentication required'
      }
    }

    try {
      const response = await fetch(`/api/proxy${endpoint}`, {
        ...options,
        credentials: 'include', // Include HttpOnly cookies for same-origin request
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (response.status === 401) {
        // Token might be expired, try refreshing once
        console.log('Received 401, attempting token refresh...')
        const refreshSuccess = await SecureAuthService.refreshTokens()

        if (refreshSuccess) {
          // Retry the original request with new token
          const retryResponse = await fetch(`/api/proxy${endpoint}`, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          })

          const retryData = await this.parseResponse(retryResponse)
          return {
            data: retryData as T,
            status: retryResponse.status
          }
        } else {
          // Refresh failed, user needs to re-authenticate
          return {
            status: 401,
            error: 'Authentication expired'
          }
        }
      }

      const data = await this.parseResponse(response)

      if (!response.ok) {
        return {
          status: response.status,
          error: (data as { error?: string })?.error || `Request failed with status ${response.status}`
        }
      }

      return {
        data: data as T,
        status: response.status
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  private static async parseResponse(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      return await response.json()
    }

    return await response.text()
  }

  /**
   * GET request with automatic token refresh
   */
  static async get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request with automatic token refresh
   */
  static async post<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request with automatic token refresh
   */
  static async put<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request with automatic token refresh
   */
  static async delete<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  /**
   * Public API request (no authentication required) through proxy
   */
  static async publicRequest<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`/api/proxy${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const data = await this.parseResponse(response)

      if (!response.ok) {
        return {
          status: response.status,
          error: (data as { error?: string })?.error || `Request failed with status ${response.status}`
        }
      }

      return {
        data: data as T,
        status: response.status
      }
    } catch (error) {
      console.error('Public API request failed:', error)
      return {
        status: 0,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }
}