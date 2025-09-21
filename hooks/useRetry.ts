'use client'

import { useState, useCallback } from 'react'

interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  onRetry?: (attempt: number, error: Error) => void
  onMaxAttemptsReached?: (error: Error) => void
}

interface RetryState {
  isRetrying: boolean
  attemptCount: number
  lastError: Error | null
}

export function useRetry(options: RetryOptions = {}) {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry,
    onMaxAttemptsReached
  } = options

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attemptCount: 0,
    lastError: null
  })

  const calculateDelay = useCallback((attempt: number): number => {
    const delay = baseDelay * Math.pow(backoffFactor, attempt - 1)
    return Math.min(delay, maxDelay)
  }, [baseDelay, backoffFactor, maxDelay])

  const sleep = useCallback((ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }, [])

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setState(prev => ({ ...prev, isRetrying: true, attemptCount: 0, lastError: null }))

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        setState(prev => ({ ...prev, attemptCount: attempt }))
        const result = await operation()

        // Success - reset state
        setState({
          isRetrying: false,
          attemptCount: 0,
          lastError: null
        })

        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))

        setState(prev => ({ ...prev, lastError: err }))

        if (attempt === maxAttempts) {
          // Max attempts reached
          setState(prev => ({ ...prev, isRetrying: false }))
          onMaxAttemptsReached?.(err)
          throw err
        }

        // Calculate delay and wait before retry
        const delay = calculateDelay(attempt)
        onRetry?.(attempt, err)

        console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms:`, err.message)
        await sleep(delay)
      }
    }

    // This should never be reached, but TypeScript needs it
    throw new Error('Unexpected end of retry loop')
  }, [maxAttempts, calculateDelay, sleep, onRetry, onMaxAttemptsReached])

  const reset = useCallback(() => {
    setState({
      isRetrying: false,
      attemptCount: 0,
      lastError: null
    })
  }, [])

  return {
    ...state,
    executeWithRetry,
    reset
  }
}

// Specialized hook for API requests
export function useApiRetry(options: RetryOptions = {}) {
  const defaultOptions: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000,
    backoffFactor: 2,
    ...options
  }

  const retry = useRetry(defaultOptions)

  const executeApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return retry.executeWithRetry(async () => {
      try {
        return await apiCall()
      } catch (error) {
        // Only retry on network errors or 5xx server errors
        if (error instanceof Error) {
          // Check if it's a fetch error (network issue)
          if (error.message.includes('NetworkError') ||
              error.message.includes('fetch')) {
            throw error // Retry
          }

          // Check if it's an API error with status
          if ('status' in error) {
            const status = (error as { status: number }).status
            if (status >= 500 && status < 600) {
              throw error // Retry on server errors
            }
            // Don't retry on client errors (4xx)
            throw new Error(`API Error ${status}: ${error.message}`)
          }
        }

        // Don't retry on unknown errors
        throw error
      }
    })
  }, [retry])

  return {
    ...retry,
    executeApiCall
  }
}

// Hook for component-level error handling with retry
export function useErrorRetry() {
  const [error, setError] = useState<Error | null>(null)
  const retry = useRetry({
    onRetry: (attempt, err) => {
      console.log(`Retrying operation (attempt ${attempt}):`, err.message)
    },
    onMaxAttemptsReached: (err) => {
      setError(err)
    }
  })

  const clearError = useCallback(() => {
    setError(null)
    retry.reset()
  }, [retry])

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    try {
      clearError()
      return await retry.executeWithRetry(operation)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      return null
    }
  }, [retry, clearError])

  return {
    error,
    clearError,
    executeWithErrorHandling,
    isRetrying: retry.isRetrying,
    attemptCount: retry.attemptCount
  }
}