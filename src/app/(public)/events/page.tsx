import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .gte('end_at', new Date().toISOString())
    .order('start_at', { ascending: true })

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max">
        <div className="text-center mb-12">
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">Events</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">Join Us Live</h1>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto">
            Conferences, prayer weekends, and discipleship intensives — online and in person.
          </p>
        </div>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {(events ?? []).map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="group">
              <div className="bg-card bg-card-hover rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-[var(--color-gold)]/10 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[var(--color-gold)] font-display font-bold text-lg leading-none">
                    {new Date(event.start_at).getDate()}
                  </span>
                  <span className="text-[var(--color-gold)] text-[10px] uppercase">
                    {new Date(event.start_at).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-[var(--color-mist)] text-sm mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(event.start_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.is_online ? 'Online' : event.location}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {event.ticket_price_usd ? (
                    <span className="text-[var(--color-gold)] font-semibold">${event.ticket_price_usd}</span>
                  ) : (
                    <span className="text-green-400 text-sm font-medium">Free</span>
                  )}
                  <span className="flex items-center gap-1 text-[var(--color-mist)] text-xs">
                    <Users className="w-3.5 h-3.5" />{event.registration_count}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(!events || events.length === 0) && (
          <p className="text-center text-[var(--color-mist)] py-16">No upcoming events. Check back soon!</p>
        )}
      </div>
    </div>
  )
}
