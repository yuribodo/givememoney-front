'use client'

import { usePathname } from 'next/navigation'
import { Navbar1 } from "@/components/ui/navbar-1"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Don't show navbar on dashboard and overlay pages
  const hiddenPaths = ['/dashboard', '/overlay']
  const shouldHideNavbar = hiddenPaths.some(path => pathname.startsWith(path))

  if (shouldHideNavbar) {
    return null
  }

  return <Navbar1 />
}