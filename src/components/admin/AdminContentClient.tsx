'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Plus, X, Sparkles, BookOpen, Calendar, FileText, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Devotional = { id: string; title: string; slug: string; scripture: string; category: string | null; status: string; ai_generated: boolean; published_at: string | null }
type EventRow = { id: string; title: string; slug: string; start_at: string; location: string | null; is_online: boolean; status: string; registration_count: number }
type BlogRow = { id: string; title: string; slug: string; category: string | null; status: string; ai_assisted: boolean; published_at: string | null }

interface Props {
  devotionals: Devotional[]
  events: EventRow[]
  posts: BlogRow[]
}

const STATUS_COLORS: Record<string, string> = {
  published: 'bg-green-500/10 text-green-400',
  draft: 'bg-amber-500/10 text-amber-400',
  archived: 'bg-white/5 text-[var(--color-slate)]',
}

const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

export function AdminContentClient({ devotionals: initialDevotionals, events: initialEvents, posts: initialPosts }: Props) {
  const [tab, setTab] = useState<'devotionals' | 'events' | 'blog'>('devotionals')
  const [devotionals, setDevotionals] = useState(initialDevotionals)
  const [events, setEvents] = useState(initialEvents)
  const [posts, setPosts] = useState(initialPosts)
  const supabase = createClient()

  const TABS = [
    { id: 'devotionals' as const, label: 'Devotionals', icon: BookOpen, count: devotionals.length },
    { id: 'events' as const, label: 'Events', icon: Calendar, count: events.length },
    { id: 'blog' as const, label: 'Blog', icon: FileText, count: posts.length },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Content</h2>
        <p className="text-[var(--color-mist)] mt-1">Manage devotionals, events, and blog posts.</p>
      </div>

      <div className="flex gap-1 bg-[var(--color-ink)] rounded-xl p-1 mb-8 max-w-md">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label} <span className="opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {tab === 'devotionals' && <DevotionalsPanel items={devotionals} setItems={setDevotionals} supabase={supabase} />}
      {tab === 'events' && <EventsPanel items={events} setItems={setEvents} supabase={supabase} />}
      {tab === 'blog' && <BlogPanel items={posts} setItems={setPosts} supabase={supabase} />}
    </div>
  )
}

