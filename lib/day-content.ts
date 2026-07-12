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

/** One lesson video the owner attached — YouTube link or an uploaded file. */
export interface DayVideo {
  title: string;
  url: string;
  kind: "concept" | "walkthrough" | "mistakes" | "briefing";
  required: boolean;
}

/** One document/handout the owner attached — a link or an uploaded file. */
export interface DayDoc {
  label: string;
  url: string;
  /** file extension or kind, shown as a chip (pdf, md, zip, ipynb…) */
  kind: string;
}

export interface DayContent {
  videoUrl: string | null;
  githubUrl: string | null;
  note: string | null;
  quiz: QuizQuestion[] | null;
  links: DayLink[] | null;
  videos: DayVideo[] | null;
  docs: DayDoc[] | null;
}

interface Row {
  video_url: string | null;
  github_url: string | null;
  note: string | null;
  quiz: QuizQuestion[] | null;
  links: DayLink[] | null;
  videos: DayVideo[] | null;
  docs: DayDoc[] | null;
}

// Self-healing migration: `links` was added after the first production
// deploy, and the DATABASE_URL secret can't be pulled locally to run
// db/schema.sql by hand. Idempotent and cached, so it costs one statement
// per server instance.
let linksColumnReady: Promise<unknown> | null = null;
export function ensureLinksColumn(): Promise<unknown> {
  if (!linksColumnReady) {
    linksColumnReady = Promise.all([
      query("alter table day_content add column if not exists links jsonb"),
      // multi-video and multi-document attachments (👑 CREATOR panel)
      query("alter table day_content add column if not exists videos jsonb"),
      query("alter table day_content add column if not exists docs jsonb"),
    ]).catch((err) => {
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
    "select video_url, github_url, note, quiz, links, videos, docs from day_content where day = $1",
    [day]
  );
  const row = rows[0];
  return {
    videoUrl: row?.video_url ?? null,
    githubUrl: row?.github_url ?? null,
    note: row?.note ?? null,
    quiz: row?.quiz ?? null,
    videos: row?.videos ?? null,
    docs: row?.docs ?? null,
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

const VIDEO_KINDS = new Set(["concept", "walkthrough", "mistakes", "briefing"]);

/** Validates owner-submitted lesson videos; drops rows without a real URL. */
export function sanitizeVideosInput(raw: unknown): DayVideo[] | null {
  if (!Array.isArray(raw)) return null;
  const videos: DayVideo[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const v = item as Record<string, unknown>;
    const url = typeof v.url === "string" ? v.url.trim() : "";
    if (!/^https?:\/\//i.test(url)) continue;
    const kindRaw = typeof v.kind === "string" ? v.kind : "concept";
    videos.push({
      url,
      title:
        typeof v.title === "string" && v.title.trim()
          ? v.title.trim().slice(0, 140)
          : "Lesson video",
      kind: (VIDEO_KINDS.has(kindRaw) ? kindRaw : "concept") as DayVideo["kind"],
      required: v.required !== false,
    });
    if (videos.length >= 8) break;
  }
  return videos.length > 0 ? videos : null;
}

/** Guess a doc's kind chip from its URL when the owner didn't set one. */
function kindFromUrl(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]{1,5}$/.test(ext) ? ext : "link";
}

/** Validates owner-submitted documents; drops rows without a real URL. */
export function sanitizeDocsInput(raw: unknown): DayDoc[] | null {
  if (!Array.isArray(raw)) return null;
  const docs: DayDoc[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const d = item as Record<string, unknown>;
    const url = typeof d.url === "string" ? d.url.trim() : "";
    if (!/^https?:\/\//i.test(url)) continue;
    const kind =
      typeof d.kind === "string" && d.kind.trim()
        ? d.kind.trim().toLowerCase().slice(0, 8)
        : kindFromUrl(url);
    docs.push({
      url,
      label:
        typeof d.label === "string" && d.label.trim()
          ? d.label.trim().slice(0, 140)
          : url.split("/").pop() || "Document",
      kind,
    });
    if (docs.length >= 12) break;
  }
  return docs.length > 0 ? docs : null;
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
