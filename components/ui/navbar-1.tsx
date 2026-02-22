"use client"

import { useState, useEffect } from "react"
import { CurrencyCircleDollar } from "@phosphor-icons/react"
import Link from "next/link"

const Navbar1 = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`border-b transition-all duration-200 ${
          isScrolled
            ? "border-gray-200 bg-white/80 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyber-mint-500 text-white">
              <CurrencyCircleDollar size={20} weight="fill" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              GiveMeMoney
            </span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#00A896" }}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export { Navbar1 }
