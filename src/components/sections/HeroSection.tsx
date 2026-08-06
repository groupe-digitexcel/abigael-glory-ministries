'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Play, ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-20">
      {/* Background radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(107,92,231,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-gold) 1px, transparent 1px), linear-gradient(90deg, var(--color-gold) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-max relative z-10 py-20 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/5 text-[var(--color-gold)] text-sm font-medium mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Digital Evangelism — Reaching the World from Africa
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] mb-6"
        >
          <span className="text-[var(--color-pearl)]">The Gospel</span>
          <br />
          <span className="text-gradient-gold">Has No Borders</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[var(--color-mist)] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Sermons, discipleship courses, and a praying community — all in one place.
          Grow in faith wherever you are in the world.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold text-base hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--color-gold)]/25"
          >
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/sermons"
            className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-[var(--color-pearl)] font-medium text-base hover:border-[var(--color-gold)]/30 hover:bg-white/5 transition-all"
          >
            <Play className="w-4 h-4 text-[var(--color-gold)]" />
            Watch a Sermon
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: '500+', label: 'Sermons' },
            { value: '30+', label: 'Courses' },
            { value: '10K+', label: 'Members' },
            { value: '50+', label: 'Countries' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-[var(--color-mist)] text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 border-[var(--color-gold)]/30 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[var(--color-gold)] opacity-60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
