import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { EventRegisterButton } from '@/components/sections/EventRegisterButton'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).eq('status', 'published').single()
  if (!event) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        {event.banner_url && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-[var(--color-ink)]">
            <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="font-display text-3xl lg:text-4xl font-bold text-[var(--color-pearl)] mb-4">{event.title}</h1>

        <div className="flex flex-wrap items-center gap-5 text-[var(--color-mist)] text-sm mb-8">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(event.start_at).toLocaleString()}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{event.timezone}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.is_online ? 'Online' : event.location}</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{event.registration_count} registered</span>
        </div>

        <div className="bg-card rounded-2xl p-6 mb-8">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-3">About This Event</h3>
          <p className="text-[var(--color-mist)] leading-relaxed whitespace-pre-line">{event.description}</p>
        </div>

        <EventRegisterButton
          eventId={event.id}
          isLoggedIn={!!user}
          price={event.ticket_price_usd}
          streamUrl={event.is_online ? event.stream_url : null}
        />
      </div>
    </div>
  )
}
