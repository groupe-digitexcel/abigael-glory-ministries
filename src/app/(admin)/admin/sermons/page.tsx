import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Eye, Trash2 } from 'lucide-react'

export default async function AdminSermonsPage() {
  const supabase = await createClient()

  const { data: sermons, count } = await supabase
    .from('sermons')
    .select('id, title, speaker, series_name, min_tier, status, view_count, published_at, duration_seconds', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const STATUS_COLORS: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400',
    draft: 'bg-amber-500/10 text-amber-400',
    archived: 'bg-white/5 text-[var(--color-slate)]',
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Sermons</h2>
          <p className="text-[var(--color-mist)] mt-1">{count ?? 0} total sermons</p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Upload Sermon
        </Link>
      </div>

      <div className="bg-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Title', 'Speaker', 'Series', 'Min Tier', 'Status', 'Views', 'Published', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(sermons ?? []).map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/2">
                  <td className="px-5 py-4 text-[var(--color-pearl)] font-medium max-w-[200px] truncate">{s.title}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{s.speaker}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{s.series_name ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] capitalize">
                      {s.min_tier?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${STATUS_COLORS[s.status] ?? ''}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{(s.view_count ?? 0).toLocaleString()}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">
                    {s.published_at ? new Date(s.published_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/sermons/${s.id}/edit`} className="p-1.5 rounded-lg text-[var(--color-mist)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-all">
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <Link href={`/vault/${s.id}`} className="p-1.5 rounded-lg text-[var(--color-mist)] hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
