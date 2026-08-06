import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Lock, Clock, User, BookOpen } from 'lucide-react'

export default async function SermonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!sermon) notFound()

  const isFree = sermon.min_tier === 'free'
  const mins = sermon.duration_seconds ? Math.floor(sermon.duration_seconds / 60) : null

  // Increment view count (fire and forget)
  supabase.from('sermons').update({ view_count: (sermon.view_count ?? 0) + 1 }).eq('id', id)

  if (!isFree) {
    return (
      <div className="min-h-dvh pt-24 pb-16 flex items-center justify-center relative z-10">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-spirit)]/15 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[var(--color-spirit-light)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-3">{sermon.title}</h1>
          <p className="text-[var(--color-mist)] mb-6">
            This sermon is available to members. Sign up free or upgrade your plan to watch.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
              Join Free
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-xl border border-white/10 text-[var(--color-pearl)] font-medium text-sm hover:border-[var(--color-gold)]/30 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-3xl">
        {/* Video */}
        <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-[var(--color-ink)]">
          {sermon.youtube_id ? (
            <iframe
              src={`https://www.youtube.com/embed/${sermon.youtube_id}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={sermon.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-mist)]">
              Video coming soon
            </div>
          )}
        </div>

        {sermon.series_name && <p className="text-[var(--color-gold)] text-sm font-medium mb-2">{sermon.series_name}</p>}
        <h1 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-4">{sermon.title}</h1>

        <div className="flex items-center gap-5 text-[var(--color-mist)] text-sm mb-6">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{sermon.speaker}</span>
          {mins && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{mins} min</span>}
          {sermon.scripture_reference && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{sermon.scripture_reference}</span>}
        </div>

        {sermon.description && (
          <div className="bg-card rounded-2xl p-6 mb-6">
            <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2">About this Sermon</h3>
            <p className="text-[var(--color-mist)] leading-relaxed">{sermon.description}</p>
          </div>
        )}

        {sermon.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {sermon.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">{tag}</span>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-[var(--color-gold)]/10 to-[var(--color-spirit)]/10 border border-[var(--color-gold)]/15 rounded-2xl p-6 text-center">
          <p className="text-[var(--color-pearl)] font-medium mb-3">Want access to 500+ more sermons like this?</p>
          <Link href="/register" className="inline-flex px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
            Join Free
          </Link>
        </div>
      </div>
    </div>
  )
}
