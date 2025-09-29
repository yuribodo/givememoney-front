'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import {
  GameController,
  ChartLine,
  MonitorPlay,
  CurrencyCircleDollar,
  User,
  CircleDashed
} from '@phosphor-icons/react'
import { useAuth } from '@/hooks/useAuth'

interface FloatingNavbarProps {
  isLive?: boolean
}

export function FloatingNavbar({ isLive = false }: FloatingNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()
  const { user, isLoading, logout } = useAuth()

  const navigationItems = [
    {
      icon: ChartLine,
      label: 'Dashboard',
      href: '/dashboard',
      isActive: pathname === '/dashboard'
    },
    {
      icon: MonitorPlay,
      label: 'Overlay',
      href: '/overlay',
      isActive: pathname === '/overlay'
    },
    {
      icon: CurrencyCircleDollar,
      label: 'Doações',
      href: '/donations',
      isActive: pathname === '/donations'
    },
  ]

  // Handle smooth transitions between sections
  const handleNavigation = (href: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      window.location.href = href
    }, 150) // Small delay for transition effect
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false)
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu])

  const toggleUserMenu = () => setShowUserMenu(!showUserMenu)

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="floating-navbar rounded-2xl transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <GameController size={20} weight="duotone" className="text-cyber-mint-500" />
            <span className="text-lg font-bold text-electric-slate-900 hidden sm:block">
              GiveMeMoney
            </span>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                disabled={isTransitioning}
                className={`nav-item group relative flex items-center gap-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                  item.isActive
                    ? 'bg-gradient-to-r from-cyber-mint-500 to-cyber-mint-600 text-white shadow-lg px-4 py-3 nav-item-active'
                    : 'text-electric-slate-600 hover:bg-electric-slate-50 hover:text-electric-slate-900 p-3 nav-item-inactive'
                }`}
                aria-label={item.label}
              >
                <item.icon
                  size={20}
                  weight="duotone"
                  className="transition-transform duration-200"
                />

                {/* Show text only for active item with smooth transition */}
                <span
                  className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ease-out overflow-hidden ${
                    item.isActive
                      ? 'opacity-100 w-auto max-w-[120px] ml-1'
                      : 'opacity-0 w-0 max-w-0 ml-0'
                  }`}
                  style={{
                    transitionProperty: 'opacity, width, margin-left, max-width',
                    transitionDelay: item.isActive ? '50ms' : '0ms'
                  }}
                >
                  {item.label}
                </span>

                {/* Tooltip for inactive items */}
                {!item.isActive && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-electric-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-electric-slate-900"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Status + User */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Live Status */}
            <div className="hidden sm:flex items-center gap-2">
              <CircleDashed
                size={8}
                weight="fill"
                className={isLive ? 'text-error-rose animate-pulse' : 'text-electric-slate-400'}
              />
              <span className={`text-sm font-medium ${isLive ? 'text-error-rose' : 'text-electric-slate-600'}`}>
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>

            {/* User Menu - Following navbar-1.tsx pattern */}
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            ) : user ? (
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleUserMenu()
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <User size={16} weight="duotone" />
                  <span className="text-sm font-medium">{user.name || 'User'}</span>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Meu Perfil
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Configurações
                      </a>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <a
                  href="/login"
                  className="px-4 py-2 text-sm text-electric-slate-800 hover:text-cyber-mint-700 transition-colors font-medium cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-cyber-mint-600 hover:bg-cyber-mint-700 rounded-full transition-colors shadow-cyber-sm cursor-pointer"
                >
                  Sign Up
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}