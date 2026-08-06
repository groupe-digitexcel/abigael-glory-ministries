-- ============================================================
-- AGM V3 — Complete Database Schema
-- Run: supabase db push
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ─── PROFILES ────────────────────────────────────────────────
create type user_role as enum ('user', 'admin', 'super_admin');
create type subscription_tier as enum ('free', 'believer', 'disciple', 'partner', 'kingdom_builder');

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role user_role not null default 'user',
  tier subscription_tier not null default 'free',
  country text,
  phone text,
  bio text,
  affiliate_code text unique,
  referred_by text,
  email_verified boolean not null default false,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);
create policy "Admins can update profiles" on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, affiliate_code)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    upper(substring(md5(random()::text) from 1 for 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure update_updated_at();

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────
create type subscription_status as enum ('active', 'canceled', 'past_due', 'trialing', 'inactive');
create type payment_method as enum ('paypal', 'flutterwave', 'payoneer', 'manual');

create table public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  tier subscription_tier not null,
  status subscription_status not null default 'active',
  payment_method payment_method not null default 'paypal',
  payment_provider_id text,
  amount_usd numeric(10,2) not null,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'annual')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  cancel_at_period_end boolean not null default false,
  trial_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions" on public.subscriptions for select using (auth.uid() = user_id);
create policy "Admins can view all subscriptions" on public.subscriptions for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure update_updated_at();

-- ─── SERMONS ─────────────────────────────────────────────────
create type content_status as enum ('draft', 'published', 'archived');

create table public.sermons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  scripture_reference text,
  series_name text,
  speaker text not null default 'Abigael-Glory Besong',
  youtube_id text,
  audio_url text,
  thumbnail_url text,
  duration_seconds integer,
  min_tier subscription_tier not null default 'free',
  tags text[] not null default '{}',
  status content_status not null default 'draft',
  view_count integer not null default 0,
  like_count integer not null default 0,
  ai_summary text,
  transcript text,
  embedding vector(1536),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sermons enable row level security;
create policy "Published sermons visible to all" on public.sermons for select using (status = 'published');
create policy "Admins can manage sermons" on public.sermons for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

create trigger sermons_updated_at before update on public.sermons
  for each row execute procedure update_updated_at();

create index sermons_status_idx on public.sermons(status);
create index sermons_min_tier_idx on public.sermons(min_tier);
create index sermons_embedding_idx on public.sermons using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ─── COURSES ─────────────────────────────────────────────────
create table public.courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  thumbnail_url text,
  instructor text not null default 'Abigael-Glory Besong',
  min_tier subscription_tier not null default 'believer',
  status content_status not null default 'draft',
  total_lessons integer not null default 0,
  duration_hours numeric(5,1),
  tags text[] not null default '{}',
  order_index integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.course_lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  youtube_id text,
  audio_url text,
  pdf_url text,
  duration_seconds integer,
  order_index integer not null default 0,
  is_preview boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.course_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  lesson_id uuid references public.course_lessons(id),
  completed_lesson_ids text[] not null default '{}',
  percent_complete numeric(5,2) not null default 0,
  last_watched_at timestamptz not null default now(),
  unique(user_id, course_id)
);

alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_progress enable row level security;

create policy "Published courses visible to all" on public.courses for select using (status = 'published');
create policy "Lessons visible with published course" on public.course_lessons for select using (
  exists (select 1 from public.courses where id = course_id and status = 'published')
);
create policy "Users manage own progress" on public.course_progress for all using (auth.uid() = user_id);
create policy "Admins manage courses" on public.courses for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── DEVOTIONALS ─────────────────────────────────────────────
create table public.devotionals (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null,
  scripture text not null,
  scripture_text text,
  author text not null default 'Abigael-Glory Besong',
  category text,
  tags text[] not null default '{}',
  ai_generated boolean not null default false,
  status content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.devotionals enable row level security;
create policy "Published devotionals public" on public.devotionals for select using (status = 'published');
create policy "Admins manage devotionals" on public.devotionals for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── EVENTS ──────────────────────────────────────────────────
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  location text,
  is_online boolean not null default true,
  stream_url text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'Africa/Douala',
  banner_url text,
  ticket_price_usd numeric(10,2),
  max_attendees integer,
  registration_count integer not null default 0,
  min_tier subscription_tier not null default 'free',
  status content_status not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;
create policy "Published events public" on public.events for select using (status = 'published');
create policy "Admins manage events" on public.events for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── PRAYER REQUESTS ─────────────────────────────────────────
create type prayer_status as enum ('pending', 'praying', 'answered', 'archived');

create table public.prayer_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  is_anonymous boolean not null default false,
  is_public boolean not null default true,
  status prayer_status not null default 'pending',
  prayer_count integer not null default 0,
  tags text[] not null default '{}',
  answered_testimony text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.prayer_requests enable row level security;
create policy "Public prayers visible to all" on public.prayer_requests for select using (is_public = true and status != 'archived');
create policy "Users can manage own prayers" on public.prayer_requests for all using (auth.uid() = user_id);
create policy "Admins can manage all prayers" on public.prayer_requests for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── DONATIONS ───────────────────────────────────────────────
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');

create table public.donations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  amount_usd numeric(10,2) not null,
  currency text not null default 'USD',
  payment_method payment_method not null default 'paypal',
  payment_provider_id text,
  status payment_status not null default 'pending',
  purpose text,
  donor_name text,
  donor_email text,
  message text,
  is_recurring boolean not null default false,
  receipt_sent boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;
create policy "Users can view own donations" on public.donations for select using (auth.uid() = user_id);
create policy "Anyone can create donation" on public.donations for insert with check (true);
create policy "Admins manage donations" on public.donations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── AFFILIATES ──────────────────────────────────────────────
create table public.affiliates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  code text not null unique,
  total_referrals integer not null default 0,
  active_referrals integer not null default 0,
  total_earnings_usd numeric(10,2) not null default 0,
  pending_payout_usd numeric(10,2) not null default 0,
  paid_out_usd numeric(10,2) not null default 0,
  commission_rate numeric(5,2) not null default 30.00,
  payout_method payment_method,
  payout_details jsonb,
  status text not null default 'active' check (status in ('active', 'suspended', 'pending')),
  created_at timestamptz not null default now()
);

