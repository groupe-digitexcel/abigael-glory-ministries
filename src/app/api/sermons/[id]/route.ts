import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { TIER_HIERARCHY, type SubscriptionTier } from '@/types'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: sermon, error } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error || !sermon) return NextResponse.json({ error: 'Sermon not found' }, { status: 404 })

  const { data: { user } } = await supabase.auth.getUser()
  let hasAccess = sermon.min_tier === 'free'

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
    const userTier = (profile?.tier ?? 'free') as SubscriptionTier
    hasAccess = TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[sermon.min_tier as SubscriptionTier]
  }

  return NextResponse.json({ sermon: hasAccess ? sermon : { ...sermon, youtube_id: null, audio_url: null }, has_access: hasAccess })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { data, error } = await supabase.from('sermons').update(body).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sermon: data })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('sermons').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
