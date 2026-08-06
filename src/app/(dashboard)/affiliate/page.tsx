import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Copy, TrendingUp, Users, DollarSign, Share2 } from 'lucide-react'
import { TIER_HIERARCHY } from '@/types'

export default async function AffiliatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const tierLevel = TIER_HIERARCHY[profile?.tier ?? 'free']

  if (tierLevel < 4) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-6">
          <Share2 className="w-8 h-8 text-[var(--color-gold)]" />
        </div>
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-3">Affiliate Program</h2>
        <p className="text-[var(--color-mist)] mb-6">
          The affiliate program is available to <strong className="text-[var(--color-gold)]">Kingdom Builder</strong> members.
          Upgrade to earn 30% commission on every referral.
        </p>
        <a href="/settings#upgrade"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity">
          Upgrade to Kingdom Builder — $49/mo
        </a>
      </div>
    )
  }

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: referrals } = await supabase
    .from('affiliate_referrals')
    .select('*, profiles(full_name, email, tier, created_at)')
    .eq('affiliate_id', affiliate?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(20)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://agm.church'
  const referralLink = `${appUrl}/register?ref=${affiliate?.code ?? profile?.affiliate_code}`

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-1">Affiliate Dashboard</h2>
        <p className="text-[var(--color-mist)]">Earn 30% commission on every subscription you refer.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Referrals', value: affiliate?.total_referrals ?? 0, icon: Users, color: 'text-[var(--color-spirit-light)]' },
          { label: 'Active Members', value: affiliate?.active_referrals ?? 0, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Total Earned', value: `$${affiliate?.total_earnings_usd?.toFixed(2) ?? '0.00'}`, icon: DollarSign, color: 'text-[var(--color-gold)]' },
          { label: 'Pending Payout', value: `$${affiliate?.pending_payout_usd?.toFixed(2) ?? '0.00'}`, icon: DollarSign, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-2xl p-5">
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">{stat.value}</div>
            <div className="text-[var(--color-mist)] text-xs mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Referral Link */}
      <div className="bg-card rounded-2xl p-6 mb-8 border border-[var(--color-gold)]/15">
        <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-3">Your Referral Link</h3>
        <div className="flex gap-3">
          <div className="flex-1 px-4 py-3 bg-[var(--color-ink)] rounded-xl text-[var(--color-mist)] text-sm font-mono truncate border border-white/5">
            {referralLink}
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(referralLink)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/20 transition-all shrink-0"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
        <p className="text-[var(--color-mist)] text-xs mt-3">
          Share this link. You earn <strong className="text-[var(--color-gold)]">30%</strong> of every subscription payment for as long as they stay members.
        </p>
      </div>

      {/* Referrals Table */}
      <div className="bg-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-display text-lg font-bold text-[var(--color-pearl)]">Your Referrals</h3>
        </div>
        {(referrals ?? []).length === 0 ? (
          <div className="p-10 text-center text-[var(--color-mist)] text-sm">
            No referrals yet. Share your link to start earning!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Member', 'Plan', 'Commission', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referrals!.map((ref) => (
                  <tr key={ref.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-6 py-4 text-[var(--color-pearl)]">
                      {(ref as any).profiles?.full_name ?? (ref as any).profiles?.email ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] capitalize">
                        {(ref as any).profiles?.tier ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-gold)] font-semibold">
                      ${ref.commission_usd?.toFixed(2) ?? '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ref.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                        ref.status === 'confirmed' ? 'bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]' :
                        'bg-amber-500/10 text-amber-400'
                      }`}>{ref.status}</span>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-mist)]">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
