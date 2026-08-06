'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { Loader2, User, Crown, CreditCard, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PRICING_TIERS, type Profile, type Subscription } from '@/types'
import Link from 'next/link'

interface Props {
  profile: Profile | null
  subscription: Subscription | null
}

const TIER_LABELS: Record<string, string> = {
  free: 'Seeker (Free)',
  believer: 'Believer — $5/mo',
  disciple: 'Disciple — $10/mo',
  partner: 'Partner — $25/mo',
  kingdom_builder: 'Kingdom Builder — $49/mo',
}

export function SettingsClient({ profile, subscription }: Props) {
  const supabase = createClient()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [country, setCountry] = useState(profile?.country ?? '')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'security'>('profile')

  async function saveProfile() {
    if (!profile) return
    setSaving(true)
    try {
      const { error } = await supabase.from('profiles')
        .update({ full_name: fullName, bio, country, updated_at: new Date().toISOString() })
        .eq('id', profile.id)
      if (error) throw error
      toast.success('Profile updated!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  async function cancelSubscription() {
    const confirmed = confirm('Are you sure? Your access continues until the end of this billing period.')
    if (!confirmed) return
    try {
      await fetch('/api/subscriptions', { method: 'DELETE' })
      toast.success('Subscription cancelled. Access continues until period end.')
    } catch {
      toast.error('Cancellation failed')
    }
  }

  const inputClass = "w-full px-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
  const labelClass = "block text-sm font-medium text-[var(--color-mist)] mb-1.5"

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-[var(--color-pearl)]">Settings</h2>
        <p className="text-[var(--color-mist)] mt-1">Manage your account and subscription.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--color-ink)] rounded-xl p-1 mb-8">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--color-gold)] text-[var(--color-night)]'
                : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="bg-card rounded-2xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center text-[var(--color-night)] font-bold text-2xl shrink-0">
              {(profile?.full_name ?? profile?.email ?? 'U')[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-[var(--color-pearl)] font-semibold">{profile?.full_name ?? 'Member'}</p>
              <p className="text-[var(--color-mist)] text-sm">{profile?.email}</p>
              <p className="text-[var(--color-gold)] text-xs mt-0.5 capitalize">{profile?.tier?.replace('_', ' ')} plan</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} placeholder="e.g. Cameroon" />
            </div>
            <div>
              <label className={labelClass}>Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className={inputClass + ' resize-none'} placeholder="A short bio..." />
            </div>
            <button onClick={saveProfile} disabled={saving}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <div className="bg-card rounded-2xl p-6 border border-[var(--color-gold)]/15">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-[var(--color-gold)]" />
              <h3 className="font-display text-lg font-bold text-[var(--color-pearl)]">Current Plan</h3>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/5">
              <span className="text-[var(--color-mist)] text-sm">Plan</span>
              <span className="text-[var(--color-gold)] font-semibold capitalize">{TIER_LABELS[profile?.tier ?? 'free']}</span>
            </div>
            {subscription && (
              <>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[var(--color-mist)] text-sm">Status</span>
                  <span className="text-green-400 text-sm font-medium capitalize">{subscription.status}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-[var(--color-mist)] text-sm">Billing Cycle</span>
                  <span className="text-[var(--color-pearl)] text-sm capitalize">{subscription.billing_cycle}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[var(--color-mist)] text-sm">Next billing</span>
                  <span className="text-[var(--color-pearl)] text-sm">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Upgrade options */}
          <div id="upgrade">
            <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-4">Upgrade Your Plan</h3>
            <div className="flex flex-col gap-3">
              {PRICING_TIERS.filter(t => t.id !== 'free' && t.id !== profile?.tier).map(tier => (
                <Link key={tier.id}
                  href={`/register?tier=${tier.id}&billing=monthly`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-gold)]/15 bg-[var(--color-gold)]/5 hover:border-[var(--color-gold)]/35 hover:bg-[var(--color-gold)]/10 transition-all">
                  <div>
                    <p className="text-[var(--color-pearl)] font-semibold">{tier.name}</p>
                    <p className="text-[var(--color-mist)] text-xs mt-0.5">{tier.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[var(--color-gold)] font-bold">${tier.price_monthly}/mo</p>
                    <p className="text-[var(--color-mist)] text-xs">${tier.price_annual}/yr</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {subscription && (
            <button onClick={cancelSubscription}
              className="py-3 rounded-xl border border-[var(--color-ember)]/20 text-[var(--color-ember)] text-sm font-medium hover:bg-[var(--color-ember)]/5 transition-all">
              Cancel Subscription
            </button>
          )}
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-2">Security</h3>
          <div className="flex items-center justify-between py-3 border-b border-white/5">
            <div>
              <p className="text-[var(--color-pearl)] text-sm font-medium">Email</p>
              <p className="text-[var(--color-mist)] text-xs">{profile?.email}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${profile?.email_verified ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {profile?.email_verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.updateUser({ password: undefined })
              await supabase.auth.resetPasswordForEmail(profile?.email ?? '')
              toast.success('Password reset email sent!')
            }}
            className="py-3 rounded-xl border border-white/10 text-[var(--color-mist)] text-sm font-medium hover:border-[var(--color-gold)]/20 hover:text-[var(--color-pearl)] transition-all">
            Send Password Reset Email
          </button>
          <button
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            className="py-3 rounded-xl border border-[var(--color-ember)]/20 text-[var(--color-ember)] text-sm font-medium hover:bg-[var(--color-ember)]/5 transition-all">
            Sign Out of All Devices
          </button>
        </motion.div>
      )}
    </div>
  )
}
