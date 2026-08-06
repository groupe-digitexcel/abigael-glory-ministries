'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { DollarSign, Calendar, Share2, TrendingUp } from 'lucide-react'

// ─── Donation Section ──────────────────────────────────────
export function DonationSection() {
  return (
    <section className="section-padding relative z-10 bg-[var(--color-deep)]/40">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
              Give
            </p>
            <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-4">
              Partner in the Harvest
            </h2>
            <p className="text-[var(--color-mist)] leading-relaxed mb-6">
              Your giving funds sermon production, course development, and ministry outreach
              that reaches people across 50+ countries every month. Every dollar plants a seed in eternity.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { amount: '$10', impact: 'Reaches 50 people' },
                { amount: '$25', impact: 'Funds a devotional' },
                { amount: '$100', impact: 'Produces a sermon' },
              ].map((item) => (
                <div key={item.amount} className="bg-card rounded-xl p-4 text-center">
                  <div className="font-display text-xl font-bold text-gradient-gold">{item.amount}</div>
                  <div className="text-[var(--color-mist)] text-xs mt-1">{item.impact}</div>
                </div>
              ))}
            </div>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity"
            >
              <DollarSign className="w-4 h-4" />
              Give Now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-8 border border-[var(--color-gold)]/15"
          >
            <h3 className="font-display text-xl font-bold text-[var(--color-pearl)] mb-6">
              Ministry Impact This Year
            </h3>
            {[
              { label: 'People Reached', value: '127,000+' },
              { label: 'Countries', value: '52' },
              { label: 'Sermons Delivered', value: '520+' },
              { label: 'Prayer Requests Answered', value: '3,400+' },
              { label: 'Disciples Trained', value: '890+' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <span className="text-[var(--color-mist)] text-sm">{stat.label}</span>
                <span className="font-display font-bold text-[var(--color-gold)]">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Events Preview Section ───────────────────────────────
const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'African Evangelism Summit 2026',
    date: 'July 15–17, 2026',
    location: 'Online + Douala, Cameroon',
    type: 'Hybrid',
  },
  {
    id: '2',
    title: 'Prayer & Fasting Weekend',
    date: 'July 25–27, 2026',
    location: 'Online',
    type: 'Online',
  },
  {
    id: '3',
    title: 'Discipleship Intensive',
    date: 'August 10, 2026',
    location: 'Online',
    type: 'Online',
  },
]

export function EventsPreviewSection() {
  return (
    <section className="section-padding relative z-10">
      <div className="container-max">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">
              Events
            </p>
            <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)]">
              Join Us Live
            </h2>
          </motion.div>
          <Link href="/events" className="text-[var(--color-gold)] text-sm font-medium hover:underline">
            All Events →
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {UPCOMING_EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/events/${event.id}`} className="group">
                <div className="bg-card bg-card-hover rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[var(--color-gold)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--color-pearl)] group-hover:text-[var(--color-gold)] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-[var(--color-mist)] text-sm mt-1">
                      {event.date} · {event.location}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${
                    event.type === 'Online'
                      ? 'bg-[var(--color-spirit)]/15 text-[var(--color-spirit-light)]'
                      : 'bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Affiliate CTA Section ────────────────────────────────
export function AffiliateCTASection() {
  return (
    <section className="section-padding relative z-10">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-10 lg:p-16 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(107,92,231,0.12) 100%)',
            border: '1px solid rgba(212,168,67,0.15)',
          }}
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-sm font-medium mb-6">
                <Share2 className="w-3.5 h-3.5" />
                Affiliate Program
              </div>
              <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-4">
                Earn While You Share the Gospel
              </h2>
              <p className="text-[var(--color-mist)] leading-relaxed mb-6">
                Kingdom Builders earn 30% commission on every subscription they refer.
                Share your unique link, grow the Kingdom, and build a passive income stream.
              </p>
              <Link
                href="/affiliate"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity"
              >
                <TrendingUp className="w-4 h-4" />
                Join the Program
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '30%', desc: 'Commission per referral' },
                { label: '$0', desc: 'Cost to join' },
                { label: 'Monthly', desc: 'Payout schedule' },
                { label: 'Chariow', desc: 'Payout method' },
              ].map((item) => (
                <div key={item.label} className="bg-[var(--color-night)]/50 rounded-2xl p-5 text-center">
                  <div className="font-display text-2xl font-bold text-gradient-gold">{item.label}</div>
                  <div className="text-[var(--color-mist)] text-xs mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
