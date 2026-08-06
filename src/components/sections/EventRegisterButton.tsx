'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, Check } from 'lucide-react'

interface Props {
  eventId: string
  isLoggedIn: boolean
  price: number | null
  streamUrl: string | null
}

export function EventRegisterButton({ eventId, isLoggedIn, price, streamUrl }: Props) {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  async function handleRegister() {
    setLoading(true)
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId }),
      })
      if (!res.ok) throw new Error('Registration failed')
      setRegistered(true)
      toast.success("You're registered! Check your email for details.")
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/register?redirect=/events/${eventId}`}
        className="block text-center px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity">
        Sign Up to Register
      </Link>
    )
  }

  if (registered) {
    return (
      <div className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-semibold">
        <Check className="w-5 h-5" /> You're Registered{streamUrl ? ' — link sent to your email' : ''}
      </div>
    )
  }

  return (
    <button onClick={handleRegister} disabled={loading}
      className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {price ? `Register — $${price}` : 'Register Free'}
    </button>
  )
}
