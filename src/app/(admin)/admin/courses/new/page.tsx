'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PRICING_TIERS, type SubscriptionTier } from '@/types'

export default function NewCoursePage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: '',
    description: '',
    instructor: 'Abigael-Glory Besong',
    min_tier: 'believer' as SubscriptionTier,
    duration_hours: '',
    tags: '',
    status: 'draft',
  })
  const [loading, setLoading] = useState(false)

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('courses').insert({
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: form.description,
        instructor: form.instructor,
        min_tier: form.min_tier,
        duration_hours: form.duration_hours ? parseFloat(form.duration_hours) : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: form.status,
        total_lessons: 0,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      })
      if (error) throw error
      toast.success('Course created! Now add lessons.')
      router.push('/admin/courses')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">New Course</h2>
        <p className="text-[var(--color-mist)] mt-1">Create a new discipleship course. Add lessons afterward.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <label className={labelClass}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required className={inputClass} placeholder="e.g. Foundations of Faith" />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={4}
            className={inputClass + ' resize-none'} placeholder="What will students learn?" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instructor</label>
            <input value={form.instructor} onChange={e => set('instructor', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Duration (hours)</label>
            <input type="number" step="0.5" value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} className={inputClass} placeholder="e.g. 4.5" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Minimum Tier</label>
            <select value={form.min_tier} onChange={e => set('min_tier', e.target.value)} className={inputClass}>
              {PRICING_TIERS.filter(t => t.id !== 'free').map(t => (
                <option key={t.id} value={t.id}>{t.name} (${t.price_monthly}/mo)</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input value={form.tags} onChange={e => set('tags', e.target.value)} className={inputClass} placeholder="Faith, Basics" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            {['draft', 'published'].map(s => (
              <button key={s} type="button" onClick={() => set('status', s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)]'
                }`}>{s}</button>
            ))}
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Create Course
          </button>
        </div>
      </form>
    </div>
  )
}
