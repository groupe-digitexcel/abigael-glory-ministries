import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  const supabase = await createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { data: lastLesson } = await supabase
    .from('course_lessons')
    .select('order_index')
    .eq('course_id', courseId)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (lastLesson?.order_index ?? -1) + 1

  const { data: lesson, error } = await supabase
    .from('course_lessons')
    .insert({ ...body, course_id: courseId, order_index: nextOrder })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { count } = await supabase
    .from('course_lessons')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', courseId)

  await supabase.from('courses').update({ total_lessons: count ?? 0 }).eq('id', courseId)

  return NextResponse.json({ lesson })
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ lessons: data })
}
