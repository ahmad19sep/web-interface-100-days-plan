import { TOTAL_DAYS } from "@/lib/plan";
import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { effectiveQuizForDay } from "@/lib/day-content";
import { currentDay } from "@/lib/progress";
import { currentProfile } from "@/lib/session";

const QUIZ_PASS_FRACTION = 0.6;

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json();
    const day = Number(body?.day);
    if (!Number.isInteger(day) || day < 1 || day > TOTAL_DAYS) {
      return NextResponse.json({ error: "Invalid day." }, { status: 400 });
    }

    const existing = await query<{ day: number }>(
      "select day from checkins where profile_id = $1 and day = $2",
      [profile.id, day]
    );
    if (existing.length > 0) {
      await query("delete from checkins where profile_id = $1 and day = $2", [
        profile.id,
        day,
      ]);
    } else {
      const priorRows = await query<{ day: number }>(
        "select day from checkins where profile_id = $1",
        [profile.id]
      );
      const priorCheckins: Record<number, string> = {};
      for (const r of priorRows) priorCheckins[r.day] = "1";
      const firstIncomplete = currentDay(priorCheckins);
      if (day > firstIncomplete) {
        return NextResponse.json(
          { error: `Complete day ${firstIncomplete} first.` },
          { status: 400 }
        );
      }
      // The gate is server-enforced: when the day has a quiz, the stored
      // answers must actually pass it — the frontend cannot skip this by
      // flipping local state.
      const quiz = await effectiveQuizForDay(day);
      if (quiz && quiz.length > 0) {
        const answerRows = await query<{
          question_index: number;
          selected_index: number;
        }>(
          "select question_index, selected_index from quiz_answers where profile_id = $1 and day = $2",
          [profile.id, day]
        );
        const selected = new Map(
          answerRows.map((r) => [r.question_index, r.selected_index])
        );
        const correct = quiz.filter(
          (q, i) => selected.get(i) === q.correctIndex
        ).length;
        if (correct / quiz.length < QUIZ_PASS_FRACTION) {
          return NextResponse.json(
            {
              error: `Pass the Day ${day} quiz (${Math.round(QUIZ_PASS_FRACTION * 100)}%) before checking in.`,
            },
            { status: 400 }
          );
        }
      }
      await query(
        "insert into checkins (profile_id, day, checked_on) values ($1, $2, current_date)",
        [profile.id, day]
      );
    }

    const rows = await query<{ day: number; checked_on: string }>(
      "select day, checked_on::text as checked_on from checkins where profile_id = $1",
      [profile.id]
    );
    const checkins: Record<number, string> = {};
    for (const r of rows) checkins[r.day] = r.checked_on;
    return NextResponse.json({ checkins });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
