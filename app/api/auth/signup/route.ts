import { NextResponse } from "next/server";
import { HANDLE_RE, MIN_CODE_LENGTH, hashCode, normalizeHandle } from "@/lib/auth-hash";
import { DbNotConfiguredError, query } from "@/lib/db";
import { profileSnapshot } from "@/lib/profile-snapshot";
import { createSession, type SessionProfile } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const handle = normalizeHandle(String(body?.handle ?? ""));
    const name = String(body?.name ?? "").trim();
    const code = String(body?.code ?? "");

    if (!HANDLE_RE.test(handle)) {
      return NextResponse.json(
        { error: "Username must be 3-24 characters: letters, numbers, - or _." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Add a display name." }, { status: 400 });
    }
    if (code.length < MIN_CODE_LENGTH) {
      return NextResponse.json(
        { error: `Your code needs at least ${MIN_CODE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const { salt, hash } = hashCode(code);
    let rows: SessionProfile[];
    try {
      rows = await query<SessionProfile>(
        `insert into profiles (handle, name, salt, code_hash)
         values ($1, $2, $3, $4)
         returning id, handle, name, github, reminder, visibility,
                   notes_private, start_date::text as start_date,
                   joined::text as joined, onboarded, is_owner`,
        [handle, name, salt, hash]
      );
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code?: string }).code === "23505"
      ) {
        return NextResponse.json(
          { error: "That username is taken — try another." },
          { status: 409 }
        );
      }
      throw err;
    }

    const profile = rows[0];
    await createSession(profile.id);
    return NextResponse.json(await profileSnapshot(profile));
  } catch (err) {
    if (err instanceof DbNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    throw err;
  }
}
