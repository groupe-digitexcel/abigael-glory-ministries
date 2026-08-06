import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { affiliate_id } = await request.json()
  if (!affiliate_id) return NextResponse.json({ error: 'Missing affiliate_id' }, { status: 400 })

  const { data: affiliate } = await supabase.from('affiliates').select('*').eq('id', affiliate_id).single()
  if (!affiliate) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })

  const { error } = await supabase
    .from('affiliates')
    .update({
      paid_out_usd: affiliate.paid_out_usd + affiliate.pending_payout_usd,
      pending_payout_usd: 0,
    })
    .eq('id', affiliate_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('affiliate_referrals')
    .update({ status: 'paid' })
    .eq('affiliate_id', affiliate_id)
    .eq('status', 'confirmed')

  return NextResponse.json({ success: true })
}
