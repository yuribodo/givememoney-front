'use client'

import { useState, useEffect, useRef } from 'react'
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
import { useAuth } from '@/features/auth'

interface FloatingNavbarProps {
  isLive?: boolean
}

export function FloatingNavbar({ isLive = false }: FloatingNavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [blobStyle, setBlobStyle] = useState({ left: 0, width: 0, opacity: 0 })

  const navContainerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

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

  // Calculate blob position and size
  const updateBlobPosition = (targetLabel: string | null) => {
    if (!navContainerRef.current) return

    const target = targetLabel || navigationItems.find(item => item.isActive)?.label
    if (!target) return

    const targetButton = buttonRefs.current[target]
    if (!targetButton) return

    const containerRect = navContainerRef.current.getBoundingClientRect()
    const buttonRect = targetButton.getBoundingClientRect()

    setBlobStyle({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
      opacity: 1
    })
  }

  // Handle smooth transitions between sections
  const handleNavigation = (href: string) => {
    setIsTransitioning(true)
    setTimeout(() => {
      window.location.href = href
    }, 150) // Small delay for transition effect
  }

  // Initialize blob position
  useEffect(() => {
    updateBlobPosition(null)
  }, [pathname])

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
          <div ref={navContainerRef} className="relative flex items-center gap-1">
            {/* Morphing Background Blob */}
            <div
              className="absolute top-0 bg-gradient-to-r from-cyber-mint-500 to-cyber-mint-600 rounded-xl shadow-lg pointer-events-none"
              style={{
                left: blobStyle.left,
                width: blobStyle.width,
                height: '48px',
                opacity: blobStyle.opacity,
                transition: 'all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: 1,
                borderRadius: '12px'
              }}
            />

            {navigationItems.map((item) => {
              const isActive = item.isActive
              const isHovered = hoveredItem === item.label
              const shouldShowBlobOnThisItem = hoveredItem ? isHovered : isActive

              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    buttonRefs.current[item.label] = el
                  }}
                  onClick={() => handleNavigation(item.href)}
                  disabled={isTransitioning}
                  onMouseEnter={() => {
                    setHoveredItem(item.label)
                    updateBlobPosition(item.label)
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null)
                    updateBlobPosition(null)
                  }}
                  className="relative flex items-center px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer group"
                  style={{ zIndex: 2 }}
                  aria-label={item.label}
                >
                  <item.icon
                    size={20}
                    weight="duotone"
                    className={`transition-all duration-500 ease-out ${
                      shouldShowBlobOnThisItem
                        ? 'text-white scale-110 rotate-6'
                        : 'text-electric-slate-700 hover:text-electric-slate-900 hover:scale-105 hover:rotate-3'
                    }`}
                  />

                  <span
                    className={`font-medium text-sm whitespace-nowrap ml-2 transition-all duration-400 ease-out opacity-100 translate-x-0 ${
                      shouldShowBlobOnThisItem
                        ? 'text-white'
                        : 'text-electric-slate-700 hover:text-electric-slate-900'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
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