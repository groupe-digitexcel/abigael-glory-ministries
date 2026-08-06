import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { event_id } = await request.json()
  if (!event_id) return NextResponse.json({ error: 'Missing event_id' }, { status: 400 })

  const { data: event } = await supabase.from('events').select('*').eq('id', event_id).single()
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  if (event.max_attendees && event.registration_count >= event.max_attendees) {
    return NextResponse.json({ error: 'Event is full' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('event_registrations')
    .select('id')
    .eq('event_id', event_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ success: true, already_registered: true })
  }

  const { error } = await supabase.from('event_registrations').insert({
    event_id,
    user_id: user.id,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase
    .from('events')
    .update({ registration_count: (event.registration_count ?? 0) + 1 })
    .eq('id', event_id)

  return NextResponse.json({ success: true })
}
