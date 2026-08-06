import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'

const TIER_COLORS: Record<string, string> = {
  free: 'bg-white/10 text-[var(--color-mist)]',
  believer: 'bg-blue-500/10 text-blue-400',
  disciple: 'bg-[var(--color-spirit)]/10 text-[var(--color-spirit-light)]',
  partner: 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]',
  kingdom_builder: 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]',
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tier?: string; page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams
  const q = params.q ?? ''
  const tier = params.tier ?? ''
  const page = parseInt(params.page ?? '1')
  const perPage = 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, tier, role, country, created_at, email_verified', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
  if (tier) query = query.eq('tier', tier)

  const { data: users, count } = await query
  const totalPages = Math.ceil((count ?? 0) / perPage)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Members</h2>
          <p className="text-[var(--color-mist)] mt-1">{count?.toLocaleString()} total members</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form className="flex-1 relative" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
          <input name="q" defaultValue={q} placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] text-sm focus:outline-none focus:border-[var(--color-gold)]/50 placeholder:text-[var(--color-slate)]" />
          {tier && <input type="hidden" name="tier" value={tier} />}
        </form>
        <form method="GET">
          <select name="tier" defaultValue={tier}
            onChange={(e) => (e.target.form as HTMLFormElement).submit()}
            className="px-4 py-2.5 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-mist)] text-sm focus:outline-none">
            <option value="">All Plans</option>
            {['free', 'believer', 'disciple', 'partner', 'kingdom_builder'].map(t => (
              <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>
            ))}
          </select>
          {q && <input type="hidden" name="q" value={q} />}
        </form>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Member', 'Email', 'Plan', 'Role', 'Country', 'Verified', 'Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[var(--color-mist)] font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 cursor-pointer">
                  <td className="px-5 py-4 text-[var(--color-pearl)] font-medium">{u.full_name ?? '—'}</td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${TIER_COLORS[u.tier] ?? ''}`}>
                      {u.tier?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' || u.role === 'super_admin' ? 'bg-[var(--color-ember)]/10 text-[var(--color-ember)]' : 'bg-white/5 text-[var(--color-mist)]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">{u.country ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs ${u.email_verified ? 'text-green-400' : 'text-[var(--color-ember)]'}`}>
                      {u.email_verified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-mist)]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10).map((p) => (
            <a key={p} href={`?page=${p}${q ? `&q=${q}` : ''}${tier ? `&tier=${tier}` : ''}`}
              className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                p === page
                  ? 'bg-[var(--color-gold)] text-[var(--color-night)] font-semibold'
                  : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)] hover:bg-white/5'
              }`}>
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