create table public.affiliate_referrals (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid references public.affiliates(id) on delete cascade not null,
  referred_user_id uuid references public.profiles(id) on delete cascade not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  commission_usd numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'paid')),
  created_at timestamptz not null default now()
);

alter table public.affiliates enable row level security;
alter table public.affiliate_referrals enable row level security;
create policy "Users view own affiliate" on public.affiliates for select using (auth.uid() = user_id);
create policy "Users view own referrals" on public.affiliate_referrals for select using (
  affiliate_id in (select id from public.affiliates where user_id = auth.uid())
);
create policy "Admins manage affiliates" on public.affiliates for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── BLOG POSTS ──────────────────────────────────────────────
create table public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  author text not null default 'Abigael-Glory Besong',
  author_avatar text,
  cover_url text,
  tags text[] not null default '{}',
  category text,
  status content_status not null default 'draft',
  ai_assisted boolean not null default false,
  read_time_minutes integer,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;
create policy "Published posts public" on public.blog_posts for select using (status = 'published');
create policy "Admins manage posts" on public.blog_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── EMAIL BROADCASTS ────────────────────────────────────────
create table public.email_broadcasts (
  id uuid primary key default uuid_generate_v4(),
  subject text not null,
  body text not null,
  target_tier text not null default 'all',
  recipient_count integer not null default 0,
  sent_by uuid references public.profiles(id),
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.email_broadcasts enable row level security;
create policy "Admins manage broadcasts" on public.email_broadcasts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── SITE SETTINGS ───────────────────────────────────────────
create table public.site_settings (
  id text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, value) values
  ('general', '{"site_name": "Abigael Glory Ministries", "tagline": "The Gospel Has No Borders", "contact_email": "info@agm.church"}'),
  ('features', '{"prayer_wall": true, "affiliate_program": true, "ai_devotionals": true, "live_stream": true}'),
  ('payments', '{"paypal_enabled": true, "flutterwave_enabled": true, "payoneer_enabled": true}');

alter table public.site_settings enable row level security;
create policy "Settings public readable" on public.site_settings for select using (true);
create policy "Admins manage settings" on public.site_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
);

-- ─── HELPER FUNCTIONS ────────────────────────────────────────
create or replace function increment_affiliate_earnings(p_affiliate_id uuid, p_amount numeric)
returns void language plpgsql security definer as $$
begin
  update public.affiliates
  set
    total_earnings_usd = total_earnings_usd + p_amount,
    pending_payout_usd = pending_payout_usd + p_amount,
    total_referrals = total_referrals + 1,
    active_referrals = active_referrals + 1
  where id = p_affiliate_id;
end;
$$;

create or replace function process_donation_commission(p_provider_id text)
returns void language plpgsql security definer as $$
begin
  update public.affiliate_referrals set status = 'confirmed'
  where subscription_id in (
    select id from public.subscriptions where payment_provider_id = p_provider_id
  ) and status = 'pending';
end;
$$;

-- Semantic search function
create or replace function match_sermons(
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 10
)
returns table (id uuid, title text, similarity float)
language sql stable as $$
  select id, title, 1 - (embedding <=> query_embedding) as similarity
  from public.sermons
  where status = 'published'
    and 1 - (embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
$$;
