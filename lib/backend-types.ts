// Provider enums matching Go constants
export type StreamerProvider = "twitch" | "kick" | "youtube" | "email"
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

export interface BackendUserInfo {
  id: string
  name: string
  email?: string | null
  provider: StreamerProvider
  provider_id: string
  avatar_url?: string
  wallet?: {
    id: string
    provider: string
    hash: string
  } | null
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
  return ["twitch", "kick", "youtube", "email"].includes(value)
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
    kick: {
      login: "/api/auth/kick/login"             // GET - Redirects to Kick OAuth
      callback: "/api/auth/kick/callback"       // GET - OAuth callback with code
      user: "/api/auth/kick/user"               // GET - Get user data with token (if needed)
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
  wallet?: {
    id: string
    provider: WalletProvider
    hash: string
  } | null
  createdAt?: Date        // Parsed from ISO string
  updatedAt?: Date        // Parsed from ISO string
}

// Transform functions from backend to frontend types
export function transformBackendUserInfoToFrontend(backendUser: BackendUserInfo): User {
  const fallbackEmail = backendUser.email && backendUser.email !== ''
    ? backendUser.email
    : `${backendUser.provider || 'user'}-${backendUser.id}@placeholder.local`

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: fallbackEmail,
    provider: backendUser.provider,
    providerId: backendUser.provider_id,
    wallet: backendUser.wallet ? {
      id: backendUser.wallet.id,
      provider: backendUser.wallet.provider as WalletProvider,
      hash: backendUser.wallet.hash
    } : null
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

// Transaction types from Go model/transaction.go
export type TransactionStatus = 'pending' | 'confirmed' | 'failed'

export interface BackendTransaction {
  id: string                    // UUID
  address_from: string          // Donor's wallet address
  address_to_id: string         // Wallet ID (UUID)
  amount: number                // Transaction amount
  tx_hash: string               // Blockchain transaction hash
  status: TransactionStatus     // Transaction status
  message: string               // Donation message
  created_at: string            // ISO timestamp
  updated_at: string            // ISO timestamp
}

export interface TransactionCreateRequest {
  amount: number
  message?: string
  tx_hash: string
  address_from: string
}

export interface TransactionsResponse {
  transactions: BackendTransaction[]
}

// Session types from Go model/session.go
export interface BackendSession {
  id: string                    // UUID
  streamer_id: string           // UUID
  device_type: string           // e.g., "desktop", "mobile"
  browser: string               // e.g., "Chrome", "Firefox"
  ip_address: string            // Client IP
  login_method: string          // e.g., "twitch", "email"
  created_at: string            // ISO timestamp
  last_active_at: string        // ISO timestamp
  is_current: boolean           // Whether this is the current session
}

export interface SessionsResponse {
  sessions: BackendSession[]
}

// WebSocket types for real-time alerts
export type WebSocketMessageType = 'donation' | 'connection' | 'ping' | 'pong'

export interface WebSocketDonationAlert {
  type: 'donation'
  data: {
    id: string
    username: string            // Donor display name or address
    amount: number
    currency: string            // e.g., "ETH", "SOL", "BTC"
    message?: string
    timestamp: string           // ISO timestamp
    tx_hash: string
  }
}

export interface WebSocketConnectionMessage {
  type: 'connection'
  data: {
    status: 'connected' | 'disconnected'
    streamer_id: string
  }
}

export interface WebSocketPingMessage {
  type: 'ping'
}

export interface WebSocketPongMessage {
  type: 'pong'
}

export type WebSocketMessage =
  | WebSocketDonationAlert
  | WebSocketConnectionMessage
  | WebSocketPingMessage
  | WebSocketPongMessage

// Frontend-friendly transaction type
export interface Transaction {
  id: string
  addressFrom: string
  walletId: string
  amount: number
  txHash: string
  status: TransactionStatus
  message: string
  createdAt: Date
  updatedAt: Date
}

// Transform function for transaction
export function transformBackendTransactionToFrontend(backendTransaction: BackendTransaction): Transaction {
  return {
    id: backendTransaction.id,
    addressFrom: backendTransaction.address_from,
    walletId: backendTransaction.address_to_id,
    amount: backendTransaction.amount,
    txHash: backendTransaction.tx_hash,
    status: backendTransaction.status,
    message: backendTransaction.message,
    createdAt: new Date(backendTransaction.created_at),
    updatedAt: new Date(backendTransaction.updated_at)
  }
}

// Frontend-friendly session type
export interface Session {
  id: string
  streamerId: string
  deviceType: string
  browser: string
  ipAddress: string
  loginMethod: string
  createdAt: Date
  lastActiveAt: Date
  isCurrent: boolean
}

// Transform function for session
export function transformBackendSessionToFrontend(backendSession: BackendSession): Session {
  return {
    id: backendSession.id,
    streamerId: backendSession.streamer_id,
    deviceType: backendSession.device_type,
    browser: backendSession.browser,
    ipAddress: backendSession.ip_address,
    loginMethod: backendSession.login_method,
    createdAt: new Date(backendSession.created_at),
    lastActiveAt: new Date(backendSession.last_active_at),
    isCurrent: backendSession.is_current
  }
}
