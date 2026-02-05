import { ApiError } from '@/lib/api-schemas'
import { ApiValidator } from '@/lib/validators'
import { Session, transformBackendSessionToFrontend } from '@/lib/backend-types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9090'

export class SessionsService {
  /**
   * Get all active sessions for the authenticated user
   * GET /api/auth/sessions
   */
  static async getActiveSessions(): Promise<Session[]> {
    const response = await fetch(`${BACKEND_URL}/api/auth/sessions`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }

    const data = await response.json()
    return ApiValidator.validateAndTransformSessions(data)
  }

  /**
   * Revoke a specific session
   * DELETE /api/auth/sessions/:id
   */
  static async revokeSession(sessionId: string): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }
  }

  /**
   * Revoke all sessions except the current one
   * DELETE /api/auth/sessions
   */
  static async revokeAllOtherSessions(): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/auth/sessions`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw ApiError.fromResponse(response, errorData)
    }
  }
}
