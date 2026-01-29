"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { CaretDown, ArrowRight } from "@phosphor-icons/react"
import { useAuth } from "@/features/auth"
import Link from "next/link"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isLoading, logout } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuOpen) setUserMenuOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [userMenuOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <nav
          className="relative max-w-5xl mx-auto flex items-center justify-between h-14 px-4 rounded-full transition-all duration-300"
          style={{
            background: isScrolled
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              GiveMeMoney
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 z-10">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-20 h-8 rounded-full animate-pulse bg-gray-100" />
              </div>
            ) : user ? (
              <div className="relative">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenuOpen(!userMenuOpen)
                  }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors hover:bg-gray-100"
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-700">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                  <CaretDown
                    size={12}
                    weight="bold"
                    className="text-gray-400 transition-transform duration-200"
                    style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-44 py-1 rounded-xl bg-white border border-gray-200 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                  className="hidden sm:flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </Link>
                <Link href="/register">
                  <motion.button
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} weight="bold" />
                  </motion.button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1">
                <motion.span
                  className="w-4 h-[1.5px] bg-gray-800 rounded-full"
                  animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 2.5 : 0 }}
                />
                <motion.span
                  className="w-4 h-[1.5px] bg-gray-800 rounded-full"
                  animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -2.5 : 0 }}
                />
              </div>
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-white/95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative h-full flex flex-col justify-center px-6 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-gray-900 bg-gray-100 rounded-xl"
                      onClick={toggleMenu}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-br from-cyber-mint-500 to-cyber-mint-700">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); toggleMenu() }}
                      className="w-full py-3 text-base font-semibold text-gray-500 border border-gray-200 rounded-xl"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full py-3 text-base font-semibold text-gray-900 bg-gray-100 rounded-xl"
                      onClick={toggleMenu}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-white bg-gray-900 rounded-xl"
                      onClick={toggleMenu}
                    >
                      Get Started
                      <ArrowRight size={16} weight="bold" />
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
