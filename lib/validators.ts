import { z } from 'zod'
import {
  TwitchUserResponse,
  TwitchTokenResponse,
  TokenPair,
  BackendErrorResponse,
  HealthResponse,
  JWTClaims,
  BackendStreamer,
  BackendWallet,
  User,
  KickUserResponse
} from './backend-types'

// Provider enum schemas
export const StreamerProviderSchema = z.enum(["twitch", "kick", "youtube"])
export const WalletProviderSchema = z.enum(["metamask", "phantom"])
export const TokenTypeSchema = z.enum(["access", "refresh"])

// Backend wallet schema (exact match for Go Wallet struct)
export const BackendWalletSchema = z.object({
  id: z.string().uuid(),
  wallet_provider: WalletProviderSchema,
  wallet_provider_id: z.string(),
  hash: z.string().min(1), // Supports both temp hashes and full 64-char crypto hashes
  created_at: z.string(),
  updated_at: z.string()
})

// Backend streamer schema (exact match for Go Streamer struct)
export const BackendStreamerSchema = z.object({
  id: z.string().uuid(),
  provider: StreamerProviderSchema,
  provider_id: z.string(),
  name: z.string(),
  email: z.string().email(),
  wallet_id: z.string().uuid(),
  wallet: BackendWalletSchema,
  created_at: z.string(),
  updated_at: z.string()
})

// JWT Claims schema (exact match for Go JWTClaims)
export const JWTClaimsSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  provider: StreamerProviderSchema,
  token_type: TokenTypeSchema,
  exp: z.number(),
  iat: z.number(),
  nbf: z.number(),
  iss: z.string()
})

// API Response schemas (exact match for Go controller responses)

// TwitchUser endpoint response (auth_controller.go lines 143-152)
export const TwitchUserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  provider: StreamerProviderSchema,
  provider_id: z.string(),
  wallet_id: z.string().uuid(),
  wallet_provider: WalletProviderSchema,
  wallet_hash: z.string().min(1) // Supports both temp hashes and full 64-char crypto hashes
})

// KickUser endpoint response (similar structure to Twitch)
export const KickUserResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  provider: z.literal("kick"),
  provider_id: z.string(),
  wallet_id: z.string().uuid(),
  wallet_provider: WalletProviderSchema,
  wallet_hash: z.string().min(1) // Supports both temp hashes and full 64-char crypto hashes
})

// TwitchToken endpoint response (auth_controller.go lines 116-124)
export const TwitchTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
  scope: z.string(),
  refresh_token: z.string(),
  jwt_token: z.string()
})

// Token pair response (jwt_service.go lines 21-25)
export const TokenPairSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number()
})

// Frontend User schema (transformed from backend)
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  provider: StreamerProviderSchema,
  providerId: z.string(),
  wallet: z.object({
    id: z.string().uuid(),
    provider: WalletProviderSchema,
    hash: z.string().min(1) // Supports both temp hashes and full 64-char crypto hashes
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

// Backend error response schema (Go controller error format)
export const BackendErrorResponseSchema = z.object({
  error: z.string()
})

// Health check response schema
export const HealthResponseSchema = z.object({
  status: z.literal("ok")
})

// Legacy API Error schema (for compatibility)
export const ApiErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  error: z.string().optional()
})

// Comprehensive validation helper functions
export class ApiValidator {
  static validateResponse<T>(schema: z.ZodType<T>, data: unknown): T {
    try {
      return schema.parse(data)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('API Response validation failed:', error.issues)
        throw new Error(`Invalid API response: ${error.issues.map(e => e.message).join(', ')}`)
      }
      throw error
    }
  }

  // Backend response validators
  static validateTwitchUserResponse(data: unknown): TwitchUserResponse {
    return this.validateResponse(TwitchUserResponseSchema, data)
  }

  static validateKickUserResponse(data: unknown): KickUserResponse {
    return this.validateResponse(KickUserResponseSchema, data)
  }

  static validateTwitchTokenResponse(data: unknown): TwitchTokenResponse {
    return this.validateResponse(TwitchTokenResponseSchema, data)
  }

  static validateTokenPair(data: unknown): TokenPair {
    return this.validateResponse(TokenPairSchema, data)
  }

  static validateJWTClaims(data: unknown): JWTClaims {
    return this.validateResponse(JWTClaimsSchema, data)
  }

  static validateBackendStreamer(data: unknown): BackendStreamer {
    return this.validateResponse(BackendStreamerSchema, data)
  }

  static validateBackendWallet(data: unknown): BackendWallet {
    return this.validateResponse(BackendWalletSchema, data)
  }

  static validateHealthResponse(data: unknown): HealthResponse {
    return this.validateResponse(HealthResponseSchema, data)
  }

  static validateBackendError(data: unknown): BackendErrorResponse {
    return this.validateResponse(BackendErrorResponseSchema, data)
  }

  // Frontend type validators
  static validateUser(data: unknown): User {
    return this.validateResponse(UserSchema, data)
  }

  // Legacy validators (for backward compatibility)
  static validateApiError(data: unknown) {
    return this.validateResponse(ApiErrorSchema, data)
  }

  // Helper method to validate and transform backend user to frontend user
  static validateAndTransformTwitchUser(data: unknown): User {
    const backendUser = this.validateTwitchUserResponse(data)
    return {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      provider: backendUser.provider,
      providerId: backendUser.provider_id,
      wallet: {
        id: backendUser.wallet_id,
        provider: backendUser.wallet_provider,
        hash: backendUser.wallet_hash
      }
    }
  }

  static validateAndTransformKickUser(data: unknown): User {
    const backendUser = this.validateKickUserResponse(data)
    return {
      id: backendUser.id,
      name: backendUser.name,
      email: backendUser.email,
      provider: backendUser.provider,
      providerId: backendUser.provider_id,
      wallet: {
        id: backendUser.wallet_id,
        provider: backendUser.wallet_provider,
        hash: backendUser.wallet_hash
      }
    }
  }
}