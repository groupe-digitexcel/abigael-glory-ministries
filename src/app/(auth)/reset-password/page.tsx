'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Mail, Loader2, Check, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const isResetMode = params.get('mode') === 'update'

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?mode=update`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password updated! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-10 pr-4 py-3 bg-[var(--color-ink)] border border-white/10 rounded-xl text-[var(--color-pearl)] placeholder:text-[var(--color-slate)] focus:outline-none focus:border-[var(--color-gold)]/50 transition-colors text-sm"

  if (isResetMode) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-2">Set New Password</h1>
        <p className="text-[var(--color-mist)] mb-8">Choose a new password for your account.</p>
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters" required minLength={8} className={inputClass} />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Update Password
          </button>
        </form>
      </motion.div>
    )
  }

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[var(--color-gold)]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-2">Check Your Email</h2>
        <p className="text-[var(--color-mist)]">
          We sent a password reset link to <strong className="text-[var(--color-pearl)]">{email}</strong>.
        </p>
        <Link href="/login" className="text-[var(--color-gold)] text-sm mt-6 inline-block hover:underline">
          Back to Sign In
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-[var(--color-pearl)] mb-2">Reset Password</h1>
      <p className="text-[var(--color-mist)] mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-mist)] mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-mist)]" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required className={inputClass} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send Reset Link
        </button>
        <Link href="/login" className="text-center text-[var(--color-mist)] text-sm hover:text-[var(--color-gold)] transition-colors">
          Back to Sign In
        </Link>
      </form>
    </motion.div>
  )
}
