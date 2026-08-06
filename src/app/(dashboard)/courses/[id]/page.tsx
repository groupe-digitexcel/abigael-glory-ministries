import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CoursePlayerClient } from '@/components/course/CoursePlayerClient'
import { TIER_HIERARCHY, type SubscriptionTier } from '@/types'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single()
  const userTier = (profile?.tier ?? 'free') as SubscriptionTier

  const { data: course } = await supabase.from('courses').select('*').eq('id', id).eq('status', 'published').single()
  if (!course) notFound()

  const hasAccess = TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[course.min_tier as SubscriptionTier]

  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })

  const { data: progress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', id)
    .maybeSingle()

  return (
    <CoursePlayerClient
      course={course}
      lessons={lessons ?? []}
      hasAccess={hasAccess}
      initialProgress={progress}
      userId={user.id}
    />
  )
}
