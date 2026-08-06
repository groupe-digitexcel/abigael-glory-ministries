import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, scripture } = await request.json()

  const prompt = `You are a ministry content assistant for Abigael Glory Ministries. 
Generate a compelling, faith-filled sermon description for the following:

Title: ${title}
Scripture: ${scripture ?? 'Not specified'}
Draft description: ${description ?? 'None provided'}

Write a 2-3 sentence description that:
- Captures the spiritual theme powerfully
- Uses rich, anointed language appropriate for a ministry platform
- Ends with a sentence that draws listeners in

Return ONLY the description text, nothing else.`

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
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim() ?? ''
    return NextResponse.json({ description: text })
  } catch (err) {
    console.error('OpenRouter error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
