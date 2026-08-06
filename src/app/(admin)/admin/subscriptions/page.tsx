import { createClient } from '@/lib/supabase/server'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400',
  canceled: 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]',
  past_due: 'bg-amber-500/10 text-amber-400',
  trialing: 'bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]',
  inactive: 'bg-white/5 text-[var(--color-mist)]',
}

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()

  const { data: subscriptions, count } = await supabase
    .from('subscriptions')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const { data: activeSubs } = await supabase
    .from('subscriptions')
    .select('amount_usd, billing_cycle')
    .eq('status', 'active')

  const mrr = (activeSubs ?? []).reduce((sum, s) => {
    const monthly = s.billing_cycle === 'annual' ? s.amount_usd / 12 : s.amount_usd
    return sum + monthly
  }, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Subscriptions</h2>
        <p className="text-[var(--color-mist)] mt-1">{count ?? 0} total subscriptions</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-gold)]">${mrr.toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Monthly Recurring Revenue</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">{activeSubs?.length ?? 0}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Active Subscriptions</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">${(mrr * 12).toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Projected Annual Revenue</div>
        </div>
      </div>

      <div className="bg-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Member', 'Tier', 'Amount', 'Cycle', 'Status', 'Method', 'Renews'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(subscriptions ?? []).map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">
                    {(s as any).profiles?.full_name ?? (s as any).profiles?.email ?? '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] capitalize">
                      {s.tier.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-gold)] font-semibold">${s.amount_usd}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)] capitalize">{s.billing_cycle}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)] capitalize">{s.payment_method}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{new Date(s.current_period_end).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
