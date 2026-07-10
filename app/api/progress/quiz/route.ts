import { TOTAL_DAYS } from "@/lib/plan";
import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { effectiveQuizForDay } from "@/lib/day-content";
import { currentProfile } from "@/lib/session";

interface AnswerInput {
  questionIndex: number;
  selectedIndex: number;
}

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json();
    const day = Number(body?.day);
    const answers = body?.answers as AnswerInput[] | undefined;
    if (!Number.isInteger(day) || day < 1 || day > TOTAL_DAYS || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const quiz = await effectiveQuizForDay(day);
    if (!quiz || quiz.length === 0) {
      return NextResponse.json({ error: "This day has no quiz." }, { status: 400 });
    }

    for (const a of answers) {
      const qIndex = Number(a?.questionIndex);
      const selected = Number(a?.selectedIndex);
      if (
        !Number.isInteger(qIndex) ||
        qIndex < 0 ||
        qIndex >= quiz.length ||
        !Number.isInteger(selected) ||
        selected < 0 ||
        selected >= quiz[qIndex].options.length
      ) {
        return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
      }
      await query(
        `insert into quiz_answers (profile_id, day, question_index, selected_index)
         values ($1, $2, $3, $4)
         on conflict (profile_id, day, question_index)
         do update set selected_index = excluded.selected_index, answered_at = now()`,
        [profile.id, day, qIndex, selected]
      );
    }

    const rows = await query<{ question_index: number; selected_index: number }>(
      "select question_index, selected_index from quiz_answers where profile_id = $1 and day = $2",
      [profile.id, day]
    );
    const selectedByQuestion: Record<number, number> = {};
    for (const r of rows) selectedByQuestion[r.question_index] = r.selected_index;

    let correct = 0;
    for (const [qIndexStr, sel] of Object.entries(selectedByQuestion)) {
      if (quiz[Number(qIndexStr)]?.correctIndex === sel) correct++;
    }

    return NextResponse.json({
      day,
      selected: selectedByQuestion,
      correct,
      total: quiz.length,
    });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
