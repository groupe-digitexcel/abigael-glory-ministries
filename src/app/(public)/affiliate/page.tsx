import Link from 'next/link'
import { Share2, DollarSign, TrendingUp, Users, Check } from 'lucide-react'

export default function AffiliateLandingPage() {
  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-gold)]/10 flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-7 h-7 text-[var(--color-gold)]" />
          </div>
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">Affiliate Program</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-6">
            Earn While You Share the Gospel
          </h1>
          <p className="text-[var(--color-mist)] text-lg leading-relaxed">
            Kingdom Builder members earn 30% commission on every subscription they refer —
            for as long as that person stays a member. Turn your network into a Kingdom income stream.
          </p>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-16">
          {[
            { icon: DollarSign, value: '30%', label: 'Commission Rate' },
            { icon: Users, value: '$0', label: 'Cost to Join' },
            { icon: TrendingUp, value: 'Monthly', label: 'Payouts' },
            { icon: Share2, value: 'Lifetime', label: 'Per Referral' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-5 text-center">
              <stat.icon className="w-5 h-5 text-[var(--color-gold)] mx-auto mb-2" />
              <div className="font-display text-xl font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-[var(--color-mist)] text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 mb-12">
          <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-6">How It Works</h2>
          <div className="flex flex-col gap-5">
            {[
              { step: '1', title: 'Become a Kingdom Builder', text: 'Upgrade to the $49/month Kingdom Builder tier to unlock your affiliate dashboard.' },
              { step: '2', title: 'Get Your Referral Link', text: 'Receive a unique link to share with friends, family, and your community.' },
              { step: '3', title: 'Share & Earn', text: 'Every time someone subscribes through your link, you earn 30% of their payment, every month they stay subscribed.' },
              { step: '4', title: 'Get Paid', text: 'Request payout via Chariow once your earnings reach the minimum threshold.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-gold)] text-[var(--color-night)] font-bold text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-[var(--color-pearl)] font-semibold mb-1">{item.title}</h3>
                  <p className="text-[var(--color-mist)] text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--color-gold)]/10 to-[var(--color-spirit)]/10 border border-[var(--color-gold)]/15 rounded-2xl p-8 mb-12">
          <h3 className="font-display text-xl font-bold text-[var(--color-pearl)] mb-4">What's Included</h3>
          <ul className="flex flex-col gap-2.5">
            {[
              'Real-time referral and earnings dashboard',
              'Unique trackable referral link',
              'Lifetime commission on every referral (while they remain subscribed)',
              'Monthly payouts via Chariow',
              'Marketing materials and co-branded content',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[var(--color-mist)] text-sm">
                <Check className="w-4 h-4 text-[var(--color-gold)] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link href="/register?tier=kingdom_builder" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity">
            Become a Kingdom Builder — $49/mo
          </Link>
        </div>
      </div>
    </div>
  )
}
