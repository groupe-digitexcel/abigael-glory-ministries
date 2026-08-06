import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyPulseSignature, CHARIOW_PRODUCTS } from '@/lib/payments/chariow'
import { PRICING_TIERS } from '@/types'

// POST /api/webhooks/chariow — handles Chariow Pulses (webhooks).
// Every request is signature-verified before any data is touched.
export async function POST(request: Request) {
  const rawBody = await request.text()

  const isValid = await verifyPulseSignature(rawBody, request.headers)
  if (!isValid) {
    console.warn('Chariow Pulse: invalid or missing signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: { event?: string; data?: Record<string, unknown> }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event, data } = payload
  if (event !== 'sale.completed' || !data) {
    return NextResponse.json({ received: true })
  }

  const supabase = await createAdminClient()
  const saleId = data.id as string
  const productId = (data.product as Record<string, unknown> | undefined)?.id as string | undefined
  const campaignId = data.campaign_id as string | undefined

  // ── Donation completed ────────────────────────────────────────────────
  if (campaignId?.startsWith('donation-')) {
    await supabase
      .from('donations')
      .update({ status: 'completed', payment_provider_id: saleId, receipt_sent: false })
      .eq('payment_provider_id', saleId)
  }

  // ── Subscription purchased/renewed ──────────────────────────────────────
  if (campaignId?.startsWith('sub-')) {
    const parts = campaignId.split('-') // sub-<userId>-<referredBy?>
    const userId = parts[1]
    const referredBy = parts[2]

    const tierEntry = Object.entries(CHARIOW_PRODUCTS.subscription).find(
      ([, id]) => id === productId
    )

    if (userId && tierEntry) {
      const [productKey] = tierEntry
      const [tier, cycle] = productKey.split('_') as [string, 'monthly' | 'annual']
      const tierInfo = PRICING_TIERS.find(t => t.id === tier)
      const amount = cycle === 'annual' ? tierInfo?.price_annual : tierInfo?.price_monthly

      const now = new Date()
      const periodEnd = new Date(now)
      if (cycle === 'annual') periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      else periodEnd.setMonth(periodEnd.getMonth() + 1)

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled', cancel_at_period_end: true })
        .eq('user_id', userId)
        .eq('status', 'active')

      const { data: subscription } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          tier,
          status: 'active',
          payment_method: 'chariow',
          payment_provider_id: saleId,
          amount_usd: amount ?? 0,
          billing_cycle: cycle,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: false,
        })
        .select()
        .single()

      await supabase.from('profiles').update({ tier }).eq('id', userId)

      // Affiliate commission — only fires now that payment is confirmed
      if (referredBy && subscription) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id, commission_rate')
          .eq('code', referredBy)
          .single()

        if (affiliate && amount) {
          const commission = amount * (affiliate.commission_rate / 100)
          await supabase.from('affiliate_referrals').insert({
            affiliate_id: affiliate.id,
            referred_user_id: userId,
            subscription_id: subscription.id,
            commission_usd: commission,
            status: 'pending',
          })
          await supabase.rpc('increment_affiliate_earnings', {
            p_affiliate_id: affiliate.id,
            p_amount: commission,
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
