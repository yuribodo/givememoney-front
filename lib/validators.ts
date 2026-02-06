import { z } from 'zod'
import {
  BackendUserInfo,
  TwitchTokenResponse,
  TokenPair,
  BackendErrorResponse,
  HealthResponse,
  JWTClaims,
  BackendStreamer,
  BackendWallet,
  BackendTransaction,
  BackendSession,
  TransactionsResponse,
  SessionsResponse,
  User,
  Transaction,
  Session,
  WalletProvider,
  isWalletProvider,
  transformBackendTransactionToFrontend,
  transformBackendSessionToFrontend
} from './backend-types'

// Provider enum schemas
export const StreamerProviderSchema = z.enum(["twitch", "kick", "youtube", "email"])
export const WalletProviderSchema = z.enum(["metamask", "phantom"])
export const TokenTypeSchema = z.enum(["access", "refresh"])
export const TransactionStatusSchema = z.enum(["pending", "confirmed", "failed"])

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
const BackendUserInfoWalletSchema = z.object({
  id: z.string().uuid(),
  provider: z.string().min(1),
  hash: z.string().min(1)
})

export const BackendUserInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.union([z.string().email(), z.literal(''), z.null()]).optional(),
  provider: StreamerProviderSchema,
  provider_id: z.string().min(1),
  avatar_url: z.string().url().optional(),
  wallet: BackendUserInfoWalletSchema.nullable().optional()
})

const BackendUserInfoResponseSchema = z.object({
  user: BackendUserInfoSchema.optional(),
  id: z.string().uuid().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  provider: StreamerProviderSchema.optional(),
  provider_id: z.string().optional(),
  wallet: BackendUserInfoWalletSchema.nullable().optional()
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
  }).nullable().optional(),
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

  static validateBackendUserInfo(data: unknown): BackendUserInfo {
    return this.validateResponse(BackendUserInfoSchema, data)
  }

  static validateBackendUserInfoResponse(data: unknown): BackendUserInfo {
    const response = this.validateResponse(BackendUserInfoResponseSchema, data)
    if (response.user) {
      return response.user
    }

    // Fallback for responses where user fields are at the root level
    return this.validateBackendUserInfo({
      id: response.id,
      name: response.name,
      email: response.email,
      provider: response.provider,
      provider_id: response.provider_id,
      avatar_url: undefined,
      wallet: response.wallet ?? null
    })
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
  static validateAndTransformUserInfo(data: unknown): User {
    const backendUser = this.validateBackendUserInfo(data)
    const email = backendUser.email && backendUser.email !== ''
      ? backendUser.email
      : `${backendUser.provider || 'user'}-${backendUser.id}@placeholder.local`

    const wallet = backendUser.wallet && backendUser.wallet !== null
      ? {
          id: backendUser.wallet.id,
          provider: isWalletProvider(backendUser.wallet.provider)
            ? backendUser.wallet.provider
            : "metamask",
          hash: backendUser.wallet.hash
        }
      : null

    return {
      id: backendUser.id,
      name: backendUser.name,
      email,
      provider: backendUser.provider,
      providerId: backendUser.provider_id,
      wallet
    }
  }

  // Transaction validators
  static validateBackendTransaction(data: unknown): BackendTransaction {
    return this.validateResponse(BackendTransactionSchema, data)
  }

  static validateTransactionsResponse(data: unknown): TransactionsResponse {
    return this.validateResponse(TransactionsResponseSchema, data)
  }

  static validateAndTransformTransactions(data: unknown): Transaction[] {
    const response = this.validateTransactionsResponse(data)
    return response.transactions.map(transformBackendTransactionToFrontend)
  }

  // Session validators
  static validateBackendSession(data: unknown): BackendSession {
    return this.validateResponse(BackendSessionSchema, data)
  }

  static validateSessionsResponse(data: unknown): SessionsResponse {
    return this.validateResponse(SessionsResponseSchema, data)
  }

  static validateAndTransformSessions(data: unknown): Session[] {
    const response = this.validateSessionsResponse(data)
    return response.sessions.map(transformBackendSessionToFrontend)
  }
}

// Backend transaction schema (matches Go model/transaction.go)
export const BackendTransactionSchema = z.object({
  id: z.string().uuid(),
  address_from: z.string().min(1),
  address_to_id: z.string().uuid(),
  amount: z.number().positive(),
  tx_hash: z.string().min(1),
  status: TransactionStatusSchema,
  message: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export const TransactionsResponseSchema = z.object({
  transactions: z.array(BackendTransactionSchema)
})

export const TransactionArraySchema = z.array(BackendTransactionSchema)

// Backend session schema (matches Go model/session.go)
export const BackendSessionSchema = z.object({
  id: z.string().uuid(),
  streamer_id: z.string().uuid(),
  device_type: z.string(),
  browser: z.string(),
  ip_address: z.string(),
  login_method: z.string(),
  created_at: z.string(),
  last_active_at: z.string(),
  is_current: z.boolean()
})

export const SessionsResponseSchema = z.object({
  sessions: z.array(BackendSessionSchema)
})

export const SessionArraySchema = z.array(BackendSessionSchema)

// WebSocket message schemas
export const WebSocketDonationAlertSchema = z.object({
  type: z.literal('donation'),
  data: z.object({
    id: z.string(),
    username: z.string(),
    amount: z.number(),
    currency: z.string(),
    message: z.string().optional(),
    timestamp: z.string(),
    tx_hash: z.string()
  })
})

export const WebSocketConnectionMessageSchema = z.object({
  type: z.literal('connection'),
  data: z.object({
    status: z.enum(['connected', 'disconnected']),
    streamer_id: z.string()
  })
})

export const WebSocketPingSchema = z.object({
  type: z.literal('ping')
})

export const WebSocketPongSchema = z.object({
  type: z.literal('pong')
})

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  WebSocketDonationAlertSchema,
  WebSocketConnectionMessageSchema,
  WebSocketPingSchema,
  WebSocketPongSchema
])
