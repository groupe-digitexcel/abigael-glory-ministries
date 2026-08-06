import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, tone, audience } = await request.json()

  const audienceLabel = audience === 'all' ? 'all ministry members' : `${audience} tier members`

  const prompt = `You are writing a ministry email on behalf of Abigael Glory Ministries (AGM), a digital evangelism ministry based in Cameroon.

Subject: ${subject}
Audience: ${audienceLabel}
Tone: ${tone ?? 'warm, faith-filled, ministerial'}

Write a professional ministry email body that:
- Opens with a warm, faith-based greeting
- Delivers the core message clearly and with spiritual depth
- Includes a scripture or faith-based encouragement if natural
- Closes with a blessing and the ministry name
- Is between 150-300 words

Return ONLY the email body text, no subject line, no HTML tags.`

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://agm.church',
        'X-Title': 'Abigael Glory Ministries',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const body = data.choices?.[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ body })
  } catch (err) {
    console.error('Email AI error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
