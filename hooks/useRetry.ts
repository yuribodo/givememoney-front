'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

export interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
  onRetry?: (attempt: number, error: Error) => void
  shouldRetry?: (error: unknown, attempt: number) => boolean
  onMaxAttemptsReached?: (error: Error) => void
}

export interface RetryState {
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
    shouldRetry = () => true,
    onMaxAttemptsReached
  } = options

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    attemptCount: 0,
    lastError: null
  })

  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const safeSetState = useCallback((updater: React.SetStateAction<RetryState>) => {
    if (mountedRef.current) {
      setState(updater)
    }
  }, [])

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
    safeSetState(prev => ({ ...prev, isRetrying: true, attemptCount: 0, lastError: null }))

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        safeSetState(prev => ({ ...prev, attemptCount: attempt }))
        const result = await operation()

        // Success - reset state
        safeSetState({
          isRetrying: false,
          attemptCount: 0,
          lastError: null
        })

        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))

        safeSetState(prev => ({ ...prev, lastError: err }))

        // Stop retrying early for non-retriable errors
        if (!shouldRetry(err, attempt)) {
          safeSetState(prev => ({ ...prev, isRetrying: false }))
          throw err
        }

        if (attempt === maxAttempts) {
          // Max attempts reached
          safeSetState(prev => ({ ...prev, isRetrying: false }))
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
  }, [maxAttempts, calculateDelay, sleep, onRetry, onMaxAttemptsReached, shouldRetry, safeSetState])

  const reset = useCallback(() => {
    safeSetState({
      isRetrying: false,
      attemptCount: 0,
      lastError: null
    })
  }, [safeSetState])

  return {
    ...state,
    executeWithRetry,
    reset
  }
}

// Specialized hook for API requests
export function useApiRetry(options: RetryOptions = {}) {
  const retry = useRetry({
    maxAttempts: 3,
    baseDelay: 1000,
    backoffFactor: 2,
    // Default retry classifier; can be overridden via options.shouldRetry
    shouldRetry: (error: unknown) => {
      // Abort/cancel should not retry
      if (error && typeof error === 'object' && 'name' in (error as any) && (error as any).name === 'AbortError') {
        return false
      }
      // Network errors (fetch/TypeError) — retry
      if (error instanceof Error && /network|fetch/i.test(error.message)) {
        return true
      }
      // HTTP-ish errors with status
      if (error && typeof error === 'object' && 'status' in (error as any)) {
        const status = (error as any).status as number
        // Retry: 408 (timeout), 429 (rate limit), and 5xx
        return status === 408 || status === 429 || (status >= 500 && status < 600)
      }
      // Unknown: no retry by default
      return false
    },
    ...options
  })

  const executeApiCall = useCallback(async <T>(
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return retry.executeWithRetry(apiCall)
  }, [retry])

  return {
    ...retry,
    executeApiCall
  }
}

// Hook for component-level error handling with retry
export function useErrorRetry() {
  const [error, setError] = useState<Error | null>(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const safeSetError = useCallback((errorValue: React.SetStateAction<Error | null>) => {
    if (mountedRef.current) {
      setError(errorValue)
    }
  }, [])

  const retry = useRetry({
    onRetry: (attempt, err) => {
      console.log(`Retrying operation (attempt ${attempt}):`, err.message)
    },
    onMaxAttemptsReached: (err) => {
      safeSetError(err)
    }
  })

  const clearError = useCallback(() => {
    safeSetError(null)
    retry.reset()
  }, [retry, safeSetError])

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    try {
      clearError()
      return await retry.executeWithRetry(operation)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      safeSetError(error)
      return null
    }
  }, [retry, clearError, safeSetError])

  return {
    error,
    clearError,
    executeWithErrorHandling,
    isRetrying: retry.isRetrying,
    attemptCount: retry.attemptCount
  }
}