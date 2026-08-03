-- Newvora — quote_requests table (bulk / business quote enquiries).
-- Run once in Supabase -> SQL Editor. Safe to re-run.
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  company text,
  message text,
  status text not null default 'new',   -- 'new' | 'quoted' | 'closed'
  created_at timestamptz not null default now()
);
create index if not exists quote_requests_created_idx on public.quote_requests (created_at desc);
