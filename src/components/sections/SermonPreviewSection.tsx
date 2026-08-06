'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { Play, Lock, ArrowRight, Clock } from 'lucide-react'

const FEATURED_SERMONS = [
  {
    id: '1',
    title: 'Walking in Divine Purpose',
    speaker: 'Abigael-Glory Besong',
    series: 'Foundations of Faith',
    duration: '48 min',
    thumbnail: '/images/sermon-1.jpg',
    youtubeId: 'dQw4w9WgXcQ',
    free: true,
    tags: ['Purpose', 'Faith'],
  },
  {
    id: '2',
    title: 'The Power of Persistent Prayer',
    speaker: 'Abigael-Glory Besong',
    series: 'Prayer School',
    duration: '52 min',
    thumbnail: '/images/sermon-2.jpg',
    youtubeId: null,
    free: false,
    tags: ['Prayer', 'Persistence'],
  },
  {
    id: '3',
    title: 'Grace That Exceeds All Sin',
    speaker: 'Abigael-Glory Besong',
    series: 'The Gospel of Grace',
    duration: '39 min',
    thumbnail: '/images/sermon-3.jpg',
    youtubeId: null,
    free: false,
    tags: ['Grace', 'Redemption'],
  },
]

export function SermonPreviewSection() {
  return (
    <section className="section-padding relative z-10 bg-[var(--color-deep)]/40">
      <div className="container-max">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[var(--color-gold)] text-sm font-semibold tracking-widest uppercase mb-3">
              Sermon Library
            </p>
            <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)]">
              Fresh Word, Every Week
            </h2>
          </motion.div>
          <Link
            href="/sermons"
            className="flex items-center gap-2 text-[var(--color-gold)] text-sm font-medium hover:gap-3 transition-all"
          >
            View All Sermons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_SERMONS.map((sermon, i) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/sermons/${sermon.id}`} className="group block">
                <div className="bg-card bg-card-hover rounded-2xl overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-[var(--color-ink)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-spirit)]/30 to-[var(--color-gold)]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {sermon.free ? (
                        <div className="w-14 h-14 rounded-full bg-[var(--color-gold)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-[var(--color-gold)]/30">
                          <Play className="w-5 h-5 text-[var(--color-night)] ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[var(--color-mist)]" />
                        </div>
                      )}
                    </div>
                    {!sermon.free && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[var(--color-spirit)] text-white text-xs font-semibold">
                        Members Only
                      </div>
                    )}
                    {sermon.free && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[var(--color-gold)] text-[var(--color-night)] text-xs font-semibold">
                        Free
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-[var(--color-gold)] text-xs font-medium mb-1">{sermon.series}</p>
                    <h3 className="font-display text-lg font-semibold text-[var(--color-pearl)] mb-2 group-hover:text-[var(--color-gold)] transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>
                    <div className="flex items-center justify-between text-[var(--color-mist)] text-xs">
                      <span>{sermon.speaker}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sermon.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
