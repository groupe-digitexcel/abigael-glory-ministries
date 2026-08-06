'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Sparkles, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PRICING_TIERS, type SubscriptionTier } from '@/types'

export default function EditSermonPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    speaker: '',
    description: '',
    scripture_reference: '',
    series_name: '',
    youtube_id: '',
    audio_url: '',
    duration_seconds: '',
    min_tier: 'free' as SubscriptionTier,
    tags: '',
    status: 'draft',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('sermons').select('*').eq('id', id).single()
      if (error || !data) {
        toast.error('Sermon not found')
        router.push('/admin/sermons')
        return
      }
      setForm({
        title: data.title ?? '',
        speaker: data.speaker ?? '',
        description: data.description ?? '',
        scripture_reference: data.scripture_reference ?? '',
        series_name: data.series_name ?? '',
        youtube_id: data.youtube_id ?? '',
        audio_url: data.audio_url ?? '',
        duration_seconds: data.duration_seconds ? String(data.duration_seconds) : '',
        min_tier: data.min_tier,
        tags: (data.tags ?? []).join(', '),
        status: data.status,
      })
      setLoading(false)
    }
    load()
  }, [id])

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function generateAISummary() {
    if (!form.title && !form.description) {
      toast.error('Add a title or description first')
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/sermon-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, description: form.description, scripture: form.scripture_reference }),
      })
      const data = await res.json()
      if (data.description) set('description', data.description)
      toast.success('AI summary generated!')
    } catch {
      toast.error('AI generation failed')
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const wasPublished = form.status === 'published'
      const { error } = await supabase
        .from('sermons')
        .update({
          title: form.title,
          speaker: form.speaker,
          description: form.description || null,
          scripture_reference: form.scripture_reference || null,
          series_name: form.series_name || null,
          youtube_id: form.youtube_id || null,
          audio_url: form.audio_url || null,
          duration_seconds: form.duration_seconds ? parseInt(form.duration_seconds) : null,
          min_tier: form.min_tier,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          status: form.status,
          ...(wasPublished ? { published_at: new Date().toISOString() } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
      toast.success('Sermon updated!')
      router.push('/admin/sermons')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update sermon')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    const confirmed = confirm(`Delete "${form.title}"? This cannot be undone.`)
    if (!confirmed) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('sermons').delete().eq('id', id)
      if (error) throw error
      toast.success('Sermon deleted')
      router.push('/admin/sermons')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete sermon')
    } finally {
      setDeleting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-gold)]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Edit Sermon</h2>
          <p className="text-[var(--color-mist)] mt-1">Update sermon details and access level.</p>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-ember)]/20 text-[var(--color-ember)] text-sm font-medium hover:bg-[var(--color-ember)]/5 disabled:opacity-50 transition-all">
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">Basic Info</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Speaker</label>
              <input value={form.speaker} onChange={e => set('speaker', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Series Name</label>
              <input value={form.series_name} onChange={e => set('series_name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Scripture Reference</label>
              <input value={form.scripture_reference} onChange={e => set('scripture_reference', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass.replace(' mb-1.5', '')}>Description</label>
              <button type="button" onClick={generateAISummary} disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs text-[var(--color-spirit-light)] hover:opacity-80 font-medium">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Generate
              </button>
            </div>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} className={inputClass + ' resize-none'} />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-5">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">Media & Access</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>YouTube Video ID</label>
              <input value={form.youtube_id} onChange={e => set('youtube_id', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Duration (seconds)</label>
              <input type="number" value={form.duration_seconds} onChange={e => set('duration_seconds', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Audio URL (MP3)</label>
            <input value={form.audio_url} onChange={e => set('audio_url', e.target.value)} placeholder="https://..." className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Minimum Tier Required</label>
              <select value={form.min_tier} onChange={e => set('min_tier', e.target.value as SubscriptionTier)} className={inputClass}>
                {PRICING_TIERS.map(t => (
                  <option key={t.id} value={t.id}>{t.name}{t.price_monthly > 0 ? ` ($${t.price_monthly}/mo)` : ' (Free)'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-3">
              {['draft', 'published', 'archived'].map(s => (
                <button key={s} type="button" onClick={() => set('status', s)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)] hover:border-[var(--color-gold)]/30'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
