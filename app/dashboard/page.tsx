'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../../lib/auth'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false)

  useEffect(() => {
    const processRedirect = async () => {
      // Check if this is a redirect from backend with token
      const token = AuthService.extractTokenFromUrl()
      if (token) {
        setIsProcessingRedirect(true)
        const user = await AuthService.processDashboardRedirect()
        setIsProcessingRedirect(false)

        if (!user) {
          router.push('/login?error=invalid_token')
        }
      } else if (!isLoading && !user) {
        // No token and no user - redirect to login
        router.push('/login')
      }
    }

    processRedirect()
  }, [isLoading, user, router])


  if (isLoading || isProcessingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-lg">
            {isProcessingRedirect ? 'Processing login...' : 'Loading dashboard...'}
          </span>
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
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{user.wallet.provider}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Wallet Hash</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{user.wallet.hash}</dd>
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