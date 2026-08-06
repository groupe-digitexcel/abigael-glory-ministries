import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, GraduationCap, Heart, TrendingUp, ArrowRight, Play } from 'lucide-react'
import { PRICING_TIERS, TIER_HIERARCHY } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const tier = profile?.tier ?? 'free'
  const tierLevel = TIER_HIERARCHY[tier]
  const tierInfo = PRICING_TIERS.find(t => t.id === tier)

  const [{ count: prayerCount }, { data: recentSermons }] = await Promise.all([
    supabase.from('prayer_requests').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('sermons').select('id, title, speaker, duration_seconds, thumbnail_url, min_tier')
      .eq('status', 'published').order('published_at', { ascending: false }).limit(3),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Friend'

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-1">
          Welcome back, {firstName} 👋
        </h2>
        <p className="text-[var(--color-mist)]">Continue your journey in faith.</p>
      </div>

      {/* Upgrade Banner */}
      {tierLevel < 4 && (
        <div className="mb-8 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(107,92,231,0.08))', border: '1px solid rgba(212,168,67,0.15)' }}>
          <div>
            <p className="text-[var(--color-gold)] font-semibold">You're on the {tierInfo?.name} plan</p>
            <p className="text-[var(--color-mist)] text-sm mt-0.5">Upgrade to unlock more sermons, courses, and community.</p>
          </div>
          <Link href="/settings#upgrade"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
            Upgrade Plan
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Sermons Watched', value: '—', icon: BookOpen, color: 'text-[var(--color-gold)]' },
          { label: 'Courses Started', value: '—', icon: GraduationCap, color: 'text-[var(--color-spirit-light)]' },
          { label: 'Prayers Submitted', value: String(prayerCount ?? 0), icon: Heart, color: 'text-pink-400' },
          { label: 'Days Streak', value: '1', icon: TrendingUp, color: 'text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">{stat.value}</div>
            <div className="text-[var(--color-mist)] text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Sermons */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-bold text-[var(--color-pearl)]">Latest Sermons</h3>
          <Link href="/vault" className="flex items-center gap-1 text-[var(--color-gold)] text-sm hover:underline">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {(recentSermons ?? []).map((sermon) => {
            const hasAccess = TIER_HIERARCHY[tier] >= TIER_HIERARCHY[sermon.min_tier as keyof typeof TIER_HIERARCHY]
            const mins = sermon.duration_seconds ? Math.floor(sermon.duration_seconds / 60) : null
            return (
              <Link key={sermon.id} href={`/vault/${sermon.id}`}
                className="group flex items-center gap-4 bg-card bg-card-hover rounded-2xl p-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-spirit)]/20 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-[var(--color-spirit-light)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--color-pearl)] font-medium text-sm group-hover:text-[var(--color-gold)] transition-colors truncate">
                    {sermon.title}
                  </p>
                  <p className="text-[var(--color-mist)] text-xs mt-0.5">{sermon.speaker}{mins ? ` · ${mins} min` : ''}</p>
                </div>
                {!hasAccess && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-[var(--color-spirit)]/15 text-[var(--color-spirit-light)] shrink-0">
                    Upgrade
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Submit Prayer', href: '/prayer', icon: Heart, color: 'from-pink-500/20 to-rose-500/10' },
          { label: 'Browse Courses', href: '/courses', icon: GraduationCap, color: 'from-[var(--color-spirit)]/20 to-purple-500/10' },
          { label: 'Giving History', href: '/giving', icon: TrendingUp, color: 'from-[var(--color-gold)]/20 to-amber-500/10' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className={`group flex items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-white/5 hover:border-[var(--color-gold)]/20 transition-all`}>
            <item.icon className="w-5 h-5 text-[var(--color-mist)] group-hover:text-[var(--color-gold)] transition-colors" />
            <span className="text-[var(--color-mist)] text-sm font-medium group-hover:text-[var(--color-pearl)] transition-colors">
              {item.label}
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--color-mist)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  )
}
