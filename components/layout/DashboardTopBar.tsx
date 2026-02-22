'use client'

import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '@/components/ui/sidebar'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/donations': 'Doações',
  '/layout': 'Personalizar',
  '/layout/alert': 'Editor de Alertas',
  '/layout/qrcode': 'QR Code',
  '/overlay': 'Overlay',
}

export function DashboardTopBar() {
  const pathname = usePathname()

  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path) && path !== '/dashboard'
    )?.[1] ||
    'Dashboard'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-electric-slate-100 bg-white px-4">
      <SidebarTrigger className="size-7 rounded-md text-electric-slate-400 hover:text-electric-slate-600 hover:bg-electric-slate-50 -ml-1 cursor-pointer" />
      <h1 className="text-[13px] font-semibold text-electric-slate-900">
        {title}
      </h1>
    </header>
  )
}
