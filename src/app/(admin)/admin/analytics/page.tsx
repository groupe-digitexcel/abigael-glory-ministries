import { createClient } from '@/lib/supabase/server'
import { AdminAnalyticsClient } from '@/components/admin/AdminAnalyticsClient'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()

  const now = new Date()
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      label: d.toLocaleString('default', { month: 'short' }),
      start: d.toISOString(),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString(),
    }
  })

  const revenueData = await Promise.all(
    months.map(async (m) => {
      const { data: donations } = await supabase
        .from('donations')
        .select('amount_usd')
        .eq('status', 'completed')
        .gte('created_at', m.start)
        .lte('created_at', m.end)
      const donationTotal = (donations ?? []).reduce((sum, d) => sum + (d.amount_usd ?? 0), 0)
      const { count: newUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', m.start)
        .lte('created_at', m.end)
      return { month: m.label, donations: Math.round(donationTotal), newUsers: newUsers ?? 0 }
    })
  )

  const { data: tierBreakdown } = await supabase
    .from('profiles')
    .select('tier')

  const tierCounts = (tierBreakdown ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.tier] = (acc[p.tier] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Analytics</h2>
        <p className="text-[var(--color-mist)] mt-1">6-month ministry performance overview.</p>
      </div>
      <AdminAnalyticsClient revenueData={revenueData} tierCounts={tierCounts} />
    </div>
  )
}
