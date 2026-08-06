import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, Plus, ArrowRight } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400',
  praying: 'bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]',
  answered: 'bg-green-500/10 text-green-400',
  archived: 'bg-white/5 text-[var(--color-mist)]',
}

export default async function DashboardPrayerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prayers } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">My Prayer Requests</h2>
          <p className="text-[var(--color-mist)] mt-1">Track what you've submitted and what's been answered.</p>
        </div>
        <Link href="/prayer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-spirit)] text-white font-semibold text-sm hover:bg-[var(--color-spirit-light)] transition-colors shrink-0">
          <Plus className="w-4 h-4" /> New Request
        </Link>
      </div>

      {(!prayers || prayers.length === 0) ? (
        <div className="bg-card rounded-2xl p-10 text-center">
          <Heart className="w-10 h-10 text-[var(--color-mist)] mx-auto mb-4" />
          <p className="text-[var(--color-mist)] mb-4">You haven't submitted a prayer request yet.</p>
          <Link href="/prayer" className="inline-flex items-center gap-2 text-[var(--color-gold)] text-sm hover:underline">
            Submit your first request <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {prayers.map((prayer) => (
            <div key={prayer.id} className="bg-card rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">{prayer.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium shrink-0 ${STATUS_COLORS[prayer.status]}`}>
                  {prayer.status}
                </span>
              </div>
              <p className="text-[var(--color-mist)] text-sm leading-relaxed mb-3">{prayer.content}</p>
              <div className="flex items-center justify-between text-xs text-[var(--color-slate)]">
                <span>{new Date(prayer.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{prayer.prayer_count} people praying</span>
              </div>
              {prayer.answered_testimony && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-green-400 text-xs font-semibold mb-1">Testimony</p>
                  <p className="text-[var(--color-mist)] text-sm">{prayer.answered_testimony}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
