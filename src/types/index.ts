// ============================================================
// AGM V3 — Complete Type System
// ============================================================

export type UserRole = 'user' | 'admin' | 'super_admin'
export type SubscriptionTier = 'free' | 'believer' | 'disciple' | 'partner' | 'kingdom_builder'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type PaymentMethod = 'chariow' | 'manual'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PrayerStatus = 'pending' | 'praying' | 'answered' | 'archived'
export type MediaType = 'video' | 'audio' | 'pdf' | 'image'

// ─── User & Auth ────────────────────────────────────────────
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  tier: SubscriptionTier
  country: string | null
  phone: string | null
  bio: string | null
  affiliate_code: string | null
  referred_by: string | null
  email_verified: boolean
  onboarded: boolean
  created_at: string
  updated_at: string
}

// ─── Subscription ────────────────────────────────────────────
export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  payment_method: PaymentMethod
  payment_provider_id: string | null
  amount_usd: number
  billing_cycle: 'monthly' | 'annual'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  trial_end: string | null
  created_at: string
  updated_at: string
  profile?: Profile
}

// ─── Sermon ──────────────────────────────────────────────────
export interface Sermon {
  id: string
  title: string
  slug: string
  description: string | null
  scripture_reference: string | null
  series_name: string | null
  speaker: string
  youtube_id: string | null
  audio_url: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  min_tier: SubscriptionTier
  tags: string[]
  status: ContentStatus
  view_count: number
  like_count: number
  ai_summary: string | null
  transcript: string | null
  embedding: number[] | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface SermonWithAccess extends Sermon {
  has_access: boolean
  is_liked: boolean
  watch_progress: number
}

// ─── Course ──────────────────────────────────────────────────
export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  instructor: string
  min_tier: SubscriptionTier
  status: ContentStatus
  total_lessons: number
  duration_hours: number | null
  tags: string[]
  order_index: number
  published_at: string | null
  created_at: string
  updated_at: string
  lessons?: CourseLesson[]
  progress?: CourseProgress
}

export interface CourseLesson {
  id: string
  course_id: string
  title: string
  description: string | null
  youtube_id: string | null
  audio_url: string | null
  pdf_url: string | null
  duration_seconds: number | null
  order_index: number
  is_preview: boolean
  created_at: string
}

export interface CourseProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string
  completed_lesson_ids: string[]
  percent_complete: number
  last_watched_at: string
}

// ─── Devotional ──────────────────────────────────────────────
export interface Devotional {
  id: string
  title: string
  slug: string
  content: string
  scripture: string
  scripture_text: string | null
  author: string
  category: string | null
  tags: string[]
  ai_generated: boolean
  status: ContentStatus
  published_at: string | null
  created_at: string
}

// ─── Event ───────────────────────────────────────────────────
export interface Event {
  id: string
  title: string
  slug: string
  description: string
  location: string | null
  is_online: boolean
  stream_url: string | null
  start_at: string
  end_at: string
  timezone: string
  banner_url: string | null
  ticket_price_usd: number | null
  max_attendees: number | null
  registration_count: number
  min_tier: SubscriptionTier
  status: ContentStatus
  created_at: string
}

// ─── Prayer ──────────────────────────────────────────────────
export interface PrayerRequest {
  id: string
  user_id: string
  title: string
  content: string
  is_anonymous: boolean
  is_public: boolean
  status: PrayerStatus
  prayer_count: number
  tags: string[]
  answered_testimony: string | null
  created_at: string
  updated_at: string
  profile?: Pick<Profile, 'full_name' | 'avatar_url'>
}

// ─── Donation ────────────────────────────────────────────────
export interface Donation {
  id: string
  user_id: string | null
  amount_usd: number
  currency: string
  payment_method: PaymentMethod
  payment_provider_id: string | null
  status: PaymentStatus
  purpose: string | null
  donor_name: string | null
  donor_email: string | null
  message: string | null
  is_recurring: boolean
  receipt_sent: boolean
  created_at: string
  profile?: Pick<Profile, 'full_name' | 'email'>
}

