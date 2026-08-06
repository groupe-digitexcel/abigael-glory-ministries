import { createClient } from '@/lib/supabase/server'

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-500/10 text-green-400',
  pending: 'bg-amber-500/10 text-amber-400',
  failed: 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]',
  refunded: 'bg-white/5 text-[var(--color-mist)]',
}

export default async function AdminDonationsPage() {
  const supabase = await createClient()

  const { data: donations, count } = await supabase
    .from('donations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const totalCompleted = (donations ?? [])
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount_usd, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Donations</h2>
        <p className="text-[var(--color-mist)] mt-1">{count ?? 0} total donations recorded</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-gold)]">${totalCompleted.toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Total Completed</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">
            {(donations ?? []).filter(d => d.status === 'completed').length}
          </div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Completed Gifts</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">
            {(donations ?? []).filter(d => d.is_recurring).length}
          </div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Recurring Donors</div>
        </div>
      </div>

      <div className="bg-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Donor', 'Amount', 'Purpose', 'Method', 'Status', 'Recurring', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(donations ?? []).map((d) => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">{d.donor_name ?? 'Anonymous'}</td>
                  <td className="px-5 py-4 text-[var(--color-gold)] font-semibold">${d.amount_usd}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{d.purpose ?? 'General'}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)] capitalize">{d.payment_method}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{d.is_recurring ? 'Yes' : 'No'}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{new Date(d.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
