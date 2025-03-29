'use client'

import { usePathname } from 'next/navigation'
import Navbar from './navbar'

export default function NavbarWrapper() {
  const pathname = usePathname()

  // Don't render navbar on chatbot pages
  if (pathname?.startsWith('/chatbots/')) {
    return null
  }

  return (
    <div className={`navbar-wrapper ${pathname === '/' ? 'home-navbar' : 'default-navbar'}`}>
      <Navbar />
    </div>
  )
} 