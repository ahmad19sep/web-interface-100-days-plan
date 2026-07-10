import { TOTAL_DAYS } from "@/lib/plan";
import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { currentProfile } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json();
    const day = Number(body?.day);
    const text = String(body?.text ?? "");
    if (!Number.isInteger(day) || day < 1 || day > TOTAL_DAYS) {
      return NextResponse.json({ error: "Invalid day." }, { status: 400 });
    }

    if (text.trim() === "") {
      await query("delete from notes where profile_id = $1 and day = $2", [
        profile.id,
        day,
      ]);
    } else {
      await query(
        `insert into notes (profile_id, day, text) values ($1, $2, $3)
         on conflict (profile_id, day) do update set text = excluded.text`,
        [profile.id, day, text]
      );
    }

    const rows = await query<{ day: number; text: string }>(
      "select day, text from notes where profile_id = $1",
      [profile.id]
    );
    const notes: Record<number, string> = {};
    for (const r of rows) notes[r.day] = r.text;
    return NextResponse.json({ notes });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
