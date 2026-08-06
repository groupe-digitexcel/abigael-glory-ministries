import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, author, cover_url, category, read_time_minutes, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">Blog</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">
            Stories & Reflections
          </h1>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto">
            Insights on faith, ministry, and walking with God in a digital world.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {(posts ?? []).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <div className="bg-card bg-card-hover rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-spirit)]/20 to-[var(--color-gold)]/10" />
                <div className="p-5 flex flex-col flex-1">
                  {post.category && <p className="text-[var(--color-gold)] text-xs font-medium mb-2">{post.category}</p>}
                  <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-[var(--color-mist)] text-sm line-clamp-2 mb-4 flex-1">{post.excerpt}</p>}
                  <div className="flex items-center justify-between text-[var(--color-slate)] text-xs mt-auto">
                    <span>{post.author}</span>
                    {post.read_time_minutes && (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time_minutes} min read</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
          <p className="text-center text-[var(--color-mist)] py-16">No blog posts published yet.</p>
        )}
      </div>
    </div>
  )
}
