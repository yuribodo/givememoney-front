'use client'

import { useState } from 'react'
import {
  GameController,
  ChartBar,
  Monitor,
  CurrencyDollar,
  User,
  Gear,
  ShareNetwork,
  Circle,
  CaretDown
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  isLive?: boolean
  onShareClick?: () => void
}

export function DashboardHeader({ isLive = false, onShareClick }: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  const navigationItems = [
    { icon: ChartBar, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Monitor, label: 'Overlay Setup', href: '/overlay' },
    { icon: CurrencyDollar, label: 'Doações', href: '/donations' },
    { icon: User, label: 'Profile', href: '/profile' },
  ]

  return (
    <header className="bg-white border-b border-electric-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GameController size={24} weight="duotone" className="text-cyber-mint-500" />
            <span className="text-xl font-bold text-electric-slate-900">GiveMeMoney</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-cyber-mint-50 text-cyber-mint-700'
                    : 'text-electric-slate-600 hover:text-electric-slate-900 hover:bg-electric-slate-50'
                }`}
              >
                <item.icon size={16} weight="duotone" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <Circle
                size={8}
                weight="fill"
                className={isLive ? 'text-error-rose' : 'text-electric-slate-400'}
              />
              <span className={`text-sm font-medium ${isLive ? 'status-live' : 'text-electric-slate-600'}`}>
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* Quick Share */}
            <Button
              variant="outline"
              size="sm"
              onClick={onShareClick}
              className="hidden sm:flex items-center gap-2"
            >
              <ShareNetwork size={16} weight="duotone" />
              Share Link
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Gear size={16} weight="duotone" />
            </Button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-electric-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-cyber-mint-500 flex items-center justify-center">
                  <User size={16} weight="duotone" className="text-white" />
                </div>
                <CaretDown size={12} weight="duotone" className="text-electric-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-electric-slate-200 py-2 z-10">
                  <a href="/profile" className="block px-4 py-2 text-sm text-electric-slate-700 hover:bg-electric-slate-50">
                    Meu Perfil
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-electric-slate-700 hover:bg-electric-slate-50">
                    Configurações
                  </a>
                  <hr className="my-2 border-electric-slate-200" />
                  <a href="/logout" className="block px-4 py-2 text-sm text-electric-slate-700 hover:bg-electric-slate-50">
                    Sair
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Gear size={20} weight="duotone" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}