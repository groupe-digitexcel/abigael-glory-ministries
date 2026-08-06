'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart, Plus, Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import type { PrayerRequest } from '@/types'

export default function PrayerPage() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [praying, setPraying] = useState<Set<string>>(new Set())

  const [form, setForm] = useState({
    title: '',
    content: '',
    is_anonymous: false,
    is_public: true,
  })

  useEffect(() => {
    fetchPrayers()
  }, [])

  async function fetchPrayers() {
    try {
      const res = await fetch('/api/prayer')
      const data = await res.json()
      setPrayers(data.prayers ?? [])
    } catch {
      toast.error('Failed to load prayers')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.status === 401) {
        toast.error('Please sign in to submit a prayer request')
        return
      }
      if (!res.ok) throw new Error('Failed')
      toast.success('Prayer request submitted. We are standing with you!')
      setShowForm(false)
      setForm({ title: '', content: '', is_anonymous: false, is_public: true })
      fetchPrayers()
    } catch {
      toast.error('Failed to submit prayer request')
    } finally {
      setSubmitting(false)
    }
  }

  function handlePray(id: string) {
    if (praying.has(id)) return
    setPraying(prev => new Set([...prev, id]))
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, prayer_count: p.prayer_count + 1 } : p))
    toast.success('🙏 Praying with you!')
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"

  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-3xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-spirit)]/15 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-[var(--color-spirit-light)]" />
          </div>
          <h1 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-3">Community Prayer Wall</h1>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto">
            Share your need and let thousands of believers stand with you before the throne of grace.
          </p>
        </motion.div>

        {/* Submit CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-center mb-8">
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-spirit)] text-white font-semibold hover:bg-[var(--color-spirit-light)] transition-colors">
            <Plus className="w-4 h-4" />
            Submit Prayer Request
          </button>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="mb-8 overflow-hidden">
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-[var(--color-spirit)]/20 flex flex-col gap-4">
                <h3 className="font-display text-lg font-bold text-[var(--color-pearl)]">Your Prayer Request</h3>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Brief title for your request" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Details</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="Share what's on your heart..." rows={4} required
                    className={inputClass + ' resize-none'} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_anonymous}
                      onChange={e => setForm(f => ({ ...f, is_anonymous: e.target.checked }))}
                      className="w-4 h-4 accent-[var(--color-gold)]" />
                    <span className="text-sm text-[var(--color-mist)] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Post anonymously
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_public}
                      onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))}
                      className="w-4 h-4 accent-[var(--color-gold)]" />
                    <span className="text-sm text-[var(--color-mist)]">Make this public</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-spirit)] text-white font-semibold hover:bg-[var(--color-spirit-light)] disabled:opacity-50 transition-all">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                    Submit Request
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-white/10 text-[var(--color-mist)] hover:text-[var(--color-pearl)] transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prayer Cards */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)]" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {prayers.map((prayer, i) => (
              <motion.div key={prayer.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">{prayer.title}</h3>
                    <p className="text-[var(--color-mist)] text-xs mt-0.5">
                      {prayer.is_anonymous ? 'Anonymous' : (prayer.profile as {full_name?: string})?.full_name ?? 'A sister/brother in Christ'}
                      {' · '}
                      {new Date(prayer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => handlePray(prayer.id)} disabled={praying.has(prayer.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      praying.has(prayer.id)
                        ? 'bg-[var(--color-spirit)]/15 text-[var(--color-spirit-light)]'
                        : 'border border-white/10 text-[var(--color-mist)] hover:border-[var(--color-spirit)]/30 hover:text-[var(--color-spirit-light)]'
                    }`}>
                    <Heart className={`w-3 h-3 ${praying.has(prayer.id) ? 'fill-current' : ''}`} />
                    {prayer.prayer_count} praying
                  </button>
                </div>
                <p className="text-[var(--color-mist)] text-sm leading-relaxed line-clamp-3">{prayer.content}</p>
                {prayer.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {prayer.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            {prayers.length === 0 && (
              <div className="text-center py-16 text-[var(--color-mist)]">
                <p>No prayer requests yet. Be the first to share.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
