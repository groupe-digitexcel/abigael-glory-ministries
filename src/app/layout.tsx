import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import '@/styles/globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Abigael Glory Ministries — Digital Evangelism',
    template: '%s | Abigael Glory Ministries',
  },
  description:
    'A global digital ministry platform carrying the light of the Gospel through sermons, discipleship courses, and community prayer.',
  keywords: ['ministry', 'sermons', 'discipleship', 'evangelism', 'Africa', 'Cameroon', 'faith', 'gospel'],
  authors: [{ name: 'Abigael-Glory Besong' }],
  creator: 'Abigael Glory Ministries',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://agm.church'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Abigael Glory Ministries',
    title: 'Abigael Glory Ministries — Digital Evangelism',
    description: 'Carrying the light of the Gospel globally through digital ministry.',
    images: [{ url: '/images/og-banner.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abigael Glory Ministries',
    description: 'Carrying the light of the Gospel globally.',
    images: ['/images/og-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  themeColor: '#0D0F1A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="ambient-bg">
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-ink)',
              border: '1px solid rgba(212,168,67,0.2)',
              color: 'var(--color-pearl)',
            },
          }}
        />
      </body>
    </html>
  )
}
