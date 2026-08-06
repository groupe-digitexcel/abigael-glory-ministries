'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Heart, DollarSign, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500]

const PURPOSES = [
  'General Ministry',
  'Sermon Production',
  'Course Development',
  'Outreach & Evangelism',
  'Technology & Platform',
  'Prayer Ministry',
]

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(25)
  const [purpose, setPurpose] = useState('General Ministry')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGive() {
    if (!email) { toast.error('Please enter your email'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_usd: amount,
          purpose,
          donor_name: name || null,
          donor_email: email,
          message: message || null,
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.checkout_url) {
        toast.error(result.error || 'Something went wrong. Please try again.')
        return
      }
      window.location.href = result.checkout_url
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[var(--color-gold)]" />
            </div>
            <h1 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-3">Give to the Ministry</h1>
            <p className="text-[var(--color-mist)] text-lg">
              Every gift advances the Gospel to the ends of the earth.
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 flex flex-col gap-6 border border-[var(--color-gold)]/10">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-mist)] mb-3">Choose Amount (USD)</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((a) => (
                  <button key={a} type="button" onClick={() => setAmount(a)}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                      amount === a
                        ? 'bg-[var(--color-gold)] text-[var(--color-night)]'
                        : 'border border-white/10 text-[var(--color-mist)] hover:border-[var(--color-gold)]/30'
                    }`}>
                    ${a}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-mist)] mb-2">Purpose</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50">
                {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Donor info */}
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name (optional)"
                className="px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50 placeholder:text-[var(--color-slate)]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email for receipt"
                className="px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50 placeholder:text-[var(--color-slate)]" />
            </div>

            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Add a message of encouragement (optional)"
              rows={2}
              className="px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50 placeholder:text-[var(--color-slate)] resize-none" />

            <button onClick={handleGive} disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
              Give ${amount}
            </button>

            <p className="text-center text-[var(--color-mist)] text-xs">
              🔒 Secure checkout via Chariow. Receipts sent to your email.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
