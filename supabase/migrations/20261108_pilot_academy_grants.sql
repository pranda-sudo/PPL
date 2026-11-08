-- Harden Data API grants in addition to row-level security.
revoke all on table public.student_profiles from anon;
revoke all on table public.study_progress from anon;
revoke all on table public.memberships from anon;
revoke insert, update, delete, truncate, references, trigger on table public.memberships from authenticated;
revoke all on table public.premium_questions from anon, authenticated;
revoke all on table public.stripe_event_receipts from anon, authenticated;
-- Student-owned records can still use their existing RLS policies.
grant select, insert, update on table public.student_profiles to authenticated;
grant select, insert, update on table public.study_progress to authenticated;
grant select on table public.memberships to authenticated;
