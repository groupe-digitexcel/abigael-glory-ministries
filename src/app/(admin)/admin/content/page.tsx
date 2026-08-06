import { createClient } from '@/lib/supabase/server'
import { AdminContentClient } from '@/components/admin/AdminContentClient'

export default async function AdminContentPage() {
  const supabase = await createClient()

  const [{ data: devotionals }, { data: events }, { data: posts }] = await Promise.all([
    supabase.from('devotionals').select('id, title, slug, scripture, category, status, ai_generated, published_at, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('events').select('id, title, slug, start_at, location, is_online, status, registration_count, created_at').order('created_at', { ascending: false }).limit(50),
    supabase.from('blog_posts').select('id, title, slug, category, status, ai_assisted, published_at, created_at').order('created_at', { ascending: false }).limit(50),
  ])

  return (
    <AdminContentClient
      devotionals={devotionals ?? []}
      events={events ?? []}
      posts={posts ?? []}
    />
  )
}