// ─── Affiliate ───────────────────────────────────────────────
export interface Affiliate {
  id: string
  user_id: string
  code: string
  total_referrals: number
  active_referrals: number
  total_earnings_usd: number
  pending_payout_usd: number
  paid_out_usd: number
  commission_rate: number
  payout_method: PaymentMethod | null
  payout_details: Record<string, string> | null
  status: 'active' | 'suspended' | 'pending'
  created_at: string
  profile?: Profile
}

export interface AffiliateReferral {
  id: string
  affiliate_id: string
  referred_user_id: string
  subscription_id: string | null
  commission_usd: number
  status: 'pending' | 'confirmed' | 'paid'
  created_at: string
}

// ─── Blog ────────────────────────────────────────────────────
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  author: string
  author_avatar: string | null
  cover_url: string | null
  tags: string[]
  category: string | null
  status: ContentStatus
  ai_assisted: boolean
  read_time_minutes: number | null
  published_at: string | null
  created_at: string
}

// ─── Admin & Analytics ───────────────────────────────────────
export interface AdminStats {
  total_users: number
  active_subscribers: number
  monthly_revenue_usd: number
  total_donations_usd: number
  total_sermons: number
  total_courses: number
  total_prayer_requests: number
  active_affiliates: number
  new_users_this_month: number
  churn_rate: number
}

export interface RevenueDataPoint {
  date: string
  subscriptions: number
  donations: number
  total: number
}

// ─── AI ──────────────────────────────────────────────────────
export interface AISermonSummary {
  summary: string
  key_points: string[]
  scripture_references: string[]
  themes: string[]
}

export interface AIDevotional {
  title: string
  scripture: string
  content: string
  prayer: string
  reflection_questions: string[]
}

// ─── Pricing ─────────────────────────────────────────────────
export interface PricingTier {
  id: SubscriptionTier
  name: string
  price_monthly: number
  price_annual: number
  description: string
  features: string[]
  highlight: boolean
  cta: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Seeker',
    price_monthly: 0,
    price_annual: 0,
    description: 'Begin your journey with us',
    features: [
      '10 free sermons per month',
      'Public devotionals',
      'Community prayer wall',
      'Weekly newsletter',
      'Event announcements',
    ],
    highlight: false,
    cta: 'Start Free',
  },
  {
    id: 'believer',
    name: 'Believer',
    price_monthly: 5,
    price_annual: 50,
    description: 'Deepen your walk with God',
    features: [
      'Full sermon library access',
      'Daily devotionals',
      'Private prayer requests',
      'Study guides & notes',
      'Sermon downloads (MP3)',
      'Ad-free experience',
    ],
    highlight: false,
    cta: 'Join as Believer',
  },
  {
    id: 'disciple',
    name: 'Disciple',
    price_monthly: 10,
    price_annual: 100,
    description: 'Grow through structured discipleship',
    features: [
      'Everything in Believer',
      'All discipleship courses',
      'Live stream access',
      'Course certificates',
      'AI devotional companion',
      'Sermon AI summaries',
    ],
    highlight: true,
    cta: 'Become a Disciple',
  },
  {
    id: 'partner',
    name: 'Partner',
    price_monthly: 25,
    price_annual: 250,
    description: 'Partner in ministry & community',
    features: [
      'Everything in Disciple',
      'Monthly group prayer call',
      'Partner-only content',
      'Ministry impact reports',
      'Priority prayer requests',
      'Name in partner registry',
    ],
    highlight: false,
    cta: 'Become a Partner',
  },
  {
    id: 'kingdom_builder',
    name: 'Kingdom Builder',
    price_monthly: 49,
    price_annual: 490,
    description: 'Build the Kingdom with us',
    features: [
      'Everything in Partner',
      'Affiliate dashboard (30% commission)',
      'Co-branded ministry materials',
      'Early access to all content',
      'Annual recognition gift',
      'Direct line to leadership',
    ],
    highlight: false,
    cta: 'Build the Kingdom',
  },
]

export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  believer: 1,
  disciple: 2,
  partner: 3,
  kingdom_builder: 4,
}

export function hasAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]
}
