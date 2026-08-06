import { createClient } from '@/lib/supabase/server'
import { ApprovePayoutButton } from '@/components/admin/ApprovePayoutButton'

export default async function AdminAffiliatesPage() {
  const supabase = await createClient()

  const { data: affiliates, count } = await supabase
    .from('affiliates')
    .select('*, profiles(full_name, email)', { count: 'exact' })
    .order('total_earnings_usd', { ascending: false })

  const totalPending = (affiliates ?? []).reduce((sum, a) => sum + (a.pending_payout_usd ?? 0), 0)
  const totalPaid = (affiliates ?? []).reduce((sum, a) => sum + (a.paid_out_usd ?? 0), 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Affiliates</h2>
        <p className="text-[var(--color-mist)] mt-1">{count ?? 0} Kingdom Builder affiliates</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-amber-400">${totalPending.toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Pending Payouts</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-green-400">${totalPaid.toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Total Paid Out</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">
            {(affiliates ?? []).reduce((sum, a) => sum + a.total_referrals, 0)}
          </div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Total Referrals</div>
        </div>
      </div>

      <div className="bg-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Affiliate', 'Code', 'Referrals', 'Total Earned', 'Pending', 'Paid Out', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(affiliates ?? []).map((a) => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">
                    {(a as any).profiles?.full_name ?? (a as any).profiles?.email ?? '—'}
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)] font-mono text-xs">{a.code}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{a.total_referrals}</td>
                  <td className="px-5 py-4 text-[var(--color-gold)] font-semibold">${a.total_earnings_usd.toFixed(2)}</td>
                  <td className="px-5 py-4 text-amber-400 font-medium">${a.pending_payout_usd.toFixed(2)}</td>
                  <td className="px-5 py-4 text-green-400">${a.paid_out_usd.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${
                      a.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <ApprovePayoutButton affiliateId={a.id} pendingAmount={a.pending_payout_usd} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(!affiliates || affiliates.length === 0) && (
        <p className="text-center text-[var(--color-mist)] py-16">No affiliates yet.</p>
      )}
    </div>
  )
}
