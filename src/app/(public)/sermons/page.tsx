import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Play, Lock, Clock } from 'lucide-react'

export default async function PublicSermonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params.q ?? ''

  let sermonsQuery = supabase
    .from('sermons')
    .select('id, title, speaker, series_name, duration_seconds, min_tier, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (query) sermonsQuery = sermonsQuery.ilike('title', `%${query}%`)

  const { data: sermons } = await sermonsQuery.limit(30)

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">Sermon Library</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">
            Fresh Word, Every Week
          </h1>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto">
            Free sermons to begin your journey. Sign up for full access to the entire library.
          </p>
        </div>

        <form className="max-w-md mx-auto mb-12" method="GET">
          <input name="q" defaultValue={query} placeholder="Search sermons..."
            className="w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 text-sm" />
        </form>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(sermons ?? []).map((sermon) => {
            const isFree = sermon.min_tier === 'free'
            const mins = sermon.duration_seconds ? Math.floor(sermon.duration_seconds / 60) : null
            return (
              <Link key={sermon.id} href={isFree ? `/sermons/${sermon.id}` : '/register'} className="group block">
                <div className="bg-card bg-card-hover rounded-2xl overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-[var(--color-spirit)]/30 to-[var(--color-gold)]/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isFree ? (
                        <div className="w-14 h-14 rounded-full bg-[var(--color-gold)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[var(--color-gold)]/30">
                          <Play className="w-5 h-5 text-[var(--color-night)] ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[var(--color-mist)]" />
                        </div>
                      )}
                    </div>
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-semibold ${isFree ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'bg-[var(--color-spirit)] text-white'}`}>
                      {isFree ? 'Free' : 'Members Only'}
                    </div>
                  </div>
                  <div className="p-5">
                    {sermon.series_name && <p className="text-[var(--color-gold)] text-xs font-medium mb-1">{sermon.series_name}</p>}
                    <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2 group-hover:text-[var(--color-gold)] transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>
                    <div className="flex items-center justify-between text-[var(--color-mist)] text-xs">
                      <span>{sermon.speaker}</span>
                      {mins && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{mins} min</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {(!sermons || sermons.length === 0) && (
          <p className="text-center text-[var(--color-mist)] py-16">No sermons found.</p>
        )}

        <div className="text-center mt-16">
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity">
            Get Full Library Access — Join Free
          </Link>
        </div>
      </div>
    </div>
  )
}
