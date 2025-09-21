// Provider enums matching Go constants
export type StreamerProvider = "twitch" | "kick" | "youtube"
export type WalletProvider = "metamask" | "phantom"

// JWT Claims from Go JWTClaims struct
export interface JWTClaims {
  user_id: string           // UUID from Go (string representation)
  email: string
  name: string
  provider: StreamerProvider
  token_type: "access" | "refresh"
  exp: number              // Expiration timestamp
  iat: number              // Issued at timestamp
  nbf: number              // Not before timestamp
  iss: string              // Issuer ("givememoney-backend")
}

// TokenPair from Go struct
export interface TokenPair {
  access_token: string
  refresh_token: string
  expires_in: number       // Seconds until expiration
}

// ProviderUser from Go utils/constants.go
export interface ProviderUser {
  ID: string               // Twitch user ID
  Name: string
  Email: string
}

// Wallet from Go model/wallet.go
export interface BackendWallet {
  id: string               // UUID as string
  wallet_provider: WalletProvider
  wallet_provider_id: string
  hash: string             // 64 character hash
  created_at: string       // ISO timestamp
  updated_at: string       // ISO timestamp
}

// Streamer from Go model/streamer.go
export interface BackendStreamer {
  id: string               // UUID as string
  provider: StreamerProvider
  provider_id: string      // Provider's user ID (e.g., Twitch ID)
  name: string
  email: string
  wallet_id: string        // UUID as string
  wallet?: BackendWallet   // Preloaded wallet data (nullable)
  created_at: string       // ISO timestamp
  updated_at: string       // ISO timestamp
}

// API Response from TwitchUser endpoint (auth_controller.go lines 143-152)
export interface TwitchUserResponse {
  id: string               // Streamer UUID
  name: string
  email: string
  provider: StreamerProvider
  provider_id: string      // Twitch user ID
  wallet_id: string        // Wallet UUID
  wallet_provider: WalletProvider
  wallet_hash: string      // Wallet hash
}

// OAuth Token Response from TwitchToken endpoint (auth_controller.go lines 116-124)
export interface TwitchTokenResponse {
  access_token: string     // Twitch access token
  token_type: "Bearer"
  expires_in: number       // Usually 3600 (1 hour)
  scope: string           // "user:read:email"
  refresh_token: string   // Empty for this scope
  jwt_token: string       // Our internal JWT
}

// Standard API Error Response format from Go
export interface BackendErrorResponse {
  error: string           // Error message
}

// Health Check Response
export interface HealthResponse {
  status: "ok"
}

// Request types for API calls

// WalletRequest from Go model/wallet.go
export interface WalletRequest {
  wallet_provider: WalletProvider
  hash: string            // Must be 64 characters
}

// Refresh Token Request
export interface RefreshTokenRequest {
  refresh_token: string
}

// Logout Request (no body needed, just Authorization header)
export type LogoutRequest = Record<string, never>

// Type guards for runtime validation
export function isStreamerProvider(value: string): value is StreamerProvider {
  return ["twitch", "kick", "youtube"].includes(value)
}

export function isWalletProvider(value: string): value is WalletProvider {
  return ["metamask", "phantom"].includes(value)
}

export function isTokenType(value: string): value is "access" | "refresh" {
  return ["access", "refresh"].includes(value)
}

// Helper type for API endpoints
export interface ApiEndpoints {
  // Auth endpoints
  auth: {
    twitch: {
      login: "/api/auth/twitch/login"           // GET - Redirects to Twitch OAuth
      callback: "/api/auth/twitch/callback"     // GET - OAuth callback with code
      token: "/api/auth/twitch/token"           // POST - Exchange code for tokens
      user: "/api/auth/twitch/user"             // GET - Get user data with token
    }
    refresh: "/api/auth/refresh"                // POST - Refresh JWT tokens
    logout: "/api/auth/logout"                  // POST - Logout (optional cleanup)
  }
  // Utility endpoints
  health: "/health"                             // GET - Health check
}

// Frontend-friendly user type (transformed from backend response)
export interface User {
  id: string
  name: string
  email: string
  provider: StreamerProvider
  providerId: string       // Camelcase version of provider_id
  wallet: {
    id: string
    provider: WalletProvider
    hash: string
  } | null
  createdAt?: Date        // Parsed from ISO string
  updatedAt?: Date        // Parsed from ISO string
}

// Transform functions from backend to frontend types
export function transformBackendUserToFrontend(backendUser: TwitchUserResponse): User {
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

export function transformBackendStreamerToFrontend(backendStreamer: BackendStreamer): User {
  return {
    id: backendStreamer.id,
    name: backendStreamer.name,
    email: backendStreamer.email,
    provider: backendStreamer.provider,
    providerId: backendStreamer.provider_id,
    wallet: backendStreamer.wallet ? {
      id: backendStreamer.wallet.id,
      provider: backendStreamer.wallet.wallet_provider,
      hash: backendStreamer.wallet.hash
    } : null,
    createdAt: new Date(backendStreamer.created_at),
    updatedAt: new Date(backendStreamer.updated_at)
  }
}