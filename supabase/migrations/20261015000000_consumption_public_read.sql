-- Run in the EXISTING connected Supabase project, not a new project.
-- Add ordering and harden public access without replacing or deleting any rows.
begin;
alter table public.consumption_logs
  add column if not exists sort_order integer not null default 0;
alter table public.consumption_logs enable row level security;

-- Restrictive policies are ANDed with existing permissive policies, so any
-- older broad SELECT policy cannot expose false or NULL published values.
drop policy if exists consumption_published_only on public.consumption_logs;
create policy consumption_published_only on public.consumption_logs
  as restrictive for select to anon, authenticated
  using (published is true);
drop policy if exists consumption_public_select on public.consumption_logs;
create policy consumption_public_select on public.consumption_logs
  for select to anon, authenticated using (published is true);

revoke insert, update, delete, truncate, references, trigger
  on public.consumption_logs from public, anon, authenticated;
grant select on public.consumption_logs to anon, authenticated;
create index if not exists consumption_logs_date_order_idx
  on public.consumption_logs (consumed_on desc, sort_order asc, id asc);
commit;

-- Verify after applying. RLS must be enabled; the restrictive policy must exist.
select relrowsecurity from pg_class
where oid = 'public.consumption_logs'::regclass;
select policyname, permissive, roles, cmd, qual
from pg_policies where schemaname = 'public' and tablename = 'consumption_logs';
