'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container-custom py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center font-bold text-lg">
              B
            </div>
            <span className="text-xl font-bold text-primary">BLinkOS</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              href="/marketplace"
              className={`transition-colors ${
                isActive('/marketplace') ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className={`transition-colors ${
                isActive('/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              Dashboard
            </Link>

            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="btn btn-secondary text-sm py-2"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-primary text-sm py-2">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
