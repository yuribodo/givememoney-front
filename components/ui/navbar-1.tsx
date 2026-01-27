"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CaretDown } from "@phosphor-icons/react"
import { useAuth } from "@/features/auth"
import Link from "next/link"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
  { label: "About", href: "#about" },
]

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen)

  // Track scroll for background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setUserMenuOpen(false)
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [userMenuOpen])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <nav
            className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl transition-all duration-300"
            style={{
              background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${isScrolled ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)'}`,
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                className="w-9 h-9"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="18" fill="url(#navbar-logo-gradient)" />
                  <path d="M18 10L22 14L18 18L14 14L18 10Z" fill="white" fillOpacity="0.9"/>
                  <path d="M18 18L22 22L18 26L14 22L18 18Z" fill="white" fillOpacity="0.6"/>
                  <defs>
                    <linearGradient id="navbar-logo-gradient" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00A896" />
                      <stop offset="1" stopColor="#007569" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
              <span className="hidden sm:block font-display font-bold text-lg text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                GiveMeMoney
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-gray-500 rounded-xl transition-colors duration-200 hover:text-gray-900 hover:bg-black/[0.03]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-9 rounded-xl animate-pulse bg-gray-100" />
                  <div className="w-28 h-10 rounded-xl animate-pulse bg-gray-100" />
                </div>
              ) : user ? (
                <div className="relative">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleUserMenu()
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:bg-gray-50"
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-700">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <CaretDown
                      size={14}
                      weight="bold"
                      className="text-gray-400 transition-transform duration-200"
                      style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden bg-white border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href="/dashboard"
                          className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout()
                            setUserMenuOpen(false)
                          }}
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-500 rounded-xl transition-colors duration-200 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                  <Link href="/register">
                    <motion.button
                      className="px-5 py-2.5 text-sm font-bold text-white rounded-xl bg-cyber-mint-500 hover:bg-cyber-mint-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl hover:bg-black/[0.03] transition-colors"
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <motion.span
                className="w-5 h-0.5 rounded-full bg-gray-800"
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 rounded-full bg-gray-800"
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />

            {/* Menu Content */}
            <motion.div
              className="relative h-full flex flex-col px-6 pt-24 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Close Button */}
              <motion.button
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={toggleMenu}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative w-5 h-5">
                  <span className="absolute top-1/2 left-0 w-5 h-0.5 rounded-full bg-gray-800 rotate-45 -translate-y-1/2" />
                  <span className="absolute top-1/2 left-0 w-5 h-0.5 rounded-full bg-gray-800 -rotate-45 -translate-y-1/2" />
                </div>
              </motion.button>

              {/* Nav Links */}
              <div className="flex-1 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 + 0.15 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-4 text-2xl font-bold text-gray-900 hover:text-cyber-mint-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Auth Buttons */}
              <motion.div
                className="flex flex-col gap-3 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
              >
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-3 py-4 text-base font-bold rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                      onClick={toggleMenu}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-700">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        toggleMenu()
                      }}
                      className="py-4 text-base font-bold rounded-2xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="py-4 text-center text-base font-bold rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="py-4 text-center text-base font-bold text-white rounded-2xl bg-cyber-mint-500 hover:bg-cyber-mint-600 transition-colors"
                      onClick={toggleMenu}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { Navbar1 }
