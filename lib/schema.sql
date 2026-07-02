-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists tide_kv (
  key text primary key,
  value jsonb not null
);

create table if not exists tide_activity (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists tide_activity_created_at_idx on tide_activity (created_at desc);

create table if not exists tide_processed_messages (
  id text primary key,
  created_at timestamptz not null default now()
);
