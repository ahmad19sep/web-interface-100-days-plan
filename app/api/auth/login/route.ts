import { NextResponse } from "next/server";
import { normalizeHandle, verifyCode } from "@/lib/auth-hash";
import { DbNotConfiguredError, ensureAvatarColumn, query } from "@/lib/db";
import { profileSnapshot } from "@/lib/profile-snapshot";
import { createSession, type SessionProfile } from "@/lib/session";

type ProfileRow = SessionProfile & { salt: string; code_hash: string };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handle = normalizeHandle(String(body?.handle ?? ""));
    const code = String(body?.code ?? "");

    await ensureAvatarColumn();
    const rows = await query<ProfileRow>(
      `select id, handle, name, avatar, github, reminder, visibility, notes_private,
              start_date::text as start_date, joined::text as joined,
              onboarded, is_owner, salt, code_hash
       from profiles where handle = $1`,
      [handle]
    );
    const profile = rows[0];
    if (!profile || !verifyCode(code, profile.salt, profile.code_hash)) {
      return NextResponse.json(
        { error: "Wrong name or code." },
        { status: 401 }
      );
    }

    await createSession(profile.id);
    return NextResponse.json(await profileSnapshot(profile));
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
