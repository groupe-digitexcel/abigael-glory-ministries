import { createClient } from '@/lib/supabase/server'
import { Users, CreditCard, DollarSign, BookOpen, Heart, Share2, TrendingUp, AlertCircle } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()

  const [
    { count: totalUsers },
    { count: newUsersThisMonth },
    { count: activeSubscriptions },
    { count: totalSermons },
    { count: totalPrayers },
    { count: activeAffiliates },
    { data: donations },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sermons').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('prayer_requests').select('*', { count: 'exact', head: true }),
    supabase.from('affiliates').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('donations').select('amount_usd').eq('status', 'completed').gte('created_at', startOfMonth),
    supabase.from('profiles').select('id, full_name, email, tier, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const monthlyDonations = (donations ?? []).reduce((sum, d) => sum + (d.amount_usd ?? 0), 0)

  const STATS = [
    { label: 'Total Members', value: totalUsers ?? 0, icon: Users, color: 'text-[var(--color-spirit-light)]', bg: 'bg-[var(--color-spirit)]/10' },
    { label: 'New This Month', value: newUsersThisMonth ?? 0, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Active Subscribers', value: activeSubscriptions ?? 0, icon: CreditCard, color: 'text-[var(--color-gold)]', bg: 'bg-[var(--color-gold)]/10' },
    { label: 'Monthly Donations', value: `$${monthlyDonations.toFixed(0)}`, icon: DollarSign, color: 'text-[var(--color-gold)]', bg: 'bg-[var(--color-gold)]/10' },
    { label: 'Published Sermons', value: totalSermons ?? 0, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Prayer Requests', value: totalPrayers ?? 0, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Active Affiliates', value: activeAffiliates ?? 0, icon: Share2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Alerts', value: 0, icon: AlertCircle, color: 'text-[var(--color-ember)]', bg: 'bg-[var(--color-ember)]/10' },
  ]

  const TIER_COLORS: Record<string, string> = {
    free: 'bg-white/10 text-[var(--color-mist)]',
    believer: 'bg-blue-500/10 text-blue-400',
    disciple: 'bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]',
    partner: 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]',
    kingdom_builder: 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]',
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-1">Admin Overview</h2>
        <p className="text-[var(--color-mist)]">Real-time ministry metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-[var(--color-mist)] text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="bg-card rounded-2xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-[var(--color-pearl)]">Recent Members</h3>
          <a href="/admin/users" className="text-[var(--color-gold)] text-sm hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Email', 'Plan', 'Joined'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentUsers ?? []).map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-6 py-4 text-[var(--color-pearl)] font-medium">{u.full_name ?? '—'}</td>
                  <td className="px-6 py-4 text-[var(--color-mist)]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${TIER_COLORS[u.tier] ?? 'bg-white/5 text-[var(--color-mist)]'}`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-mist)]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Upload Sermon', href: '/admin/sermons/new', color: 'border-[var(--color-gold)]/20 hover:border-[var(--color-gold)]/40' },
          { label: 'Send Broadcast', href: '/admin/broadcast', color: 'border-[var(--color-spirit)]/20 hover:border-[var(--color-spirit)]/40' },
          { label: 'Manage Affiliates', href: '/admin/affiliates', color: 'border-[var(--color-ember)]/20 hover:border-[var(--color-ember)]/40' },
        ].map((action) => (
          <a key={action.href} href={action.href}
            className={`p-5 rounded-2xl border bg-card text-center font-medium text-[var(--color-pearl)] text-sm transition-all ${action.color} hover:bg-white/5`}>
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}
