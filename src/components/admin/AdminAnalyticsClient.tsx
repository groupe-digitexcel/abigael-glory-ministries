'use client'

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const TIER_COLORS: Record<string, string> = {
  free: '#4A5568',
  believer: '#4299E1',
  disciple: '#6B5CE7',
  partner: '#D4A843',
  kingdom_builder: '#E85D3A',
}

const TIER_LABELS: Record<string, string> = {
  free: 'Seeker',
  believer: 'Believer',
  disciple: 'Disciple',
  partner: 'Partner',
  kingdom_builder: 'Kingdom Builder',
}

interface Props {
  revenueData: { month: string; donations: number; newUsers: number }[]
  tierCounts: Record<string, number>
}

export function AdminAnalyticsClient({ revenueData, tierCounts }: Props) {
  const pieData = Object.entries(tierCounts).map(([tier, count]) => ({
    name: TIER_LABELS[tier] ?? tier,
    value: count,
    fill: TIER_COLORS[tier] ?? '#4A5568',
  }))

  const tooltipStyle = {
    backgroundColor: 'var(--color-ink)',
    border: '1px solid rgba(212,168,67,0.2)',
    borderRadius: '12px',
    color: 'var(--color-pearl)',
    fontSize: '12px',
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue + Users chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6">
          <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-6">Monthly Donations ($)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#B8C0CC', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#B8C0CC', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(212,168,67,0.05)' }} />
              <Bar dataKey="donations" fill="#D4A843" radius={[6, 6, 0, 0]} name="Donations ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-2xl p-6">
          <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-6">New Members</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#B8C0CC', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#B8C0CC', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone" dataKey="newUsers" stroke="#6B5CE7"
                strokeWidth={2.5} dot={{ fill: '#6B5CE7', r: 4 }} name="New Members"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="bg-card rounded-2xl p-6">
        <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-6">Member Distribution by Plan</h3>
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-3">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: entry.fill }} />
                  <span className="text-[var(--color-mist)] text-sm">{entry.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-[var(--color-pearl)]">{entry.value.toLocaleString()}</span>
                  <span className="text-[var(--color-mist)] text-xs">
                    {((entry.value / (pieData.reduce((s, p) => s + p.value, 0) || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
