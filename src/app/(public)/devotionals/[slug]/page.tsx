import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default async function DevotionalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: devotional } = await supabase
    .from('devotionals')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!devotional) notFound()

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-[var(--color-gold)]" />
          </div>
          <p className="text-[var(--color-gold)] text-sm font-semibold mb-2">{devotional.scripture}</p>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-[var(--color-pearl)]">{devotional.title}</h1>
        </div>

        {devotional.scripture_text && (
          <blockquote className="bg-[var(--color-gold)]/5 border-l-2 border-[var(--color-gold)] rounded-r-xl px-6 py-4 mb-8 italic text-[var(--color-pearl)]">
            "{devotional.scripture_text}"
          </blockquote>
        )}

        <div className="prose prose-invert text-[var(--color-mist)] leading-relaxed whitespace-pre-line mb-10">
          {devotional.content}
        </div>

        {devotional.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {devotional.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">{tag}</span>
            ))}
          </div>
        )}

        <div className="text-center pt-8 border-t border-white/5">
          <Link href="/devotionals" className="text-[var(--color-gold)] text-sm hover:underline">
            ← Back to Devotionals
          </Link>
        </div>
      </div>
    </div>
  )
}
