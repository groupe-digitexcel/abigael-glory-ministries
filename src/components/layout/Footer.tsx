import Link from 'next/link'
import { Crown, Mail, MapPin, Heart } from 'lucide-react'

const FOOTER_LINKS = {
  Ministry: [
    { label: 'Sermons', href: '/sermons' },
    { label: 'Courses', href: '/courses' },
    { label: 'Devotionals', href: '/devotionals' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blog' },
  ],
  Community: [
    { label: 'Prayer Wall', href: '/prayer' },
    { label: 'Give', href: '/donate' },
    { label: 'Affiliate Program', href: '/affiliate' },
    { label: 'About', href: '/about' },
  ],
  Account: [
    { label: 'Join Free', href: '/register' },
    { label: 'Sign In', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/#pricing' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--color-gold)]/10 bg-[var(--color-deep)]">
      <div className="container-max py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-spirit)] flex items-center justify-center">
                <Crown className="w-4 h-4 text-[var(--color-night)]" />
              </div>
              <span className="font-display font-bold text-[var(--color-gold)]">AGM</span>
            </Link>
            <p className="text-[var(--color-mist)] text-sm leading-relaxed mb-4">
              Carrying the light of the Gospel to every corner of the earth through digital ministry.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--color-mist)]">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                Douala, Cameroon
              </span>
              <a
                href="mailto:info@agm.church"
                className="flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                info@agm.church
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[var(--color-pearl)] font-semibold text-sm mb-4 tracking-wide">
                {section}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[var(--color-mist)] text-sm hover:text-[var(--color-gold)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-slate)] text-xs">
            © {new Date().getFullYear()} Abigael Glory Ministries. All rights reserved.
          </p>
          <p className="text-[var(--color-slate)] text-xs flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[var(--color-ember)]" /> for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  )
}
