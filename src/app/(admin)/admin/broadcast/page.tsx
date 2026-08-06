'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { PRICING_TIERS } from '@/types'

export default function BroadcastPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [targetTier, setTargetTier] = useState('all')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  async function generateWithAI() {
    if (!subject) { toast.error('Add a subject first'); return }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/email-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, tone: 'ministry', audience: targetTier }),
      })
      const data = await res.json()
      if (data.body) setBody(data.body)
      toast.success('Email drafted by AI!')
    } catch {
      toast.error('AI draft failed')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!subject || !body) { toast.error('Subject and body are required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, target_tier: targetTier }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Broadcast queued to ${data.recipient_count} members!`)
      setSubject('')
      setBody('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Broadcast failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Email Broadcast</h2>
        <p className="text-[var(--color-mist)] mt-1">Send a message to your entire community or a specific tier.</p>
      </div>

      <form onSubmit={handleSend} className="flex flex-col gap-6">
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-5">

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-mist)] mb-2">Send To</label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setTargetTier('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${targetTier === 'all' ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)] hover:border-[var(--color-gold)]/30'}`}>
                All Members
              </button>
              {PRICING_TIERS.map(t => (
                <button key={t.id} type="button" onClick={() => setTargetTier(t.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${targetTier === t.id ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)] hover:border-[var(--color-gold)]/30'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Subject *</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New sermon: Walking in Divine Purpose"
              required className={inputClass} />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-[var(--color-mist)]">Email Body *</label>
              <button type="button" onClick={generateWithAI} disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs text-[var(--color-spirit-light)] hover:opacity-80 font-medium">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Draft with AI
              </button>
            </div>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              placeholder="Write your email content here. Plain text or HTML supported."
              required rows={12}
              className={inputClass + ' resize-none font-mono text-xs leading-relaxed'} />
          </div>
        </div>

        {/* Preview strip */}
        {body && (
          <div className="bg-[var(--color-ink)] rounded-2xl p-6 border border-white/5">
            <p className="text-[var(--color-mist)] text-xs font-medium uppercase tracking-wide mb-3">Preview</p>
            <p className="text-[var(--color-pearl)] font-semibold mb-3">{subject || 'No subject'}</p>
            <div className="text-[var(--color-mist)] text-sm leading-relaxed whitespace-pre-wrap">{body.slice(0, 400)}{body.length > 400 ? '...' : ''}</div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-[var(--color-mist)] text-sm">
            Sending to: <strong className="text-[var(--color-gold)] capitalize">{targetTier === 'all' ? 'All Members' : targetTier.replace('_', ' ')}</strong>
          </p>
          <button type="submit" disabled={loading || !subject || !body}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-40 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Broadcast
          </button>
        </div>
      </form>
    </div>
  )
}
