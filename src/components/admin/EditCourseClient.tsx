'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus, GripVertical, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PRICING_TIERS, type Course, type CourseLesson, type SubscriptionTier } from '@/types'

interface Props {
  course: Course
  initialLessons: CourseLesson[]
}

export function EditCourseClient({ course, initialLessons }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    min_tier: course.min_tier as SubscriptionTier,
    duration_hours: course.duration_hours ? String(course.duration_hours) : '',
    tags: (course.tags ?? []).join(', '),
    status: course.status,
  })
  const [lessons, setLessons] = useState<CourseLesson[]>(initialLessons)
  const [savingCourse, setSavingCourse] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [savingLesson, setSavingLesson] = useState(false)
  const [newLesson, setNewLesson] = useState({
    title: '', description: '', youtube_id: '', pdf_url: '', duration_seconds: '', is_preview: false,
  })

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function saveCourse(e: React.FormEvent) {
    e.preventDefault()
    setSavingCourse(true)
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: form.title,
          description: form.description,
          instructor: form.instructor,
          min_tier: form.min_tier,
          duration_hours: form.duration_hours ? parseFloat(form.duration_hours) : null,
          tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          status: form.status,
          ...(form.status === 'published' ? { published_at: new Date().toISOString() } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', course.id)
      if (error) throw error
      toast.success('Course updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update course')
    } finally {
      setSavingCourse(false)
    }
  }

  async function deleteCourse() {
    const confirmed = confirm(`Delete "${course.title}" and all its lessons? This cannot be undone.`)
    if (!confirmed) return
    setDeletingCourse(true)
    try {
      const { error } = await supabase.from('courses').delete().eq('id', course.id)
      if (error) throw error
      toast.success('Course deleted')
      router.push('/admin/courses')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete course')
    } finally {
      setDeletingCourse(false)
    }
  }

  async function addLesson() {
    if (!newLesson.title) { toast.error('Lesson title is required'); return }
    setSavingLesson(true)
    try {
      const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order_index)) + 1 : 0
      const { data, error } = await supabase
        .from('course_lessons')
        .insert({
          course_id: course.id,
          title: newLesson.title,
          description: newLesson.description || null,
          youtube_id: newLesson.youtube_id || null,
          pdf_url: newLesson.pdf_url || null,
          duration_seconds: newLesson.duration_seconds ? parseInt(newLesson.duration_seconds) : null,
          is_preview: newLesson.is_preview,
          order_index: nextOrder,
        })
        .select()
        .single()
      if (error) throw error

      const updated = [...lessons, data]
      setLessons(updated)
      await supabase.from('courses').update({ total_lessons: updated.length }).eq('id', course.id)

      setNewLesson({ title: '', description: '', youtube_id: '', pdf_url: '', duration_seconds: '', is_preview: false })
      setShowLessonForm(false)
      toast.success('Lesson added!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add lesson')
    } finally {
      setSavingLesson(false)
    }
  }

  async function deleteLesson(lessonId: string) {
    const confirmed = confirm('Delete this lesson?')
    if (!confirmed) return
    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId)
      if (error) throw error
      const updated = lessons.filter(l => l.id !== lessonId)
      setLessons(updated)
      await supabase.from('courses').update({ total_lessons: updated.length }).eq('id', course.id)
      toast.success('Lesson deleted')
    } catch {
      toast.error('Failed to delete lesson')
    }
  }

  async function togglePreview(lessonId: string, current: boolean) {
    await supabase.from('course_lessons').update({ is_preview: !current }).eq('id', lessonId)
    setLessons(prev => prev.map(l => l.id === lessonId ? { ...l, is_preview: !current } : l))
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Edit Course</h2>
          <p className="text-[var(--color-mist)] mt-1">{lessons.length} lessons</p>
        </div>
        <button onClick={deleteCourse} disabled={deletingCourse}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-ember)]/20 text-[var(--color-ember)] text-sm font-medium hover:bg-[var(--color-ember)]/5 disabled:opacity-50 transition-all">
          {deletingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Course
        </button>
      </div>

      {/* Course details */}
      <form onSubmit={saveCourse} className="bg-card rounded-2xl p-6 flex flex-col gap-5 mb-8">
        <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">Course Details</h3>
        <div>
          <label className={labelClass}>Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description *</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3} className={inputClass + ' resize-none'} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Instructor</label>
            <input value={form.instructor} onChange={e => set('instructor', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Duration (hours)</label>
            <input type="number" step="0.5" value={form.duration_hours} onChange={e => set('duration_hours', e.target.value)} className={inputClass} />
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
            <input value={form.tags} onChange={e => set('tags', e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-3">
            {['draft', 'published', 'archived'].map(s => (
              <button key={s} type="button" onClick={() => set('status', s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  form.status === s ? 'bg-[var(--color-gold)] text-[var(--color-night)]' : 'border border-white/10 text-[var(--color-mist)]'
                }`}>{s}</button>
            ))}
          </div>
          <button type="submit" disabled={savingCourse}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
            {savingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Course
          </button>
        </div>
      </form>

      {/* Lessons */}
      <div className="bg-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">Lessons</h3>
          <button onClick={() => setShowLessonForm(!showLessonForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-xs font-medium hover:bg-[var(--color-gold)]/20 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </button>
        </div>

        {showLessonForm && (
          <div className="bg-[var(--color-ink)] rounded-xl p-5 mb-5 flex flex-col gap-3 border border-[var(--color-gold)]/15">
            <div className="flex items-center justify-between">
              <p className="text-[var(--color-pearl)] text-sm font-medium">New Lesson</p>
              <button onClick={() => setShowLessonForm(false)} className="text-[var(--color-mist)] hover:text-[var(--color-pearl)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input value={newLesson.title} onChange={e => setNewLesson(l => ({ ...l, title: e.target.value }))}
              placeholder="Lesson title *" className={inputClass} />
            <textarea value={newLesson.description} onChange={e => setNewLesson(l => ({ ...l, description: e.target.value }))}
              placeholder="Lesson description" rows={2} className={inputClass + ' resize-none'} />
            <div className="grid sm:grid-cols-2 gap-3">
              <input value={newLesson.youtube_id} onChange={e => setNewLesson(l => ({ ...l, youtube_id: e.target.value }))}
                placeholder="YouTube video ID" className={inputClass} />
              <input type="number" value={newLesson.duration_seconds} onChange={e => setNewLesson(l => ({ ...l, duration_seconds: e.target.value }))}
                placeholder="Duration (seconds)" className={inputClass} />
            </div>
            <input value={newLesson.pdf_url} onChange={e => setNewLesson(l => ({ ...l, pdf_url: e.target.value }))}
              placeholder="PDF notes URL (optional)" className={inputClass} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newLesson.is_preview}
                onChange={e => setNewLesson(l => ({ ...l, is_preview: e.target.checked }))}
                className="w-4 h-4 accent-[var(--color-gold)]" />
              <span className="text-sm text-[var(--color-mist)]">Make this a free preview lesson</span>
            </label>
            <button onClick={addLesson} disabled={savingLesson}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-all">
              {savingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Add Lesson
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/2">
              <GripVertical className="w-4 h-4 text-[var(--color-slate)] shrink-0" />
              <span className="w-6 h-6 rounded-full bg-white/5 text-[var(--color-mist)] text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--color-pearl)] text-sm font-medium truncate">{lesson.title}</p>
                {lesson.duration_seconds && (
                  <p className="text-[var(--color-slate)] text-xs">{Math.floor(lesson.duration_seconds / 60)} min</p>
                )}
              </div>
              <button onClick={() => togglePreview(lesson.id, lesson.is_preview)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 transition-all ${
                  lesson.is_preview ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-[var(--color-mist)]'
                }`}>
                {lesson.is_preview ? 'Preview' : 'Locked'}
              </button>
              <button onClick={() => deleteLesson(lesson.id)} className="text-[var(--color-mist)] hover:text-[var(--color-ember)] transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {lessons.length === 0 && !showLessonForm && (
          <p className="text-center text-[var(--color-mist)] text-sm py-8">No lessons yet. Add your first lesson above.</p>
        )}
      </div>
    </div>
  )
}
