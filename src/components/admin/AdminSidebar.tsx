'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Crown, LayoutDashboard, Users, CreditCard, BookOpen,
  GraduationCap, DollarSign, Share2, BarChart3,
  Mail, Settings, FileText, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Sermons', href: '/admin/sermons', icon: BookOpen },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { label: 'Donations', href: '/admin/donations', icon: DollarSign },
  { label: 'Affiliates', href: '/admin/affiliates', icon: Share2 },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Broadcast', href: '/admin/broadcast', icon: Mail },
  { label: 'Content', href: '/admin/content', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface Props {
  profile: { role: string; full_name: string | null; email: string } | null
}

export function AdminSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r border-white/5 bg-[var(--color-deep)] shrink-0">
      <div className="p-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-ember)] to-[var(--color-gold)] flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-ember)] uppercase tracking-wide">Admin</p>
            <p className="text-[10px] text-[var(--color-mist)]">AGM Control Center</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-0.5 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[var(--color-ember)]/10 text-[var(--color-ember)] border border-[var(--color-ember)]/20'
                  : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)] hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-mist)] hover:text-[var(--color-ember)] hover:bg-[var(--color-ember)]/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
