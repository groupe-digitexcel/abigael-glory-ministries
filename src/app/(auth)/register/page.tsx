'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { Eye, EyeOff, Loader2, User, Mail, Lock, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { PRICING_TIERS, type SubscriptionTier } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const params = useSearchParams()
  const defaultTier = (params.get('tier') as SubscriptionTier) ?? 'free'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(defaultTier)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, selected_tier: selectedTier },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setDone(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[var(--color-gold)]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-2">Check Your Email</h2>
        <p className="text-[var(--color-mist)]">
          We sent a confirmation to <strong className="text-[var(--color-pearl)]">{email}</strong>.
          Click the link to activate your account and start your journey.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-2">Create Your Account</h1>
      <p className="text-[var(--color-mist)] mb-6">
        Already have one?{' '}
        <Link href="/login" className="text-[var(--color-gold)] hover:underline">Sign in</Link>
      </p>

      {/* Tier Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-[var(--color-mist)] mb-2">Choose your plan</p>
        <div className="flex gap-2 flex-wrap">
          {PRICING_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedTier === tier.id
                  ? 'bg-[var(--color-gold)] border-[var(--color-gold)] text-[var(--color-night)]'
                  : 'border-white/10 text-[var(--color-mist)] hover:border-[var(--color-gold)]/30'
              }`}
            >
              {tier.name}
              {tier.price_monthly > 0 && (
                <span className="ml-1 opacity-70">${tier.price_monthly}/mo</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/15 text-[var(--color-pearl)] font-medium hover:border-[var(--color-gold)]/30 hover:bg-white/5 transition-all mb-5"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-4 mb-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[var(--color-mist)] text-xs">or register with email</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="w-full pl-10 pr-10 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mist)]"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-1"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Create Account
        </button>

        <p className="text-[var(--color-slate)] text-xs text-center">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="text-[var(--color-gold)] hover:underline">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[var(--color-gold)] hover:underline">Privacy Policy</Link>.
        </p>
      </form>
    </motion.div>
  )
}
