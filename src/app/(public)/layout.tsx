import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh relative z-10">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
