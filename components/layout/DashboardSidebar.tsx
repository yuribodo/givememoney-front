'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  GameController,
  ChartLine,
  CurrencyCircleDollar,
  Monitor,
  QrCode,
  User,
  GearSix,
  SignOut,
  CaretUpDown,
} from '@phosphor-icons/react'
import { useAuth } from '@/features/auth'
import { useWebSocket } from '@/features/websocket'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigationItems = [
  {
    icon: ChartLine,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: CurrencyCircleDollar,
    label: 'Doações',
    href: '/donations',
  },
  {
    icon: Monitor,
    label: 'Overlay',
    href: '/overlay',
  },
  {
    icon: QrCode,
    label: 'QR Code',
    href: '/layout/qrcode',
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isConnected } = useWebSocket(user?.id)
  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="border-r border-electric-slate-100 !bg-white"
    >
      {/* Header — Brand + collapse toggle */}
      <SidebarHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                size="lg"
                className="hover:bg-transparent active:bg-transparent p-0 h-auto"
              >
                <Link href="/dashboard" className="flex items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyber-mint-500">
                    <GameController size={18} weight="fill" className="text-white" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[13px] font-bold text-electric-slate-900 tracking-tight">
                      GiveMeMoney
                    </span>
                    <span className="text-[10px] text-electric-slate-400 flex items-center gap-1 mt-0.5">
                      <span
                        className={`inline-block size-1.5 rounded-full ${
                          isConnected
                            ? 'bg-success-emerald animate-pulse'
                            : 'bg-electric-slate-300'
                        }`}
                      />
                      {isConnected ? 'Live' : 'Offline'}
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 pt-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navigationItems.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={
                        isActive
                          ? 'bg-electric-slate-100 text-electric-slate-900 font-semibold hover:bg-electric-slate-100'
                          : 'text-electric-slate-500 hover:text-electric-slate-800 hover:bg-electric-slate-50 font-medium'
                      }
                    >
                      <Link href={item.href}>
                        <item.icon
                          size={18}
                          weight={isActive ? 'fill' : 'duotone'}
                          className={isActive ? 'text-electric-slate-900' : ''}
                        />
                        <span className="text-[13px]">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User */}
      <SidebarFooter className="p-3 pt-2">
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    tooltip={user.name || 'Perfil'}
                    className="cursor-pointer hover:bg-electric-slate-50 data-[state=open]:bg-electric-slate-50"
                  >
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-electric-slate-900 text-white text-[10px] font-bold tracking-wider">
                      {initials}
                    </div>
                    <div className="flex flex-col gap-0 leading-tight min-w-0 flex-1">
                      <span className="font-semibold text-[13px] text-electric-slate-900 truncate">
                        {user.name || 'Streamer'}
                      </span>
                      {user.email && (
                        <span className="text-[11px] text-electric-slate-400 truncate">
                          {user.email}
                        </span>
                      )}
                    </div>
                    <CaretUpDown
                      size={14}
                      weight="bold"
                      className="text-electric-slate-300 shrink-0"
                    />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={8}
                  className="w-56 rounded-lg border border-electric-slate-200 bg-white"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-electric-slate-900">
                      {user.name || 'Streamer'}
                    </p>
                    {user.email && (
                      <p className="text-xs text-electric-slate-400 mt-0.5">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator className="bg-electric-slate-100" />
                  <div className="py-1">
                    <DropdownMenuItem asChild className="cursor-pointer gap-2 px-3 py-1.5 text-electric-slate-600">
                      <Link href="/profile">
                        <User size={15} weight="duotone" />
                        <span className="text-[13px]">Meu Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer gap-2 px-3 py-1.5 text-electric-slate-600">
                      <Link href="/settings">
                        <GearSix size={15} weight="duotone" />
                        <span className="text-[13px]">Configurações</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-electric-slate-100" />
                  <div className="py-1">
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer gap-2 px-3 py-1.5 text-error-rose focus:text-error-rose focus:bg-error-rose/5"
                    >
                      <SignOut size={15} weight="duotone" />
                      <span className="text-[13px]">Sair</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
