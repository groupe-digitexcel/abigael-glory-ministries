import Link from 'next/link'
import { Crown, Target, Heart, Globe2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-dvh pt-24 pb-16 relative z-10">
      <div className="container-max max-w-3xl">
        <div className="text-center mb-16">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center mx-auto mb-6">
            <Crown className="w-7 h-7 text-[var(--color-night)]" />
          </div>
          <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">About Us</p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-6">
            Abigael Glory Ministries
          </h1>
          <p className="text-[var(--color-mist)] text-lg leading-relaxed">
            Founded in Douala, Cameroon, Abigael Glory Ministries exists to carry the Gospel
            beyond the walls of any single building — into homes, phones, and hearts across
            every continent.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Target, title: 'Our Mission', text: 'To make the Gospel accessible to every person, regardless of geography or economic status.' },
            { icon: Heart, title: 'Our Heart', text: 'A community that prays together, grows together, and supports one another in faith.' },
            { icon: Globe2, title: 'Our Reach', text: 'Serving believers across 50+ countries through digital sermons, courses, and prayer.' },
          ].map((item) => (
            <div key={item.title} className="bg-card rounded-2xl p-6 text-center">
              <item.icon className="w-6 h-6 text-[var(--color-gold)] mx-auto mb-3" />
              <h3 className="font-display font-semibold text-[var(--color-pearl)] mb-2">{item.title}</h3>
              <p className="text-[var(--color-mist)] text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 mb-16">
          <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-4">Our Story</h2>
          <p className="text-[var(--color-mist)] leading-relaxed mb-4">
            Abigael Glory Ministries began as a single woman's conviction that the Gospel
            belongs to everyone — not just those who can physically walk into a church
            building. What started as a small digital outreach has grown into a global
            community spanning over 50 countries.
          </p>
          <p className="text-[var(--color-mist)] leading-relaxed">
            Today, AGM produces weekly sermons, structured discipleship courses, and daily
            devotionals, all while building sustainable funding through member subscriptions,
            donations, and a Kingdom-minded affiliate program that lets members earn while
            they share the Good News.
          </p>
        </div>

        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-[var(--color-pearl)] mb-4">Join the Family</h2>
          <p className="text-[var(--color-mist)] mb-6">Start your journey with us today — completely free.</p>
          <Link href="/register" className="inline-flex px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] text-[var(--color-night)] font-semibold hover:opacity-90 transition-opacity">
            Join Free
          </Link>
        </div>
      </div>
    </div>
  )
}
