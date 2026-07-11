// Owner-only account deletion. Deleting a profile cascades through every
// child table (checkins, notes, sessions, quiz_answers, day_progress — all
// FK ON DELETE CASCADE), so the account and its data disappear together.
// Owner accounts can never be deleted from here — that includes yourself.

import { NextResponse } from "next/server";
import { DbNotConfiguredError, query } from "@/lib/db";
import { currentProfile } from "@/lib/session";

export async function DELETE(request: Request) {
  try {
    const me = await currentProfile();
    if (!me || !me.is_owner) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const handle = String(body?.handle ?? "").toLowerCase();
    if (!handle) {
      return NextResponse.json({ error: "Missing handle." }, { status: 400 });
    }

    const rows = await query<{ id: string; is_owner: boolean }>(
      "select id, is_owner from profiles where handle = $1",
      [handle]
    );
    const target = rows[0];
    if (!target) {
      return NextResponse.json({ error: "No such account." }, { status: 404 });
    }
    if (target.is_owner) {
      return NextResponse.json(
        { error: "Owner accounts can't be deleted from here." },
        { status: 400 }
      );
    }

    await query("delete from profiles where id = $1", [target.id]);
    return NextResponse.json({ ok: true, handle });
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
