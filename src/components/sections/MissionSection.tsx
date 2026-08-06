'use client'

import { motion } from 'motion/react'
import { Globe, BookOpen, Users, Mic } from 'lucide-react'

const PILLARS = [
  {
    icon: Mic,
    title: 'Preach',
    description: 'Anointed sermons delivered weekly — accessible to every believer, everywhere.',
  },
  {
    icon: BookOpen,
    title: 'Teach',
    description: 'Structured discipleship courses that take you from seeker to Kingdom Builder.',
  },
  {
    icon: Users,
    title: 'Gather',
    description: 'A global prayer community interceding together across every timezone.',
  },
  {
    icon: Globe,
    title: 'Reach',
    description: 'Digital tools carrying the Gospel beyond walls, borders, and limitations.',
  },
]

export function MissionSection() {
  return (
    <section className="section-padding relative z-10">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-4">
              Our Mission
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--color-pearl)] mb-6 leading-tight">
              Ministry Without Walls
            </h2>
            <p className="text-[var(--color-mist)] text-lg leading-relaxed mb-6">
              Abigael Glory Ministries was founded with a single conviction — the Gospel belongs
              to every person on earth, not just those who can walk into a building.
            </p>
            <p className="text-[var(--color-mist)] leading-relaxed">
              From Douala, Cameroon, we carry the Word through screens and speakers,
              across continents and cultures, believing that digital technology is the
              new frontier of evangelism.
            </p>
          </motion.div>

          {/* Pillars */}
          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card bg-card-hover rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 flex items-center justify-center mb-4">
                  <pillar.icon className="w-5 h-5 text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[var(--color-mist)] text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