// ─── Devotionals Panel ──────────────────────────────────────
function DevotionalsPanel({ items, setItems, supabase }: { items: Devotional[]; setItems: (v: Devotional[]) => void; supabase: any }) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({ title: '', scripture: '', scripture_text: '', content: '', category: '', status: 'draft' })

  async function generateWithAI() {
    if (!form.scripture && !form.title) { toast.error('Add a title or scripture reference first'); return }
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/devotional', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: form.title, scripture: form.scripture }),
      })
      const data = await res.json()
      setForm(f => ({
        ...f,
        title: data.title ?? f.title,
        scripture: data.scripture ?? f.scripture,
        scripture_text: data.scripture_text ?? f.scripture_text,
        content: data.content ? `${data.content}\n\nPrayer: ${data.prayer ?? ''}\n\nReflect: ${data.reflection ?? ''}` : f.content,
      }))
      toast.success('AI devotional generated!')
    } catch {
      toast.error('AI generation failed')
    } finally {
      setAiLoading(false)
    }
  }

  async function save() {
    if (!form.title || !form.content || !form.scripture) { toast.error('Title, scripture, and content are required'); return }
    setSaving(true)
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const { data, error } = await supabase.from('devotionals').insert({
        title: form.title, slug, content: form.content, scripture: form.scripture,
        scripture_text: form.scripture_text || null, category: form.category || null,
        status: form.status, ai_generated: true,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      }).select().single()
      if (error) throw error
      setItems([data, ...items])
      setForm({ title: '', scripture: '', scripture_text: '', content: '', category: '', status: 'draft' })
      setShowForm(false)
      toast.success('Devotional created!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create devotional')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this devotional?')) return
    await supabase.from('devotionals').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/20 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Devotional'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4 mb-6 border border-[var(--color-gold)]/15">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">New Devotional</h3>
            <button onClick={generateWithAI} disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs text-[var(--color-spirit-light)] font-medium hover:opacity-80">
              {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Generate with AI
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Scripture Reference *</label>
              <input value={form.scripture} onChange={e => setForm(f => ({ ...f, scripture: e.target.value }))} placeholder="e.g. Psalm 23:1" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Scripture Text</label>
            <input value={form.scripture_text} onChange={e => setForm(f => ({ ...f, scripture_text: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Content *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className={inputClass + ' resize-none'} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category (optional)" className={inputClass} />
            <div className="flex gap-2">
              {['draft', 'published'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create Devotional
          </button>
        </div>
      )}

      <div className="bg-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            {['Title', 'Scripture', 'Status', 'Date', ''].map(h => <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {items.map(d => (
              <tr key={d.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">{d.title}</td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{d.scripture}</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[d.status]}`}>{d.status}</span></td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{d.published_at ? new Date(d.published_at).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><button onClick={() => remove(d.id)} className="text-[var(--color-mist)] hover:text-[var(--color-ember)]"><Trash2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-[var(--color-mist)] text-sm py-8">No devotionals yet.</p>}
      </div>
    </div>
  )
}

// ─── Events Panel ───────────────────────────────────────────
function EventsPanel({ items, setItems, supabase }: { items: EventRow[]; setItems: (v: EventRow[]) => void; supabase: any }) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', start_at: '', end_at: '', location: '', is_online: true, stream_url: '', ticket_price_usd: '', status: 'draft' })

  async function save() {
    if (!form.title || !form.description || !form.start_at || !form.end_at) { toast.error('Title, description, and dates are required'); return }
    setSaving(true)
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const { data, error } = await supabase.from('events').insert({
        title: form.title, slug, description: form.description,
        start_at: new Date(form.start_at).toISOString(), end_at: new Date(form.end_at).toISOString(),
        location: form.location || null, is_online: form.is_online, stream_url: form.stream_url || null,
        ticket_price_usd: form.ticket_price_usd ? parseFloat(form.ticket_price_usd) : null,
        status: form.status,
      }).select().single()
      if (error) throw error
      setItems([data, ...items])
      setForm({ title: '', description: '', start_at: '', end_at: '', location: '', is_online: true, stream_url: '', ticket_price_usd: '', status: 'draft' })
      setShowForm(false)
      toast.success('Event created!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create event')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/20 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4 mb-6 border border-[var(--color-gold)]/15">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">New Event</h3>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title *" className={inputClass} />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description *" rows={3} className={inputClass + ' resize-none'} />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start *</label>
              <input type="datetime-local" value={form.start_at} onChange={e => setForm(f => ({ ...f, start_at: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>End *</label>
              <input type="datetime-local" value={form.end_at} onChange={e => setForm(f => ({ ...f, end_at: e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_online} onChange={e => setForm(f => ({ ...f, is_online: e.target.checked }))} className="w-4 h-4 accent-[var(--color-gold)]" />
              <span className="text-sm text-[var(--color-mist)]">Online event</span>
            </label>
          </div>
          {form.is_online ? (
            <input value={form.stream_url} onChange={e => setForm(f => ({ ...f, stream_url: e.target.value }))} placeholder="Stream URL" className={inputClass} />
          ) : (
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Physical location" className={inputClass} />
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="number" value={form.ticket_price_usd} onChange={e => setForm(f => ({ ...f, ticket_price_usd: e.target.value }))} placeholder="Ticket price (leave blank for free)" className={inputClass} />
            <div className="flex gap-2">
              {['draft', 'published'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create Event
          </button>
        </div>
      )}

      <div className="bg-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            {['Title', 'Date', 'Location', 'Status', 'Registered', ''].map(h => <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {items.map(e => (
              <tr key={e.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">{e.title}</td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{new Date(e.start_at).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{e.is_online ? 'Online' : e.location}</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{e.registration_count}</td>
                <td className="px-5 py-4"><button onClick={() => remove(e.id)} className="text-[var(--color-mist)] hover:text-[var(--color-ember)]"><Trash2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-[var(--color-mist)] text-sm py-8">No events yet.</p>}
      </div>
    </div>
  )
}

// ─── Blog Panel ─────────────────────────────────────────────
function BlogPanel({ items, setItems, supabase }: { items: BlogRow[]; setItems: (v: BlogRow[]) => void; supabase: any }) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author: 'Abigael-Glory Besong', category: '', status: 'draft' })

  async function save() {
    if (!form.title || !form.content) { toast.error('Title and content are required'); return }
    setSaving(true)
    try {
      const slug = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const readTime = Math.max(1, Math.round(form.content.split(/\s+/).length / 200))
      const { data, error } = await supabase.from('blog_posts').insert({
        title: form.title, slug, excerpt: form.excerpt || null, content: form.content,
        author: form.author, category: form.category || null, status: form.status,
        read_time_minutes: readTime,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
      }).select().single()
      if (error) throw error
      setItems([data, ...items])
      setForm({ title: '', excerpt: '', content: '', author: 'Abigael-Glory Besong', category: '', status: 'draft' })
      setShowForm(false)
      toast.success('Post created!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to create post')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
    toast.success('Deleted')
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/20 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4 mb-6 border border-[var(--color-gold)]/15">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">New Blog Post</h3>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Post title *" className={inputClass} />
          <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short excerpt" className={inputClass} />
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full content *" rows={8} className={inputClass + ' resize-none'} />
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className={inputClass} />
            <div className="flex gap-2">
              {['draft', 'published'].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create Post
          </button>
        </div>
      )}

      <div className="bg-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            {['Title', 'Category', 'Status', 'Date', ''].map(h => <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>)}
          </tr></thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">{p.title}</td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{p.category ?? '—'}</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                <td className="px-5 py-4 text-[var(--color-mist)]">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'}</td>
                <td className="px-5 py-4"><button onClick={() => remove(p.id)} className="text-[var(--color-mist)] hover:text-[var(--color-ember)]"><Trash2 className="w-3.5 h-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="text-center text-[var(--color-mist)] text-sm py-8">No posts yet.</p>}
      </div>
    </div>
  )
}
