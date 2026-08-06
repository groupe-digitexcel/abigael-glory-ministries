import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DollarSign, Heart } from 'lucide-react'

export default async function GivingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const total = (donations ?? [])
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.amount_usd ?? 0), 0)

  const STATUS_COLORS: Record<string, string> = {
    completed: 'bg-green-500/10 text-green-400',
    pending: 'bg-amber-500/10 text-amber-400',
    failed: 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]',
    refunded: 'bg-white/10 text-[var(--color-mist)]',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Giving History</h2>
        <p className="text-[var(--color-mist)] mt-1">Your seeds planted in the Kingdom.</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-2xl p-5">
          <DollarSign className="w-5 h-5 text-[var(--color-gold)] mb-3" />
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">${total.toFixed(2)}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Total Given</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <Heart className="w-5 h-5 text-pink-400 mb-3" />
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">{donations?.length ?? 0}</div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Total Gifts</div>
        </div>
        <div className="bg-card rounded-2xl p-5">
          <DollarSign className="w-5 h-5 text-[var(--color-spirit-light)] mb-3" />
          <div className="font-display text-2xl font-bold text-[var(--color-pearl)]">
            ${(donations ?? []).filter(d => d.is_recurring && d.status === 'completed').reduce((s, d) => s + d.amount_usd, 0).toFixed(2)}
          </div>
          <div className="text-[var(--color-mist)] text-xs mt-1">Recurring Total</div>
        </div>
      </div>

      {/* History */}
      {(!donations || donations.length === 0) ? (
        <div className="bg-card rounded-2xl p-10 text-center">
          <Heart className="w-10 h-10 text-[var(--color-mist)] mx-auto mb-4" />
          <p className="text-[var(--color-mist)] mb-4">You haven't given yet. Every gift, no matter how small, makes an eternal impact.</p>
          <Link href="/donate"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
            Give Now
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Date', 'Amount', 'Purpose', 'Method', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-5 py-4 text-[var(--color-mist)]">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-display font-bold text-[var(--color-gold)]">${d.amount_usd?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-[var(--color-mist)]">{d.purpose ?? 'General Ministry'}</td>
                    <td className="px-5 py-4 text-[var(--color-mist)] capitalize">{d.payment_method}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[d.status] ?? ''}`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/donate"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--color-gold)]/20 text-[var(--color-gold)] font-medium text-sm hover:bg-[var(--color-gold)]/10 transition-all">
          Make Another Gift
        </Link>
      </div>
    </div>
  )
}
