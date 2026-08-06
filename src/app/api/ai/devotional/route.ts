import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { theme, scripture, name } = await request.json()

  const prompt = `You are an anointed devotional writer for Abigael Glory Ministries.
Write a personalized daily devotional${name ? ` for ${name}` : ''}.

${theme ? `Theme: ${theme}` : ''}
${scripture ? `Scripture focus: ${scripture}` : ''}

Return a JSON object with exactly these fields:
{
  "title": "Devotional title (max 8 words)",
  "scripture": "Bible verse reference (e.g. Psalm 23:1)",
  "scripture_text": "The full verse text",
  "content": "3-4 paragraphs of devotional content (rich, personal, faith-building)",
  "prayer": "A closing prayer (2-3 sentences)",
  "reflection": "One reflection question for the reader"
}

Return ONLY valid JSON, no markdown, no extra text.`

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
        model: 'anthropic/claude-sonnet-4-5',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.75,
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim() ?? '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Devotional AI error:', err)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
