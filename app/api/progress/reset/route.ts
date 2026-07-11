// Reset YOUR OWN track back to Day 1. Self-only: the session decides whose
// data is cleared, so this endpoint can never touch another account.
//
// Cleared: check-ins (XP/streak/level all derive from these), quiz answers,
// and workspace progress. Kept: your account, your avatar, and your private
// day notes — resetting the track shouldn't burn your writing.

import { NextResponse } from "next/server";
import { DbNotConfiguredError, ensureDayProgressTable, query } from "@/lib/db";
import { currentProfile } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile)
      return NextResponse.json({ error: "Not logged in." }, { status: 401 });

    const body = await request.json().catch(() => null);
    // typed confirmation, so a stray click can never wipe a track
    if (body?.confirm !== "RESET") {
      return NextResponse.json(
        { error: "Reset not confirmed." },
        { status: 400 }
      );
    }

    await ensureDayProgressTable();
    await query("delete from checkins where profile_id = $1", [profile.id]);
    await query("delete from quiz_answers where profile_id = $1", [profile.id]);
    await query("delete from day_progress where profile_id = $1", [profile.id]);
    // Day 1 is today again
    await query("update profiles set start_date = current_date where id = $1", [
      profile.id,
    ]);

    return NextResponse.json({ ok: true, checkins: {}, quizAnswers: {} });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
