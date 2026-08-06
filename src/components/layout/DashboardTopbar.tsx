'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Bell, Crown, BookOpen, GraduationCap, Heart, DollarSign, Share2, Settings, LayoutDashboard } from 'lucide-react'
import type { Profile } from '@/types'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/vault': 'Sermon Vault',
  '/courses': 'Courses',
  '/prayer': 'Prayer',
  '/giving': 'Giving',
  '/affiliate': 'Affiliate',
  '/settings': 'Settings',
}

const MOBILE_NAV = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Sermons', href: '/vault', icon: BookOpen },
  { label: 'Courses', href: '/courses', icon: GraduationCap },
  { label: 'Prayer', href: '/prayer', icon: Heart },
  { label: 'Settings', href: '/settings', icon: Settings },
]

interface Props { profile: Profile | null }

export function DashboardTopbar({ profile }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Dashboard'

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-white/5 bg-[var(--color-night)]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[var(--color-mist)] hover:text-[var(--color-pearl)] p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="font-display text-lg font-bold text-[var(--color-pearl)]">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-[var(--color-mist)] hover:text-[var(--color-pearl)] transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
          </button>
          <Link
            href="/settings"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center text-[var(--color-night)] font-bold text-sm"
          >
            {(profile?.full_name ?? profile?.email ?? 'U')[0]?.toUpperCase()}
          </Link>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-0 left-0 h-full w-64 bg-[var(--color-deep)] flex flex-col p-6 gap-1">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-5 h-5 text-[var(--color-gold)]" />
              <span className="font-display font-bold text-[var(--color-gold)]">AGM</span>
            </div>
            {MOBILE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === item.href
                    ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                    : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </aside>
        </div>
      )}
    </>
  )
}
