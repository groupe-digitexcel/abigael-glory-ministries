import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createChariowCheckout, CHARIOW_PRODUCTS } from '@/lib/payments/chariow'

// POST /api/donations — start a Chariow checkout for a donation
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { amount_usd, purpose, donor_name, donor_email, message } = body

  const amount = parseInt(amount_usd, 10)
  const productId = CHARIOW_PRODUCTS.donation[amount]

  if (!productId) {
    return NextResponse.json(
      { error: 'Please choose one of the available donation amounts' },
      { status: 400 }
    )
  }

  const email = donor_email || user?.email
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Pre-create a pending record; the Chariow Pulse will mark it completed
  const { data: donation, error } = await supabase
    .from('donations')
    .insert({
      user_id: user?.id ?? null,
      amount_usd: amount,
      currency: 'USD',
      payment_method: 'chariow',
      status: 'pending',
      purpose: purpose ?? null,
      donor_name: donor_name ?? null,
      donor_email: email,
      message: message ?? null,
      is_recurring: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Donation insert error:', error)
    return NextResponse.json({ error: 'Could not start donation' }, { status: 500 })
  }

  const checkout = await createChariowCheckout(
    productId,
    { email, first_name: donor_name || undefined },
    '/donate/thank-you',
    `donation-${donation.id}`
  )

  if (!checkout.ok) {
    return NextResponse.json({ error: checkout.error }, { status: 502 })
  }

  // Store the Chariow sale id so the Pulse can match it back to this row
  await supabase
    .from('donations')
    .update({ payment_provider_id: checkout.sale_id })
    .eq('id', donation.id)

  return NextResponse.json({ checkout_url: checkout.checkout_url })
}

// GET /api/donations — user donation history
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Donations fetch error:', error)
    return NextResponse.json({ error: 'Could not load donations' }, { status: 500 })
  }
  return NextResponse.json({ donations: data })
}
