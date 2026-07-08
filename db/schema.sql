-- 100 Days of Modern AI — shared backend schema (Postgres / Neon).
--
-- Run once against your database (Neon SQL editor, or `psql "$DATABASE_URL" -f db/schema.sql`).
-- Safe to re-run — every statement is idempotent.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id             uuid primary key default gen_random_uuid(),
  -- login handle: lowercase, unique, what users type in to sign in
  handle         text unique not null,
  name           text not null,
  salt           text not null,
  code_hash      text not null,
  github         text not null default '',
  reminder       text not null default 'evening',
  visibility     text not null default 'public',
  notes_private  boolean not null default true,
  start_date     date,
  joined         date not null default current_date,
  onboarded      boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists checkins (
  profile_id  uuid not null references profiles(id) on delete cascade,
  day         int not null,
  checked_on  date not null,
  primary key (profile_id, day)
);

create table if not exists notes (
  profile_id  uuid not null references profiles(id) on delete cascade,
  day         int not null,
  text        text not null,
  primary key (profile_id, day)
);

create table if not exists sessions (
  id          text primary key,
  profile_id  uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists sessions_profile_id_idx on sessions(profile_id);
create index if not exists checkins_profile_id_idx on checkins(profile_id);
