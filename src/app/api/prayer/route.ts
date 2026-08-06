import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const perPage = 12
  const from = (page - 1) * perPage

  const { data, count, error } = await supabase
    .from('prayer_requests')
    .select('*, profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('is_public', true)
    .in('status', ['pending', 'praying'])
    .order('created_at', { ascending: false })
    .range(from, from + perPage - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prayers: data, count, page, perPage })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, is_anonymous, is_public, tags } = await request.json()

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: user.id,
      title,
      content,
      is_anonymous: is_anonymous ?? false,
      is_public: is_public ?? true,
      tags: tags ?? [],
      status: 'pending',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ prayer: data })
}
