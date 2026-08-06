'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export function PrayerCTASection() {
  return (
    <section className="section-padding relative z-10">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 lg:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(107,92,231,0.15) 0%, rgba(212,168,67,0.1) 100%)',
            border: '1px solid rgba(212,168,67,0.2)',
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(107,92,231,0.1) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[var(--color-spirit)]/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-7 h-7 text-[var(--color-spirit-light)]" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">
              Need Prayer?
            </h2>
            <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto mb-8">
              Our community is praying. Submit your request and let thousands of believers
              stand with you before the throne of grace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/prayer"
                className="px-8 py-4 rounded-xl bg-[var(--color-spirit)] text-white font-semibold hover:bg-[var(--color-spirit-light)] transition-colors"
              >
                Submit Prayer Request
              </Link>
              <Link
                href="/prayer"
                className="px-8 py-4 rounded-xl border border-white/15 text-[var(--color-pearl)] font-medium hover:border-[var(--color-spirit)]/40 hover:bg-white/5 transition-all"
              >
                Pray for Others
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
