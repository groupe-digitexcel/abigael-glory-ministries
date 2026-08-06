import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name, email').eq('id', user.id).single()
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) redirect('/dashboard')

  return (
    <div className="min-h-dvh flex bg-[var(--color-night)] relative z-10">
      <AdminSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 flex items-center px-8 border-b border-white/5 bg-[var(--color-night)]/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-ember)]/15 text-[var(--color-ember)] font-semibold uppercase tracking-wide">
              {profile.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
            <span className="text-[var(--color-mist)] text-sm">{profile.full_name ?? profile.email}</span>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
