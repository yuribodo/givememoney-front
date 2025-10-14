import {
  BackendErrorResponse
} from './backend-types'
import { ApiValidator } from './validators'

// Enhanced API Error class with backend error support
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public originalError?: unknown,
    public isBackendError: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static fromResponse(response: Response, data?: unknown): ApiError {
    // Try to parse as backend error first
    try {
      const backendError = ApiValidator.validateBackendError(data)
      return new ApiError(response.status, backendError.error, data, true)
    } catch {
      // Fallback to generic error handling
      const errorData = data as { message?: string; error?: string }
      const message = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`
      return new ApiError(response.status, message, data, false)
    }
  }

  static fromBackendError(status: number, backendError: BackendErrorResponse): ApiError {
    return new ApiError(status, backendError.error, backendError, true)
  }

  // Type guard to check if this is a backend-formatted error
  isFromBackend(): boolean {
    return this.isBackendError
  }
}

// Re-export everything from validators for convenience
export { ApiValidator } from './validators'

// Export types for use in other files
export type {
  StreamerProvider,
  WalletProvider,
  TwitchTokenResponse,
  TokenPair,
  BackendErrorResponse,
  HealthResponse,
  JWTClaims,
  BackendStreamer,
  BackendWallet,
  User
} from './backend-types'