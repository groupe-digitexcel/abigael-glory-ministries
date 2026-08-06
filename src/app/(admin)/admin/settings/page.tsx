import { createClient } from '@/lib/supabase/server'
import { AdminSettingsClient } from '@/components/admin/AdminSettingsClient'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('site_settings').select('*')

  const settingsMap = (settings ?? []).reduce<Record<string, any>>((acc, s) => {
    acc[s.id] = s.value
    return acc
  }, {})

  return <AdminSettingsClient settings={settingsMap} />
}
