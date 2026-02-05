import { WebSocketMessage, WebSocketDonationAlert } from '@/lib/backend-types'

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

type MessageHandler = (data: WebSocketMessage) => void
type ConnectHandler = () => void
type DisconnectHandler = () => void
type ErrorHandler = (error: Event) => void

const BACKEND_WS_URL = process.env.NEXT_PUBLIC_BACKEND_WS_URL ||
  (process.env.NEXT_PUBLIC_BACKEND_URL?.replace('http', 'ws') || 'ws://localhost:9090')

class WebSocketService {
  private socket: WebSocket | null = null
  private streamerId: string | null = null
  private connectionState: ConnectionState = 'disconnected'
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // Start with 1 second
  private reconnectTimer: NodeJS.Timeout | null = null
  private pingInterval: NodeJS.Timeout | null = null
  private lastPongTime: number = 0

  // Event handlers
  private messageHandlers: Set<MessageHandler> = new Set()
  private connectHandlers: Set<ConnectHandler> = new Set()
  private disconnectHandlers: Set<DisconnectHandler> = new Set()
  private errorHandlers: Set<ErrorHandler> = new Set()

  /**
   * Connect to WebSocket for a specific streamer
   */
  connect(streamerId: string): void {
    if (this.socket && this.streamerId === streamerId && this.connectionState === 'connected') {
      console.log('[WebSocket] Already connected to streamer:', streamerId)
      return
    }

    // Disconnect from previous connection if any
    if (this.socket) {
      this.disconnect()
    }

    this.streamerId = streamerId
    this.connectionState = 'connecting'
    this.createConnection()
  }

  private createConnection(): void {
    if (!this.streamerId) return

    try {
      const wsUrl = `${BACKEND_WS_URL}/api/ws/alerts/${this.streamerId}`
      console.log('[WebSocket] Connecting to:', wsUrl)

      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log('[WebSocket] Connected')
        this.connectionState = 'connected'
        this.reconnectAttempts = 0
        this.reconnectDelay = 1000
        this.lastPongTime = Date.now()

        // Start ping interval
        this.startPingInterval()

        // Notify handlers
        this.connectHandlers.forEach((handler) => { handler(); })
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage

          // Handle pong messages
          if (data.type === 'pong') {
            this.lastPongTime = Date.now()
            return
          }

          // Notify message handlers
          this.messageHandlers.forEach((handler) => { handler(data); })
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error)
        }
      }

      this.socket.onclose = (event) => {
        console.log('[WebSocket] Disconnected:', event.code, event.reason)
        this.connectionState = 'disconnected'
        this.stopPingInterval()

        // Notify handlers
        this.disconnectHandlers.forEach((handler) => { handler(); })

        // Attempt reconnection if not intentionally closed
        if (event.code !== 1000 && this.streamerId) {
          this.scheduleReconnect()
        }
      }

      this.socket.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
        this.errorHandlers.forEach((handler) => { handler(error); })
      }
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error)
      this.connectionState = 'disconnected'
      this.scheduleReconnect()
    }
  }

  private startPingInterval(): void {
    this.stopPingInterval()

    // Send ping every 30 seconds
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: 'ping' }))

        // Check if we received a pong recently (within 10 seconds)
        const timeSinceLastPong = Date.now() - this.lastPongTime
        if (timeSinceLastPong > 40000) {
          console.warn('[WebSocket] No pong received, reconnecting...')
          this.socket.close()
        }
      }
    }, 30000)
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WebSocket] Max reconnect attempts reached')
      return
    }

    this.connectionState = 'reconnecting'
    this.reconnectAttempts++

    console.log(
      `[WebSocket] Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.reconnectDelay}ms`
    )

    this.reconnectTimer = setTimeout(() => {
      this.createConnection()
    }, this.reconnectDelay)

    // Exponential backoff (max 30 seconds)
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000)
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    console.log('[WebSocket] Disconnecting...')

    // Clear timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.stopPingInterval()

    // Close socket
    if (this.socket) {
      this.socket.close(1000, 'Client disconnected')
      this.socket = null
    }

    this.streamerId = null
    this.connectionState = 'disconnected'
    this.reconnectAttempts = 0
    this.reconnectDelay = 1000
  }

  /**
   * Register message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  /**
   * Register connect handler
   */
  onConnect(handler: ConnectHandler): () => void {
    this.connectHandlers.add(handler)
    return () => this.connectHandlers.delete(handler)
  }

  /**
   * Register disconnect handler
   */
  onDisconnect(handler: DisconnectHandler): () => void {
    this.disconnectHandlers.add(handler)
    return () => this.disconnectHandlers.delete(handler)
  }

  /**
   * Register error handler
   */
  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler)
    return () => this.errorHandlers.delete(handler)
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connectionState === 'connected' && this.socket?.readyState === WebSocket.OPEN
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Get current streamer ID
   */
  getStreamerId(): string | null {
    return this.streamerId
  }

  /**
   * Force reconnect
   */
  reconnect(): void {
    const id = this.streamerId
    if (id) {
      this.disconnect()
      this.connect(id)
    }
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService()
