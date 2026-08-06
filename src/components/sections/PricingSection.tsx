'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Check, Crown, Sparkles } from 'lucide-react'
import { PRICING_TIERS } from '@/types'

export function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section id="pricing" className="section-padding relative z-10">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
            Simple Pricing
          </p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-4">
            Choose Your Journey
          </h2>
          <p className="text-[var(--color-mist)] text-lg max-w-xl mx-auto mb-8">
            Start free. Upgrade when you're ready. Every tier unlocks more of God's Word.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 bg-[var(--color-ink)] rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-[var(--color-gold)] text-[var(--color-night)]'
                  : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-[var(--color-gold)] text-[var(--color-night)]'
                  : 'text-[var(--color-mist)] hover:text-[var(--color-pearl)]'
              }`}
            >
              Annual
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${billing === 'annual' ? 'bg-[var(--color-night)]/30' : 'bg-[var(--color-spirit)]/20 text-[var(--color-spirit-light)]'}`}>
                Save 2 months
              </span>
            </button>
          </div>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PRICING_TIERS.map((tier, i) => {
            const price = billing === 'monthly' ? tier.price_monthly : Math.round(tier.price_annual / 12)
            const isHighlight = tier.highlight

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  isHighlight
                    ? 'bg-gradient-to-b from-[var(--color-spirit)]/20 to-[var(--color-gold)]/10 border-2 border-[var(--color-gold)]/50 shadow-[0_0_40px_rgba(212,168,67,0.15)]'
                    : 'bg-card border border-[var(--color-gold)]/10'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-gold)] text-[var(--color-night)] text-xs font-bold">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}

                {tier.id === 'kingdom_builder' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-spirit)] text-white text-xs font-bold">
                    <Crown className="w-3 h-3" /> Kingdom
                  </div>
                )}

                {/* Tier Name */}
                <div className="mb-4">
                  <h3 className="font-display text-lg font-bold text-[var(--color-pearl)] mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-[var(--color-mist)] text-xs">{tier.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {price === 0 ? (
                    <div className="font-display text-3xl font-bold text-gradient-gold">Free</div>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-[var(--color-mist)] text-sm">$</span>
                      <span className="font-display text-3xl font-bold text-gradient-gold">{price}</span>
                      <span className="text-[var(--color-mist)] text-xs mb-1">/mo</span>
                    </div>
                  )}
                  {billing === 'annual' && price > 0 && (
                    <p className="text-[var(--color-mist)] text-xs mt-1">
                      ${tier.price_annual}/year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[var(--color-mist)]">
                      <Check className="w-3.5 h-3.5 text-[var(--color-gold)] mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={price === 0 ? '/register' : `/register?tier=${tier.id}&billing=${billing}`}
                  className={`block text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isHighlight
                      ? 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] hover:opacity-90'
                      : price === 0
                      ? 'border border-white/15 text-[var(--color-pearl)] hover:border-[var(--color-gold)]/30 hover:bg-white/5'
                      : 'bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 text-[var(--color-gold)] hover:bg-[var(--color-gold)]/20'
                  }`}
                >
                  {tier.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[var(--color-mist)] text-sm mt-8"
        >
          All plans include a 7-day free trial on paid tiers. Cancel anytime. No questions asked.
        </motion.p>
      </div>
    </section>
  )
}
