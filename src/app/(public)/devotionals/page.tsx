import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Sparkles } from 'lucide-react'

export default async function DevotionalsPage() {
  const supabase = await createClient()
  const { data: devotionals } = await supabase
    .from('devotionals')
    .select('id, title, slug, scripture, category, ai_generated, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">Devotionals</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">Daily Bread</h1>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto">
            Short, faith-filled readings to start your day rooted in the Word.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {(devotionals ?? []).map((d) => (
            <Link key={d.id} href={`/devotionals/${d.slug}`} className="group block">
              <div className="bg-card bg-card-hover rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[var(--color-gold)]" />
                  </div>
                  {d.ai_generated && (
                    <span className="flex items-center gap-1 text-[10px] text-[var(--color-spirit-light)]">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors mb-2">
                  {d.title}
                </h3>
                <p className="text-[var(--color-mist)] text-sm mb-3">{d.scripture}</p>
                <p className="text-[var(--color-slate)] text-xs mt-auto">
                  {d.published_at ? new Date(d.published_at).toLocaleDateString() : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {(!devotionals || devotionals.length === 0) && (
          <p className="text-center text-[var(--color-mist)] py-16">No devotionals published yet.</p>
        )}
      </div>
    </div>
  )
}
