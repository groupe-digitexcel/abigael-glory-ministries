'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ChevronDown, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const NAV_LINKS = [
  { label: 'Sermons', href: '/sermons' },
  { label: 'Courses', href: '/courses' },
  { label: 'Devotionals', href: '/devotionals' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Prayer', href: '/prayer' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    })
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-deep)]/95 backdrop-blur-xl border-b border-[var(--color-gold)]/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-max">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center">
              <Crown className="w-4 h-4 text-[var(--color-night)]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-sm text-[var(--color-gold)]">AGM</span>
              <span className="text-[10px] text-[var(--color-mist)] hidden sm:block tracking-widest uppercase">
                Abigael Glory Ministries
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--color-gold)] bg-[var(--color-gold)]/10'
                    : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)] hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/donate"
              className="text-sm text-[var(--color-gold)] hover:text-[var(--color-gold-light)] font-medium transition-colors"
            >
              Give
            </Link>
            {profile ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-medium hover:bg-[var(--color-gold)]/20 transition-all"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-night)] text-xs font-bold">
                  {(profile.full_name ?? profile.email)[0]?.toUpperCase()}
                </span>
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[var(--color-mist)] hover:text-[var(--color-pearl)] font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-mist)] hover:text-[var(--color-pearl)] hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[var(--color-deep)]/98 backdrop-blur-xl border-t border-[var(--color-gold)]/10"
          >
            <div className="container-max py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[var(--color-gold)] bg-[var(--color-gold)]/10'
                      : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
                <Link
                  href="/donate"
                  className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors"
                >
                  Give
                </Link>
                {profile ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 rounded-lg bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-sm font-medium text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="px-4 py-3 rounded-lg text-sm font-medium text-[var(--color-mist)] text-center">
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-3 rounded-lg bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] text-sm font-semibold text-center"
                    >
                      Join Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
