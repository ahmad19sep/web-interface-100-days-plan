// Server-only: owner-editable per-day content (video/GitHub link/note/quiz),
// merged with the code-based curriculum defaults. A DB row always wins over
// the code-based default for whichever fields it sets.

import type { QuizQuestion } from "./challenges/types";
import { query } from "./db";
import { DAYS, getDay } from "./plan";
import type { QuizMap } from "./quiz";

export interface DayLink {
  label: string;
  url: string;
}

export interface DayContent {
  videoUrl: string | null;
  githubUrl: string | null;
  note: string | null;
  quiz: QuizQuestion[] | null;
  links: DayLink[] | null;
}

interface Row {
  video_url: string | null;
  github_url: string | null;
  note: string | null;
  quiz: QuizQuestion[] | null;
  links: DayLink[] | null;
}

// Self-healing migration: `links` was added after the first production
// deploy, and the DATABASE_URL secret can't be pulled locally to run
// db/schema.sql by hand. Idempotent and cached, so it costs one statement
// per server instance.
let linksColumnReady: Promise<unknown> | null = null;
export function ensureLinksColumn(): Promise<unknown> {
  if (!linksColumnReady) {
    linksColumnReady = query(
      "alter table day_content add column if not exists links jsonb"
    ).catch((err) => {
      linksColumnReady = null; // retry on the next request
      throw err;
    });
  }
  return linksColumnReady;
}

/** The DB override for one day, or all-null if the owner hasn't set anything. */
export async function getDayContentRow(day: number): Promise<DayContent> {
  await ensureLinksColumn();
  const rows = await query<Row>(
    "select video_url, github_url, note, quiz, links from day_content where day = $1",
    [day]
  );
  const row = rows[0];
  return {
    videoUrl: row?.video_url ?? null,
    githubUrl: row?.github_url ?? null,
    note: row?.note ?? null,
    quiz: row?.quiz ?? null,
    links: row?.links ?? null,
  };
}

/** This day's quiz — DB override if the owner set one, else the code default. */
export async function effectiveQuizForDay(
  day: number
): Promise<QuizQuestion[] | undefined> {
  const rows = await query<{ quiz: QuizQuestion[] | null }>(
    "select quiz from day_content where day = $1",
    [day]
  );
  return rows[0]?.quiz ?? getDay(day)?.quiz;
}

/** Every day's effective quiz — code-based QUIZZES with DB overrides applied. */
export async function effectiveQuizMap(): Promise<QuizMap> {
  const map: QuizMap = {};
  for (const d of DAYS) if (d.quiz && d.quiz.length > 0) map[d.day] = d.quiz;
  const rows = await query<{ day: number; quiz: QuizQuestion[] | null }>(
    "select day, quiz from day_content where quiz is not null"
  );
  for (const r of rows) if (r.quiz) map[r.day] = r.quiz;
  return map;
}

/** Validates + trims owner-submitted resource links; drops malformed lines. */
export function sanitizeLinksInput(raw: unknown): DayLink[] | null {
  if (!Array.isArray(raw)) return null;
  const links: DayLink[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const l = item as Record<string, unknown>;
    const url = typeof l.url === "string" ? l.url.trim() : "";
    if (!/^https?:\/\//i.test(url)) continue;
    const label =
      typeof l.label === "string" && l.label.trim() ? l.label.trim() : url;
    links.push({ label, url });
    if (links.length >= 12) break;
  }
  return links.length > 0 ? links : null;
}

/** Validates + trims owner-submitted quiz JSON; drops malformed questions. */
export function sanitizeQuizInput(raw: unknown): QuizQuestion[] | null {
  if (!Array.isArray(raw)) return null;
  const questions: QuizQuestion[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const q = item as Record<string, unknown>;
    const question = typeof q.question === "string" ? q.question.trim() : "";
    const options = Array.isArray(q.options)
      ? q.options
          .map((o) => (typeof o === "string" ? o.trim() : ""))
          .filter((o) => o.length > 0)
      : [];
    const correctIndex = Number(q.correctIndex);
    if (
      question &&
      options.length >= 2 &&
      Number.isInteger(correctIndex) &&
      correctIndex >= 0 &&
      correctIndex < options.length
    ) {
      questions.push({ question, options, correctIndex });
    }
  }
  return questions.length > 0 ? questions : null;
}
