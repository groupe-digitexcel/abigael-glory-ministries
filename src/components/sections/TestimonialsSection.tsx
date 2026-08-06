'use client'

import { motion } from 'motion/react'
import { Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Chioma A.',
    country: 'Nigeria',
    tier: 'Disciple',
    text: 'AGM changed my quiet time completely. The daily devotionals and sermon library have grown my faith more in 3 months than in years of sporadic church attendance.',
  },
  {
    name: 'Pierre M.',
    country: 'DR Congo',
    tier: 'Partner',
    text: "I joined the partner tier to support the ministry but I'm the one who has been richly blessed. The prayer calls and exclusive teachings are absolutely worth it.",
  },
  {
    name: 'Grace O.',
    country: 'Ghana',
    tier: 'Kingdom Builder',
    text: "The affiliate program lets me earn while I share the Gospel. I've referred 14 friends and my commission pays for my subscription with income left over. Kingdom economy!",
  },
  {
    name: 'Samuel K.',
    country: 'Kenya',
    tier: 'Believer',
    text: 'Five dollars a month for this level of depth and anointing? I tell everyone I know about AGM. The sermon vault alone is worth 10x the price.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding relative z-10 bg-[var(--color-deep)]/40">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            Testimonies
          </p>
          <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)]">
            Lives Being Transformed
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 flex flex-col gap-4"
            >
              <Quote className="w-6 h-6 text-[var(--color-gold)]/40" />
              <p className="text-[var(--color-mist)] text-sm leading-relaxed flex-1">{t.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[var(--color-pearl)] text-sm font-semibold">{t.name}</p>
                  <p className="text-[var(--color-mist)] text-xs">{t.country}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] font-medium">
                  {t.tier}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
