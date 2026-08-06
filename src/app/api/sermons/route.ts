import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q') ?? ''
  const series = searchParams.get('series') ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '30')

  let query = supabase
    .from('sermons')
    .select('id, title, slug, speaker, series_name, duration_seconds, min_tier, thumbnail_url, tags, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (q) query = query.ilike('title', `%${q}%`)
  if (series) query = query.eq('series_name', series)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sermons: data })
}
