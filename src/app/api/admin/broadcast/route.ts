import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const supabase = await createAdminClient()

  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { subject, body, target_tier } = await request.json()
  if (!subject || !body) return NextResponse.json({ error: 'Missing subject or body' }, { status: 400 })

  // Fetch recipients
  let query = supabase.from('profiles').select('email, full_name')
  if (target_tier !== 'all') query = query.eq('tier', target_tier)

  const { data: recipients, error: recipError } = await query
  if (recipError) return NextResponse.json({ error: recipError.message }, { status: 500 })

  if (!recipients || recipients.length === 0) {
    return NextResponse.json({ error: 'No recipients found for this tier' }, { status: 400 })
  }

  // Log broadcast
  await supabase.from('email_broadcasts').insert({
    subject,
    body,
    target_tier,
    recipient_count: recipients.length,
    sent_by: user.id,
    status: 'sending',
  })

  // Send in batches of 50 (Resend batch limit)
  const batchSize = 50
  let sent = 0

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)
    const emails = batch.map((r) => ({
      from: 'Abigael Glory Ministries <ministry@agm.church>',
      to: r.email,
      subject,
      text: body,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0D0F1A; color: #F5F2EC;">
          <div style="border-bottom: 1px solid rgba(212,168,67,0.3); padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #D4A843; font-size: 20px; margin: 0;">Abigael Glory Ministries</h1>
          </div>
          <div style="line-height: 1.8; font-size: 16px; white-space: pre-line;">${body.replace(/\n/g, '<br/>')}</div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(212,168,67,0.15); color: #B8C0CC; font-size: 12px;">
            <p>You received this because you are a member of Abigael Glory Ministries.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #D4A843;">Manage email preferences</a></p>
          </div>
        </div>
      `,
    }))

    try {
      await resend.batch.send(emails)
      sent += batch.length
    } catch (err) {
      console.error('Resend batch error:', err)
    }
  }

  return NextResponse.json({ success: true, recipient_count: sent })
}
