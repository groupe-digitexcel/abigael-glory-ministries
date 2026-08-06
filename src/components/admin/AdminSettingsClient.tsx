'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  settings: Record<string, any>
}

export function AdminSettingsClient({ settings }: Props) {
  const supabase = createClient()
  const [general, setGeneral] = useState(settings.general ?? { site_name: '', tagline: '', contact_email: '' })
  const [features, setFeatures] = useState(settings.features ?? {})
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      await supabase.from('site_settings').upsert([
        { id: 'general', value: general, updated_at: new Date().toISOString() },
        { id: 'features', value: features, updated_at: new Date().toISOString() },
      ])
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

  const FEATURE_FLAGS = [
    { key: 'prayer_wall', label: 'Public Prayer Wall' },
    { key: 'affiliate_program', label: 'Affiliate Program' },
    { key: 'ai_devotionals', label: 'AI Devotional Generator' },
    { key: 'live_stream', label: 'Live Stream' },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Site Settings</h2>
        <p className="text-[var(--color-mist)] mt-1">Control global ministry platform configuration.</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)]">General</h3>
          <div>
            <label className={labelClass}>Site Name</label>
            <input value={general.site_name ?? ''} onChange={e => setGeneral((g: any) => ({ ...g, site_name: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input value={general.tagline ?? ''} onChange={e => setGeneral((g: any) => ({ ...g, tagline: e.target.value }))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Email</label>
            <input value={general.contact_email ?? ''} onChange={e => setGeneral((g: any) => ({ ...g, contact_email: e.target.value }))} className={inputClass} />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-3">
          <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2">Feature Flags</h3>
          {FEATURE_FLAGS.map((flag) => (
            <label key={flag.key} className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-[var(--color-mist)] text-sm">{flag.label}</span>
              <div onClick={() => setFeatures((f: any) => ({ ...f, [flag.key]: !f[flag.key] }))}
                className={`w-10 h-5 rounded-full transition-all relative ${features[flag.key] ? 'bg-[var(--color-gold)]' : 'bg-white/10'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${features[flag.key] ? 'left-5' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>

        <button onClick={save} disabled={saving}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Settings
        </button>
      </div>
    </div>
  )
}
