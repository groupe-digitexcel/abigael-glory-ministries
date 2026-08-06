import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: affiliate } = await supabase
    .from('affiliates')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const { data: referrals } = affiliate
    ? await supabase
        .from('affiliate_referrals')
        .select('*, profiles(full_name, email, tier)')
        .eq('affiliate_id', affiliate.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return NextResponse.json({ affiliate, referrals })
}

// Creates an affiliate record when a user becomes Kingdom Builder tier
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('tier, affiliate_code').eq('id', user.id).single()
  if (profile?.tier !== 'kingdom_builder') {
    return NextResponse.json({ error: 'Kingdom Builder tier required' }, { status: 403 })
  }

  const { data: existing } = await supabase.from('affiliates').select('id').eq('user_id', user.id).maybeSingle()
  if (existing) return NextResponse.json({ affiliate_id: existing.id, already_exists: true })

  const { data: affiliate, error } = await supabase
    .from('affiliates')
    .insert({
      user_id: user.id,
      code: profile.affiliate_code ?? Math.random().toString(36).slice(2, 10).toUpperCase(),
      commission_rate: 30.0,
      status: 'active',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ affiliate })
}
