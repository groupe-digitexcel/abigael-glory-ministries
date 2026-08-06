import Link from 'next/link'
import { Crown } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col lg:flex-row relative z-10">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[var(--color-deep)] to-[var(--color-ink)] items-center justify-center p-16 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(107,92,231,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center">
              <Crown className="w-5 h-5 text-[var(--color-night)]" />
            </div>
            <span className="font-display font-bold text-xl text-[var(--color-gold)]">
              Abigael Glory Ministries
            </span>
          </Link>
          <h2 className="font-display text-4xl font-bold text-[var(--color-pearl)] mb-4 leading-tight">
            The Word of God,<br />always within reach.
          </h2>
          <p className="text-[var(--color-mist)] leading-relaxed">
            Join thousands of believers growing in faith through sermons,
            discipleship courses, and a global prayer community.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { value: '500+', label: 'Sermons' },
              { value: '10K+', label: 'Members' },
              { value: '50+', label: 'Countries' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl font-bold text-gradient-gold">{s.value}</div>
                <div className="text-[var(--color-mist)] text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-[var(--color-night)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center">
              <Crown className="w-4 h-4 text-[var(--color-night)]" />
            </div>
            <span className="font-display font-bold text-[var(--color-gold)]">AGM</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
