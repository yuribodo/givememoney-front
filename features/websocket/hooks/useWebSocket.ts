'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { webSocketService, ConnectionState } from '../services/websocket'
import { WebSocketMessage, WebSocketDonationAlert } from '@/lib/backend-types'
import { transactionKeys } from '@/features/transactions'

interface UseWebSocketReturn {
  connectionState: ConnectionState
  isConnected: boolean
  lastAlert: WebSocketDonationAlert | null
  disconnect: () => void
  reconnect: () => void
}

/**
 * Hook to manage WebSocket connection for real-time donation alerts
 */
export function useWebSocket(streamerId: string | undefined): UseWebSocketReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected')
  const [lastAlert, setLastAlert] = useState<WebSocketDonationAlert | null>(null)
  const queryClient = useQueryClient()
  const streamerIdRef = useRef(streamerId)

  // Keep ref updated
  useEffect(() => {
    streamerIdRef.current = streamerId
  }, [streamerId])

  // Handle incoming messages
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.type === 'donation') {
        const donationAlert = message as WebSocketDonationAlert
        console.log('[useWebSocket] Received donation alert:', donationAlert)

        setLastAlert(donationAlert)

        // Invalidate transaction queries to refetch with new donation
        if (streamerIdRef.current) {
          queryClient.invalidateQueries({
            queryKey: transactionKeys.byStreamer(streamerIdRef.current),
          })
        }
      }
    },
    [queryClient]
  )

  // Handle connection state changes
  const handleConnect = useCallback(() => {
    setConnectionState('connected')
  }, [])

  const handleDisconnect = useCallback(() => {
    setConnectionState(webSocketService.getConnectionState())
  }, [])

  // Setup WebSocket connection
  useEffect(() => {
    if (!streamerId) {
      webSocketService.disconnect()
      setConnectionState('disconnected')
      return
    }

    // Connect to WebSocket
    webSocketService.connect(streamerId)
    setConnectionState(webSocketService.getConnectionState())

    // Register handlers
    const unsubMessage = webSocketService.onMessage(handleMessage)
    const unsubConnect = webSocketService.onConnect(handleConnect)
    const unsubDisconnect = webSocketService.onDisconnect(handleDisconnect)

    // Cleanup on unmount or streamer change
    return () => {
      unsubMessage()
      unsubConnect()
      unsubDisconnect()
      // Don't disconnect here - let the service manage the connection
      // to avoid unnecessary reconnections when components remount
    }
  }, [streamerId, handleMessage, handleConnect, handleDisconnect])

  // Poll connection state periodically (only when streamerId is set)
  useEffect(() => {
    if (!streamerId) {
      return
    }

    const interval = setInterval(() => {
      setConnectionState(webSocketService.getConnectionState())
    }, 5000)

    return () => clearInterval(interval)
  }, [streamerId])

  const disconnect = useCallback(() => {
    webSocketService.disconnect()
    setConnectionState('disconnected')
  }, [])

  const reconnect = useCallback(() => {
    if (streamerId) {
      webSocketService.reconnect()
      setConnectionState('connecting')
    }
  }, [streamerId])

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    lastAlert,
    disconnect,
    reconnect,
  }
}

/**
 * Hook to subscribe to donation alerts without managing connection
 * Useful for components that need to react to donations but don't own the connection
 */
export function useDonationAlerts(onDonation: (alert: WebSocketDonationAlert) => void) {
  useEffect(() => {
    const unsubscribe = webSocketService.onMessage((message) => {
      if (message.type === 'donation') {
        onDonation(message as WebSocketDonationAlert)
      }
    })

    return unsubscribe
  }, [onDonation])
}
