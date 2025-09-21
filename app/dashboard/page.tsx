'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SecureAuthService } from '../../lib/secure-auth'
import { User } from '../../lib/backend-types'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const sessionStatus = await SecureAuthService.checkSession()

        if (!sessionStatus.authenticated) {
          router.push('/login?error=session_expired')
          return
        }

        const userData = SecureAuthService.getUser()

        if (!userData && sessionStatus.authenticated) {
          console.log('Session valid but no user data found, fetching from backend...')

          try {
            const response = await fetch('/api/auth/session', {
              method: 'GET',
              credentials: 'include',
            })

            if (response.ok) {
              const sessionData = await response.json()
              if (sessionData.user) {
                sessionStorage.setItem('user_data', JSON.stringify(sessionData.user))
                sessionStorage.setItem('session_id', sessionData.user.id)
                setUser(sessionData.user)
                return
              } else if (sessionData.backendError) {
                console.warn('Backend unreachable, using cached data if available')
                setError('Backend connection issue - some features may be limited')
                return
              }
            }
          } catch (fetchError) {
            console.error('Failed to fetch user data from backend:', fetchError)
          }

          console.warn('Could not get user data from backend')
          router.push('/login?error=invalid_session')
          return
        }

        if (userData) {
          setUser(userData)
        }

      } catch (error) {
        console.error('Authentication check failed:', error)
        setError('Failed to verify authentication')
        router.push('/login?error=auth_check_failed')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthentication()
  }, [router])


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Your Profile
              </h2>

              {user && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{user.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Provider</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{user.provider}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Wallet Provider</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{user.wallet?.provider || 'Not connected'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Wallet Hash</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{user.wallet?.hash || 'Not connected'}</dd>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}