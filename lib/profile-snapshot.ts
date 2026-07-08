// Server-only: shapes the JSON payload sent to the client after
// signup/login/me — profile fields + checkins/notes maps (day → value),
// matching the client's ProgressState shape 1:1.

import { query } from "./db";
import type { SessionProfile } from "./session";

export interface ProfileSnapshot {
  profile: {
    id: string;
    handle: string;
    name: string;
    github: string;
    reminder: "morning" | "evening" | "none";
    visibility: "public" | "private";
    notesPrivate: boolean;
    startDate: string | null;
    joined: string;
    onboarded: boolean;
    isOwner: boolean;
  };
  checkins: Record<number, string>;
  notes: Record<number, string>;
  /** day → questionIndex → selectedIndex */
  quizAnswers: Record<number, Record<number, number>>;
}

export async function profileSnapshot(
  p: SessionProfile
): Promise<ProfileSnapshot> {
  const [checkinRows, noteRows, quizRows] = await Promise.all([
    query<{ day: number; checked_on: string }>(
      "select day, checked_on::text as checked_on from checkins where profile_id = $1",
      [p.id]
    ),
    query<{ day: number; text: string }>(
      "select day, text from notes where profile_id = $1",
      [p.id]
    ),
    query<{ day: number; question_index: number; selected_index: number }>(
      "select day, question_index, selected_index from quiz_answers where profile_id = $1",
      [p.id]
    ),
  ]);
  const checkins: Record<number, string> = {};
  for (const r of checkinRows) checkins[r.day] = r.checked_on;
  const notes: Record<number, string> = {};
  for (const r of noteRows) notes[r.day] = r.text;
  const quizAnswers: Record<number, Record<number, number>> = {};
  for (const r of quizRows) {
    (quizAnswers[r.day] ??= {})[r.question_index] = r.selected_index;
  }

  return {
    profile: {
      id: p.id,
      handle: p.handle,
      name: p.name,
      github: p.github,
      reminder: p.reminder,
      visibility: p.visibility,
      notesPrivate: p.notes_private,
      startDate: p.start_date,
      joined: p.joined,
      onboarded: p.onboarded,
      isOwner: p.is_owner,
    },
    checkins,
    notes,
    quizAnswers,
  };
}
