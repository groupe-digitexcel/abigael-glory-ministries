import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Sparkles } from 'lucide-react'

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        {post.cover_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-[var(--color-ink)]">
            <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {post.category && <p className="text-[var(--color-gold)] text-sm font-medium mb-2">{post.category}</p>}
        <h1 className="font-display text-3xl lg:text-4xl font-bold text-[var(--color-pearl)] mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-[var(--color-mist)] text-sm mb-10 pb-6 border-b border-white/5">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}</span>
          {post.read_time_minutes && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.read_time_minutes} min read</span>
            </>
          )}
          {post.ai_assisted && (
            <span className="flex items-center gap-1 text-[var(--color-spirit-light)] text-xs">
              <Sparkles className="w-3 h-3" /> AI-assisted
            </span>
          )}
        </div>

        <div className="prose prose-invert text-[var(--color-mist)] leading-relaxed whitespace-pre-line mb-10">
          {post.content}
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)]">{tag}</span>
            ))}
          </div>
        )}

        <div className="text-center pt-8 border-t border-white/5">
          <Link href="/blog" className="text-[var(--color-gold)] text-sm hover:underline">← Back to Blog</Link>
        </div>
      </div>
    </div>
  )
}
