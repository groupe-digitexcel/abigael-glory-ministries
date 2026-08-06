import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, User, BookOpen, Lock } from 'lucide-react'
import { TIER_HIERARCHY, type SubscriptionTier } from '@/types'

export default async function VaultSermonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  const userTier = (profile?.tier ?? 'free') as SubscriptionTier

  const { data: sermon } = await supabase.from('sermons').select('*').eq('id', id).eq('status', 'published').single()
  if (!sermon) notFound()

  const hasAccess = TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[sermon.min_tier as SubscriptionTier]
  const mins = sermon.duration_seconds ? Math.floor(sermon.duration_seconds / 60) : null

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-spirit)]/15 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-[var(--color-spirit-light)]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-3">{sermon.title}</h1>
        <p className="text-[var(--color-mist)] mb-6">
          This sermon requires the <strong className="text-[var(--color-gold)] capitalize">{sermon.min_tier.replace('_', ' ')}</strong> plan or higher.
        </p>
        <Link href="/settings#upgrade" className="px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
          Upgrade Plan
        </Link>
      </div>
    )
  }

  await supabase.from('sermons').update({ view_count: (sermon.view_count ?? 0) + 1 }).eq('id', id)

  return (
    <div className="max-w-3xl mx-auto">
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
          <div className="w-full h-full flex items-center justify-center text-[var(--color-mist)]">Video coming soon</div>
        )}
      </div>

      {sermon.series_name && <p className="text-[var(--color-gold)] text-sm font-medium mb-2">{sermon.series_name}</p>}
      <h1 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-4">{sermon.title}</h1>

      <div className="flex items-center gap-5 text-[var(--color-mist)] text-sm mb-6">
        <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{sermon.speaker}</span>
        {mins && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{mins} min</span>}
        {sermon.scripture_reference && <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{sermon.scripture_reference}</span>}
      </div>

      {sermon.ai_summary && (
        <div className="bg-[var(--color-spirit)]/5 border border-[var(--color-spirit)]/15 rounded-2xl p-6 mb-6">
          <p className="text-[var(--color-spirit-light)] text-xs font-semibold uppercase tracking-wide mb-2">AI Summary</p>
          <p className="text-[var(--color-mist)] leading-relaxed">{sermon.ai_summary}</p>
        </div>
      )}

      {sermon.description && (
        <div className="bg-card rounded-2xl p-6 mb-6">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2">Description</h3>
          <p className="text-[var(--color-mist)] leading-relaxed">{sermon.description}</p>
        </div>
      )}

      {sermon.audio_url && (
        <div className="bg-card rounded-2xl p-6 mb-6">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-3">Audio Download</h3>
          <audio controls className="w-full">
            <source src={sermon.audio_url} type="audio/mpeg" />
          </audio>
        </div>
      )}

      {sermon.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sermon.tags.map((tag: string) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
