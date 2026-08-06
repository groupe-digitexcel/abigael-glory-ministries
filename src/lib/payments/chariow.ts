// ── AGM V3 — Chariow Payment Integration ────────────────────────────────────
// Replaces PayPal + Flutterwave. Chariow is a one-time-checkout digital
// product platform (not native recurring billing), so:
//  - Donations map to fixed-amount Chariow products (CHARIOW_PRODUCTS below)
//  - Subscriptions are "repurchased" each cycle; a Pulse (webhook) renews
//    current_period_end on each successful sale for a tier product
//
// NOTE: The exact Pulse signature header/algorithm below follows the
// Standard Webhooks convention (webhook-id / webhook-timestamp /
// webhook-signature, HMAC-SHA256, base64). Confirm this against your
// Chariow dashboard → Pulses → signing settings before going live; if it
// differs, only verifyPulseSignature() needs to change.

const CHARIOW_API_BASE = 'https://api.chariow.com/v1'
const CHARIOW_API_KEY = process.env.CHARIOW_API_KEY!
const CHARIOW_PULSE_SECRET = process.env.CHARIOW_PULSE_SECRET!

// Map internal identifiers → real Chariow product IDs (set these in .env)
export const CHARIOW_PRODUCTS = {
  donation: {
    10: process.env.CHARIOW_PRODUCT_DONATION_10 ?? '',
    25: process.env.CHARIOW_PRODUCT_DONATION_25 ?? '',
    50: process.env.CHARIOW_PRODUCT_DONATION_50 ?? '',
    100: process.env.CHARIOW_PRODUCT_DONATION_100 ?? '',
    250: process.env.CHARIOW_PRODUCT_DONATION_250 ?? '',
    500: process.env.CHARIOW_PRODUCT_DONATION_500 ?? '',
  } as Record<number, string>,
  subscription: {
    bronze_monthly: process.env.CHARIOW_PRODUCT_BRONZE_MONTHLY ?? '',
    bronze_annual: process.env.CHARIOW_PRODUCT_BRONZE_ANNUAL ?? '',
    silver_monthly: process.env.CHARIOW_PRODUCT_SILVER_MONTHLY ?? '',
    silver_annual: process.env.CHARIOW_PRODUCT_SILVER_ANNUAL ?? '',
    gold_monthly: process.env.CHARIOW_PRODUCT_GOLD_MONTHLY ?? '',
    gold_annual: process.env.CHARIOW_PRODUCT_GOLD_ANNUAL ?? '',
  } as Record<string, string>,
}

interface ChariowCustomer {
  email: string
  first_name?: string
  last_name?: string
  phone?: { number: string; country_code: string }
}

interface ChariowCheckoutResult {
  ok: boolean
  checkout_url?: string
  sale_id?: string
  error?: string
}

// Creates a Chariow checkout session and returns the payment URL to redirect to.
export async function createChariowCheckout(
  productId: string,
  customer: ChariowCustomer,
  redirectPath: string,
  campaignId?: string
): Promise<ChariowCheckoutResult> {
  if (!productId) {
    return { ok: false, error: 'Missing Chariow product configuration' }
  }
  if (!CHARIOW_API_KEY) {
    console.error('CHARIOW_API_KEY is not set')
    return { ok: false, error: 'Payment system unavailable' }
  }

  try {
    const res = await fetch(`${CHARIOW_API_BASE}/checkout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CHARIOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}?sale={sale_id}`,
        ...(campaignId ? { campaign_id: campaignId } : {}),
      }),
    })

    const result = await res.json()
    if (!res.ok || result?.data?.step !== 'payment') {
      console.error('Chariow checkout error:', result)
      return { ok: false, error: 'Could not start checkout' }
    }

    return {
      ok: true,
      checkout_url: result.data.payment.checkout_url,
      sale_id: result.data.purchase?.id,
    }
  } catch (err) {
    console.error('Chariow checkout request failed:', err)
    return { ok: false, error: 'Payment system unavailable' }
  }
}

// Verifies a sale directly against the Chariow API (defense in depth,
// in addition to Pulse signature verification).
export async function getChariowSale(saleId: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${CHARIOW_API_BASE}/sales/${saleId}`, {
      headers: { Authorization: `Bearer ${CHARIOW_API_KEY}` },
    })
    if (!res.ok) return null
    const result = await res.json()
    return result?.data ?? null
  } catch (err) {
    console.error('Chariow get-sale request failed:', err)
    return null
  }
}

// Verifies the Pulse (webhook) signature using the raw request body.
// MUST be called with the raw, unparsed body text — never the parsed JSON.
export async function verifyPulseSignature(
  rawBody: string,
  headers: Headers
): Promise<boolean> {
  if (!CHARIOW_PULSE_SECRET) {
    console.error('CHARIOW_PULSE_SECRET is not set — refusing unsigned webhook')
    return false
  }

  const webhookId = headers.get('webhook-id')
  const timestamp = headers.get('webhook-timestamp')
  const signatureHeader = headers.get('webhook-signature')

  if (!webhookId || !timestamp || !signatureHeader) return false

  // Reject anything older than 5 minutes to prevent replay attacks
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false

  const signedContent = `${webhookId}.${timestamp}.${rawBody}`

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(CHARIOW_PULSE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedContent))
  const expected = Buffer.from(sigBuffer).toString('base64')

  // signature header format: "v1,BASE64SIG v1,BASE64SIG2..." (space-separated, for secret rotation)
  const candidates = signatureHeader.split(' ').map(s => s.split(',')[1]).filter(Boolean)

  return candidates.some(candidate => timingSafeEqualStr(candidate, expected))
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
