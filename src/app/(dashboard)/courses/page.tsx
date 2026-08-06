import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Lock, Clock, BookOpen } from 'lucide-react'
import { TIER_HIERARCHY, type SubscriptionTier } from '@/types'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  const userTier = (profile?.tier ?? 'free') as SubscriptionTier
  const userTierLevel = TIER_HIERARCHY[userTier]

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, description, instructor, min_tier, total_lessons, duration_hours, tags')
    .eq('status', 'published')
    .order('order_index', { ascending: true })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-1">Courses</h2>
        <p className="text-[var(--color-mist)]">Structured discipleship, one lesson at a time.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(courses ?? []).map((course) => {
          const hasAccess = userTierLevel >= TIER_HIERARCHY[course.min_tier as SubscriptionTier]
          return (
            <Link key={course.id} href={hasAccess ? `/courses/${course.id}` : '/settings#upgrade'} className="group block">
              <div className="bg-card bg-card-hover rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-[var(--color-spirit)]/25 to-[var(--color-gold)]/15 flex items-center justify-center relative">
                  {hasAccess ? (
                    <GraduationCap className="w-10 h-10 text-[var(--color-gold)]/60" />
                  ) : (
                    <Lock className="w-8 h-8 text-[var(--color-mist)]" />
                  )}
                  {!hasAccess && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[var(--color-spirit)] text-white text-xs font-semibold">
                      Upgrade
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors mb-2">
                    {course.title}
                  </h3>
                  <p className="text-[var(--color-mist)] text-sm line-clamp-2 mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between text-[var(--color-slate)] text-xs">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.total_lessons} lessons</span>
                    {course.duration_hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration_hours}h</span>}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {(!courses || courses.length === 0) && (
        <p className="text-center text-[var(--color-mist)] py-16">No courses published yet.</p>
      )}
    </div>
  )
}
