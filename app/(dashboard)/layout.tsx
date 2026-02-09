'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardTopBar } from '@/components/layout/DashboardTopBar'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AuthService } from '@/features/auth/services/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const [authBootstrapDone, setAuthBootstrapDone] = useState(false)
  const hasRedirectedRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = AuthService.extractTokenFromUrl()
    if (!token) {
      setAuthBootstrapDone(true)
      return
    }

    let isMounted = true
    AuthService.processDashboardRedirect()
      .finally(() => {
        if (isMounted) setAuthBootstrapDone(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (isLoading || !authBootstrapDone || hasRedirectedRef.current) return
    if (!isAuthenticated) {
      hasRedirectedRef.current = true
      const returnUrl = pathname || '/dashboard'
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    }
  }, [authBootstrapDone, isAuthenticated, isLoading, pathname, router])

  if (isLoading || !authBootstrapDone) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pearl">
        <div className="text-sm text-electric-slate-500">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pearl">
        <div className="text-sm text-electric-slate-500">Redirecionando...</div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />
      <SidebarInset className="bg-pearl">
        <DashboardTopBar />
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
