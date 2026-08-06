import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditCourseClient } from '@/components/admin/EditCourseClient'

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: course } = await supabase.from('courses').select('*').eq('id', id).single()
  if (!course) notFound()

  const { data: lessons } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true })

  return <EditCourseClient course={course} initialLessons={lessons ?? []} />
}
