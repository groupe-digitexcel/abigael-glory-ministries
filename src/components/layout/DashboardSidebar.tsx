'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Crown, LayoutDashboard, BookOpen, GraduationCap,
  Heart, DollarSign, Share2, Settings, LogOut, Lock
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'
import { TIER_HIERARCHY } from '@/types'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, minTier: 0 },
  { label: 'Sermon Vault', href: '/vault', icon: BookOpen, minTier: 0 },
  { label: 'Courses', href: '/courses', icon: GraduationCap, minTier: 1 },
  { label: 'Prayer', href: '/prayer', icon: Heart, minTier: 0 },
  { label: 'Giving', href: '/giving', icon: DollarSign, minTier: 0 },
  { label: 'Affiliate', href: '/affiliate', icon: Share2, minTier: 4 },
  { label: 'Settings', href: '/settings', icon: Settings, minTier: 0 },
]

const TIER_LABELS: Record<string, string> = {
  free: 'Seeker',
  believer: 'Believer',
  disciple: 'Disciple',
  partner: 'Partner',
  kingdom_builder: 'Kingdom Builder',
}

interface Props {
  profile: Profile | null
}

export function DashboardSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const userTierLevel = TIER_HIERARCHY[profile?.tier ?? 'free']

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-[var(--color-deep)] shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center">
            <Crown className="w-4 h-4 text-[var(--color-night)]" />
          </div>
          <span className="font-display font-bold text-[var(--color-gold)] text-sm">AGM</span>
        </Link>
      </div>

      {/* Profile pill */}
      {profile && (
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--color-ink)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center text-[var(--color-night)] font-bold text-sm shrink-0">
              {(profile.full_name ?? profile.email)[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[var(--color-pearl)] text-sm font-medium truncate">
                {profile.full_name ?? 'Member'}
              </p>
              <p className="text-[var(--color-gold)] text-xs">{TIER_LABELS[profile.tier]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const locked = item.minTier > userTierLevel
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={locked ? '/settings#upgrade' : item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20'
                  : locked
                  ? 'text-[var(--color-slate)] cursor-not-allowed'
                  : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)] hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {locked && <Lock className="w-3 h-3 opacity-50" />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-mist)] hover:text-[var(--color-ember)] hover:bg-[var(--color-ember)]/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
