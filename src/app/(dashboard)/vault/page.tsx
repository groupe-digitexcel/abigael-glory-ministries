import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Play, Lock, Clock, Search } from 'lucide-react'
import { TIER_HIERARCHY, type SubscriptionTier } from '@/types'

export default async function VaultPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; series?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  const userTier = (profile?.tier ?? 'free') as SubscriptionTier
  const userTierLevel = TIER_HIERARCHY[userTier]

  const params = await searchParams
  const query = params.q ?? ''
  const seriesFilter = params.series ?? ''

  let sermonsQuery = supabase
    .from('sermons')
    .select('id, title, slug, speaker, series_name, duration_seconds, thumbnail_url, min_tier, tags, published_at, ai_summary')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (query) sermonsQuery = sermonsQuery.ilike('title', `%${query}%`)
  if (seriesFilter) sermonsQuery = sermonsQuery.eq('series_name', seriesFilter)

  const { data: sermons } = await sermonsQuery.limit(30)
  const { data: seriesRows } = await supabase
    .from('sermons')
    .select('series_name')
    .eq('status', 'published')
    .not('series_name', 'is', null)

  const seriesList = [...new Set((seriesRows ?? []).map(r => r.series_name).filter(Boolean))]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-1">Sermon Vault</h2>
        <p className="text-[var(--color-mist)]">Every word, archived and searchable.</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form className="flex-1 relative" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search sermons..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 text-sm"
          />
        </form>
        <form method="GET">
          <select
            name="series"
            defaultValue={seriesFilter}
            onChange={(e) => (e.target.form as HTMLFormElement).submit()}
            className="px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-mist)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50 min-w-[160px]"
          >
            <option value="">All Series</option>
            {seriesList.map(s => (
              <option key={s} value={s ?? ''}>{s}</option>
            ))}
          </select>
        </form>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(sermons ?? []).map((sermon) => {
          const hasAccess = userTierLevel >= TIER_HIERARCHY[sermon.min_tier as SubscriptionTier]
          const mins = sermon.duration_seconds ? Math.floor(sermon.duration_seconds / 60) : null

          return (
            <Link
              key={sermon.id}
              href={hasAccess ? `/vault/${sermon.id}` : '/settings#upgrade'}
              className="group block"
            >
              <div className="bg-card bg-card-hover rounded-2xl overflow-hidden h-full">
                {/* Thumb */}
                <div className="relative aspect-video bg-gradient-to-br from-[var(--color-spirit)]/20 to-[var(--color-gold)]/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {hasAccess ? (
                      <div className="w-12 h-12 rounded-full bg-[var(--color-gold)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[var(--color-gold)]/30">
                        <Play className="w-4 h-4 text-[var(--color-night)] ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-[var(--color-mist)]" />
                      </div>
                    )}
                  </div>
                  {!hasAccess && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[var(--color-spirit)] text-white text-xs font-semibold">
                      Upgrade
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-4">
                  {sermon.series_name && (
                    <p className="text-[var(--color-gold)] text-xs font-medium mb-1">{sermon.series_name}</p>
                  )}
                  <h3 className="font-display text-base font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-2 mb-2">
                    {sermon.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[var(--color-mist)]">
                    <span>{sermon.speaker}</span>
                    {mins && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{mins} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {(!sermons || sermons.length === 0) && (
        <div className="text-center py-20 text-[var(--color-mist)]">
          <p className="text-lg">No sermons found.</p>
          <Link href="/vault" className="text-[var(--color-gold)] text-sm mt-2 block hover:underline">Clear filters</Link>
        </div>
      )}
    </div>
  )
}
