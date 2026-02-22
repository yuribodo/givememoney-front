'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SecureAuthService } from '@/features/auth'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    let isActive = true

    const runLogout = async () => {
      await SecureAuthService.logout()
      if (isActive) {
        router.replace('/login')
      }
    }

    runLogout()

    return () => {
      isActive = false
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-pearl">
      <div className="text-sm text-electric-slate-500">Saindo...</div>
    </div>
  )
}
