'use client'

import { useState } from 'react'
import { Lock, Check, PlayCircle, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Course, CourseLesson, CourseProgress } from '@/types'

interface Props {
  course: Course
  lessons: CourseLesson[]
  hasAccess: boolean
  initialProgress: CourseProgress | null
  userId: string
}

export function CoursePlayerClient({ course, lessons, hasAccess, initialProgress, userId }: Props) {
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(
    lessons.find(l => l.is_preview) ?? lessons[0] ?? null
  )
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(initialProgress?.completed_lesson_ids ?? [])
  )
  const supabase = createClient()

  async function markComplete(lessonId: string) {
    const newCompleted = new Set(completed)
    newCompleted.add(lessonId)
    setCompleted(newCompleted)

    const percent = (newCompleted.size / lessons.length) * 100

    await supabase.from('course_progress').upsert({
      user_id: userId,
      course_id: course.id,
      lesson_id: lessonId,
      completed_lesson_ids: Array.from(newCompleted),
      percent_complete: percent,
      last_watched_at: new Date().toISOString(),
    }, { onConflict: 'user_id,course_id' })
  }

  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-spirit)]/15 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-[var(--color-spirit-light)]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-3">{course.title}</h1>
        <p className="text-[var(--color-mist)] mb-6">
          This course requires the <strong className="text-[var(--color-gold)] capitalize">{course.min_tier.replace('_', ' ')}</strong> plan or higher.
        </p>
        <a href="/settings#upgrade" className="px-6 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity inline-block">
          Upgrade Plan
        </a>
      </div>
    )
  }

  const percentComplete = lessons.length > 0 ? Math.round((completed.size / lessons.length) * 100) : 0

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)]">{course.title}</h2>
        <p className="text-[var(--color-mist)] text-sm mt-1">{course.instructor} · {lessons.length} lessons</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Player */}
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-2xl overflow-hidden bg-[var(--color-ink)] mb-4">
            {activeLesson?.youtube_id ? (
              <iframe
                src={`https://www.youtube.com/embed/${activeLesson.youtube_id}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-mist)]">
                Select a lesson to begin
              </div>
            )}
          </div>

          {activeLesson && (
            <div className="bg-card rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2">{activeLesson.title}</h3>
              {activeLesson.description && <p className="text-[var(--color-mist)] text-sm leading-relaxed mb-4">{activeLesson.description}</p>}
              <div className="flex gap-3">
                <button onClick={() => markComplete(activeLesson.id)}
                  disabled={completed.has(activeLesson.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    completed.has(activeLesson.id)
                      ? 'bg-green-500/10 text-green-400 cursor-default'
                      : 'bg-[var(--color-gold)] text-[var(--color-night)] hover:opacity-90'
                  }`}>
                  <Check className="w-4 h-4" />
                  {completed.has(activeLesson.id) ? 'Completed' : 'Mark Complete'}
                </button>
                {activeLesson.pdf_url && (
                  <a href={activeLesson.pdf_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[var(--color-mist)] text-sm font-medium hover:border-[var(--color-gold)]/30 transition-all">
                    <FileText className="w-4 h-4" /> Download Notes
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lesson List */}
        <div>
          <div className="bg-card rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--color-mist)] text-sm">Progress</span>
              <span className="text-[var(--color-gold)] font-semibold text-sm">{percentComplete}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[var(--color-gold)] transition-all" style={{ width: `${percentComplete}%` }} />
            </div>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden">
            {lessons.map((lesson, i) => (
              <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/5 last:border-0 transition-colors ${
                  activeLesson?.id === lesson.id ? 'bg-[var(--color-gold)]/10' : 'hover:bg-white/2'
                }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  completed.has(lesson.id) ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-[var(--color-mist)]'
                }`}>
                  {completed.has(lesson.id) ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${activeLesson?.id === lesson.id ? 'text-[var(--color-gold)]' : 'text-[var(--color-pearl)]'}`}>
                    {lesson.title}
                  </p>
                  {lesson.duration_seconds && (
                    <p className="text-[var(--color-slate)] text-xs">{Math.floor(lesson.duration_seconds / 60)} min</p>
                  )}
                </div>
                <PlayCircle className="w-4 h-4 text-[var(--color-mist)] shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
