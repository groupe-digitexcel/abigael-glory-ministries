-- ============================================================
-- AGM V3 — Migration Patch 002
-- Adds event_registrations table (referenced by API but missing from 001)
-- Run after 001_initial_schema.sql
-- ============================================================

create table public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  attended boolean not null default false,
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

alter table public.event_registrations enable row level security;

create policy "Users can view own registrations" on public.event_registrations
  for select using (auth.uid() = user_id);

create policy "Users can register themselves" on public.event_registrations
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all registrations" on public.event_registrations
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin'))
  );

create index event_registrations_event_idx on public.event_registrations(event_id);
create index event_registrations_user_idx on public.event_registrations(user_id);
