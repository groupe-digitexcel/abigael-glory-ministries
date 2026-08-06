import { HeroSection } from '@/components/sections/HeroSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { SermonPreviewSection } from '@/components/sections/SermonPreviewSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { PrayerCTASection } from '@/components/sections/PrayerCTASection'
import { DonationSection } from '@/components/sections/DonationSection'
import { EventsPreviewSection } from '@/components/sections/EventsPreviewSection'
import { AffiliateCTASection } from '@/components/sections/AffiliateCTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <SermonPreviewSection />
      <EventsPreviewSection />
      <PricingSection />
      <TestimonialsSection />
      <PrayerCTASection />
      <DonationSection />
      <AffiliateCTASection />
    </>
  )
}
