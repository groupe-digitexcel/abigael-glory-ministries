import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PRICING_TIERS } from '@/types'
import { createChariowCheckout, CHARIOW_PRODUCTS } from '@/lib/payments/chariow'

// GET — current user subscription
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ subscription, current_tier: profile?.tier ?? 'free' })
}

// POST — start a Chariow checkout for a subscription tier.
// IMPORTANT: this does NOT activate the tier. Activation happens only when
// the Chariow Pulse confirms the sale (see /api/webhooks/chariow). This
// closes the previous "trust the client" vulnerability.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tier, billing_cycle, referred_by } = await request.json()

  const tierInfo = PRICING_TIERS.find(t => t.id === tier)
  if (!tierInfo) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

  const cycle = billing_cycle === 'annual' ? 'annual' : 'monthly'
  const productKey = `${tier}_${cycle}`
  const productId = CHARIOW_PRODUCTS.subscription[productKey]

  if (!productId) {
    return NextResponse.json({ error: 'This plan is not available yet' }, { status: 400 })
  }

  const checkout = await createChariowCheckout(
    productId,
    { email: user.email!, first_name: user.user_metadata?.full_name },
    '/dashboard/billing/confirm',
    referred_by ? `sub-${user.id}-${referred_by}` : `sub-${user.id}`
  )

  if (!checkout.ok) {
    return NextResponse.json({ error: checkout.error }, { status: 502 })
  }

  return NextResponse.json({ checkout_url: checkout.checkout_url })
}

// DELETE — cancel subscription
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('user_id', user.id)
    .eq('status', 'active')

  return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' })
}
