import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { currentDay } from "@/lib/progress";
import { currentProfile } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json();
    const day = Number(body?.day);
    if (!Number.isInteger(day) || day < 1 || day > 100) {
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
