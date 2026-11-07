-- Pilotní akademie / návrh členství
-- Zatím NEPOUŠTĚT jako ostrou platební službu bez integrace Stripe a ověření webhooků.
-- Spustit v Supabase SQL editoru po založení vlastního projektu.
create extension if not exists pgcrypto;

create table if not exists public.student_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.student_profiles enable row level security;
drop policy if exists "student profile select own" on public.student_profiles;
create policy "student profile select own" on public.student_profiles
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "student profile create own" on public.student_profiles;
create policy "student profile create own" on public.student_profiles
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "student profile update own" on public.student_profiles;
create policy "student profile update own" on public.student_profiles
  for update to authenticated using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_code text not null check (product_code in ('monthly','quarter','half_year','year','admin_grant')),
  status text not null default 'pending' check (status in ('pending','active','past_due','cancelled','expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_period_valid check (ends_at is null or starts_at is null or ends_at > starts_at)
);
create index if not exists memberships_user_active_idx on public.memberships(user_id,status,ends_at);
create unique index if not exists memberships_checkout_session_unique on public.memberships(stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
create unique index if not exists memberships_stripe_subscription_unique on public.memberships(stripe_subscription_id)
  where stripe_subscription_id is not null;
alter table public.memberships enable row level security;
drop policy if exists "memberships read own" on public.memberships;
create policy "memberships read own" on public.memberships for select to authenticated
 using (user_id = (select auth.uid()));
-- Úmyslně ŽÁDNÉ INSERT, UPDATE ani DELETE politiky pro authenticated:
-- členství zapisuje pouze důvěryhodný backend pomocí serverového secret key.

create table if not exists public.study_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_key text not null,
  question_key text not null,
  answer_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, module_key, question_key)
);
alter table public.study_progress enable row level security;
drop policy if exists "progress read own" on public.study_progress;
create policy "progress read own" on public.study_progress for select to authenticated
 using (user_id = (select auth.uid()));
drop policy if exists "progress insert own" on public.study_progress;
create policy "progress insert own" on public.study_progress for insert to authenticated
 with check (user_id = (select auth.uid()));
drop policy if exists "progress update own" on public.study_progress;
create policy "progress update own" on public.study_progress for update to authenticated
 using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create table if not exists public.stripe_event_receipts (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);
alter table public.stripe_event_receipts enable row level security;
-- Žádná klientská politika: výhradně backend.

-- Budoucí placený obsah: RLS vyžaduje autentizaci a aktivní členství.
-- NIKDY neukládat prémiové otázky do veřejných /docs/ či /ppl_app/ a nevracet správné odpovědi před vyhodnocením.
create table if not exists public.premium_questions (
  id uuid primary key default gen_random_uuid(),
  module_key text not null,
  question_body text not null,
  options jsonb not null,
  explanation text not null,
  correct_answer text not null,
  created_at timestamptz not null default now()
);
alter table public.premium_questions enable row level security;
-- Záměrně žádná klientská SELECT politika: otázky se vydávají omezeně
-- skrze ověřený backend, správné odpovědi zůstávají na serveru.

-- Poznámka: DB schéma je základ, NEKOMPLETNÍ produkční řešení.
-- Přístup k obsahu musí server vždy znovu ověřit podle user_id, status a ends_at.
