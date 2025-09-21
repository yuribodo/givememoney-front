/**
 * Production-safe logging service
 * Replaces console.log/warn/error statements with environment-aware logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  OFF = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
  userId?: string
  sessionId?: string
}

class Logger {
  private level: LogLevel
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      // Add user context if available (can be enhanced later)
      userId: typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : undefined,
      sessionId: typeof window !== 'undefined' ? sessionStorage.getItem('session_id') : undefined
    }
  }

  private output(logEntry: LogEntry): void {
    if (this.isDevelopment) {
      // Development: use console with colors
      const levelNames = ['🐛 DEBUG', '📋 INFO', '⚠️ WARN', '❌ ERROR']
      const levelName = levelNames[logEntry.level] || 'LOG'

      if (logEntry.data) {
        console.log(`${levelName} [${logEntry.timestamp}] ${logEntry.message}`, logEntry.data)
      } else {
        console.log(`${levelName} [${logEntry.timestamp}] ${logEntry.message}`)
      }
    } else {
      // Production: structured logging (could send to external service)
      if (logEntry.level >= LogLevel.ERROR) {
        // In production, only log errors and above
        console.error(JSON.stringify(logEntry))

        // TODO: Send to external logging service (e.g., Sentry, LogRocket)
        // this.sendToExternalService(logEntry)
      }
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.output(this.formatMessage(LogLevel.DEBUG, message, data))
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.output(this.formatMessage(LogLevel.INFO, message, data))
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.output(this.formatMessage(LogLevel.WARN, message, data))
    }
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.output(this.formatMessage(LogLevel.ERROR, message, data))
    }
  }

  // Convenience methods for common use cases
  authSuccess(message: string, userId?: string): void {
    this.info(`🔐 Auth Success: ${message}`, { userId })
  }

  authError(message: string, error?: unknown): void {
    this.error(`🔐 Auth Error: ${message}`, { error })
  }

  apiRequest(method: string, endpoint: string, status?: number): void {
    this.debug(`🌐 API ${method} ${endpoint}`, { status })
  }

  apiError(method: string, endpoint: string, error: unknown): void {
    this.error(`🌐 API Error ${method} ${endpoint}`, { error })
  }

  userAction(action: string, data?: unknown): void {
    this.info(`👤 User Action: ${action}`, data)
  }

  securityEvent(event: string, data?: unknown): void {
    this.warn(`🔒 Security Event: ${event}`, data)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions for easy migration from console.log
export const log = {
  debug: (message: string, data?: unknown) => logger.debug(message, data),
  info: (message: string, data?: unknown) => logger.info(message, data),
  warn: (message: string, data?: unknown) => logger.warn(message, data),
  error: (message: string, data?: unknown) => logger.error(message, data),

  // Specific domain methods
  auth: {
    success: (message: string, userId?: string) => logger.authSuccess(message, userId),
    error: (message: string, error?: unknown) => logger.authError(message, error),
  },

  api: {
    request: (method: string, endpoint: string, status?: number) => logger.apiRequest(method, endpoint, status),
    error: (method: string, endpoint: string, error: unknown) => logger.apiError(method, endpoint, error),
  },

  user: {
    action: (action: string, data?: unknown) => logger.userAction(action, data),
  },

  security: {
    event: (event: string, data?: unknown) => logger.securityEvent(event, data),
  }
}