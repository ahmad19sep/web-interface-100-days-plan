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
  -- unlocks /creator (aggregate stats across every account). Flip by hand:
  --   update profiles set is_owner = true where handle = 'yourhandle';
  is_owner       boolean not null default false,
  created_at     timestamptz not null default now()
);

-- for a database created before is_owner existed (CREATE TABLE IF NOT
-- EXISTS above is a no-op on an already-existing table)
alter table profiles add column if not exists is_owner boolean not null default false;

alter table profiles add column if not exists avatar text not null default 'bot';

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

-- One row per question answered. `selected_index` only — never a stored
-- "correct" flag, so fixing a quiz answer in code re-grades everyone
-- automatically (see QUIZZES in lib/challenges/modern-ai-2026.ts).
create table if not exists quiz_answers (
  profile_id      uuid not null references profiles(id) on delete cascade,
  day             int not null,
  question_index  int not null,
  selected_index  int not null,
  answered_at     timestamptz not null default now(),
  primary key (profile_id, day, question_index)
);

-- Owner-editable per-day content — video/GitHub link/note/quiz set live from
-- the app (see /api/day-content) instead of editing
-- lib/challenges/modern-ai-2026.ts and redeploying. Shown to every user;
-- falls back to the code-based VIDEOS/OWNER_NOTES/QUIZZES/day folder pattern
-- when a day has no row (or no quiz) here yet.
create table if not exists day_content (
  day         int primary key,
  video_url   text,
  github_url  text,
  note        text,
  -- [{ question, options: string[], correctIndex }, ...] or null
  quiz        jsonb,
  -- [{ label, url }, ...] or null — creator-curated resource links
  links       jsonb,
  updated_at  timestamptz not null default now()
);

alter table day_content add column if not exists quiz jsonb;
alter table day_content add column if not exists links jsonb;

-- Learning-workspace progress (see lib/lessons/, /learn/day/N). One jsonb
-- blob per (user, day): last stage, video seconds, section/lab completion,
-- hints unlocked, verification values, reflections, ship evidence.
-- Shape: lib/lessons/types.ts → WorkspaceProgress.
create table if not exists day_progress (
  profile_id  uuid not null references profiles(id) on delete cascade,
  day         int not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (profile_id, day)
);

create index if not exists sessions_profile_id_idx on sessions(profile_id);
create index if not exists checkins_profile_id_idx on checkins(profile_id);
create index if not exists quiz_answers_profile_id_idx on quiz_answers(profile_id);
