import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, BookOpen } from 'lucide-react'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  const { data: courses, count } = await supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .order('order_index', { ascending: true })

  const STATUS_COLORS: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400',
    draft: 'bg-amber-500/10 text-amber-400',
    archived: 'bg-white/5 text-[var(--color-slate)]',
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Courses</h2>
          <p className="text-[var(--color-mist)] mt-1">{count ?? 0} total courses</p>
        </div>
        <Link href="/admin/courses/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(courses ?? []).map((course) => (
          <div key={course.id} className="bg-card rounded-2xl overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[var(--color-spirit)]/20 to-[var(--color-gold)]/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[var(--color-gold)]/50" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[course.status]}`}>{course.status}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] capitalize">{course.min_tier.replace('_', ' ')}</span>
              </div>
              <h3 className="font-display font-semibold text-[var(--color-pearl)] mb-1">{course.title}</h3>
              <p className="text-[var(--color-mist)] text-xs mb-3">{course.total_lessons} lessons · {course.instructor}</p>
              <Link href={`/admin/courses/${course.id}/edit`}
                className="flex items-center gap-1.5 text-[var(--color-gold)] text-xs font-medium hover:underline">
                <Edit className="w-3 h-3" /> Edit Course
              </Link>
            </div>
          </div>
        ))}
      </div>

      {(!courses || courses.length === 0) && (
        <p className="text-center text-[var(--color-mist)] py-16">No courses yet. Create your first one!</p>
      )}
    </div>
  )
}
